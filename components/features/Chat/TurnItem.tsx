
import React, { useState } from 'react';
import { GameResponse } from '../../../types';
import { NarratorRenderer, CharacterRenderer, InnerThoughtRenderer, FlashbackRenderer, SystemRenderer, SceneryRenderer } from './MessageRenderers';
import GameButton from '../../ui/GameButton';
import { parseStoryRawText } from '../../../services/aiService';

interface Props {
    response: GameResponse;
    turnNumber: number;
    isLatest?: boolean;
    rawJson?: string; // Original raw text for viewing/editing
    onSaveEdit: (newRawText: string) => void;
    onRetry?: () => void;
    onReroll?: () => void;
    allAvatars?: Record<string, string>;
    playerName?: string;
    playerId?: string;
    isPlayerGenerating?: boolean;
    generatingNames?: Set<string>;
    npcs?: any[];
}

const TurnItem: React.FC<Props> = ({ response, turnNumber, isLatest = false, rawJson, onSaveEdit, onRetry, onReroll, allAvatars, isPlayerGenerating, generatingNames, npcs, playerName, playerId }) => {
    const formatRawJson = (raw?: string) => {
        if (!raw) return '（Văn bản gốc của vòng này chưa được lưu.）';
        
        try {
            // Find JSON part if wrapped in tags (like <thinking>)
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (!jsonMatch) return raw;

            const originalJsonString = jsonMatch[0];
            const parsed = JSON.parse(originalJsonString);

            if (parsed.logs && Array.isArray(parsed.logs)) {
                parsed.logs = parsed.logs.filter((log: any) => {
                    const sender = (log.sender || '').trim();
                    const text = (log.text || '').trim();
                    const isJudgment = (
                        sender === 'Judgment' || 
                        sender === '【Judgment】' || 
                        sender.includes('Judgment') ||
                        text.startsWith('【Judgment】') || 
                        text.startsWith('【Phán đoán】')
                    );
                    return !isJudgment;
                });
                
                const filteredJsonString = JSON.stringify(parsed, null, 2);
                return raw.replace(originalJsonString, filteredJsonString);
            }
        } catch (e) {
            // If parsing fails, just return original string as a safe fallback
            return raw;
        }
        return raw;
    };

    const [showThinking, setShowThinking] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(formatRawJson(rawJson));
    const [parseError, setParseError] = useState<string | null>(null);
    const [showMemory, setShowMemory] = useState(false);

    type ThinkingStage = 'pre' | 'post';
    type ThoughtGrouping = {
        id: string;
        label: string;
        phase: ThinkingStage;
        keys: Array<keyof GameResponse>;
    };

    const thinkingGroups: ThoughtGrouping[] = [
        { id: 'legacy_pre', label: 'Lý luận trước', phase: 'pre', keys: ['thinking_pre'] },
        { id: 'input', label: 'Lý luận đầu vào', phase: 'pre', keys: ['t_input'] },
        { id: 'plan', label: 'Lý luận kế hoạch cốt truyện', phase: 'pre', keys: ['t_plan'] },
        { id: 'state', label: 'Lý luận biến nhân vật', phase: 'pre', keys: ['t_state'] },
        { id: 'branch', label: 'Tư duy luồng cốt truyện', phase: 'pre', keys: ['t_branch'] },
        { id: 'precheck', label: 'Lý luận kiểm tra lệnh trước', phase: 'pre', keys: ['t_precheck'] },
        { id: 'logcheck', label: 'Lý luận xác nhận thân thể', phase: 'post', keys: ['t_logcheck'] },
        { id: 'var', label: 'Lý luận thay đổi biến', phase: 'post', keys: ['t_var'] },
        { id: 'npc', label: 'Lý luận sự xuất hiện NPC', phase: 'post', keys: ['t_npc'] },
        { id: 'cmd', label: 'Lý luận đầu ra lệnh', phase: 'post', keys: ['t_cmd'] },
        { id: 'audit', label: 'Lý luận kiểm tra lệnh', phase: 'post', keys: ['t_audit'] },
        { id: 'fix', label: 'Lý luận sửa lệnh', phase: 'post', keys: ['t_fix'] },
        { id: 'legacy_post', label: 'Lý luận xem xét', phase: 'post', keys: ['thinking_post'] },
        { id: 'mem', label: 'Lý luận ký ức ngắn hạn', phase: 'post', keys: ['t_mem'] },
        { id: 'opts', label: 'Tư duy tùy chọn nhanh', phase: 'post', keys: ['t_opts'] }
    ];

    const hasThinkingValue = (value: unknown): value is string =>
        typeof value === 'string' && value.trim().length > 0;

    const extractReasoningAndBody = (value: string): string => {
        const trimmed = value.trim();
        const wrapped = trimmed.match(/^<thinking>\s*([\s\S]*?)\s*<\/thinking>$/i);
        return (wrapped ? wrapped[1] : trimmed).trim();
    };

    const getFirstHitField = (keys: Array<keyof GameResponse>) => {
        for (const key of keys) {
            const value = response[key];
            if (hasThinkingValue(value)) {
                return {
                    key: key as string,
                    value: extractReasoningAndBody(value)
                };
            }
        }
        return null;
    };

    const knownThinkingKeys = new Set(thinkingGroups.flatMap(item => item.keys.map(key => key as string)));
    const thinkingExtras = Object.keys(response)
        .filter(key => (key.startsWith('t_') || key.startsWith('thinking_')) && !knownThinkingKeys.has(key) && hasThinkingValue((response as any)[key]))
        .map(key => ({
            key,
            label: `Tư duy mở rộng · ${key.replace(/^t_/, '').replace(/^thinking_/, '')}`,
            value: extractReasoningAndBody((response as any)[key] as string),
            phase: 'post' as const
        }));

    const thinkingBlocks = [
        ...thinkingGroups
            .map(item => {
                const hit = getFirstHitField(item.keys);
                if (!hit) return null;
                return {
                    key: hit.key,
                    label: item.label,
                    value: hit.value,
                    phase: item.phase
                };
            })
            .filter(Boolean),
        ...thinkingExtras
    ] as Array<{ key: string; label: string; value: string; phase: ThinkingStage }>;
    const preThinkingBlocks = thinkingBlocks.filter(item => item.phase === 'pre');
    const postThinkingBlocks = thinkingBlocks.filter(item => item.phase === 'post');
    const isHiddenLog = (log: { sender?: string; text?: string }) => {
        const sender = (log?.sender || '').trim();
        const text = (log?.text || '').trim();
        
        // Hide standard disclaimer
        if (sender === 'disclaimer' || sender === 'Disclaimer' || sender === '【Disclaimer】') return true;
        if (/^【\s*Disclaimer\s*】/.test(text)) return true;

        // Hide Judgment system messages
        if (sender === 'Judgment' || sender === '【Judgment】' || sender.includes('Judgment')) return true;
        if (text.startsWith('【Judgment】') || text.startsWith('【Phán đoán】')) return true;

        return false;
    };
    const displayLogs = response.logs.filter(log => !isHiddenLog(log));
    const bodyText = displayLogs.map(log => log.text || '').join('\n');
    const charCount = bodyText.length;
    const commands = Array.isArray(response.tavern_commands) ? response.tavern_commands : [];
    const [showCommandChanges, setShowCommandChanges] = useState(false);
    const [commandViewMode, setCommandViewMode] = useState<'compact' | 'full'>('compact');
    const commandStats = commands.reduce(
        (acc, cmd) => {
            if (cmd?.action === 'set') acc.set += 1;
            if (cmd?.action === 'add') acc.add += 1;
            if (cmd?.action === 'push') acc.push += 1;
            if (cmd?.action === 'delete') acc.delete += 1;
            return acc;
        },
        { set: 0, add: 0, push: 0, delete: 0 }
    );
    const commandTagMapping: Record<'set' | 'add' | 'push' | 'delete', string> = {
        set: 'SET',
        add: 'ADD',
        push: 'PUSH',
        delete: 'DEL'
    };
    const commandStyleMapping: Record<'set' | 'add' | 'push' | 'delete', string> = {
        set: 'border-wuxia-cyan/30 text-wuxia-cyan bg-wuxia-cyan/10',
        add: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
        push: 'border-violet-500/30 text-violet-300 bg-violet-500/10',
        delete: 'border-wuxia-red/30 text-wuxia-red bg-wuxia-red/10'
    };
    const formatCommandValues = (value: unknown): string => {
        if (typeof value === 'string') return value;
        if (typeof value === 'number' || typeof value === 'boolean') return String(value);
        if (value === null || value === undefined) return 'null';
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    };
    const usePreFormatting = (value: unknown): boolean => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'object') return true;
        if (typeof value === 'string' && (value.includes('\n') || value.length > 80)) return true;
        return false;
    };
    const generateSimpleValueText = (value: unknown): string => {
        if (value === null || value === undefined) return 'null';
        if (typeof value === 'number' || typeof value === 'boolean') return String(value);
        if (typeof value === 'string') {
            const trimmed = value.replace(/\s+/g, ' ').trim();
            return trimmed.length > 36 ? `${trimmed.slice(0, 36)}...` : trimmed;
        }
        if (Array.isArray(value)) return `Array(${value.length})`;
        if (typeof value === 'object') {
            const keys = Object.keys(value as Record<string, unknown>);
            return `Object{${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}}`;
        }
        return String(value);
    };
    const commandPanelTitle = isLatest ? 'Thay đổi biến mới nhất' : 'Thay đổi biến vòng này';

    const handleSave = () => {
        try {
            parseStoryRawText(editValue);
        } catch (error: any) {
            setParseError(error?.message || 'Phân tích bản gốc thất bại, Vui lòng kiểm tra cấu trúc thẻ。');
            return;
        }
        onSaveEdit(editValue);
        setIsEditing(false);
        setParseError(null);
    };

    if (isEditing) {
        return (
            <div className="w-full /80 border border-wuxia-gold p-4 my-4 relative z-50">
                <h4 className="text-wuxia-gold mb-2 font-mono text-xs">/// GỠ LỖI: CHỈNH SỬA VĂN BẢN THÔ PHẢN HỒI ///</h4>
                <textarea
                    className="w-full h-96 bg-ink-black text-wuxia-cyan font-mono text-xs p-4 outline-none border border-ink-gray resize-y"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                />
                {parseError && <div className="text-red-500 text-xs mt-2">Lỗi: {parseError}</div>}
                <div className="flex justify-end gap-2 mt-2">
                    <GameButton variant="secondary" onClick={() => setIsEditing(false)} className="py-1 px-3 text-xs">Hủy</GameButton>
                    <GameButton variant="primary" onClick={handleSave} className="py-1 px-3 text-xs">Lưu và phân tích lại</GameButton>
                </div>
            </div>
        );
    }

    // Turn Display Logic
    const turnDisplay = turnNumber === 0 ? "Cốt truyện mở đầu" : `Vòng thứ ${turnNumber}`;
    const shortTurnLabel = turnNumber === 0 ? 'mở đầu' : String(turnNumber);

    return (
        <div className="w-full mb-12 relative animate-slide-in group/turn">

            {/* Top Turn Header Container */}
            <div className="flex items-center justify-center gap-4 mb-6 relative">

                {/* Left: Thinking Toggle Icon */}
                {thinkingBlocks.length > 0 && (
                    <button
                        onClick={() => setShowThinking(!showThinking)}
                        className={`p-1.5 rounded-full border transition-all ${showThinking ? 'bg-wuxia-cyan/20 border-wuxia-cyan text-wuxia-cyan' : 'border-gray-700 text-gray-500 hover:text-wuxia-cyan hover:border-wuxia-cyan'}`}
                        title="Xem suy nghĩ AI"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 2.625v-8.192a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v8.192m0 0a3.018 3.018 0 00-1.632.712m0 0L8.25 17.25m2.25 1.5a3.018 3.018 0 010-3m0 0l-2.25 2.25m8.995-2.625l2.25 2.25m0 0l-2.25 2.25m2.25-2.25a3.018 3.018 0 010 3" />
                        </svg>
                    </button>
                )}
                {thinkingBlocks.length === 0 && <div className="w-7"></div>} {/* Spacer if no thinking */}


                {/* Center: Badge */}
                <div className="bg-ink-black/50 border border-wuxia-gold/30 px-6 py-1.5 rounded-full backdrop-blur-sm shadow-sm min-w-[120px] text-center">
                    <span className="text-[12px] text-wuxia-gold font-serif font-bold tracking-[0.2em] uppercase block text-center">
                        {turnDisplay}
                    </span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    {isLatest && commands.length > 0 && (
                        <button
                            onClick={() => setShowCommandChanges(prev => !prev)}
                            className={`p-1.5 rounded-full border transition-all ${showCommandChanges
                                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200'
                                    : 'border-emerald-700/70 text-emerald-300 hover:text-emerald-200 hover:border-emerald-500'
                                }`}
                            title={`Xem ${commandPanelTitle}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 6.75h16.5m-16.5 6.75h16.5" />
                            </svg>
                        </button>
                    )}
                    {isLatest && onReroll && (
                        <button
                            onClick={onReroll}
                            className="p-1.5 rounded-full border border-gray-700 text-gray-500 hover:text-emerald-400 hover:border-emerald-400 transition-all"
                            title="Tạo lại (Reroll)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                    )}
                    {isLatest && onRetry && (
                        <button
                            onClick={onRetry}
                            className="p-1.5 rounded-full border border-gray-700 text-gray-500 hover:text-rose-400 hover:border-rose-400 transition-all"
                            title="Tải lại & Sửa"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>
                    )}

                    <button
                        onClick={() => {
                            setEditValue(formatRawJson(rawJson));
                            setIsEditing(true);
                        }}
                        className="p-1.5 rounded-full border border-gray-700 text-gray-500 hover:text-wuxia-gold hover:border-wuxia-gold transition-all"
                        title="Xem/Chỉnh sửa bản gốc"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Thinking Process (Pre) - Collapsible */}
            {showThinking && preThinkingBlocks.length > 0 && (
                <div className="mb-6 mx-4 p-4 bg-gray-900/80 border-t border-b border-wuxia-cyan/30 text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap shadow-inner relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-wuxia-cyan/50"></div>
                    <span className="text-wuxia-cyan/70 block mb-2 font-bold text-[10px] tracking-widest">【AI Lý luận trước】</span>
                    <div className="space-y-4">
                        {preThinkingBlocks.map(block => (
                            <div key={block.key}>
                                <span className="text-wuxia-cyan/80 block mb-1">{`· ${block.label}`}</span>
                                <div>{block.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Logs Rendering */}
            <div className="space-y-2">
                {displayLogs.map((log, idx) => {
                    if (log.sender === 'Narrator' || log.sender === 'Background' || log.sender === 'Bối cảnh') {
                        return <NarratorRenderer key={idx} text={log.text} />;
                    } else if (log.sender === 'InnerThought' || log.sender === 'Nội tâm') {
                        // Find the nearest previous character speaker for context
                        const prevSpeaker = idx > 0
                            ? displayLogs.slice(0, idx).reverse().find(l =>
                                l.sender && l.sender !== 'InnerThought' && l.sender !== 'Nội tâm' && l.sender !== 'Narrator'
                                && l.sender !== 'Background' && l.sender !== 'Bối cảnh' && l.sender !== 'System' && l.sender !== 'Hệ thống'
                                && l.sender !== 'Scenery' && l.sender !== 'Cảnh vật' && l.sender !== 'Flashback' && l.sender !== 'Hồi tưởng'
                              )?.sender
                            : undefined;
                        return <InnerThoughtRenderer key={idx} text={log.text} speaker={prevSpeaker} />;
                    } else if (log.sender === 'Flashback' || log.sender === 'Hồi tưởng') {
                        return <FlashbackRenderer key={idx} text={log.text} />;
                    } else if (log.sender === 'System' || log.sender === 'Hệ thống') {
                        return <SystemRenderer key={idx} text={log.text} />;
                    } else if (log.sender === 'Scenery' || log.sender === 'Cảnh vật') {
                        return <SceneryRenderer key={idx} text={log.text} />;
                    } else {
                        const senderName = log.sender || 'Unknown';
                        let matchedId = senderName; // Default to name
                        let npcInfo = null;

                        if (npcs) {
                            let match = npcs.find(n => n.name === senderName);
                            if (!match) {
                                match = npcs.find(n => senderName.includes(n.name) || n.name.includes(senderName));
                            }
                            if (match) {
                                matchedId = match.id;
                                npcInfo = match;
                            } else if (playerName && (senderName === playerName || senderName.includes(playerName) || playerName.includes(senderName))) {
                                matchedId = playerId || senderName;
                            }
                        } else if (playerName && (senderName === playerName || senderName.includes(playerName) || playerName.includes(senderName))) {
                            matchedId = playerId || senderName;
                        }

                        const providedAvatar = allAvatars?.[matchedId] || allAvatars?.[senderName];
                        const isGenerating = generatingNames?.has(senderName);
                        
                        return (
                            <CharacterRenderer 
                                key={idx} 
                                sender={senderName} 
                                text={log.text} 
                                providedAvatar={providedAvatar} 
                                isGenerating={isGenerating} 
                                identity={npcInfo?.identity}
                                personality={npcInfo?.corePersonalityTraits || npcInfo?.personality}
                                relationStatus={npcInfo?.relationStatus}
                                favorability={npcInfo?.favorability}
                            />
                        );
                    }
                })}
            </div>

            {/* Thinking Process (Post) */}
            {showThinking && postThinkingBlocks.length > 0 && (
                <div className="mt-4 p-3 bg-gray-900/50 border-l border-wuxia-cyan/30 text-xs text-gray-400 font-mono leading-relaxed whitespace-pre-wrap">
                    <span className="text-wuxia-cyan/70 block mb-2">{'【AI Lý luận xem xét】'}</span>
                    <div className="space-y-4">
                        {postThinkingBlocks.map(block => (
                            <div key={block.key}>
                                <span className="text-wuxia-cyan/80 block mb-1">{`· ${block.label}`}</span>
                                <div>{block.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showCommandChanges && isLatest && commands.length > 0 && (
                <div className="mt-8 mx-auto max-w-4xl relative overflow-hidden rounded-xl border border-emerald-500/20 bg-ink-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                    {/* Header with subtle gradient */}
                    <div className="bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent border-b border-emerald-500/10 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-5 bg-emerald-500/50 rounded-full" />
                            <div>
                                <div className="text-[11px] text-emerald-200 font-serif font-bold tracking-[0.1em] uppercase">
                                    {commandPanelTitle}
                                </div>
                                <div className="text-[9px] text-emerald-400/60 font-mono mt-0.5 tracking-tight uppercase">
                                    {commands.length} biến thay đổi · <span className="text-emerald-500/80">S:{commandStats.set} A:{commandStats.add} P:{commandStats.push} D:{commandStats.delete}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 bg-ink-black/50 border border-gray-800/80 rounded-lg">
                            <button
                                onClick={() => setCommandViewMode('compact')}
                                className={`px-2.5 py-1 text-[9px] font-mono rounded-md transition-all ${commandViewMode === 'compact' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'}`}
                            >
                                COMPACT
                            </button>
                            <button
                                onClick={() => setCommandViewMode('full')}
                                className={`px-2.5 py-1 text-[9px] font-mono rounded-md transition-all ${commandViewMode === 'full' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'}`}
                            >
                                DETAILED
                            </button>
                        </div>
                    </div>

                    {/* Table-like row layout */}
                    <div className="divide-y divide-gray-800/50">
                        {commands.map((cmd, idx) => {
                            const valueText = formatCommandValues(cmd?.value);
                            const compactValueText = generateSimpleValueText(cmd?.value);
                            const needPre = usePreFormatting(cmd?.value);
                            const isDelete = cmd.action === 'delete';

                            return (
                                <div key={`${cmd.action}-${cmd.key}-${idx}`} className="group/row flex flex-col sm:flex-row hover:bg-white/[0.02] transition-colors p-3 gap-3">
                                    {/* Action & Key column */}
                                    <div className="flex items-center gap-2.5 sm:w-1/3 shrink-0">
                                        <span className={`w-10 text-center py-0.5 rounded text-[8px] font-bold font-mono tracking-tighter border ${commandStyleMapping[cmd.action]}`}>
                                            {commandTagMapping[cmd.action]}
                                        </span>
                                        <span className="font-mono text-[10px] text-gray-400 break-all select-all group-hover/row:text-emerald-100 transition-colors">
                                            {cmd.key}
                                        </span>
                                    </div>

                                    {/* Value column */}
                                    {!isDelete && (
                                        <div className="flex-1 min-w-0">
                                            {commandViewMode === 'compact' ? (
                                                <div className="text-[10px] text-gray-500/90 font-mono italic truncate bg-white/5 border border-white/5 rounded px-2 py-0.5" title={compactValueText}>
                                                    {compactValueText}
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    {needPre ? (
                                                        <pre className="text-[10px] leading-relaxed text-gray-400 font-mono bg-ink-black/60 border border-white/5 rounded-lg p-2.5 whitespace-pre-wrap break-words overflow-x-auto selection:bg-emerald-500/20 scrollbar-thin">
                                                            {valueText}
                                                        </pre>
                                                    ) : (
                                                        <div className="text-[10px] text-gray-400 font-mono bg-ink-black/40 border border-white/5 rounded-md px-2 py-1 flex items-center min-h-[24px]">
                                                            {valueText}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {isDelete && (
                                        <div className="flex-1 text-[9px] text-rose-500/40 font-mono italic flex items-center">
                                            Vô hiệu hóa/Xóa mục này
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {/* Subtle bottom glow */}
                    <div className="h-1 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
                </div>
            )}

            {/* Footer / Info only */}
            <div className="mt-2 flex justify-between items-center opacity-0 group-hover/turn:opacity-100 transition-opacity duration-300 gap-4">
                <span className="text-[9px] text-gray-600">
                    Số ký tự: {charCount}
                </span>
                {response.shortTerm && (
                    <button
                        onClick={() => setShowMemory(true)}
                        className="text-[9px] text-wuxia-gold/50 hover:text-wuxia-gold/90 max-w-[200px] truncate transition-colors cursor-pointer flex items-center gap-1"
                        title="Xem ký ức ngắn hạn"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-wuxia-gold/50 flex-shrink-0" />
                        <span>Ký ức: {response.shortTerm}</span>
                    </button>
                )}
            </div>

            {/* Memory Popup */}
            {showMemory && response.shortTerm && (
                <div
                    className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setShowMemory(false)}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
                    <div
                        className="relative bg-ink-black border border-wuxia-gold/25 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] max-w-lg w-full max-h-[70vh] flex flex-col overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-wuxia-gold/60 to-transparent pointer-events-none z-10" />

                        {/* Header */}
                        <div className="h-12 shrink-0 border-b border-wuxia-gold/15 bg-ink-black/80 flex items-center justify-between px-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl border border-wuxia-gold/40 bg-gradient-to-br from-wuxia-gold/15 to-transparent flex items-center justify-center text-wuxia-gold font-serif font-bold text-sm shadow-inner shadow-wuxia-gold/10">
                                    Ức
                                </div>
                                <div>
                                    <div className="text-wuxia-gold font-serif font-bold text-sm tracking-[0.15em]">Ký ức ngắn hạn</div>
                                    <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mt-0.5">Vòng {shortTurnLabel}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowMemory(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-xl bg-ink-black/50 border border-gray-700/50 text-gray-400 hover:text-wuxia-red hover:border-wuxia-red/60 hover:bg-ink-black/80 transition-all group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 py-4">
                            <div className="relative bg-ink-black/50 border border-gray-800/50 rounded-xl p-4">
                                {/* Left accent bar */}
                                <div className="absolute top-3 left-0 w-0.5 h-[calc(100%-24px)] rounded-r-full bg-wuxia-gold/50" />
                                {/* Badge row */}
                                <div className="flex items-center gap-2 mb-2.5">
                                    <span className="text-[9px] text-gray-700 font-mono">#{String(turnNumber).padStart(3, '0')}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-wuxia-gold/60 animate-pulse flex-shrink-0" />
                                        <span className="text-[10px] text-gray-500 font-mono bg-ink-black/60 px-2 py-0.5 rounded border border-gray-800/80">Tức thời</span>
                                    </div>
                                </div>
                                <p className="text-gray-300/90 font-serif leading-relaxed text-sm whitespace-pre-wrap pl-2">
                                    {response.shortTerm}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="h-8 shrink-0 bg-ink-black/60 border-t border-gray-900/80 px-4 flex items-center justify-between text-[9px] text-gray-600 font-mono tracking-tight uppercase">
                            <span>Ký ức tức thời · Vòng {shortTurnLabel}</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-wuxia-gold/40" />
                                <span className="text-wuxia-gold/40">Ngắn hạn</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-px bg-gray-800"></div>
        </div>
    );
};

export default TurnItem;
