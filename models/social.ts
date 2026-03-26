export type NpcGender = 'Nam' | 'Nữ';

export interface NpcMemory {
    content: string;
    time: string; // Chuỗi dấu thời gian cấu trúc
}

export interface NpcRelationEdge {
    targetName: string;
    relation: string; // Loại quan hệ của NPC hiện tại với đối tượng
    note?: string;
}

// Ghi lại việc nội xạ/sử dụng tử cung
export interface WombRecord {
    date: string;      // Ngày xảy ra
    description: string;      // Mô tả hành vi (ví dụ: "Bị nội xạ tại khách sạn...")
    conceptionCheckDate: string; // Ngày dự kiến kiểm tra thụ thai
}

// Hồ sơ tử cung
export interface WombArchive {
    status: string;       // "Chưa thụ thai", "Đang thụ thai", "Mang thai tháng thứ nhất", v.v.
    cervixStatus: string;   // "Chặt chẽ", "Hơi mở", "Lỏng lẻo"
    ejaculationRecords: WombRecord[];
}

// Cấu trúc trang bị NPC
export interface NpcEquipment {
    mainWeapon?: string;
    subWeapon?: string;
    
    // Thông dụng/Trang phục ngoài
    clothing?: string; // Áo ngoài/Đạo bào/Váy
    accessory?: string;
    
    // Trường dành riêng cho nữ
    underwear_top?: string; // Yếm/Áo lót
    underwear_bottom?: string; // Quần lót
    socks?: string; // Tất/Vòng đùi
    shoes?: string;
}

export interface NpcStructure {
    id: string;
    name: string;
    gender: NpcGender;
    avatar?: string;
    age: number;
    realm: string;
    identity: string;
    isPresent: boolean; // Có ở hiện trường không
    isTeammate: boolean; // Có trong đội người chơi không
    isMainCharacter: boolean;
    favorability: number;
    relationStatus: string; 
    description: string;    
    corePersonalityTraits?: string; // Một câu xác định tính cách chính (dùng cho tiến hóa quan hệ)
    favorabilityBreakthroughCondition?: string; // Điều kiện kích hoạt giai đoạn hảo cảm tiếp theo
    relationBreakthroughCondition?: string; // Điều kiện kích hoạt nâng cấp/chuyển ngoặt trạng thái quan hệ
    socialNetworkVariables?: NpcRelationEdge[]; // Biến mạng lưới quan hệ của nhân vật nữ quan trọng (ai - với ai - quan hệ gì)

    // --- Thuộc tính chiến đấu đội (Chỉ bắt buộc cho đồng đội) ---
    attack?: number; 
    defense?: number;
    lastUpdateTime?: string; // Dấu thời gian/Chuỗi ngày cập nhật dữ liệu

    // --- Thuộc tính sinh tồn (Chỉ bắt buộc cho đồng đội) ---
    currentHp?: number;
    maxHp?: number;
    currentEnergy?: number;
    maxEnergy?: number;

    // --- Trang bị và Vật phẩm (Chỉ bắt buộc cho đồng đội) ---
    currentEquipment?: NpcEquipment;
    inventory?: string[]; // Danh sách tên vật phẩm

    // --- Miêu tả ngoại hình ---
    appearance?: string;
    bodyDescription?: string;
    clothingStyle?: string;

    // --- Miêu tả riêng tư ---
    breastSize?: string;
    nippleColor?: string;
    vaginaColor?: string;
    anusColor?: string;
    buttockSize?: string;
    privateTraits?: string; 
    privateFullDescription?: string;

    // --- Liên quan tử cung/Sản dục (Dành riêng cho nữ) ---
    womb?: WombArchive;

    // --- Trinh tiết và Trạng thái ---
    isVirgin?: boolean;
    firstNightClaimer?: string;
    firstNightTime?: string;
    firstNightDescription?: string;

    // --- Thống kê kinh nghiệm tình dục ---
    count_oral?: number;
    count_breast?: number;
    count_vaginal?: number;
    count_anal?: number;
    count_orgasm?: number;

    // Hệ thống ký ức
    memories: NpcMemory[];
}
