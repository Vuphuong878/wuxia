import React, { useState, useMemo } from 'react';
import { PromptStructure, PromptCategory, ApiSettings } from '../../../types';
import GameButton from '../../ui/GameButton';
import ToggleSwitch from '../../ui/ToggleSwitch';
import InlineSelect from '../../ui/InlineSelect';
import { TransformationService } from '../../../services/transformationService';
import { getCurrentApiConfig } from '../../../utils/apiConfig';

interface Props {
    prompts: PromptStructure[];
    apiConfig: ApiSettings;
    onUpdate: (prompts: PromptStructure[]) => void;
    requestConfirm?: (options: { title?: string; message: string; confirmText?: string; cancelText?: string; danger?: boolean }) => Promise<boolean>;
}

const CATEGORIES = [
    { id: 'core setting', label: 'Cốt lõi' },
    { id: 'num', label: 'Chỉ số' },
    { id: 'diff', label: 'Độ khó' },
    { id: 'writing', label: 'Văn phong' },
    { id: 'custom', label: 'Tùy chỉnh' }
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

const PromptManager: React.FC<Props> = ({ prompts, onUpdate, requestConfirm, apiConfig }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<PromptStructure | null>(null);
    const [activeCategory, setActiveCategory] = useState<CategoryId | 'ALL'>('ALL');
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isTransforming, setIsTransforming] = useState(false);

    const pushNotice = (type: 'success' | 'error', text: string) => {
        setNotice({ type, text });
        window.setTimeout(() => setNotice(null), 2200);
    };

    const handleEdit = (prompt: PromptStructure) => {
        setEditingId(prompt.id);
        setEditForm({ ...prompt });
    };

    const handleSave = () => {
        if (!editForm) return;
        const newPrompts = prompts.map(p => p.id === editForm.id ? editForm : p);
        if (!prompts.find(p => p.id === editForm.id)) {
            newPrompts.push(editForm);
        }
        onUpdate(newPrompts);
        setEditingId(null);
        setEditForm(null);
    };

    const handleDelete = async (id: string) => {
        const ok = requestConfirm
            ? await requestConfirm({ title: 'Xóa prompt', message: 'Bạn có chắc muốn xóa prompt này không?', confirmText: 'Xóa', danger: true })
            : true;
        if (!ok) return;
        onUpdate(prompts.filter(p => p.id !== id));
    };

    const handleAddNew = () => {
        const newPrompt: PromptStructure = {
            id: Date.now().toString(),
            title: 'Prompt mới',
            content: '',
            type: activeCategory === 'ALL' ? 'custom' : activeCategory,
            enabled: true
        };
        setEditForm(newPrompt);
        setEditingId(newPrompt.id);
    };

    const handleToggleEnable = (id: string) => {
        const newPrompts = prompts.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p);
        onUpdate(newPrompts);
    };

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(prompts, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wuxia_prompts.json';
        a.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const content = event.target?.result as string;
                let imported: any;
                try {
                    imported = JSON.parse(content);
                } catch {
                    // If not JSON, treat as raw text (single item)
                    imported = [{ content }];
                }

                const dataToTransform = Array.isArray(imported) ? imported : [imported];
                
                setIsTransforming(true);
                pushNotice('success', 'Đang chuyển hóa prompt bằng AI...');

                const activeConfig = getCurrentApiConfig(apiConfig);
                const transformed = await TransformationService.transformPrompts(dataToTransform, activeConfig);
                
                onUpdate([...prompts, ...transformed]);
                pushNotice('success', `Đã chuyển hóa và nhập ${transformed.length} prompt.`);
            } catch (err: any) {
                pushNotice('error', `Nhập thất bại: ${err.message || 'Lỗi không xác định'}`);
            } finally {
                setIsTransforming(false);
                // Clear input
                e.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    // Grouping logic
    const filteredPrompts = useMemo(() => {
        if (activeCategory === 'ALL') return prompts;
        return prompts.filter(p => {
            // Migration support for legacy types
            if (activeCategory === 'core setting' && p.type === ('core' as any)) return true;
            if (activeCategory === 'num' && p.type === ('stats' as any)) return true;
            if (activeCategory === 'diff' && p.type === ('difficulty' as any)) return true;
            return p.type === activeCategory;
        });
    }, [prompts, activeCategory]);

    if (editingId && editForm) {
        return (
            <div className="space-y-3 p-4 bg-transparent border border-wuxia-gold/20 backdrop-blur-sm relative animate-fadeIn">
                <input
                    className="w-full bg-transparent border border-wuxia-gold/20 p-2 text-wuxia-gold focus:border-wuxia-gold outline-none"
                    value={editForm.title}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Tiêu đề Prompt"
                />
                <InlineSelect
                    options={CATEGORIES.map(cat => ({ value: cat.id, label: cat.label }))}
                    value={editForm.type}
                    onChange={(val) => setEditForm({ ...editForm, type: val as any })}
                    buttonClassName="h-10 border-wuxia-gold/20 text-paper-white/70 focus:border-wuxia-gold !p-2"
                />
                <textarea
                    className="w-full h-64 bg-transparent border border-wuxia-gold/20 p-2 text-xs font-mono text-paper-white/70 focus:border-wuxia-gold outline-none custom-scrollbar"
                    value={editForm.content}
                    onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                    placeholder="Nhập nội dung prompt ở đây..."
                />
                <div className="flex gap-2 justify-end">
                    <GameButton onClick={() => { setEditingId(null); setEditForm(null); }} variant="secondary">Hủy</GameButton>
                    <GameButton onClick={handleSave} variant="primary">Lưu</GameButton>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {notice && (
                <div className={`text-xs px-3 py-2 border rounded-none ${notice.type === 'success'
                        ? 'border-wuxia-gold/40 bg-wuxia-gold/10 text-wuxia-gold'
                        : 'border-wuxia-red/40 bg-wuxia-red/10 text-wuxia-red'
                    }`}>
                    {notice.text}
                </div>
            )}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                    {/* Category Filter Tabs */}
                    <div className="flex gap-1 overflow-x-auto custom-scrollbar flex-1 pb-1">
                        <button
                            onClick={() => setActiveCategory('ALL')}
                            className={`px-2 py-0.5 text-[10px] uppercase tracking-wider whitespace-nowrap border border-transparent hover:text-wuxia-gold transition-colors ${activeCategory === 'ALL' ? 'text-wuxia-gold border-b-wuxia-gold bg-paper-white/10 font-black' : 'text-paper-white/40'}`}
                        >
                            Tất cả
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-2 py-0.5 text-[10px] uppercase tracking-wider whitespace-nowrap border border-transparent hover:text-wuxia-gold transition-colors ${activeCategory === cat.id ? 'text-wuxia-gold border-b-wuxia-gold bg-wuxia-gold/15 font-black' : 'text-wuxia-gold/50'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center gap-2 border-t border-wuxia-gold/10 pt-2">
                    <GameButton onClick={handleAddNew} variant="primary" className="text-[10px] px-2 py-1 h-7">New prompt</GameButton>
                    <div className="flex gap-2">
                        <GameButton onClick={handleExport} variant="secondary" className="text-[10px] px-2 py-1 h-7">Export</GameButton>
                        <label className={`relative cursor-pointer group ${isTransforming ? 'opacity-50 pointer-events-none' : ''}`}>
                            <span className="relative z-10 block px-2 py-1 font-serif font-bold uppercase transition-all duration-200 transform border-2 border-wuxia-gold/40 text-wuxia-gold text-[10px] clip-path-polygon group-hover:-translate-y-1 bg-transparent h-7 flex items-center">
                                {isTransforming ? 'Transforming...' : 'Import'}
                            </span>
                            <input type="file" onChange={handleImport} className="hidden" accept=".json,.txt" disabled={isTransforming} />
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pr-1 min-h-0">
                {filteredPrompts.map(p => (
                    <div key={p.id} className={`flex justify-between items-center bg-transparent py-1 px-3 border-l-2 transition-all group ${p.enabled ? 'border-wuxia-gold bg-wuxia-gold/5' : 'border-paper-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'}`}>
                        <div className="flex items-center gap-2">
                            <ToggleSwitch
                                checked={p.enabled}
                                onChange={() => handleToggleEnable(p.id)}
                                ariaLabel={`${p.enabled ? 'Disable' : 'Enable'} Prompt ${p.title}`}
                            />
                            <div>
                                <div className={`font-bold font-serif text-sm transition-colors flex items-center gap-2 ${p.enabled ? 'text-wuxia-gold group-hover:text-paper-white' : 'text-paper-white/50'}`}>
                                    {p.title}
                                    {p.isSystem && (
                                        <span className="text-[8px] px-1 py-0.5 border border-wuxia-gold/30 bg-wuxia-gold/10 text-wuxia-gold/80 rounded-sm uppercase tracking-tighter">
                                            Hệ thống
                                        </span>
                                    )}
                                </div>
                                <div className="text-[9px] leading-none text-paper-white/30 mt-0.5">{p.type} | Chars: {(p.content || '').length}</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(p)} className="text-[10px] text-wuxia-gold hover:text-paper-white transition-colors">Edit</button>
                            <button onClick={() => handleDelete(p.id)} className="text-[10px] text-wuxia-red hover:text-paper-white transition-colors">Delete</button>
                        </div>
                    </div>
                ))}
                {filteredPrompts.length === 0 && (
                    <div className="text-center text-paper-white/30 py-8 text-xs font-serif italic">
                        Nothing here
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromptManager;
