import { CharacterData, EnvironmentData, NpcStructure, WorldDataStructure, BattleStatus, StorySystemStructure } from '../types';
import { DetailedSectStructure } from '../models/sect';
import { standardizeSingleNPC, standardizeSocialList, mergeSameNamesNPCList } from '../hooks/useGame/stateTransforms';

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
    "SocialNet": "social",
    "Social": "social",
    "Danh hiệp phả": "social",
    "Đặc điểm tính cách cốt lõi": "corePersonalityTraits",
    "Điều kiện đột phá hảo cảm": "favorabilityBreakthroughCondition",
    "Điều kiện đột phá quan hệ": "relationBreakthroughCondition",
    "Miêu tả ngoại hình": "appearance",
    "Mô tả ngoại hình": "appearance",
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
    "Nhân vật": "character",
    "Đầu": "head",
    "Ngực": "chest",
    "Bụng": "abdomen",
    "Tay trái": "leftArm", "T.Tay": "leftArm", "Tay Trái": "leftArm",
    "Tay phải": "rightArm", "P.Tay": "rightArm", "Tay Phải": "rightArm",
    "Chân trái": "leftLeg", "T.Chân": "leftLeg", "Chân Trái": "leftLeg",
    "Chân phải": "rightLeg", "P.Chân": "rightLeg", "Chân Phải": "rightLeg",
    "Máu hiện tại": "currentHp",
    "Máu tối đa": "maxHp",
    "Trạng thái cơ thể": "Status",
    
    
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
    "id": "id",
    "ID": "id",
    "Id": "id",
    "Tên": "name",
    "name": "name",
    "Name": "name",
    "Mô tả": "description",
    "description": "description",
    "Description": "description",
    "summary": "summary",
    "Summary": "summary",
    "title": "title",
    "Title": "title",
    "index": "index",
    "Index": "index",
    "Loại": "type",
    "Phẩm chất": "quality",
    "Cân nặng": "weight",
    "Trọng lượng": "weight",
    "Không gian chiếm dụng": "spaceOccupied",
    "Giá trị": "value",
    "Độ bền hiện tại": "currentDurability",
    "Độ bền tối đa": "maxDurability",
    "Danh sách từ tố": "attributes",
    "Danh sách thuộc tính": "attributes",
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
    "Thuộc tính vật chứa": "containerProperties",
    "Dung lượng tối đa": "maxCapacity",
    "Không gian hiện tại đã dùng": "currentUsedSpace",
    "Không gian đã dùng hiện tại": "currentUsedSpace",
    "Kích thước tối đa vật phẩm đơn lẻ": "maxSingleItemSize",
    "Kích thước vật phẩm đơn tối đa": "maxSingleItemSize",
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
    "Địa điểm": "location",
    "Địa điểm lớn": "majorLocation",
    "Địa điểm trung": "mediumLocation",
    "Địa điểm nhỏ": "minorLocation",
    "Địa điểm cụ thể": "specificLocation",
    "Vị trí": "location",
    "Location": "location",
    "Thuộc về": "affiliation",
    "Môi trường": "Environment",
    "Biến môi trường": "envVariables",
    "Thế giới": "World",
    "Sự kiện": "ongoingEvents",
    "Sự kiện hiện tại": "ongoingEvents",
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
    "Màu sắc": "color",
    "Vùng": "region",
    "Nghiệp": "karma",
    "Nghiệp lực": "karma",
    "Pháp tắc": "worldTick",
    
    // Additional Story Variations
    "currentchapter": "currentChapter",
    "CurrentChapter": "currentChapter",
    "Currentchapter": "currentChapter",
    "current_chapter": "currentChapter",
    "current chapter": "currentChapter",
    "Story": "story",
    "Plot": "story",
    "Cốt truyện": "story",
    "Diễn biến": "story",
    "Chương hiện tại": "currentChapter",
    "Chương": "currentChapter",
    "NAME": "name",
    "backgroundStory": "backgroundStory",
    "BackgroundStory": "backgroundStory",
    "background_story": "backgroundStory",
    "mainConflict": "mainConflict",
    "MainConflict": "mainConflict",
    "main_conflict": "mainConflict",

    // Battle
    "isInBattle": "isInBattle",
    
    // Story chapter fields
    "Next chapter teaser": "nextChapterPreview",
    "Historical dossiers": "historicalArchives",
    "Recent story planning": "shortTermPlanning",
    "Medium-term story planning": "mediumTermPlanning",
    "Long-term story planning": "longTermPlanning",
    "Pending events": "pendingEvents",
    "Sự kiện chờ": "pendingEvents",
    "Sự kiện sắp tới": "pendingEvents",
    "Dự báo": "pendingEvents",
    "Nhiệm vụ thế giới": "worldQuestList",
    "World quests": "worldQuestList",
    "Hứa hẹn": "promiseList",
    "Promises": "promiseList",
    "Xem trước chương tới": "nextChapterPreview",

    // Story chapter sub-fields
    "Outline": "outline",
    "Background story": "backgroundStory",
    "Main conflict": "mainConflict",
    "End condition": "endConditions",
    "Foreshadowing list": "foreshadowingList",

    // World / Map / Event markers
    "eventsInProgress": "ongoingEvents",
    "eventsinprogress": "ongoingEvents",
    "OngoingEvents": "ongoingEvents",
    "ongoingevents": "ongoingEvents",
    "Thời gian bắt đầu": "startTime",
    "Thời gian dự kiến kết thúc": "estimatedEndTime",
    "startTime": "startTime",
    "expectedEndTime": "estimatedEndTime",
    
    // Category Markers (Empty values to trigger merge logic)
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
    "bodyPartHP": "",
    "bodyParts": "",
    "healthStats": "",
    "bodyStatus": "",
    "Hành trang": "itemList",
    "Inventory": "itemList",
    "Máu": "currentHp",
    "Máu Max": "maxHp",
    "HP": "currentHp",
    "MaxHP": "maxHp",
    "Max HP": "maxHp",
    "hp": "currentHp",
    "maxhp": "maxHp",
    "Trạng thái": "Status",
    "Bộ phận": "",
    "Chi tiết": "",
    "Môn phái": "sect",
    "Nhiệm vụ": "tasks",
    "Đội nhóm": "",
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
    "Nội dung": "content",
    "Hậu quả giữ lời": "fulfillmentConsequence",
    "Hậu quả thất hứa": "failureConsequence",

    "TaskList": "tasks",
    "Task_List": "tasks",
    "task_list": "tasks",
    "Task list": "tasks",
    "Ghi chú nhiệm vụ": "tasks",
    "Danh sách nhiệm vụ": "tasks",

    // NPC status & Action
    "Vị trí hiện tại": "currentLocation",
    "Mô tả hành động": "currentActionDescription",
    "Hành động hiện tại": "currentActionDescription",
    "Chi tiết hành động": "currentActionDescription",
    "Hành động": "currentActionDescription",
    "Kết quả": "eventResult",
    "Kết quả sự kiện": "eventResult",
    "Thời gian kết thúc": "endDate",
};

// Create a normalized map for case-insensitive lookups
const NORMALIZED_SUBKEY_MAP = Object.keys(VIETNAMESE_SUBKEY_MAP).reduce((acc, k) => {
    acc[k.toLowerCase()] = VIETNAMESE_SUBKEY_MAP[k];
    return acc;
}, {} as Record<string, string>);

export const translateObjectKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(translateObjectKeys);

    const result: any = {};
    const BODY_PARTS_KEYS = ['Đầu', 'Ngực', 'Bụng', 'Tay trái', 'Tay phải', 'Chân trái', 'Chân phải', 'T.Tay', 'P.Tay', 'T.Chân', 'P.Chân'];
    const ENGLISH_BODY_PARTS = ['head', 'chest', 'abdomen', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
    
    for (const key in obj) {
        const lowerKey = key.toLowerCase();
        let newKey = VIETNAMESE_SUBKEY_MAP[key] ?? NORMALIZED_SUBKEY_MAP[lowerKey] ?? key;
        
        // Skip empty keys (category markers) and merge their properties
        if (newKey === "" || lowerKey === "bodypart" || lowerKey === "trạng thái bộ phận") {
            const translatedSubObj = translateObjectKeys(obj[key]);
            if (typeof translatedSubObj === 'object' && !Array.isArray(translatedSubObj)) {
                Object.assign(result, translatedSubObj);
            }
            continue;
        }

        let value = translateObjectKeys(obj[key]);

        // Defensive coercion for known string fields that might arrive as objects
        const STRING_ONLY_FIELDS = ['name', 'gender', 'birthDate', 'appearance', 'title', 'realm', 'sectId', 'sectPosition', 'meridianStatus', 'personality', 'currentLocation', 'currentActionDescription', 'background'];
        if (STRING_ONLY_FIELDS.includes(newKey) && typeof value === 'object' && value !== null && !Array.isArray(value)) {
            value = value.text || value.name || value.description || value.content || value.mô_tả || JSON.stringify(value);
        }

        // Defensive extraction for playerBuffs (should be string[])
        if (newKey === 'playerBuffs' && Array.isArray(value)) {
            value = value.map(b => (typeof b === 'object' && b !== null) ? (b.name || b.text || b.mô_tả || JSON.stringify(b)) : b);
        }

        // Defensive array coercion for story lists
        const ARRAY_COERCE_FIELDS = ['endConditions', 'foreshadowingList', 'ongoingEvents', 'maps', 'buildings', 'activeNpcList'];
        if (ARRAY_COERCE_FIELDS.includes(newKey) && value !== null && !Array.isArray(value)) {
            if (typeof value === 'object') {
                // If it's an object like {0: "...", 1: "..."} or just a single object
                const values = Object.values(value);
                value = values.length > 0 ? values : [value];
            } else {
                value = [value];
            }
        }

        // Handle body part flattening
        const isBodyPart = BODY_PARTS_KEYS.some(k => k.toLowerCase() === lowerKey) || ENGLISH_BODY_PARTS.some(k => k.toLowerCase() === lowerKey);
        
        if (isBodyPart && typeof value === 'object' && value !== null && !Array.isArray(value)) {
            const partEng = VIETNAMESE_SUBKEY_MAP[key] ?? NORMALIZED_SUBKEY_MAP[lowerKey] ?? key;
            
            // Collect variations of HP, MaxHP, Status
            const current = value['currentHp'] ?? value['current'] ?? value['Máu'] ?? value['Máu hiện tại'] ?? value['HP'] ?? value['hp'] ?? 
                           value[partEng + 'CurrentHp'] ?? value['Máu_hiện_tại'];
            const max = value['maxHp'] ?? value['max'] ?? value['Máu tối đa'] ?? value['MaxHP'] ?? value['maxhp'] ?? value['HP_max'] ?? 
                       value[partEng + 'MaxHp'] ?? value['Máu_tối_đa'];
            const status = value['Status'] ?? value['status'] ?? value['Trạng thái'] ?? value['bodyStatus'] ?? value['healthStatus'] ??
                          value[partEng + 'Status'] ?? value['Trạng_thái'];
            
            if (current !== undefined) result[partEng + 'CurrentHp'] = current;
            if (max !== undefined) result[partEng + 'MaxHp'] = max;
            if (status !== undefined) result[partEng + 'Status'] = status;
            
            // If it has other properties not flattened, keep the object too
            const knownKeys = ['currentHp', 'maxHp', 'Status', 'current', 'max', 'Máu', 'Máu hiện tại', 'Máu tối đa', 'Trạng thái', 'HP', 'MaxHP', 'hp', 'maxhp'];
            if (Object.keys(value).some(k => !knownKeys.map(kk => kk.toLowerCase()).includes(k.toLowerCase()))) {
                result[partEng] = value;
            }
        } else {
            result[newKey] = value;
        }
    }
    
    // Special handling for events: map 'name' to 'title' if 'title' is missing
    if (result.name && !result.title) {
        result.title = result.name;
    }

    return result;
};

export function mergeStoryObjects(oldStory: any, newStory: any) {
    const result = { ...(oldStory || {}), ...(newStory || {}) };
    
    // Deep merge currentChapter
    if (oldStory?.currentChapter || newStory?.currentChapter) {
        result.currentChapter = {
            ...(oldStory?.currentChapter || {}),
            ...(newStory?.currentChapter || {})
        };
    }
    
    // Deep merge nextChapterPreview
    if (oldStory?.nextChapterPreview || newStory?.nextChapterPreview) {
        result.nextChapterPreview = {
            ...(oldStory?.nextChapterPreview || {}),
            ...(newStory?.nextChapterPreview || {})
        };
    }
    
    return result;
}

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

    // Determine target root
    let targetObj: any = null;
    let path = "";

    if (!key || typeof key !== 'string') return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };

    const lowerKey = key.toLowerCase();
    
    if (lowerKey.startsWith("gamestate.character") || lowerKey.startsWith("gamestate.role") || lowerKey.startsWith("gamestate.kungfu") || lowerKey.startsWith("gamestate.inventory") || lowerKey.startsWith("gamestate.equipment")) {
        targetObj = newChar;
        const charPrefixMatch = key.match(/^gameState\.([a-zA-Z]+)(\[\d+\])?\.?(.*)/i);
        const rootSegment = charPrefixMatch?.[1].toLowerCase() || '';
        const charBracket = charPrefixMatch?.[2] || '';
        path = charPrefixMatch?.[3] || '';
        
        if (rootSegment === "kungfu") path = "kungfuList" + charBracket + (path ? "." + path : "");
        else if (rootSegment === "inventory") path = "itemList" + charBracket + (path ? "." + path : "");
        else if (rootSegment === "equipment") path = "equipment" + (path ? "." + path : "");
        
        if (rootSegment === "character" || rootSegment === "role") {
            if (!path && normalizedAction === 'set') {
                const translatedValue = translateObjectKeys(value);
                // Robust merging for root-level character updates
                if (typeof translatedValue === 'object' && !Array.isArray(translatedValue)) {
                    newChar = { ...newChar, ...translatedValue };
                } else {
                    newChar = translatedValue;
                }
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
        }
    } else if (lowerKey.startsWith("gamestate.environment")) {
        targetObj = newEnv;
        path = key.replace(/^gameState\.Environment\.?/i, "");
        if (!path && normalizedAction === 'set') {
            const translatedValue = translateObjectKeys(value);
            // Merge instead of simple override if it's an object
            if (typeof translatedValue === 'object' && !Array.isArray(translatedValue)) {
                newEnv = { ...newEnv, ...translatedValue };
            } else {
                newEnv = translatedValue;
            }
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }
    } else if (lowerKey.startsWith("gamestate.map") || (lowerKey.startsWith("gamestate.world") && (lowerKey.includes("map") || lowerKey.includes("event") || lowerKey.includes("building") || lowerKey.includes("npc")))) {
        const isWorldData = lowerKey.includes("world") || lowerKey.includes("maps") || lowerKey.includes("event") || lowerKey.includes("building") || lowerKey.includes("npc");
        
        if (isWorldData) {
            targetObj = newWorld;
            const subPath = key.replace(/^gameState\.World\.?/i, "").replace(/^Map\.?/i, "");
            const lSubPath = subPath.toLowerCase();
            
            // Normalize subkeys for world data
            if (lSubPath.startsWith("ongoingevents") || lSubPath.startsWith("eventsinprogress")) {
                const skip = lSubPath.startsWith("ongoingevents") ? 13 : 16;
                path = "ongoingEvents" + subPath.substring(skip);
            }
            else if (lSubPath.startsWith("maps")) path = "maps" + subPath.substring(4);
            else if (lSubPath.startsWith("buildings")) path = "buildings" + subPath.substring(9);
            else if (lSubPath.startsWith("activenpclist")) path = "activeNpcList" + subPath.substring(13);
            else if (!subPath) path = "";
            else path = "maps" + (subPath.startsWith('[') ? subPath : "." + subPath); // Default to maps for legacy "World.MapName"

            // Intercept maps update to synchronize Environment
            if (path.startsWith("maps") && (normalizedAction === 'push' || normalizedAction === 'set')) {
                const mapVal = translateObjectKeys(value);
                if (mapVal && typeof mapVal === 'object' && !Array.isArray(mapVal)) {
                    if (mapVal.name) {
                        newEnv.specificLocation = mapVal.name;
                        newEnv.minorLocation = mapVal.name;
                        if (mapVal.mediumLocation) newEnv.mediumLocation = mapVal.mediumLocation;
                        if (mapVal.majorLocation) newEnv.majorLocation = mapVal.majorLocation;
                        if (typeof mapVal.x === 'number') newEnv.x = mapVal.x;
                        if (typeof mapVal.y === 'number') newEnv.y = mapVal.y;
                        if (mapVal.biomeId) newEnv.biomeId = mapVal.biomeId;
                        if (mapVal.regionId) newEnv.regionId = mapVal.regionId;
                    }
                } else if (typeof mapVal === 'string') {
                    newEnv.specificLocation = mapVal;
                    newEnv.minorLocation = mapVal;
                }
            }
        } else {
            targetObj = newEnv;
            const subPath = key.replace(/^gameState\.(Environment\.|)Map\.?/i, "");
            path = subPath || "mediumLocation";
        }
    } else if (lowerKey.startsWith("gamestate.social")) {
        // Handle bracketed keys by converting them to root merge/push
        // Correctly handles: gameState.Social[npc_id], gameState.Social.NPC_LIST[npc_id], etc.
        const bracketMatch = key.match(/^gameState\.Social\.?(?:NPC_LIST\.?)?\[(.+?)\](?:\.(.+))?/i);
        if (bracketMatch) {
            const bracketValue = bracketMatch[1].trim();
            const subProp = bracketMatch[2] || "";
            const translatedValue = translateObjectKeys(value);
            
            let actualId = bracketValue;
            let actualName = bracketValue;
            
            // If it's a numeric index, resolve to real ID/Name for better merging
            if (/^\d+$/.test(bracketValue)) {
                const index = parseInt(bracketValue);
                if (newSocial[index]) {
                    actualId = newSocial[index].id || actualId;
                    actualName = newSocial[index].name || actualName;
                }
            }
            
            // Create a skeleton NPC to merge
            let npcToMerge: any = { id: actualId };
            // Only include name if it's not just a repeat of the ID/bracket value
            if (actualName && actualName !== actualId && !/^(npc_|char_|role_)/i.test(actualName)) {
                npcToMerge.name = actualName;
            }
            
            if (subProp === "memories" || subProp.toLowerCase().includes("ký ức")) {
                npcToMerge.memories = Array.isArray(translatedValue) ? translatedValue : [translatedValue];
            } else if (subProp) {
                npcToMerge[subProp] = translatedValue;
            } else {
                npcToMerge = { ...npcToMerge, ...translatedValue };
            }
            
            newSocial = mergeSameNamesNPCList([...newSocial, npcToMerge]);
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }

        const isRootSocial = lowerKey === "gamestate.social" || lowerKey === "gamestate.social.npc_list";
        if (isRootSocial) {
            const translatedValue = translateObjectKeys(value);
            if (normalizedAction === 'set') {
                const incomingNpcs = Array.isArray(translatedValue) ? translatedValue : (translatedValue.NPC_LIST || []);
                newSocial = mergeSameNamesNPCList([...newSocial, ...incomingNpcs]);
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
            if (normalizedAction === 'push') {
                const standardized = standardizeSingleNPC(translatedValue, newSocial.length);
                // Also merge if PUSHing an existing NPC (by ID/Name)
                newSocial = mergeSameNamesNPCList([...newSocial, standardized]);
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
        }
        targetObj = { Social: newSocial };
        path = key.replace(/^gameState\.Social\.?(NPC_LIST\.?)?/i, "Social");
        // Maintain legacy path adjustment for nested generic objects if needed
        if (path === "Social" && key.toLowerCase().includes("social.") && !key.toLowerCase().includes("social.npc_list")) {
             path = "Social." + key.substring(key.toLowerCase().indexOf("social.") + 7);
         }
    } else if (lowerKey.startsWith("gamestate.world")) {
        targetObj = newWorld;
        path = key.replace(/^gameState\.World\.?/i, "");
        if (!path && normalizedAction === 'set') {
            newWorld = translateObjectKeys(value);
            if (newWorld.mediumLocation && !newWorld.maps) {
                newWorld.maps = newWorld.mediumLocation;
                delete newWorld.mediumLocation;
            }
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }
    } else if (lowerKey.startsWith("gamestate.battle")) {
        targetObj = newBattle;
        path = key.replace(/^gameState\.Battle\.?/i, "");
        if (!path && normalizedAction === 'set') {
            newBattle = translateObjectKeys(value);
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }
    } else if (lowerKey.startsWith("gamestate.story") || lowerKey.startsWith("gamestate.plot")) {
        targetObj = newStory;
        path = key.replace(/^gameState\.(Story|Plot)\.?/i, "");
        if (!path && normalizedAction === 'set') {
            const translatedValue = translateObjectKeys(value);
            newStory = mergeStoryObjects(newStory, translatedValue);
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }
    } else if (lowerKey.startsWith("gamestate.tasks") || lowerKey.startsWith("gamestate.tasklist") || lowerKey.startsWith("gamestate.task_list")) {
        const isRootKey = lowerKey === "gamestate.tasks" || lowerKey === "gamestate.tasklist" || lowerKey === "gamestate.task_list";
        if (isRootKey) {
            if (normalizedAction === 'set') {
                const translatedValue = translateObjectKeys(value);
                const aiTasks = Array.isArray(translatedValue) ? translatedValue : [translatedValue];
                // Merge by title/name
                const taskMap = new Map();
                newTaskList.forEach(t => {
                    const title = (t.title || t.name || '').trim();
                    if (title) taskMap.set(title, t);
                });
                aiTasks.forEach(t => {
                    const title = (t.title || t.name || '').trim();
                    if (title) {
                        if (taskMap.has(title)) {
                            taskMap.set(title, { ...taskMap.get(title), ...t });
                        } else {
                            taskMap.set(title, t);
                        }
                    }
                });
                newTaskList = Array.from(taskMap.values());
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
            if (normalizedAction === 'push') {
                newTaskList.push(translateObjectKeys(value));
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
        }
        const taskSubPath = key.replace(/^gameState\.(Tasks|TaskList|task_list)\.?/i, "");
        targetObj = { taskList: newTaskList };
        path = "taskList" + (taskSubPath ? "." + taskSubPath : "");
    } else if (lowerKey.startsWith("gamestate.appointments")) {
        const isRootKey = lowerKey === "gamestate.appointments";
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
        const apptSubPath = key.replace(/^gameState\.Appointments\.?/i, "");
        targetObj = { appointmentList: newAppointmentList };
        path = "appointmentList" + (apptSubPath ? "." + apptSubPath : "");
    } else if (lowerKey.startsWith("gamestate.playersect")) {
        const isRootKey = lowerKey === "gamestate.playersect";
        if (isRootKey && normalizedAction === 'set') {
            newPlayerSect = typeof value === 'object' && !Array.isArray(value) ? { ...newPlayerSect, ...translateObjectKeys(value) } : newPlayerSect;
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }
        targetObj = newPlayerSect;
        path = key.replace(/^gameState\.PlayerSect\.?/i, "");
        if (!path && normalizedAction === 'set') {
            const translatedValue = translateObjectKeys(value);
            newPlayerSect = { ...newPlayerSect, ...translatedValue };
            return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
        }
    }

    if (!targetObj || (!path && normalizedAction !== 'set')) return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };

    const parts = path.split('.').filter(p => p !== "").map(p => {
        let partName = p;
        let index: string | number | undefined = undefined;
        
        // Handle parts like "Social[npc_id]", "TaskList[0]" or standalone "[0]"
        if (p.includes('[') && p.includes(']')) {
            const bracketStart = p.indexOf('[');
            const bracketEnd = p.indexOf(']');
            partName = p.substring(0, bracketStart);
            const rawIndex = p.substring(bracketStart + 1, bracketEnd);
            const numericIndex = parseInt(rawIndex);
            
            // If it's digits and matches the whole string, it's a number
            if (/^\d+$/.test(rawIndex.trim())) {
                index = numericIndex;
            } else {
                index = rawIndex.trim(); // Keep as string for ID/Name lookup
            }
        }
        
        // Translate Vietnamese key if mapped
        const pLower = partName.toLowerCase();
        if (partName !== "" && (VIETNAMESE_SUBKEY_MAP[partName] !== undefined || NORMALIZED_SUBKEY_MAP[pLower] !== undefined)) {
            // Context-aware mapping for "Bản đồ"
            if (pLower === "bản đồ" && key.toLowerCase().startsWith("gamestate.world")) {
                partName = "maps";
            } else {
                partName = VIETNAMESE_SUBKEY_MAP[partName] ?? NORMALIZED_SUBKEY_MAP[pLower];
            }
        }
        
        return { name: partName, index };
    }).filter(p => p.name !== "" || p.index !== undefined); // Keep segments that have either a name or an index
    
    // Body part flattening: combine head + CurrentHp -> headCurrentHp
    const BODY_PARTS = ['head', 'chest', 'abdomen', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
    if (parts.length >= 2 && BODY_PARTS.includes(parts[0].name)) {
        const part = parts[0].name;
        const sub = parts[1].name.toLowerCase();
        if (['currenthp', 'current_hp', 'current', 'hp', 'máu', 'máu hiện tại', 'máu_hiện_tại'].includes(sub)) {
            parts.splice(0, 2, { name: part + 'CurrentHp', index: undefined });
        } else if (['maxhp', 'max_hp', 'max', 'max_hp', 'máu tối đa', 'máu_tối_đa', 'maxhp'].includes(sub)) {
            parts.splice(0, 2, { name: part + 'MaxHp', index: undefined });
        } else if (['status', 'trạng thái', 'trạng_thái'].includes(sub)) {
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

    let current = targetObj;
    
    // Iterate to find the parent of the target property
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        
        if (part.index !== undefined) {
             const arr = part.name === "" ? current : current[part.name];
             if (!Array.isArray(arr)) {
                 if (part.name !== "") current[part.name] = [];
                 else {
                     // Can't turn non-array current into array for empty name index
                     return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
                 }
             }
             
             const targetArray = part.name === "" ? current : current[part.name];
             let targetIdx: number;
             if (typeof part.index === 'number') {
                 targetIdx = part.index;
             } else {
                 // ID or Name lookup (flexible)
                 const searchId = String(part.index).toLowerCase();
                 const searchIdx = targetArray.findIndex((item: any) => {
                     if (!item) return false;
                     const id = String(item.id || item.ID || "").toLowerCase();
                     const name = String(item.name || "").toLowerCase();
                     const fullName = String(item.fullName || "").toLowerCase();
                     return id === searchId || ("npc_" + id === searchId) || (searchId.startsWith("npc_") && id === searchId.substring(4)) || name === searchId || fullName === searchId;
                 });
                 targetIdx = searchIdx;
             }
             
             if (targetIdx === -1) {
                  return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
             }
             
             if (!targetArray[targetIdx] || typeof targetArray[targetIdx] !== 'object') {
                 targetArray[targetIdx] = {};
             }
             current = targetArray[targetIdx];
        } else {
             if (part.name === "") continue; // Skip empty names in path
             // Object access
             if (!current[part.name] || typeof current[part.name] !== 'object') current[part.name] = {};
             current = current[part.name];
        }
    }

    const lastPart = parts[parts.length - 1];
    const finalKey = lastPart.name;
    
    // Determine the object to modify
    let finalObj = current;
    let finalIdx: number | undefined = undefined;

    if (lastPart.index !== undefined) {
        const arr = lastPart.name === "" ? current : current[finalKey];
        if (!Array.isArray(arr)) {
            if (lastPart.name !== "") {
                current[finalKey] = [];
                finalObj = current[finalKey];
            } else {
                // Final is an index on current but current is not an array
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
        } else {
            finalObj = arr;
        }
        
        if (typeof lastPart.index === 'number') {
            finalIdx = lastPart.index;
        } else {
            // ID/Name lookup (flexible)
            const searchId = String(lastPart.index).toLowerCase();
            const searchIdx = (finalObj as any[]).findIndex((item: any) => {
                if (!item) return false;
                const id = String(item.id || item.ID || "").toLowerCase();
                const name = String(item.name || "").toLowerCase();
                const fullName = String(item.fullName || "").toLowerCase();
                return id === searchId || ("npc_" + id === searchId) || (searchId.startsWith("npc_") && id === searchId.substring(4)) || name === searchId || fullName === searchId;
            });
            finalIdx = searchIdx;
            if (finalIdx === -1 && normalizedAction === 'push') {
                return { char: newChar, env: newEnv, social: newSocial, world: newWorld, battle: newBattle, story: newStory, taskList: newTaskList, appointmentList: newAppointmentList, playerSect: newPlayerSect };
            }
        }
    }

    const effectiveKey = (finalObj === newChar && finalKey === 'weight') ? 'currentWeight' : finalKey;

    // Status mapping logic
    const isStatusUpdate = lastPart.name.toLowerCase().includes('status') || 
                          lastPart.name.toLowerCase().includes('trạng thái');
    
    let processedValue = translateObjectKeys(value);
    
    if (isStatusUpdate && typeof value === 'string') {
        const s = value.trim();
        if (s === "Đã nhận" || s === "Đang nhận" || s === "Đang thực hiện") processedValue = "Đang thực hiện";
        else if (s === "Hoàn thành") {
            // Tasks use "Đã hoàn thành", appointments might use "Đã thực hiện"
            processedValue = key.toLowerCase().includes('task') ? "Đã hoàn thành" : "Đã thực hiện";
        }
        else if (s === "Thất bại") processedValue = "Thất bại";
        else if (s === "Có thể nộp") processedValue = "Có thể nộp";
    }

    if (normalizedAction === 'set') {
        if (finalIdx !== undefined) finalObj[finalIdx] = processedValue;
        else finalObj[effectiveKey] = processedValue;
    } else if (normalizedAction === 'add') {
        if (finalIdx !== undefined) finalObj[finalIdx] = (finalObj[finalIdx] || 0) + Number(value);
        else finalObj[effectiveKey] = (finalObj[effectiveKey] || 0) + Number(value);
    } else if (normalizedAction === 'sub') {
         if (finalIdx !== undefined) finalObj[finalIdx] = (finalObj[finalIdx] || 0) - Number(value);
         else finalObj[effectiveKey] = (finalObj[effectiveKey] || 0) - Number(value);
    } else if (normalizedAction === 'push') {
        let arrayToPush = (finalIdx !== undefined) ? finalObj[finalIdx] : finalObj[effectiveKey];
        if (!Array.isArray(arrayToPush)) {
            arrayToPush = [];
            if (finalIdx !== undefined) finalObj[finalIdx] = arrayToPush;
            else finalObj[effectiveKey] = arrayToPush;
        }
        
        if ((key.endsWith('.memories') || finalKey === 'memories') && typeof processedValue === 'object' && !processedValue.time) {
             processedValue.time = newEnv.time || `${newEnv.Year || ''}:${String(newEnv.Month || 0).padStart(2,'0')}:${String(newEnv.Day || 0).padStart(2,'0')}:${String(newEnv.Hour || 0).padStart(2,'0')}:00`; 
        }
        
        arrayToPush.push(processedValue);
    } else if (normalizedAction === 'delete') {
        if (finalIdx !== undefined) {
            if (Array.isArray(finalObj) && finalIdx >= 0 && finalIdx < finalObj.length) {
                finalObj.splice(finalIdx, 1);
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
