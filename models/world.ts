// --- Định nghĩa cơ bản ---
import { TransientNode } from '../services/mapService';

// Định dạng thời gian nghiêm ngặt: YYYY:MM:DD:HH:MM (Ví dụ: 2024:03:12:12:00)
export type GameTimeFormat = string;

export interface GameTimeObject {
    Year: number;
    Month: number;
    Day: number;
    Hour: number;
    Minute: number;
}

// --- NPC Hoạt động (Mô phỏng hậu trường) ---

export interface ActiveNpcStructure {
    id: string;
    name: string;
    title: string;
    affiliation: string; // Thế lực thuộc về
    realm: string;

    currentLocation: string;
    status: string;

    currentActionDescription: string;
    actionStartTime: GameTimeFormat;
    actionEstimatedEndTime: GameTimeFormat;

    heldTreasures: string[];
}

// --- Sự kiện thế giới (Vòng đời) ---

export type EventStatus = 'Đang diễn ra' | 'Đã kết thúc';

export interface WorldEventStructure {
    id: string;
    type: 'Thiên tai' | 'Chiến tranh' | 'Kỳ ngộ' | 'Tin đồn' | 'Quyết đấu' | 'Hệ thống';
    title: string;
    content: string;
    location: string;

    startTime: GameTimeFormat;
    estimatedEndTime: GameTimeFormat;

    currentStatus: EventStatus;
    eventResult?: string;

    dissipationTime?: GameTimeFormat;
    isMajorEvent: boolean;

    relatedAffiliations: string[];
    relatedCharacters: string[];
}

// --- Bản đồ và Kiến trúc (Cấu trúc đơn giản hóa) ---

export interface LocationAffiliation {
    majorLocation: string; // Đại địa điểm (e.g., Tỉnh, Bang)
    mediumLocation: string | string[]; // Trung địa điểm (e.g., Thành phố, Phái) - Support array for world map
    minorLocation: string; // Tiểu địa điểm (e.g., Khu vực, Phố)
}

export interface MapStructure {
    id: string;
    name: string;
    coordinate: string;
    description: string;
    avatar?: string;
    affiliation: LocationAffiliation;
    internalBuildings: BuildingStructure[]; // Changed from string[] to BuildingStructure[] for inline data
    cities?: any[]; // Added to support nested city structure from AI
}

export interface BuildingStructure {
    name: string;
    description: string;
    type?: string; 
    affiliation: LocationAffiliation;
}

// --- Camera bản đồ ---
export interface MapCamera {
    x: number;
    y: number;
    zoom: number;
}

// --- Toàn cảnh thế giới ---

export interface WorldDataStructure {
    activeNpcList: ActiveNpcStructure[];
    buildings: BuildingStructure[];

    ongoingEvents: WorldEventStructure[];
    settledEvents: WorldEventStructure[];
    worldHistory: WorldEventStructure[]; // Giang hồ sử sách
    visitedNodeIds: string[]; // Các địa điểm đã khám phá
    metNpcIds: string[]; // Danh sách các NPC đã gặp để tránh lặp lại
    time?: GameTimeObject;
    mapCamera?: MapCamera; // Vị trí và độ phóng đại của bản đồ vô tận
    dynamicNodes?: TransientNode[]; // Các tiểu địa danh ngẫu nhiên (tuổi thọ 100h)
}
