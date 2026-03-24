import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    ApiSettings as ApiSettingsType,
    ApiProviderType,
    OpenAICompatibilitySolution,
    RequestProtocolOverride,
    FeatureModelPlaceholderConfig,
    ApiConfig
} from '../../../types';
import GameButton from '../../ui/GameButton';
import ToggleSwitch from '../../ui/ToggleSwitch';
import InlineSelect from '../../ui/InlineSelect';
import * as aiService from '../../../services/aiService';
import ParallelogramSaveButton from '../../ui/ParallelogramSaveButton';
import {
    createApiConfigTemplate,
    createApiConfigFromPreset,
    API_PRESET_TEMPLATES,
    OPENAI_COMPATIBILITY_PRESETS,
    PROTOCOL_OVERRIDE_LABELS,
    PROVIDER_LABELS,
    normalizeApiSettings
} from '../../../utils/apiConfig';
import IconGlyph from '../../ui/Icon/IconGlyph';

interface Props {
    settings: ApiSettingsType;
    onSave: (settings: ApiSettingsType) => void;
}

type FeatureModelField = 'mainStoryModel' | 'worldEvolutionModel' | 'variableCalculationModel' | 'articleOptimizationModel';
type FeatureModelToggleField = 'worldEvolutionIndependentModelToggle' | 'variableCalculationIndependentModelToggle' | 'articleOptimizationIndependentModelToggle';

type FeatureModelRow = {
    id: string;
    modelKey: FeatureModelField;
    switchKey?: FeatureModelToggleField;
    label: string;
    hint: string;
};

const providerOptions: ApiProviderType[] = [
    'worker', 'gemini', 'claude', 'openai', 'deepseek',
    'mistral', 'groq', 'xai', 'perplexity', 'cohere',
    'moonshot', 'openrouter', 'huggingface', 'cloudflare',
    'together', 'fireworks', 'cerebras', 'sambanova',
    'openai_compatible'
];
const protocolOverrideOptions: RequestProtocolOverride[] = ['auto', 'openai', 'gemini', 'claude', 'deepseek'];
const compatibilitySolutionOptions: Array<{ value: OpenAICompatibilitySolution; label: string }> =
    (Object.keys(OPENAI_COMPATIBILITY_PRESETS) as OpenAICompatibilitySolution[]).map((preset) => ({
        value: preset,
        label: OPENAI_COMPATIBILITY_PRESETS[preset].label
    }));

const featureModelRows: FeatureModelRow[] = [
    { id: 'world', modelKey: 'worldEvolutionModel', switchKey: 'worldEvolutionIndependentModelToggle', label: 'Mô hình diễn biến thế giới', hint: 'Ví dụ: gemini-2.0-flash' },
    { id: 'vars', modelKey: 'variableCalculationModel', switchKey: 'variableCalculationIndependentModelToggle', label: 'Mô hình tính toán biến', hint: 'Ví dụ: deepseek-chat' },
    { id: 'polish', modelKey: 'articleOptimizationModel', switchKey: 'articleOptimizationIndependentModelToggle', label: 'Mô hình tối ưu bài viết', hint: 'Ví dụ: claude-3-5-sonnet-latest' }
];

const initFeatureModelList = (): Record<FeatureModelField, string[]> => ({
    mainStoryModel: [],
    worldEvolutionModel: [],
    variableCalculationModel: [],
    articleOptimizationModel: []
});

const initFeatureLoadStatus = (): Record<FeatureModelField, boolean> => ({
    mainStoryModel: false,
    worldEvolutionModel: false,
    variableCalculationModel: false,
    articleOptimizationModel: false
});

const ApiSettings: React.FC<Props> = ({ settings, onSave }) => {
    const [form, setForm] = useState<ApiSettingsType>(() => normalizeApiSettings(settings));
    const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
    const [featureModelOptions, setFeatureModelOptions] = useState<Record<FeatureModelField, string[]>>(initFeatureModelList);
    const [featureModelLoading, setFeatureModelLoading] = useState<Record<FeatureModelField, boolean>>(initFeatureLoadStatus);
    const [message, setMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [newProvider, setNewProvider] = useState<ApiProviderType>('openai');
    const [newCompatiblePreset, setNewCompatiblePreset] = useState<OpenAICompatibilitySolution>('custom');
    const [testingConnection, setTestingConnection] = useState(false);
    const [testResultModal, setTestResultModal] = useState<{
        open: boolean;
        title: string;
        content: string;
        ok: boolean;
    }>({ open: false, title: '', content: '', ok: false });

    useEffect(() => {
        const normalized = normalizeApiSettings(settings);
        setForm(normalized);
        setSelectedConfigId(normalized.activeConfigId || normalized.configs[0]?.id || null);
        setFeatureModelOptions(initFeatureModelList());
        setFeatureModelLoading(initFeatureLoadStatus());
    }, [settings]);

    const activeConfig = useMemo<ApiConfig | null>(() => {
        if (!form.configs.length) return null;
        const selected = form.configs.find((cfg) => cfg.id === selectedConfigId);
        return selected || form.configs[0] || null;
    }, [form.configs, selectedConfigId]);

    const mainStoryParseModel = useMemo(() => {
        return (form.featureModelPlaceholder.mainStoryModel || '').trim();
    }, [form.featureModelPlaceholder.mainStoryModel]);

    const updateActiveConfig = (patch: Partial<ApiConfig>) => {
        if (!activeConfig) return;
        setForm(prev => ({
            ...prev,
            activeConfigId: activeConfig.id,
            configs: prev.configs.map(cfg => cfg.id === activeConfig.id ? { ...cfg, ...patch, updatedAt: Date.now() } : cfg)
        }));
    };

    const updatePlaceholder = <K extends keyof FeatureModelPlaceholderConfig>(key: K, value: FeatureModelPlaceholderConfig[K]) => {
        setForm(prev => ({
            ...prev,
            featureModelPlaceholder: {
                ...prev.featureModelPlaceholder,
                [key]: value
            }
        }));
    };

    const fetchModelsFromCurrentConfig = async (): Promise<string[] | null> => {
        if (activeConfig?.provider === 'worker') {
            return ['nvidia/Llama-3.1-Nemotron-70B-Instruct-HF'];
        }
        if (!activeConfig?.apiKey || !activeConfig?.baseUrl) {
            setMessage('Vui lòng điền API Key và Base URL của cấu hình hiện tại trước');
            return null;
        }
        try {
            const base = activeConfig.baseUrl.replace(/\/+$/, '');
            const normalized = base.replace(/\/v1$/i, '');
            const candidateUrls = Array.from(new Set([
                `${normalized}/v1/models`,
                `${normalized}/models`,
                `${base}/models`,
                // Specifically for Google Gemini OpenAI Compatible interface
                ...(base.includes('generativelanguage.googleapis.com')
                    ? [`${normalized}/openai/v1/models`]
                    : [])
            ]));
            for (const url of candidateUrls) {
                try {
                    const res = await fetch(url, {
                        headers: {
                            Authorization: `Bearer ${activeConfig.apiKey}`
                        }
                    });
                    if (!res.ok) continue;
                    const data = await res.json();
                    if (data && Array.isArray(data.data)) {
                        return data.data.map((m: any) => m?.id).filter(Boolean);
                    }
                } catch (err) {
                    console.error(`Failed to fetch from ${url}:`, err);
                    continue;
                }
            }
            setMessage('Lấy thất bại: Lỗi định dạng trả về hoặc không tìm thấy đường dẫn');
            return null;
        } catch (e: any) {
            setMessage(`Lấy thất bại: ${e.message}`);
            return null;
        }
    };

    const handleFetchFeatureModels = async (key: FeatureModelField, label: string) => {
        setFeatureModelLoading(prev => ({ ...prev, [key]: true }));
        setMessage('');
        const result = await fetchModelsFromCurrentConfig();
        if (result) {
            setFeatureModelOptions(prev => ({ ...prev, [key]: result }));
            setMessage(`${label} Lấy danh sách mô hình thành công`);
        }
        setFeatureModelLoading(prev => ({ ...prev, [key]: false }));
    };

    const handleToggleFeatureIndependent = (switchKey: FeatureModelToggleField, modelKey: FeatureModelField, checked: boolean) => {
        setForm(prev => {
            const currentModel = (prev.featureModelPlaceholder[modelKey] || '').trim();
            const nextModel = checked
                ? (currentModel || mainStoryParseModel || '')
                : '';
            return {
                ...prev,
                featureModelPlaceholder: {
                    ...prev.featureModelPlaceholder,
                    [switchKey]: checked,
                    [modelKey]: nextModel
                }
            };
        });
    };

    const handleCreateConfig = () => {
        const created = createApiConfigTemplate(newProvider, {
            compatibilitySolution: newProvider === 'openai_compatible' ? newCompatiblePreset : undefined
        });
        setForm(prev => {
            const nextConfigs = [...prev.configs, created];
            return {
                ...prev,
                activeConfigId: created.id,
                configs: nextConfigs
            };
        });
        setSelectedConfigId(created.id);
        setFeatureModelOptions(initFeatureModelList());
        setFeatureModelLoading(initFeatureLoadStatus());
        setMessage(`Đã thêm cấu hình ${PROVIDER_LABELS[newProvider]}, vui lòng điền thông tin rồi lưu.`);
    };

    const handleDeleteActive = () => {
        if (!activeConfig) return;
        setForm(prev => {
            const nextConfigs = prev.configs.filter(cfg => cfg.id !== activeConfig.id);
            const fallbackId = nextConfigs[0]?.id || null;
            setSelectedConfigId(fallbackId);
            return {
                ...prev,
                activeConfigId: fallbackId,
                configs: nextConfigs
            };
        });
        setFeatureModelOptions(initFeatureModelList());
        setFeatureModelLoading(initFeatureLoadStatus());
        setMessage('Đã xóa cấu hình.');
    };

    const handleSave = () => {
        const normalized = normalizeApiSettings({
            ...form,
            activeConfigId: selectedConfigId || form.activeConfigId
        });
        onSave(normalized);
        setForm(normalized);
        setSelectedConfigId(normalized.activeConfigId || normalized.configs[0]?.id || null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const handleTestConnection = async () => {
        if (!activeConfig) return;
        const modelForTest = (form.featureModelPlaceholder.mainStoryModel || '').trim() || (activeConfig.model || '').trim();
        if (activeConfig.provider !== 'worker' && (!activeConfig.apiKey || !activeConfig.baseUrl)) {
            setMessage('Vui lòng điền API Key và Base URL của cấu hình hiện tại');
            return;
        }
        if (!modelForTest) {
            setMessage('Vui lòng điền tên mô hình cốt truyện chính hoặc cấu hình mô hình mặc định trước.');
            return;
        }
        setMessage('');
        setTestingConnection(true);
        try {
            const result = await aiService.testConnection({
                ...activeConfig,
                model: modelForTest
            });
            const title = result.ok ? 'Kiểm tra kết nối thành công' : 'Kiểm tra kết nối thất bại';
            const meta = [
                `Cấu hình: ${activeConfig.name || activeConfig.id}`,
                `Nhà cung cấp: ${PROVIDER_LABELS[activeConfig.provider]}`,
                `Mô hình: ${modelForTest}`,
                `Max Output Token: ${typeof activeConfig.maxTokens === 'number' ? activeConfig.maxTokens : 'Tự động ước tính'}`,
                `Nhiệt độ (Temperature): ${typeof activeConfig.temperature === 'number' ? activeConfig.temperature : 'Mặc định theo bối cảnh'}`,
                `Base URL: ${activeConfig.baseUrl}`,
                '',
                '---',
                '',
                result.detail
            ].join('\n');
            setTestResultModal({
                open: true,
                title,
                content: meta,
                ok: result.ok
            });
        } catch (e: any) {
            setTestResultModal({
                open: true,
                title: 'Kiểm tra kết nối thất bại',
                content: String(e?.message || 'Lỗi không xác định'),
                ok: false
            });
        } finally {
            setTestingConnection(false);
        }
    };

    return (
        <div className="space-y-6 text-sm animate-fadeIn">
            <div className="flex justify-between items-end border-b border-wuxia-gold/30 pb-4 mb-6">
                <div className="space-y-1">
                    <h3 className="text-wuxia-gold font-sans font-black text-2xl tracking-tighter">Trung tâm cấu hình API</h3>
                    <p className="text-[10px] text-wuxia-gold/60 tracking-[0.3em] font-bold uppercase pl-1">Cấu hình API</p>
                </div>
            </div>

            <div className="rounded-md border border-wuxia-gold/20 bg-ink-black/40 p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-wuxia-gold font-bold">Sử dụng Hệ thống Gemini 3 Flash mặc định</div>
                        <div className="text-xs text-paper-white/40 mt-1">Bật để sử dụng mô hình Gemini 3 Flash được cấu hình sẵn của hệ thống thay vì API key của bạn.</div>
                    </div>
                    <ToggleSwitch
                        checked={form.useSystemGemini !== false}
                        onChange={(checked) => setForm(prev => ({ ...prev, useSystemGemini: checked }))}
                    />
                </div>
            </div>

            {form.useSystemGemini !== false ? (
                <div className="rounded-md border border-wuxia-gold/20 bg-ink-black/40 p-6 text-center">
                    <div className="text-wuxia-gold font-bold text-lg mb-2">Hệ thống đang sử dụng Gemini 3 Flash</div>
                    <div className="text-sm text-paper-white/60">
                        Bạn đang sử dụng mô hình Gemini 3 Flash mặc định của hệ thống. 
                        Tắt tùy chọn trên để cấu hình API key của riêng bạn.
                    </div>
                </div>
            ) : (
                <>
                    <div className="rounded-md border border-wuxia-gold/20 bg-ink-black/40 p-4 space-y-4">
                        <div className="text-xs text-paper-white/40">Hỗ trợ hiện tại: Gemini / Claude / OpenAI / DeepSeek / API Tương thích OpenAI</div>
                        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                            <div className="space-y-2">
                                <label className="text-sm text-wuxia-gold font-bold">Thêm cấu hình mới - Nhà cung cấp</label>
                                <InlineSelect
                                    value={newProvider}
                                    options={providerOptions.map((provider) => ({
                                        value: provider,
                                        label: PROVIDER_LABELS[provider]
                                    }))}
                                    onChange={(provider) => setNewProvider(provider)}
                                    buttonClassName="bg-ink-black/20 border-wuxia-gold/20 hover:border-wuxia-gold/50 py-2.5"
                                />
                            </div>

                            {newProvider === 'openai_compatible' && (
                                <div className="space-y-2">
                                    <label className="text-sm text-wuxia-gold font-bold">Giải pháp tương thích OpenAI</label>
                                    <InlineSelect
                                        value={newCompatiblePreset}
                                        options={compatibilitySolutionOptions}
                                        onChange={(preset) => setNewCompatiblePreset(preset)}
                                        buttonClassName="bg-ink-black/20 border-wuxia-gold/20 hover:border-wuxia-gold/50 py-2.5"
                                    />
                                </div>
                            )}

                            <div className="md:self-end">
                                <GameButton onClick={handleCreateConfig} variant="secondary" className="w-full md:w-auto">Thêm cấu hình mới</GameButton>
                            </div>
                        </div>
                    </div>

                    {form.configs.length === 0 ? (
                <div className="rounded-md border border-dashed border-wuxia-gold/20 bg-ink-black/20 p-6 space-y-4">
                    <div className="text-center text-paper-white/40">
                        Chưa có cấu hình API nào. Chọn mẫu nhanh bên dưới hoặc nhấp "Thêm cấu hình mới" ở trên.
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {API_PRESET_TEMPLATES.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => {
                                    const created = createApiConfigFromPreset(preset);
                                    setForm(prev => ({
                                        ...prev,
                                        activeConfigId: created.id,
                                        configs: [...prev.configs, created]
                                    }));
                                    setSelectedConfigId(created.id);
                                    setFeatureModelOptions(initFeatureModelList());
                                    setFeatureModelLoading(initFeatureLoadStatus());
                                    setMessage(`Đã thêm mẫu ${preset.label}, vui lòng điền API Key rồi lưu.`);
                                }}
                                className="flex flex-col items-center gap-1 p-3 rounded-lg border border-wuxia-gold/20 bg-ink-black/30 hover:border-wuxia-gold/60 hover:bg-wuxia-gold/10 transition-all group"
                            >
                                <span className="text-sm font-bold text-wuxia-gold/80 group-hover:text-wuxia-gold">{preset.label}</span>
                                <span className="text-[10px] text-paper-white/40 truncate max-w-full">{preset.model}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
                        {form.configs.map(cfg => (
                            <button
                                key={cfg.id}
                                onClick={() => {
                                    setSelectedConfigId(cfg.id);
                                    setForm(prev => ({ ...prev, activeConfigId: cfg.id }));
                                    setFeatureModelOptions(initFeatureModelList());
                                    setFeatureModelLoading(initFeatureLoadStatus());
                                }}
                                className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${activeConfig?.id === cfg.id
                                        ? 'border-wuxia-gold bg-wuxia-gold/10 text-wuxia-gold shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                                        : 'border-wuxia-gold/20 bg-ink-black/20 text-paper-white/80 hover:border-wuxia-gold/50 hover:bg-ink-black/40'
                                    }`}
                            >
                                <div className="font-bold truncate">{cfg.name || 'Cấu hình không tên'}</div>
                                <div className="text-[11px] opacity-80 mt-1">{PROVIDER_LABELS[cfg.provider]}</div>
                            </button>
                        ))}
                    </div>

                    {activeConfig && (
                        <div className="space-y-4 pb-12 min-w-0 overflow-hidden">
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm text-wuxia-gold font-bold">Tên cấu hình</label>
                                    <input
                                        type="text"
                                        value={activeConfig.name}
                                        onChange={(e) => updateActiveConfig({ name: e.target.value })}
                                        placeholder="Ví dụ: Cấu hình tạo cốt truyện chính"
                                        className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold/50 p-3 text-paper-white outline-none rounded-md transition-all placeholder:text-wuxia-gold/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-wuxia-gold font-bold">Nhà cung cấp</label>
                                    <input
                                        type="text"
                                        value={PROVIDER_LABELS[activeConfig.provider]}
                                        disabled
                                        className="w-full bg-ink-black/20 border border-wuxia-gold/10 p-3 text-wuxia-gold/40 rounded-md cursor-not-allowed opacity-70"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-wuxia-gold font-bold">Ghi đè giao thức yêu cầu</label>
                                <InlineSelect
                                    value={activeConfig.protocolOverride || 'auto'}
                                    options={protocolOverrideOptions.map((mode) => ({
                                        value: mode,
                                        label: PROTOCOL_OVERRIDE_LABELS[mode]
                                    }))}
                                    onChange={(mode) => updateActiveConfig({ protocolOverride: mode })}
                                    buttonClassName="bg-transparent border-wuxia-gold/20 hover:border-wuxia-gold/50 py-2.5"
                                />
                                <div className="text-[11px] text-paper-white/40">
                                    Mặc định "Tự động nhận dạng". Nếu tên mô hình API đối tác thứ 3 không khớp với giao thức, có thể bắt buộc chuyển đổi ở đây.
                                </div>
                            </div>

                            {activeConfig.provider === 'openai_compatible' && (
                                <div className="space-y-2">
                                    <label className="text-sm text-wuxia-gold font-bold">Giải pháp tương thích OpenAI</label>
                                    <InlineSelect
                                        value={activeConfig.compatibilitySolution || 'custom'}
                                        options={compatibilitySolutionOptions}
                                        onChange={(nextPreset) => {
                                            const presetUrl = OPENAI_COMPATIBILITY_PRESETS[nextPreset].baseUrl;
                                            updateActiveConfig({
                                                compatibilitySolution: nextPreset,
                                                baseUrl: presetUrl || activeConfig.baseUrl
                                            });
                                        }}
                                        buttonClassName="bg-transparent border-wuxia-gold/20 hover:border-wuxia-gold/50 py-2.5"
                                    />
                                </div>
                            )}

                            {activeConfig.provider !== 'worker' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm text-wuxia-gold font-bold">Địa chỉ API (Base URL)</label>
                                        <input
                                            type="text"
                                            value={activeConfig.baseUrl}
                                            onChange={(e) => updateActiveConfig({ baseUrl: e.target.value })}
                                            placeholder="https://api.openai.com/v1"
                                            className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold/50 p-3 text-paper-white outline-none rounded-md transition-all placeholder:text-wuxia-gold/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-wuxia-gold font-bold">Mật khẩu (API Key)</label>
                                        <input
                                            type="password"
                                            value={activeConfig.apiKey}
                                            onChange={(e) => updateActiveConfig({ apiKey: e.target.value })}
                                            placeholder="sk-..."
                                            className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold/50 p-3 text-paper-white outline-none rounded-md transition-all placeholder:text-wuxia-gold/20"
                                        />
                                    </div>
                                </>
                            )}

                            {activeConfig.provider === 'worker' && (
                                <div className="space-y-4">
                                    <div className="p-3 rounded border border-wuxia-gold/20 bg-wuxia-gold/5 text-[10px] text-wuxia-gold/80 italic leading-relaxed">
                                        Đây là cấu hình API hệ thống (Nemotron). Mặc định sử dụng các worker dự phòng từ server.
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-wuxia-gold font-bold">Worker URL (Tùy chọn)</label>
                                        <input
                                            type="text"
                                            value={activeConfig.baseUrl || ''}
                                            onChange={(e) => updateActiveConfig({ baseUrl: e.target.value.trim() })}
                                            placeholder="https://..."
                                            className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold/50 p-3 text-paper-white outline-none rounded-md transition-all placeholder:text-wuxia-gold/20 font-mono text-xs"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-sm text-wuxia-gold font-bold">Max Output Token (Tùy chọn)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[8192, 32768, 65536, 131000].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => updateActiveConfig({ maxTokens: val })}
                                            className={`py-2 px-1 rounded border text-xs transition-colors ${activeConfig.maxTokens === val
                                                    ? 'border-wuxia-gold bg-wuxia-gold/20 text-wuxia-gold shadow-[0_0_10px_rgba(255,215,0,0.1)]'
                                                    : 'border-wuxia-gold/20 bg-transparent text-paper-white/40 hover:border-wuxia-gold/50 hover:bg-ink-black/40'
                                                }`}
                                        >
                                            {val >= 1024 ? `${val / 1024}K` : val}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => updateActiveConfig({ maxTokens: 0 })}
                                        className={`py-2 px-1 rounded border text-xs transition-colors ${activeConfig.maxTokens !== 8192 && activeConfig.maxTokens !== 32768 && activeConfig.maxTokens !== 65536 && activeConfig.maxTokens !== 131000
                                                ? 'border-wuxia-gold bg-wuxia-gold/20 text-wuxia-gold shadow-[0_0_10px_rgba(255,215,0,0.1)]'
                                                : 'border-wuxia-gold/20 bg-transparent text-paper-white/40 hover:border-wuxia-gold/50 hover:bg-ink-black/40'
                                            }`}
                                    >
                                        Tùy chỉnh
                                    </button>
                                </div>
                                {activeConfig.maxTokens !== 8192 && activeConfig.maxTokens !== 32768 && activeConfig.maxTokens !== 65536 && activeConfig.maxTokens !== 131000 && (
                                    <input
                                        type="number"
                                        value={activeConfig.maxTokens || ''}
                                        onChange={(e) => updateActiveConfig({ maxTokens: parseInt(e.target.value) || undefined })}
                                        placeholder="Nhập Token tối đa tùy chỉnh"
                                        className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold/50 p-2 text-paper-white text-sm rounded-md placeholder:text-wuxia-gold/20"
                                    />
                                )}
                                <div className="text-[10px] text-paper-white/30">Để trống sẽ gửi mặc định là 8192 (hoặc 131.000 cho Worker) và tự động giới hạn tùy theo ngữ cảnh của mô hình.</div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm text-wuxia-gold font-bold">Nhiệt độ (Temperature)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[0, 0.3, 0.7, 1.0, 1.5, 2.0].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => updateActiveConfig({ temperature: val })}
                                            className={`py-2 px-1 rounded border text-xs transition-colors ${activeConfig.temperature === val
                                                    ? 'border-wuxia-gold bg-wuxia-gold/20 text-wuxia-gold shadow-[0_0_10px_rgba(255,215,0,0.1)]'
                                                    : 'border-wuxia-gold/20 bg-ink-black/20 text-paper-white/40 hover:border-wuxia-gold/50 hover:bg-ink-black/40'
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => updateActiveConfig({ temperature: undefined })}
                                        className={`py-2 px-1 rounded border text-xs transition-colors ${activeConfig.temperature === undefined
                                            ? 'border-wuxia-gold bg-wuxia-gold/20 text-wuxia-gold'
                                            : 'border-wuxia-gold/20 bg-ink-black/20 text-paper-white/40 hover:border-wuxia-gold/50 hover:bg-ink-black/40'
                                        }`}
                                    >
                                        Mặc định
                                    </button>
                                </div>
                                <div className="text-[11px] text-wuxia-gold/60">
                                    Nhiệt độ (Temperature) ảnh hưởng độ sáng tạo của mô hình. 0.0=sáng tạo ít/logic cao, 2.0=sáng tạo nhiều/logic thấp. "Mặc định" sẽ để Game tự chọn nhiệt độ tối ưu cho từng bối cảnh.
                                </div>
                            </div>


                            <div className="grid grid-cols-1 gap-3 pt-2">
                                <GameButton
                                    onClick={handleTestConnection}
                                    variant="secondary"
                                    className="w-full py-3"
                                    disabled={testingConnection}
                                >
                                    {testingConnection ? 'Đang kiểm tra kết nối...' : 'Kiểm tra kết nối'}
                                </GameButton>
                                <div className="text-[10px] text-center text-wuxia-gold/40">Sẽ gửi một yêu cầu rất ngắn để kiểm tra kết nối API và độ khả dụng của mô hình hiện tại.</div>

                                <GameButton
                                    onClick={handleDeleteActive}
                                    variant="danger"
                                    className="w-full py-2 opacity-70 hover:opacity-100"
                                >
                                    Xóa cấu hình hiện tại
                                </GameButton>
                            </div>

                            {/* Main Story Model Section */}
                            <div className="rounded-md border border-wuxia-red/20 bg-ink-black/40 p-4 space-y-4">
                                <h4 className="text-wuxia-red font-serif font-bold">Mô hình cốt truyện chính</h4>
                                <div className="text-[11px] text-paper-white/40">Chỉ có mô hình cốt truyện chính ở đây. Các mô hình tính năng như ký ức, toán biến, diễn biến thế giới, sinh ảnh... vui lòng thiết lập ở trang cấu hình riêng tư của tính năng đó.</div>

                                <div className="rounded-md border border-wuxia-red/20 bg-ink-black/20 p-4 space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <label className="text-sm text-wuxia-red font-bold">mainStoryModel (Bắt buộc)</label>
                                        <GameButton
                                            onClick={() => handleFetchFeatureModels('mainStoryModel', 'mainStoryModel')}
                                            variant="secondary"
                                            className="px-4 py-1.5 text-xs h-auto min-h-0 border-wuxia-red/50 shadow-[0_0_10px_rgba(255,50,50,0.2)]"
                                            disabled={featureModelLoading.mainStoryModel}
                                        >
                                            {featureModelLoading.mainStoryModel ? '...' : 'Lấy danh sách'}
                                        </GameButton>
                                    </div>

                                    <div className="space-y-4">
                                        <InlineSelect
                                            value={form.featureModelPlaceholder.mainStoryModel}
                                            options={Array.from(new Set([...featureModelOptions.mainStoryModel, form.featureModelPlaceholder.mainStoryModel])).filter(Boolean).map((model) => ({
                                                value: model,
                                                label: model
                                            }))}
                                            onChange={(model) => updatePlaceholder('mainStoryModel', model)}
                                            placeholder={featureModelOptions.mainStoryModel.length ? 'Vui lòng chọn mô hình' : 'Vui lòng nhấp Lấy danh sách trước'}
                                            buttonClassName="bg-transparent border-wuxia-red/20 hover:border-wuxia-red/50 py-3 text-wuxia-red"
                                            panelClassName="max-w-full"
                                        />

                                        <div className="space-y-2">
                                            <label className="text-xs text-paper-white/40">Chỉnh sửa tên mô hình</label>
                                            <input
                                                type="text"
                                                value={form.featureModelPlaceholder.mainStoryModel}
                                                onChange={(e) => updatePlaceholder('mainStoryModel', e.target.value)}
                                                placeholder="models/gemini-2.0-flash"
                                                className="w-full bg-transparent border border-wuxia-red/20 focus:border-wuxia-red/50 p-3 text-paper-white outline-none rounded-md transition-all font-mono text-sm placeholder:text-wuxia-red/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Auxiliary Features Split Model */}
                            <div className="rounded-md border border-wuxia-gold/20 bg-ink-black/40 p-4 space-y-4">
                                <h4 className="text-wuxia-gold font-serif font-bold">Mô hình phân chia tính năng phụ (Mẫu)</h4>
                                <div className="text-[11px] text-paper-white/40">Mặc định tuân theo mô hình cốt truyện chính. Chỉ khi bật "Mô hình độc lập", tính năng đó mới sử dụng cấu hình mô hình riêng.</div>

                                <div className="grid gap-4">
                                    {featureModelRows.map((row) => {
                                        const independentEnabled = row.switchKey ? Boolean(form.featureModelPlaceholder[row.switchKey]) : true;
                                        const rawValue = (form.featureModelPlaceholder[row.modelKey] || '') as string;
                                        const displayValue = independentEnabled ? rawValue : mainStoryParseModel;
                                        const options = Array.from(
                                            new Set(
                                                [
                                                    ...featureModelOptions[row.modelKey],
                                                    rawValue,
                                                    mainStoryParseModel
                                                ]
                                                    .map(item => (item || '').trim())
                                                    .filter(Boolean)
                                            )
                                        );
                                        const disabled = !independentEnabled;
                                        const loading = featureModelLoading[row.modelKey];

                                        return (
                                            <div key={row.id} className="rounded-md border border-wuxia-red/20 bg-ink-black/40 p-4 space-y-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex flex-col">
                                                        <label className="text-sm text-wuxia-red font-bold">{row.label}</label>
                                                        {row.switchKey && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <ToggleSwitch
                                                                    checked={independentEnabled}
                                                                    onChange={(next) => handleToggleFeatureIndependent(row.switchKey!, row.modelKey, next)}
                                                                    ariaLabel={`Chuyển đổi ${row.label}`}
                                                                />
                                                                <span className="text-[10px] text-paper-white/40 font-medium">Mô hình độc lập</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <GameButton
                                                        onClick={() => handleFetchFeatureModels(row.modelKey, row.label)}
                                                        variant="secondary"
                                                        className="px-4 py-1.5 text-xs h-auto min-h-0 flex-shrink-0 border-wuxia-red/50 shadow-[0_0_10px_rgba(var(--c-wuxia-red),0.1)]"
                                                        disabled={loading}
                                                    >
                                                        {loading ? '...' : 'Lấy danh sách'}
                                                    </GameButton>
                                                </div>

                                                <div className="space-y-4">
                                                    <InlineSelect
                                                        value={displayValue}
                                                        options={options.map((model) => ({
                                                            value: model,
                                                            label: model
                                                        }))}
                                                        onChange={(model) => updatePlaceholder(row.modelKey, model)}
                                                        disabled={disabled || options.length === 0}
                                                        placeholder={disabled
                                                            ? `Theo cốt truyện chính: ${mainStoryParseModel || 'Chưa thiết lập'}`
                                                            : (options.length ? 'Vui lòng chọn mô hình' : 'Vui lòng nhấp Lấy danh sách trước')}
                                                        buttonClassName={disabled
                                                            ? 'bg-transparent border-wuxia-red/10 py-3 opacity-60'
                                                            : 'bg-transparent border-wuxia-red/20 hover:border-wuxia-red/50 py-3 text-wuxia-red'}
                                                        panelClassName="max-w-full"
                                                    />

                                                    {!disabled && (
                                                        <div className="space-y-2">
                                                            <label className="text-xs text-paper-white/40">Chỉnh sửa tên mô hình</label>
                                                            <input
                                                                type="text"
                                                                value={rawValue}
                                                                onChange={(e) => updatePlaceholder(row.modelKey, e.target.value)}
                                                                placeholder={row.hint}
                                                                className="w-full bg-transparent border border-wuxia-red/20 focus:border-wuxia-red/50 p-3 text-paper-white outline-none rounded-md transition-all font-mono text-xs placeholder:text-wuxia-red/20"
                                                            />
                                                        </div>
                                                    )}

                                                    {disabled && (
                                                        <div className="text-[11px] text-paper-white/40 italic bg-ink-black/20 p-2 rounded border border-wuxia-red/20 text-center">
                                                            Đang sử dụng mô hình cốt truyện chính: <span className="text-wuxia-red font-bold">{mainStoryParseModel || 'Chưa thiết lập'}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )}

    {message && <p className="text-sm text-wuxia-red font-bold animate-pulse mt-4 text-center">{message}</p>}

            <div className="pt-4 sticky bottom-0 bg-ink-black/80 backdrop-blur-md pb-4 z-20">
                <ParallelogramSaveButton
                    onClick={handleSave}
                    className="w-full"
                />
            </div>

            {testResultModal.open && createPortal(
                <div
                    className="fixed inset-0 z-[900] flex items-center justify-center bg-ink-black/70 backdrop-blur-sm p-4"
                    onClick={() => setTestResultModal(prev => ({ ...prev, open: false }))}
                >
                    <div
                        className="w-full max-w-3xl rounded-lg border border-wuxia-gold/30 bg-ink-black/90 p-5 shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <h4 className={`text-lg font-serif font-bold text-wuxia-gold`}>
                                {testResultModal.title || 'Kết quả kiểm tra kết nối'}
                            </h4>
                                <button
                                type="button"
                                onClick={() => setTestResultModal(prev => ({ ...prev, open: false }))}
                                className="text-wuxia-gold/50 hover:text-paper-white transition-all flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10"
                                aria-label="Đóng kết quả kiểm tra"
                            >
                                <IconGlyph name="close" className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar rounded-md border border-wuxia-gold/20 bg-ink-black/40 p-3 text-xs text-paper-white/90 whitespace-pre-wrap">
                            {testResultModal.content}
                        </div>
                        <div className="pt-4 flex justify-end">
                            <GameButton
                                onClick={() => setTestResultModal(prev => ({ ...prev, open: false }))}
                                variant="primary"
                                className="px-6"
                            >
                                Đóng
                            </GameButton>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ApiSettings;
