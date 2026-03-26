import React, { useState } from 'react';
import { WorldDataStructure } from '../../../models/world';
import { EnvironmentData } from '../../../models/environment';

interface Props {
    world: WorldDataStructure;
    environment?: EnvironmentData;
    onClose: () => void;
}

type TabType = 'overview' | 'events' | 'npcs';

// Premium Glass Card Component - Refactored for Square Glassmorphism
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`relative overflow-hidden rounded-none border border-wuxia-gold/20 bg-black/40 backdrop-blur-md shadow-2xl group ${className}`}>
        <div className="relative z-10">{children}</div>
    </div>
);

const WorldModal: React.FC<Props> = ({ world, environment, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabType>('events');
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getSafeVal = (obj: any, keys: string[]) => {
        for (const key of keys) {
            if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
        }
        return null;
    };

    const events = getSafeVal(world, ['ongoingEvents', 'Ongoing events']) || [];
    const npcs = getSafeVal(world, ['activeNpcList', 'Active NPCs']) || [];

    return (
        <div className="fixed inset-0 bg-ink-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-0 lg:p-4 font-sans">
            {/* Background Ink Wash Effect */}
            <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10"></div>
                <div className="absolute -top-1/4 -left-1/4 w-full h-1/2 bg-wuxia-cyan/5 blur-[160px]"></div>
                <div className="absolute -bottom-1/4 -right-1/4 w-full h-1/2 bg-wuxia-gold/5 blur-[160px]"></div>
            </div>

            <div className={`glass-panel w-full ${isMobile ? 'h-full' : 'max-w-6xl h-[85vh]'} flex flex-col shadow-[0_0_150px_rgba(0,0,0,1)] relative overflow-hidden rounded-none border-x-0 lg:border-x border-wuxia-gold/20`}>
                {/* Wuxia Decorative Corners - Only on Desktop */}
                {!isMobile && (
                    <>
                        <div className="wuxia-corner wuxia-corner-tl"></div>
                        <div className="wuxia-corner wuxia-corner-tr"></div>
                        <div className="wuxia-corner wuxia-corner-bl"></div>
                        <div className="wuxia-corner wuxia-corner-br"></div>
                    </>
                )}
                
                {/* Header */}
                <div className={`${isMobile ? 'h-auto py-4' : 'h-24'} shrink-0 border-b border-wuxia-gold/20 bg-ink-black/80 flex items-center justify-between px-6 lg:px-10 relative z-50 backdrop-blur-md`}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-none border border-wuxia-gold/40 flex items-center justify-center bg-gradient-to-b from-wuxia-gold/20 to-transparent shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                            <span className="text-xl lg:text-2xl font-serif text-wuxia-gold drop-shadow-sm">武</span>
                        </div>
                        <div>
                            <h3 className="text-wuxia-gold font-serif font-bold text-xl lg:text-3xl tracking-[0.2em] lg:tracking-[0.4em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">TÌNH HÌNH THẾ GIỚI</h3>
                            <p className="text-gray-400 text-[9px] lg:text-[11px] tracking-[0.1em] lg:tracking-[0.2em] mt-0.5 lg:mt-1 italic opacity-80 uppercase">World Status</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end border-r border-wuxia-gold/20 pr-6">
                            <span className="text-wuxia-gold/60 text-[10px] uppercase tracking-widest font-bold">Thiên Đạo Nghiệp</span>
                            <span className="text-wuxia-gold text-lg font-serif">{environment?.karma || 0}</span>
                        </div>
                        <div className="hidden md:flex flex-col items-end border-r border-wuxia-gold/20 pr-6">
                            <span className="text-wuxia-gold/60 text-[10px] uppercase tracking-widest font-bold">Thế Giới Tuyến</span>
                            <span className="text-wuxia-gold text-lg font-serif">{environment?.worldTick || 0}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="group relative w-10 h-10 flex items-center justify-center rounded-none border border-wuxia-gold/20 bg-black/40 overflow-hidden shadow-lg active:scale-95 transition-transform"
                        >
                            <div className="absolute inset-0 bg-wuxia-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-wuxia-gold relative z-10 transition-transform group-hover:rotate-90">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Tab Navigation */}
                {isMobile && (
                    <div className="flex bg-black/40 border-b border-wuxia-gold/10 px-2 pt-2">
                        {[
                            { id: 'events', label: 'Sự Kiện' },
                            { id: 'npcs', label: 'Nhân Sĩ' },
                            { id: 'overview', label: 'Thế Giới' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${
                                    activeTab === tab.id
                                        ? 'text-wuxia-gold border-wuxia-gold bg-wuxia-gold/5'
                                        : 'text-gray-500 border-transparent'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex-1 flex overflow-hidden">
                    {/* Desktop Navigation Sidebar */}
                    {!isMobile && (
                        <div className="w-80 border-r border-wuxia-gold/10 bg-black/20 flex flex-col py-10 gap-4 relative px-6 backdrop-blur-md">
                            {[
                                { id: 'events', label: 'Bách Hiểu Sinh', sub: 'Thế giới đại sự' },
                                { id: 'npcs', label: 'Anh Hùng Bảng', sub: 'Nhân sĩ hoạt động' },
                                { id: 'overview', label: 'Biến Thiên', sub: 'Thiên hạ bản đồ' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`group relative px-6 py-5 rounded-none border text-left transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-wuxia-gold/10 border-wuxia-gold/30 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]'
                                            : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'
                                    }`}
                                >
                                    {activeTab === tab.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-wuxia-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
                                    )}
                                    <div className="relative z-10">
                                        <span className={`block font-serif font-bold tracking-[0.15em] text-xl ${
                                            activeTab === tab.id ? 'text-wuxia-gold' : 'text-gray-400'
                                        }`}>{tab.label}</span>
                                        <span className="block text-[10px] tracking-widest text-gray-500 font-sans mt-1 opacity-60 uppercase">{tab.sub}</span>
                                    </div>
                                </button>
                            ))}
                            <div className="mt-auto opacity-5 pointer-events-none select-none p-4">
                                <div className="text-8xl font-serif leading-none italic text-wuxia-gold">江湖</div>
                            </div>
                        </div>
                    )}

                    {/* Main Scrolling Content Area */}
                    <div className={`flex-1 ${isMobile ? 'p-4' : 'p-12'} overflow-y-auto custom-scrollbar relative bg-black/10`}>
                        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
                        
                        <div className="relative z-10 max-w-5xl mx-auto">
                            {/* --- EVENTS TAB --- */}
                            {activeTab === 'events' && (
                                <div className="space-y-6 lg:space-y-8">
                                    <div className="flex items-center gap-3 border-b border-wuxia-gold/10 pb-4">
                                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-none bg-wuxia-gold"></div>
                                        <h4 className="text-wuxia-gold/70 font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em] text-[10px] lg:text-xs">Thiên hạ phong vân xuất ngã bối</h4>
                                    </div>

                                    {events.length > 0 ? (
                                        <div className={`relative space-y-6 lg:space-y-8 ${isMobile ? 'pl-4' : 'pl-8'} border-l border-dashed border-wuxia-gold/20 ml-2 lg:ml-4`}>
                                            {events.map((evt: any, idx: number) => (
                                                <div key={evt.ID || idx} className="relative group">
                                                    <div className={`absolute ${isMobile ? '-left-[21px] w-4 h-4' : '-left-[41px] w-6 h-6'} top-6 lg:top-8 rounded-none bg-black border border-wuxia-gold/40 flex items-center justify-center shadow-xl z-20`}>
                                                        <div className="w-1/2 h-1/2 rounded-none bg-wuxia-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
                                                    </div>

                                                    <GlassCard className={`${isMobile ? 'p-4 lg:p-6' : 'p-8'}`}>
                                                        <div className={`flex flex-col lg:flex-row justify-between items-start gap-4 mb-6`}>
                                                            <div className="space-y-2">
                                                                <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                                                                    <h4 className="text-wuxia-gold font-serif text-xl lg:text-3xl font-bold tracking-wide">{evt.title}</h4>
                                                                    <span className="px-2 py-0.5 lg:px-3 lg:py-1 rounded-none bg-wuxia-gold/10 text-wuxia-gold text-[8px] lg:text-[10px] font-bold border border-wuxia-gold/20 uppercase tracking-wider">{evt.type}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-wuxia-cyan/70 text-[9px] lg:text-[11px] font-mono tracking-widest uppercase">
                                                                    <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                                    {evt.location}
                                                                </div>
                                                            </div>
                                                            <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-0 lg:text-right w-full lg:w-auto">
                                                                <div className="px-2 py-1 lg:px-3 lg:py-1 rounded-none bg-black/50 border border-wuxia-gold/10 text-[8px] lg:text-[10px] text-gray-400 font-mono w-full lg:w-auto">
                                                                    <div className="text-wuxia-gold/60">{evt.startTime}</div>
                                                                    <div className="opacity-40 italic">ETA: {evt.estimatedEndTime}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="bg-black/40 border-l-2 lg:border-l-4 border-wuxia-gold/60 p-4 lg:p-6 rounded-none relative overflow-hidden">
                                                            <p className="relative z-10 text-gray-300 text-sm lg:text-base leading-relaxed font-serif italic">
                                                                "{evt.content || evt.description || evt.summary || 'Hành trình vạn dặm, khởi đầu từ đây...'}"
                                                            </p>
                                                        </div>

                                                        <div className="mt-4 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="relative flex h-2 w-2">
                                                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                                  <span className="relative inline-flex rounded-none h-2 w-2 bg-green-500"></span>
                                                                </span>
                                                                <span className="text-[10px] text-green-500 font-bold uppercase tracking-[0.2em]">{evt.currentStatus}</span>
                                                            </div>
                                                        </div>
                                                    </GlassCard>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                            <div className="text-6xl mb-4 italic font-serif text-wuxia-gold">静</div>
                                            <p className="text-[10px] lg:text-sm tracking-[0.3em] lg:tracking-[0.5em] uppercase text-center">Vạn vật tịch liêu, chưa có dị động</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- NPCS TAB --- */}
                            {activeTab === 'npcs' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 pb-10">
                                    {npcs.length > 0 ? npcs.map((npc: any, idx: number) => (
                                        <GlassCard key={npc.ID || idx} className="h-full flex flex-col group/npc">
                                            <div className="p-4 lg:p-5 flex-1 relative z-10">
                                                <div className="flex gap-3 lg:gap-4 items-start mb-4">
                                                    <div className="relative shrink-0">
                                                        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-none border border-wuxia-gold/30 bg-black/40 overflow-hidden p-1">
                                                            <div className="w-full h-full bg-gradient-to-tr from-gray-900 to-gray-800 flex items-center justify-center text-xl lg:text-2xl font-serif text-wuxia-gold font-bold">
                                                                {npc['Full Name']?.[0] || npc.name?.[0]}
                                                            </div>
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 bg-wuxia-gold text-black text-[7px] lg:text-[9px] font-black px-1.5 py-0.5 rounded-none shadow-lg uppercase">
                                                            {npc['Kingdom'] || 'Giang Hồ'}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div className="min-w-0">
                                                                <h4 className="text-gray-100 font-serif text-base lg:text-xl font-bold tracking-wide group-hover/npc:text-wuxia-gold truncate">{npc.name || npc['Full Name']}</h4>
                                                                <div className="text-wuxia-gold/70 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest mt-0.5 truncate">{npc.title}</div>
                                                            </div>
                                                            <div className="px-1.5 py-0.5 rounded-none border border-wuxia-cyan/30 text-wuxia-cyan text-[8px] lg:text-[10px] font-bold bg-wuxia-cyan/10 shrink-0">
                                                                {npc['Realm']}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-2 text-[9px] lg:text-[10px] text-gray-500 border-t border-white/5 pt-3">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="uppercase tracking-widest opacity-60 text-[7px] lg:text-[8px]">Vị trí</span>
                                                            <span className="text-gray-300 font-medium truncate">{npc.currentLocation}</span>
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="uppercase tracking-widest opacity-60 text-[7px] lg:text-[8px]">Trạng thái</span>
                                                            <span className="text-gray-300 font-medium truncate">{npc['Status']}</span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-black/30 rounded-none p-3 border border-white/5 group-hover/npc:bg-black/50 transition-colors">
                                                        <p className="text-gray-400 text-[11px] lg:text-xs leading-relaxed italic line-clamp-2">
                                                            {npc.currentActionDescription || npc.description || npc.status || 'Đang bận bịu với thế giới riêng...'}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {(Array.isArray(npc.heldTreasures) ? npc.heldTreasures : []).slice(0, 3).map((item: string, i: number) => (
                                                            <span key={i} className="text-[7px] lg:text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 text-gray-500 uppercase tracking-tighter">{item}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center text-[8px] lg:text-[9px] text-gray-600 font-mono">
                                                <span>S: {npc.actionStartTime}</span>
                                                <span>E: {npc.actionEstimatedEndTime}</span>
                                            </div>
                                        </GlassCard>
                                    )) : (
                                        <div className="col-span-2 py-20 text-center text-gray-600 font-serif italic text-lg opacity-30">
                                            Sóng yên biển lặng, anh hùng ẩn mình...
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- CHRONICLE TAB --- */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6 lg:space-y-10 pb-10">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                                        {[
                                            { label: 'Cao Thủ', val: npcs.length, color: 'text-wuxia-gold' },
                                            { label: 'Đại Địa', val: Array.isArray(world.maps) ? world.maps.length : 0, color: 'text-wuxia-cyan' },
                                            { label: 'Thành Thị', val: Array.isArray(world.maps) ? world.maps.reduce((acc, m) => acc + (Array.isArray(m.cities) ? m.cities.length : 0), 0) : 0, color: 'text-wuxia-gold' },
                                            { label: 'Kiến Trúc', val: Array.isArray(world.buildings) ? world.buildings.length : 0, color: 'text-gray-200' },
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white/5 border border-white/10 p-4 lg:p-5 rounded-none backdrop-blur-sm relative group overflow-hidden">
                                                <div className="text-[8px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1 lg:mb-2">{stat.label}</div>
                                                <div className={`text-2xl lg:text-4xl font-serif font-black ${stat.color}`}>{stat.val}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 py-4">
                                            <div className="h-px flex-1 bg-wuxia-gold/20"></div>
                                            <h4 className="text-wuxia-gold font-serif font-bold text-lg lg:text-2xl tracking-[0.2em] lg:tracking-[0.4em] uppercase">VŨ TRỤ BIẾN THIÊN</h4>
                                            <div className="h-px flex-1 bg-wuxia-gold/20"></div>
                                        </div>

                                        <div className="relative space-y-8 lg:space-y-10 pl-6 lg:pl-10 border-l border-wuxia-gold/10 ml-2 lg:ml-5 py-5">
                                            {Array.isArray(world.worldHistory) && world.worldHistory.length > 0 ? world.worldHistory.map((hist: any, i: number) => (
                                                <div key={i} className="relative group">
                                                    <div className={`absolute ${isMobile ? '-left-[27px] w-3 h-3' : '-left-[48px] w-4 h-4'} top-1.5 rounded-none bg-black border border-wuxia-gold/20 flex items-center justify-center p-0.5 group-hover:border-wuxia-gold transition-colors`}>
                                                        <div className="w-full h-full rounded-none bg-gray-700 group-hover:bg-wuxia-gold"></div>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <div className="inline-block px-2 py-0.5 rounded-none bg-wuxia-gold/10 text-wuxia-gold font-mono text-[8px] lg:text-[10px] font-bold border border-wuxia-gold/20">
                                                            Năm {hist.startTime?.split(':')[0] || '??'}
                                                        </div>
                                                        <h4 className="text-gray-200 font-serif font-bold text-base lg:text-xl group-hover:text-wuxia-gold transition-colors">{hist.title}</h4>
                                                        <p className="text-gray-500 text-xs lg:text-sm leading-relaxed max-w-2xl font-serif italic border-l border-white/10 pl-4 group-hover:text-gray-300 transition-colors">
                                                            {hist.eventResult || hist.content || hist.description || 'Ghi chép đã bị mờ nhạt theo thời gian...'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                                    <div className="text-5xl font-serif italic mb-2 text-wuxia-gold">無</div>
                                                    <p className="text-[10px] uppercase tracking-widest">Sử sách chưa ghi lại điều gì</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorldModal;
