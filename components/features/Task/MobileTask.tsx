import React, { useState } from 'react';
import { QuestStructure, QuestType } from '../../../models/task';
import IconGlyph from '../../ui/Icon/IconGlyph';

interface Props {
    tasks: QuestStructure[];
    onClose: () => void;
    onDeleteTask?: (task: any) => void;
}

// Helper to read task fields with fallback names
const getField = (task: any, ...keys: string[]) => {
    for (const k of keys) {
        if (task[k] !== undefined && task[k] !== null && task[k] !== '') return task[k];
    }
    return '';
};

const MobileTask: React.FC<Props> = ({ tasks, onClose, onDeleteTask }) => {
    const [filter, setFilter] = useState<QuestType | 'Tất cả'>('Tất cả');
    const [selectedIdx, setSelectedIdx] = useState<number>(0);

    const filteredTasks = filter === 'Tất cả'
        ? tasks
        : tasks.filter((tk: any) => (tk.type || tk.Type) === filter);

    const currentTask: any = filteredTasks[selectedIdx];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đang thực hiện': return 'text-wuxia-gold';
            case 'Có thể nộp': return 'text-green-400';
            case 'Đã hoàn thành': return 'text-gray-400';
            case 'Thất bại': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getTypeLabelColor = (type: string) => {
        switch (type) {
            case 'Chính tuyến': return 'bg-wuxia-red/20 text-wuxia-red border-wuxia-red/50';
            case 'Nhánh': return 'bg-wuxia-cyan/20 text-wuxia-cyan border-wuxia-cyan/50';
            case 'Môn phái': return 'bg-green-900/20 text-green-300 border-green-900/50';
            case 'Kỳ ngộ': return 'bg-purple-900/20 text-purple-300 border-purple-900/50';
            case 'Treo thưởng': return 'bg-orange-900/20 text-orange-300 border-orange-900/50';
            case 'Tin đồn': return 'bg-yellow-900/20 text-yellow-300 border-yellow-900/50';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
        }
    };

    const goalList = currentTask
        ? (Array.isArray(currentTask.goalList) ? currentTask.goalList
            : Array.isArray(currentTask.targetList) ? currentTask.targetList : [])
        : [];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-3 md:hidden animate-fadeIn">
            <div className="bg-modal-gradient border border-wuxia-gold/30 w-full max-w-[620px] h-[86vh] flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden rounded-none">
                <div className="h-12 shrink-0 border-b border-gray-800/60 bg-ink-black/40 flex items-center justify-between px-4">
                    <h3 className="text-wuxia-gold font-serif font-bold text-base tracking-[0.3em]">Giang Hồ Nhiệm Vụ</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-ink-black/50 border border-gray-700 text-gray-400 hover:text-wuxia-red hover:border-wuxia-red transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="border-b border-gray-800/60 px-3 py-2 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2">
                        {(['Tất cả', 'Chính tuyến', 'Nhánh', 'Môn phái', 'Kỳ ngộ', 'Treo thưởng', 'Tin đồn'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => { setFilter(f as any); setSelectedIdx(0); }}
                                className={`px-3 py-1.5 text-[11px] rounded-full border transition-colors ${filter === f
                                        ? 'bg-wuxia-gold/15 text-wuxia-gold border-wuxia-gold'
                                        : 'text-gray-500 border-gray-800'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4">
                    {currentTask ? (
                        <div className="bg-ink-black/40 border border-gray-800 rounded-none p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-lg text-wuxia-gold font-serif font-bold">{getField(currentTask, 'title', 'Title')}</div>
                                    <div className="text-[10px] text-gray-500 mt-1">Người giao: {getField(currentTask, 'issuer', 'publisher', 'Publisher')} · {getField(currentTask, 'location', 'publishLocation', 'Publish location')}</div>
                                </div>
                                <div className={`text-[11px] ${getStatusColor(getField(currentTask, 'currentStatus', 'Current status'))}`}>{getField(currentTask, 'currentStatus', 'Current status')}</div>
                            </div>
                            <div className="text-[10px] text-gray-500">
                                Cảnh giới: <span className="text-wuxia-cyan">{getField(currentTask, 'recommendedRealm', 'Recommended realm')}</span>
                            </div>
                            <p className="text-sm text-gray-300 font-serif leading-relaxed">"{getField(currentTask, 'description', 'Description')}"</p>
                            <div className="flex gap-2 flex-wrap items-center justify-between">
                                <span className={`text-[9px] px-2 py-0.5 rounded border ${getTypeLabelColor(getField(currentTask, 'type', 'Type'))}`}>{getField(currentTask, 'type', 'Type')}</span>
                                {onDeleteTask && (
                                    <button
                                        onClick={() => onDeleteTask(currentTask)}
                                        className="px-3 py-1 bg-wuxia-red/10 border border-wuxia-red/30 text-wuxia-red text-[10px] font-bold rounded-none"
                                    >
                                        XÓA NHIỆM VỤ
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-600 text-sm">Chưa chọn nhiệm vụ</div>
                    )}

                    {currentTask && goalList.length > 0 && (
                        <div className="bg-ink-black/40 border border-gray-800 rounded-none p-4 space-y-3">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Mục tiêu hiện tại</div>
                            {goalList.map((obj: any, i: number) => {
                                const completed = obj.isCompleted || obj.completionStatus || false;
                                const current = obj.currentProgress || 0;
                                const total = obj.totalRequired || obj.totalRequiredProgress || 1;
                                return (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${completed
                                            ? 'bg-wuxia-gold border-wuxia-gold text-black shadow-[0_0_10px_rgba(230,200,110,0.4)]'
                                            : 'border-gray-600 text-transparent'
                                        }`}>
                                            {completed && <IconGlyph name="check" className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-[11px] ${completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                                {obj.description || obj.Description || ''}
                                            </div>
                                            <div className="mt-1 h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${completed ? 'bg-green-500' : 'bg-wuxia-gold'}`}
                                                    style={{ width: `${Math.min((current / total) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-mono text-gray-500 min-w-[46px] text-right">
                                            {current}/{total}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="space-y-2">
                        {filteredTasks.map((task: any, idx: number) => {
                            const isSelected = idx === selectedIdx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedIdx(idx)}
                                    className={`w-full text-left p-3 border rounded-none transition-all ${isSelected ? 'border-wuxia-gold/50 bg-wuxia-gold/5' : 'border-gray-800 bg-white/[0.02] hover:bg-white/[0.05]'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`font-bold font-serif text-sm ${isSelected ? 'text-wuxia-gold' : 'text-gray-300'}`}>
                                            {getField(task, 'title', 'Title')}
                                        </span>
                                        <span className={`text-[10px] ${getStatusColor(getField(task, 'currentStatus', 'Current status'))}`}>{getField(task, 'currentStatus', 'Current status')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] px-1.5 rounded border ${getTypeLabelColor(getField(task, 'type', 'Type'))}`}>
                                            {getField(task, 'type', 'Type')}
                                        </span>
                                        <span className="text-[10px] text-gray-500 truncate">
                                            {getField(task, 'issuer', 'publisher', 'Publisher')} · {getField(task, 'location', 'publishLocation', 'Publish location')}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                        {filteredTasks.length === 0 && (
                            <div className="text-center text-gray-600 text-xs py-10">Không có nhiệm vụ nào</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileTask;
