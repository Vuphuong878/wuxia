import React, { useState, useMemo, useEffect } from 'react';
import { 
    Package, 
    X, 
    ChevronRight, 
    Briefcase, 
    Shield, 
    Box, 
    Sparkles, 
    Gem, 
    Weight,
    Search,
    Filter,
    Layers,
    LayoutGrid,
    Menu
} from 'lucide-react';
import { CharacterData } from '../../../types';
import { GameItem } from '../../../models/item';

interface Props {
    character: CharacterData;
    onClose: () => void;
    onDeleteItem?: (itemId: string) => void;
}

const InventoryModal: React.FC<Props> = ({ character, onClose, onDeleteItem }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const unstoredViewId = '__unstored__';
    const equipmentSlotSet = useMemo(() => new Set([
        'head', 'chest', 'legs', 'hands', 'feet',
        'mainWeapon', 'subWeapon', 'hiddenWeapon', 'back', 'waist', 'mount',
        'Đầu', 'Ngực', 'Chân', 'Tay', 'Bàn tay', 'Bàn chân',
        'Vũ khí chính', 'Vũ khí phụ', 'Ám khí', 'Lưng', 'Thắt lưng', 'Tọa kỵ'
    ]), []);

    const containers = useMemo(() => {
        return character.itemList.filter(item =>
            (item.containerProperties !== undefined || (item as any).containerAttributes !== undefined) &&
            (item.type === 'Vật chứa' || item.type === 'Phòng cụ')
        );
    }, [character.itemList]);

    const containerIds = useMemo(() => new Set(containers.map(c => c.id)), [containers]);

    const itemContainerMap = useMemo(() => {
        const out = new Map<string, string | null>();
        character.itemList.forEach((item) => {
            const explicit = typeof item.currentContainerId === 'string' ? item.currentContainerId.trim() : '';
            if (explicit && (containerIds.has(explicit) || equipmentSlotSet.has(explicit))) {
                out.set(item.id, explicit);
                return;
            }
            out.set(item.id, null);
        });
        return out;
    }, [character.itemList, containerIds, equipmentSlotSet]);

    const [selectedContainerId, setSelectedContainerId] = useState<string | null>(unstoredViewId);

    useEffect(() => {
        const available = new Set([unstoredViewId, ...containers.map(c => c.id)]);
        if (!selectedContainerId || !available.has(selectedContainerId)) {
            setSelectedContainerId(unstoredViewId);
        }
    }, [containers, selectedContainerId]);

    const currentContainer = character.itemList.find(i => i.id === selectedContainerId);

    const { containerItems, containerCapacity, containerUsedDerived } = useMemo(() => {
        const rawItems = character.itemList.filter((item) => {
            const location = itemContainerMap.get(item.id) || null;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.type.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (!matchesSearch) return false;

            if (selectedContainerId === unstoredViewId) {
                return location === null;
            }
            return location === selectedContainerId && item.id !== selectedContainerId;
        });

        const groups: { item: GameItem, count: number }[] = [];
        const map = new Map<string, number>();

        rawItems.forEach(item => {
            const key = `${item.name}-${item.quality}-${item.type}`;
            if (map.has(key)) {
                groups[map.get(key)!].count++;
            } else {
                groups.push({ item, count: 1 });
                map.set(key, groups.length - 1);
            }
        });

        const derivedUsed = rawItems.reduce((sum, item) => sum + (Number(item.spaceOccupied) || 0), 0);
        const containerProps = currentContainer?.containerProperties || (currentContainer as any)?.containerAttributes;
        const capacity = containerProps?.maxCapacity || 0;

        return {
            containerItems: groups,
            containerCapacity: capacity,
            containerUsedDerived: derivedUsed
        };
    }, [currentContainer, character.itemList, itemContainerMap, selectedContainerId, searchQuery]);

    const getQualityColor = (quality: string) => {
        switch (quality) {
            case 'Phàm phẩm': return 'text-slate-400';
            case 'Lương phẩm': return 'text-emerald-400';
            case 'Thượng phẩm': return 'text-wuxia-cyan';
            case 'Cực phẩm': return 'text-purple-400';
            case 'Tuyệt thế': return 'text-orange-400';
            case 'Truyền thuyết': return 'text-wuxia-gold';
            case 'Thần binh': return 'text-red-500';
            default: return 'text-white';
        }
    };

    const containerTabs = (
        <div className={`flex ${isMobile ? 'flex-row overflow-x-auto no-scrollbar py-2 px-2 gap-2' : 'flex-col p-4 gap-2 h-full'}`}>
            <button
                onClick={() => {
                    setSelectedContainerId(unstoredViewId);
                    if (isMobile) setShowMobileSidebar(false);
                }}
                className={`flex items-center gap-3 p-3 transition-all border ${
                    selectedContainerId === unstoredViewId 
                        ? 'bg-wuxia-gold/10 border-wuxia-gold/30 text-wuxia-gold' 
                        : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                } ${isMobile ? 'shrink-0 min-w-[120px]' : 'w-full'}`}
            >
                <LayoutGrid className="w-4 h-4" />
                <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest">Chung</span>
                    {!isMobile && <span className="text-[8px] opacity-40 italic">Kho mặc định</span>}
                </div>
            </button>

            {containers.map((c) => {
                const isSelected = selectedContainerId === c.id;
                const capacity = c.containerProperties?.maxCapacity ?? (c as any).containerAttributes?.maxCapacity ?? 0;
                const occupied = character.itemList.filter(i => i.currentContainerId === c.id).length;
                
                return (
                    <button
                        key={c.id}
                        onClick={() => {
                            setSelectedContainerId(c.id);
                            if (isMobile) setShowMobileSidebar(false);
                        }}
                        className={`flex items-center gap-3 p-3 transition-all border ${
                            isSelected 
                                ? 'bg-wuxia-cyan/10 border-wuxia-cyan/30 text-wuxia-cyan' 
                                : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                        } ${isMobile ? 'shrink-0 min-w-[140px]' : 'w-full'}`}
                    >
                        {c.type === 'Phòng cụ' ? <Shield className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                        <div className="flex flex-col items-start min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest truncate w-full">{c.name}</span>
                            {!isMobile && <span className="text-[8px] opacity-40">{occupied}/{capacity} Ô</span>}
                        </div>
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className={`fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center font-sans overflow-hidden ${isMobile ? 'p-0' : 'p-4'}`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-wuxia-gold/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-wuxia-cyan/20 blur-[120px] rounded-full animate-pulse capitalize" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className={`relative w-full ${isMobile ? 'h-full' : 'max-w-6xl h-[85vh]'} glass-panel flex flex-col shadow-2xl overflow-hidden`}>
                {/* Wuxia corners */}
                {!isMobile && (
                    <>
                        <div className="wuxia-corner wuxia-corner-tl !border-wuxia-gold/40"></div>
                        <div className="wuxia-corner wuxia-corner-tr !border-wuxia-gold/40"></div>
                        <div className="wuxia-corner wuxia-corner-bl !border-wuxia-gold/40"></div>
                        <div className="wuxia-corner wuxia-corner-br !border-wuxia-gold/40"></div>
                    </>
                )}

                {/* Header */}
                <header className={`shrink-0 bg-black/40 border-b border-white/10 relative z-10 ${isMobile ? 'px-4 py-3' : 'h-20 px-8 flex items-center justify-between'}`}>
                    <div className={`flex items-center gap-6 ${isMobile ? 'justify-between w-full' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className={`bg-wuxia-gold/10 border border-wuxia-gold/30 flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
                                <Package className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-wuxia-gold`} />
                            </div>
                            <div>
                                <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-serif font-bold text-wuxia-gold tracking-widest uppercase flex items-center gap-3`}>
                                    Hành Trang
                                    {!isMobile && <div className="h-1 w-8 bg-wuxia-gold/30"></div>}
                                </h2>
                                {isMobile && (
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Weight className="w-3 h-3 text-wuxia-cyan/60" />
                                        <span className={`text-[10px] font-mono font-bold ${character.currentWeight > character.maxWeight ? 'text-red-500' : 'text-wuxia-cyan/80'}`}>
                                            {character.currentWeight.toFixed(1)}/{character.maxWeight} TL
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isMobile && (
                            <div className="flex items-center gap-6">
                                <div className="h-10 w-px bg-white/10"></div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Tải Trọng</span>
                                        <span className={`text-[10px] font-mono font-bold ${character.currentWeight > character.maxWeight ? 'text-red-500' : 'text-wuxia-gold'}`}>
                                            {character.currentWeight.toFixed(1)} / {character.maxWeight}
                                        </span>
                                    </div>
                                    <div className="w-48 h-1 bg-white/5 relative overflow-hidden">
                                        <div 
                                            className={`absolute inset-y-0 left-0 transition-all duration-500 ${character.currentWeight > character.maxWeight ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-wuxia-gold/60 shadow-[0_0_8px_rgba(212,175,55,0.3)]'}`}
                                            style={{ width: `${Math.min((character.currentWeight / character.maxWeight) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={`flex items-center gap-4 ${isMobile ? '' : 'ml-auto'}`}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input 
                                    type="text" 
                                    placeholder="Tìm..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`bg-white/5 border border-white/10 pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-wuxia-gold/30 placeholder:text-white/20 ${isMobile ? 'w-32' : 'w-64'}`}
                                />
                            </div>
                            <button 
                                onClick={onClose}
                                className={`flex items-center justify-center transition-all bg-white/5 border border-white/10 text-white/40 hover:text-wuxia-gold hover:border-wuxia-gold ${isMobile ? 'w-10 h-10' : 'w-12 h-12'}`}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className={`flex-1 flex overflow-hidden relative ${isMobile ? 'flex-col' : 'flex-row'}`}>
                    {/* Sidebar: Containers */}
                    <aside className={`shrink-0 bg-black/20 border-white/10 ${isMobile ? 'w-full h-auto border-b' : 'w-64 border-r overflow-y-auto no-scrollbar h-full'}`}>
                        {containerTabs}
                    </aside>

                    {/* Content: Item Grid */}
                    <section className="flex-1 flex flex-col min-w-0 bg-black/10">
                        {/* Subheader info if container selected */}
                        {currentContainer && !isMobile && (
                            <div className="h-10 px-8 flex items-center justify-between bg-white/[0.02] border-b border-white/5 shrink-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">{currentContainer.name}</span>
                                    <div className="h-3 w-px bg-white/10"></div>
                                    <span className="text-[10px] text-wuxia-cyan/60 font-medium italic italic capitalize">
                                        Sức chứa: {containerUsedDerived} / {containerCapacity} ô
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className={`flex-1 overflow-y-auto custom-scrollbar ${isMobile ? 'p-3' : 'p-8'}`}>
                            {containerItems.length > 0 ? (
                                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                                    {containerItems.map(({ item, count }) => (
                                        <div
                                            key={item.id}
                                            className="group relative bg-white/[0.02] border border-white/5 p-3 flex flex-col gap-3 transition-all hover:bg-white/[0.05] hover:border-wuxia-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)]"
                                        >
                                            <div className="flex gap-3">
                                                <div className={`shrink-0 w-16 h-16 border border-white/10 bg-black/40 flex items-center justify-center relative overflow-hidden`}>
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                    ) : (
                                                        <Box className="w-8 h-8 text-white/10" />
                                                    )}
                                                    <div className={`absolute left-0 top-0 w-1 h-full opacity-50 ${getQualityColor(item.quality).replace('text', 'bg')}`}></div>
                                                    {count > 1 && (
                                                        <div className="absolute bottom-0 right-0 bg-black/80 text-white/60 text-[9px] px-1 border-tl border-white/10 font-bold">
                                                            x{count}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`text-sm font-bold truncate leading-tight mb-0.5 ${getQualityColor(item.quality)}`}>
                                                        {item.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20 whitespace-nowrap">{item.type}</span>
                                                        <div className="h-2 w-px bg-white/10"></div>
                                                        <span className="text-[9px] text-wuxia-gold/40 font-mono italic">#{item.id?.slice(-4)}</span>
                                                    </div>
                                                    <p className="text-[10px] text-white/30 italic line-clamp-2 leading-relaxed">
                                                        "{item.description}"
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-bold">
                                                <div className="flex gap-3">
                                                    <div className="flex items-center gap-1 text-white/20 uppercase tracking-tighter">
                                                        <Weight className="w-3 h-3" />
                                                        {item.weight} TL
                                                    </div>
                                                    <div className="flex items-center gap-1 text-white/20 uppercase tracking-tighter">
                                                        <Box className="w-3 h-3" />
                                                        {item.spaceOccupied} Ô
                                                    </div>
                                                </div>
                                                <span className="text-wuxia-gold font-mono flex items-center gap-1.5 bg-wuxia-gold/5 px-2 py-0.5 border border-wuxia-gold/10">
                                                    <Gem className="w-3 h-3" />
                                                    {item.value}
                                                </span>
                                            </div>

                                            {/* Action Hover Overlay - Desktop Onlyish */}
                                            <div className={`absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100 border border-wuxia-gold/40`}>
                                                <button 
                                                    onClick={() => onDeleteItem?.(item.id)}
                                                    className="w-32 bg-red-600/80 hover:bg-red-700 text-white py-2 text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <div className="w-24 h-24 border border-white/5 flex items-center justify-center mb-6">
                                        <Search className="w-10 h-10 text-white/40" strokeWidth={1} />
                                    </div>
                                    <h3 className="text-xl font-serif font-black text-white/60 tracking-[0.5em] uppercase">Trống Không</h3>
                                    <p className="text-[10px] font-medium tracking-[0.2em] uppercase mt-4 max-w-xs leading-relaxed italic italic">
                                        "Tiền tài như bèo bọt, vạn vật giai không."
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                {/* Footer Quote */}
                <footer className={`shrink-0 bg-black/40 border-t border-white/10 px-6 py-2 flex items-center justify-center relative z-10 overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-wuxia-gold/5 to-transparent"></div>
                    <p className="text-[9px] font-serif italic text-white/20 tracking-[0.5em] uppercase flex items-center gap-4 relative z-10">
                        <Sparkles className="w-3 h-3 text-wuxia-gold/30" />
                        Giang Hồ Trân Bảo • Tích Thế Cơ Duyên
                        <Sparkles className="w-3 h-3 text-wuxia-gold/30" />
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default InventoryModal;
