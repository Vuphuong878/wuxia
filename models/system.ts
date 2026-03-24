

// Cấu hình hệ thống - Tách biệt khỏi types.ts

import { CharacterData } from './character';
import { EnvironmentData as EnvironmentInfo } from './environment';
import { NpcStructure } from './social';
import { WorldDataStructure as WorldData } from './world';
import { DetailedSectStructure as DetailedSect } from './sect';
import { QuestStructure as TaskStructure, AppointmentStructure } from './task';
import { StorySystemStructure as StorySystem } from './story';
import { BattleStatus } from './battle';

export interface TavernPreset {
    id: string;
    name: string;
    description: string;
    prompt: string;
    style?: string;
}

export interface TavernSettingsStructure {
    enabled: boolean;
    activePresetId: string | null;
    postProcessing: 'Thêm vào trước prompt thế giới' | 'Thêm vào sau prompt thế giới/cốt truyện gốc' | 'Đè hoàn toàn prompt hệ thống';
    presets: TavernPreset[];
}

export interface ApiConfig {
    id: string;
    name: string;
    provider: ApiProviderType;
    compatibilitySolution?: OpenAICompatibilitySolution;
    protocolOverride?: RequestProtocolOverride;
    baseUrl: string;
    apiKey: string;
    model: string;
    maxTokens?: number;
    temperature?: number;
    createdAt: number;
    updatedAt: number;
}

export type ApiProviderType = 
    | 'gemini' | 'claude' | 'openai' | 'deepseek' 
    | 'mistral' | 'groq' | 'xai' | 'perplexity' 
    | 'cohere' | 'moonshot' | 'openrouter' | 'huggingface' | 'cloudflare' 
    | 'together' | 'fireworks' | 'cerebras' | 'sambanova' 
    | 'openai_compatible' | 'worker';

export type OpenAICompatibilitySolution = 'custom' | 'openrouter' | 'siliconflow' | 'together' | 'groq';

export type RequestProtocolOverride = 'auto' | 'openai' | 'gemini' | 'claude' | 'deepseek';

export type ActiveApiConfig = Pick<ApiConfig, 'id' | 'name' | 'provider' | 'protocolOverride' | 'baseUrl' | 'apiKey' | 'model' | 'maxTokens' | 'temperature' | 'createdAt' | 'updatedAt'>;

export interface FeatureModelPlaceholderConfig {
    mainStoryModel: string;
    recallIndependentModelToggle: boolean;
    recallSilentConfirmation: boolean;
    recallFullContextLimitN: number;
    recallEarliestTriggerTurn: number;

    // Feature Controls
    worldEvolutionIndependentModelToggle: boolean;
    variableCalculationIndependentModelToggle: boolean;
    articleOptimizationIndependentModelToggle: boolean;

    // Model Selection
    recallModel: string;
    worldEvolutionModel: string;
    variableCalculationModel: string;
    articleOptimizationModel: string;

    // Independent API Configs
    recallIndependentApiUrl?: string;
    recallIndependentApiKey?: string;
    worldEvolutionIndependentApiUrl?: string;
    worldEvolutionIndependentApiKey?: string;
    articleOptimizationIndependentApiUrl?: string;
    articleOptimizationIndependentApiKey?: string;

    // Prompts
    articleOptimizationPrompt?: string;
    worldEvolutionPrompt?: string;
}

export interface ApiSettings {
    activeConfigId: string | null;
    configs: ApiConfig[];
    featureModelPlaceholder: FeatureModelPlaceholderConfig;
}

// Aliases for compatibility
export type InterfaceSettingsStructure = ApiSettings;
export type SingleInterfaceConfigStructure = ApiConfig;
export type ApiProviderTypeAlias = ApiProviderType;
export type OpenAICompatibilitySchemeType = OpenAICompatibilitySolution;
export type RequestProtocolOverrideType = RequestProtocolOverride;
export type FunctionalModelPlaceholderConfigStructure = FeatureModelPlaceholderConfig;

export interface AreaVisualSettings {
    enabled: boolean;
    fontFamily: string;
    fontStyle: 'normal' | 'italic';
    color: string;
    fontSize: number;
    lineHeight: number;
}

export type VisualAreaCategory = 'Nội dung chat' | 'Bối cảnh' | 'Đối thoại' | 'Thẻ phán định' | 'Thanh trên' | 'Thanh trái' | 'Thanh phải' | 'Hồ sơ nhân vật';

export interface ImportedFontInfo {
    name: string;
    identifier: string; // Used in font-family
    data: string; // Base64 data
}

export interface VisualSettings {
    timeFormat: 'Truyền thống' | 'Kỹ thuật số';
    backgroundImage?: string; // URL hoặc Base64
    renderLayers: number; // Mặc định 30

    areaSettings?: Partial<Record<VisualAreaCategory, AreaVisualSettings>>;
    importedFonts?: ImportedFontInfo[];
    defaultFontSizeChat?: number;
    defaultLineHeightChat?: number;

    imageGenWorkerUrl?: string;
    textGenWorkerUrl?: string;
}

export type StoryStyleType = 'Tu luyện' | 'Thông thường' | 'Tu la tràng' | 'Thuần ái';

export interface GameSettings {
    bodyLengthRequirement: number; // Độ dài tối thiểu của thân bài logs
    narrativePerspective: 'Ngôi thứ nhất' | 'Ngôi thứ hai' | 'Ngôi thứ ba';
    enableActionOptions: boolean; // Có yêu cầu action_options đầu ra không
    enablePreventSpeaking: boolean; // Chèn prompt NoControl để tránh nói hộ người chơi
    enablePseudoCotInjection: boolean; // Chèn pseudo historical COT trước đầu vào người chơi mới nhất
    enableClaudeMode?: boolean; // Định dạng tin nhắn đặc thù của Claude
    enableDisclaimerOutput: boolean; // Yêu cầu một khối disclaimer riêng ở cuối
    enableTagIntegrityCheck?: boolean; // Kiểm tra tính toàn vẹn của tag trước khi parse
    enableTagAutoFix?: boolean; // Tự động sửa lỗi tag xml
    enableRetryOnParseFail?: boolean; // Tự động thử lại khi parse thất bại
    enableMultiThinking: boolean; // Chuyển đổi prompt COT sang biến thể đa tư duy
    enableExtraPrompt?: boolean; // Bật Prompt bổ sung tùy chỉnh
    enableRealWorldMode?: boolean; // Bật chế độ thực tế
    customRealWorldRules?: string; // Quy tắc thực tế tùy chỉnh
    storyStyle: StoryStyleType; // Phong cách truyện chèn vào context assistant trước COT
    extraPrompt: string; // Prompt tùy chỉnh chèn vào cuối cùng
}



export interface MemoryConfig {
    shortTermThreshold: number; // Mặc định 20
    midTermThreshold: number; // Mặc định 50
    keyNpcImportantMemoryLimitN: number; // Mặc định 20
    shortToMidPrompt: string;
    midToLongPrompt: string;
}

export interface MemorySystem {
    recallArchives: RecallEntry[]; // Chỉ mục hồi ức cấu trúc (dùng cho lưu trữ lịch sử tương tác)
    instantMemory: string[]; // Ký ức từng hiệp gần đây (cũng ghi vào hiệp 0)
    shortTermMemory: string[]; // Các mục ký ức tóm tắt ngắn hạn
    midTermMemory: string[];
    longTermMemory: string[];
}

export interface RecallEntry {
    name: string; // Ví dụ: 【Hồi ức 001】
    summary: string; // Tương ứng ký ức ngắn hạn
    originalText: string; // Tương ứng ký ức tức thời
    turn: number; // Số thứ tự hiệp
    recordedTime: string;
    timestamp: number;
}

export type ThemePreset =
    | 'ink' | 'azure' | 'blood' | 'violet' | 'jade' | 'frost' | 'scarlet' | 'sand'
    // --- 100 Themes ---
    | 't1' | 't2' | 't3' | 't4' | 't5' | 't6' | 't7' | 't8' | 't9' | 't10'
    | 't11' | 't12' | 't13' | 't14' | 't15' | 't16' | 't17' | 't18' | 't19' | 't20'
    | 't21' | 't22' | 't23' | 't24' | 't25' | 't26' | 't27' | 't28' | 't29' | 't30'
    | 't31' | 't32' | 't33' | 't34' | 't35' | 't36' | 't37' | 't38' | 't39' | 't40'
    | 't41' | 't42' | 't43' | 't44' | 't45' | 't46' | 't47' | 't48' | 't49' | 't50'
    | 't51' | 't52' | 't53' | 't54' | 't55' | 't56' | 't57' | 't58' | 't59' | 't60'
    | 't61' | 't62' | 't63' | 't64' | 't65' | 't66' | 't67' | 't68' | 't69' | 't70'
    | 't71' | 't72' | 't73' | 't74' | 't75' | 't76' | 't77' | 't78' | 't79' | 't80'
    | 't81' | 't82' | 't83' | 't84' | 't85' | 't86' | 't87' | 't88' | 't89' | 't90'
    | 't91' | 't92' | 't93' | 't94' | 't95' | 't96' | 't97' | 't98' | 't99' | 't100';

export interface ChatHistory {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    gameTime?: string; // Chuỗi dấu thời gian cấu trúc
    structuredResponse?: any; // Cho phép mở rộng
    rawJson?: string;
    [key: string]: any;
}

export interface SaveMetadata {
    schemaVersion?: number;
    historyItemCount?: number;
    isHistoryTrimmed?: boolean;
    includesPromptSnapshot?: boolean;
    autoSaveSignature?: string;
}

export interface SaveStructure {
    id: number;
    type: 'manual' | 'auto'; // Loại lưu trữ
    timestamp: number;
    description?: string; // Trường cũ, không còn bắt buộc bởi UI
    metadata?: SaveMetadata;
    characterData: CharacterData;
    environmentInfo: EnvironmentInfo;
    history: ChatHistory[];

    // Các trường mở rộng
    social?: NpcStructure[];
    world?: WorldData;
    battle?: BattleStatus;
    playerSect?: DetailedSect;
    taskList?: TaskStructure[];
    appointmentList?: AppointmentStructure[];
    story?: StorySystem;

    // Cài đặt mới trong Save
    memorySystem?: MemorySystem;
    gameSettings?: GameSettings;
    memoryConfig?: MemoryConfig;
    tavernSettings?: TavernSettingsStructure;
    visualConfig?: VisualSettings;


    storyId?: string; // Unique identifier for the playthrough/story part
    // Trạng thái Prompt Snapshot (Quan trọng để bảo tồn world gen)
    promptSnapshot?: any[];
}

export type PromptCategory = string;

export interface PromptStructure {
    id: string;
    title: string;
    content: string;
    type: PromptCategory;
    role?: string;
    enabled: boolean;
    isSystem?: boolean;
}

export interface FestivalStructure {
    id: string;
    name: string;
    month: number;
    day: number;
    description: string;
    effect: string; // Như: tỷ lệ xuất hiện ma quỷ tăng
}
