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

const Tag: React.FC<{ label: string }> = ({ label }) => (
    <span className="px-2 py-0.5 text-[10px] rounded-none border border-gray-700 text-gray-400">
        {label}
    </span>
);

const PrivateTag: React.FC<{ label: string; value?: string; color?: string }> = ({ label, value, color = "text-pink-300" }) => (
    <div className="flex flex-col border border-gray-800 p-2 rounded-none bg-black/20">
        <span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">{label}</span>
        <span className={`font-serif text-sm ${color}`}>{value || "???"}</span>
    </div>
);

const StatRow: React.FC<{ label: string; count?: number }> = ({ label, count }) => (
    <div className="flex justify-between items-center border-b border-gray-800/50 py-1 last:border-0">
        <span className="text-[11px] text-gray-400">{label}</span>
        <span className="font-mono text-pink-400 font-bold">{count || 0}</span>
    </div>
);

const RelationTag: React.FC<{ label: string; value?: string; accent?: string }> = ({ label, value, accent = 'text-wuxia-cyan' }) => (
    <div className="bg-ink-black/35 border border-gray-800 rounded-none p-3">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</div>
        <div className={`text-xs font-serif leading-relaxed ${accent}`}>{value?.trim() || 'No records'}</div>
    </div>
);

const MobileSocial: React.FC<Props> = ({ socialList, onClose, playerName = "Young Hero", onToggleMajorRole, allAvatars }) => {
    const [selectedId, setSelectedId] = useState<string | null>(
        socialList.length > 0 ? socialList[0].id : null
    );

    const resolveAvatar = (npc: NpcStructure) => {
        if (!allAvatars) return npc.avatar;
        return allAvatars[npc.id] || allAvatars[npc.name] || npc.avatar;
    };
    const currentNPC = socialList.find(n => n.id === selectedId);
    const showFemaleExtensions = currentNPC?.gender === 'Female' && Boolean(currentNPC?.isMainCharacter);
    
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

    return (
        <div className="fixed inset-0 bg-ink-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-3 md:hidden">
            <div className="bg-wuxia-glass border border-wuxia-gold/30 w-full max-w-[560px] h-[84vh] flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden rounded-none">
                {/* Header */}
                <div className="h-12 shrink-0 border-b border-wuxia-gold/20 bg-ink-black/60 flex items-center justify-between px-4">
                    <h3 className="text-wuxia-gold font-serif font-bold text-base tracking-[0.3em] flex items-center gap-2">
                        <IconGlyph name="scroll" className="w-4 h-4" />
                        JIANGHU REGISTER
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-none bg-ink-black/50 border border-gray-700 text-gray-400"
                        title="Đóng"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4">
                    {/* Directory Selection */}
                    <div className="bg-ink-black/40 border border-wuxia-gold/10 rounded-none p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-gray-500 tracking-[0.3em]">DIRECTORY</span>
                            <span className="text-[10px] text-wuxia-cyan/80">{socialList.length} Person</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {socialList.map(npc => (
                                <button
                                    key={npc.id}
                                    onClick={() => setSelectedId(npc.id)}
                                    className={`min-w-[120px] p-2 rounded-none border text-left ${selectedId === npc.id
                                            ? 'border-wuxia-gold/60 bg-wuxia-gold/10'
                                            : 'border-gray-800 bg-white/[0.02]'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-9 h-9 rounded-none flex items-center justify-center font-serif font-bold text-base border-2 ${npc.gender === 'Female' ? 'border-pink-800/60 bg-pink-900/20 text-pink-500' : 'border-wuxia-cyan/30 bg-wuxia-cyan/10 text-wuxia-cyan'
                                            }`}>
                                            {resolveAvatar(npc) ? (
                                                <img src={resolveAvatar(npc)} alt={npc.name} className="w-full h-full object-cover" />
                                            ) : (
                                                npc.name[0]
                                            )}
                                        </div>
                                        <div>
                                            <div className={`font-serif font-bold text-sm ${selectedId === npc.id ? 'text-wuxia-gold' : 'text-gray-300'
                                                }`}>
                                                {npc.name}
                                            </div>
                                            <div className="text-[9px] text-gray-500">{npc.identity}</div>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-[10px] text-wuxia-red font-mono flex items-center gap-1">
                                        <IconGlyph name="heart" className="w-2.5 h-2.5" /> {npc.favorability}
                                    </div>
                                </button>
                            ))}
                            {socialList.length === 0 && (
                                <div className="text-center text-gray-600 text-xs py-6 w-full">No known acquaintances yet</div>
                            )}
                        </div>
                    </div>

                    {currentNPC ? (
                        <>
                            {/* NPC Banner Image 16:9 */}
                            {resolveAvatar(currentNPC) && (
                                <div className="aspect-video w-full rounded-none border border-wuxia-gold/20 overflow-hidden relative mb-2 shadow-lg">
                                    <img 
                                        src={resolveAvatar(currentNPC)} 
                                        alt={currentNPC.name} 
                                        className="w-full h-full object-cover object-top" 
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent"></div>
                                </div>
                            )}

                            {/* NPC Banner */}
                            <div className="bg-ink-black/40 border border-wuxia-gold/20 rounded-none p-4 relative">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-xl text-wuxia-gold font-serif font-bold">{currentNPC.name}</div>
                                        <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{currentNPC.relationStatus}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl text-wuxia-red font-serif flex items-center justify-end gap-1">
                                            <IconGlyph name="heart" className="w-6 h-6" /> {currentNPC.favorability}
                                        </div>
                                        <div className="text-[9px] text-gray-500">{currentNPC.realm}</div>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Tag label={`${currentNPC.identity}`} />
                                    <Tag label={`${currentNPC.gender} · ${currentNPC.age}Age`} />
                                    <Tag label={currentNPC.isPresent ? 'Present' : 'Leave'} />
                                    <Tag label={currentNPC.isTeammate ? 'Teammate' : 'Non-teammate'} />
                                </div>
                                
                                {/* Toggle Control */}
                                <button
                                    type="button"
                                    onClick={() => toggleImportantCharacterState(currentNPC)}
                                    className="mt-4 flex items-center gap-3 w-full p-2 border border-gray-800 bg-black/20 rounded-none"
                                >
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Main Character Status</span>
                                    <div className={`w-10 h-5 rounded-none border flex items-center px-0.5 ${currentNPC.isMainCharacter ? 'bg-wuxia-gold/20 border-wuxia-gold/50' : 'bg-gray-900 border-gray-700'}`}>
                                        <div className={`w-3.5 h-3.5 rounded-none ${currentNPC.isMainCharacter ? 'ml-auto bg-wuxia-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'bg-gray-600'}`} />
                                    </div>
                                    <span className={`text-[10px] font-bold ${currentNPC.isMainCharacter ? 'text-wuxia-gold' : 'text-gray-500'}`}>
                                        {currentNPC.isMainCharacter ? 'TRACKED' : 'NORMAL'}
                                    </span>
                                </button>
                            </div>

                            {/* Biography */}
                            <div className="bg-ink-black/30 border border-wuxia-gold/10 rounded-none p-4 border-l-2 border-l-wuxia-gold/30">
                                <div className="text-[10px] text-wuxia-gold/60 tracking-[0.3em] mb-2 uppercase">Character Biography</div>
                                <p className="text-sm text-gray-300 font-serif leading-relaxed italic">
                                    {currentNPC.description || 'No detailed records yet。'}
                                </p>
                            </div>

                            {/* Relationship-Driven Panel */}
                            {showFemaleExtensions && (
                                <div className="bg-ink-black/30 border border-wuxia-cyan/30 rounded-none p-4 space-y-3">
                                    <div className="flex items-center justify-between border-b border-wuxia-cyan/20 pb-2">
                                        <div className="text-wuxia-cyan font-serif font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                                            <IconGlyph name="scroll" className="w-3.5 h-3.5" />
                                            Fate Interaction
                                        </div>
                                        <span className="text-[10px] text-wuxia-cyan/80 tracking-[0.2em]">DYNAMIC STATUS</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <RelationTag label="CORE PERSONALITY TRAITS" value={currentNPC.corePersonalityTraits} accent="text-wuxia-cyan" />
                                        <RelationTag label="AFFINITY BREAKTHROUGH" value={currentNPC.favorabilityBreakthroughCondition} accent="text-emerald-200" />
                                        <RelationTag label="RELATION BREAKTHROUGH" value={currentNPC.relationBreakthroughCondition} accent="text-amber-200" />
                                    </div>
                                    
                                    {/* Relationship Network */}
                                    <div className="bg-pink-950/10 border border-pink-900/30 rounded-none p-3 mt-4">
                                        <div className="text-[10px] text-pink-400 tracking-[0.2em] mb-2 uppercase flex items-center gap-2">
                                            <IconGlyph name="heart" className="w-3 h-3" />
                                            Social Ties
                                        </div>
                                        {currentRelationshipNetwork.length > 0 ? (
                                            <div className="space-y-2">
                                                {currentRelationshipNetwork.map((edge, idx) => (
                                                    <div key={`${edge.targetName}_${edge.relation}_${idx}`} className="bg-ink-black/40 border border-pink-900/20 rounded-none p-2 border-l border-l-pink-500/40">
                                                        <div className="text-[11px] text-white">
                                                            <span className="text-pink-400 font-bold uppercase text-[9px]">Target：</span>{edge.targetName}
                                                        </div>
                                                        <div className="text-[11px] text-white mt-1">
                                                            <span className="text-pink-400 font-bold uppercase text-[9px]">Relation：</span>{edge.relation}
                                                        </div>
                                                        {edge.note && (
                                                            <div className="text-[10px] text-pink-200/60 mt-1 leading-relaxed border-t border-pink-900/20 pt-1 italic">{edge.note}</div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-[11px] text-pink-100/40 font-serif italic text-center py-2">No connection recorded</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Private Records */}
                            {showFemaleExtensions && (
                                <div className="bg-ink-black/30 border border-pink-900/60 rounded-none p-4 space-y-4">
                                    <div className="flex items-center justify-between border-b border-pink-900/40 pb-2">
                                        <div className="text-pink-400 font-serif font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                                            <IconGlyph name="heart" className="w-4 h-4" />
                                            Private Boudoir
                                        </div>
                                        {currentNPC.isVirgin && (
                                            <span className="text-[9px] bg-pink-500/10 text-pink-300 px-2 py-0.5 rounded-none border border-pink-500/40 uppercase font-bold tracking-tighter">PURE SOUL</span>
                                        )}
                                    </div>

                                    <div className="bg-ink-black/60 border border-pink-900/40 rounded-none p-3 space-y-3">
                                        <div className="text-[10px] text-pink-400 tracking-[0.3em] uppercase underline underline-offset-4 decoration-pink-900/60">Appearance Data</div>
                                        <p className="text-xs text-gray-300 italic font-serif leading-relaxed">“{readAppearance(currentNPC) || 'No appearance description'}”</p>
                                        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 p-2 bg-black/30">
                                            <div><span className="text-pink-400 font-bold uppercase">Stature：</span>{readBuildBody(currentNPC) || 'N/A'}</div>
                                            <div><span className="text-pink-400 font-bold uppercase">Clothing：</span>{readClothing(currentNPC) || 'N/A'}</div>
                                        </div>
                                    </div>

                                    {!currentNPC.isVirgin && currentNPC.firstNightClaimer === playerName && (
                                        <div className="p-3 bg-pink-900/20 border border-pink-500/40 rounded-none text-[11px] text-pink-100 border-l-4 border-l-pink-500">
                                            <div className="text-[10px] text-pink-300 mb-1 font-bold uppercase">Sacred Union Record</div>
                                            <span className="text-wuxia-gold font-bold">【{currentNPC.firstNightTime}】</span>
                                            <span className="mx-1">Dedication to</span>
                                            <span className="text-wuxia-gold font-bold underline decoration-wuxia-gold/40 underline-offset-2">{currentNPC.firstNightClaimer}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <PrivateTag label="CHEST" value={currentNPC.breastSize} />
                                        <PrivateTag label="HIP SHAPE" value={currentNPC.buttockSize} />
                                        <PrivateTag label="NIPPLE COLOR" value={currentNPC.nippleColor} />
                                        <PrivateTag label="SECRET POINT" value={currentNPC.vaginaColor} />
                                    </div>

                                    <div className="bg-ink-black/40 border border-pink-900/30 rounded-none p-3">
                                        <div className="text-[10px] text-pink-400 tracking-widest uppercase mb-1 font-bold">Innate Lust</div>
                                        <div className="text-sm text-pink-100/80 font-serif leading-relaxed">
                                            {currentNPC.privateTraits || 'No records available'}
                                        </div>
                                    </div>

                                    <div className="bg-ink-black/40 border border-gray-800 rounded-none p-3 text-xs text-pink-200/70 font-serif leading-relaxed border-l-2 border-l-pink-900/40">
                                        {currentNPC.privateFullDescription || 'The details of the jade body remain concealed.'}
                                    </div>

                                    {/* Body Stats */}
                                    <div className="bg-ink-black/50 border border-gray-800 rounded-none p-3 border-t-2 border-t-pink-900/40">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-bold border-b border-gray-800 pb-1">Dual Cultivation Progress</div>
                                        <div className="grid grid-cols-1 gap-1">
                                            <StatRow label="Oral Devotion" count={currentNPC.count_oral} />
                                            <StatRow label="Jade Caress" count={currentNPC.count_breast} />
                                            <StatRow label="Cinnabar Union" count={currentNPC.count_vaginal} />
                                            <StatRow label="Hidden Valley" count={currentNPC.count_anal} />
                                            <div className="mt-2 pt-1 border-t border-gray-800/70">
                                                <StatRow label="Transcendental Climax" count={currentNPC.count_orgasm} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shared Memories */}
                            <div className="bg-ink-black/30 border border-wuxia-gold/10 rounded-none p-4">
                                <div className="text-[10px] text-wuxia-gold/60 tracking-[0.3em] mb-3 uppercase flex items-center gap-2">
                                    <IconGlyph name="scroll" className="w-3 h-3" />
                                    Shared Path
                                </div>
                                <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar pr-2">
                                    {currentNPC.memories.map((mem, idx) => (
                                        <div key={idx} className="border-l border-wuxia-gold/30 pl-3 relative">
                                            <div className="absolute top-0 left-[-1.5px] w-[3px] h-[3px] bg-wuxia-gold" />
                                            <div className="text-xs text-gray-300 leading-relaxed">{mem.content}</div>
                                            <div className="text-[9px] text-gray-500 font-mono mt-1 uppercase italic tracking-tighter opacity-70">{mem.time}</div>
                                        </div>
                                    ))}
                                    {currentNPC.memories.length === 0 && (
                                        <div className="text-xs text-gray-600 font-serif italic text-center py-4">The scroll of memory is yet to be written.</div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-600 font-serif gap-3">
                            <IconGlyph name="scroll" className="w-10 h-10 opacity-10" />
                            <span className="tracking-widest uppercase text-xs opacity-50">Select a figure to examine</span>
                        </div>
                    )}
                </div>
                
                {/* Decorative border bottom */}
                <div className="h-1 bg-gradient-to-r from-transparent via-wuxia-gold/40 to-transparent shrink-0" />
            </div>
        </div>
    );
};

export default MobileSocial;
