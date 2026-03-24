import * as aiService from './aiService';
import { TextGenService } from './textGenService';
import { PROMPT_TRANSFORMATION_SYSTEM } from '../prompts/runtime/transformationPrompt';
import { ActiveApiConfig, PromptStructure } from '../types';
import { parseJsonWithRepair } from '../utils/jsonRepair';
import { DEFAULT_TEXT_GEN_WORKER_URLS } from '../utils/apiConfig';


export class TransformationService {
    static async transformPrompts(
        input: any[],
        apiConfig: ActiveApiConfig | null
    ): Promise<PromptStructure[]> {
        const inputString = JSON.stringify(input);
        const systemPrompt = PROMPT_TRANSFORMATION_SYSTEM;

        let rawResponse: string;

        // Check if user has a valid API key configured (OpenAI, Gemini, etc.)
        const hasUserApiKey = apiConfig && apiConfig.apiKey && apiConfig.apiKey.trim().length > 5;

        if (hasUserApiKey) {
            try {
                // Use the main aiService for high-quality transformation
                rawResponse = await aiService.generateMemoryRecall(
                    systemPrompt,
                    `Transform these items:\n${inputString}`,
                    apiConfig
                );
            } catch (error) {
                console.warn("User API failed, falling back to Cloudflare:", error);
                rawResponse = await this.fallbackTransformation(inputString, systemPrompt);
            }
        } else {
            // Fallback to Cloudflare Nemotron
            rawResponse = await this.fallbackTransformation(inputString, systemPrompt);
        }

        // Parse the response which should be a JSON array of PromptStructure-like objects
        try {
            // Clean up possible markdown code blocks
            const jsonText = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = parseJsonWithRepair<any[]>(jsonText);

            if (parsed.value && Array.isArray(parsed.value)) {
                return parsed.value.map((item, index) => ({
                    id: `transformed-${Date.now()}-${index}`,
                    title: item.title || 'Untitled Prompt',
                    content: item.content || '',
                    type: item.type || 'custom',
                    enabled: true
                }));
            }
            throw new Error("Failed to parse transformation results as array");
        } catch (err) {
            console.error("Transformation Parse Error:", err, rawResponse);
            throw new Error("Dữ liệu phản hồi từ AI không đúng định dạng. Vui lòng thử lại.");
        }
    }

    private static async fallbackTransformation(input: string, system: string): Promise<string> {
        // Cloudflare Worker AI has limits on request payload.
        // If the import file is huge, the simple worker might crash.
        // We truncate or warn if it's too large (~30k characters is a safe limit for a context window).
        const MAX_INPUT_CHARS = 40000;
        let processedInput = input;

        if (input.length > MAX_INPUT_CHARS) {
            console.warn(`Input too large (${input.length} chars). Truncating to ${MAX_INPUT_CHARS} for fallback worker.`);
            processedInput = input.slice(0, MAX_INPUT_CHARS) + "\n... (Dữ liệu bị cắt bỏ do quá lớn) ...";
        }

        // Use the centralized worker URL(s)
        const workerUrl = DEFAULT_TEXT_GEN_WORKER_URLS;

        return await TextGenService.generateText(workerUrl, {
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: `Transform these items (Dữ liệu nhập):\n${processedInput}` }
            ],
            max_tokens: 131000,
            temperature: 1.0
        });
    }
}
