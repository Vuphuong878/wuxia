
import React, { useState } from 'react';
import { DetailedSectStructure, SectTask, positionLevelOrder, SectTaskStatus } from '../../../models/sect';

interface Props {
    sectData: DetailedSectStructure;
    currentTime: string;
    onAcceptTask?: (task: SectTask) => void;
    onExchange?: (goodsId: string) => void;
    onClose: () => void;
}

type Tab = 'hall' | 'missions' | 'exchange' | 'members';

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = "", onClick }) => (
    <div 
        onClick={onClick}
        className={`relative overflow-hidden rounded-none border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:bg-white/[0.06] hover:border-wuxia-gold/30 group ${className}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
        <div className="relative z-10">{children}</div>
    </div>
);

const SectModal: React.FC<Props> = ({ sectData, currentTime, onClose, onAcceptTask, onExchange }) => {
    const [activeTab, setActiveTab] = useState<Tab>('hall');
    const [missionFilter, setMissionFilter] = useState<'all' | 'active' | 'available'>('all');

    const isTimeAfter = (t1: string, t2: string) => t1 > t2;

    const getMissionStatusColor = (status: SectTaskStatus) => {
        switch (status) {
            case 'Có thể tiếp nhận': return 'text-green-400 border-green-500/30 bg-green-500/5';
            case 'Đang thực hiện': return 'text-wuxia-gold border-wuxia-gold/30 bg-wuxia-gold/5';
            case 'Đã hoàn thành': return 'text-gray-400 border-gray-600/30 bg-gray-600/5';
            case 'Đã quá hạn': return 'text-red-500 border-red-500/30 bg-red-500/5';
            default: return 'text-gray-500 border-gray-600/20';
        }
    };

    const filteredMissions = sectData.taskList.filter(m => {
        if (missionFilter === 'all') return true;
        if (missionFilter === 'active') return m.currentStatus === 'Đang thực hiện';
        if (missionFilter === 'available') return m.currentStatus === 'Có thể tiếp nhận';
        return true;
    });

    const getSafeVal = (obj: any, keys: string[], defaultVal: any = "None") => {
        for (const key of keys) {
            if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
        }
        return defaultVal;
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[220] flex items-center justify-center p-4 md:p-8 font-sans">
            <div className="w-full max-w-4xl h-[80vh] flex flex-col relative overflow-hidden glass-panel border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-none overflow-hidden relative">
                {/* Wuxia Decorative Corners */}
                <div className="wuxia-corner wuxia-corner-tl"></div>
                <div className="wuxia-corner wuxia-corner-tr"></div>
                <div className="wuxia-corner wuxia-corner-bl"></div>
                <div className="wuxia-corner wuxia-corner-br"></div>
                
                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-wuxia-gold/20 blur-[150px] rounded-none -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-wuxia-cyan/15 blur-[120px] rounded-none translate-y-1/2 -translate-x-1/3" />
                </div>

                {/* Header */}
                <div className="h-20 shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-none bg-gradient-to-br from-wuxia-gold/20 to-transparent border border-wuxia-gold/30 flex items-center justify-center shadow-lg shadow-wuxia-gold/5 group">
                            <span className="text-2xl font-serif font-bold text-wuxia-gold drop-shadow-md group-hover:scale-110 transition-transform">
                                {sectData.name[0]}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-wuxia-gold font-serif font-bold text-2xl tracking-[0.2em] drop-shadow-lg uppercase leading-tight">
                                {sectData.name}
                            </h3>
                            <div className="flex gap-4 text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-widest font-bold">
                                <span>Fund: <span className="text-wuxia-gold">{getSafeVal(sectData, ['sectFunds', 'Funds'])}</span></span>
                                <span>Resources: <span className="text-wuxia-cyan">{getSafeVal(sectData, ['sectMaterials', 'Materials'])}</span></span>
                                <span>Construction: <span className="text-gray-300">{getSafeVal(sectData, ['constructionProgress', 'Progress'])}%</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Chức Vị</div>
                            <div className="text-wuxia-cyan font-bold font-serif text-lg tracking-wide">{getSafeVal(sectData, ['playerPosition', 'Position'])}</div>
                        </div>
                        <div className="text-right border-l border-white/10 pl-8">
                            <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Cống Hiến</div>
                            <div className="text-wuxia-gold font-bold font-mono text-xl tracking-tighter">{getSafeVal(sectData, ['playerContribution', 'Contribution'])}</div>
                        </div>
                        <button
                            onClick={onClose}
                            className="group relative w-12 h-12 flex items-center justify-center rounded-none bg-ink-black border border-white/10 text-gray-400 hover:text-white transition-all duration-300 overflow-hidden shadow-lg"
                        >
                            <div className="absolute inset-0 bg-wuxia-red/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <svg className="w-6 h-6 relative z-10 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Navigation Sidebar */}
                    <div className="w-72 bg-black/20 border-r border-wuxia-gold/10 flex flex-col py-8 gap-3 z-10">
                        {[
                            { id: 'hall', label: 'Xướng Danh Đại Sảnh', sub: 'Information & Precepts' },
                            { id: 'missions', label: 'Công Bảng Nhiệm Vụ', sub: 'Missions & Tasks' },
                            { id: 'exchange', label: 'Tàng Kinh Các', sub: 'Exchange Library' },
                            { id: 'members', label: 'Môn Hạ Đệ Tử', sub: 'Sect Members' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`px-8 py-4 text-left transition-all duration-300 relative group ${
                                    activeTab === tab.id
                                        ? 'bg-wuxia-gold/5 text-wuxia-gold'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                                }`}
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 ${activeTab === tab.id ? 'bg-wuxia-gold scale-y-100 shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-transparent scale-y-0'}`} />
                                <div className="font-serif font-bold tracking-[0.1em] text-sm uppercase">{tab.label}</div>
                                <div className="text-[10px] opacity-40 font-mono mt-1 tracking-wider">{tab.sub}</div>
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 relative overflow-y-auto no-scrollbar p-10 z-10">

                        {/* --- HALL --- */}
                        {activeTab === 'hall' && (
                            <div className="max-w-4xl mx-auto space-y-10">
                                <GlassCard className="p-10">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 text-8xl font-serif font-black select-none pointer-events-none tracking-tighter">
                                        SECT
                                    </div>
                                    <h4 className="text-wuxia-gold font-serif font-bold text-xl mb-6 flex items-center gap-4">
                                        <span className="w-1.5 h-8 bg-gradient-to-b from-wuxia-gold to-transparent rounded-none shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                                        Mục Tiêu Môn Phái
                                    </h4>
                                    <p className="text-gray-300 font-serif leading-relaxed text-lg indent-10 italic bg-white/[0.02] p-6 rounded-none border border-white/5 border-dashed">
                                        “{sectData.description}”
                                    </p>
                                    <div className="mt-8 flex flex-wrap gap-3">
                                        {(sectData.sectRules || []).map((rule, i) => (
                                            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-wuxia-red/5 border border-wuxia-red/20 rounded-none text-wuxia-red/70 text-xs font-serif shadow-lg">
                                                <span className="w-1.5 h-1.5 rounded-none bg-wuxia-red" />
                                                Giới Luật {i + 1}: {rule}
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <GlassCard className="p-8">
                                        <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                                            <span>Thăng Tiến Chức Vị</span>
                                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                        </h4>
                                        <div className="space-y-4">
                                            {Object.entries(positionLevelOrder)
                                                .sort((a, b) => a[1] - b[1])
                                                .map(([rank, lvl]) => {
                                                    const currentLvl = positionLevelOrder[sectData.playerPosition] || 0;
                                                    const isCurrent = rank === sectData.playerPosition;
                                                    const isPassed = lvl < currentLvl;
                                                    
                                                    if (lvl > currentLvl + 2 || lvl < currentLvl - 1) return null;

                                                    return (
                                                        <div key={rank} className={`flex items-center gap-5 transition-all duration-500 ${isCurrent ? 'opacity-100 translate-x-1' : 'opacity-40'}`}>
                                                            <div className={`w-10 h-10 rounded-none flex items-center justify-center font-mono font-bold text-sm border shadow-lg ${
                                                                isCurrent ? 'bg-wuxia-gold text-black border-wuxia-gold shadow-wuxia-gold/20' :
                                                                isPassed ? 'bg-gray-800 text-gray-500 border-gray-700' : 'border-white/10 text-gray-700'
                                                            }`}>
                                                                {lvl}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className={`font-serif font-bold tracking-widest uppercase ${isCurrent ? 'text-wuxia-gold text-lg' : 'text-gray-500 text-sm'}`}>
                                                                    {rank}
                                                                </span>
                                                                {isCurrent && <span className="text-[9px] text-wuxia-gold/60 font-mono tracking-widest uppercase font-bold">Vị trí hiện tại</span>}
                                                            </div>
                                                            {isCurrent && <div className="ml-auto w-2 h-2 rounded-none bg-wuxia-gold shadow-[0_0_8px_rgba(212,175,55,1)]" />}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </GlassCard>

                                    <div className="flex flex-col gap-6">
                                        <GlassCard className="p-6 flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-none bg-wuxia-gold/10 border border-wuxia-gold/20 flex items-center justify-center text-wuxia-gold">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sect influence</div>
                                                <div className="text-xl font-bold font-mono text-white">9,842</div>
                                            </div>
                                        </GlassCard>
                                        <GlassCard className="p-6 flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-none bg-wuxia-cyan/10 border border-wuxia-cyan/20 flex items-center justify-center text-wuxia-cyan">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total disciples</div>
                                                <div className="text-xl font-bold font-mono text-white">1,254</div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- MISSIONS --- */}
                        {activeTab === 'missions' && (
                            <div className="space-y-8">
                                <div className="flex gap-4 p-1.5 bg-black/40 rounded-none border border-white/5 w-fit shadow-xl">
                                    {[
                                        { id: 'all', label: 'Tất Cả' },
                                        { id: 'available', label: 'Có Thể Tiếp Nhận' },
                                        { id: 'active', label: 'Đang Thực Hiện' }
                                    ].map(f => (
                                        <button
                                            key={f.id}
                                            onClick={() => setMissionFilter(f.id as any)}
                                            className={`px-6 py-2 text-xs rounded-none font-bold uppercase tracking-widest transition-all duration-300 ${
                                                missionFilter === f.id
                                                    ? 'bg-wuxia-gold text-black shadow-lg shadow-wuxia-gold/20'
                                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {filteredMissions.map(mission => {
                                        const statusColor = getMissionStatusColor(mission.currentStatus);
                                        const isExpired = isTimeAfter(currentTime, mission.deadline) && mission.currentStatus !== 'Đã hoàn thành';

                                        return (
                                            <GlassCard key={mission.id} className="p-6 group">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-2 h-10 rounded-none transition-all duration-500 group-hover:scale-y-110 ${
                                                                mission.currentStatus === 'Có thể tiếp nhận' ? 'bg-green-500' :
                                                                mission.currentStatus === 'Đang thực hiện' ? 'bg-wuxia-gold' : 'bg-gray-600'
                                                            }`} />
                                                            <div>
                                                                <div className="flex items-center gap-3">
                                                                    <h4 className="text-gray-100 font-bold text-lg tracking-wide">{mission.title}</h4>
                                                                    <span className={`text-[9px] px-2 py-0.5 rounded-none border font-bold uppercase tracking-widest ${statusColor}`}>
                                                                        {isExpired ? 'Đã quá hạn' : mission.currentStatus}
                                                                    </span>
                                                                    <span className="text-[9px] bg-white/[0.05] text-gray-400 px-2 py-0.5 rounded-none border border-white/10 uppercase font-mono">
                                                                        {mission.type}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-400 text-sm mt-2 max-w-3xl leading-relaxed italic">
                                                                    “{mission.description}”
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex gap-8 text-[10px] font-mono font-bold uppercase tracking-tighter text-gray-500 ml-6">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1 h-1 rounded-none bg-gray-600" />
                                                                Phát hành: {mission.releaseDate}
                                                            </div>
                                                            <div className={`flex items-center gap-2 ${isExpired ? 'text-wuxia-red' : ''}`}>
                                                                <span className="w-1 h-1 rounded-none bg-current" />
                                                                Hạn chót: {mission.deadline}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right space-y-4">
                                                        <div className="space-y-1">
                                                            <div className="text-[9px] text-gray-600 uppercase font-bold tracking-[0.2em]">Phần thưởng</div>
                                                            <div className="font-mono font-bold">
                                                                <div className="text-wuxia-gold text-sm">+{mission.rewardContribution} Cống Hiến</div>
                                                                {mission.rewardFunds > 0 && <div className="text-gray-300 text-xs">+{mission.rewardFunds} Đồng</div>}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex flex-col gap-2">
                                                            {mission.currentStatus === 'Có thể tiếp nhận' && !isExpired && (
                                                                <button
                                                                    onClick={() => onAcceptTask(mission)}
                                                                    className="px-6 py-2 bg-wuxia-gold/10 hover:bg-wuxia-gold text-wuxia-gold hover:text-black border border-wuxia-gold/50 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-black/40"
                                                                >
                                                                    Tiếp nhận
                                                                </button>
                                                            )}
                                                            {mission.currentStatus === 'Đang thực hiện' && !isExpired && (
                                                                <div className="px-6 py-2 bg-white/5 border border-white/10 text-gray-500 rounded-none text-xs font-bold uppercase tracking-widest opacity-60">
                                                                    Đang tiến hành...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* --- EXCHANGE --- */}
                        {activeTab === 'exchange' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {sectData.exchangeList.map(good => (
                                    <GlassCard key={good.id} className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 rounded-none bg-gradient-to-br from-wuxia-cyan/20 to-transparent border border-wuxia-cyan/30 flex items-center justify-center text-wuxia-cyan shadow-lg shadow-wuxia-cyan/5">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <span className="text-[9px] font-mono text-gray-500 bg-black/40 px-2 py-0.5 rounded-none border border-white/5 uppercase tracking-widest">
                                                {good.type}
                                            </span>
                                        </div>

                                        <h4 className="text-gray-100 font-bold text-lg mb-2 tracking-wide font-serif">{good.itemName}</h4>
                                        <div className="text-[10px] text-gray-500 flex items-center gap-2 uppercase tracking-widest font-bold">
                                            Yêu cầu: <span className="text-wuxia-cyan">{good.requiredPosition}</span>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <div className="text-[9px] text-gray-600 uppercase font-bold tracking-[0.2em] mb-1">Giá trao đổi</div>
                                                    <div className="text-wuxia-gold font-mono font-black text-xl tracking-tighter">{good.exchangePrice} pt</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[9px] text-gray-600 uppercase font-bold tracking-[0.2em] mb-1">Tồn kho</div>
                                                    <div className="text-gray-400 font-mono font-bold text-sm tracking-tighter">{good.stock} cuốn</div>
                                                </div>
                                            </div>
                                            
                                            {onExchange && (
                                                <button
                                                    onClick={() => onExchange(good.id)}
                                                    className="w-full py-3 bg-wuxia-cyan/10 hover:bg-wuxia-cyan text-wuxia-cyan hover:text-black border border-wuxia-cyan/50 rounded-none text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg shadow-black/40"
                                                >
                                                    Trao đổi kinh văn
                                                </button>
                                            )}
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        )}

                        {/* --- MEMBERS --- */}
                        {activeTab === 'members' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sectData.importantMembers.map(mem => (
                                    <GlassCard key={mem.id} className="p-6">
                                        <div className="flex items-start gap-6">
                                            <div className={`shrink-0 w-16 h-16 rounded-none border flex items-center justify-center text-2xl font-black font-serif shadow-2xl ${
                                                mem.gender === 'Nữ' 
                                                    ? 'border-pink-500/30 bg-pink-500/10 text-pink-500 shadow-pink-500/5' 
                                                    : 'border-wuxia-cyan/30 bg-wuxia-cyan/10 text-wuxia-cyan shadow-wuxia-cyan/5'
                                            }`}>
                                                {mem.name[0]}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-white font-bold text-xl tracking-wide font-serif">{mem.name}</h4>
                                                    <div className="px-3 py-1 bg-wuxia-gold/10 border border-wuxia-gold/30 rounded-none text-wuxia-gold text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                        {mem.identity}
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 text-[10px] text-gray-500 font-mono font-bold uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-none bg-current opacity-30" />{mem.gender}</span>
                                                    <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-none bg-current opacity-30" />{mem.age} Tuổi</span>
                                                    <span className="text-wuxia-cyan font-black">{mem.realm}</span>
                                                </div>
                                                <p className="text-sm text-gray-400 font-serif italic border-t border-white/5 pt-4 leading-relaxed group-hover:text-gray-300 transition-colors">
                                                    “{mem.brief}”
                                                </p>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="h-10 shrink-0 bg-ink-black/90 border-t border-wuxia-gold/10 px-8 flex items-center justify-between z-10 text-[9px] text-gray-500 font-mono tracking-[0.2em] uppercase">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-none bg-wuxia-gold shadow-[0_0_8px_rgba(212,175,55,1)]" />
                            <span>Võ lâm khí tượng</span>
                        </div>
                        <span className="opacity-30">|</span>
                        <span>Môn phái uy danh</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectModal;
