
import { GameItem } from './item';
import { KungfuStructure } from './kungfu';
import { Talent, Background } from '../types';

// Định nghĩa liên quan đến nhân vật - Tách biệt khỏi types.ts

export interface CharacterEquipment {
    head: string; // ID vật phẩm hoặc Tên
    chest: string;
    legs: string;
    hands: string; // Hộ uyển/Găng tay
    feet: string; // Giày

    mainWeapon: string;
    subWeapon: string;
    hiddenWeapon: string;

    back: string; // Thêm mới: Lưng (Bao tải/Cõng trọng kiếm)
    waist: string; // Thêm mới: Thắt lưng (Túi gấm/Vật trang trí)
    
    mount: string;
}

export interface CharacterMoney {
    gold: number;
    silver: number;
    copper: number;
}

export interface PersonalityStats {
    righteousness: number; // Chính nghĩa
    evil: number; // Tà niệm
    arrogance: number; // Ngạo mạn
    humility: number; // Khiêm tốn
    coldness: number; // Lạnh lùng
    passion: number; // Nhiệt huyết
}

export interface CoreStats {
    strength: number;
    agility: number;
    constitution: number;
    rootBone: number;
    intelligence: number;
    luck: number;
    tamTinh: number; // Mới: Tâm tính
}

export interface CharacterData extends CoreStats {
    id: string;
    name: string;
    gender: 'Nam' | 'Nữ';
    age: number;
    avatar?: string;
    birthDate: string;
    appearance: string;
    
    title: string;
    realm: string;
    
    talentList: Talent[];
    background: Background;

    // Lưu trữ chỉ số thiên bẩm ban đầu
    baseStats: CoreStats;

    sectId: string;
    sectPosition: string;
    sectContribution: number;
    karma: number; // Mới: Nghiệp lực
    money: CharacterMoney;

    currentEnergy: number;
    maxEnergy: number;
    currentFullness: number;
    maxFullness: number;
    currentThirst: number;
    maxThirst: number;
    meridianStatus: string; // Trạng thái kinh mạch (Bình thường, Tổn thương, v.v.)

    currentWeight: number;
    maxWeight: number;

    headCurrentHp: number; headMaxHp: number; headStatus: string;
    chestCurrentHp: number; chestMaxHp: number; chestStatus: string;
    abdomenCurrentHp: number; abdomenMaxHp: number; abdomenStatus: string;
    leftArmCurrentHp: number; leftArmMaxHp: number; leftArmStatus: string;
    rightArmCurrentHp: number; rightArmMaxHp: number; rightArmStatus: string;
    leftLegCurrentHp: number; leftLegMaxHp: number; leftLegStatus: string;
    rightLegCurrentHp: number; rightLegMaxHp: number; rightLegStatus: string;

    equipment: CharacterEquipment;
    itemList: GameItem[];
    kungfuList: KungfuStructure[];

    currentExp: number;
    levelUpExp: number;
    playerBuffs: string[]; 
    personality: string;
    personalityStats: PersonalityStats;
    isDead?: boolean;
}
