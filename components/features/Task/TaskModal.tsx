
import React, { useState } from 'react';
import { QuestStructure, QuestType } from '../../../models/task';
import IconGlyph from '../../ui/Icon/IconGlyph';

interface Props {
    tasks: QuestStructure[];
    onClose: () => void;
    onDeleteTask?: (task: QuestStructure) => void;
}

// Helper to read task fields with fallback names
const getField = (task: any, ...keys: string[]) => {
    for (const k of keys) {
        if (task[k] !== undefined && task[k] !== null && task[k] !== '') return task[k];
    }
    return '';
};

const TaskModal: React.FC<Props> = ({ tasks, onClose, onDeleteTask }) => {
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
    }

    const goalList = currentTask
        ? (Array.isArray(currentTask.goalList) ? currentTask.goalList
            : Array.isArray(currentTask.targetList) ? currentTask.targetList : [])
        : [];
    const rewardList = currentTask
        ? (Array.isArray(currentTask.rewardDescription) ? currentTask.rewardDescription : [])
        : [];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] hidden md:flex items-center justify-center p-4">
            <div className="glass-panel border border-wuxia-gold/30 w-full max-w-5xl h-[650px] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-none">
                {/* Wuxia Decorative Corners */}
                <div className="wuxia-corner wuxia-corner-tl"></div>
                <div className="wuxia-corner wuxia-corner-tr"></div>
                <div className="wuxia-corner wuxia-corner-bl"></div>
                <div className="wuxia-corner wuxia-corner-br"></div>

                {/* Header */}
                <div className="h-16 shrink-0 border-b border-gray-800/50 bg-ink-black/40 flex items-center justify-between px-6 relative z-50">
                    <h3 className="text-wuxia-gold font-serif font-bold text-2xl tracking-[0.3em] drop-shadow-md">Giang Hồ Nhiệm Vụ</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-none bg-ink-black/50 border border-gray-700 text-gray-400 hover:text-wuxia-red hover:border-wuxia-red transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar: Task List */}
                    <div className="w-[30%] bg-ink-black/20 border-r border-gray-800/50 flex flex-col">

                        {/* Filter Tabs */}
                        <div className="flex p-2 gap-1 border-b border-gray-800/50 overflow-x-auto no-scrollbar">
                            {(['Tất cả', 'Chính tuyến', 'Nhánh', 'Môn phái', 'Kỳ ngộ', 'Treo thưởng', 'Tin đồn'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => { setFilter(f as any); setSelectedIdx(0); }}
                                    className={`px-3 py-1.5 text-xs whitespace-nowrap rounded-none transition-colors ${filter === f
                                            ? 'bg-wuxia-gold text-black font-bold'
                                            : 'text-gray-500 hover:text-gray-300 bg-paper-white/5'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                            {filteredTasks.map((task: any, idx: number) => {
                                const isSelected = idx === selectedIdx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedIdx(idx)}
                                        className={`w-full text-left p-3 border rounded-none transition-all relative group overflow-hidden ${isSelected
                                                ? 'border-wuxia-gold/50 bg-wuxia-gold/5'
                                                : 'border-gray-800 bg-white/[0.02] hover:bg-white/[0.05]'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`font-bold font-serif ${isSelected ? 'text-wuxia-gold' : 'text-gray-300'}`}>
                                                {getField(task, 'title', 'Title')}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <span className={`text-[10px] ${getStatusColor(getField(task, 'currentStatus', 'status', 'Current status', 'Status'))}`}>
                                                    {getField(task, 'currentStatus', 'status', 'Current status', 'Status')}
                                                </span>
                                                {onDeleteTask && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteTask(task);
                                                        }}
                                                        className="p-1 hover:text-wuxia-red opacity-0 group-hover:opacity-100 transition-all"
                                                        title="Xóa nhiệm vụ"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] px-1.5 rounded-none border ${getTypeLabelColor(getField(task, 'type', 'Type'))}`}>
                                                {getField(task, 'type', 'Type')}
                                            </span>
                                            <span className="text-[10px] text-gray-500 truncate">
                                                {getField(task, 'issuer', 'publisher', 'Publisher', 'issuer')} · {getField(task, 'location', 'publishLocation', 'Publish location', 'mediumLocation', 'majorLocation', 'specificLocation')}
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

                    {/* Content: Details */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
                        {currentTask ? (
                            <div className="max-w-3xl mx-auto space-y-6">
                                {/* Paper Texture Background Effect */}
                                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>

                                {/* Header */}
                                                         <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-3xl font-black font-serif text-wuxia-gold mb-2">{getField(currentTask, 'title', 'Title')}</h2>
                                            <div className="flex gap-4 text-xs text-gray-400">
                                                <span>Người giao: <span className="text-gray-300">{getField(currentTask, 'issuer', 'publisher', 'Publisher', 'issuer')}</span></span>
                                                <span>Địa điểm: <span className="text-gray-300">{getField(currentTask, 'location', 'publishLocation', 'Publish location', 'mediumLocation', 'majorLocation', 'specificLocation')}</span></span>
                                                <span>Cảnh giới: <span className="text-wuxia-cyan">{getField(currentTask, 'recommendedRealm', 'Recommended realm', 'realm')}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className={`text-4xl font-serif font-bold opacity-20 rotate-12 select-none ${getStatusColor(getField(currentTask, 'currentStatus', 'Current status'))}`}>
                                                {getField(currentTask, 'currentStatus', 'Current status')}
                                            </div>
                                            {onDeleteTask && (
                                                <button
                                                    onClick={() => onDeleteTask(currentTask)}
                                                    className="px-4 py-2 border border-wuxia-red/30 text-wuxia-red bg-wuxia-red/5 hover:bg-wuxia-red/10 flex items-center gap-2 text-xs transition-all tracking-widest font-bold"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                    XÓA NHIỆM VỤ
                                                </button>
                                            )}
                                        </div>
                                    </div>



                                {/* Description */}
                                <div className="bg-ink-black/20 p-6 rounded-none border border-gray-800 relative z-10">
                                    <h4 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-3">Chi tiết nhiệm vụ</h4>
                                    <p className="text-gray-300 font-serif leading-loose text-sm indent-8">
                                        "{getField(currentTask, 'description', 'Description')}"
                                    </p>
                                </div>

                                {/* Objectives */}
                                {goalList.length > 0 && (
                                    <div className="relative z-10">
                                        <h4 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                            Mục tiêu hiện tại
                                            <div className="h-px bg-gray-800 flex-1"></div>
                                        </h4>
                                        <div className="space-y-3">
                                            {goalList.map((obj: any, i: number) => {
                                                const completed = obj.isCompleted || obj.completionStatus || false;
                                                const current = obj.currentProgress || 0;
                                                const total = obj.totalRequired || obj.totalRequiredProgress || 1;
                                                return (
                                                    <div key={i} className="flex items-center gap-4 p-3 rounded-none border border-gray-800/50">
                                                        <div className={`w-5 h-5 rounded-none flex items-center justify-center border transition-all ${completed
                                                                ? 'bg-wuxia-gold border-wuxia-gold text-black shadow-[0_0_10px_rgba(230,200,110,0.4)]'
                                                                : 'border-gray-600 text-transparent'
                                                            }`}>
                                                            {completed && <IconGlyph name="check" className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className={`text-sm ${completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                                                {obj.description || obj.Description || ''}
                                                            </div>
                                                            <div className="mt-1 h-1.5 w-full bg-gray-900 rounded-none overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-500 ${completed ? 'bg-green-500' : 'bg-wuxia-gold'}`}
                                                                    style={{ width: `${Math.min((current / total) * 100, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs font-mono text-gray-500 min-w-[50px] text-right">
                                                            {current}/{total}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Rewards */}
                                {rewardList.length > 0 && (
                                    <div className="relative z-10">
                                        <h4 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                            Phần thưởng
                                            <div className="h-px bg-gray-800 flex-1"></div>
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {rewardList.map((reward: string, i: number) => (
                                                <div key={i} className="flex items-center gap-2 bg-wuxia-gold/10 border border-wuxia-gold/30 px-3 py-1.5 rounded-none text-wuxia-gold text-xs">
                                                    <span className="w-1.5 h-1.5 bg-wuxia-gold rounded-none"></span>
                                                    {reward}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Footer Dates */}
                                {(currentTask.deadline || currentTask.Deadline) && (
                                    <div className="mt-8 pt-4 border-t border-gray-800 text-right text-xs text-red-400 font-mono relative z-10">
                                        Thời hạn: {currentTask.deadline || currentTask.Deadline}
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-600 font-serif">
                                Chưa chọn nhiệm vụ
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
