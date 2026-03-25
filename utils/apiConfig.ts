import {
    ApiSettings,
    ApiConfig,
    ApiProviderType,
    OpenAICompatibilitySolution,
    FeatureModelPlaceholderConfig,
    RequestProtocolOverride,
    ActiveApiConfig
} from '../models/system';

/**
 * Parses a comma-separated string of URLs or an array of URLs into a cleaned array of URLs.
 */
export const parseWorkerUrls = (urlInput: string | string[] | undefined | null): string[] => {
    if (!urlInput) return [];
    const urls = Array.isArray(urlInput)
        ? urlInput.map(u => String(u).trim())
        : String(urlInput).split(',').map(u => u.trim());

    return urls
        .filter(Boolean)
        .map(u => u.endsWith('/') ? u.slice(0, -1) : u);
};

/**
 * Aggregates chunked environment variables (e.g., _1, _2, _3) into a single array.
 */
const getChunkedEnvVars = (baseName: string): string[] => {
    const results: string[] = [];
    const env = (import.meta as any).env;

    // Attempt to collect all keys that match baseName + _index
    // We try a wide range of indices to be safe, as Object.keys might not list all env vars in some builds
    for (let i = 1; i <= 2000; i++) {
        const value = env[`${baseName}_${i}`];
        if (value) {
            results.push(...parseWorkerUrls(value));
        }
    }

    // Fallback to non-indexed variable if no indexed ones found
    if (results.length === 0) {
        const fallback = env[baseName];
        if (fallback) return parseWorkerUrls(fallback);
    }
    return results;
};

// Discovery endpoints for dynamic worker selection

export const DEFAULT_TEXT_GEN_WORKER_URLS = [
    'https://wuxia-api.vdt99.workers.dev/nemotron'
];

export const DEFAULT_TEXT_GEN_WORKER_URL = DEFAULT_TEXT_GEN_WORKER_URLS[0];

export const DEFAULT_IMAGE_GEN_WORKER_URLS = [
    'https://wuxia-api.vdt99.workers.dev/image-gen'
];
export const DEFAULT_IMAGE_GEN_WORKER_URL = DEFAULT_IMAGE_GEN_WORKER_URLS[0];


export const PROVIDER_LABELS: Record<ApiProviderType, string> = {
    gemini: 'Google Gemini',
    claude: 'Anthropic Claude',
    openai: 'OpenAI GPT',
    deepseek: 'DeepSeek',
    mistral: 'Mistral AI',
    groq: 'Groq',
    xai: 'xAI (Grok)',
    perplexity: 'Perplexity',
    cohere: 'Cohere',
    moonshot: 'Moonshot (Kimi)',
    openrouter: 'OpenRouter',
    huggingface: 'HuggingFace',
    cloudflare: 'Cloudflare Workers AI',
    together: 'Together AI',
    fireworks: 'Fireworks AI',
    cerebras: 'Cerebras',
    sambanova: 'SambaNova',
    openai_compatible: 'OpenAI Tương thích',
    worker: 'Hệ thống (Nemotron)'
};

export const OPENAI_COMPATIBILITY_PRESETS: Record<OpenAICompatibilitySolution, { label: string; baseUrl: string }> = {
    custom: { label: 'Tùy chỉnh', baseUrl: '' },
    openrouter: { label: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1' },
    siliconflow: { label: 'SiliconFlow', baseUrl: 'https://api.siliconflow.cn/v1' },
    together: { label: 'Together', baseUrl: 'https://api.together.xyz/v1' },
    groq: { label: 'Groq', baseUrl: 'https://api.groq.com/openai/v1' }
};

export const PROTOCOL_OVERRIDE_LABELS: Record<RequestProtocolOverride, string> = {
    auto: 'Tự động nhận diện',
    openai: 'Giao thức OpenAI',
    gemini: 'Giao thức Gemini',
    claude: 'Giao thức Claude',
    deepseek: 'Giao thức DeepSeek'
};

export const DEFAULT_FEATURE_MODEL_PLACEHOLDER: FeatureModelPlaceholderConfig = {
    mainStoryModel: '',
    recallIndependentModelToggle: false,
    recallSilentConfirmation: false,
    recallFullContextLimitN: 20,
    recallEarliestTriggerTurn: 10,
    worldEvolutionIndependentModelToggle: true,
    variableCalculationIndependentModelToggle: false,
    articleOptimizationIndependentModelToggle: true,
    recallModel: '',
    worldEvolutionModel: '',
    variableCalculationModel: '',
    articleOptimizationModel: ''
};

const PROVIDER_DEFAULTS: Record<ApiProviderType, { baseUrl: string; model: string }> = {
    gemini: {
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
        model: 'gemini-2.0-flash'
    },
    claude: {
        baseUrl: 'https://api.anthropic.com/v1',
        model: 'claude-3-5-sonnet-latest'
    },
    openai: {
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o-mini'
    },
    deepseek: {
        baseUrl: 'https://api.deepseek.com/v1',
        model: 'deepseek-chat'
    },
    mistral: {
        baseUrl: 'https://api.mistral.ai/v1',
        model: 'mistral-large-latest'
    },
    groq: {
        baseUrl: 'https://api.groq.com/openai/v1',
        model: 'llama-3.3-70b-versatile'
    },
    xai: {
        baseUrl: 'https://api.x.ai/v1',
        model: 'grok-beta'
    },
    perplexity: {
        baseUrl: 'https://api.perplexity.ai',
        model: 'llama-3-sonar-large-32k-online'
    },
    cohere: {
        baseUrl: 'https://api.cohere.com/v2',
        model: 'command-r-plus'
    },
    moonshot: {
        baseUrl: 'https://api.moonshot.ai/v1',
        model: 'moonshot-v1-8k'
    },
    openrouter: {
        baseUrl: 'https://openrouter.ai/api/v1',
        model: 'google/gemini-2.0-flash-exp:free'
    },
    huggingface: {
        baseUrl: 'https://router.huggingface.co/v1',
        model: 'meta-llama/Llama-3.1-70B-Instruct'
    },
    cloudflare: {
        baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{ID}/ai/v1/',
        model: '@cf/meta/llama-3.1-70b-instruct'
    },
    together: {
        baseUrl: 'https://api.together.xyz/v1',
        model: 'meta-llama/Llama-3.1-70B-Instruct-Turbo'
    },
    fireworks: {
        baseUrl: 'https://api.fireworks.ai/inference/v1',
        model: 'accounts/fireworks/models/llama-v3p1-70b-instruct'
    },
    cerebras: {
        baseUrl: 'https://api.cerebras.ai/v1',
        model: 'llama3.1-70b'
    },
    sambanova: {
        baseUrl: 'https://api.sambanova.ai/v1',
        model: 'Meta-Llama-3.1-70B-Instruct'
    },
    openai_compatible: {
        baseUrl: '',
        model: 'gpt-4o-mini'
    },
    worker: {
        baseUrl: DEFAULT_TEXT_GEN_WORKER_URL,
        model: '@cf/zai-org/glm-4.7-flash'
    }
};

const generateConfigId = (): string => `api_cfg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const readString = (value: unknown, fallback = ''): string => {
    return typeof value === 'string' ? value : fallback;
};

const readPositiveInt = (value: unknown): number | undefined => {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        return Math.floor(value);
    }
    if (typeof value === 'string') {
        const cleaned = value.trim();
        if (!cleaned) return undefined;
        const parsed = Number(cleaned);
        if (Number.isFinite(parsed) && parsed > 0) {
            return Math.floor(parsed);
        }
    }
    return undefined;
};

const readTemperature = (value: unknown): number | undefined => {
    const normalize = (raw: number): number | undefined => {
        if (!Number.isFinite(raw)) return undefined;
        if (raw < 0 || raw > 2) return undefined;
        return Math.round(raw * 100) / 100;
    };

    if (typeof value === 'number') return normalize(value);
    if (typeof value === 'string') {
        const cleaned = value.trim();
        if (!cleaned) return undefined;
        const parsed = Number(cleaned);
        return normalize(parsed);
    }
    return undefined;
};

const inferProvider = (baseUrlRaw: unknown): ApiProviderType => {
    const baseUrl = readString(baseUrlRaw).toLowerCase();
    if (!baseUrl) return 'openai';
    if (baseUrl.includes('generativelanguage.googleapis.com') || baseUrl.includes('googleapis.com')) return 'gemini';
    if (baseUrl.includes('deepseek')) return 'deepseek';
    if (baseUrl.includes('anthropic') || baseUrl.includes('claude')) return 'claude';
    if (baseUrl.includes('mistral.ai')) return 'mistral';
    if (baseUrl.includes('groq.com')) return 'groq';
    if (baseUrl.includes('api.x.ai')) return 'xai';
    if (baseUrl.includes('perplexity.ai')) return 'perplexity';
    if (baseUrl.includes('cohere.ai') || baseUrl.includes('cohere.com')) return 'cohere';
    if (baseUrl.includes('moonshot.ai')) return 'moonshot';
    if (baseUrl.includes('openrouter.ai')) return 'openrouter';
    if (baseUrl.includes('huggingface.co')) return 'huggingface';
    if (baseUrl.includes('cloudflare.com')) return 'cloudflare';
    if (baseUrl.includes('together.xyz')) return 'together';
    if (baseUrl.includes('fireworks.ai')) return 'fireworks';
    if (baseUrl.includes('cerebras.ai')) return 'cerebras';
    if (baseUrl.includes('sambanova.ai')) return 'sambanova';

    if (baseUrl.includes('openrouter') || baseUrl.includes('siliconflow') || baseUrl.includes('together') || baseUrl.includes('groq')) {
        return 'openai_compatible';
    }
    if (baseUrl.includes('openai')) return 'openai';
    if (baseUrl.includes('wuxia-nemotron-worker')) return 'worker';
    return 'openai_compatible';
};

const normalizeProvider = (value: unknown, fallback: ApiProviderType): ApiProviderType => {
    const validProviders: ApiProviderType[] = [
        'gemini', 'claude', 'openai', 'deepseek', 'mistral', 'groq', 'xai', 'perplexity',
        'cohere', 'moonshot', 'openrouter', 'huggingface', 'cloudflare', 'together',
        'fireworks', 'cerebras', 'sambanova', 'openai_compatible', 'worker'
    ];
    if (typeof value === 'string' && validProviders.includes(value as ApiProviderType)) {
        return value as ApiProviderType;
    }
    return fallback;
};

const normalizeCompatibilitySolution = (value: unknown): OpenAICompatibilitySolution => {
    if (value === 'custom' || value === 'openrouter' || value === 'siliconflow' || value === 'together' || value === 'groq') {
        return value;
    }
    return 'custom';
};

const normalizeProtocolOverride = (value: unknown): RequestProtocolOverride => {
    if (value === 'auto' || value === 'openai' || value === 'gemini' || value === 'claude' || value === 'deepseek') {
        return value;
    }
    return 'auto';
};

const normalizeSingleConfig = (raw: any, index: number): ApiConfig => {
    const now = Date.now();
    const fallbackProvider = inferProvider(raw?.baseUrl);
    const provider = normalizeProvider(raw?.Provider ?? raw?.provider, fallbackProvider);
    const compatibilitySolution = normalizeCompatibilitySolution(raw?.['Compatibility plan'] ?? raw?.compatibilitySolution ?? raw?.compatiblePreset);
    const defaultPreset = PROVIDER_DEFAULTS[provider];

    const id = readString(raw?.id).trim() || generateConfigId();
    const nameFallback = `${PROVIDER_LABELS[provider]} Cấu hình ${index + 1}`;
    const name = readString(raw?.Name ?? raw?.name, nameFallback).trim() || nameFallback;
    const baseUrl = readString(raw?.baseUrl, defaultPreset.baseUrl).trim();
    const apiKey = readString(raw?.apiKey).trim();
    const model = readString(raw?.model, defaultPreset.model).trim() || defaultPreset.model;
    const maxTokens = readPositiveInt(raw?.maxTokens ?? raw?.max_tokens);
    const temperature = readTemperature(raw?.temperature);
    const protocolOverride = normalizeProtocolOverride(raw?.['Protocol override'] ?? raw?.protocolOverride);

    const createdAt = typeof raw?.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : now;
    const updatedAt = typeof raw?.updatedAt === 'number' && Number.isFinite(raw.updatedAt) ? raw.updatedAt : now;

    return {
        id,
        name,
        provider,
        compatibilitySolution: provider === 'openai_compatible' ? compatibilitySolution : undefined,
        protocolOverride,
        baseUrl,
        apiKey,
        model,
        maxTokens,
        temperature,
        createdAt,
        updatedAt
    };
};

const normalizeFeatureModelPlaceholder = (raw: any): FeatureModelPlaceholderConfig => {
    const legacyGlobal = Boolean(raw?.['Independent model config switch']);
    const result: FeatureModelPlaceholderConfig = {
        mainStoryModel: readString(raw?.mainStoryModel ?? raw?.['Model used for Primary Story']),
        recallIndependentModelToggle: typeof (raw?.recallIndependentModelToggle ?? raw?.['Storyline memory independent model switch.']) === 'boolean'
            ? (raw?.recallIndependentModelToggle ?? raw?.['Storyline memory independent model switch.'])
            : legacyGlobal,
        recallSilentConfirmation: Boolean(raw?.recallSilentConfirmation ?? raw?.['Story Memory silent confirmation']),
        recallFullContextLimitN: Math.max(1, Number(raw?.recallFullContextLimitN ?? raw?.['Number of complete original entries for storyline memory.N']) || 20),
        recallEarliestTriggerTurn: Math.max(1, Number(raw?.recallEarliestTriggerTurn ?? raw?.['Earliest round to trigger storyline memory.']) || 10),
        worldEvolutionIndependentModelToggle: typeof (raw?.worldEvolutionIndependentModelToggle ?? raw?.['World evolution independent model switch.']) === 'boolean'
            ? (raw?.worldEvolutionIndependentModelToggle ?? raw?.['World evolution independent model switch.'])
            : legacyGlobal,
        variableCalculationIndependentModelToggle: typeof (raw?.variableCalculationIndependentModelToggle ?? raw?.['Variable calculation independent model switch.']) === 'boolean'
            ? (raw?.variableCalculationIndependentModelToggle ?? raw?.['Variable calculation independent model switch.'])
            : legacyGlobal,
        articleOptimizationIndependentModelToggle: typeof (raw?.articleOptimizationIndependentModelToggle ?? raw?.['Text optimization independent model switch.']) === 'boolean'
            ? (raw?.articleOptimizationIndependentModelToggle ?? raw?.['Text optimization independent model switch.'])
            : legacyGlobal,
        recallModel: readString(raw?.recallModel ?? raw?.['Model used for Story Memory']),
        worldEvolutionModel: readString(raw?.worldEvolutionModel ?? raw?.['Model used for World Evolution']),
        variableCalculationModel: readString(raw?.variableCalculationModel ?? raw?.['Model used for variable calculation']),
        articleOptimizationModel: readString(raw?.articleOptimizationModel ?? raw?.['Model used for Article Optimization'])
    };
    // Preserve optional independent API configs and prompts
    const recallApiUrl = readString(raw?.recallIndependentApiUrl);
    if (recallApiUrl) result.recallIndependentApiUrl = recallApiUrl;
    const recallApiKey = readString(raw?.recallIndependentApiKey);
    if (recallApiKey) result.recallIndependentApiKey = recallApiKey;
    const worldApiUrl = readString(raw?.worldEvolutionIndependentApiUrl);
    if (worldApiUrl) result.worldEvolutionIndependentApiUrl = worldApiUrl;
    const worldApiKey = readString(raw?.worldEvolutionIndependentApiKey);
    if (worldApiKey) result.worldEvolutionIndependentApiKey = worldApiKey;
    const articleApiUrl = readString(raw?.articleOptimizationIndependentApiUrl);
    if (articleApiUrl) result.articleOptimizationIndependentApiUrl = articleApiUrl;
    const articleApiKey = readString(raw?.articleOptimizationIndependentApiKey);
    if (articleApiKey) result.articleOptimizationIndependentApiKey = articleApiKey;
    const worldPrompt = readString(raw?.worldEvolutionPrompt);
    if (worldPrompt) result.worldEvolutionPrompt = worldPrompt;
    const articlePrompt = readString(raw?.articleOptimizationPrompt);
    if (articlePrompt) result.articleOptimizationPrompt = articlePrompt;
    return result;
};

export const createEmptyApiSettings = (): ApiSettings => ({
    activeConfigId: null,
    configs: [],
    featureModelPlaceholder: { ...DEFAULT_FEATURE_MODEL_PLACEHOLDER }
});

/**
 * 5 pre-built API preset templates.
 * Each returns a fresh ApiConfig with a unique id when called.
 */
export const API_PRESET_TEMPLATES: Array<{
    label: string;
    provider: ApiProviderType;
    baseUrl: string;
    model: string;
    compatibilitySolution?: OpenAICompatibilitySolution;
}> = [
        { label: 'Gemini', provider: 'gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.0-flash' },
        { label: 'OpenAI', provider: 'openai', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
        { label: 'Claude', provider: 'claude', baseUrl: 'https://api.anthropic.com/v1', model: 'claude-3-5-sonnet-latest' },
        { label: 'DeepSeek', provider: 'deepseek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
        { label: 'Mistral AI', provider: 'mistral', baseUrl: 'https://api.mistral.ai/v1', model: 'mistral-large-latest' },
        { label: 'Groq', provider: 'groq', baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
        { label: 'xAI (Grok)', provider: 'xai', baseUrl: 'https://api.x.ai/v1', model: 'grok-beta' },
        { label: 'Perplexity', provider: 'perplexity', baseUrl: 'https://api.perplexity.ai', model: 'llama-3-sonar-large-32k-online' },
        { label: 'Cohere', provider: 'cohere', baseUrl: 'https://api.cohere.ai/v2', model: 'command-r-plus' },
        { label: 'Moonshot', provider: 'moonshot', baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' },
        { label: 'OpenRouter', provider: 'openrouter', baseUrl: 'https://openrouter.ai/api/v1', model: 'google/gemini-2.0-flash-exp:free' },
        { label: 'Together AI', provider: 'together', baseUrl: 'https://api.together.xyz/v1', model: 'mistralai/Mixtral-8x7B-Instruct-v0.1' },
        { label: 'Fireworks AI', provider: 'fireworks', baseUrl: 'https://api.fireworks.ai/inference/v1', model: 'accounts/fireworks/models/llama-v3p1-70b-instruct' },
        { label: 'Cerebras', provider: 'cerebras', baseUrl: 'https://api.cerebras.ai/v1', model: 'llama3.1-70b' },
        { label: 'SambaNova', provider: 'sambanova', baseUrl: 'https://api.sambanova.ai/v1', model: 'Meta-Llama-3.1-70B-Instruct' },
        { label: 'HuggingFace', provider: 'huggingface', baseUrl: 'https://api-inference.huggingface.co/v1', model: 'gpt2' },
        { label: 'Cloudflare', provider: 'cloudflare', baseUrl: 'https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/ai/v1', model: '@cf/meta/llama-3-8b-instruct' },
        { label: 'Hệ thống (Nemotron-Free)', provider: 'worker', baseUrl: DEFAULT_TEXT_GEN_WORKER_URL, model: '@cf/zai-org/glm-4.7-flash' }
    ];

export const createApiConfigFromPreset = (preset: typeof API_PRESET_TEMPLATES[number]): ApiConfig => {
    const now = Date.now();
    return {
        id: generateConfigId(),
        name: `${preset.label} Cấu hình`,
        provider: preset.provider,
        compatibilitySolution: preset.compatibilitySolution,
        protocolOverride: 'auto',
        baseUrl: preset.baseUrl,
        apiKey: '',
        model: preset.model,
        maxTokens: undefined,
        temperature: undefined,
        createdAt: now,
        updatedAt: now
    };
};

export const createApiConfigTemplate = (
    provider: ApiProviderType,
    options?: { compatibilitySolution?: OpenAICompatibilitySolution }
): ApiConfig => {
    const now = Date.now();
    const preset = PROVIDER_DEFAULTS[provider];
    const compatibilitySolution = provider === 'openai_compatible'
        ? normalizeCompatibilitySolution(options?.compatibilitySolution)
        : undefined;

    return {
        id: generateConfigId(),
        name: `${PROVIDER_LABELS[provider]} Cấu hình`,
        provider: provider,
        compatibilitySolution: compatibilitySolution,
        protocolOverride: 'auto',
        baseUrl: provider === 'openai_compatible' && compatibilitySolution
            ? OPENAI_COMPATIBILITY_PRESETS[compatibilitySolution].baseUrl
            : preset.baseUrl,
        apiKey: '',
        model: preset.model,
        maxTokens: undefined,
        temperature: undefined,
        createdAt: now,
        updatedAt: now
    };
};

export const normalizeApiSettings = (raw: unknown): ApiSettings => {
    if (!raw || typeof raw !== 'object') {
        return createEmptyApiSettings();
    }

    const source = raw as any;
    let configs: ApiConfig[] = [];

    if (Array.isArray(source.configs)) {
        configs = source.configs.map((item: any, index: number) => normalizeSingleConfig(item, index));
    } else if (typeof source.baseUrl === 'string' || typeof source.apiKey === 'string' || typeof source.model === 'string') {
        configs = [
            normalizeSingleConfig(
                {
                    id: 'legacy_config',
                    name: 'Cấu hình cũ kế thừa',
                    provider: inferProvider(source.baseUrl),
                    baseUrl: source.baseUrl,
                    apiKey: source.apiKey,
                    model: source.model
                },
                0
            )
        ];
    }

    const normalizedConfigs = configs.filter(c => c.id && c.name && c.provider);

    // If no configs or no worker config, inject the default system worker
    if (normalizedConfigs.length === 0 || !normalizedConfigs.some(c => c.provider === 'worker')) {
        const systemWorker: ApiConfig = { // Changed ApiConfigState to ApiConfig
            id: 'nemotron-system-worker',
            name: 'Hệ thống (Nemotron-Free)',
            provider: 'worker',
            model: '@cf/zai-org/glm-4.7-flash',
            baseUrl: DEFAULT_TEXT_GEN_WORKER_URL, // Added baseUrl
            apiKey: '', // Added apiKey
            protocolOverride: 'auto', // Added protocolOverride
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        normalizedConfigs.push(systemWorker);
    }

    const activeConfigId = (() => {
        const candidate = readString(source.activeConfigId).trim();
        if (!candidate) return normalizedConfigs[0]?.id || null;
        return normalizedConfigs.some((cfg) => cfg.id === candidate) ? candidate : (normalizedConfigs[0]?.id || null);
    })();

    return {
        activeConfigId,
        configs: normalizedConfigs,
        featureModelPlaceholder: normalizeFeatureModelPlaceholder(source.featureModelPlaceholder ?? source['Function model placeholder'])
    };
};



export const getCurrentApiConfig = (settings: ApiSettings): ActiveApiConfig | null => {
    if (!settings || !Array.isArray(settings.configs) || settings.configs.length === 0) return null;
    const active = settings.configs.find(cfg => cfg.id === settings.activeConfigId) || settings.configs[0];
    if (!active) return null;
    return {
        id: active.id,
        name: active.name,
        provider: active.provider,
        protocolOverride: active.protocolOverride || 'auto',
        baseUrl: active.baseUrl,
        apiKey: active.apiKey,
        model: active.model,
        maxTokens: active.maxTokens,
        temperature: active.temperature,
        createdAt: active.createdAt,
        updatedAt: active.updatedAt
    };
};

export const getMainStoryApiConfig = (settings: ApiSettings): ActiveApiConfig | null => {
    const current = getCurrentApiConfig(settings);
    if (!isApiConfigUsable(current)) return null;

    const mainModel = readString(settings.featureModelPlaceholder?.mainStoryModel).trim();
    if (mainModel) {
        return {
            ...current,
            model: mainModel
        };
    }

    if (current.model?.trim()) {
        return current;
    }

    return null;
};

export const getRecallApiConfig = (settings: ApiSettings): ActiveApiConfig | null => {
    const current = getCurrentApiConfig(settings);
    if (!isApiConfigUsable(current)) return null;
    const enabled = Boolean(settings.featureModelPlaceholder?.recallIndependentModelToggle);
    if (!enabled) return null;
    const recallModel = readString(settings.featureModelPlaceholder?.recallModel).trim();
    if (!recallModel) return null;
    return {
        ...current,
        model: recallModel
    };
};

export const isApiConfigUsable = (config: ActiveApiConfig | null): config is ActiveApiConfig => {
    if (!config) return false;
    if (config.provider === 'worker') return true;
    return Boolean(config.baseUrl?.trim() && config.apiKey?.trim());
};

/**
 * Checks whether a text generation worker URL is available as a fallback.
 * When no API key is configured, this worker URL can be used for free AI generation.
 */
export const isWorkerUrlAvailable = (workerUrl?: string): boolean => {
    return Boolean(workerUrl?.trim());
};

/**
 * Determines whether the system has any usable AI backend:
 * either a configured API key or a worker URL fallback.
 */
export const hasAnyAiBackend = (config: ActiveApiConfig | null, workerUrl?: string): boolean => {
    return isApiConfigUsable(config) || isWorkerUrlAvailable(workerUrl);
};

