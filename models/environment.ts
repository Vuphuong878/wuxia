// Thông tin môi trường: Thời gian, Thời tiết, Lễ hội
import { GameTimeObject } from './world';

export interface EnvironmentFestivalInfo {
    name: string;
    description: string;
    isToday: boolean;
}

export interface WeatherInfo {
    type: string;
    intensity: number; // 0-100
    description: string;
}

export interface EnvironmentData {
    gameDays: number;
    Year: number;
    Month: number;
    Day: number;
    Hour: number;
    Minute: number;
    
    timeProgressEnabled: boolean;
    weather: WeatherInfo;
    festival: EnvironmentFestivalInfo | null;
    
    currentRegionId: string;
    currentAreaId: string;
    season: string;
    
    majorLocation?: string;
    mediumLocation?: string;
    minorLocation?: string;
    specificLocation?: string;
    envVariables: {
        name: string;
        description: string;
        effect: string;
    } | null;
    time: string;
    karma: number;
    worldTick: number;
}
