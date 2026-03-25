import React, { useState, useEffect, useMemo } from 'react';
import { InterfaceSettingsStructure } from '../../../types';
import GameButton from '../../ui/GameButton';
import ToggleSwitch from '../../ui/ToggleSwitch';
import InlineSelect from '../../ui/InlineSelect';
import { defaultArticleOptimizationPrompt } from '../../../prompts/runtime/defaults';
import { useModelOptions } from '../../../hooks/useModelOptions';
import ParallelogramSaveButton from '../../ui/ParallelogramSaveButton';
import { API_PRESET_TEMPLATES, getCurrentApiConfig } from '../../../utils/apiConfig';

interface Props {
    settings: InterfaceSettingsStructure;
    onSave: (config: InterfaceSettingsStructure) => void;
}

const ArticleOptimizationSettings: React.FC<Props> = ({ settings, onSave }) => {
    const fmp = settings.featureModelPlaceholder;
    const activeMainConfig = getCurrentApiConfig(settings);

    // Use the global model options hook
    const { options: models, loading: isFetchingModels, fetchModels } = useModelOptions(settings);

    const [message, setMessage] = useState('');
    const [showKey, setShowKey] = useState(false);

    // Combine models from all categories plus current selection
    const allModelOptions = useMemo(() => {
        const uniqueModels = Array.from(new Set([
            ...models.chatgpt,
            ...models.gemini,
            ...models.claude,
            ...models.deepseek,
            ...models.all,
            fmp.articleOptimizationModel || ''
        ])).filter(Boolean);

        return uniqueModels.map(m => ({ value: m, label: m }));
    }, [models, fmp.articleOptimizationModel]);

    const handleSave = () => {
        onSave(settings);
        setMessage('Đã lưu cài đặt');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-10">
            <div className="flex justify-between items-end border-b border-wuxia-gold/30 pb-4">
                <div className="space-y-1">
                    <h3 className="text-wuxia-gold font-sans font-black text-2xl tracking-tighter">Trau chuốt văn từ</h3>
                    <p className="text-[10px] text-paper-white/40 tracking-[0.3em] font-bold uppercase pl-1 text-shadow-gold">Article Optimization Engine</p>
                </div>
                {message && (
                    <div className={`text-[10px] font-bold animate-pulse px-3 py-1 bg-black/20 border border-wuxia-gold/20 rounded-full ${message.includes('thất bại') || message.includes('Lỗi') ? 'text-wuxia-red' : 'text-wuxia-gold'}`}>
                        {message}
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-wuxia-gold/20 bg-transparent p-6 space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                <div className="text-xs text-paper-white/50 leading-relaxed font-medium opacity-80 pl-1">
                    Cấu hình đang dùng: <span className={activeMainConfig?.name ? "text-wuxia-gold font-bold" : "text-wuxia-gold/60 italic"}>{activeMainConfig?.name || 'Chưa thiết lập'}</span> ({activeMainConfig?.provider || 'N/A'}).
                    Khi bật, một mô hình độc lập sẽ tự động trau chuốt văn bản <code className="text-wuxia-gold font-black">{'<Chính văn>'}</code>; Có thể chỉ định riêng Base URL và API Key, để trống sẽ dùng lại cấu hình chính.
                </div>

                <div className="flex items-center justify-between p-5 bg-transparent border border-wuxia-gold/10 rounded-xl hover:bg-wuxia-gold/5 transition-all duration-300">
                    <span className="text-sm text-paper-white/80">Bật mô hình tối ưu hóa văn bản độc lập</span>
                    <ToggleSwitch
                        checked={fmp.articleOptimizationIndependentModelToggle ?? false}
                        onChange={(checked) => onSave({ ...settings, featureModelPlaceholder: { ...fmp, articleOptimizationIndependentModelToggle: checked } })}
                    />
                </div>

                <div className="space-y-4">
                    <div className="mb-4">
                        <label className="text-sm font-bold text-wuxia-red/80 font-serif tracking-wide uppercase mb-3 block">
                            Chọn mẫu API nhanh
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {API_PRESET_TEMPLATES.map((preset) => {
                                const isActive = fmp.articleOptimizationIndependentApiUrl === preset.baseUrl && fmp.articleOptimizationModel === preset.model;
                                return (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => onSave({
                                            ...settings,
                                            featureModelPlaceholder: {
                                                ...fmp,
                                                articleOptimizationModel: preset.model,
                                                articleOptimizationIndependentApiUrl: preset.baseUrl
                                            }
                                        })}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all group ${isActive
                                            ? 'border-wuxia-gold bg-wuxia-gold/10 text-wuxia-gold shadow-[0_0_15px_rgba(255,215,0,0.15)]'
                                            : 'border-wuxia-gold/20 bg-black/30 hover:border-wuxia-gold/60 hover:bg-wuxia-gold/10'
                                            }`}
                                    >
                                        <span className={`text-sm font-bold ${isActive ? 'text-wuxia-gold' : 'text-wuxia-gold/80 group-hover:text-wuxia-gold'}`}>{preset.label}</span>
                                        <span className="text-[10px] text-paper-white/40 truncate max-w-full">{preset.model}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-[10px] text-paper-white/40 ml-1 mt-2">Chọn mẫu sẽ tự động điền Base URL và mô hình. Bạn vẫn cần nhập API Key bên dưới.</p>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <label className="text-sm font-bold text-wuxia-gold font-serif tracking-wide uppercase">
                                Chọn mô hình
                            </label>
                            <GameButton
                                onClick={fetchModels}
                                variant="secondary"
                                className="px-4 py-1 text-[10px] h-auto min-h-0 border-wuxia-gold/30 shadow-[0_0_10px_rgba(255,215,0,0.1)]"
                                disabled={isFetchingModels}
                            >
                                {isFetchingModels ? '...' : 'LẤY DANH SÁCH'}
                            </GameButton>
                        </div>
                        <div className="space-y-3">
                            <InlineSelect
                                options={allModelOptions}
                                value={fmp.articleOptimizationModel || ''}
                                onChange={(val) => onSave({ ...settings, featureModelPlaceholder: { ...fmp, articleOptimizationModel: val } })}
                                placeholder="-- Chọn mô hình trau chuốt --"
                                buttonClassName="bg-ink-black/40 border-wuxia-gold/20 hover:border-wuxia-gold/50 py-3 text-wuxia-gold text-xs font-mono"
                                panelClassName="max-w-full"
                            />
                            <input
                                type="text"
                                value={fmp.articleOptimizationModel || ''}
                                onChange={(e) => onSave({ ...settings, featureModelPlaceholder: { ...fmp, articleOptimizationModel: e.target.value } })}
                                className="w-full bg-transparent border border-wuxia-gold/20 rounded-lg px-4 py-3 text-paper-white focus:outline-none focus:border-wuxia-gold/40 transition-all placeholder:text-paper-white/20 font-mono text-sm"
                                placeholder="Hoặc nhập tên mô hình tùy chỉnh..."
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold text-wuxia-gold mb-2 font-serif tracking-wide uppercase">
                            API Key riêng (Tùy chọn)
                        </label>
                        <div className="relative group">
                            <input
                                type={showKey ? "text" : "password"}
                                value={fmp.articleOptimizationIndependentApiKey || ''}
                                onChange={(e) => onSave({ ...settings, featureModelPlaceholder: { ...fmp, articleOptimizationIndependentApiKey: e.target.value } })}
                                className="w-full bg-transparent border border-wuxia-gold/20 rounded-lg px-4 py-3 pr-12 text-paper-white focus:outline-none focus:border-wuxia-gold/40 transition-all placeholder:text-paper-white/20 text-sm"
                                placeholder="Nhập API Key..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-wuxia-gold/50 hover:text-wuxia-gold transition-colors"
                            >
                                {showKey ? 'Ẩn' : 'Hiện'}
                            </button>
                        </div>
                        <p className="text-[10px] text-paper-white/40 ml-1">Để trống sẽ dùng lại API Key chính. Sau khi điền, tối ưu hóa văn bản sẽ ưu tiên dùng API key này.</p>
                    </div>

                    <div className="text-xs text-paper-white/40 pt-2 border-t border-wuxia-gold/10 italic">
                        Trạng thái hiện tại: <span className={fmp.articleOptimizationIndependentModelToggle ? 'text-wuxia-gold font-bold shadow-[0_0_8px_rgba(255,215,0,0.3)]' : 'text-wuxia-red font-bold'}>
                            {fmp.articleOptimizationIndependentModelToggle ? 'Đã bật tự động trau chuốt' : 'Chưa bật tự động trau chuốt'}
                        </span>
                        {fmp.articleOptimizationIndependentApiUrl && (
                            <span className="ml-2 text-wuxia-gold/60">· API: {fmp.articleOptimizationIndependentApiUrl}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-md border border-wuxia-gold/20 bg-transparent p-5 space-y-4 backdrop-blur-sm shadow-inner">
                <div className="flex items-center justify-between">
                    <label className="text-sm text-wuxia-gold font-bold tracking-wide">Prompt trau chuốt văn từ</label>
                    <button
                        onClick={() => onSave({ ...settings, featureModelPlaceholder: { ...fmp, articleOptimizationPrompt: defaultArticleOptimizationPrompt } })}
                        className="text-[10px] text-wuxia-gold/40 hover:text-wuxia-gold transition-colors underline underline-offset-4"
                    >
                        Khôi phục prompt mặc định
                    </button>
                </div>
                <textarea
                    value={fmp.articleOptimizationPrompt ?? ''}
                    onChange={(e) => onSave({ ...settings, featureModelPlaceholder: { ...fmp, articleOptimizationPrompt: e.target.value } })}
                    className="w-full h-[400px] bg-transparent border border-wuxia-gold/20 p-5 text-xs font-mono text-paper-white/70 focus:border-wuxia-gold/50 outline-none transition-all resize-none custom-scrollbar leading-relaxed rounded-xl font-medium"
                    placeholder="Mô tả cách thức tối ưu hóa văn bản..."
                />
            </div>

            <div className="pt-4 sticky bottom-0 bg-ink-black/80 backdrop-blur-md pb-4 z-20">
                <ParallelogramSaveButton
                    onClick={handleSave}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default ArticleOptimizationSettings;

