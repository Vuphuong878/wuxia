import React, { useEffect, useMemo, useRef, useState } from 'react';
import GameButton from '../../ui/GameButton';
import { WorldGenConfig, CharacterData, Talent, Background, GameDifficulty, StoryStyleType, TalentRank } from '../../../types';
import { PresetTalent, PresetBackground } from '../../../data/presets';
import { OrnateBorder } from '../../ui/decorations/OrnateBorder';
import InlineSelect from '../../ui/InlineSelect';
import ToggleSwitch from '../../ui/ToggleSwitch';
import * as dbService from '../../../services/dbService';
import { Dices, Save, Download, LogOut, X } from 'lucide-react';

interface Props {
    onComplete: (
        worldConfig: WorldGenConfig,
        charData: CharacterData,
        mode: 'all' | 'step',
        openingStreaming: boolean
    ) => void;
    onCancel: () => void;
    loading: boolean;
    requestConfirm?: (options: { title?: string; message: string; confirmText?: string; cancelText?: string; danger?: boolean }) => Promise<boolean>;
}

const STEPS = ['Thế giới quan', 'Nền tảng nhân vật', 'Thân thế xuất thân', 'Thiên bẩm linh căn', 'Xác nhận tạo'];

const WORLD_NAMES = ['Thương Khung Giới', 'Huyền Âm Thế Giới', 'Thái Hư Kiếm Vực', 'Trọng Tiêu Thần Giới', 'Vạn Kiếm Thánh Địa', 'Hỗn Độn Thần Vực', 'Tử Tiêu Cửu Thiên', 'Huyết Sát Giang Hồ', 'Phong Lôi Vũ Giới', 'Thiên Long Bát Bộ Giới', 'Cửu Châu Kiếm Giới', 'Mặc Sắc Vô Biên Giới', 'Bách Kiếm Tông Thế Giới', 'Thiên Địa Huyền Hoàng Giới', 'Trường Hà Vạn Cổ Giới', 'Hồng Hoang Thần Giới', 'Kiếm Vũ Thiên Duyên Giới', 'Vô Cực Vạn Giới', 'Tiêu Diêu Vũ Giới', 'Đại Thiên Địa Giới', 'Thanh Hoá', 'Nam Định'];
const DYNASTY_PRESETS = ['Anh hùng tranh đỉnh, cuối triều đại suy tàn, bốn phương nổi loạn', 'Thiên hạ đại loạn, quần hùng cát cứ, giang sơn phân liệt', 'Thịnh thế thái bình, triều đình hưng thịnh nhưng ẩn chứa mưu đồ', 'Loạn thế xuân thu, chư hầu tranh bá, kẻ sĩ tứ phương tụ hội', 'Triều đại khai quốc, anh kiệt vân tập, vươn tay lập cơ nghiệp', 'Ma đạo quật khởi, chính tà đối lập, thiên hạ đại chiến sắp nổ ra', 'Bắc phương dị tộc nam xâm, biên cương nguy cấp, anh hùng xuất thế', 'Cố quốc phồn hoa, đế đô hào hoa náo nhiệt, tranh quyền đoạt vị thâm', 'Thiên tử mất quyền, quyền thần lộng hành, chư hầu mỗi người một cõi', 'Vương triều mạt thế, dân gian lầm than, hào kiệt tứ khởi khởi nghĩa'];
const TIANJIAO_PRESETS = ['Thiên tài đồng xuất, tranh giành đỉnh phong, một thời hào kiệt vân tập', 'Thiên mệnh chi tử xuất thế, thần binh lợi khí tái xuất giang hồ', 'Bách niên kỳ tài cùng thời xuất hiện, võ học đỉnh thịnh chưa từng có', 'Thiên cơ đại biến, thiên kiều mỗi người thân mang cơ duyên trọng đại', 'Ma đạo thánh nhân tái thế, chính đạo liên minh đồng tâm đối kháng', 'Vạn kiếm quy tông, thiên kiều thân mang kiếm mệnh bẩm sinh đặc biệt', 'Cổ thần phong ấn tan vỡ, thiên địa linh khí bạo trướng phi thường', 'Thần ma đại chiến tàn dư giác thức, thiên kiều kế thừa cổ thần di sản', 'Kim thiếp xuất thế, tiên nhân truyền thừa, thiên tài tranh đoạt cơ duyên', 'Huyết mạch giác thức, phong thần bảng tái hiện, thiên kiều tham chiến'];
const MALE_NAMES = ['Hàn Lập', 'Lý Vân', 'Thẩm Lãng', 'Vương Lâm', 'Lâm Động', 'Vũ Hao', 'Trần Phong', 'Tiêu Viêm', 'Lục Minh', 'Dương Khai', 'Trương Hiên', 'Lưu Vũ', 'Tề Thiên', 'Bạch Lộc', 'Hàn Yên', 'Giang Phong', 'Tuấn Kiệt', 'Mộ Dung Long', 'Diệp Phàm', 'Nhạc Thiên', 'Độ Mixi'];
const FEMALE_NAMES = ['Vân Nguyệt', 'Tiểu Tiên', 'Lệ Hồng', 'Tuyết Nhi', 'Linh Nhi', 'Băng Nhi', 'Tử Hà', 'Minh Nguyệt', 'Lam Tinh', 'Hương Hồng', 'Thúy Vân', 'Bạch Lộ', 'Tiểu Vũ', 'Thiên Tâm', 'Kim Tuyến', 'Mộng Nhi', 'Sương Nhi', 'Long Nữ', 'Phù Dao', 'Dao Cơ'];
const APPEARANCE_PRESETS = [
    'Mình hạc xương mai, phong tư trác tuyệt, ánh mắt thâm thúy tựa tinh thần.',
    'Dáng người vạm vỡ, mặt mày góc cạnh, tản ra khí thế uy dũng áp bách.',
    'Dung mạo tú lệ, da thịt như ngọc, khí chất phiêu diêu tựa tiên nhân hạ phàm.',
    'Thân hình thon dài, ăn mặc giản dị nhưng toát lên vẻ sắc bén lạnh lùng.',
    'Khuôn mặt thanh tú, khóe môi luôn vương nụ cười như có như không, ánh mắt thấu triệt.',
    'Tóc xõa tung bay, cuồng ngạo bất kham, mang theo vài phần tà mị.',
    'Nho nhã điềm đạm, cử chỉ khoan thai, như thư sinh thế gia mang đầy thi thư khí chất.',
    'Gương mặt băng lãnh, ánh mắt vô diện vô ba, như người nhẫn nhịn ngàn năm tuyết.',
    'Thiên tư quốc sắc, dung mạo khuuyên thành, mỗi cái cau mày đều khiến thế nhân điên đảo.',
    'Mình đầy sẹo chiến trận, ánh mắt kiên định, toát ra sát khí được tôi luyện qua ngàn trận sinh tử.'
];
const PERSONALITY_PRESETS = [
    'Chí khí cao vời, coi trọng nghĩa khí, ghét ác như thù, luôn sẵn lòng giúp đỡ kẻ yếu.',
    'Lạnh lùng cô độc, ít nói cười, hành sự quyết đoán, chỉ tin tưởng vào bản thân và thanh kiếm trong tay.',
    'Phóng khoáng tự tại, tiêu diêu giang hồ, yêu rượu và thơ ca, không thích sự ràng buộc của quy tắc.',
    'Tâm cơ thâm trầm, mưu định sau mới hành động, giỏi che giấu cảm xúc, khó lòng nhìn thấu.',
    'Hiền lành chất phác, thật thà bao dung, luôn nhìn thấy điểm tốt ở người khác, tâm tính thiện lương.',
    'Kiêu ngạo bất khuất, khí thế lăng người, không bao giờ chịu cúi đầu trước cường quyền.',
    'Trầm tĩnh điềm đạm, suy nghĩ thấu đáo, hành sự cẩn trọng, là người đáng tin cậy trong mọi tình huống.',
    'Hoạt bát lém lỉnh, ham học hỏi, tính tình tò mò, đôi khi hơi tinh quái nhưng bản chất tốt.',
    'Chính trực vô tư, tuân thủ đạo lý, kiên định với lý tưởng của bản thân dù gặp bao gian khổ.',
    'Âm trầm quái gở, lời nói sắc sảo, hành tung bí ẩn, khiến người khác vừa sợ vừa kính.'
];
const CUSTOM_TALENT_STORAGE_KEY = 'new_game_custom_talents';
const CUSTOM_BACKGROUND_STORAGE_KEY = 'new_game_custom_backgrounds';
const WIZARD_SAVE_KEY = 'wuxia_wizard_autosave';

// === Talent Point System Constants ===
const BASE_TALENT_POINTS = 4;
const RANK_COLORS: Record<TalentRank, { border: string; bg: string; text: string; badge: string; glow: string }> = {
    'Huyền thoại': { border: 'border-yellow-400', bg: 'bg-yellow-400/10', text: 'text-yellow-400', badge: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50', glow: 'shadow-yellow-400/20' },
    'Sử Thi': { border: 'border-purple-400', bg: 'bg-purple-400/10', text: 'text-purple-400', badge: 'bg-purple-400/20 text-purple-300 border-purple-400/50', glow: 'shadow-purple-400/20' },
    'Hiếm': { border: 'border-blue-400', bg: 'bg-blue-400/10', text: 'text-blue-400', badge: 'bg-blue-400/20 text-blue-300 border-blue-400/50', glow: 'shadow-blue-400/20' },
    'Thường': { border: 'border-green-400', bg: 'bg-green-400/10', text: 'text-green-400', badge: 'bg-green-400/20 text-green-300 border-green-400/50', glow: 'shadow-green-400/20' },
    'Cực Hạn': { border: 'border-red-600', bg: 'bg-red-600/10', text: 'text-red-400', badge: 'bg-red-600/20 text-red-300 border-red-600/50', glow: 'shadow-red-600/20' },
    'Khắc nghiệt': { border: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/50', glow: 'shadow-orange-500/20' },
    'Khó': { border: 'border-amber-400', bg: 'bg-amber-400/10', text: 'text-amber-400', badge: 'bg-amber-400/20 text-amber-300 border-amber-400/50', glow: 'shadow-amber-400/20' },
};
const DEBUFF_RANKS: TalentRank[] = ['Cực Hạn', 'Khắc nghiệt', 'Khó'];
const BUFF_RANKS: TalentRank[] = ['Huyền thoại', 'Sử Thi', 'Hiếm', 'Thường'];
const DIFFICULTY_OPTIONS: Array<{ value: GameDifficulty; label: string }> = [
    { value: 'relaxed', label: 'Thư giãn (Chế độ truyện)' },
    { value: 'easy', label: 'Dễ (Tân thủ giang hồ)' },
    { value: 'normal', label: 'Bình thường (Trải nghiệm tiêu chuẩn)' },
    { value: 'hard', label: 'Khó (Gươm đao lóe sáng)' },
    { value: 'extreme', label: 'Cực hạn (Địa ngục A-tu-la)' },
    { value: 'custom', label: 'Tùy chỉnh (Theo thư viện prompt)' }
];
const POWER_LEVEL_OPTIONS: Array<{ value: WorldGenConfig['powerLevel']; label: string }> = [
    { value: 'Low-tier Martial', label: 'Võ lực thấp (Quyền cước binh khí)' },
    { value: 'Mid-tier Martial', label: 'Võ lực trung (Nội lực phát ngoại)' },
    { value: 'High-tier Martial', label: 'Võ lực cao (Dời núi lấp biển)' },
    { value: 'Cultivations', label: 'Tu tiên (Trường sinh đắc đạo)' }
];
const WORLD_SIZE_OPTIONS: Array<{ value: WorldGenConfig['worldSize']; label: string }> = [
    { value: 'A tiny place', label: 'Một vùng nhỏ (Một đảo hoặc thành phố)' },
    { value: 'Grand Nine Provinces', label: 'Đại Cửu Châu (Vạn dặm sơn hà)' },
    { value: 'Endless planes', label: 'Bình diện vô tận (Đa thế giới)' }
];
const SECT_DENSITY_OPTIONS: Array<{ value: WorldGenConfig['sectDensity']; label: string }> = [
    { value: 'Rare', label: 'Hiếm có (Ẩn cư tự tại)' },
    { value: 'Moderate', label: 'Vừa phải (Vài môn phái lớn)' },
    { value: 'Standing like trees', label: 'Nhiều như rừng (Trăm nhà tranh luận)' }
];

const STORY_STYLE_OPTIONS: Array<{ value: StoryStyleType; label: string }> = [
    { value: 'Thông thường', label: 'Thông thường (Cốt truyện tự nhiên)' },
    { value: 'Tu luyện', label: 'Tu luyện (Vượt cấp, tranh đoạt)' },
    { value: 'Tu la tràng', label: 'Tu la tràng (Drama, tranh giành tình cảm)' },
    { value: 'Thuần ái', label: 'Thuần ái (Chung thủy, một đối một)' }
];



const STAT_LABELS: Record<string, string> = {
    strength: 'Sức mạnh',
    agility: 'Thân pháp', // Updated from 'Nhanh nhẹn' to 'Thân pháp' for better wuxia feel
    constitution: 'Thể chất',
    rootBone: 'Căn cốt',
    intelligence: 'Ngộ tính',
    luck: 'Phúc duyên', // Updated from 'Khí vận'
    tamTinh: 'Tâm tính', // New stat
};
const GENDER_LABELS: Record<string, string> = { 'Male': 'Nam', 'Female': 'Nữ' };


type DropdownProps = {
    value: number;
    options: number[];
    suffix: string;
    open: boolean;
    onToggle: () => void;
    onSelect: (next: number) => void;
    containerRef: React.RefObject<HTMLDivElement>;
};

const CompactDropdown: React.FC<DropdownProps> = ({
    value,
    options,
    suffix,
    open,
    onToggle,
    onSelect,
    containerRef,
}) => (
    <div className="relative" ref={containerRef}>
        <button
            type="button"
            onClick={onToggle}
            className="w-full bg-transparent border border-wuxia-gold/30 p-3 text-wuxia-gold outline-none focus:border-wuxia-gold rounded-md flex items-center justify-between gap-2 transition-all shadow-inner shadow-black/40"
        >
            <span className="font-mono text-sm">{value}{suffix}</span>
            <svg
                className={`w-4 h-4 text-wuxia-gold/40 transition-transform ${open ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
        </button>
        {open && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-black/95 border border-wuxia-gold/20 rounded-md shadow-[0_12px_30px_rgba(0,0,0,0.6)] z-50">
                <div className="max-h-[336px] overflow-y-auto custom-scrollbar py-1">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => onSelect(opt)}
                            className={`w-full px-3 h-7 flex items-center text-sm font-mono transition-colors ${opt === value ? 'bg-wuxia-gold/20 text-wuxia-gold' : 'text-gray-300 hover:bg-wuxia-gold/[0.05]'
                                }`}
                        >
                            {opt}{suffix}
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const NewGameWizard: React.FC<Props> = ({ onComplete, onCancel, loading, requestConfirm }) => {
    const [step, setStep] = useState(0);

    // --- State: World Config ---
    const [worldConfig, setWorldConfig] = useState<WorldGenConfig>({
        worldName: '',
        powerLevel: 'Mid-tier Martial',
        worldSize: 'Grand Nine Provinces',
        dynastySetting: '',
        sectDensity: 'Standing like trees',
        tianjiaoSetting: '',
        difficulty: 'normal' as GameDifficulty, // Default difficulty
        storyStyle: 'Thông thường'
    });

    // --- State: Character Config ---
    const [charName, setCharName] = useState('');
    const [charGender, setCharGender] = useState<'Male' | 'Female'>('Male');
    const [charAge, setCharAge] = useState(18);
    const [charAppearance, setCharAppearance] = useState('');
    const [charPersonality, setCharPersonality] = useState('');
    const [birthMonth, setBirthMonth] = useState(1);
    const [birthDay, setBirthDay] = useState(1);
    const [monthOpen, setMonthOpen] = useState(false);
    const [dayOpen, setDayOpen] = useState(false);
    const monthRef = useRef<HTMLDivElement>(null);
    const dayRef = useRef<HTMLDivElement>(null);

    // Attributes (Total 60 points to distribute)
    const MAX_POINTS = 60;
    const [stats, setStats] = useState({
        strength: 5, agility: 5, constitution: 5, rootBone: 5, intelligence: 5, luck: 5, tamTinh: 5
    });

    // Talents & Background
    const [selectedBackground, setSelectedBackground] = useState<Background>(PresetBackground[0]);
    const [selectedTalents, setSelectedTalents] = useState<Talent[]>([]);
    const [customTalentList, setCustomTalentList] = useState<Talent[]>([]);
    const [customBackgroundList, setCustomBackgroundList] = useState<Background[]>([]);

    // Gacha animation state
    const [gachaFlash, setGachaFlash] = useState<string | null>(null);
    const triggerGacha = (key: string, action: () => void) => {
        setGachaFlash(key);
        action();
        setTimeout(() => setGachaFlash(null), 600);
    };

    // Random helpers
    const randomFrom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randomWorldName = () => setWorldConfig(c => ({ ...c, worldName: randomFrom(WORLD_NAMES) }));
    const randomDynasty = () => setWorldConfig(c => ({ ...c, dynastySetting: randomFrom(DYNASTY_PRESETS) }));
    const randomTianjiao = () => setWorldConfig(c => ({ ...c, tianjiaoSetting: randomFrom(TIANJIAO_PRESETS) }));
    const randomCharName = () => setCharName(charGender === 'Female' ? randomFrom(FEMALE_NAMES) : randomFrom(MALE_NAMES));
    const randomAppearance = () => setCharAppearance(randomFrom(APPEARANCE_PRESETS));
    const randomPersonality = () => setCharPersonality(randomFrom(PERSONALITY_PRESETS));
    const gachaBackground = () => {
        const idx = Math.floor(Math.random() * allBackgroundOptions.length);
        setSelectedBackground(allBackgroundOptions[idx]);
    };
    const gachaTalent = () => {
        const totalPoints = BASE_TALENT_POINTS + selectedTalents.filter(t => t.cost < 0).reduce((sum, t) => sum + Math.abs(t.cost), 0);
        const spentPoints = selectedTalents.filter(t => t.cost > 0).reduce((sum, t) => sum + t.cost, 0);
        const available = totalPoints - spentPoints;
        const unselected = allTalentOptions.filter(t => !selectedTalents.find(x => x.name === t.name) && t.cost > 0 && t.cost <= available);
        if (unselected.length === 0) return;
        const pick = randomFrom(unselected);
        setSelectedTalents(prev => [...prev, pick]);
    };

    // Custom Inputs
    const [customTalent, setCustomTalent] = useState<Talent>({ name: '', description: '', effect: '', rank: 'Thường', cost: 2 });
    const [talentFilter, setTalentFilter] = useState<'all' | TalentRank>('all');
    const [showCustomTalent, setShowCustomTalent] = useState(false);
    const [customBackground, setCustomBackground] = useState<Background>({ name: '', description: '', effect: '' });
    const [showCustomBackground, setShowCustomBackground] = useState(false);
    const [openingStreaming, setOpeningStreaming] = useState(true);
    const [saveMsg, setSaveMsg] = useState('');

    const showSaveLoadMsg = (msg: string) => {
        setSaveMsg(msg);
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const saveWizardConfig = async () => {
        const config = {
            step, worldConfig, charName, charGender, charAge, charAppearance, charPersonality,
            birthMonth, birthDay, stats, selectedBackground, selectedTalents, openingStreaming
        };
        try {
            await dbService.saveSetting(WIZARD_SAVE_KEY, config);
            showSaveLoadMsg('Đã lưu bản nháp!');
        } catch (e) {
            console.error(e);
            showSaveLoadMsg('Lưu thất bại!');
        }
    };

    const loadWizardConfig = async () => {
        try {
            const saved = await dbService.getSetting(WIZARD_SAVE_KEY);
            if (!saved || typeof saved !== 'object') {
                showSaveLoadMsg('Không thấy bản lưu!');
                return;
            }
            // Use logical updates for each piece of state
            if (typeof saved.step === 'number') setStep(saved.step);
            if (saved.worldConfig) setWorldConfig({ ...worldConfig, ...saved.worldConfig });
            if (typeof saved.charName === 'string') setCharName(saved.charName);
            if (saved.charGender) setCharGender(saved.charGender);
            if (typeof saved.charAge === 'number') setCharAge(saved.charAge);
            if (typeof saved.charAppearance === 'string') setCharAppearance(saved.charAppearance);
            if (typeof saved.charPersonality === 'string') setCharPersonality(saved.charPersonality);
            if (typeof saved.birthMonth === 'number') setBirthMonth(saved.birthMonth);
            if (typeof saved.birthDay === 'number') setBirthDay(saved.birthDay);
            if (saved.stats) setStats({ ...stats, ...saved.stats });
            if (saved.selectedBackground) setSelectedBackground(saved.selectedBackground);
            if (Array.isArray(saved.selectedTalents)) setSelectedTalents(saved.selectedTalents);
            if (typeof saved.openingStreaming === 'boolean') setOpeningStreaming(saved.openingStreaming);

            showSaveLoadMsg('Tải thành công!');
        } catch (e) {
            console.error(e);
            showSaveLoadMsg('Lỗi khi tải!');
        }
    };

    // --- Logic ---
    const monthOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
    const dayOptions = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
    const standardizeTalent = (raw: Talent): Talent | null => {
        const name = raw?.name?.trim() || '';
        const description = raw?.description?.trim() || '';
        const effect = raw?.effect?.trim() || '';
        if (!name || !description || !effect) return null;
        return { name, description, effect, rank: raw.rank || 'Thường', cost: raw.cost ?? 2 };
    };
    const standardizeBackground = (raw: Background): Background | null => {
        const name = raw?.name?.trim() || '';
        const description = raw?.description?.trim() || '';
        const effect = raw?.effect?.trim() || '';
        if (!name || !description || !effect) return null;
        return { name, description, effect };
    };
    const mergeAndDeduplicateTalents = (rawList: Talent[]): Talent[] => {
        const map = new Map<string, Talent>();
        rawList.forEach((item) => {
            const normalized = standardizeTalent(item);
            if (!normalized) return;
            map.set(normalized.name, normalized);
        });
        return Array.from(map.values());
    };
    const mergeAndDeduplicateBackgrounds = (rawList: Background[]): Background[] => {
        const map = new Map<string, Background>();
        rawList.forEach((item) => {
            const normalized = standardizeBackground(item);
            if (!normalized) return;
            map.set(normalized.name, normalized);
        });
        return Array.from(map.values());
    };
    const allBackgroundOptions = useMemo(
        () => [...PresetBackground, ...customBackgroundList.filter(item => !PresetBackground.some(p => p.name === item.name))],
        [customBackgroundList]
    );
    const allTalentOptions = useMemo(
        () => [...PresetTalent, ...customTalentList.filter(item => !PresetTalent.some(p => p.name === item.name))],
        [customTalentList]
    );

    const usedPoints = (Object.values(stats) as number[]).reduce((a, b) => a + b, 0);
    const remainingPoints = MAX_POINTS - usedPoints;
    const stepProgress = ((step + 1) / STEPS.length) * 100;
    const currentStepLabel = STEPS[step] || 'Tạo';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (monthRef.current && monthRef.current.contains(target)) return;
            if (dayRef.current && dayRef.current.contains(target)) return;
            setMonthOpen(false);
            setDayOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const loadCustomConfig = async () => {
            try {
                const savedTalents = await dbService.getSetting(CUSTOM_TALENT_STORAGE_KEY);
                const savedBackgrounds = await dbService.getSetting(CUSTOM_BACKGROUND_STORAGE_KEY);
                if (Array.isArray(savedTalents)) {
                    setCustomTalentList(mergeAndDeduplicateTalents(savedTalents as Talent[]));
                }
                if (Array.isArray(savedBackgrounds)) {
                    setCustomBackgroundList(mergeAndDeduplicateBackgrounds(savedBackgrounds as Background[]));
                }
            } catch (error) {
                console.error('Load custom identity/Talent failed', error);
            }
        };
        loadCustomConfig();
    }, []);

    const handleStatChange = (key: keyof typeof stats, delta: number) => {
        const current = stats[key];
        if (delta > 0 && remainingPoints <= 0) return;
        if (delta < 0 && current <= 1) return;
        setStats({ ...stats, [key]: current + delta });
    };

    // Talent point calculations
    const selectedDebuffs = selectedTalents.filter(t => t.cost < 0);
    const selectedBuffs = selectedTalents.filter(t => t.cost > 0);
    const debuffPoints = selectedDebuffs.reduce((sum, t) => sum + Math.abs(t.cost), 0);
    const totalTalentPoints = BASE_TALENT_POINTS + debuffPoints;
    const spentTalentPoints = selectedBuffs.reduce((sum, t) => sum + t.cost, 0);
    const remainingTalentPoints = totalTalentPoints - spentTalentPoints;
    const hasDebuff = selectedDebuffs.length > 0;

    const toggleTalent = (t: Talent) => {
        if (selectedTalents.find(x => x.name === t.name)) {
            setSelectedTalents(selectedTalents.filter(x => x.name !== t.name));
        } else {
            if (t.cost > 0 && t.cost > remainingTalentPoints) {
                alert(`Không đủ điểm! Cần ${t.cost} điểm, còn ${remainingTalentPoints} điểm.`);
                return;
            }
            setSelectedTalents([...selectedTalents, t]);
        }
    };

    const addCustomTalent = async () => {
        const normalized = standardizeTalent(customTalent);
        if (!normalized) {
            alert("Vui lòng điền đầy đủ thiên bẩm tùy chỉnh (Tên/Mô tả/Hiệu ứng)");
            return;
        }
        const isAlreadySelected = selectedTalents.some(x => x.name === normalized.name);
        if (!isAlreadySelected && normalized.cost > 0 && normalized.cost > remainingTalentPoints) {
            alert(`Không đủ điểm! Cần ${normalized.cost} điểm, còn ${remainingTalentPoints} điểm.`);
            return;
        }

        const nextCustomTalentList = mergeAndDeduplicateTalents([...customTalentList, normalized]);
        setCustomTalentList(nextCustomTalentList);
        setSelectedTalents(
            isAlreadySelected
                ? selectedTalents.map(item => (item.name === normalized.name ? normalized : item))
                : [...selectedTalents, normalized]
        );
        setCustomTalent({ name: '', description: '', effect: '', rank: 'Thường', cost: 2 });
        setShowCustomTalent(false);
        try {
            await dbService.saveSetting(CUSTOM_TALENT_STORAGE_KEY, nextCustomTalentList);
        } catch (error) {
            console.error('Failed to save custom talent', error);
        }
    };

    const addCustomBackground = async () => {
        const name = customBackground.name.trim();
        const description = customBackground.description.trim();
        const effect = customBackground.effect.trim();
        if (!name || !description || !effect) {
            alert("Vui lòng điền đầy đủ thân thế tùy chỉnh (Tên/Mô tả/Hiệu ứng)");
            return;
        }
        const nextBg: Background = { name, description, effect };
        const nextCustomBackgroundList = mergeAndDeduplicateBackgrounds([...customBackgroundList, nextBg]);
        setCustomBackgroundList(nextCustomBackgroundList);
        setSelectedBackground(nextBg);
        setCustomBackground({ name: '', description: '', effect: '' });
        setShowCustomBackground(false);
        try {
            await dbService.saveSetting(CUSTOM_BACKGROUND_STORAGE_KEY, nextCustomBackgroundList);
        } catch (error) {
            console.error('Failed to save custom identity', error);
        }
    };

    const handleGenerate = async () => {
        if (!charName.trim()) {
            alert("Vui lòng nhập tên nhân vật trước");
            setStep(1);
            return;
        }

        // Construct final character data object
        const charData: CharacterData = {
            // Format birthday string from state
            birthDate: `${birthMonth}Tháng${birthDay}Ngày`,

            ...stats, // Strength, agility, constitution, rootBone, intelligence, luck, tamTinh
            name: charName.trim(),
            gender: charGender === 'Male' ? 'Nam' : 'Nữ',
            age: charAge,
            appearance: charAppearance.trim() || 'Ngoại hình bình thường, ăn mặc giản dị.',
            personality: charPersonality.trim() || 'Tâm tính chính trực, hành hiệp trượng nghĩa.',
            talentList: selectedTalents,
            background: selectedBackground,

            // Lưu chỉ số thiên bẩm ban đầu (baseStats)
            baseStats: { ...stats },

            // Defaults
            title: "", realm: "",
            sectId: "none", sectPosition: "None", sectContribution: 0,
            money: { gold: 0, silver: 0, copper: 0 },
            currentEnergy: 100, maxEnergy: 100,
            currentFullness: 80, maxFullness: 100,
            currentThirst: 80, maxThirst: 100,
            currentWeight: 0, maxWeight: 100 + (stats.strength * 10),

            headCurrentHp: 100, headMaxHp: 100, headStatus: "Normal",
            chestCurrentHp: 100, chestMaxHp: 100, chestStatus: "Normal",
            abdomenCurrentHp: 100, abdomenMaxHp: 100, abdomenStatus: "Normal",
            leftArmCurrentHp: 100, leftArmMaxHp: 100, leftArmStatus: "Normal",
            rightArmCurrentHp: 100, rightArmMaxHp: 100, rightArmStatus: "Normal",
            leftLegCurrentHp: 100, leftLegMaxHp: 100, leftLegStatus: "Normal",
            rightLegCurrentHp: 100, rightLegMaxHp: 100, rightLegStatus: "Normal",

            equipment: { head: "None", chest: "None", legs: "None", hands: "None", feet: "None", mainWeapon: "None", subWeapon: "None", hiddenWeapon: "None", back: "None", waist: "None", mount: "None" },
            itemList: [], kungfuList: [],
            currentExp: 0, levelUpExp: 100, playerBuffs: []
        };

        const streamStatus = openingStreaming ? 'Mở' : 'Đóng';
        const confirmText = `Chế độ bắt đầu truyền phát cốt truyện hiện đang được đặt thành 【${streamStatus}】.\nKhi được bật, hiển thị trong khi tạo. Chờ phản hồi đầy đủ nếu đóng.\nTiếp tục tạo?`;
        const ok = requestConfirm
            ? await requestConfirm({
                title: 'Xác nhận tạo',
                message: confirmText,
                confirmText: 'Bắt đầu tạo'
            })
            : true;
        onComplete(worldConfig, charData, openingStreaming ? 'all' : 'step', openingStreaming);
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-black/95 relative overflow-hidden p-2 md:p-10 z-50">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none"></div>

            {/* Main Container */}
            <div className="w-full max-w-5xl h-full border border-wuxia-gold/30 rounded-lg md:rounded-xl bg-black/50 shadow-2xl flex flex-col overflow-hidden relative backdrop-blur-sm">

                <div className="hidden md:flex h-16 border-b border-wuxia-gold/10 items-center justify-between px-8 bg-black/40">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-serif font-bold text-wuxia-gold tracking-widest">Biên niên sử sáng tác</h2>
                        {saveMsg && (
                            <div className="text-[10px] font-mono text-wuxia-gold/80 bg-wuxia-gold/10 px-2 py-1 rounded border border-wuxia-gold/20 animate-fade-in">
                                {saveMsg}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <div className="flex gap-2">
                            {STEPS.map((s, idx) => (
                                <div key={idx} className={`flex items-center gap-2 ${idx === step ? 'text-wuxia-gold' : 'text-wuxia-gold/30'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${idx === step ? 'border-wuxia-gold bg-wuxia-gold/20 shadow-[0_0_10px_rgba(230,200,110,0.3)]' : 'border-wuxia-gold/20'}`}>
                                        {idx + 1}
                                    </div>
                                    <span className="text-xs font-bold hidden md:block">{s}</span>
                                    {idx < STEPS.length - 1 && <div className="w-8 h-px bg-wuxia-gold/10 hidden md:block"></div>}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-1 px-2 rounded hover:bg-white/5 text-wuxia-gold/40 hover:text-red-500 transition-all flex items-center gap-1 group border border-transparent hover:border-red-500/20"
                            title="Đóng"
                        >
                            <span className="text-[11px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">THOÁT</span>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="md:hidden border-b border-wuxia-gold/10 bg-black/50 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-serif font-bold text-wuxia-gold tracking-wider">Biên niên sử sáng tác</h2>
                        <span className="text-[11px] text-wuxia-gold/40 font-mono">{step + 1}/{STEPS.length}</span>
                    </div>
                    <div className="mt-2 text-xs text-wuxia-gold font-bold tracking-widest">{currentStepLabel}</div>
                    <div className="mt-2 h-1 w-full bg-black/60 border border-wuxia-gold/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-wuxia-gold shadow-[0_0_5px_rgba(230,200,110,0.5)] transition-all duration-300"
                            style={{ width: `${stepProgress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-black/20 relative">

                    {/* STEP 1: WORLD SETTINGS */}
                    {step === 0 && (
                        <div className="animate-slide-in max-w-4xl mx-auto">
                            <OrnateBorder className="p-4 md:p-8">
                                <h3 className="text-xl font-serif font-bold text-wuxia-gold border-b border-wuxia-gold/30 pb-3 mb-6">Thiết lập quy luật thế giới</h3>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Tên thế giới</label>
                                            <div className="relative">
                                                <input
                                                    value={worldConfig.worldName}
                                                    onChange={e => setWorldConfig({ ...worldConfig, worldName: e.target.value })}
                                                    placeholder="Nhập tên thế giới..."
                                                    className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-3 pr-12 text-wuxia-gold outline-none rounded-md transition-all font-serif tracking-wider placeholder-wuxia-gold/30"
                                                />
                                                <button
                                                    onClick={randomWorldName}
                                                    title="Random tên thế giới"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-wuxia-gold/15 text-wuxia-gold transition-all duration-200 text-lg hover:scale-110 active:scale-95"
                                                ><Dices className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Độ khó</label>
                                            <InlineSelect
                                                value={worldConfig.difficulty}
                                                options={DIFFICULTY_OPTIONS}
                                                onChange={(val) => setWorldConfig(prev => ({ ...prev, difficulty: val as GameDifficulty }))}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Hệ thống vũ lực</label>
                                            <InlineSelect
                                                value={worldConfig.powerLevel}
                                                options={POWER_LEVEL_OPTIONS}
                                                onChange={(val) => setWorldConfig(prev => ({ ...prev, powerLevel: val as WorldGenConfig['powerLevel'] }))}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Bản đồ thế giới</label>
                                            <InlineSelect
                                                value={worldConfig.worldSize}
                                                options={WORLD_SIZE_OPTIONS}
                                                onChange={(val) => setWorldConfig(prev => ({ ...prev, worldSize: val as WorldGenConfig['worldSize'] }))}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Mật độ môn phái</label>
                                            <InlineSelect
                                                value={worldConfig.sectDensity}
                                                options={SECT_DENSITY_OPTIONS}
                                                onChange={(val) => setWorldConfig(prev => ({ ...prev, sectDensity: val as WorldGenConfig['sectDensity'] }))}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Phong cách truyện</label>
                                            <InlineSelect
                                                value={worldConfig.storyStyle || 'Thông thường'}
                                                options={STORY_STYLE_OPTIONS}
                                                onChange={(val) => setWorldConfig(prev => ({ ...prev, storyStyle: val as StoryStyleType }))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-wuxia-gold font-serif font-bold italic opacity-80 block">Bối cảnh triều đại (Tùy chỉnh)</label>
                                        <div className="relative">
                                            <input
                                                value={worldConfig.dynastySetting}
                                                onChange={e => setWorldConfig({ ...worldConfig, dynastySetting: e.target.value })}
                                                placeholder="Anh hùng tranh đỉnh, cuối triều đại suy tàn"
                                                className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-3 pr-24 text-wuxia-gold outline-none rounded-md transition-all font-serif tracking-wider placeholder-wuxia-gold/30"
                                            />
                                            <button
                                                onClick={randomDynasty}
                                                title="AI ngẫu nhiên bối cảnh triều đại"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-wuxia-gold/15 text-wuxia-gold transition-all duration-200 text-lg hover:scale-110 active:scale-95"
                                            >
                                                <Dices className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-wuxia-gold font-serif font-bold italic opacity-80 block">Thiên kiều/Thiết lập vũ lực (Tùy chỉnh)</label>
                                        <div className="relative">
                                            <textarea
                                                value={worldConfig.tianjiaoSetting}
                                                onChange={e => setWorldConfig({ ...worldConfig, tianjiaoSetting: e.target.value })}
                                                placeholder="Thời kỳ tranh giành, thiên tài xuất hiện đồng loạt"
                                                className="w-full h-24 bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-3 pr-24 text-wuxia-gold outline-none rounded-md transition-all resize-none font-serif placeholder-wuxia-gold/30"
                                            />
                                            <button
                                                onClick={randomTianjiao}
                                                title="AI ngẫu nhiên thiết lập thiên kiều"
                                                className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-wuxia-gold/15 text-wuxia-gold transition-all duration-200 text-lg hover:scale-110 active:scale-95"
                                            >
                                                <Dices className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </OrnateBorder>
                        </div>
                    )}

                    {/* STEP 2: CHARACTER BASIC */}
                    {step === 1 && (
                        <div className="animate-slide-in max-w-4xl mx-auto">
                            <h3 className="text-lg md:text-xl font-serif font-bold text-wuxia-gold border-b border-wuxia-gold/30 pb-3 mb-6">Hồ sơ hiệp khách</h3>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                                {/* Left: Info */}
                                <div className="md:col-span-2 space-y-6">
                                    <OrnateBorder className="p-6">
                                        <div className="space-y-2">
                                            <span className="text-sm font-medium text-wuxia-gold/70 group-hover:text-wuxia-gold transition-colors block italic">Họ và Tên</span>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={charName}
                                                    onChange={(e) => setCharName(e.target.value)}
                                                    className="w-full bg-transparent border-b border-wuxia-gold/30 py-2 pr-10 focus:border-wuxia-gold outline-none text-wuxia-gold placeholder-wuxia-gold/30 transition-all font-serif italic text-lg"
                                                    placeholder="Nhập danh tính..."
                                                />
                                                <button
                                                    onClick={randomCharName}
                                                    title={`Random tên ${charGender === 'Female' ? 'nữ' : 'nam'}`}
                                                    className="absolute right-0 bottom-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-wuxia-gold/15 text-wuxia-gold transition-all duration-200 text-lg hover:scale-110 active:scale-95"
                                                ><Dices className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </OrnateBorder>

                                    <OrnateBorder className="p-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <span className="text-sm font-medium text-wuxia-gold/70 group-hover:text-wuxia-gold transition-colors block italic">Giới tính</span>
                                                <div className="flex gap-4 p-1 bg-black/40 rounded-lg border border-wuxia-gold/20">
                                                    {['Male', 'Female'].map((gender) => (
                                                        <button
                                                            key={gender}
                                                            onClick={() => setCharGender(gender as 'Male' | 'Female')}
                                                            className={`flex-1 py-2 rounded-md transition-all ${charGender === gender
                                                                ? 'bg-wuxia-gold/20 text-wuxia-gold border border-wuxia-gold/50 shadow-[0_0_10px_rgba(230,200,110,0.3)]'
                                                                : 'text-wuxia-gold/40 hover:text-wuxia-gold/70'
                                                                }`}
                                                        >
                                                            {gender === 'Male' ? 'Nam' : 'Nữ'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-wuxia-gold/70 font-serif font-bold italic block">Ngày sinh</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <CompactDropdown
                                                        value={birthMonth}
                                                        options={monthOptions}
                                                        suffix="Tháng"
                                                        open={monthOpen}
                                                        onToggle={() => {
                                                            setMonthOpen((prev) => !prev);
                                                            setDayOpen(false);
                                                        }}
                                                        onSelect={(next) => {
                                                            setBirthMonth(next);
                                                            setMonthOpen(false);
                                                        }}
                                                        containerRef={monthRef}
                                                    />
                                                    <CompactDropdown
                                                        value={birthDay}
                                                        options={dayOptions}
                                                        suffix="Ngày"
                                                        open={dayOpen}
                                                        onToggle={() => {
                                                            setDayOpen((prev) => !prev);
                                                            setMonthOpen(false);
                                                        }}
                                                        onSelect={(next) => {
                                                            setBirthDay(next);
                                                            setDayOpen(false);
                                                        }}
                                                        containerRef={dayRef}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </OrnateBorder>

                                    <OrnateBorder className="p-6">
                                        <div className="space-y-2">
                                            <label className="text-sm text-wuxia-gold/70 font-serif font-bold italic block">Tuổi</label>
                                            <input type="number" min={14} max={100} value={charAge} onChange={e => setCharAge(parseInt(e.target.value))} className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-3 text-wuxia-gold outline-none rounded-md transition-all font-serif tracking-wider" />
                                        </div>
                                    </OrnateBorder>

                                    <OrnateBorder className="p-6">
                                        <div className="space-y-2">
                                            <label className="text-sm text-wuxia-gold/70 font-serif font-bold italic block">Ngoại hình</label>
                                            <div className="relative">
                                                <textarea
                                                    value={charAppearance}
                                                    onChange={e => setCharAppearance(e.target.value)}
                                                    placeholder="Tóc đen và mắt đen, đường nét khuôn mặt rõ ràng, trang phục đơn giản và gọn gàng"
                                                    className="w-full h-24 bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-3 pr-24 text-wuxia-gold outline-none rounded-md transition-all resize-none font-serif placeholder-wuxia-gold/30"
                                                />
                                                <button
                                                    onClick={randomAppearance}
                                                    title="AI ngẫu nhiên ngoại hình"
                                                    className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-wuxia-gold/15 text-wuxia-gold transition-all duration-200 text-lg hover:scale-110 active:scale-95"
                                                >
                                                    <Dices className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </OrnateBorder>
                                    <OrnateBorder className="p-6">
                                        <div className="space-y-2">
                                            <label className="text-sm text-wuxia-gold/70 font-serif font-bold italic block">Tính cách</label>
                                            <div className="relative">
                                                <textarea
                                                    value={charPersonality}
                                                    onChange={e => setCharPersonality(e.target.value)}
                                                    placeholder="Chí khí cao vời, coi trọng nghĩa khí..."
                                                    className="w-full h-24 bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-3 pr-24 text-wuxia-gold outline-none rounded-md transition-all resize-none font-serif placeholder-wuxia-gold/30"
                                                />
                                                <button
                                                    onClick={randomPersonality}
                                                    title="AI ngẫu nhiên tính cách"
                                                    className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-wuxia-gold/15 text-wuxia-gold transition-all duration-200 text-lg hover:scale-110 active:scale-95"
                                                >
                                                    <Dices className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </OrnateBorder>
                                </div>

                                {/* Right: Stats */}
                                <div className="md:col-span-3">
                                    <OrnateBorder className="h-full">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-wuxia-gold font-bold text-lg">Thiên bẩm cốt cách</span>
                                            <span className={`text-sm font-mono transition-colors ${remainingPoints > 0 ? 'text-green-400' : 'text-wuxia-gold/40'}`}>Điểm còn lại: {remainingPoints}</span>
                                        </div>
                                        <div className="space-y-4 pt-4 border-t border-wuxia-gold/20">
                                            {Object.entries(stats).map(([key, val]) => (
                                                <div key={key} className="flex items-center justify-between">
                                                    <span className="text-wuxia-gold/70 text-base font-serif w-20">{STAT_LABELS[key] ?? key}</span>
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => handleStatChange(key as any, -1)} className="w-8 h-8 bg-black/60 border border-wuxia-gold/20 text-wuxia-gold/50 hover:text-wuxia-gold hover:border-wuxia-gold rounded-md disabled:opacity-30 transition-all" disabled={(val as number) <= 1}>-</button>
                                                        <span className="w-8 text-center text-wuxia-gold font-serif font-black text-xl shadow-glow-sm">{val}</span>
                                                        <button onClick={() => handleStatChange(key as any, 1)} className="w-8 h-8 bg-black/60 border border-wuxia-gold/20 text-wuxia-gold/50 hover:text-wuxia-gold hover:border-wuxia-gold rounded-md disabled:opacity-30 transition-all" disabled={remainingPoints <= 0}>+</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </OrnateBorder>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: BACKGROUNDS */}
                    {step === 2 && (
                        <div className="space-y-8 animate-slide-in max-w-5xl mx-auto">
                            <OrnateBorder className="p-6">
                                <div className="flex justify-between items-center border-b border-wuxia-gold/30 pb-3 mb-4">
                                    <h3 className="text-xl font-serif font-bold text-wuxia-gold">Thân thế xuất thân (Chọn một)</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => triggerGacha('bg', gachaBackground)}
                                            title="Gacha ngẫu nhiên thân thế"
                                            className={`flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full border transition-all duration-200 active:scale-90 hover:scale-105 ${gachaFlash === 'bg' ? 'border-wuxia-gold bg-wuxia-gold/20 text-wuxia-gold animate-gacha-spin' : 'border-wuxia-gold/30 hover:border-wuxia-gold/70 bg-wuxia-gold/5 hover:bg-wuxia-gold/15 text-wuxia-gold/70 hover:text-wuxia-gold'}`}
                                        >
                                            <span><Dices className="w-3.5 h-3.5" /></span><span>Gacha</span>
                                        </button>
                                        <button onClick={() => setShowCustomBackground(!showCustomBackground)} className="text-xs text-wuxia-gold hover:underline font-medium">+ Thân thế tùy chỉnh</button>
                                    </div>
                                </div>
                                {showCustomBackground && (
                                    <div className="bg-black/40 border border-wuxia-gold/30 p-4 mb-4 rounded-lg space-y-3 shadow-inner shadow-black/40">
                                        <input
                                            placeholder="Tên thân thế (VD: Thái tử phủ Giang Nam)"
                                            value={customBackground.name}
                                            onChange={e => setCustomBackground({ ...customBackground, name: e.target.value })}
                                            className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-2 text-xs text-wuxia-gold outline-none rounded-md transition-all font-serif"
                                        />
                                        <input
                                            placeholder="Mô tả thân thế"
                                            value={customBackground.description}
                                            onChange={e => setCustomBackground({ ...customBackground, description: e.target.value })}
                                            className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-2 text-xs text-wuxia-gold/80 outline-none rounded-md transition-all font-serif"
                                        />
                                        <input
                                            placeholder="Hiệu ứng thân thế"
                                            value={customBackground.effect}
                                            onChange={e => setCustomBackground({ ...customBackground, effect: e.target.value })}
                                            className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-2 text-xs text-wuxia-gold outline-none rounded-md transition-all font-serif italic"
                                        />
                                        <GameButton onClick={addCustomBackground} variant="secondary" className="w-full py-1 text-xs">Lưu và dùng thân thế tùy chỉnh</GameButton>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {allBackgroundOptions.map((bg, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedBackground(bg)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${selectedBackground.name === bg.name
                                                ? 'border-wuxia-gold bg-wuxia-gold/10 shadow-lg shadow-wuxia-gold/10'
                                                : 'border-wuxia-gold/10 bg-transparent hover:border-wuxia-gold/30'
                                                }`}
                                        >
                                            <div className={`font-bold text-sm font-serif ${selectedBackground.name === bg.name ? 'text-wuxia-gold' : 'text-wuxia-gold/50'}`}>
                                                {bg.name}
                                                {!PresetBackground.some(p => p.name === bg.name) ? ' (Tùy chỉnh)' : ''}
                                            </div>
                                            <div className="text-xs text-wuxia-gold/40 mt-1 line-clamp-2 italic">{bg.description}</div>
                                            <div className="text-xs text-wuxia-gold/80 mt-2 pt-2 border-t border-wuxia-gold/10 font-mono">{bg.effect}</div>
                                        </div>
                                    ))}
                                </div>
                            </OrnateBorder>
                        </div>
                    )}

                    {/* STEP 4: TALENTS (Point-based system) */}
                    {step === 3 && (() => {
                        const debuffTalents = allTalentOptions.filter(t => DEBUFF_RANKS.includes(t.rank));
                        const buffTalents = allTalentOptions.filter(t => BUFF_RANKS.includes(t.rank));
                        const filteredBuffs = talentFilter === 'all' ? buffTalents : buffTalents.filter(t => t.rank === talentFilter);
                        return (
                        <div className="space-y-6 animate-slide-in max-w-5xl mx-auto">
                            {/* Point Counter */}
                            <div className="flex items-center justify-center gap-6 py-3 px-6 bg-black/60 border border-wuxia-gold/30 rounded-xl">
                                <div className="text-center">
                                    <div className="text-[10px] text-wuxia-gold/50 uppercase tracking-widest">Điểm cơ bản</div>
                                    <div className="text-xl font-bold text-wuxia-gold font-mono">{BASE_TALENT_POINTS}</div>
                                </div>
                                <div className="text-wuxia-gold/30 text-lg">+</div>
                                <div className="text-center">
                                    <div className="text-[10px] text-red-400/70 uppercase tracking-widest">Từ debuff</div>
                                    <div className="text-xl font-bold text-red-400 font-mono">+{debuffPoints}</div>
                                </div>
                                <div className="text-wuxia-gold/30 text-lg">=</div>
                                <div className="text-center">
                                    <div className="text-[10px] text-wuxia-gold/50 uppercase tracking-widest">Tổng</div>
                                    <div className="text-xl font-bold text-wuxia-gold font-mono">{totalTalentPoints}</div>
                                </div>
                                <div className="text-wuxia-gold/30 text-lg">−</div>
                                <div className="text-center">
                                    <div className="text-[10px] text-blue-400/70 uppercase tracking-widest">Đã dùng</div>
                                    <div className="text-xl font-bold text-blue-400 font-mono">{spentTalentPoints}</div>
                                </div>
                                <div className="text-wuxia-gold/30 text-lg">=</div>
                                <div className="text-center">
                                    <div className="text-[10px] text-emerald-400/70 uppercase tracking-widest">Còn lại</div>
                                    <div className={`text-2xl font-bold font-mono ${remainingTalentPoints > 0 ? 'text-emerald-400' : remainingTalentPoints === 0 ? 'text-wuxia-gold' : 'text-red-500'}`}>{remainingTalentPoints}</div>
                                </div>
                            </div>

                            {/* Debuff Section (Mandatory) */}
                            <OrnateBorder className="p-5">
                                <div className="flex justify-between items-center border-b border-red-500/30 pb-3 mb-4">
                                    <h3 className="text-lg font-serif font-bold text-red-400 flex items-center gap-2">
                                        <span>☠</span> Debuff bắt buộc <span className="text-[10px] font-normal text-red-400/60">(chọn ít nhất 1)</span>
                                    </h3>
                                    {!hasDebuff && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 animate-pulse">⚠ Chưa chọn debuff</span>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {debuffTalents.map((t, idx) => {
                                        const isSelected = !!selectedTalents.find(x => x.name === t.name);
                                        const rc = RANK_COLORS[t.rank];
                                        return (
                                            <div
                                                key={`debuff-${idx}`}
                                                onClick={() => toggleTalent(t)}
                                                className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 ${isSelected
                                                    ? `${rc.border} ${rc.bg} shadow-lg ${rc.glow}`
                                                    : 'border-white/10 bg-transparent hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className={`font-bold text-sm font-serif ${isSelected ? rc.text : 'text-gray-400'}`}>{t.name}</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${rc.badge}`}>{t.rank}</span>
                                                        <span className="text-[10px] font-mono font-bold text-emerald-400">+{Math.abs(t.cost)}đ</span>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] text-gray-500 mt-1 line-clamp-1 italic">{t.description}</div>
                                                <div className={`text-[11px] mt-1.5 pt-1.5 border-t border-white/5 font-mono ${isSelected ? rc.text : 'text-gray-500'}`}>{t.effect}</div>
                                                {isSelected && <div className="text-[9px] text-emerald-400 mt-1 font-mono">✓ Đã chọn</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </OrnateBorder>

                            {/* Buff Talents Section */}
                            <OrnateBorder className="p-5">
                                <div className="flex justify-between items-center border-b border-wuxia-gold/30 pb-3 mb-4">
                                    <h3 className="text-lg font-serif font-bold text-wuxia-gold flex items-center gap-2">
                                        <span>✦</span> Thiên bẩm
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => triggerGacha('talent', gachaTalent)}
                                            disabled={remainingTalentPoints <= 0}
                                            title={remainingTalentPoints <= 0 ? 'Hết điểm' : 'Gacha ngẫu nhiên thiên bẩm'}
                                            className={`flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full border transition-all duration-200 active:scale-90 ${remainingTalentPoints <= 0 ? 'border-gray-600 text-gray-600 cursor-not-allowed opacity-50' : gachaFlash === 'talent' ? 'border-wuxia-gold bg-wuxia-gold/20 text-wuxia-gold animate-gacha-spin' : 'hover:scale-105 border-wuxia-gold/30 hover:border-wuxia-gold/70 bg-wuxia-gold/5 hover:bg-wuxia-gold/15 text-wuxia-gold/70 hover:text-wuxia-gold'}`}
                                        >
                                            <span><Dices className="w-3.5 h-3.5" /></span><span>Gacha</span>
                                        </button>
                                        <button onClick={() => setShowCustomTalent(!showCustomTalent)} className="text-xs text-wuxia-gold hover:underline font-medium">+ Tùy chỉnh</button>
                                    </div>
                                </div>

                                {showCustomTalent && (
                                    <div className="bg-black/40 border border-wuxia-gold/30 p-4 mb-4 rounded-lg space-y-3 shadow-inner shadow-black/40">
                                        <div className="flex gap-2">
                                            <input placeholder="Tên thiên bẩm" value={customTalent.name} onChange={e => setCustomTalent({ ...customTalent, name: e.target.value })} className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-2 text-xs text-wuxia-gold outline-none rounded-md transition-all flex-1 font-serif" />
                                            <input placeholder="Hiệu ứng" value={customTalent.effect} onChange={e => setCustomTalent({ ...customTalent, effect: e.target.value })} className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-2 text-xs text-wuxia-gold outline-none rounded-md transition-all flex-1 font-serif italic" />
                                        </div>
                                        <input placeholder="Mô tả" value={customTalent.description} onChange={e => setCustomTalent({ ...customTalent, description: e.target.value })} className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-2 text-xs text-wuxia-gold/80 outline-none rounded-md transition-all font-serif" />
                                        <div className="flex gap-2 items-center">
                                            <select value={customTalent.rank} onChange={e => { const r = e.target.value as TalentRank; setCustomTalent({ ...customTalent, rank: r, cost: r === 'Huyền thoại' ? 5 : r === 'Sử Thi' ? 4 : r === 'Hiếm' ? 3 : 2 }); }} className="bg-black border border-wuxia-gold/20 text-wuxia-gold text-xs p-2 rounded-md outline-none">
                                                <option value="Huyền thoại">Huyền thoại (5đ)</option>
                                                <option value="Sử Thi">Sử Thi (4đ)</option>
                                                <option value="Hiếm">Hiếm (3đ)</option>
                                                <option value="Thường">Thường (2đ)</option>
                                            </select>
                                            <GameButton onClick={addCustomTalent} variant="secondary" className="flex-1 py-1 text-xs">Thêm</GameButton>
                                        </div>
                                    </div>
                                )}

                                {/* Filter tabs */}
                                <div className="flex gap-1.5 mb-4 flex-wrap">
                                    <button onClick={() => setTalentFilter('all')} className={`text-[11px] px-3 py-1 rounded-full border transition-all ${talentFilter === 'all' ? 'border-wuxia-gold bg-wuxia-gold/15 text-wuxia-gold' : 'border-white/10 text-gray-500 hover:text-gray-300'}`}>Tất cả</button>
                                    {BUFF_RANKS.map(rank => {
                                        const rc = RANK_COLORS[rank];
                                        const count = buffTalents.filter(t => t.rank === rank).length;
                                        return (
                                            <button key={rank} onClick={() => setTalentFilter(rank)} className={`text-[11px] px-3 py-1 rounded-full border transition-all ${talentFilter === rank ? `${rc.border} ${rc.bg} ${rc.text}` : 'border-white/10 text-gray-500 hover:text-gray-300'}`}>
                                                {rank} ({count})
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {filteredBuffs.map((t, idx) => {
                                        const isSelected = !!selectedTalents.find(x => x.name === t.name);
                                        const canAfford = t.cost <= remainingTalentPoints;
                                        const rc = RANK_COLORS[t.rank];
                                        return (
                                            <div
                                                key={`buff-${idx}`}
                                                onClick={() => toggleTalent(t)}
                                                className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 ${isSelected
                                                    ? `${rc.border} ${rc.bg} shadow-lg ${rc.glow}`
                                                    : canAfford
                                                        ? 'border-white/10 bg-transparent hover:border-white/20'
                                                        : 'border-white/5 bg-transparent opacity-40 cursor-not-allowed'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className={`font-bold text-sm font-serif truncate ${isSelected ? rc.text : 'text-gray-300'}`}>
                                                        {t.name}
                                                        {!PresetTalent.some(p => p.name === t.name) ? ' ✎' : ''}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${rc.badge}`}>{t.rank}</span>
                                                        <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-wuxia-gold' : 'text-gray-500'}`}>{t.cost}đ</span>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] text-gray-500 mt-1 line-clamp-1 italic">{t.description}</div>
                                                <div className={`text-[11px] mt-1.5 pt-1.5 border-t border-white/5 font-mono ${isSelected ? rc.text : 'text-gray-500'}`}>{t.effect}</div>
                                                {isSelected && <div className="text-[9px] text-emerald-400 mt-1 font-mono">✓ Đã chọn (−{t.cost}đ)</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </OrnateBorder>
                        </div>
                        );
                    })()}

                    {/* STEP 5: CONFIRMATION */}
                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center space-y-8 animate-slide-in h-full">
                            <h3 className="text-2xl font-serif font-bold text-wuxia-gold tracking-widest text-center">Xác nhận phong vân chi lộ</h3>

                            <OrnateBorder className="max-w-lg w-full p-6">
                                <div className="text-sm space-y-3 font-mono text-wuxia-gold/70">
                                    <p>Thế giới: <span className="text-wuxia-gold">{worldConfig.worldName || 'Chưa điền tên'}</span> <span className='text-wuxia-gold/40'>({POWER_LEVEL_OPTIONS.find(o => o.value === worldConfig.powerLevel)?.label ?? worldConfig.powerLevel})</span></p>
                                    <p>Độ khó: <span className="text-wuxia-gold">{DIFFICULTY_OPTIONS.find(o => o.value === worldConfig.difficulty)?.label ?? worldConfig.difficulty}</span></p>
                                    <p>Nhân vật chính: <span className="text-wuxia-gold">{charName.trim() || 'Chưa điền tên'}</span> <span className='text-wuxia-gold/40'>({GENDER_LABELS[charGender] ?? charGender}, {charAge} tuổi)</span></p>
                                    <p>Ngoại hình: <span className="text-wuxia-gold">{charAppearance.trim() || 'Chưa điền'}</span></p>
                                    <p>Tính cách: <span className="text-wuxia-gold">{charPersonality.trim() || 'Chưa điền'}</span></p>
                                    <p>Thân thế: <span className="text-wuxia-gold">{selectedBackground.name}</span></p>
                                    <p>Thiên bẩm: <span className="text-wuxia-gold">{selectedTalents.map(t => t.name).join(', ') || 'Không có'}</span></p>

                                </div>
                            </OrnateBorder>

                            <OrnateBorder className="w-full max-w-lg p-4">
                                <div className="flex items-center justify-between p-4 bg-wuxia-gold/5 rounded-lg border border-wuxia-gold/20 group hover:border-wuxia-gold/40 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-wuxia-gold font-medium font-serif">Truyền phát cốt truyện mở đầu</span>
                                        <span className="text-[11px] text-wuxia-gold/50 italic">Bật chế độ này để hiển thị nội dung tạo mở đầu theo thời gian thực</span>
                                    </div>
                                    <ToggleSwitch
                                        checked={openingStreaming}
                                        onChange={setOpeningStreaming}
                                    />
                                </div>
                            </OrnateBorder>

                            <div className="flex flex-col gap-4 w-full max-w-md">
                                <GameButton onClick={() => { void handleGenerate(); }} variant="primary" className="w-full py-4 text-lg">
                                    Tạo một chạm (Thế giới + Cốt truyện)
                                </GameButton>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Nav */}
                <div className="hidden md:flex h-16 border-t border-wuxia-gold/10 items-center justify-between px-8 bg-black/40">
                    {step > 0 ? (
                        <GameButton onClick={() => setStep(step - 1)} variant="secondary" className="px-6 py-2 border-opacity-50 opacity-80 hover:opacity-100">
                            &larr; Bước trước
                        </GameButton>
                    ) : (
                        <GameButton onClick={onCancel} variant="secondary" className="px-6 py-2 !border-red-500/50 !text-red-500/80 hover:!bg-red-500/10 hover:!text-red-500 flex items-center gap-2">
                            <LogOut className="w-4 h-4" /> Thoát
                        </GameButton>
                    )}


                    {step < STEPS.length - 1 ? (
                        <GameButton onClick={() => setStep(step + 1)} variant="primary" className="px-6 py-2">
                            Bước tiếp &rarr;
                        </GameButton>
                    ) : null}
                </div>
                <div className="md:hidden border-t border-wuxia-gold/10 bg-black/60 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+10px)]">
                    <div className="flex items-center gap-2">
                        {step > 0 ? (
                            <GameButton onClick={() => setStep(step - 1)} variant="secondary" className="flex-1 py-2 text-xs">
                                Bước trước
                            </GameButton>
                        ) : (
                            <GameButton onClick={onCancel} variant="secondary" className="flex-1 py-2 text-xs !border-red-500/50 !text-red-400">
                                Hủy
                            </GameButton>
                        )}
                        {step < STEPS.length - 1 ? (
                            <GameButton onClick={() => setStep(step + 1)} variant="primary" className="flex-1 py-2 text-xs">
                                Bước tiếp
                            </GameButton>
                        ) : (
                            <GameButton onClick={() => { void handleGenerate(); }} variant="primary" className="flex-1 py-2 text-xs">
                                Tạo một chạm
                            </GameButton>
                        )}
                    </div>                </div>

            </div>
        </div>
    );
};

export default NewGameWizard;



