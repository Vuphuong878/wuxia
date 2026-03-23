import { GameResponse } from '../types';
import type { ApiConfig, ActiveApiConfig, ApiProviderType } from '../types';
import { parseJsonWithRepair } from '../utils/jsonRepair';
import { WORLD_GENERATION_SYSTEM_PROMPT, constructWorldviewUserPrompt } from '../prompts/runtime/worldGeneration';
import { DEFAULT_COT_PROMPT } from '../prompts/runtime/defaults';
import { TextGenService } from './textGenService';
import { DEFAULT_TEXT_GEN_WORKER_URLS } from '../utils/apiConfig';


type UniversalMessageRole = 'system' | 'user' | 'assistant';

type GeneralMessage = {
    role: UniversalMessageRole;
    content: string;
};

type RequestProtocolType = 'openai' | 'gemini' | 'claude' | 'deepseek';

interface StoryStreamOptions {
    stream?: boolean;
    onDelta?: (delta: string, accumulated: string) => void;
}

interface StoryRequestOptions {
    enableCotInjection?: boolean;
    cotPseudoHistoryPrompt?: string;
    leadingSystemPrompt?: string;
    styleAssistantPrompt?: string;
    outputProtocolPrompt?: string;
    lengthRequirementPrompt?: string;
    disclaimerRequirementPrompt?: string;
    errorDetailLimit?: number;
    enableClaudeMode?: boolean;
    enableTagIntegrityCheck?: boolean;
}

export interface ConnectionTestResult {
    ok: boolean;
    detail: string;
}

export interface StoryResponseResult {
    response: GameResponse;
    rawText: string;
}

export class StoryResponseParseError extends Error {
    rawText: string;
    parseDetail?: string;

    constructor(message: string, rawText: string, parseDetail?: string) {
        super(message);
        this.name = 'StoryResponseParseError';
        this.rawText = rawText;
        this.parseDetail = parseDetail;
    }
}

interface WorldStreamOptions {
    stream?: boolean;
    onDelta?: (delta: string, accumulated: string) => void;
}

interface RecallStreamOptions {
    stream?: boolean;
    onDelta?: (delta: string, accumulated: string) => void;
}

type UniversalStreamingOptions = {
    stream?: boolean;
    onDelta?: (delta: string, accumulated: string) => void;
} | undefined;

class ProtocolRequestError extends Error {
    status?: number;
    detail?: string;

    constructor(message: string, status?: number, detail?: string) {
        super(message);
        this.name = 'ProtocolRequestError';
        this.status = status;
        this.detail = detail;
    }
}

const cleanTrailingSlash = (baseUrl: string): string => baseUrl.replace(/\/+$/, '');

const DEFAULT_NEMOTRON_WORKER_URL = DEFAULT_TEXT_GEN_WORKER_URLS;


const isGeminiModel = (modelRaw: string): boolean => /\bgemini\b/i.test((modelRaw || '').trim());

const isDeepSeekModel = (modelRaw: string): boolean => /\bdeepseek\b/i.test((modelRaw || '').trim());

const isDeepSeekReasoner = (modelRaw: string): boolean => {
    const model = (modelRaw || '').toLowerCase();
    return model.includes('reasoner') || /\br1\b/.test(model);
};

const detectMissingJSONModeSupport = (text: string): boolean => {
    const raw = (text || '').toLowerCase();
    return raw.includes('response_format') || raw.includes('json_object') || raw.includes('json mode') || raw.includes('schema');
};

const detectMissingStreamingSupport = (text: string): boolean => {
    const raw = (text || '').toLowerCase();
    if (raw.includes('event-stream')) return true;
    if (raw.includes('sse')) return true;
    if (!raw.includes('stream')) return false;
    return raw.includes('unsupported') || raw.includes('not support') || raw.includes('not supported') || raw.includes('invalid');
};

const detectMissingMaxTokensSupport = (text: string): boolean => {
    const raw = (text || '').toLowerCase();
    return raw.includes('max_tokens') || raw.includes('maxTokens');
};

const detectMissingMaxCompletionTokensSupport = (text: string): boolean => {
    const raw = (text || '').toLowerCase();
    return raw.includes('max_completion_tokens') || raw.includes('maxCompletionTokens');
};

const requiresMaxCompletionTokens = (text: string): boolean => {
    const raw = (text || '').toLowerCase();
    return raw.includes('max_completion_tokens')
        && (raw.includes('required') || raw.includes('must') || raw.includes('need'));
};

const includeJsonKeyword = (messages: GeneralMessage[]): boolean => {
    return messages.some(m => m.content.toLowerCase().includes('json'));
};

export const addJsonOutputConstraints = (messages: GeneralMessage[]): GeneralMessage[] => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'user') {
        lastMsg.content += `\n\n【Hệ thống: Trả lời theo đúng kịch bản văn học trong trò chơi. LUÔN LUÔN trả về JSON hợp lệ với logs, shortTerm và tavern_commands.】`;
    }

    if (lastMsg) {
        const jsonPrompt = `
[SYSTEM: JSON OUTPUT ONLY]
1. You MUST respond ONLY with a valid JSON object.
2. If you are stuck, return a minimal valid JSON story state instead of an error message.
`.trim();

        if (!lastMsg.content.toLowerCase().includes('json')) {
            lastMsg.content += `\n\n${jsonPrompt}`;
        } else {
            lastMsg.content += `\n\nIMPORTANT: ${jsonPrompt}`;
        }
    }
    return messages;
};

const checkRequestProtocol = (apiConfig: ActiveApiConfig): RequestProtocolType => {
    if (isGeminiModel(apiConfig.model)) return 'gemini';
    if (isDeepSeekModel(apiConfig.model)) return 'deepseek';
    if (apiConfig.baseUrl.includes('anthropic') || apiConfig.model.includes('claude')) return 'claude';

    // New providers mostly use OpenAI-compatible protocol
    const openAICompatibleProviders: ApiProviderType[] = [
        'mistral', 'groq', 'xai', 'perplexity', 'cohere', 'moonshot', 'openrouter',
        'huggingface', 'cloudflare', 'together', 'fireworks', 'cerebras', 'sambanova',
        'openai_compatible'
    ];
    if (openAICompatibleProviders.includes(apiConfig.provider)) {
        return 'openai';
    }

    return 'openai';
};

const standardizeModelName = (modelRaw: string): string => modelRaw.trim();


const readCustomMaxOutputToken = (apiConfig: ActiveApiConfig): number | undefined => {
    const raw = apiConfig.maxTokens;
    if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
        return Math.floor(raw);
    }
    return undefined;
};

const readCustomTemperature = (apiConfig: ActiveApiConfig): number | undefined => {
    const raw = apiConfig.temperature;
    if (typeof raw === 'number' && Number.isFinite(raw)) {
        return raw;
    }
    return undefined;
};

const restraintValueRange = (value: number, min: number, max: number): number => {
    return Math.min(max, Math.max(min, value));
};

const estimatedTextToken = (text: string): number => {
    if (!text) return 0;
    let cjkCount = 0;
    for (const ch of text) {
        const code = ch.charCodeAt(0);
        if (code >= 0x4e00 && code <= 0x9fff) cjkCount += 1;
    }
    const nonCjkCount = Math.max(0, text.length - cjkCount);
    return cjkCount + Math.ceil(nonCjkCount / 4);
};

const estimatedMessageToken = (messages: GeneralMessage[]): number => {
    const overheadPerMessage = 8;
    return messages.reduce((sum, msg) => sum + overheadPerMessage + estimatedTextToken(msg.content || ''), 0);
};

const modelNameContainsAnySegment = (model: string, fragments: string[]): boolean => {
    return fragments.some(fragment => model.includes(fragment));
};

const looksLikeOpenAIReasoningModel = (modelRaw: string): boolean => {
    const model = standardizeModelName(modelRaw);
    return model.startsWith('o1') || model.startsWith('o3') || model.startsWith('o4');
};

const inferGeminiContextWindow = (_modelRaw: string): number => {
    return 1_048_576;
};

const inferClaudeContextWindow = (_modelRaw: string): number => {
    return 200_000;
};

const inferDeepSeekContextWindow = (modelRaw: string): number => {
    const model = standardizeModelName(modelRaw);
    if (!model) return 128_000;

    if (model === 'deepseek-chat' || model === 'deepseek-reasoner') return 128_000;
    if (modelNameContainsAnySegment(model, ['v3.2', 'r1-0528'])) return 128_000;

    if (modelNameContainsAnySegment(model, ['deepseek-v3', 'v3.1', 'deepseek-r1', 'r1'])) return 64_000;
    return 128_000;
};

const inferOpenAIContextWindow = (modelRaw: string): number | null => {
    const model = standardizeModelName(modelRaw);
    if (!model) return null;
    if (model.startsWith('gpt-5')) return 400_000;
    if (model.startsWith('gpt-4.1')) return 1_047_576;
    if (model.startsWith('gpt-4o')) return 128_000;
    if (looksLikeOpenAIReasoningModel(model)) return 200_000;
    if (model.startsWith('gpt-4-turbo') || model.startsWith('gpt-4-0125') || model.startsWith('gpt-4-1106')) return 128_000;
    if (model.startsWith('gpt-4')) return 8_192;
    if (model.startsWith('gpt-3.5')) return 16_385;
    if (model.includes('nemotron') || model.includes('oss')) return 128_000;
    if (model.includes('glm')) return 131_072;
    if (model.includes('mistral') || model.includes('mixtral')) return 32_768;
    if (model.includes('llama-3.1') || model.includes('llama-3.3')) return 128_000;
    if (model.includes('llama-3')) return 8_192;
    if (model.includes('grok')) return 131_072;
    if (model.includes('sonar')) return 128_000;
    return null;
};

const inferGeminiDefaultMaxOutputToken = (modelRaw: string): number => {
    const model = standardizeModelName(modelRaw);
    if (!model) return 8_192;

    if (modelNameContainsAnySegment(model, ['2.0-flash-lite', '2.0-flash'])) return 8_192;
    if (model.includes('tts')) return 16_384;
    // Modern Gemini Pro/Flash models support large output tokens (often up to 8k or more)
    if (model.startsWith('gemini-1.5') || model.startsWith('gemini-2.0') || model.startsWith('gemini-3.')) return 8_192;
    if (modelNameContainsAnySegment(model, ['gemini-3-pro', 'gemini-3-flash', 'flash-latest', 'pro-latest'])) return 65_536;
    return 8_192;
};

const inferClaudeDefaultMaxOutputToken = (modelRaw: string): number => {
    const model = standardizeModelName(modelRaw);
    if (!model) return 8_192;

    if (modelNameContainsAnySegment(model, ['opus-4.6', 'opus-4-6'])) return 128_000;
    // Claude 3.5 Sonnet/Haiku typically support 8k output tokens
    if (modelNameContainsAnySegment(model, ['sonnet-3-5', 'sonnet-3.5', 'haiku-3-5', 'haiku-3.5'])) return 8_192;
    if (modelNameContainsAnySegment(model, ['sonnet-4', 'haiku-4', 'opus-4'])) return 64_000;
    return 4_096;
};

const inferDeepSeekDefaultMaxOutputToken = (modelRaw: string): number => {
    const model = standardizeModelName(modelRaw);
    if (!model) return 8_192;
    if (model === 'deepseek-reasoner' || isDeepSeekReasoner(model)) return 64_000;
    // DeepSeek-V3 supports 8k output tokens
    return 8_192;
};

const inferOpenAIDefaultMaxOutputToken = (modelRaw: string): number => {
    const model = standardizeModelName(modelRaw);
    if (!model) return 8_192;
    if (model.startsWith('gpt-5')) return 128_000;
    if (model.startsWith('gpt-4.1')) return 32_768;
    // GPT-4o supports 16k output tokens
    if (model.startsWith('gpt-4o')) return 16_384;
    // o1/o3 series support large completion tokens
    if (looksLikeOpenAIReasoningModel(model)) return 100_000;
    if (model.startsWith('gpt-4')) return 8_192;
    if (model.startsWith('gpt-3.5')) return 4_096;
    if (model.includes('nemotron') || model.includes('oss')) return 131_000;
    if (model.includes('glm')) return 131_072;
    return 8_192;
};

const inferContextWindow = (protocol: RequestProtocolType, modelRaw: string): number | null => {
    const model = standardizeModelName(modelRaw);
    if (protocol === 'gemini') return inferGeminiContextWindow(model);
    if (protocol === 'claude') return inferClaudeContextWindow(model);
    if (protocol === 'deepseek') return inferDeepSeekContextWindow(model);
    return inferOpenAIContextWindow(model);
};

const inferDefaultMaxOutputToken = (protocol: RequestProtocolType, modelRaw: string): number => {
    const model = standardizeModelName(modelRaw);
    if (protocol === 'gemini') return inferGeminiDefaultMaxOutputToken(model);
    if (protocol === 'claude') return inferClaudeDefaultMaxOutputToken(model);
    if (protocol === 'deepseek') return inferDeepSeekDefaultMaxOutputToken(model);
    return inferOpenAIDefaultMaxOutputToken(model);
};

const calculateMaxOutputToken = (apiConfig: ActiveApiConfig, protocol: RequestProtocolType, messages: GeneralMessage[]): number => {
    let modelCap = inferDefaultMaxOutputToken(protocol, apiConfig.model);
    if (apiConfig.provider === 'worker') {
        modelCap = 131000;
    }
    const requested = readCustomMaxOutputToken(apiConfig) ?? modelCap;
    const safeRequested = Math.min(requested, modelCap);
    return Math.max(256, safeRequested);
};

const calculateRequestTemperature = (apiConfig: ActiveApiConfig, protocol: RequestProtocolType, fallback: number): number => {
    const configured = readCustomTemperature(apiConfig);
    const base = typeof configured === 'number' ? configured : fallback;
    if (!Number.isFinite(base)) {
        return protocol === 'claude' ? 0.7 : 0.7;
    }
    if (protocol === 'claude') return restraintValueRange(base, 0, 1);
    return restraintValueRange(base, 0, 2);
};

export type IncrementalExtractor = ((payload: any) => string) & {
    finalize?: () => string;
};

const createOpenAIStreamIncrementExtractor = (): IncrementalExtractor => {
    let inReasoningPhase = false;
    const extract = ((payload: any): string => {
        const delta = payload?.choices?.[0]?.delta;
        const reasoningContent = delta?.reasoning_content ?? delta?.reasoning ?? delta?.reasoning_text;
        const hasReasoning = typeof reasoningContent === 'string' && reasoningContent.length > 0;
        const content = typeof delta?.content === 'string'
            ? delta.content
            : (typeof payload?.choices?.[0]?.message?.content === 'string' ? payload.choices[0].message.content : '');

        if (hasReasoning) {
            if (!inReasoningPhase) {
                inReasoningPhase = true;
                return `<thinking>${reasoningContent}`;
            }
            return reasoningContent;
        }

        if (typeof content === 'string' && content.length > 0) {
            if (inReasoningPhase) {
                inReasoningPhase = false;
                return `</thinking>${content}`;
            }
            return content;
        }

        return '';
    }) as IncrementalExtractor;

    extract.finalize = () => {
        if (!inReasoningPhase) return '';
        inReasoningPhase = false;
        return '</thinking>';
    };

    return extract;
};

const extractOpenAIFullText = (payload: any): string => {
    const content = payload?.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content : '';
};

const extractGeminiText = (payload: any): string => {
    const parts = payload?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return '';
    return parts
        .map((part: any) => {
            if (typeof part?.text === 'string') return part.text;
            return '';
        })
        .filter(Boolean)
        .join('');
};

const extractClaudeText = (payload: any): string => {
    const blocks = payload?.content;
    if (!Array.isArray(blocks)) return '';
    return blocks
        .map((item: any) => (item?.type === 'text' && typeof item?.text === 'string' ? item.text : ''))
        .filter(Boolean)
        .join('');
};

const extractClaudeStreamIncrementalText = (payload: any): string => {
    if (payload?.type !== 'content_block_delta') return '';
    const delta = payload?.delta;
    if (delta?.type !== 'text_delta') return '';
    return typeof delta?.text === 'string' ? delta.text : '';
};

const readFailureDetailText = async (response: Response, maxLen = 600): Promise<string> => {
    try {
        const text = (await response.text()).trim();
        if (!text) return '';
        if (!Number.isFinite(maxLen) || maxLen < 0) return text;
        return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
    } catch {
        return '';
    }
};

const analyzeSseText = async (
    response: Response,
    extractDelta: IncrementalExtractor,
    onDelta?: (delta: string, accumulated: string) => void,
    emptyBodyError = 'Stream body is empty'
): Promise<string> => {
    if (!response.body) throw new Error(emptyBodyError);

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let rawBuffer = '';
    let accumulated = '';
    let rawStreamText = '';
    let sawSseFrame = false;
    let doneSignal = false;
    let pendingJsonPayload = '';

    const emitDelta = (delta: string) => {
        if (!delta) return;
        accumulated += delta;
        onDelta?.(delta, accumulated);
    };

    const attemptingToParseJsonAndExtract = (payloadText: string): boolean => {
        const payload = payloadText.trim();
        if (!payload) return true;

        try {
            const json = JSON.parse(payload);
            emitDelta(extractDelta(json));
            return true;
        } catch {
            // Non JSON Data：If like normal text stream，Output directly as increment
            if (!payload.startsWith('{') && !payload.startsWith('[')) {
                emitDelta(payload);
                return true;
            }
            return false;
        }
    };

    const processEventBlock = (eventBlock: string) => {
        if (!eventBlock.trim()) return;
        const lines = eventBlock.split(/\r?\n/);
        const dataLines: string[] = [];

        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;
            if (line.startsWith(':')) continue;
            if (!line.startsWith('data:')) continue;
            sawSseFrame = true;
            dataLines.push(line.slice(5).trim());
        }

        if (dataLines.length === 0) return;
        const payload = dataLines.join('\n').trim();
        if (!payload) return;
        if (payload === '[DONE]') {
            doneSignal = true;
            return;
        }

        const joinedPayload = pendingJsonPayload
            ? `${pendingJsonPayload}${payload}`
            : payload;
        if (attemptingToParseJsonAndExtract(joinedPayload)) {
            pendingJsonPayload = '';
            return;
        }
        pendingJsonPayload = joinedPayload;
    };

    const refreshEventBuffer = (flushAll: boolean) => {
        const normalized = rawBuffer.replace(/\r\n/g, '\n');
        const blocks = normalized.split('\n\n');
        let tail = '';
        if (!flushAll) {
            rawBuffer = blocks.pop() || '';
        } else {
            tail = blocks.pop() || '';
            rawBuffer = '';
        }
        for (const block of blocks) {
            processEventBlock(block);
            if (doneSignal) break;
        }
        if (flushAll && tail.trim()) {
            processEventBlock(tail);
        }
    };

    try {
        while (!doneSignal) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunkText = decoder.decode(value, { stream: true });
            rawStreamText += chunkText;
            rawBuffer += chunkText;
            refreshEventBuffer(false);
        }

        const tail = decoder.decode();
        if (tail) {
            rawStreamText += tail;
            rawBuffer += tail;
        }
        refreshEventBuffer(true);

        if (pendingJsonPayload) {
            attemptingToParseJsonAndExtract(pendingJsonPayload);
            pendingJsonPayload = '';
        }

        if (typeof extractDelta.finalize === 'function') {
            const tailDelta = extractDelta.finalize();
            emitDelta(tailDelta);
        }
    } finally {
        try {
            reader.releaseLock();
        } catch {
            // ignore release errors
        }
    }

    if (!sawSseFrame) {
        const plainPayload = rawStreamText.trim();
        if (plainPayload) {
            emitDelta(plainPayload);
        }
    }

    return accumulated.trim();
};

const nonStreamingFillStreamingCallback = (text: string, streamOptions?: UniversalStreamingOptions) => {
    if (!streamOptions?.stream || !streamOptions?.onDelta || !text) return;
    streamOptions.onDelta(text, text);
};

const parsingMightBeJsonString = (text: string): any | null => {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

const escapeRegexFragment = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const extractTagContentList = (
    text: string,
    tag: string,
    options?: { fixTagClosingErrors?: boolean }
): string[] => {
    if (!text || !tag) return [];
    const escapedTag = escapeRegexFragment(tag);

    // Support standard </tag>, or broken tags <tag> if fixTagClosingErrors enabled, 
    // or end of string / start of next tag as a boundary.
    const closeTag = options?.fixTagClosingErrors
        ? `(?:</${escapedTag}>|<${escapedTag}>|$)` // Treat start tag or EOF as closing if needed
        : `</${escapedTag}>`;

    // Regex 1: Standard match with closing tag
    // Requirement: Tag should ideally be at the start of string or after a newline to avoid matching mentions in text
    const regexStandard = new RegExp(`(?:^|\\n)\\s*<${escapedTag}>\\s*([\\s\\S]*?)\\s*${closeTag}`, 'gi');
    const list: string[] = [];
    let match: RegExpExecArray | null = null;

    while ((match = regexStandard.exec(text)) !== null) {
        const payload = (match[1] || '').trim();
        if (payload) list.push(payload);
    }

    // Regex 2: Greedy match for unclosed tag at the end (useful for truncated responses)
    if (list.length === 0) {
        // Fallback for truncated/unclosed tags AT THE END of the response
        // Only if it's the last thing in the text or followed by nothing but whitespace
        // We use a lookahead to ensure we don't swallow a SUBSEQUENT tag start (any tag)
        const unclosedTagRegex = new RegExp(`(?:^|\\n)\\s*<${escapedTag}>\\s*([\\s\\S]*?)(?=\\n\\s*<|$)`, 'i');
        const unclosedMatch = text.match(unclosedTagRegex);
        if (unclosedMatch) {
            const payload = (unclosedMatch[1] || '').trim();
            if (payload) list.push(payload);
        }
    }

    // Fallback: If still nothing found, try a less strict match as a last resort (might match mentions, but better than nothing)
    if (list.length === 0) {
        const regexStrictLineOnly = new RegExp(`<${escapedTag}>\\s*([\\s\\S]*?)\\s*${closeTag}`, 'gi');
        while ((match = regexStrictLineOnly.exec(text)) !== null) {
            const payload = (match[1] || '').trim();
            if (payload) list.push(payload);
        }
    }

    return list;
};

const extractFirstTagContent = (
    text: string,
    tag: string,
    options?: { fixTagClosingErrors?: boolean }
): string => {
    const list = extractTagContentList(text, tag, options);
    return list[0] || '';
};

const standardizedLogSender = (senderRaw: string): string => {
    const sender = (senderRaw || '').trim();
    if (!sender) return 'Narrator';
    if (sender === 'Judgment' || sender === '【Judgment】') return '【Judgment】';
    return sender;
};

const parsingBodyLog = (body: string): Array<{ sender: string; text: string }> => {
    if (!body || !body.trim()) return [];
    const lines = body.replace(/\r\n/g, '\n').split('\n');
    const logs: Array<{ sender: string; text: string }> = [];
    let current: { sender: string; text: string } | null = null;

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const match = line.match(/^【\s*([^】]+?)\s*】\s*(.*)$/);
        if (match) {
            const sender = standardizedLogSender(match[1]);
            const text = (match[2] || '').trim();
            current = { sender, text };
            logs.push(current);
            continue;
        }

        if (current) {
            current.text = `${current.text}\n${line}`.trim();
            continue;
        }

        current = { sender: 'Narrator', text: line };
        logs.push(current);
    }

    return logs.filter(item => item.text.trim().length > 0);
};

const parseCommandValue = (rawValue: string | undefined): any => {
    const text = (rawValue || '').trim();
    if (!text) return null;

    if (
        (text.startsWith('"') && text.endsWith('"'))
        || (text.startsWith("'") && text.endsWith("'"))
    ) {
        return text.slice(1, -1);
    }

    if (/^(true|false)$/i.test(text)) {
        return text.toLowerCase() === 'true';
    }
    if (/^null$/i.test(text)) {
        return null;
    }
    if (/^[+\-]?\d+(?:\.\d+)?$/.test(text)) {
        const num = Number(text);
        if (Number.isFinite(num)) return num;
    }

    const parsed = parseJsonWithRepair<any>(text);
    if (parsed.value !== null) return parsed.value;
    return text;
};

export const standardizedCommandObject = (raw: any): { action: 'add' | 'set' | 'push' | 'delete' | 'sub'; key: string; value: any } | null => {
    if (!raw || typeof raw !== 'object') return null;
    const actionRaw = typeof raw.action === 'string' ? raw.action.trim().toLowerCase() : '';
    if (actionRaw !== 'add' && actionRaw !== 'set' && actionRaw !== 'push' && actionRaw !== 'delete' && actionRaw !== 'sub') {
        return null;
    }
    const key = typeof raw.key === 'string' ? raw.key.trim() : '';
    if (!key) return null;
    const value = raw.value === undefined ? null : raw.value;
    return {
        action: actionRaw,
        key,
        value
    };
};

export const parseCommandBlock = (commandBlock: string): Array<{ action: 'add' | 'set' | 'push' | 'delete' | 'sub'; key: string; value: any }> => {
    const text = (commandBlock || '').trim();
    if (!text) return [];
    if (text === 'None' || text.toLowerCase() === 'none') return [];

    const parsed = parseJsonWithRepair<any>(text);
    if (parsed.value !== null) {
        if (Array.isArray(parsed.value)) {
            return parsed.value
                .map(standardizedCommandObject)
                .filter((item): item is { action: 'add' | 'set' | 'push' | 'delete' | 'sub'; key: string; value: any } => Boolean(item));
        }
        if (parsed.value && Array.isArray(parsed.value.tavern_commands)) {
            return parsed.value.tavern_commands
                .map(standardizedCommandObject)
                .filter((item): item is { action: 'add' | 'set' | 'push' | 'delete' | 'sub'; key: string; value: any } => Boolean(item));
        }
    }

    const lines = text
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .filter(line => !line.startsWith('```'));
    const commands: Array<{ action: 'add' | 'set' | 'push' | 'delete' | 'sub'; key: string; value: any }> = [];

    for (const line of lines) {
        const normalized = line.replace(/^[\-*]\s+/, '').trim();

        // Use a regex that supports spaces in keys when followed by '='
        // Group 1: action, Group 2: key (can contain spaces if followed by '='), Group 3: value
        const eqMatch = normalized.match(/^(add|set|push|delete)\s+([^=]+?)\s*=\s*([\s\S]*)$/i);

        if (eqMatch) {
            const action = eqMatch[1].toLowerCase() as 'add' | 'set' | 'push' | 'delete' | 'sub';
            const key = eqMatch[2].trim();
            const value = parseCommandValue(eqMatch[3]);
            if (key) {
                commands.push({ action, key, value });
                continue;
            }
        }

        // Fallback for delete without '='
        if (normalized.toLowerCase().startsWith('delete ')) {
            const key = normalized.substring(7).trim();
            if (key) {
                commands.push({ action: 'delete', key, value: null });
                continue;
            }
        }

        // Fallback for old format: add|set|push key value
        // Support spaces in gameState keys if followed by a value-start character ({, [, digit, or quote)
        const legacyMatch = normalized.match(/^(add|set|push|sub)\s+(gameState\.(?:[^\s]|\s+(?![{\[\d"']))+)\s+([\s\S]+)$/i);
        if (legacyMatch) {
            const [_, action, key, rawValue] = legacyMatch;
            const actionType = action.toLowerCase() as 'add' | 'set' | 'push' | 'delete' | 'sub';
            const value = parseJsonWithRepair<any>(rawValue).value ?? parseCommandValue(rawValue);
            if (key) {
                commands.push({ action: actionType, key: key.trim(), value });
                continue;
            }
        }
    }

    return commands;
};

const parsingActionOptionsBlock = (optionsBlock: string): string[] => {
    const text = (optionsBlock || '').trim();
    if (!text) return [];
    return text
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean);
};

const parseTagProtocolResponse = (content: string): GameResponse | null => {
    const text = (content || '').trim();
    if (!text) return null;

    const thinkingParts = [
        ...extractTagContentList(text, 'thinking'),
        ...extractTagContentList(text, 'thinking_pre'),
        ...extractTagContentList(text, 't_thinking'),
        ...extractTagContentList(text, 'Suy nghĩ')
    ];
    const bodyBlock = extractFirstTagContent(text, 'Main Body')
        || extractFirstTagContent(text, 'Nội dung chính')
        || extractFirstTagContent(text, 'Narrative')
        || extractFirstTagContent(text, 'Truyện')
        || extractFirstTagContent(text, 'Lời dẫn');

    const shortTerm = extractFirstTagContent(text, 'Short-term memory', { fixTagClosingErrors: true })
        || extractFirstTagContent(text, 'Trí nhớ ngắn hạn', { fixTagClosingErrors: true })
        || extractFirstTagContent(text, 'Ghi nhớ ngắn hạn', { fixTagClosingErrors: true })
        || extractFirstTagContent(text, 'Memory', { fixTagClosingErrors: true });

    const commandBlock = extractFirstTagContent(text, 'Command')
        || extractFirstTagContent(text, 'Lệnh')
        || extractFirstTagContent(text, 'Commands');

    const actionOptionsBlock = extractFirstTagContent(text, 'Action options')
        || extractFirstTagContent(text, 'Tùy chọn hành động')
        || extractFirstTagContent(text, 'Options')
        || extractFirstTagContent(text, 'Hành động');

    let logs = parsingBodyLog(bodyBlock || '');

    // Fallback 1: If bodyBlock is empty but text looks like it has content markers
    if (logs.length === 0) {
        const stripped = text
            .replace(/<(thinking|Command|Action options|Lệnh|Tùy chọn hành động|Short-term memory|Trí nhớ ngắn hạn|Narrative|Truyện|t_[a-z]+)[\s\S]*?(?:<\/\1>|$)/gi, '') // Remove OTHER tags (including t_ tags)
            .replace(/<[^>]+>/g, '\n'); // Remove residual tags

        if (/【[^】]+】/.test(stripped)) {
            logs = parsingBodyLog(stripped);
        } else if (stripped.trim().length > 50) {
            // Fallback 2: Raw text capture if it's long enough and not just noise
            logs = [{ sender: 'Narrator', text: stripped.trim() }];
        }
    }

    const commands = parseCommandBlock(commandBlock);
    const actionOptions = parsingActionOptionsBlock(actionOptionsBlock);
    const thinking = thinkingParts.map(item => item.trim()).filter(Boolean).join('\n\n');

    const thinkingFields: Partial<GameResponse> = {};
    COT_THINKING_FIELD_KEYS.forEach(key => {
        const content = extractFirstTagContent(text, key);
        if (content) {
            thinkingFields[key] = content;
        }
    });

    if (logs.length === 0 && actionOptions.length === 0 && commands.length === 0 && Object.keys(thinkingFields).length === 0) {
        return null;
    }

    return {
        thinking_pre: thinking ? `<thinking>${thinking}</thinking>` : undefined,
        logs: logs.length > 0 ? logs : (Object.keys(thinkingFields).length > 0 || commands.length > 0 ? [] : [{ sender: 'Narrator', text: '...' }]),
        tavern_commands: commands.length > 0 ? commands : undefined,
        ...thinkingFields,
        shortTerm: shortTerm || undefined,
        action_options: actionOptions.length > 0 ? actionOptions : undefined
    };
};

// All CoT thinking field keys used in the structured JSON response.
// Extracted as a module-level constant so it can be reused by normalization
// and by the truncation-recovery continuation prompts.
const COT_THINKING_FIELD_KEYS = [
    't_input',
    't_plan',
    't_state',
    't_branch',
    't_precheck',
    't_logcheck',
    't_var',
    't_npc',
    't_cmd',
    't_audit',
    't_fix',
    't_mem',
    't_opts'
] as const;

const normalizationJsonStructureResponse = (raw: any): GameResponse => {
    // Handle logs as string (AI sometimes returns a plain string instead of array)
    let rawLogs: any[] = [];
    if (Array.isArray(raw?.logs)) {
        rawLogs = raw.logs;
    } else if (typeof raw?.logs === 'string' && raw.logs.trim().length > 0) {
        rawLogs = [raw.logs];
    }
    const logs = rawLogs
        .map((item: any) => {
            if (typeof item === 'string') {
                return { sender: 'Narrator', text: item };
            }
            if (item && typeof item === 'object') {
                return {
                    sender: typeof item.sender === 'string' ? item.sender : 'Narrator',
                    text: typeof item.text === 'string' ? item.text : String(item.text ?? '')
                };
            }
            return null;
        })
        .filter((item: any) => item && item.text.trim().length > 0);

    const thinkingFieldKeys = COT_THINKING_FIELD_KEYS;
    const normalizedThinkingFields = Object.fromEntries(
        thinkingFieldKeys
            .filter((key) => typeof raw?.[key] === 'string' && raw[key].trim().length > 0)
            .map((key) => [key, raw[key]])
    ) as Partial<GameResponse>;

    return {
        thinking_pre: typeof raw?.thinking_pre === 'string' ? raw.thinking_pre : undefined,
        logs,
        ...normalizedThinkingFields,
        thinking_post: typeof raw?.thinking_post === 'string' ? raw.thinking_post : undefined,
        tavern_commands: Array.isArray(raw?.tavern_commands)
            ? raw.tavern_commands.flatMap(item => {
                if (typeof item === 'string') return parseCommandBlock(item);
                const std = standardizedCommandObject(item);
                return std ? [std] : [];
            })
            : undefined,
        shortTerm: typeof raw?.shortTerm === 'string' ? raw.shortTerm : undefined,
        story: raw?.story && typeof raw.story === 'object' ? {
            narrative: typeof raw.story.narrative === 'string' ? raw.story.narrative : ''
        } : undefined,
        action_options: Array.isArray(raw?.action_options)
            ? raw.action_options
                .map((item: any) => {
                    if (typeof item === 'string') return item.trim();
                    if (typeof item === 'number' || typeof item === 'boolean') return String(item);
                    if (item && typeof item === 'object') {
                        const candidate = item.text ?? item.label ?? item.action ?? item.name ?? item.id;
                        if (typeof candidate === 'string') return candidate.trim();
                    }
                    return '';
                })
                .filter((item: string) => item.trim().length > 0)
            : undefined
    };
};

export const parseStoryRawText = (content: string): GameResponse => {
    // Primary: try JSON parsing (forced JSON mode)
    const parsed = parseJsonWithRepair<any>(content);
    if (parsed.value && typeof parsed.value === 'object') {
        const normalized = normalizationJsonStructureResponse(parsed.value);
        const hasRenderableLogs = normalized.logs.some((log) => (
            typeof log?.text === 'string' && log.text.trim().length > 0
        ));

        const hasThinking = Object.keys(normalized).some((key) => {
            const isThinkingField = key.startsWith('t_') || key === 'thinking_pre' || key === 'thinking_post';
            return isThinkingField && typeof (normalized as any)[key] === 'string' && (normalized as any)[key].trim().length > 0;
        }) || (typeof parsed.value.thinking === 'string' && parsed.value.thinking.trim().length > 0);

        const isLikelyValidJsonResponse = hasRenderableLogs || hasThinking;

        if (isLikelyValidJsonResponse) {
            return normalized;
        }

        // Handle wrapped response format: {"response": "..."} or {"response": {...}}
        if (parsed.value.response) {
            if (typeof parsed.value.response === 'string' && parsed.value.response.trim().length > 0) {
                // If it looks like it contains tags, strip them or parse them
                const innerResult = parseTagProtocolResponse(parsed.value.response);
                if (innerResult) return innerResult;

                // If tag parsing fails, return as a narrator log
                return {
                    ...normalized,
                    logs: [{ sender: 'Narrator', text: parsed.value.response.replace(/<[^>]+>/g, '').trim() }]
                };
            }
            if (typeof parsed.value.response === 'object') {
                const innerNormalized = normalizationJsonStructureResponse(parsed.value.response);
                if (innerNormalized.logs.length > 0 || Object.keys(innerNormalized).some(k => k.startsWith('t_'))) {
                    return innerNormalized;
                }
            }
        }

        // ONLY throw truncation error if we are reasonably sure context was MEANT to be JSON
        // but was cut off.
        const trimmedContent = content.trim();
        const isJsonIntent = trimmedContent.startsWith('{') || (trimmedContent.startsWith('```') && trimmedContent.includes('json'));

        if (isJsonIntent) {
            const strippedContent = trimmedContent.endsWith('```') ? trimmedContent.slice(0, -3).trim() : trimmedContent;
            const isLikelyCutoff = strippedContent.endsWith('...') ||
                (!strippedContent.endsWith('}') && !strippedContent.endsWith(']>'));

            if (isLikelyCutoff) {
                // If we have SOME content already, don't throw, just return it
                if (hasRenderableLogs) return normalized;

                const detail = hasThinking
                    ? 'JSON response missing valid logs content（Suspected response truncation）'
                    : parsed.error || 'Response appears to be cut off mid-way.';

                throw new StoryResponseParseError(
                    'Nội dung có vẻ bị cắt ngang giữa chừng（Suspected response truncation）',
                    content,
                    detail
                );
            }
        }
    }

    // Fallback: try tag protocol for backward compatibility
    const tagged = parseTagProtocolResponse(content);
    if (tagged && tagged.logs.some(log => typeof log?.text === 'string' && log.text.trim().length > 0)) {
        return tagged;
    }

    // Final fallback: if content has meaningful text (e.g. AI refusal, plain narrative),
    // return it as a narrator log instead of throwing an error.
    const plainText = content.replace(/<[^>]+>/g, '').trim();
    if (plainText.length > 0) {
        return {
            logs: [{ sender: 'Narrator', text: plainText }],
            tavern_commands: undefined,
            shortTerm: undefined,
            action_options: undefined
        };
    }

    const detail = parsed.error || 'Returned content structure is incomplete（Cannot parse as JSON or tag protocol）';
    throw new StoryResponseParseError(detail, content, detail);
};

const buildOpenAICandidateEndpoints = (baseUrlRaw: string): string[] => {
    const base = cleanTrailingSlash(baseUrlRaw || '');
    if (!base) return [];
    const withoutEndpoint = base
        .replace(/\/v1\/chat\/completions$/i, '')
        .replace(/\/chat\/completions$/i, '');
    const withoutV1Tail = withoutEndpoint.replace(/\/v1$/i, '');
    const candidates = [
        `${withoutV1Tail}/v1/chat/completions`,
        `${withoutV1Tail}/chat/completions`,
        `${withoutEndpoint}/chat/completions`
    ].filter(Boolean);
    return Array.from(new Set(candidates));
};

const standardizeGeminiBaseAddress = (baseUrlRaw: string): string => {
    const base = cleanTrailingSlash(baseUrlRaw || '');
    const withoutOpenAIPath = base
        .replace(/\/v1beta\/openai$/i, '')
        .replace(/\/v1\/openai$/i, '')
        .replace(/\/openai\/v1$/i, '')
        .replace(/\/openai$/i, '');

    const withoutVersionTail = withoutOpenAIPath
        .replace(/\/v1beta$/i, '')
        .replace(/\/v1$/i, '');

    return withoutVersionTail || 'https://generativelanguage.googleapis.com';
};

const standardizeClaudeBaseAddress = (baseUrlRaw: string): string => {
    const base = cleanTrailingSlash(baseUrlRaw || '');
    return base
        .replace(/\/v1\/messages$/i, '')
        .replace(/\/v1$/i, '')
        || 'https://api.anthropic.com';
};

const standardizeGeminiModelName = (modelRaw: string): string => {
    return (modelRaw || '').trim().replace(/^models\//i, '');
};

const appendGeminiKeyParameter = (url: string, apiKey: string): string => {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}key=${encodeURIComponent(apiKey)}`;
};

const assembleClaudeMessage = (
    messages: GeneralMessage[],
    jsonMode: boolean
): {
    system: string;
    list: Array<{ role: 'user' | 'assistant'; content: string }>;
    prefillJsonBrace: boolean;
} => {
    const system = messages
        .filter(msg => msg.role === 'system')
        .map(msg => msg.content)
        .join('\n\n')
        .trim();

    const list = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
            content: msg.content
        }));

    if (list.length === 0 || list[0].role !== 'user') {
        list.unshift({ role: 'user', content: 'Please start。' });
    }

    let prefillJsonBrace = false;
    if (jsonMode) {
        const hasJsonHint = includeJsonKeyword(messages);
        if (!hasJsonHint) {
            list[0] = {
                ...list[0],
                content: `${list[0].content}\n\nPlease only output valid JSON Object, Do not include instructions.`
            };
        }
        list.push({ role: 'assistant', content: '{' });
        prefillJsonBrace = true;
    }

    return { system, list, prefillJsonBrace };
};

const assembleGeminiMessage = (
    messages: GeneralMessage[],
    jsonMode: boolean
): {
    systemInstruction: string;
    contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
} => {
    const systemInstruction = messages
        .filter(msg => msg.role === 'system')
        .map(msg => msg.content)
        .join('\n\n')
        .trim();

    const contents = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
            role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
            parts: [{ text: msg.content }]
        }));

    if (contents.length === 0 || contents[0].role !== 'user') {
        // Gemini Content should usually start from user Round starts，Add a start first user Round to improve compatibility
        contents.unshift({ role: 'user', parts: [{ text: 'Please start。' }] });
    }

    if (jsonMode && !includeJsonKeyword(messages)) {
        contents[0] = {
            ...contents[0],
            parts: [{ text: `${contents[0].parts?.[0]?.text || ''}\n\nPlease only output valid JSON Object, Do not include extra instructions.` }]
        };
    }

    return { systemInstruction, contents };
};

const requestOpenAIFamilyText = async (
    apiConfig: ActiveApiConfig,
    protocol: 'openai' | 'deepseek',
    messages: GeneralMessage[],
    temperature: number,
    signal?: AbortSignal,
    streamOptions?: UniversalStreamingOptions,
    responseFormatJsonObject: boolean = false,
    errorDetailLimit?: number
): Promise<string> => {
    if (apiConfig.provider !== 'worker' && !apiConfig.apiKey) throw new Error("API configuration or API Key is missing. Please check settings.");
    const endpointCandidates = buildOpenAICandidateEndpoints(apiConfig.baseUrl);
    if (endpointCandidates.length === 0) throw new Error('Missing API Base URL');
    const enableStream = !!streamOptions?.stream;

    let useStream = enableStream;
    let useResponseFormat = responseFormatJsonObject && !(protocol === 'deepseek' && isDeepSeekReasoner(apiConfig.model));
    let requestMessages = useResponseFormat ? messages : (responseFormatJsonObject ? addJsonOutputConstraints(messages) : messages);
    let endpointIndex = 0;
    let tokenFieldMode: 'max_tokens' | 'max_completion_tokens' | 'none' = 'max_tokens';

    for (let attempt = 0; attempt < 4; attempt++) {
        const endpoint = endpointCandidates[Math.min(endpointIndex, endpointCandidates.length - 1)];
        const maxOutputTokens = calculateMaxOutputToken(apiConfig, protocol, requestMessages);
        const body: Record<string, unknown> = {
            model: apiConfig.model,
            messages: requestMessages,
            temperature,
            stream: useStream
        };
        if (tokenFieldMode === 'max_tokens') {
            body.max_tokens = maxOutputTokens;
        } else if (tokenFieldMode === 'max_completion_tokens') {
            body.max_completion_tokens = maxOutputTokens;
        }
        if (useResponseFormat) {
            body.response_format = { type: 'json_object' };
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiConfig.apiKey}`
            },
            body: JSON.stringify(body),
            signal
        });

        if (!response.ok) {
            const detail = await readFailureDetailText(response, errorDetailLimit);
            if ([404, 405].includes(response.status) && endpointIndex < endpointCandidates.length - 1) {
                endpointIndex += 1;
                continue;
            }
            if (
                tokenFieldMode === 'max_tokens' &&
                (requiresMaxCompletionTokens(detail) || detectMissingMaxTokensSupport(detail))
            ) {
                tokenFieldMode = 'max_completion_tokens';
                continue;
            }
            if (tokenFieldMode === 'max_completion_tokens' && detectMissingMaxCompletionTokensSupport(detail)) {
                tokenFieldMode = 'none';
                continue;
            }
            if (useResponseFormat && detectMissingJSONModeSupport(detail)) {
                useResponseFormat = false;
                requestMessages = addJsonOutputConstraints(messages);
                continue;
            }
            if (useStream && detectMissingStreamingSupport(detail)) {
                useStream = false;
                continue;
            }
            throw new ProtocolRequestError(`API Error: ${response.status}${detail ? ` - ${detail}` : ''}`, response.status, detail);
        }

        if (!useStream) {
            const rawText = await response.text();
            const json = parsingMightBeJsonString(rawText);
            const content = json ? extractOpenAIFullText(json) : rawText;
            const finalText = (typeof content === 'string' ? content : '').trim();
            nonStreamingFillStreamingCallback(finalText, streamOptions);
            return finalText;
        }

        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        if (!contentType.includes('text/event-stream')) {
            const rawText = await response.text();
            const json = parsingMightBeJsonString(rawText);
            const content = json ? extractOpenAIFullText(json) : rawText;
            const finalText = (typeof content === 'string' ? content : '').trim();
            nonStreamingFillStreamingCallback(finalText, streamOptions);
            return finalText;
        }

        return analyzeSseText(response, createOpenAIStreamIncrementExtractor(), streamOptions?.onDelta, 'Stream body is empty');
    }

    throw new Error('API request failed after retries');
};

const requestGeminiText = async (
    apiConfig: ActiveApiConfig,
    messages: GeneralMessage[],
    temperature: number,
    signal?: AbortSignal,
    streamOptions?: UniversalStreamingOptions,
    responseFormatJsonObject: boolean = false,
    errorDetailLimit?: number
): Promise<string> => {
    if (apiConfig.provider !== 'worker' && !apiConfig.apiKey) throw new Error("API configuration or API Key is missing. Please check settings.");
    const model = standardizeGeminiModelName(apiConfig.model);
    if (!model) throw new Error('Gemini model is required');

    const enableStream = !!streamOptions?.stream;
    let useStream = enableStream;
    const baseUrl = standardizeGeminiBaseAddress(apiConfig.baseUrl);
    const path = `/v1beta/models/${encodeURIComponent(model)}:${useStream ? 'streamGenerateContent' : 'generateContent'}${useStream ? '?alt=sse' : ''}`;
    const { systemInstruction, contents } = assembleGeminiMessage(messages, responseFormatJsonObject);
    const maxOutputTokens = calculateMaxOutputToken(apiConfig, 'gemini', messages);

    const generationConfig: Record<string, unknown> = {
        temperature,
        maxOutputTokens
    };
    if (responseFormatJsonObject) {
        generationConfig.responseMimeType = 'application/json';
        generationConfig.response_mime_type = 'application/json';
    }

    const payload = JSON.stringify({
        contents,
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig,
        safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
        ]
    });

    const doFetch = async (authMode: 'query' | 'bearer', currentStream: boolean): Promise<Response> => {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (currentStream) headers.Accept = 'text/event-stream';
        if (authMode === 'bearer') headers.Authorization = `Bearer ${apiConfig.apiKey}`;
        const dynamicPath = `/v1beta/models/${encodeURIComponent(model)}:${currentStream ? 'streamGenerateContent' : 'generateContent'}${currentStream ? '?alt=sse' : ''}`;
        const url = authMode === 'query'
            ? appendGeminiKeyParameter(`${baseUrl}${dynamicPath}`, apiConfig.apiKey)
            : `${baseUrl}${dynamicPath}`;
        return fetch(url, {
            method: 'POST',
            headers,
            body: payload,
            signal
        });
    };

    let authMode: 'query' | 'bearer' = 'query';
    for (let attempt = 0; attempt < 4; attempt++) {
        let response = await doFetch(authMode, useStream);
        if (!response.ok && authMode === 'query' && [400, 401, 403, 404].includes(response.status)) {
            authMode = 'bearer';
            response = await doFetch(authMode, useStream);
        }

        if (!response.ok) {
            const detail = await readFailureDetailText(response, errorDetailLimit);
            if (useStream && detectMissingStreamingSupport(detail)) {
                useStream = false;
                continue;
            }
            throw new ProtocolRequestError(`Gemini API Error: ${response.status}${detail ? ` - ${detail}` : ''}`, response.status, detail);
        }

        if (!useStream) {
            const data = await response.json();
            const text = extractGeminiText(data).trim();
            nonStreamingFillStreamingCallback(text, streamOptions);
            return text;
        }

        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        if (!contentType.includes('text/event-stream')) {
            const data = await response.json();
            const text = extractGeminiText(data).trim();
            nonStreamingFillStreamingCallback(text, streamOptions);
            return text;
        }

        return analyzeSseText(response, extractGeminiText, streamOptions?.onDelta, 'Gemini stream body is empty');
    }

    throw new Error(`Gemini API call failed: ${path}`);
};

const requestClaudeText = async (
    apiConfig: ActiveApiConfig,
    messages: GeneralMessage[],
    temperature: number,
    signal?: AbortSignal,
    streamOptions?: UniversalStreamingOptions,
    responseFormatJsonObject: boolean = false,
    errorDetailLimit?: number
): Promise<string> => {
    if (apiConfig.provider !== 'worker' && !apiConfig.apiKey) throw new Error("API configuration or API Key is missing. Please check settings.");
    const baseUrl = standardizeClaudeBaseAddress(apiConfig.baseUrl);
    const endpoint = `${baseUrl}/v1/messages`;
    const enableStream = !!streamOptions?.stream;
    let useStream = enableStream;

    const { system, list, prefillJsonBrace } = assembleClaudeMessage(messages, responseFormatJsonObject);
    const maxOutputTokens = calculateMaxOutputToken(apiConfig, 'claude', messages);

    const buildBody = (stream: boolean) => ({
        model: apiConfig.model,
        max_tokens: maxOutputTokens,
        system: system || undefined,
        messages: list,
        temperature,
        stream
    });

    for (let attempt = 0; attempt < 4; attempt++) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'x-api-key': apiConfig.apiKey,
                'anthropic-version': '2023-06-01',
                'Accept': useStream ? 'text/event-stream' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(buildBody(useStream)),
            signal
        });

        if (!response.ok) {
            const detail = await readFailureDetailText(response, errorDetailLimit);
            if (useStream && detectMissingStreamingSupport(detail)) {
                useStream = false;
                continue;
            }
            throw new ProtocolRequestError(`Claude API Error: ${response.status}${detail ? ` - ${detail}` : ''}`, response.status, detail);
        }

        const toFinalText = (text: string): string => {
            const trimmed = (text || '').trim();
            if (!responseFormatJsonObject) return trimmed;
            if (!prefillJsonBrace) return trimmed;
            if (!trimmed) return '{';
            return trimmed.startsWith('{') ? trimmed : `{${trimmed}`;
        };

        if (!useStream) {
            const data = await response.json();
            const text = toFinalText(extractClaudeText(data));
            nonStreamingFillStreamingCallback(text, streamOptions);
            return text;
        }

        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        if (!contentType.includes('text/event-stream')) {
            const data = await response.json();
            const text = toFinalText(extractClaudeText(data));
            nonStreamingFillStreamingCallback(text, streamOptions);
            return text;
        }

        const streamed = await analyzeSseText(response, extractClaudeStreamIncrementalText, streamOptions?.onDelta, 'Claude stream body is empty');
        return toFinalText(streamed);
    }

    throw new Error('Claude API call failed after retries');
};

/**
 * Sends a text generation request to a Cloudflare Worker (Nemotron).
 * This function does NOT require an API key—the worker handles AI access internally.
 */
const requestWorkerText = async (
    workerUrl: string | string[],
    messages: GeneralMessage[],
    options: {
        temperature?: number;
        max_tokens?: number;
    }
): Promise<string> => {
    return TextGenService.generateText(workerUrl, {
        messages,
        temperature: options.temperature,
        max_tokens: options.max_tokens,
    });
};

const requestModelText = async (
    apiConfig: ActiveApiConfig,
    messages: GeneralMessage[],
    options: {
        temperature: number;
        signal?: AbortSignal;
        streamOptions?: UniversalStreamingOptions;
        responseFormatJsonObject?: boolean;
        errorDetailLimit?: number;
    }
): Promise<string> => {
    if (!apiConfig) throw new Error("API configuration is missing. Please check settings.");
    if (apiConfig.provider !== 'worker' && !apiConfig.apiKey) throw new Error("API Key is missing for the selected provider. Please check settings.");

    // We force JSON mode globally as requested
    const jsonMode = true;
    const protocol = checkRequestProtocol(apiConfig);
    const resolvedTemperature = calculateRequestTemperature(apiConfig, protocol, options.temperature);

    if (apiConfig.provider === 'worker') {
        const workerUrl = apiConfig.baseUrl || DEFAULT_TEXT_GEN_WORKER_URLS;
        const maxOutputTokens = calculateMaxOutputToken(apiConfig, protocol, messages);
        return requestWorkerText(
            workerUrl,
            messages,
            {
                temperature: resolvedTemperature,
                max_tokens: maxOutputTokens
            }
        );
    }

    if (protocol === 'gemini') {
        return requestGeminiText(
            apiConfig,
            messages,
            resolvedTemperature,
            options.signal,
            options.streamOptions,
            jsonMode,
            options.errorDetailLimit
        );
    }

    if (protocol === 'claude') {
        return requestClaudeText(
            apiConfig,
            messages,
            resolvedTemperature,
            options.signal,
            options.streamOptions,
            jsonMode,
            options.errorDetailLimit
        );
    }

    if (protocol === 'deepseek') {
        return requestOpenAIFamilyText(
            apiConfig,
            'deepseek',
            messages,
            resolvedTemperature,
            options.signal,
            options.streamOptions,
            jsonMode,
            options.errorDetailLimit
        );
    }

    return requestOpenAIFamilyText(
        apiConfig,
        'openai',
        messages,
        resolvedTemperature,
        options.signal,
        options.streamOptions,
        jsonMode,
        options.errorDetailLimit
    );
};

export const generateMemoryRecall = async (
    systemPrompt: string,
    userPrompt: string,
    apiConfig: ActiveApiConfig | null,
    signal?: AbortSignal,
    streamOptions?: RecallStreamOptions,
    workerUrl?: string
): Promise<string> => {
    const messages: GeneralMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    // Use worker fallback when no API config is available
    if ((!apiConfig || !apiConfig.apiKey) && workerUrl) {
        return requestWorkerText(workerUrl, messages, { temperature: 0.2 });
    }

    return requestModelText(apiConfig!, messages, {
        temperature: 0.2,
        signal,
        streamOptions,
        responseFormatJsonObject: true
    });
};

export const generateWorldData = async (
    worldContext: string,
    charData: any,
    apiConfig: ActiveApiConfig | null,
    streamOptions?: WorldStreamOptions,
    workerUrl?: string,
    extraPrompt?: string
): Promise<{ world_prompt: string, world_skeleton?: any }> => {
    const genSystemPrompt = extraPrompt
        ? `${WORLD_GENERATION_SYSTEM_PROMPT}\n\n【Prompt bổ sung tùy chỉnh】\n${extraPrompt}`
        : WORLD_GENERATION_SYSTEM_PROMPT;
    const genUserPrompt = constructWorldviewUserPrompt(worldContext, charData);

    const parseWorldResponse = (content: string): { world_prompt: string, world_skeleton?: any } => {
        let parsedValue: Record<string, any> | null = null;
        try {
            const parsed = parseJsonWithRepair<Record<string, unknown>>(content);
            if (parsed.value && typeof parsed.value === 'object') {
                parsedValue = parsed.value;
            }
        } catch {
            // Initial parse failed, fallback will be handled below
        }

        if (parsedValue) {
            const prompt = typeof parsedValue.world_prompt === 'string'
                ? parsedValue.world_prompt.trim()
                : typeof parsedValue.worldPrompt === 'string'
                    ? parsedValue.worldPrompt.trim()
                    : '';
            
            return {
                world_prompt: prompt,
                world_skeleton: parsedValue.world_skeleton || parsedValue.worldSkeleton
            };
        }

        // Regex Fallback (Only for world_prompt)
        const regexMatch = content.match(/["']world_?prompt["']\s*:\s*(["'])([\s\S]*?)\1\s*[,}]/i);
        if (regexMatch?.[2]) {
            console.warn("JSON parse failed for worldview, using regex fallback extraction.");
            return { world_prompt: regexMatch[2].trim() };
        }

        throw new Error(`Worldview generation parsing failed.: ${content.slice(0, 100)}...`);
    };

    const messages: GeneralMessage[] = [
        { role: 'system', content: genSystemPrompt },
        { role: 'user', content: genUserPrompt }
    ];

    // Use worker fallback when no API config is available
    const effectiveWorkerUrl = workerUrl || DEFAULT_NEMOTRON_WORKER_URL;
    if ((!apiConfig || !apiConfig.apiKey) && effectiveWorkerUrl) {
        const rawText = await requestWorkerText(effectiveWorkerUrl, messages, { temperature: 0.8 });
        return parseWorldResponse(rawText);
    }

    if (!apiConfig || (apiConfig.provider !== 'worker' && !apiConfig.apiKey)) throw new Error("API configuration or API Key is missing. Please check settings.");

    const responseFormatJsonObject = true;
    const rawText = await requestModelText(apiConfig, messages, {
        temperature: 0.8,
        streamOptions,
        responseFormatJsonObject
    });

    return parseWorldResponse(rawText);
};

export const generateStoryResponse = async (
    systemPrompt: string,
    userContext: string,
    playerInput: string,
    apiConfig: ActiveApiConfig | null,
    signal?: AbortSignal,
    streamOptions?: StoryStreamOptions,
    extraPrompt?: string,
    requestOptions?: StoryRequestOptions,
    workerUrl?: string
): Promise<StoryResponseResult> => {
    // Allow worker fallback when no API config is available
    const effectiveWorkerUrl = workerUrl || DEFAULT_NEMOTRON_WORKER_URL;
    const useWorker = (!apiConfig || !apiConfig.apiKey) && !!effectiveWorkerUrl;
    if (!apiConfig?.apiKey && !effectiveWorkerUrl) throw new Error("API configuration or API Key is missing. Please check settings.");

    const normalizedSystemPrompt = typeof systemPrompt === 'string' ? systemPrompt.trim() : '';
    const normalizedContext = typeof userContext === 'string' ? userContext.trim() : '';
    const normalizedExtraPrompt = typeof extraPrompt === 'string' ? extraPrompt.trim() : '';
    const enableCotInjection = requestOptions?.enableCotInjection !== false;
    const cotPseudoHistoryPrompt = typeof requestOptions?.cotPseudoHistoryPrompt === 'string'
        ? requestOptions.cotPseudoHistoryPrompt.trim()
        : DEFAULT_COT_PROMPT.trim();
    const leadingSystemPrompt = typeof requestOptions?.leadingSystemPrompt === 'string'
        ? requestOptions.leadingSystemPrompt.trim()
        : '';
    const styleAssistantPrompt = typeof requestOptions?.styleAssistantPrompt === 'string'
        ? requestOptions.styleAssistantPrompt.trim()
        : '';
    const outputProtocolPrompt = typeof requestOptions?.outputProtocolPrompt === 'string'
        ? requestOptions.outputProtocolPrompt.trim()
        : '';
    const lengthRequirementPrompt = typeof requestOptions?.lengthRequirementPrompt === 'string'
        ? requestOptions.lengthRequirementPrompt.trim()
        : '';
    const disclaimerRequirementPrompt = typeof requestOptions?.disclaimerRequirementPrompt === 'string'
        ? requestOptions.disclaimerRequirementPrompt.trim()
        : '';

    const normalizedPlayerInput = typeof playerInput === 'string' && playerInput.trim().length > 0
        ? playerInput
        : 'Start task.';

    const apiMessages: GeneralMessage[] = [];
    const enableClaudeMode = requestOptions?.enableClaudeMode === true;

    if (enableClaudeMode) {
        // Claude mode: all context goes into system role; only the final player input uses user role.
        // Supplementary non-core prompts (length, style, disclaimer, outputProtocol, extra) are
        // merged into the system block to avoid interleaved user/assistant turns that Claude dislikes.
        const systemParts: string[] = [];
        if (normalizedSystemPrompt) systemParts.push(normalizedSystemPrompt);
        if (normalizedContext) systemParts.push(normalizedContext);
        if (leadingSystemPrompt) systemParts.push(leadingSystemPrompt);
        if (lengthRequirementPrompt) systemParts.push(lengthRequirementPrompt);
        if (styleAssistantPrompt) systemParts.push(styleAssistantPrompt);
        if (outputProtocolPrompt) systemParts.push(outputProtocolPrompt);
        if (disclaimerRequirementPrompt) systemParts.push(disclaimerRequirementPrompt);
        if (normalizedExtraPrompt) systemParts.push(normalizedExtraPrompt);
        if (cotPseudoHistoryPrompt) systemParts.push(cotPseudoHistoryPrompt);
        const mergedSystem = systemParts.filter(Boolean).join('\n\n');
        if (mergedSystem) apiMessages.push({ role: 'system', content: mergedSystem });
        apiMessages.push({ role: 'user', content: normalizedPlayerInput });
    } else {
        if (normalizedSystemPrompt) {
            apiMessages.push({ role: 'system', content: normalizedSystemPrompt });
        }
        if (normalizedContext) {
            apiMessages.push({ role: 'system', content: normalizedContext });
        }
        // AI Character identity declaration changed to system Layer injection。
        if (leadingSystemPrompt) {
            apiMessages.push({ role: 'system', content: leadingSystemPrompt });
        }
        if (lengthRequirementPrompt) {
            apiMessages.push({ role: 'user', content: lengthRequirementPrompt });
        }
        if (styleAssistantPrompt) {
            apiMessages.push({ role: 'assistant', content: styleAssistantPrompt });
        }
        // The final output protocol serves as a system-level override prompt.，Higher priority than normal assistant Inject。
        if (outputProtocolPrompt) {
            apiMessages.push({ role: 'system', content: outputProtocolPrompt });
        }
        // Disclaimer output requirement serves as. AI Character message，Fixed before the additional requirement prompt.。
        if (disclaimerRequirementPrompt) {
            apiMessages.push({ role: 'assistant', content: disclaimerRequirementPrompt });
        }
        // Additional requirement prompts are fixed after the disclaimer output requirements.，Injected as the third-to-last message.。
        if (normalizedExtraPrompt) {
            apiMessages.push({ role: 'assistant', content: normalizedExtraPrompt });
        }

        // DisguiseCOTHistory messages moved to user:Start task After。
        if (enableCotInjection && cotPseudoHistoryPrompt) {
            apiMessages.push({ role: 'user', content: 'Start task.' });
            apiMessages.push({ role: 'assistant', content: cotPseudoHistoryPrompt });
        }
        apiMessages.push({
            role: 'user',
            content: normalizedPlayerInput
        });
    }

    // Force JSON mode for all story requests to ensure reliable structured output.
    const responseFormatJsonObject = true;
    let rawText: string;

    if (useWorker) {
        // Use Cloudflare Worker (Nemotron) for text generation
        rawText = await requestWorkerText(effectiveWorkerUrl!, apiMessages, { temperature: 0.7 });
    } else {
        rawText = await requestModelText(apiConfig!, apiMessages, {
            temperature: 0.7,
            signal,
            streamOptions,
            responseFormatJsonObject,
            errorDetailLimit: requestOptions?.errorDetailLimit
        });
    }

    try {
        const parsedResponse = parseStoryRawText(rawText);
        // Tag integrity check: when enabled, verify that the response has the three required
        // sections (logs, shortTerm, tavern_commands). Missing sections are flagged as errors.
        if (requestOptions?.enableTagIntegrityCheck === true) {
            const hasLogs = Array.isArray(parsedResponse.logs) && parsedResponse.logs.some(
                log => typeof log?.text === 'string' && log.text.trim().length > 0
            );
            const hasShortTerm = typeof parsedResponse.shortTerm === 'string' && parsedResponse.shortTerm.trim().length > 0;
            const hasCommands = Array.isArray(parsedResponse.tavern_commands);
            if (!hasLogs || !hasShortTerm || !hasCommands) {
                const missing: string[] = [];
                if (!hasLogs) missing.push('logs');
                if (!hasShortTerm) missing.push('shortTerm');
                if (!hasCommands) missing.push('tavern_commands');
                throw new StoryResponseParseError(
                    `Kiểm tra tính toàn vẹn thất bại: Thiếu các trường bắt buộc: ${missing.join(', ')}`,
                    rawText,
                    `Integrity check failed: missing required fields: ${missing.join(', ')}`
                );
            }
        }
        return {
            response: parsedResponse,
            rawText
        };
    } catch (parseError: any) {
        // On suspected truncation (thinking fields present but no logs), attempt a one-shot
        // continuation: send the truncated response back and ask the model to complete
        // the missing logs/commands sections without re-running the heavy thinking steps.
        const isTruncation =
            (parseError instanceof StoryResponseParseError || parseError?.name === 'StoryResponseParseError') &&
            typeof parseError?.parseDetail === 'string' &&
            parseError.parseDetail.includes('Suspected response truncation');

        if (!isTruncation || signal?.aborted) {
            throw parseError;
        }

        try {
            const originalParsed = parseJsonWithRepair<any>(rawText);

            // Helpers shared across both continuation attempts
            const mergeAndCheck = (contParsed: ReturnType<typeof parseJsonWithRepair<any>>, contRawText: string) => {
                if (!contParsed.value || typeof contParsed.value !== 'object') return null;

                const prev = (originalParsed.value && typeof originalParsed.value === 'object' ? originalParsed.value : {}) as any;
                const next = contParsed.value as any;

                // Create a merged object that appends arrays for logs and tavern_commands
                const merged = { ...prev, ...next };

                if (Array.isArray(prev.logs) && Array.isArray(next.logs)) {
                    merged.logs = [...prev.logs, ...next.logs];
                }
                if (Array.isArray(prev.tavern_commands) && Array.isArray(next.tavern_commands)) {
                    merged.tavern_commands = [...prev.tavern_commands, ...next.tavern_commands];
                }

                const mergedResponse = normalizationJsonStructureResponse(merged);
                const hasLogs = mergedResponse.logs.some(
                    (log) => typeof log?.text === 'string' && log.text.trim().length > 0
                );
                return hasLogs ? { response: mergedResponse, rawText: contRawText } : null;
            };

            // Attempt 1: continuation with same context but explicit instruction to skip thinking fields.
            // Use lower temperature so the model follows the explicit instruction more reliably.
            const thinkingFieldsList = [...COT_THINKING_FIELD_KEYS, 'thinking_pre'].join(', ');
            const continuationUserMsg = [
                '【TIẾP NỐI BẮT BUỘC - PHẢN HỒI BỊ CẮT NGANG】',
                'Phản hồi JSON trước đó đã bị cắt ngang giữa chừng do giới hạn token.',
                `TUYỆT ĐỐI KHÔNG được xuất lại các trường suy nghĩ đã có (${thinkingFieldsList}).`,
                'HÃY TIẾP TỤC nội dung chính văn (logs) từ đúng vị trí bị cắt đoạn.',
                'Xuất một JSON object hợp lệ chứa phần còn lại:',
                '{"logs": [{"sender": "...", "text": "... TIẾP TỤC NỘI DUNG ..."}], "shortTerm": "...", "tavern_commands": [...]}',
                'Lưu ý: Nếu một câu đang dở dang ở cuối "logs" trước, hãy bắt đầu "logs" mới bằng phần còn lại của câu đó để đảm bảo tính liên tục.',
            ].join('\n');
            const continuationMessages: GeneralMessage[] = [
                ...apiMessages,
                { role: 'assistant', content: rawText },
                { role: 'user', content: continuationUserMsg }
            ];
            const continuationRawText = useWorker
                ? await requestWorkerText(workerUrl!, continuationMessages, { temperature: 0.3 })
                : await requestModelText(apiConfig!, continuationMessages, {
                    temperature: 0.3,
                    signal,
                    responseFormatJsonObject,
                    errorDetailLimit: requestOptions?.errorDetailLimit
                });
            const cont1Result = mergeAndCheck(parseJsonWithRepair<any>(continuationRawText), continuationRawText);
            if (cont1Result) return cont1Result;

            // Attempt 2: stripped-down fallback without CoT-forcing messages.
            // The system prompt that instructs the model to output thinking fields first is removed so the
            // model is free to output logs/shortTerm/tavern_commands directly.
            const isCotContent = (content: string) =>
                COT_THINKING_FIELD_KEYS.some(k => content.includes(k)) ||
                ['PRE-story', 'POST-story'].some(m => content.includes(m));
            const strippedSystemMsgs = apiMessages.filter(
                m => m.role === 'system' && !isCotContent(m.content)
            );
            const lastUserMsg = [...apiMessages].reverse().find(m => m.role === 'user');
            const fallbackMessages: GeneralMessage[] = [
                ...strippedSystemMsgs,
                ...(lastUserMsg ? [lastUserMsg] : []),
                { role: 'assistant', content: rawText },
                {
                    role: 'user',
                    content: [
                        '【XUẤT CHÍNH VĂN】Phần suy luận đã xong (xem thinking fields ở trên).',
                        'Xuất NGAY một JSON object hợp lệ CHỈ với 3 trường:',
                        '{"logs": [{"sender": "Bối cảnh", "text": "..."}, ...], "shortTerm": "...", "tavern_commands": [...]}',
                        'KHÔNG cần thinking fields. Viết ngay chính văn vào "logs".',
                    ].join('\n')
                }
            ];
            const fallbackRawText = useWorker
                ? await requestWorkerText(workerUrl!, fallbackMessages, { temperature: 0.3 })
                : await requestModelText(apiConfig!, fallbackMessages, {
                    temperature: 0.3,
                    signal,
                    responseFormatJsonObject,
                    errorDetailLimit: requestOptions?.errorDetailLimit
                });
            const cont2Result = mergeAndCheck(parseJsonWithRepair<any>(fallbackRawText), fallbackRawText);
            if (cont2Result) return cont2Result;
            console.error("Auto-continue failed. Attempt 1 rawText:", continuationRawText);
            console.error("Auto-continue failed. Attempt 2 rawText:", fallbackRawText);
        } catch (e) {
            console.error("Auto-continue threw an error:", e);
            // Continuation attempts failed — fall through to rethrow original error
        }

        throw parseError;
    }
};

export const testConnection = async (
    apiConfig: ActiveApiConfig
): Promise<ConnectionTestResult> => {
    if (!apiConfig || (apiConfig.provider !== 'worker' && !apiConfig.apiKey)) {
        return { ok: false, detail: 'Missing API Key' };
    }
    if (apiConfig.provider !== 'worker' && !apiConfig.baseUrl) {
        return { ok: false, detail: 'Missing Base URL' };
    }
    if (apiConfig.provider !== 'worker' && !apiConfig.model) {
        return { ok: false, detail: 'Missing model name' };
    }

    const messages: GeneralMessage[] = [
        { role: 'system', content: 'You are a connection test. Please only answer OK.' },
        { role: 'user', content: 'ping' }
    ];

    const startedAt = Date.now();
    try {
        const text = await requestModelText(apiConfig, messages, {
            temperature: 0,
            responseFormatJsonObject: false,
            errorDetailLimit: Number.POSITIVE_INFINITY
        });
        const elapsed = Date.now() - startedAt;
        const body = typeof text === 'string' ? text : '';
        const content = body.length > 0 ? body : 'No response content';
        return { ok: true, detail: `Duration: ${elapsed}ms\n\n${content}` };
    } catch (error: any) {
        const raw = error?.detail ?? error?.message ?? error ?? 'Unknown error';
        const detail = typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2);
        return { ok: false, detail };
    }
};
