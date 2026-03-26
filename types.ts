
export * from './models/character';
export * from './models/environment';
export * from './models/system';
import { StoryStyleType } from './models/system';
export * from './models/world';
export * from './models/item';
export * from './models/social';
export * from './models/kungfu';
export * from './models/sect';
export * from './models/task';
export * from './models/story';

export * from './models/battle';

// New types for the advanced chat system

export interface GameLog {
    sender: string;
    text: string;
}

export interface GameResponse {
    logs: GameLog[];
    thinking_pre?: string;
    t_input?: string;
    t_plan?: string;
    t_state?: string;
    t_branch?: string;
    t_precheck?: string;
    t_logcheck?: string;
    t_var?: string;
    t_npc?: string;
    t_cmd?: string;
    t_audit?: string;
    t_fix?: string;
    thinking_post?: string;
    t_mem?: string;
    t_opts?: string;

    shortTerm?: string;
    action_options?: string[]; // Quick actions for the user
    tavern_commands?: any[]; // Commands for the tavern system
    story?: { narrative: string }; // Narrative content
}

// Extend/Override the old history structure
export interface ChatHistory {
    role: 'user' | 'assistant' | 'system';
    content: string; // Keep for backward compat or user input
    structuredResponse?: GameResponse; // The parsed object for assistant
    timestamp: number;
    rawJson?: string; // Raw model text for source view/edit
    gameTime?: string; // Added gameTime
}

export type TalentRank = 'Huyền thoại' | 'Sử Thi' | 'Hiếm' | 'Thường' | 'Cực Hạn' | 'Khắc nghiệt' | 'Khó';

export interface Talent {
    name: string;
    description: string;
    effect: string; // Tác động cụ thể hoặc mô tả logic
    rank: TalentRank;
    cost: number; // 5, 4, 3, 2 for buffs; -3, -2, -1 for debuffs
    conflictsWith?: string[]; // Names of other talents that cannot be selected together
    excludedBackgrounds?: string[]; // Names of backgrounds that cannot select this talent
}

export interface Background {
    name: string;
    description: string;
    effect: string;
    rank: 'Dễ' | 'Bình thường' | 'Khó' | 'Cực khó';
    origin?: string; // Links to map node origins
}

// GameDifficulty settings
export type GameDifficulty = 'relaxed' | 'easy' | 'normal' | 'hard' | 'extreme' | 'custom';

// Configuration for World Generation
export interface WorldGenConfig {
    worldName: string;
    powerLevel: 'Low-tier Martial' | 'Mid-tier Martial' | 'High-tier Martial' | 'Cultivations';
    worldSize: 'A tiny place' | 'Grand Nine Provinces' | 'Endless planes';
    dynastySetting: string; // e.g. "Đại Nhất Thống Vương Triều" or "Chư Hầu Cát Cứ"
    sectDensity: 'Rare' | 'Moderate' | 'Standing like trees';
    tianjiaoSetting: string; // Setting regarding prodigies
    difficulty: GameDifficulty; // Added difficulty
    storyStyle?: StoryStyleType; // New setting
}

export type SaveType = 'manual' | 'auto';
