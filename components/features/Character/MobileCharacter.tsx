import React from 'react';
import { CharacterData } from '../../../types';
import { RadarChart, RadarData } from '../../shared/RadarChart';

interface Props {
    character: CharacterData;
    onClose: () => void;
    allAvatars?: Record<string, string>;
}

// Utility to match LeftPanel logic
const getDynamicAvatar = (role: CharacterData, allAvatars?: Record<string, string>) => {
    if (allAvatars && allAvatars[role.id]) return allAvatars[role.id];
    if (allAvatars && allAvatars[role.name]) return allAvatars[role.name];
    if (role.avatar && !role.avatar.includes('default')) {
        if (role.avatar.startsWith('data:image/')) return role.avatar;
        let url = role.avatar.startsWith('/') ? role.avatar : `/images/${role.avatar}`;
        if (!url.match(/\.(png|jpe?g|webp|gif)$/i)) url += '.png';
        return url;
    }
    return null;
};

const VitalBar: React.FC<{ label: string; current: number; max: number; color: string }> = ({ label, current, max, color }) => {
    const pct = Math.min((current / (max || 1)) * 100, 100);
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-gray-500">
                <span>{label}</span>
                <span className="font-mono text-gray-300">{current}/{max}</span>
            </div>
            <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
};

const BodyRow: React.FC<{ name: string; current: number; max: number }> = ({ name, current, max }) => {
    const pct = Math.min((current / (max || 1)) * 100, 100);
    return (
        <div className="flex items-center gap-2">
            <span className="w-10 text-[10px] text-gray-400">{name}</span>
            <div className="flex-1 h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                <div className="h-full bg-wuxia-red" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-12 text-[10px] text-gray-500 font-mono text-right">{current}/{max}</span>
        </div>
    );
};

const MobileCharacter: React.FC<Props> = ({ character, onClose, allAvatars }) => {
    const Money = character.money || { gold: 0, silver: 0, copper: 0 };
    const avatarUrl = getDynamicAvatar(character, allAvatars);

    const attributes = [
        { label: 'Sức mạnh', value: character.strength, base: character.baseStats?.strength },
        { label: 'Thân pháp', value: character.agility, base: character.baseStats?.agility },
        { label: 'Thể chất', value: character.constitution, base: character.baseStats?.constitution },
        { label: 'Căn cốt', value: character.rootBone, base: character.baseStats?.rootBone },
        { label: 'Ngộ tính', value: character.intelligence, base: character.baseStats?.intelligence },
        { label: 'Phúc duyên', value: character.luck, base: character.baseStats?.luck },
        { label: 'Tâm tính', value: character.tamTinh, base: character.baseStats?.tamTinh },
    ] as RadarData[];

    const bodyParts = [
        { name: 'Đầu', current: character.headCurrentHp, max: character.headMaxHp },
        { name: 'Ngực', current: character.chestCurrentHp, max: character.chestMaxHp },
        { name: 'Bụng', current: character.abdomenCurrentHp, max: character.abdomenMaxHp },
        { name: 'Tay trái', current: character.leftArmCurrentHp, max: character.leftArmMaxHp },
        { name: 'Tay phải', current: character.rightArmCurrentHp, max: character.rightArmMaxHp },
        { name: 'Chân trái', current: character.leftLegCurrentHp, max: character.leftLegMaxHp },
        { name: 'Chân phải', current: character.rightLegCurrentHp, max: character.rightLegMaxHp },
    ];

    const equipmentOrder: { key: keyof typeof character.equipment; label: string }[] = [
        { key: 'head', label: 'Đầu' },
        { key: 'chest', label: 'Thân' },
        { key: 'back', label: 'Lưng' },
        { key: 'waist', label: 'Thắt lưng' },
        { key: 'legs', label: 'Chân' },
        { key: 'feet', label: 'Bàn chân' },
        { key: 'hands', label: 'Hộ thủ' },
        { key: 'mainWeapon', label: 'Vũ khí chính' },
        { key: 'subWeapon', label: 'Vũ khí phụ' },
        { key: 'hiddenWeapon', label: 'Ám khí' },
        { key: 'mount', label: 'Tọa kỵ' },
    ];

    const getEquipName = (key: keyof typeof character.equipment) => {
        const idOrName = character.equipment[key];
        if (idOrName === 'None') return 'None';
        const item = character.itemList.find(i => i.ID === idOrName || i.Name === idOrName);
        return item ? item.Name : idOrName;
    };

    return (
        <div className="fixed inset-0 bg-black z-[200] flex items-center justify-center p-3 md:hidden animate-fadeIn"
            style={{ background: 'radial-gradient(circle at center, rgba(30,15,5,1) 0%, rgba(0,0,0,1) 100%)' }}>
            <div className="bg-ink-black border border-wuxia-gold/30 w-full max-w-[520px] h-[82vh] flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.95)] relative overflow-hidden rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(15,8,4,1) 0%, rgba(5,3,2,1) 100%)' }}>
                <div className="h-12 shrink-0 border-b border-ink-gray/60 bg-ink-gray/40 flex items-center justify-between px-4">
                    <h3 className="text-wuxia-gold font-serif font-bold text-base tracking-[0.3em]">Hồ sơ nhân vật</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-ink-black/50 border border-gray-700 text-gray-400 hover:text-wuxia-red hover:border-wuxia-red transition-all"
                        title="Đóng"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-ink-black/5">
                    <div className="bg-ink-gray/40 border border-ink-gray rounded-xl p-4">
                        <div className="flex items-start gap-4">
                            {/* Avatar Section */}
                            <div className="w-20 h-24 shrink-0 bg-black/40 border-2 border-wuxia-gold/20 rounded-lg overflow-hidden relative group">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={character.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-wuxia-gold/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent h-6 flex items-end justify-center pb-1">
                                    <span className="text-[8px] text-wuxia-gold/60 uppercase tracking-tighter">Căn cốt</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-xl text-wuxia-gold font-serif font-bold">{character.name}</div>
                                        <div className="text-[11px] text-gray-400 mt-1">{character.title || character.background || 'Vô danh tiểu tốt'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Cảnh giới</div>
                                        <div className="text-wuxia-red font-bold text-sm drop-shadow-[0_0_8px_rgba(190,18,60,0.5)]">{character.realm}</div>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2 text-[9px]">
                                    <span className="px-1.5 py-0.5 bg-ink-gray/40 border border-ink-gray rounded text-gray-300">Giới tính {character.gender}</span>
                                    <span className="px-1.5 py-0.5 bg-ink-gray/40 border border-ink-gray rounded text-gray-300">Tuổi {character.age}</span>
                                    <span className="px-1.5 py-0.5 bg-ink-gray/40 border border-ink-gray rounded text-gray-300 font-mono">Nặng {character.currentWeight}/{character.maxWeight}kg</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] pt-3 border-t border-ink-gray/30">
                            <span className="flex items-center gap-1 px-2 py-1 bg-ink-gray/40 border border-ink-gray rounded text-wuxia-gold font-mono"><span className="opacity-50 text-[8px]">V:</span>{Money.gold}</span>
                            <span className="flex items-center gap-1 px-2 py-1 bg-ink-gray/40 border border-ink-gray rounded text-gray-300 font-mono"><span className="opacity-50 text-[8px]">B:</span>{Money.silver}</span>
                            <span className="flex items-center gap-1 px-2 py-1 bg-ink-gray/40 border border-ink-gray rounded text-orange-400 font-mono"><span className="opacity-50 text-[8px]">Đ:</span>{Money.copper}</span>
                        </div>
                        {character.personality && (
                            <div className="mt-4 pt-3 border-t border-ink-gray/60 italic text-[11px] text-gray-400 leading-relaxed bg-black/10 p-2 rounded-lg">
                                <span className="text-wuxia-gold/70 not-italic mr-2 font-bold uppercase tracking-tighter">Tính cách:</span>
                                {character.personality}
                            </div>
                        )}
                    </div>

                    <div className="bg-ink-gray/40 border border-ink-gray rounded-xl p-4 overflow-hidden">
                        <div className="text-[10px] text-wuxia-gold/70 tracking-[0.3em] mb-1 uppercase font-bold text-center">Thuộc tính</div>
                        <RadarChart data={attributes} size={250} maxValue={30} className="w-full" />
                    </div>

                    <div className="bg-ink-gray/40 border border-ink-gray rounded-xl p-4 space-y-3">
                        <div className="text-[10px] text-wuxia-gold/70 tracking-[0.3em]">Trạng thái</div>
                        <VitalBar label="Năng lượng" current={character.currentEnergy} max={character.maxEnergy} color="bg-wuxia-cyan" />
                        <VitalBar label="No bụng" current={character.currentFullness} max={character.maxFullness} color="bg-wuxia-gold" />
                        <VitalBar label="Nước" current={character.currentThirst} max={character.maxThirst} color="bg-wuxia-cyan" />
                    </div>

                    <div className="bg-ink-gray/40 border border-ink-gray rounded-xl p-4 space-y-2">
                        <div className="text-[10px] text-wuxia-gold/70 tracking-[0.3em]">Cơ thể</div>
                        {bodyParts.map((part) => (
                            <BodyRow key={part.name} name={part.name} current={part.current} max={part.max} />
                        ))}
                    </div>

                    {character.playerBuffs && character.playerBuffs.length > 0 && (
                        <div className="bg-ink-gray/40 border border-ink-gray rounded-xl p-4">
                            <div className="text-[10px] text-wuxia-gold/70 tracking-[0.3em] mb-2">Trạng thái buff</div>
                            <div className="flex flex-wrap gap-2">
                                {character.playerBuffs.map((buff, i) => (
                                    <span key={i} className="text-[10px] px-2 py-1 border border-wuxia-cyan/30 text-wuxia-cyan bg-wuxia-cyan/5 rounded">
                                        {buff}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-ink-gray/40 border border-ink-gray rounded-xl p-4">
                        <div className="text-[10px] text-wuxia-gold/70 tracking-[0.3em] mb-2">Trang phục</div>
                        <div className="space-y-2">
                            {equipmentOrder.map((item) => (
                                <div key={item.key} className="flex justify-between text-[10px] border-b border-gray-800/60 pb-1 last:border-0">
                                    <span className="text-gray-500">{item.label}</span>
                                    <span className="text-gray-300 max-w-[180px] truncate text-right" title={getEquipName(item.key)}>
                                        {getEquipName(item.key)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileCharacter;

