import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CharacterData, NpcStructure, VisualSettings } from '../../types';
import IconGlyph from '../ui/Icon/IconGlyph';
import { useTranslation } from 'react-i18next';
import { RadarChart, RadarData } from '../shared/RadarChart';
import { StatBar } from '../shared/StatBar';
import { ImageService } from '../../services/imageService';
import { TextGenService } from '../../services/textGenService';
import { Sparkles } from 'lucide-react';
import { OrnateBorder } from '../ui/decorations/OrnateBorder';

interface Props {
    Role: CharacterData;
    Social?: NpcStructure[];
    onOpenCharacter?: () => void;
    visualConfig: VisualSettings;
    onUpdateCharacter: (data: CharacterData) => void;
    isGenerating?: boolean;
    generatingNames?: Set<string>;
    allAvatars?: Record<string, string>;
    onOpenSocial?: (id: string) => void;
    selectedNpcId?: string;
}


// Utility for specific avatars
const getDynamicAvatar = (role: CharacterData, allAvatars?: Record<string, string>) => {
    // 1. Check central mapping by ID
    if (allAvatars && allAvatars[role.id]) {
        return allAvatars[role.id];
    }
    
    // 2. Check central mapping by Name
    if (allAvatars && allAvatars[role.name]) {
        return allAvatars[role.name];
    }

    // 3. Fallback to existing logic if not in map (though it should be)
    if (role.avatar && !role.avatar.includes('default')) {
        if (role.avatar.startsWith('data:image/')) return role.avatar;
        let url = role.avatar.startsWith('/') ? role.avatar : `/images/${role.avatar}`;
        if (!url.match(/\.(png|jpe?g|webp|gif)$/i)) {
            url += '.png';
        }
        return url;
    }
    
    // No longer returning static default assets.
    // Return null to trigger Icon fallback or AI generation.
    return null;
};

const STAT_COLORS: Record<string, string> = {
    strength: '#ef4444',      // Red
    agility: '#22c55e',       // Green
    constitution: '#eab308',  // Yellow/Gold
    rootBone: '#3b82f6',      // Blue
    intelligence: '#a855f7',  // Purple
    luck: '#f97316',          // Orange
    tamTinh: '#06b6d4',       // Cyan
};

const STAT_LABELS: Record<string, string> = {
    strength: 'Sức mạnh',
    agility: 'Thân pháp',
    constitution: 'Thể chất',
    rootBone: 'Căn cốt',
    intelligence: 'Ngộ tính',
    luck: 'Phúc duyên',
    tamTinh: 'Tâm tính',
};

// Custom very thin bar for Vitals to match the mockup
const PremiumBar: React.FC<{ label: string; current: number; max: number; colorClass: string; icon?: any }> = ({ label, current, max, colorClass, icon }) => {
    const pct = Math.min((current / (max || 1)) * 100, 100);

    return (
        <div className="mb-3 group relative">
            <div className="flex justify-between items-end mb-1 px-1">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-[10px] text-paper-white/40">
                        {typeof icon === 'string' ? icon : <IconGlyph name={icon.name} className="h-3 w-3" />}
                    </span>}
                    <span className="tracking-[0.2em] font-serif text-[9px] text-paper-white/60 font-black uppercase">{label}</span>
                </div>
                <span className="font-mono text-[8px] text-paper-white/40 font-black">
                    {Math.round(current)}<span className="opacity-20 mx-0.5">/</span>{max}
                </span>
            </div>
            {/* Very thin progress bar */}
            <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
                    style={{ width: `${pct}%` }}
                ></div>
            </div>
        </div>
    );
};

// Mini Body Part with Liquid Glass look
const MiniBodyPart: React.FC<{ name: string; current: number; max: number; status?: string }> = ({ name, current, max, status }) => {
    const pct = (current / (max || 1)) * 100;
    const s = status?.trim().toLowerCase();
    const isHealthy = !s || s === 'khỏe mạnh' || s === 'bình thường' || s === 'ổn định' || s === 'tốt' || s === 'khỏe' || s === 'bình thường';
    const isInjured = pct < 99.5 || !isHealthy;
    const isCritical = pct < 30;
    
    return (
        <div className="flex items-center gap-4 w-full group transition-all py-[2px]">
            <span className={`font-serif text-[9px] w-12 shrink-0 uppercase tracking-widest font-black ${isCritical ? 'text-wuxia-red animate-pulse' : 'text-wuxia-red/80'}`}>
                {name}
            </span>
            <div className="flex-1 h-[3px] bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                    className={`h-full transition-all duration-1000 ${isCritical ? 'bg-wuxia-red shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-wuxia-red'}`}
                    style={{ width: `${pct}%` }}
                ></div>
            </div>
            {/* Conditional icon: X for injury, dot for healthy */}
            <div className="w-3 h-3 flex items-center justify-center">
                {isInjured ? (
                    <svg className={`w-2.5 h-2.5 ${isCritical ? 'text-wuxia-red' : 'text-wuxia-red/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="w-1 h-1 rounded-full bg-wuxia-gold/40 shadow-[0_0_4px_rgba(230,200,110,0.4)]" />
                )}
            </div>
        </div>
    );
};


// NPC Slot Miniature
const NpcSlot: React.FC<{ npc: NpcStructure; visualConfig: VisualSettings; isGenerating?: boolean; allAvatars?: Record<string, string>; onClick: (id: string) => void; isSelected: boolean }> = ({ npc, visualConfig, isGenerating, allAvatars, onClick, isSelected }) => {
    const { t } = useTranslation();
    
    const tValue = (val?: string) => {
        if (!val) return t('social.labels.unknown');
        const translated = t(`social.values.${val}`);
        return translated === `social.values.${val}` ? val : translated;
    };
    const isNSFW = npc.socialNetworkVariables?.some(v => v.tags?.includes('NSFW')) || false;
    const [showTooltip, setShowTooltip] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const slotRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (slotRef.current) {
            const rect = slotRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top,
                left: rect.left + rect.width + 12 // Position to the right of the slot
            });
            setShowTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const displayAvatar = (allAvatars && (allAvatars[npc.id] || allAvatars[npc.name])) || npc.avatar;
    const isGeneratingNow = isGenerating;

    return (
        <div 
            ref={slotRef}
            className="relative group cursor-pointer w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => onClick(npc.id)}
        >
            <div className={`w-full aspect-square max-w-[48px] mx-auto rounded-2xl border border-white/10 overflow-hidden bg-black/40 backdrop-blur-md transition-all duration-500 group-hover:border-wuxia-gold/60 group-hover:scale-110 shadow-xl relative ${isNSFW ? 'ring-1 ring-wuxia-red/20' : ''} ${isSelected ? 'border-wuxia-gold ring-2 ring-wuxia-gold/50' : ''}`}>
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-black/30 ${isNSFW ? 'blur-[2px] hover:blur-none transition-all duration-700' : ''}`}>
                    {!displayAvatar && !isGeneratingNow ? (
                        <div className="flex flex-col items-center justify-center text-wuxia-gold/40">
                            <IconGlyph name="user" className="w-8 h-8 opacity-20" />
                            <span className="text-[10px] font-serif font-black mt-1">
                                {npc.name.charAt(0)}
                            </span>
                        </div>
                    ) : displayAvatar ? (
                        <img src={displayAvatar} className="w-full h-full object-cover" alt={npc.name} />
                    ) : null}
                    {isGeneratingNow && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-4 h-4 border border-wuxia-gold/30 border-t-wuxia-gold rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                
                {/* NPC Name Tag Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-black/80 py-0.5 px-0.5 border-t border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="text-[6px] text-paper-white/60 truncate text-center uppercase font-black tracking-tighter">
                        {npc.name}
                    </div>
                </div>

                {/* Status Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
                
                {/* NSFW warning marker */}
                {isNSFW && (
                    <div className="absolute top-0.5 right-0.5 bg-wuxia-red/80 px-0.5 rounded text-[5px] text-white font-black uppercase animate-pulse">
                        NSFW
                    </div>
                )}
            </div>
            
            {/* Presence indicator with gold glow */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0a0a] bg-wuxia-gold shadow-[0_0_10px_rgba(230,200,110,0.8)] z-10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full rotate-45"></div>
            </div>
            
            {/* Premium Tooltip - Rendered via Portal for absolute visibility */}
            {showTooltip && createPortal(
                <div 
                    className="fixed z-[9999] transition-all duration-300 pointer-events-none"
                    style={{ 
                        top: `${coords.top}px`, 
                        left: `${coords.left}px`,
                    }}
                >
                    <div className="bg-[#0a0a0a]/95 border border-wuxia-gold/20 p-5 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] min-w-[240px] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 ring-1 ring-white/5">
                        {/* Shimmer line */}
                        <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-wuxia-gold/30 to-transparent" />
                        
                        <div className="text-wuxia-gold font-serif font-black text-sm border-b border-wuxia-gold/10 pb-3 mb-4 tracking-[0.2em] uppercase text-center drop-shadow-sm">
                            {npc.name}
                        </div>
                        
                        <div className="space-y-4">
                            {/* Identity and Realm */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-paper-white/40 uppercase tracking-widest">{t('social.labels.identity')}</span>
                                    <span className="text-paper-white font-serif italic text-right">{tValue(npc.identity)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-paper-white/40 uppercase tracking-widest">{t('social.labels.realm')}</span>
                                    <span className="text-wuxia-red font-black tracking-widest uppercase text-right">{tValue(npc.realm)}</span>
                                </div>
                            </div>

                            {/* Relationship and Favorability */}
                            <div className="border-t border-white/5 pt-3">
                                <div className="flex justify-between items-end mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-paper-white/30 uppercase font-black tracking-widest mb-1">{t('social.labels.relationStatus')}</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-wuxia-gold animate-pulse"></div>
                                            <span className="text-[10px] font-serif font-black text-wuxia-gold tracking-[0.15em] uppercase">{tValue(npc.relationStatus)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] text-paper-white/30 uppercase font-black tracking-widest mb-1">{t('social.labels.favorability')}</span>
                                        <span className="text-xl font-black text-wuxia-red font-mono leading-none">{npc.favorability}</span>
                                    </div>
                                </div>
                                <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-wuxia-red/80 shadow-[0_0_8px_rgba(180,50,50,0.4)] transition-all duration-1000" 
                                        style={{ width: `${Math.min(npc.favorability || 0, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative corners */}
                        <div className="absolute top-2 left-2 w-1 h-1 border-t border-l border-wuxia-gold/20" />
                        <div className="absolute top-2 right-2 w-1 h-1 border-t border-r border-wuxia-gold/20" />
                        <div className="absolute bottom-2 left-2 w-1 h-1 border-b border-l border-wuxia-gold/20" />
                        <div className="absolute bottom-2 right-2 w-1 h-1 border-b border-r border-wuxia-gold/20" />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

const LeftPanel: React.FC<Props> = ({ Role, Social = [], onOpenCharacter, visualConfig, onUpdateCharacter, isProfile = false, isGenerating = false, generatingNames, allAvatars, onOpenSocial, selectedNpcId }) => {


    const radarData = useMemo(() => {
        const stats = {
            strength: Role.strength,
            agility: Role.agility,
            constitution: Role.constitution,
            rootBone: Role.rootBone,
            intelligence: Role.intelligence,
            luck: Role.luck,
            tamTinh: Role.tamTinh || 5
        };
        return Object.entries(stats).map(([key, val]) => ({
            label: STAT_LABELS[key] || key,
            value: val,
            color: STAT_COLORS[key] || '#e6c86e'
        })) as RadarData[];
    }, [Role]);


    const Money = Role.money || { gold: 0, silver: 0, copper: 0 };
    const presentNpcs = Social.filter(n => n.isPresent);
    const [localAvatar, setLocalAvatar] = useState<string | null>(() => {
        try {
            return localStorage.getItem('customAvatar') || null;
        } catch { return null; }
    });
    const avatarUrl = useMemo(() => localAvatar || getDynamicAvatar(Role, allAvatars), [Role, localAvatar, allAvatars]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

    const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        if (file.size > MAX_AVATAR_SIZE) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            try {
                localStorage.setItem('customAvatar', dataUrl);
                setLocalAvatar(dataUrl);
            } catch { /* storage full */ }
        };
        reader.readAsDataURL(file);
    }, []);







    const bodyParts = [
        { name: 'Đầu', current: Role.headCurrentHp, max: Role.headMaxHp, status: Role.headStatus },
        { name: 'Ngực', current: Role.chestCurrentHp, max: Role.chestMaxHp, status: Role.chestStatus },
        { name: 'Bụng', current: Role.abdomenCurrentHp, max: Role.abdomenMaxHp, status: Role.abdomenStatus },
        { name: 'T.Tay', current: Role.leftArmCurrentHp, max: Role.leftArmMaxHp, status: Role.leftArmStatus },
        { name: 'P.Tay', current: Role.rightArmCurrentHp, max: Role.rightArmMaxHp, status: Role.rightArmStatus },
        { name: 'T.Chân', current: Role.leftLegCurrentHp, max: Role.leftLegMaxHp, status: Role.leftLegStatus },
        { name: 'P.Chân', current: Role.rightLegCurrentHp, max: Role.rightLegMaxHp, status: Role.rightLegStatus },
    ];

    const equipmentOrder = [
        { key: 'head', label: 'Đầu', icon: 'robe' },
        { key: 'chest', label: 'Thân', icon: 'robe' },
        { key: 'back', label: 'Lưng', icon: 'back' },
        { key: 'waist', label: 'Eo', icon: 'waist' },
        { key: 'legs', label: 'Chân', icon: 'legs' },
        { key: 'feet', label: 'Hài', icon: 'feet' },
        { key: 'mainWeapon', label: 'Chính', icon: 'sword' },
        { key: 'subWeapon', label: 'Phụ', icon: 'dagger' },
    ];

    const getEquipName = (key: string) => {
        const idOrName = (Role.equipment as any)[key];
        if (!idOrName || idOrName === 'None') return 'Chưa trang bị';
        const item = Role.itemList.find(i => i.ID === idOrName || i.Name === idOrName);
        return item ? item.Name : idOrName;
    };


    const innerContent = (
        <>
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-ink-wash opacity-10 pointer-events-none mix-blend-overlay"></div>
            
            {/* ── Identity Section ── */}
            <div className="mb-10 shrink-0 group relative mt-6">
                <div className="flex flex-col items-center gap-5">
                    {/* Name & Title Top side */}
                    <div className="w-full flex flex-col items-center text-center px-2">
                        <h2 className="text-2xl font-black font-serif text-paper-white tracking-widest truncate drop-shadow-md leading-tight max-w-full">
                            {Role.name}
                        </h2>
                        <span className="text-[9px] text-wuxia-gold font-serif italic tracking-[0.15em] uppercase opacity-70 block mt-2 truncate max-w-full">
                            {Role.title || (typeof Role.background === 'object' ? Role.background.name : Role.background) || 'Giang hồ tản nhân'}
                        </span>
                        {/* Realm Indicator Pill — only in profile */}
                        {isProfile && (
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-wuxia-red/30 rounded-full bg-wuxia-red/5 mt-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-wuxia-red"></div>
                                <span className="text-[8px] text-paper-white/70 uppercase tracking-[0.2em]">{Role.realm}</span>
                            </div>
                        )}
                    </div>

                    {/* Avatar box from mockup */}
                    <div className="relative w-28 h-28 shrink-0">
                        <div 
                            onClick={onOpenCharacter}
                            className="relative w-full h-full cursor-pointer overflow-hidden rounded-[2rem] border border-wuxia-gold/30 group-hover:border-wuxia-gold/60 transition-all bg-transparent"
                        >
                        <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative flex items-center justify-center bg-ink-wash/30">
                            {isGenerating && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm overflow-hidden">
                                    {/* Ink-wash animation circles */}
                                    <div className="absolute inset-0 opacity-30">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-wuxia-gold/20 rounded-full animate-ping duration-[3s]"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 border border-wuxia-gold/10 rounded-full animate-ping duration-[2s]"></div>
                                    </div>
                                    
                                    {/* Center ink drop icon */}
                                    <div className="relative">
                                        <div className="w-12 h-12 border border-wuxia-gold/40 border-t-wuxia-gold rounded-full animate-spin"></div>
                                        <IconGlyph name="sparkle" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-wuxia-gold h-4 w-4 animate-pulse" />
                                    </div>
                                    
                                    <span className="mt-3 text-[10px] font-serif font-black text-wuxia-gold tracking-widest uppercase animate-pulse drop-shadow-[0_0_8px_rgba(230,200,110,0.4)]">
                                        Đang họa hình...
                                    </span>
                                </div>
                            )}
                            
                            {avatarUrl ? (
                                <img 
                                    src={avatarUrl} 
                                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out`} 
                                    alt={Role.name} 
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full relative">
                                    {!isGenerating && (
                                        <div className="flex flex-col items-center justify-center animate-fade-in">
                                            <div className="w-16 h-16 rounded-full border border-wuxia-gold/20 flex items-center justify-center bg-wuxia-gold/5 backdrop-blur-sm shadow-[0_0_15px_rgba(230,200,110,0.1)]">
                                                <span className="text-3xl font-serif font-black text-wuxia-gold leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                                    {Role.name ? Role.name.charAt(0) : '?'}
                                                </span>
                                            </div>
                                            <span className="text-[7px] text-wuxia-gold/40 font-serif uppercase tracking-[0.3em] mt-2 font-black">Chưa rõ diện mạo</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                        </div>
                        </div>
                        {/* Avatar Upload Button (bottom right on the line) */}
                        <div className="absolute -bottom-2 -right-2 flex flex-col gap-1 rounded-full border border-wuxia-gold/40 bg-ink-black p-[2px]">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                className="w-6 h-6 rounded-full bg-transparent flex items-center justify-center text-wuxia-gold/60 hover:text-wuxia-gold transition-colors z-10"
                                title="Tải ảnh lên"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </button>
                        </div>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                        />
                    </div>
                </div>
            </div>

            {/* ── Scrollable Details ── */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar relative">



                {isProfile && (
                    <>
                        {/* ── Personality (Tính cách) ── */}
                        <div className="px-5 py-3 bg-transparent border border-white/[0.05] rounded-xl relative overflow-hidden mb-6">
                            <h3 className="text-[9px] text-wuxia-gold uppercase tracking-[0.3em] font-black mb-3 flex items-center gap-2">
                                <span className="opacity-40 text-wuxia-gold font-mono">#</span> Tính cách
                            </h3>
                            <p className="text-[10px] leading-relaxed text-paper-white/70 font-serif italic min-h-[1.5em]">
                                {typeof Role.personality === 'object' ? (Role.personality as any).text || (Role.personality as any).name : (Role.personality || (
                                    <span className="text-paper-white/20 italic">Chưa có mô tả tính cách...</span>
                                ))}
                            </p>
                        </div>

                        {/* ── Core Stats (Thuộc tính) ── */}
                        <div className="px-5 py-4 bg-black/20 border border-white/[0.05] rounded-xl group/core shadow-inner">
                            <h3 className="text-[9px] text-wuxia-gold uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2">
                                <span className="opacity-40 text-wuxia-gold font-mono">#</span> Thuộc tính
                            </h3>
                            
                            <div className="flex flex-col items-center mb-6 py-4 bg-black/40 rounded-xl border border-wuxia-gold/5 shadow-inner">
                                <RadarChart data={radarData} size={220} maxValue={30} />
                            </div>

                            <div className="space-y-4">
                                {[
                                    { key: 'strength', label: 'Sức mạnh', current: Role.strength, base: Role.baseStats?.strength },
                                    { key: 'agility', label: 'Thân pháp', current: Role.agility, base: Role.baseStats?.agility },
                                    { key: 'constitution', label: 'Thể chất', current: Role.constitution, base: Role.baseStats?.constitution },
                                    { key: 'rootBone', label: 'Căn cốt', current: Role.rootBone, base: Role.baseStats?.rootBone },
                                    { key: 'intelligence', label: 'Ngộ tính', current: Role.intelligence, base: Role.baseStats?.intelligence },
                                    { key: 'luck', label: 'Phúc duyên', current: Role.luck, base: Role.baseStats?.luck },
                                    { key: 'tamTinh', label: 'Tâm tính', current: Role.tamTinh || 5, base: Role.baseStats?.tamTinh },
                                ].map(stat => (
                                    <div key={stat.key} className="space-y-1.5 group/stat">
                                        <div className="flex justify-between items-end px-1">
                                            <span className="text-paper-white/40 text-[9px] font-serif uppercase tracking-widest group-hover/stat:text-wuxia-gold/60 transition-colors">{stat.label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-paper-white font-mono font-black text-xs leading-none">{stat.current}</span>
                                                <span className="text-[8px] text-paper-white/20 font-mono italic">({stat.base ?? stat.current})</span>
                                            </div>
                                        </div>
                                        <StatBar 
                                            value={stat.current} 
                                            maxValue={30} 
                                            color={STAT_COLORS[stat.key] || '#e6c86e'} 
                                            label=""
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>



                        {/* ── Quick Stats Grid (Phụ trọng & Nghiệp lực) ── */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col p-4 bg-transparent border border-white/[0.05] rounded-xl group hover:border-wuxia-gold/20 transition-all shadow-none">
                                <span className="text-[8px] text-paper-white/40 uppercase tracking-[0.3em] font-black mb-2">Phụ Trọng</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-xl font-mono text-wuxia-gold font-black tracking-tighter leading-none">
                                        {Role.currentWeight?.toFixed(1) || 0}
                                    </span>
                                    <span className="text-[8px] text-paper-white/30 font-black mb-0.5">/ {Role.maxWeight || 0}</span>
                                </div>
                                <div className="mt-3 h-[2px] w-full bg-black/80 rounded-full overflow-hidden">
                                    <div className="h-full bg-wuxia-gold/40 rounded-full" style={{ width: `${Math.min(((Role.currentWeight || 0)/(Role.maxWeight || 1))*100, 100)}%` }}></div>
                                </div>
                            </div>
                            <div className="flex flex-col p-4 bg-transparent border border-white/[0.05] rounded-xl group hover:border-wuxia-gold/20 transition-all shadow-none">
                                <span className="text-[8px] text-paper-white/40 uppercase tracking-[0.3em] font-black mb-2">Nghiệp Lực</span>
                                <div className="flex items-end justify-between">
                                    <span className={`text-xl font-mono ${Role.karma >= 0 ? 'text-wuxia-gold' : 'text-wuxia-red'} font-black tracking-tighter leading-none`}>
                                        {Role.karma || 0}
                                    </span>
                                    <span className="text-[8px] text-paper-white/30 font-black mb-0.5">Tiền Định</span>
                                </div>
                                <div className="mt-3 h-[2px] w-full bg-black/80 rounded-full overflow-hidden">
                                    <div className={`h-full ${Role.karma >= 0 ? 'bg-wuxia-gold/20' : 'bg-wuxia-red/20'} rounded-full`} style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* ── Main Vitals ── */}
                        <div className="space-y-1.5 px-1">
                            <PremiumBar label="Tinh lực" current={Role.currentEnergy} max={Role.maxEnergy} colorClass="bg-paper-white/40" icon={{name: 'bolt'}} />
                            <PremiumBar label="No bụng" current={Role.currentFullness} max={Role.maxFullness} colorClass="bg-paper-white/40" icon={{name: 'food'}} />
                            <PremiumBar label="Khát nước" current={Role.currentThirst} max={Role.maxThirst} colorClass="bg-paper-white/40" icon={{name: 'drop'}} />
                            {Role.currentExp !== undefined && (
                                <PremiumBar label="Kinh nghiệm" current={Role.currentExp} max={Role.levelUpExp} colorClass="bg-paper-white/40" icon={{name: 'sparkle'}} />
                            )}
                        </div>
                    </>
                )}



                
                {isProfile && (
                    <div className="px-5 py-4 bg-transparent border border-white/[0.05] rounded-xl relative group/status">
                        <h3 className="text-[9px] text-wuxia-gold uppercase tracking-[0.3em] font-black mb-3 flex items-center gap-2">
                            <span className="opacity-40 text-wuxia-gold font-mono">#</span> Trạng thái kinh mạch
                        </h3>
                        <div className="space-y-1">
                            {bodyParts.map(part => (
                                <MiniBodyPart key={part.name} name={part.name} current={part.current} max={part.max} status={part.status} />
                            ))}
                        </div>
                    </div>
                )}
                


                {/* ── Nội viện (Tòng hành) ── */}
                {!isProfile && (
                    <div className="mt-6 border-t border-white/5 pt-4">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-wuxia-gold/40 uppercase tracking-[0.2em]">Nội viện tòng hành</span>
                                <span className="text-[10px] text-white/20 font-bold">[{presentNpcs.length}]</span>
                            </div>
                            
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 px-1">
                            {presentNpcs.slice(0, 4).map((npc) => (
                                <NpcSlot 
                                    key={npc.id} 
                                    npc={npc} 
                                    visualConfig={visualConfig} 
                                    isGenerating={generatingNames?.has(npc.name)}
                                    allAvatars={allAvatars} 
                                    onClick={(id) => onOpenSocial?.(id)}
                                    isSelected={selectedNpcId === npc.id}
                                />
                            ))}
                            {/* Fill remaining slots if < 4 */}
                            {Array.from({ length: Math.max(0, 4 - presentNpcs.length) }).map((_, idx) => (
                                <div key={`empty-${idx}`} className="aspect-square bg-black/40 border border-white/5 relative flex items-center justify-center opacity-30">
                                    <div className="w-full h-full flex items-center justify-center text-white/10 uppercase font-black text-[8px]">Trống</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Wealth Redesign */}
                <div className="px-5 py-4 bg-transparent border border-wuxia-gold/20 rounded-xl relative group/wealth">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-wuxia-gold/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-wuxia-gold/10 transition-all duration-1000"></div>
                    <h3 className="text-[9px] text-wuxia-gold uppercase tracking-[0.3em] mb-4 font-black flex items-center gap-2">
                        <IconGlyph name="sparkle" className="h-3 w-3 opacity-40" /> Ngân lượng tàng trữ
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center gap-2 group/coin">
                            <div className="w-7 h-7 rounded-full bg-transparent flex items-center justify-center border border-wuxia-gold/40">
                                <IconGlyph name="grid" className="h-3 w-3 text-wuxia-gold/60" />
                            </div>
                            <span className="text-[8px] text-wuxia-gold font-black uppercase tracking-widest opacity-80 mt-1">Vàng</span>
                            <span className="text-sm font-mono text-paper-white font-black">{Money.gold}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group/coin">
                            <div className="w-7 h-7 rounded-full bg-transparent flex items-center justify-center border border-gray-400/40">
                                <IconGlyph name="grid" className="h-3 w-3 text-gray-400/60" />
                            </div>
                            <span className="text-[8px] text-wuxia-red font-black uppercase tracking-widest opacity-80 mt-1">Bạc</span>
                            <span className="text-sm font-mono text-paper-white font-black">{Money.silver}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group/coin">
                            <div className="w-7 h-7 rounded-full bg-transparent flex items-center justify-center border border-amber-700/40">
                                <IconGlyph name="grid" className="h-3 w-3 text-amber-700/60" />
                            </div>
                            <span className="text-[8px] text-wuxia-red font-black uppercase tracking-widest opacity-80 mt-1">Đồng</span>
                            <span className="text-sm font-mono text-paper-white font-black">{Money.copper}</span>
                        </div>
                    </div>
                </div>

                {isProfile && (
                    <div className="px-5 py-4 bg-transparent border border-white/[0.05] rounded-xl group/equip">
                        <h3 className="text-[9px] text-paper-white/50 uppercase tracking-[0.3em] font-black mb-4 border-b border-white/5 pb-2">Vật ngoại thân</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {equipmentOrder.map(item => {
                                const name = getEquipName(item.key);
                                const isEmpty = name === 'Chưa trang bị';
                                return (
                                    <div key={item.key} className="flex flex-col group/item gap-0.5">
                                        <div className="flex items-center gap-1.5 opacity-60">
                                            <IconGlyph name={item.icon as any} className="h-2.5 w-2.5" />
                                            <span className="text-[8px] text-paper-white uppercase font-black tracking-widest">{item.label}</span>
                                        </div>
                                        <span className={`text-[9px] font-serif tracking-wide truncate ${isEmpty ? 'text-paper-white/30 italic' : 'text-paper-white/80'}`}>
                                            {name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Ink Wash Vignette Ornament */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-ink-wash opacity-20 blur-3xl pointer-events-none rounded-full select-none"></div>
        </>
    );

    if (isProfile) {
        return (
            <div className="h-full flex flex-col p-6 relative bg-transparent glass-panel">
                {innerContent}
            </div>
        );
    }

    return (
        <OrnateBorder className="h-full bg-ink-black/95 !rounded-none !p-0">
            <div className="h-full flex flex-col p-6 relative bg-transparent">
                {innerContent}
            </div>
        </OrnateBorder>
    );
};

export default LeftPanel;

