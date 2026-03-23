import React, { useState } from 'react';
import { NpcStructure } from '../../../models/social';
import IconGlyph from '../../ui/Icon/IconGlyph';

interface Props {
    socialList: NpcStructure[];
    onClose: () => void;
    playerName?: string;
    onToggleMajorRole?: (npcId: string, nextIsMajor: boolean) => void;
    allAvatars: Record<string, string>;
}

const SocialModal: React.FC<Props> = ({ socialList, onClose, playerName = "Sơ nhập giang hồ", onToggleMajorRole, allAvatars }) => {
    const [selectedId, setSelectedId] = useState<string | null>(
        socialList.length > 0 ? socialList[0].id : null
    );

    const currentNPC = socialList.find(n => n.id === selectedId);
    const showFemaleExtensions = currentNPC?.gender === 'Female' && Boolean(currentNPC?.isMainCharacter);

    const resolveAvatar = (npc: NpcStructure) => {
        if (!allAvatars) return npc.avatar;
        return allAvatars[npc.id] || allAvatars[npc.name] || npc.avatar;
    };

    const getFirstNonEmptyText = (...values: unknown[]): string => {
        for (const value of values) {
            if (typeof value === 'string' && value.trim().length > 0) return value.trim();
        }
        return '';
    };

    const readAppearance = (npc: NpcStructure): string => getFirstNonEmptyText(
        (npc as any)['Appearance description'],
        (npc as any)['Appearance'],
        (npc as any).Archive?.['Appearance points'],
        (npc as any).Archive?.['Appearance description']
    );

    const readBuildBody = (npc: NpcStructure): string => getFirstNonEmptyText(
        (npc as any)['Body description'],
        (npc as any)['Stature'],
        (npc as any).Archive?.['Body points'],
        (npc as any).Archive?.['Body description']
    );

    const readClothing = (npc: NpcStructure): string => getFirstNonEmptyText(
        (npc as any)['Clothing style'],
        (npc as any)['Clothing'],
        (npc as any).Archive?.['Clothing style'],
        (npc as any).Archive?.['Clothing points']
    );

    const readRelationshipNetwork = (npc: NpcStructure): Array<{ targetName: string; relation: string; note?: string }> => {
        if (!Array.isArray(npc?.socialNetworkVariables)) return [];
        return npc.socialNetworkVariables
            .map((item: any) => ({
                targetName: typeof item?.targetName === 'string' ? item.targetName.trim() : '',
                relation: typeof item?.relation === 'string' ? item.relation.trim() : '',
                note: typeof item?.note === 'string' ? item.note.trim() : undefined
            }))
            .filter(item => item.targetName && item.relation);
    };

    const currentRelationshipNetwork = currentNPC ? readRelationshipNetwork(currentNPC) : [];

    const toggleImportantCharacterState = (npc: NpcStructure) => {
        if (!onToggleMajorRole) return;
        onToggleMajorRole(npc.id, !Boolean(npc.isMainCharacter));
    };

    const PrivateTag: React.FC<{ label: string; value?: string; color?: string }> = ({ label, value, color = "text-pink-300" }) => (
        <div className="flex flex-col bg-black/40 border border-white/5 p-3 rounded-none relative group backdrop-blur-md">
            <span className="text-[8px] text-paper-white/30 uppercase tracking-[0.2em] mb-1 font-bold">{label}</span>
            <span className={`font-serif text-[13px] font-black ${color} drop-shadow-[0_0_8px_rgba(244,114,182,0.3)]`}>{value || "???"}</span>
        </div>
    );

    const RelationTag: React.FC<{ label: string; value?: string; accent?: string }> = ({ label, value, accent = "text-wuxia-cyan" }) => (
        <div className="bg-black/60 border border-white/5 rounded-none p-4 h-full shadow-inner group">
            <div className="text-[9px] text-paper-white/40 uppercase tracking-[0.2em] mb-2 font-bold">{label}</div>
            <div className={`text-sm font-serif leading-relaxed font-bold ${accent}`}>{value?.trim() || "Không có ghi chép"}</div>
        </div>
    );

    const SexStat: React.FC<{ label: string; count?: number }> = ({ label, count }) => (
        <div className="flex justify-between items-center border-b border-white/5 py-2 last:border-0 group">
            <span className="text-xs text-paper-white/50">{label}</span>
            <span className="font-mono text-pink-400 font-black tracking-tighter text-sm bg-pink-500/10 px-2 py-0.5 rounded-none shadow-glow-gold/10 ">{count || 0}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[200] flex items-center justify-center p-4">
            <div className="w-full max-w-7xl h-[90vh] flex flex-col relative overflow-hidden rounded-none glass-panel border border-white/10 shadow-[0_0_150px_rgba(0,0,0,1)]">
                {/* Wuxia Decorative Corners */}
                <div className="wuxia-corner wuxia-corner-tl"></div>
                <div className="wuxia-corner wuxia-corner-tr"></div>
                <div className="wuxia-corner wuxia-corner-bl"></div>
                <div className="wuxia-corner wuxia-corner-br"></div>
                
                {/* Background Ink Wash Texture */}
                <div className="absolute inset-0 bg-ink-wash opacity-10 mix-blend-overlay pointer-events-none"></div>

                {/* --- HEADER --- */}
                <div className="h-20 shrink-0 border-b border-wuxia-gold/10 bg-black/60 flex items-center justify-between px-10 relative z-50">
                    <div className="flex flex-col">
                        <h3 className="text-wuxia-gold font-serif font-black text-2xl tracking-[0.5em] drop-shadow-2xl">
                            DANH HIỆP PHẢ
                        </h3>
                        <span className="text-[9px] text-paper-white/30 uppercase tracking-[0.6em] font-bold mt-1">Giang Hồ Nhân Mạch</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col items-end border-r border-white/5 pr-6">
                            <span className="text-[8px] text-paper-white/20 uppercase tracking-widest font-bold">Người xem</span>
                            <span className="text-xs text-wuxia-gold font-serif italic">{playerName}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-none bg-wuxia-red/10 border border-wuxia-red/20 text-wuxia-red shadow-xl"
                        >
                            <IconGlyph name="close" className="w-6 h-6" strokeWidth={3} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT: NPC List */}
                    <div className="w-1/4 border-r border-wuxia-gold/10 flex flex-col bg-black/40 overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-black/20">
                            <span className="text-[10px] uppercase tracking-widest text-paper-white/30 font-bold">Mối Quan Hệ ({socialList.length})</span>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
                            {socialList.map(npc => {
                                const isSelected = selectedId === npc.id;
                                return (
                                    <button
                                        key={npc.id}
                                        onClick={() => setSelectedId(npc.id)}
                                        className={`w-full group relative p-4 rounded-none border overflow-hidden flex items-center gap-4 ${isSelected
                                                ? 'border-wuxia-gold/40 bg-wuxia-gold/10'
                                                : 'border-white/5 bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-none flex items-center justify-center font-serif font-black text-xl border overflow-hidden relative ${npc.gender === 'Female' ? 'border-pink-500/30 bg-pink-500/10 text-pink-400' : 'border-wuxia-cyan/30 bg-wuxia-cyan/10 text-wuxia-cyan'} ${isSelected ? 'shadow-lg' : ''}`}>
                                            {resolveAvatar(npc) ? (
                                                <img src={resolveAvatar(npc)} alt={npc.name} className="w-full h-full object-cover object-top" />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full bg-black/20 backdrop-blur-sm">
                                                    <span className="text-xl font-serif font-black opacity-80 drop-shadow-md">
                                                        {npc.name ? npc.name.charAt(0) : '?'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className={`font-serif font-bold text-sm tracking-wide truncate ${isSelected ? 'text-wuxia-gold' : 'text-paper-white/80'}`}>
                                                {npc.name}
                                            </div>
                                            <div className="text-[9px] text-paper-white/30 flex items-center gap-2 mt-1 truncate">
                                                <span className="font-bold">{npc.identity}</span>
                                                <span className="opacity-20">|</span>
                                                <span className={npc.isPresent ? 'text-green-500 font-black' : ''}>{npc.isPresent ? 'Hiện diện' : 'Vắng mặt'}</span>
                                            </div>
                                        </div>
                                         <div className="flex flex-col items-end">
                                             <span className="text-[10px] font-black text-wuxia-red drop-shadow-sm flex items-center gap-0.5">
                                                 <IconGlyph name="heart" className="w-2.5 h-2.5" /> {npc.favorability}
                                             </span>
                                            {npc.isMainCharacter && (
                                                <div className="mt-1 w-1.5 h-1.5 rounded-none bg-wuxia-gold"></div>
                                            )}
                                        </div>
                                        
                                        {/* Liquid Edge */}
                                        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-wuxia-gold shadow-[0_0_10px_rgba(230,200,110,1)]"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: Detail Area */}
                    <div className="flex-1 flex flex-col relative bg-black/10 overflow-hidden">
                        {currentNPC ? (
                            <div className="flex-1 overflow-y-auto no-scrollbar p-10">
                                        {/* NPC image banner at 16:9 aspect ratio */}
                                        {resolveAvatar(currentNPC) && (
                                            <div className="mb-8 rounded-none border border-wuxia-gold/20 overflow-hidden shadow-2xl relative group/img cursor-pointer aspect-video">
                                                <img 
                                                    src={resolveAvatar(currentNPC)} 
                                                    alt={currentNPC.name} 
                                                    className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                                <div className="absolute bottom-4 left-4">
                                                    <span className="text-[10px] text-wuxia-gold font-black uppercase tracking-[0.3em] bg-black/40 px-3 py-1 border border-wuxia-gold/20">Họa ảnh 4K</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* NPC BANNER DETAIL */}
                                        <div className={`relative mb-8 p-6 rounded-none border border-white/5 overflow-hidden group/banner ${currentNPC.gender === 'Female' ? 'glass-jade' : 'glass-ink'}`}>
                                    <div className="absolute inset-0 bg-ink-wash opacity-10 pointer-events-none"></div>
                                    <div className="absolute -right-6 -bottom-6 text-[140px] font-serif font-black text-white/5 select-none pointer-events-none">
                                        {currentNPC.name[0]}
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3">
                                                <h2 className="text-4xl font-black font-serif text-wuxia-gold tracking-tighter drop-shadow-sm truncate max-w-[calc(100%-120px)]">{currentNPC.name}</h2>
                                                {currentNPC.isMainCharacter && (
                                                    <span className="bg-wuxia-gold text-black text-[9px] font-black px-3 py-1 rounded-none uppercase tracking-widest shadow-lg shrink-0">Quan Trọng</span>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-3">
                                                <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-none text-paper-white/60 tracking-widest uppercase">{currentNPC.identity}</span>
                                                <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-none text-paper-white/60 tracking-widest uppercase">{currentNPC.realm}</span>
                                                <span className={`text-[10px] font-bold px-3 py-1 rounded-none border tracking-widest uppercase ${currentNPC.gender === 'Nữ' ? 'border-pink-500/30 text-pink-400 bg-pink-500/5' : 'border-wuxia-cyan/30 text-wuxia-cyan bg-wuxia-cyan/5'}`}>
                                                    {currentNPC.gender.toUpperCase()} • {currentNPC.age} TUỔI
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => toggleImportantCharacterState(currentNPC)}
                                                className="mt-4 group/toggle flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2 rounded-none cursor-pointer hover:bg-black/60 transition-colors"
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-paper-white/40 group-hover/toggle:text-paper-white/70">Theo Dõi Đặc Biệt</span>
                                                <div className={`w-10 h-5 rounded-none border relative ${currentNPC.isMainCharacter ? 'bg-wuxia-gold/20 border-wuxia-gold/50' : 'bg-gray-800 border-white/10'}`}>
                                                    <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-none transition-all duration-300 ${currentNPC.isMainCharacter ? 'left-[22px] bg-wuxia-gold shadow-[0_0_8px_rgba(230,200,110,1)]' : 'left-0.5 bg-gray-500'}`}></div>
                                                </div>
                                            </button>
                                        </div>

                                         <div className="bg-black/80 p-6 rounded-none border border-wuxia-red/20 flex flex-col items-center min-w-[140px] shadow-2xl backdrop-blur-md border-b-4 border-b-wuxia-red/40 drop-shadow-md">
                                             <div className="text-4xl font-serif font-black text-wuxia-red mb-1 drop-shadow-md tracking-tighter shadow-glow-red/20 flex items-center gap-2">
                                                 <IconGlyph name="heart" className="w-8 h-8" /> {currentNPC.favorability}
                                             </div>
                                            <div className="text-[8px] text-paper-white/40 tracking-[0.3em] font-black uppercase text-center">{currentNPC.relationStatus}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                    <div className={`lg:col-span-2 p-8 rounded-none border border-white/5 relative group/bio overflow-hidden ${currentNPC.gender === 'Female' ? 'bg-pink-900/10' : 'bg-black/40'}`}>
                                        {/* Decorative Ink Pattern */}
                                        <div className="absolute inset-0 bg-liquid-glass opacity-30 pointer-events-none"></div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-none bg-wuxia-gold/10 flex items-center justify-center border border-wuxia-gold/20">
                                                <IconGlyph name="book" className="w-4 h-4 text-wuxia-gold" />
                                            </div>
                                            <h4 className="text-wuxia-gold font-serif font-black uppercase tracking-widest text-sm">Hành Trình Ký Sự</h4>
                                        </div>
                                        <p className="text-paper-white/80 font-serif leading-relaxed text-lg italic indent-8">
                                            {currentNPC.description || "Cuốn sổ này vẫn chưa ghi lại nhiều về cuộc đời người này tại nhân gian."}
                                        </p>
                                        <div className="absolute top-4 right-6 opacity-0 group-hover/bio:opacity-100">
                                            <span className="text-[8px] text-paper-white/20 font-bold uppercase tracking-widest">Mặc hý truyền kỳ</span>
                                        </div>
                                    </div>

                                    {/* Quick Stats Grid */}
                                    <div className="space-y-4">
                                        <RelationTag label="Cốt Cách Tâm Tính" value={currentNPC.corePersonalityTraits} accent="text-wuxia-cyan" />
                                        <RelationTag label="Đột Phá Thiện Cảm" value={currentNPC.favorabilityBreakthroughCondition} accent="text-emerald-400" />
                                        <RelationTag label="Đột Phá Quan Hệ" value={currentNPC.relationBreakthroughCondition} accent="text-amber-400" />
                                    </div>
                                </div>

                                {/* RELATION NETWORK (Female Main Role Extension) */}
                                {showFemaleExtensions && (
                                    <div className="space-y-10">
                                        {/* Network Visual */}
                                        <div className="glass-ink p-8 rounded-none border border-pink-500/10 shadow-2xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent pointer-events-none"></div>
                                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                                                <h4 className="text-pink-300 font-serif font-black uppercase tracking-widest text-sm flex items-center gap-3">
                                                    <IconGlyph name="network" className="w-4 h-4" /> Mạng Lưới Quan Hệ
                                                </h4>
                                                <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Lục Phụ Liên Kết</span>
                                            </div>
                                            
                                            {currentRelationshipNetwork.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {currentRelationshipNetwork.map((edge, idx) => (
                                                        <div key={idx} className="bg-white/5 p-4 rounded-none border border-white/5 group/net">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-8 h-8 rounded-none bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-serif font-bold text-xs">{edge.targetName[0]}</div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-pink-100 text-sm font-serif font-bold tracking-wide">{edge.targetName}</span>
                                                                    <span className="text-[9px] text-pink-500/60 uppercase font-bold tracking-widest">{edge.relation}</span>
                                                                </div>
                                                            </div>
                                                            {edge.note && <p className="text-[11px] text-paper-white/50 italic leading-relaxed pl-11">"{edge.note}"</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-10 opacity-30 italic text-sm text-paper-white/40">Không rõ mối liên hệ xung quanh.</div>
                                            )}
                                        </div>

                                        {/* INTIMATE ALMANAC (NSFW/Privacy Section) */}
                                        <div className="border border-pink-500/30 bg-black/80 rounded-none overflow-hidden shadow-2xl p-10 relative">
                                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
                                            
                                            <div className="flex items-center justify-between mb-10">
                                                <div className="flex flex-col">
                                                     <h4 className="text-pink-400 font-serif font-black text-2xl tracking-[0.3em] flex items-center gap-4">
                                                         THUẦN ÂM KHUÊ PHÒNG
                                                         {currentNPC.isVirgin && <span className="text-[8px] bg-pink-500/10 border border-pink-500/50 text-pink-400 px-3 py-1 rounded-none uppercase tracking-widest font-black">Xử Nữ</span>}
                                                     </h4>
                                                     <span className="text-[9px] text-pink-900/60 font-bold uppercase tracking-[0.3em] mt-1 ml-1">Lược Sử Riêng Tư • Chỉ dành cho chủ nhân</span>
                                                 </div>
                                                 <IconGlyph name="flower" className="w-10 h-10 opacity-20 grayscale brightness-200" />
                                             </div>

                                            {/* First Time Record */}
                                             {!currentNPC.isVirgin && currentNPC.firstNightClaimer === playerName && (
                                                 <div className="mb-10 bg-gradient-to-r from-pink-950/40 via-pink-900/10 to-transparent border border-pink-500/40 p-6 rounded-none relative overflow-hidden">
                                                     <IconGlyph name="heart" className="absolute right-[-10px] top-[-10px] w-20 h-20 opacity-5 rotate-12" />
                                                    <div className="relative z-10">
                                                        <div className="text-[9px] text-pink-400 font-black uppercase tracking-[0.4em] mb-3">Dấu Ấn Đầu Tiên</div>
                                                        <div className="font-serif text-lg leading-relaxed text-pink-100 italic">
                                                            Vào ngày <span className="text-wuxia-gold font-black not-italic px-1.5">{currentNPC.firstNightTime}</span>, nàng đã giao phó sự trong trắng của đời mình cho <span className="text-wuxia-gold font-black underline underline-offset-4 decoration-wuxia-gold/40 not-italic px-1">{currentNPC.firstNightClaimer}</span>.
                                                        </div>
                                                        {currentNPC.firstNightDescription && (
                                                            <p className="mt-4 text-xs text-pink-300/60 leading-relaxed border-l-2 border-pink-500/30 pl-4 py-1">"{currentNPC.firstNightDescription}"</p>
                                                        )}
                                                    </div>
                                                </div>
                                             )}

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                                <PrivateTag label="Kích Cỡ Ngực" value={currentNPC.breastSize} color="text-pink-200" />
                                                <PrivateTag label="Kích Cỡ Mông" value={currentNPC.buttockSize} color="text-pink-200" />
                                                <PrivateTag label="Sắc Đào Đỉnh" value={currentNPC.nippleColor} color="text-pink-300" />
                                                <PrivateTag label="Sắc Động Đào" value={currentNPC.vaginaColor} color="text-pink-300" />
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                                                <div className="bg-black/60 p-6 rounded-none border border-white/5 h-full">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-pink-500/60 mb-3 block">Đặc Điểm Cơ Thể</span>
                                                    <p className="text-sm font-serif leading-loose text-pink-100/80 italic indent-4">{currentNPC.privateTraits || "Bạch khiết vô hạ, không tỳ vết."}</p>
                                                </div>
                                                <div className="bg-black/60 p-6 rounded-none border border-white/5 h-full">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-pink-500/60 mb-3 block">Hương Vị Riêng Tư</span>
                                                    <p className="text-sm font-serif leading-loose text-pink-100/80 italic indent-4">{currentNPC.privateFullDescription || "Thân thể toát lên hương khí u linh, say đắm lòng người."}</p>
                                                </div>
                                            </div>

                                            {/* Development Stats */}
                                            <div className="bg-white/5 rounded-none border border-white/5 p-8 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-pink-500/30"></div>
                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-pink-500/30"></div>
                                                
                                                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-paper-white/30 mb-6 flex justify-between">
                                                    CƠ THỂ PHÁT TRIỂN TIẾN ĐỘ
                                                    <span className="text-pink-500/50">LÂM SÀNG BẢNG</span>
                                                </h5>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                                                    <SexStat label="Duyệt nhân thủ sắc (Mouth)" count={currentNPC.count_oral} />
                                                    <SexStat label="Giao long quá huyệt (Vaginal)" count={currentNPC.count_vaginal} />
                                                    <SexStat label="Cung nghênh tuyết đỉnh (Breast)" count={currentNPC.count_breast} />
                                                    <SexStat label="Khai khẩn hậu viên (Anal)" count={currentNPC.count_anal} />
                                                    <div className="md:col-span-2 mt-4 flex items-center justify-center gap-10 bg-black/40 py-3 rounded-none border border-pink-500/10">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[8px] text-pink-500/50 font-bold uppercase mb-1">Tổng huyệt phát</span>
                                                            <span className="text-2xl font-black text-pink-400 font-mono tracking-tighter">{(currentNPC.count_oral || 0) + (currentNPC.count_vaginal || 0) + (currentNPC.count_breast || 0) + (currentNPC.count_anal || 0)}</span>
                                                        </div>
                                                        <div className="w-[1px] h-8 bg-white/10"></div>
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[8px] text-pink-500/50 font-bold uppercase mb-1">Cực khoái tột độ</span>
                                                            <span className="text-2xl font-black text-wuxia-gold font-mono tracking-tighter">{currentNPC.count_orgasm || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* MEMORY LANE */}
                                <div className="mt-20 border-t border-white/5 pt-10">
                                    <h4 className="text-paper-white/20 font-serif font-black uppercase tracking-[0.4em] text-xs mb-8">Ký ỨC TRƯỜNG HÀ</h4>
                                    <div className="space-y-6 relative border-l border-white/5 ml-6 pl-10">
                                        {currentNPC.memories.map((mem, idx) => (
                                            <div key={idx} className="relative group/mem">
                                                <div className="absolute left-[-46px] top-1 w-3 h-3 rounded-none bg-black border-2 border-white/10 z-10"></div>
                                                <div className="bg-white/5 p-5 rounded-none border border-white/5">
                                                    <div className="text-[9px] text-paper-white/30 font-mono mb-2 uppercase tracking-widest">{mem.time}</div>
                                                    <p className="text-sm text-paper-white/70 leading-relaxed font-serif italic">"{mem.content}"</p>
                                                </div>
                                            </div>
                                        ))}
                                        {currentNPC.memories.length === 0 && (
                                            <div className="text-center py-6 text-xs text-paper-white/20 italic">Vẫn chưa có những kỷ niệm khắc cốt ghi tâm.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                             <div className="flex flex-col items-center justify-center h-full opacity-20">
                                 <div className="w-40 h-40 rounded-none border border-dashed border-white/20 flex items-center justify-center">
                                     <IconGlyph name="user" className="w-24 h-24" />
                                 </div>
                                <h4 className="text-2xl font-serif font-black text-paper-white/30 tracking-[0.4em] mt-8">CHƯA CHỌN NHÂN VẬT</h4>
                                <p className="text-[10px] uppercase tracking-widest mt-4">Vạn sự tùy duyên</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER DECO */}
                <div className="h-4 bg-black/80 border-t border-wuxia-gold/5 flex items-center justify-center gap-10 relative z-[100]">
                    <div className="w-1/3 h-[1px] bg-gradient-to-r from-transparent via-wuxia-gold/20 to-transparent"></div>
                    <div className="w-2 h-2 border border-wuxia-gold/30 rotate-45"></div>
                    <div className="w-1/3 h-[1px] bg-gradient-to-l from-transparent via-wuxia-gold/20 to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default SocialModal;
