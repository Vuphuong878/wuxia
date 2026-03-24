import { CharacterData, EnvironmentData, NpcStructure, WorldDataStructure, BattleStatus, StorySystemStructure } from '../types';
import { DetailedSectStructure } from '../models/sect';
import { standardizeSingleNPC, standardizeSocialList } from '../hooks/useGame/stateTransforms';

export const VIETNAMESE_SUBKEY_MAP: Record<string, string> = {
    // Character / Role
    "Danh sách vật phẩm": "itemList",
    "Túi đồ": "itemList",
    "itemList": "itemList",
    "Công pháp danh sách": "kungfuList",
    "kungfuList": "kungfuList",
    "Tiền tệ": "",
    "currency": "money",
    "Trang bị": "equipment",
    "Vàng thỏi": "gold",
    "Vàng": "gold",
    "Bạc": "silver",
    "Đồng": "copper",
    "Đồng tiền": "copper",
    "Ngân lượng tàng trữ": "money",
    "Phụ trọng": "currentWeight",
    "Cân nặng hiện tại": "currentWeight",
    "Tải trọng hiện tại": "currentWeight",
    "Phụ trọng hiện tại": "currentWeight",
    "Tải trọng tối đa": "maxWeight",
    "Phụ trọng tối đa": "maxWeight",
    "Số lượng": "quantity",
    "Cấp": "level",
    "Cấp độ": "level",
    "level": "level",
    "Ngày sinh": "birthDate",
    "Ngoại hình": "appearance",
    "Họ tên đối tượng": "targetName",
    "Quan hệ": "relation",
    "Ghi chú": "note",
    "Tính cách": "personality",
    
    // Body HP - Current
    "Máu đầu hiện tại": "headCurrentHp",
    "Máu ngực hiện tại": "chestCurrentHp",
    "Máu bụng hiện tại": "abdomenCurrentHp",
    "Máu tay trái hiện tại": "leftArmCurrentHp",
    "Máu tay phải hiện tại": "rightArmCurrentHp",
    "Máu chân trái hiện tại": "leftLegCurrentHp",
    "Máu chân phải hiện tại": "rightLegCurrentHp",
    
    // Body HP - Max
    "Máu đầu tối đa": "headMaxHp",
    "Máu ngực tối đa": "chestMaxHp",
    "Máu bụng tối đa": "abdomenMaxHp",
    "Máu tay trái tối đa": "leftArmMaxHp",
    "Máu tay phải tối đa": "rightArmMaxHp",
    "Máu chân trái tối đa": "leftLegMaxHp",
    "Máu chân phải tối đa": "rightLegMaxHp",

    // Survival
    "Năng lượng": "currentEnergy",
    "Năng lượng hiện tại": "currentEnergy",
    "Năng lượng tối đa": "maxEnergy",
    "Tinh lực": "currentEnergy",
    "Tinh lực hiện tại": "currentEnergy",
    "Tinh lực tối đa": "maxEnergy",
    "Độ no": "currentFullness",
    "Độ no hiện tại": "currentFullness",
    "Độ no tối đa": "maxFullness",
    "No bụng": "currentFullness",
    "No bụng hiện tại": "currentFullness",
    "No bụng tối đa": "maxFullness",
    "Độ khát": "currentThirst",
    "Độ khát hiện tại": "currentThirst",
    "Độ khát tối đa": "maxThirst",
    "Khát nước": "currentThirst",
    "Khát nước hiện tại": "currentThirst",
    "Khát nước tối đa": "maxThirst",
    "Trạng thái kinh mạch": "playerBuffs",

    // Attributes
    "Sức mạnh": "strength",
    "str": "strength",
    "Mẫn tiệp": "agility",
    "agi": "agility",
    "Thể chất": "constitution",
    "con": "constitution",
    "Căn cốt": "rootBone",
    "root": "rootBone",
    "Thiên bẩm cốt cách": "rootBone",
    "Ngộ tính": "intelligence",
    "int": "intelligence",
    "Phúc duyên": "luck",
    "luc": "luck",
    "luck": "luck",
    "Tâm tính": "tamTinh",
    "Phòng ngự": "defense",
    "Tấn công": "attack",
    "Tốc độ": "speed",
    "Danh hiệu": "title",
    "Điểm tiềm năng": "potentialPoints",
    "Danh tiếng": "reputation",
    "Cảnh giới": "realm",
    "Tầng cảnh giới": "realmTier",
    "Realm": "realm",
    "Realm tiers": "realmTiers",

    // Experience
    "Kinh nghiệm": "currentExp",
    "Kinh nghiệm hiện tại": "currentExp",
    "exp": "currentExp",
    "Kinh nghiệm thăng cấp": "levelUpExp",
    "levelUpExp": "levelUpExp",

    // Equipment Slots
    "Vũ khí": "mainWeapon",
    "Vũ khí chính": "mainWeapon",
    "Vũ khí phụ": "subWeapon",
    "Áo": "chest",
    "Quần": "legs",
    "Hộ uyển": "hands",
    "Giày": "feet",
    "Lưng": "back",
    "Thắt lưng": "waist",
    "Tọa kỵ": "mount",

    // NPC / Social
    "Họ tên": "name",
    "Giới tính": "gender",
    "Tuổi": "age",
    "Thân phận": "identity",
    "Có mặt hay không": "isPresent",
    "Có phải đồng đội không": "isTeammate",
    "Có phải nhân vật chính không": "isMainCharacter",
    "Độ hảo cảm": "favorability",
    "Hảo cảm": "favorability",
    "Trạng thái quan hệ": "relationStatus",
    "Quan hệ hiện tại": "relationStatus",
    "Giới thiệu": "description",
    "Miêu tả": "description",
    "Ký ức": "memories",
    "Ký ức xã hội": "memories",
    "Social memory": "memories",
    "Biến mạng lưới quan hệ": "socialNetworkVariables",
    "Social network": "socialNetworkVariables",
    "Đặc điểm tính cách cốt lõi": "corePersonalityTraits",
    "Điều kiện đột phá hảo cảm": "favorabilityBreakthroughCondition",
    "Điều kiện đột phá quan hệ": "relationBreakthroughCondition",
    "Miêu tả ngoại hình": "appearanceDescription",
    "Mô tả ngoại hình": "appearanceDescription",
    "Lực tấn công": "attack",
    "Lực phòng ngự": "defense",
    "Miêu tả dáng người": "bodyDescription",
    "Phong cách ăn mặc": "clothingStyle",
    "Kích thước ngực": "breastSize",
    "Ảnh": "avatar",
    "Hình ảnh": "avatar",
    "Avatar": "avatar",
    "Portrait": "avatar",
    "Họa ảnh": "avatar",
    
    
    // Generic Subkeys (for nested AI updates)
    "hiện tại": "current",
    "hiện có": "current",
    "hiện nay": "current",
    "tối đa": "max",
    "cực đại": "max",
    "trần": "max",
    "đầy": "max",
    "giới hạn": "max",
    "Màu đầu vú": "nippleColor",
    "Màu âm hộ": "vaginaColor",
    "Màu hậu môn": "anusColor",
    "Kích thước mông": "buttockSize",
    "Đặc điểm riêng tư": "privateTraits",
    "Mô tả riêng tư tổng quát": "privateFullDescription",
    "Tử cung": "womb",
    "Có phải trinh nữ không": "isVirgin",
    "Người đoạt đêm đầu": "firstNightClaimer",
    "Thời gian đêm đầu": "firstNightTime",
    "Mô tả đêm đầu": "firstNightDescription",
    "Số lần_Miệng": "count_oral",
    "Số lần_Ngực": "count_breast",
    "Số lần_Âm đạo": "count_vaginal",
    "Số lần_Hậu môn": "count_anal",
    "Số lần_Lên đỉnh": "count_orgasm",

    // Items / Kungfu
    "ID": "id",
    "Tên": "name",
    "Mô tả": "description",
    "Loại": "type",
    "Phẩm chất": "quality",
    "Cân nặng": "weight",
    "Trọng lượng": "weight",
    "Không gian chiếm dụng": "spaceOccupied",
    "Giá trị": "value",
    "Độ bền hiện tại": "currentDurability",
    "Độ bền tối đa": "maxDurability",
    "Danh sách từ tố": "attributes",
    "Danh sách thuộc tính": "attributes",   // alias used in some AI outputs
    "ID vật chứa hiện tại": "currentContainerId",
    "Vị trí trang bị hiện tại": "currentEquipSlot",
    "Tầng hiện tại": "currentLevel",
    "Tầng tối đa": "maxLevel",
    "Độ thuần thục hiện tại": "currentProficiency",
    "Kinh nghiệm nâng cấp": "proficiencyToNextLevel",
    "Sát thương cơ bản": "baseDamage",
    "Loại tiêu hao": "consumptionType",
    "Giá trị tiêu hao": "consumptionValue",
    "Nguồn gốc": "source",
    // Container item properties — both Vietnamese variants appear across different prompt files
    "Thuộc tính vật chứa": "containerProperties",
    "Dung lượng tối đa": "maxCapacity",
    "Không gian hiện tại đã dùng": "currentUsedSpace",   // variant used in items.ts
    "Không gian đã dùng hiện tại": "currentUsedSpace",   // variant used in format.ts / cot.ts
    "Kích thước tối đa vật phẩm đơn lẻ": "maxSingleItemSize",   // variant used in items.ts
    "Kích thước vật phẩm đơn tối đa": "maxSingleItemSize",      // variant used in opening.ts
    "Tỷ lệ giảm trọng lượng": "weightReductionRatio",

    // Environment / World
    "Thời gian": "time",
    "Năm": "Year",
    "Tháng": "Month",
    "Ngày": "Day",
    "Giờ": "Hour",
    "Phút": "Minute",
    "Mùa": "season",
    "Bản đồ": "maps",
    "Danh sách bản đồ": "maps",
    "Địa điểm": "mediumLocation",
    "Địa điểm lớn": "majorLocation",
    "Địa điểm trung": "mediumLocation",
    "Địa điểm nhỏ": "minorLocation",
    "Địa điểm cụ thể": "specificLocation",
    "Thuộc về": "affiliation",
    "Môi trường": "Environment",
    "Biến môi trường": "envVariables",
    "Thế giới": "World",
    "Sự kiện": "event",
    "Sự kiện hiện tại": "currentEvent",
    "Sự kiện đang diễn ra": "ongoingEvents",
    "Sự kiện đã kết thúc": "settledEvents",
    "Lịch sử thế giới": "worldHistory",
    "Giang hồ sử sách": "worldHistory",
    "Kiến trúc nội khu": "internalBuildings",
    "Kiến trúc nội bộ": "internalBuildings",
    "Danh sách kiến trúc": "internalBuildings",
    "Kiến trúc": "internalBuildings",
    "Tọa độ": "coordinate",
    "Thời tiết": "weather",
    "Tiêu đề": "title",
    "Kiểu thời tiết": "type",
    "Loại thời tiết": "type",
    "Cường độ": "intensity",
    "Mô tả thời tiết": "description",
    "Ngày kết thúc": "endDate",
    "Ngày chơi": "gameDays",

    // Battle
    "Chiến đấu": "battle",
    "Đang chiến đấu": "isInBattle",
    "Kẻ địch": "enemy",
    "Kẻ thù": "enemy",
    "Tên kẻ địch": "name",
    "Máu kẻ địch": "currentHp",
    "Máu tối đa kẻ địch": "maxHp",

    // Story
    "Cốt truyện": "story",
    "Biến cốt truyện": "storyVariables",
    "Chương hiện tại": "currentChapter",
    "Số thứ tự": "index",
    "Câu chuyện nền": "backgroundStory",
    "Mâu thuẫn chính": "mainConflict",
    "Dùng sách giang hồ": "historicalArchives",
    "Lời kết": "summary",
    "Có đang chiến đấu không": "isInBattle",

    // Story chapter fields
    "Current chapter": "currentChapter",
    "Next chapter teaser": "nextChapterPreview",
    "Historical dossiers": "historicalArchives",
    "Recent story planning": "shortTermPlanning",
    "Medium-term story planning": "mediumTermPlanning",
    "Long-term story planning": "longTermPlanning",
    "Pending events": "pendingEvents",
    "Story variables": "storyVariables",
    "Nhiệm vụ thế giới": "worldQuestList",
    "World quests": "worldQuestList",
    "Hứa hẹn": "promiseList",
    "Promises": "promiseList",
    "Truyện": "story",
    "Truyện hiện tại": "currentChapter",
    "Xem trước chương tới": "nextChapterPreview",
    "Lịch sử giang hồ": "historicalArchives",
    "Dấu mốc lịch sử": "historicalArchives",
    "Ghi chép giang hồ": "historicalArchives",

    // Story chapter sub-fields
    "Title": "title",
    "Outline": "outline",
    "Serial Number": "index",
    "Background story": "backgroundStory",
    "Main conflict": "mainConflict",
    "End condition": "endConditions",
    "Foreshadowing list": "foreshadowingList",
    
    // Category Markers
    "Thuộc tính": "",
    "Thất đạo thuộc tính": "",
    "Thất đạo": "",
    "Sống còn": "",
    "Attributes": "",
    "Survival": "",
    "Stats": "",
    "stats": "",
    "Máu bộ phận": "",
    "Trạng thái bộ phận": "",
    "Hành trang": "itemList",
    "Inventory": "itemList",
    "Máu": "currentHp",
    "Bộ phận": "",
    "Trạng thái": "Status",
    "Chi tiết": "",
    "Môn phái": "sect",
    "Nhiệm vụ": "tasks",
    "Đội nhóm": "",
    "Nhân vật": "character",
    "Thời gian sự kiện": "time",
    "Người giao": "issuer",
    "Phát hành bởi": "issuer",
    "Cảnh giới yêu cầu": "recommendedRealm",
    "Yêu cầu cảnh giới": "recommendedRealm",
    "Thời hạn": "deadline",
    "Trạng thái hiện tại": "currentStatus",
    "Danh sách mục tiêu": "goalList",
    "Mục tiêu": "goalList",
    "Phần thưởng": "rewardDescription",
    "Mô tả phần thưởng": "rewardDescription",
    "Mô tả mục tiêu": "description",
    "Tiến độ hiện tại": "currentProgress",
    "Số lượng yêu cầu": "totalRequired",
    "Số lượng cần thiết": "totalRequired",
    "Hoàn thành": "isCompleted",
    "Đối tượng": "target",
    "Tính chất": "nature",
    "Nội dung hẹn ước": "oathContent",
    "Nội dung": "content", // Changed to generic content
    "Hậu quả giữ lời": "fulfillmentConsequence",
    "Hậu quả thất hứa": "failureConsequence",

    // NPC status & Action
    "Vị trí hiện tại": "currentLocation",
    "Mô tả hành động": "currentActionDescription",
    "Hành động hiện tại": "currentActionDescription",
    "Chi tiết hành động": "currentActionDescription",
    "Hành động": "currentActionDescription",
    "Kết quả": "eventResult",
    "Kết quả sự kiện": "eventResult",
    "Diễn biến": "eventResult",
    "Thời gian bắt đầu": "startTime",
    "Thời gian dự kiến kết thúc": "estimatedEndTime",
    "Thời gian kết thúc": "endDate", // consistent with others
};

export const translateObjectKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(translateObjectKeys);

    const result: any = {};
    const BODY_PARTS_KEYS = ['Đầu', 'Ngực', 'Bụng', 'Tay trái', 'Tay phải', 'Chân trái', 'Chân phải'];
    
    for (const key in obj) {
        let newKey = key;
        if (VIETNAMESE_SUBKEY_MAP[key] !== undefined) {
            newKey = VIETNAMESE_SUBKEY_MAP[key];
        }
        
        // Skip empty keys (category markers) and merge their properties
        if (newKey === "") {
            const translatedSubObj = translateObjectKeys(obj[key]);
            if (typeof translatedSubObj === 'object' && !Array.isArray(translatedSubObj)) {
                Object.assign(result, translatedSubObj);
            } else if (key === "Máu") {
                 // Special case: "Máu": 100 on an item or character
                 // We don't have a direct mapping for just "Máu" yet, usually it's "Máu hiện tại"
            }
            continue;
        }

        const value = translateObjectKeys(obj[key]);

        // Handle body part flattening
        if (BODY_PARTS_KEYS.includes(key) && typeof value === 'object') {
            const partEng = VIETNAMESE_SUBKEY_MAP[key];
            if (value['currentHp'] !== undefined) result[partEng + 'CurrentHp'] = value['currentHp'];
            if (value['maxHp'] !== undefined) result[partEng + 'MaxHp'] = value['maxHp'];
            if (value['Status'] !== undefined) result[partEng + 'Status'] = value['Status'];
            // If it has other properties not flattened, keep the object too just in case
            if (Object.keys(value).some(k => !['currentHp', 'maxHp', 'Status'].includes(k))) {
                result[partEng] = value;
            }
        } else {
            result[newKey] = value;
        }
    }
    return result;
};

export const applyStateCommand = (
    rootCharacter: CharacterData, 
    rootEnv: EnvironmentData, 
    rootSocial: NpcStructure[],
    rootWorld: WorldDataStructure, 
    rootBattle: BattleStatus,
    rootStory: StorySystemStructure, 
    rootTaskList: any[],
    rootAppointmentList: any[],
    rootPlayerSect: DetailedSectStructure,
    key: string, 
    value: any, 
    action: 'SET' | 'ADD' | 'PUSH' | 'DEL' | 'SUB' | 'set' | 'add' | 'push' | 'delete' | 'sub'
): { char: CharacterData, env: EnvironmentData, social: NpcStructure[], world: WorldDataStructure, battle: BattleStatus, story: StorySystemStructure, taskList: any[], appointmentList: any[], playerSect: DetailedSectStructure } => {
    let newChar = JSON.parse(JSON.stringify(rootCharacter));
    let newEnv = JSON.parse(JSON.stringify(rootEnv));
    let newSocial = JSON.parse(JSON.stringify(rootSocial));
    let newWorld = JSON.parse(JSON.stringify(rootWorld));
    let newBattle = JSON.parse(JSON.stringify(rootBattle));
    let newStory = JSON.parse(JSON.stringify(rootStory)); 
    let newTaskList: any[] = JSON.parse(JSON.stringify(rootTaskList));
    let newAppointmentList: any[] = JSON.parse(JSON.stringify(rootAppointmentList));
    let newPlayerSect: DetailedSectStructure = JSON.parse(JSON.stringify(rootPlayerSect));

    // Standardize action
    const normalizedAction = (action.toUpperCase() === 'DEL' || action.toUpperCase() === 'DELETE') ? 'delete' : action.toLowerCase();

    const mergeStoryObjects = (baseStory: any, incoming: any): any => {
        if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) return JSON.parse(JSON.stringify(baseStory));
        const base = (baseStory && typeof baseStory === 'object') ? baseStory : {};
        const next = JSON.parse(JSON.stringify(base));

        if ('currentChapter' in incoming) {
            next.currentChapter = {
                ...(base?.currentChapter || {}),
                ...((incoming?.currentChapter && typeof incoming.currentChapter === 'object') ? incoming.currentChapter : {})
            };
        }
        if ('nextChapterPreview' in incoming) {
            next.nextChapterPreview = {
                ...(base?.nextChapterPreview || {}),
                ...((incoming?.nextChapterPreview && typeof incoming.nextChapterPreview === 'object') ? incoming.nextChapterPreview : {})
            };
        }
        if ('historicalArchives' in incoming) next.historicalArchives = incoming.historicalArchives;
        if ('shortTermPlanning' in incoming) next.shortTermPlanning = incoming.shortTermPlanning;
        if ('mediumTermPlanning' in incoming) next.mediumTermPlanning = incoming.mediumTermPlanning;
        if ('longTermPlanning' in incoming) next.longTermPlanning = incoming.longTermPlanning;
        if ('pendingEvents' in incoming) next.pendingEvents = incoming.pendingEvents;
        if ('storyVariables' in incoming) next.storyVariables = incoming.storyVariables;
        
        // Handle legacy or space-separated keys from AI
        if ('Current chapter' in incoming) {
            next.currentChapter = {
                ...(next.currentChapter || {}),
                ...(incoming['Current chapter'] || {})
            };
        }
        if ('Next chapter teaser' in incoming) {
            next.nextChapterPreview = {
                ...(next.nextChapterPreview || {}),
                ...((incoming['Next chapter teaser'] && typeof incoming['Next chapter teaser'] === 'object') ? incoming['Next chapter teaser'] : {})
            };
        }
        if ('Historical dossiers' in incoming) next.historicalArchives = incoming['Historical dossiers'];
        if ('Recent story planning' in incoming) next.shortTermPlanning = incoming['Recent story planning'];
        if ('Medium-term story planning' in incoming) next.mediumTermPlanning = incoming['Medium-term story planning'];
        if ('Long-term story planning' in incoming) next.longTermPlanning = incoming['Long-term story planning'];
        if ('Pending events' in incoming) next.pendingEvents = incoming['Pending events'];
        if ('Story variables' in incoming) next.storyVariables = incoming['Story variables'];

        Object.keys(incoming).forEach((k) => {
            if (!(k in next) && !['Current chapter', 'Next chapter teaser', 'Historical dossiers', 'Recent story planning', 'Medium-term story planning', 'Long-term story planning', 'Pending events', 'Story variables'].includes(k)) {
                next[k] = incoming[k];
            }
        });
        return next;
    };

    // Determine target root
    let targetObj: any = null;
    let path = "";

    if (!key || typeof key !== 'string') return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };

    if (key.startsWith("gameState.Character") || key.startsWith("gameState.Kungfu") || key.startsWith("gameState.Inventory") || key.startsWith("gameState.Equipment")) {
        targetObj = newChar;
        const charPrefixMatch = key.match(/^gameState\.(Character|Kungfu|Inventory|Equipment)(\[\d+\])?\.?(.*)/);
        const charBracket = charPrefixMatch?.[2] || '';
        path = charPrefixMatch?.[3] || '';
        
        if (key.startsWith("gameState.Kungfu")) path = "kungfuList" + charBracket + (path ? "." + path : "");
        else if (key.startsWith("gameState.Inventory")) path = "itemList" + charBracket + (path ? "." + path : "");
        else if (key.startsWith("gameState.Equipment")) path = "equipment" + (path ? "." + path : "");
        
        if (key === "gameState.Character") {
            if (normalizedAction === 'set') {
                newChar = translateObjectKeys(value);
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
        }

    } else if (key.startsWith("gameState.Environment")) {
        targetObj = newEnv;
        path = key.replace(/^gameState\.Environment\.?/, "");
        if (!path && normalizedAction === 'set') {
            newEnv = translateObjectKeys(value);
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }
    } else if (key.startsWith("gameState.Map") || (key.startsWith("gameState.World") && key.includes("Map"))) {
        const isPushOrArray = Array.isArray(value) || normalizedAction === 'push' || normalizedAction === 'add';
        if (isPushOrArray) {
            targetObj = newWorld;
            const subPath = key.replace(/^gameState\.(World\.|)Map\.?/, "");
            path = subPath ? "maps." + subPath : "maps";
        } else {
            targetObj = newEnv;
            const subPath = key.replace(/^gameState\.(Environment\.|)Map\.?/, "");
            path = subPath || "mediumLocation";
        }
    } else if (key.startsWith("gameState.Social")) {
        if (key === "gameState.Social") {
            const translatedValue = translateObjectKeys(value);
            if (normalizedAction === 'set') {
                newSocial = standardizeSocialList(translatedValue);
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
            if (normalizedAction === 'push') {
                const standardized = standardizeSingleNPC(translatedValue, newSocial.length);
                newSocial.push(standardized);
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
        }
        targetObj = { Social: newSocial };
        path = key.replace(/^gameState\./, "");
    } else if (key.startsWith("gameState.World")) {
        targetObj = newWorld;
        path = key.replace(/^gameState\.World\.?/, "");
        if (!path && normalizedAction === 'set') {
            newWorld = translateObjectKeys(value);
            if (newWorld.mediumLocation && !newWorld.maps) {
                newWorld.maps = newWorld.mediumLocation;
                delete newWorld.mediumLocation;
            }
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }
    } else if (key.startsWith("gameState.Battle")) {
        targetObj = newBattle;
        path = key.replace(/^gameState\.Battle\.?/, "");
        if (!path && normalizedAction === 'set') {
            newBattle = translateObjectKeys(value);
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }
    } else if (key.startsWith("gameState.Story")) {
        targetObj = newStory;
        path = key.replace(/^gameState\.Story\.?/, "");
        if (!path && normalizedAction === 'set') {
            const translatedValue = translateObjectKeys(value);
            newStory = mergeStoryObjects(newStory, translatedValue);
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }
    } else if (key.startsWith("gameState.Tasks")) {
        const isRootKey = key === "gameState.Tasks";
        if (isRootKey) {
            if (normalizedAction === 'set') {
                newTaskList = Array.isArray(value) ? translateObjectKeys(value) : newTaskList;
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
            if (normalizedAction === 'push') {
                newTaskList.push(translateObjectKeys(value));
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
        }
        const taskSubPath = key.replace(/^gameState\.Tasks\.?/, "");
        targetObj = { taskList: newTaskList };
        path = "taskList" + (taskSubPath ? "." + taskSubPath : "");
    } else if (key.startsWith("gameState.Appointments")) {
        const isRootKey = key === "gameState.Appointments";
        if (isRootKey) {
            if (normalizedAction === 'set') {
                newAppointmentList = Array.isArray(value) ? translateObjectKeys(value) : newAppointmentList;
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
            if (normalizedAction === 'push') {
                newAppointmentList.push(translateObjectKeys(value));
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
        }
        const apptSubPath = key.replace(/^gameState\.Appointments\.?/, "");
        targetObj = { appointmentList: newAppointmentList };
        path = "appointmentList" + (apptSubPath ? "." + apptSubPath : "");
    } else if (key.startsWith("gameState.PlayerSect")) {
        const isRootKey = key === "gameState.PlayerSect";
        if (isRootKey && normalizedAction === 'set') {
            newPlayerSect = typeof value === 'object' && !Array.isArray(value) ? { ...newPlayerSect, ...translateObjectKeys(value) } : newPlayerSect;
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }
        targetObj = newPlayerSect;
        path = key.replace(/^gameState\.PlayerSect\.?/, "");
    }

    if (!targetObj || (!path && normalizedAction !== 'set')) return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };

    const parts = path.split('.').filter(p => p !== "").map(p => {
        let partName = p;
        let index: number | undefined = undefined;
        if (p.includes('[') && p.includes(']')) {
            partName = p.split('[')[0];
            index = parseInt(p.split('[')[1].replace(']', ''));
        }
        
        // Translate Vietnamese key if mapped
        if (VIETNAMESE_SUBKEY_MAP[partName] !== undefined) {
            // Context-aware mapping for "Bản đồ"
            const isWorldContext = key.startsWith("gameState.World");
            if (partName === "Bản đồ" && isWorldContext) {
                partName = "maps";
            } else {
                partName = VIETNAMESE_SUBKEY_MAP[partName];
            }
        }
        
        return { name: partName, index };
    }).filter(p => p.name !== ""); // Skip collapsed category segments
    
    // Body part flattening: combine head + CurrentHp -> headCurrentHp
    const BODY_PARTS = ['head', 'chest', 'abdomen', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
    if (parts.length >= 2 && BODY_PARTS.includes(parts[0].name)) {
        const part = parts[0].name;
        const sub = parts[1].name;
        if (sub === 'CurrentHp' || sub === 'currentHp' || sub === 'current') {
            parts.splice(0, 2, { name: part + 'CurrentHp', index: undefined });
        } else if (sub === 'MaxHp' || sub === 'maxHp' || sub === 'max') {
            parts.splice(0, 2, { name: part + 'MaxHp', index: undefined });
        } else if (sub === 'Status' || sub === 'status') {
            parts.splice(0, 2, { name: part + 'Status', index: undefined });
        }
    }

    // Attribute flattening: combine energy/fullness + current/max -> currentEnergy/maxEnergy
    const SURVIVAL_MAP: Record<string, string> = {
        'energy': 'Energy',
        'currentEnergy': 'Energy',
        'fullness': 'Fullness',
        'currentFullness': 'Fullness',
        'thirst': 'Thirst',
        'currentThirst': 'Thirst',
        'exp': 'Exp',
        'currentExp': 'Exp'
    };
    if (parts.length >= 2 && SURVIVAL_MAP[parts[0].name]) {
        const base = SURVIVAL_MAP[parts[0].name];
        const sub = parts[1].name;
        if (sub === 'current') {
            parts.splice(0, 2, { name: 'current' + base, index: undefined });
        } else if (sub === 'max') {
            parts.splice(0, 2, { name: 'max' + base, index: undefined });
        }
    }

    if (parts.length === 0) return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };

    let current = targetObj;
    
    // Iterate to find the parent of the target property
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        
        if (part.index !== undefined) {
             // Array access
             if (!Array.isArray(current[part.name])) current[part.name] = [];
             if (!current[part.name][part.index] || typeof current[part.name][part.index] !== 'object') current[part.name][part.index] = {};
             current = current[part.name][part.index];
        } else {
             // Object access
             if (!current[part.name] || typeof current[part.name] !== 'object') current[part.name] = {};
             current = current[part.name];
        }
    }

    const lastPart = parts[parts.length - 1];
    const finalKey = lastPart.name;
    
    // Determine the object to modify
    let finalObj = current;

    if (lastPart.index !== undefined) {
        if (!Array.isArray(current[finalKey])) current[finalKey] = [];
        finalObj = current[finalKey];
    }

    const effectiveKey = (finalObj === newChar && finalKey === 'weight') ? 'currentWeight' : finalKey;

    if (normalizedAction === 'set') {
        const translatedValue = translateObjectKeys(value);
        if (lastPart.index !== undefined) finalObj[lastPart.index] = translatedValue;
        else finalObj[effectiveKey] = translatedValue;
    } else if (normalizedAction === 'add') {
        if (lastPart.index !== undefined) finalObj[lastPart.index] = (finalObj[lastPart.index] || 0) + Number(value);
        else finalObj[effectiveKey] = (finalObj[effectiveKey] || 0) + Number(value);
    } else if (normalizedAction === 'sub') {
         if (lastPart.index !== undefined) finalObj[lastPart.index] = (finalObj[lastPart.index] || 0) - Number(value);
         else finalObj[effectiveKey] = (finalObj[effectiveKey] || 0) - Number(value);
    } else if (normalizedAction === 'push') {
        let arrayToPush = (lastPart.index !== undefined) ? finalObj[lastPart.index] : finalObj[effectiveKey];
        if (!Array.isArray(arrayToPush)) {
            arrayToPush = [];
            if (lastPart.index !== undefined) finalObj[lastPart.index] = arrayToPush;
            else finalObj[effectiveKey] = arrayToPush;
        }
        
        const translatedValue = translateObjectKeys(value);
        if ((key.endsWith('.memories') || finalKey === 'memories') && typeof translatedValue === 'object' && !translatedValue.time) {
             translatedValue.time = newEnv.time || `${newEnv.Year || ''}:${String(newEnv.Month || 0).padStart(2,'0')}:${String(newEnv.Day || 0).padStart(2,'0')}:${String(newEnv.Hour || 0).padStart(2,'0')}:00`; 
        }
        
        arrayToPush.push(translatedValue);
    } else if (normalizedAction === 'delete') {
        if (lastPart.index !== undefined) {
            if (Array.isArray(finalObj) && lastPart.index >= 0 && lastPart.index < finalObj.length) {
                finalObj.splice(lastPart.index, 1);
            }
        } else if (finalObj && typeof finalObj === 'object' && effectiveKey in finalObj) {
            // Safeguard: Prevent deleting core stats
            const protectedKeys = ['strength', 'agility', 'constitution', 'rootBone', 'intelligence', 'luck', 'tamTinh'];
            if (finalObj === newChar && protectedKeys.includes(effectiveKey)) {
                console.warn(`Prevented deletion of core stat: ${effectiveKey}`);
            } else {
                delete finalObj[effectiveKey];
            }
        }
    }

    return {
        char: newChar,
        env: newEnv,
        social: Array.isArray((targetObj as any).Social) ? (targetObj as any).Social : newSocial,
        world: newWorld,
        battle: newBattle,
        story: newStory,
        taskList: newTaskList,
        appointmentList: newAppointmentList,
        playerSect: newPlayerSect
    };
};
