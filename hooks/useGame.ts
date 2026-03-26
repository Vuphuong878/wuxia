
import {
    CharacterData,
    EnvironmentData,
    ChatHistory,
    VisualSettings,
    FestivalStructure,
    GameResponse,
    GameSettings,
    MemoryConfig,
    MemorySystem,
    WorldGenConfig,
    WorldDataStructure,
    BattleStatus,
    DetailedSectStructure,
    StorySystemStructure,
    PromptStructure,
    SaveStructure,
    ApiSettings,
    TavernSettingsStructure
} from '../types';
import { useEffect, useRef, useState } from 'react';
import * as dbService from '../services/dbService';
import * as aiService from '../services/aiService';
import { applyStateCommand } from '../utils/stateHelpers';
import { estimateTextTokens } from '../utils/tokenEstimate';
import { useGameState } from './useGameState';
import { normalizeApiSettings, getMainStoryApiConfig, getRecallApiConfig, isApiConfigUsable, hasAnyAiBackend, getCurrentApiConfig } from '../utils/apiConfig';
import type { ApiConfig } from '../types';
import {
    standardizeMemorySystem,
    standardizeMemoryConfig,
    buildRealTimeMemoryEntry,
    buildShortTermMemoryEntry,
    writeFourMemorySegments
} from './useGame/memoryUtils';
import {
    extractMemoryTag,
    constructRecallContext as constructContextForStorylineMemoryRetrieval
} from './useGame/memoryRecall';
import { executeStoryMemoryRecall as executeStoryMemoryRetrieval } from './useGame/recallWorkflow';
import { formatHistoryToScript } from './useGame/historyUtils';
import { normalizeCanonicalGameTime, extractMonthAndDay } from './useGame/timeUtils';
import { buildNpcContext as buildNPCContext } from './useGame/npcContext';
import { constructWorldviewSeedPrompt, constructWorldGenerationContextPrompt as constructWorldGenContextPrompt } from '../prompts/runtime/worldSetup';
import { OPENING_INITIALIZATION_PROMPT as startingInitializationTaskPrompt } from '../prompts/runtime/opening';
import { storyMemoryRecallCOTPrompt as storyMemoryRetrievalCOTPrompt, storyMemoryRecallFormatPrompt as storylineMemoryRetrievalOutputFormatPrompt } from '../prompts/runtime/recall';
import {
    DEFAULT_COT_PROMPT as defaultCOTFakeHistoryMessagePrompt,
    defaultMultipleReasoningCOTHistoryPrompt,
    defaultExtraSystemPrompt
} from '../prompts/runtime/defaults';
import { buildAICharacterDeclarationPrompt } from '../prompts/runtime/roleIdentity';
import { standardizeSingleNPC } from './useGame/stateTransforms';
import {
    constructWordCountRequirementPrompt,
    constructDisclaimerOutputPrompt as constructDisclaimerOutputRequirementsPrompt,
    getOutputProtocolPrompt,
    getActionOptionsPrompt as actionOptionsPrompt
} from '../prompts/runtime/protocolDirectives';
import { constructStorylineStyleAssistantPrompt } from '../prompts/runtime/storyStyles';
import { CoreChainOfThoughtMulti as Core_ChainOfThought_MultiThought } from '../prompts/core/cotMulti';
import { Core_OutputFormat_MultiThought } from '../prompts/core/formatMulti';
import { WritingNoControl as Writing_PreventSpeaking } from '../prompts/writing/noControl';
import { ImageService, ImageCacheService } from '../services/imageService';
import { WORLD_STRUCTURE, FULL_WORLD_SKELETON } from '../data/worldData';
import { WorldDataExporter } from '../services/worldDataExporter';
import { MapService } from '../services/mapService';

import {
    normalizeEnvironment,
    buildFullLocation,
    normalizeInventoryMapping,
    standardizeSocialList,
    normalizeWorldStatus,
    normalizeCombatStatus,
    normalizeStoryStatus,
    normalizeGameSettings,
    mergeSameNamesNPCList
} from './useGame/stateTransforms';


type RoundSnapshot = {
    playerInput: string;
    gameTime: string;
    stateBeforeRollback: {
        character: CharacterData;
        environment: EnvironmentData;
        social: any[];
        world: WorldDataStructure;
        battle: BattleStatus;
        playerSect: DetailedSectStructure;
        taskList: any[];
        appointmentList: any[];
        story: StorySystemStructure;
        memorySystem: MemorySystem;
    };
    historyBeforeRollback: ChatHistory[];
};

type RecentStartingConfig = {
    worldConfig: WorldGenConfig;
    charData: CharacterData;
    openingStreaming: boolean;
};

type FastRestartMode = 'world_only' | 'opening_only' | 'all';

type ContextSegment = {
    id: string;
    title: string;
    category: string;
    order: number;
    content: string;
    tokenEstimate: number;
};

type ContextSnapshot = {
    sections: ContextSegment[];
    fullText: string;
    totalTokens: number;
};

type SendResult = {
    cancelled?: boolean;
    attachedRecallPreview?: string;
    preparedRecallTag?: string;
    needRecallConfirm?: boolean;
    needRerollConfirm?: boolean;
    parseErrorMessage?: string;
    parseErrorDetail?: string;
    errorDetail?: string;
    errorTitle?: string;
    rawContent?: string;
    canShowRaw?: boolean;
};

type MemoryRetrievalProgress = {
    phase: 'start' | 'stream' | 'done' | 'error';
    text?: string;
};

type SendOptions = {
    onRecallProgress?: (progress: MemoryRetrievalProgress) => void;
};


const formatNarrative = (text: string): string => {
    if (!text) return '';
    // Strip JSON blocks
    let cleaned = text.replace(/```json[\s\S]*?```/g, '');
    cleaned = cleaned.replace(/\{[\s\S]*?\}/g, (match) => {
        try {
            JSON.parse(match);
            return '';
        } catch (e) {
            return match;
        }
    });

    // Strip system tags like <thought>, [system], etc.
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    cleaned = cleaned.replace(/\[system\][\s\S]*?\[\/system\]/gi, '');
    cleaned = cleaned.replace(/\[\/?(thought|action|result|internal)\]/gi, '');

    return cleaned.trim();
};

export const useGame = () => {
    const gameState = useGameState();
    const {
        view, setView,
        hasSave, setHasSave,
        character, setCharacter,
        environment, setEnvironment,
        social, setSocial,
        world, setWorld,
        battle, setBattle,
        playerSect, setPlayerSect,
        taskList, setTaskList,
        appointmentList, setAppointmentList,
        story, setStory,
        history, setHistory,
        memorySystem, setMemorySystem,
        loading, setLoading,
        worldEvents, setWorldEvents,
        showSettings, setShowSettings,
        showInventory, setShowInventory,
        showEquipment, setShowEquipment,
        showSocial, setShowSocial,
        showTeam, setShowTeam,
        showKungfu, setShowKungfu,
        showWorld, setShowWorld,
        showMap, setShowMap,
        showSect, setShowSect,
        showTask, setShowTask,
        showAgreement, setShowAgreement,
        showStory, setShowStory,
        showMemory, setShowMemory,
        showSaveLoad, setShowSaveLoad,
        storyId, setStoryId,
        activeTab, setActiveTab,

        isGenerating, setIsGenerating,
        generationStartTime, setGenerationStartTime,
        generationMetadata, setGenerationMetadata,

        apiConfig, setApiConfig,
        visualConfig, setVisualConfig,
        gameConfig, setGameConfig,
        memoryConfig, setMemoryConfig,
        tavernSettings, setTavernSettings,
        prompts, setPrompts,
        festivals, setFestivals,
        currentTheme, setCurrentTheme,
        contextSize, setContextSize,
        scrollRef, abortControllerRef
    } = gameState;

    const currentApi = getCurrentApiConfig(apiConfig);
    const workerUrl = visualConfig.textGenWorkerUrl;
    const roundSnapshotStackRef = useRef<RoundSnapshot[]>([]);
    const recentAutoSaveTimestampRef = useRef<number>(0);
    const recentAutoSaveSignatureRef = useRef<string>('');
    const [repeatableRollCount, setRepeatableRollCount] = useState(0);
    const [recentStartingConfig, setRecentStartingConfig] = useState<RecentStartingConfig | null>(null);

    // Discovery System: Update visited nodes when character moves
    useEffect(() => {
        if (environment.x === undefined || environment.y === undefined) return;

        // Find nodes close to current coordinates
        const nearNodes = MapService.getNodesByProximity(environment.x, environment.y, 50);
        const newlyVisited: string[] = [];

        if (nearNodes.length > 0) {
            const nearest = nearNodes[0];
            if (!world.visitedNodeIds?.includes(nearest.id)) {
                newlyVisited.push(nearest.id);
            }
        }

        // Automatically unlock 10 more "Kiến trúc" (Nodes) as requested
        const allNodes = MapService.getAllNodes();
        const visitedSet = new Set(world.visitedNodeIds || []);
        const unvisited = allNodes.filter(n => !visitedSet.has(n.id) && !newlyVisited.includes(n.id));

        // Pick 10 random unvisited nodes to simulate wide-spread discovery
        const random10 = unvisited
            .sort(() => Math.random() - 0.5)
            .slice(0, 10)
            .map(n => n.id);

        if (newlyVisited.length > 0 || random10.length > 0) {
            setWorld(prev => ({
                ...prev,
                visitedNodeIds: [...(prev.visitedNodeIds || []), ...newlyVisited, ...random10]
            }));
        }
    }, [environment.x, environment.y]);

    // --- Actions ---
    const deepCopy = <T,>(data: T): T => {
        if (data === undefined || data === null) return data;
        try {
            return JSON.parse(JSON.stringify(data)) as T;
        } catch (e) {
            console.error('deepCopy failed', e, data);
            return data;
        }
    };
    const resetAutoSaveStatus = () => {
        recentAutoSaveTimestampRef.current = 0;
        recentAutoSaveSignatureRef.current = '';
    };

    const syncRollCount = () => {
        setRepeatableRollCount(roundSnapshotStackRef.current.length);
    };

    const clearRollSnapshot = () => {
        roundSnapshotStackRef.current = [];
        syncRollCount();
    };

    const pushRollSnapshot = (input: string | RoundSnapshot) => {
        if (typeof input === 'object') {
            roundSnapshotStackRef.current.push(input);
        } else {
            const snapshot: RoundSnapshot = {
                playerInput: input,
                gameTime: normalizeCanonicalGameTime(environment.gameDays > 0 ? (environment as any).time : null) || '1:01:01:06:00',
                stateBeforeRollback: {
                    character: deepCopy(character),
                    environment: deepCopy(environment),
                    social: deepCopy(social),
                    world: deepCopy(world),
                    battle: deepCopy(battle),
                    playerSect: deepCopy(playerSect),
                    taskList: deepCopy(taskList),
                    appointmentList: deepCopy(appointmentList),
                    story: deepCopy(story),
                    memorySystem: deepCopy(memorySystem)
                },
                historyBeforeRollback: deepCopy(history)
            };
            roundSnapshotStackRef.current.push(snapshot);
        }
        if (roundSnapshotStackRef.current.length > 10) {
            roundSnapshotStackRef.current.shift();
        }
        syncRollCount();
    };

    const popRollSnapshot = (): RoundSnapshot | null => {
        const snapshot = roundSnapshotStackRef.current.pop();
        syncRollCount();
        return snapshot || null;
    };

    const rollBackToSnapshot = (snapshot: RoundSnapshot) => {
        setCharacter(snapshot.stateBeforeRollback.character);
        setEnvironment(snapshot.stateBeforeRollback.environment);
        setSocial(snapshot.stateBeforeRollback.social);
        setWorld(snapshot.stateBeforeRollback.world);
        setBattle(snapshot.stateBeforeRollback.battle);
        setPlayerSect(snapshot.stateBeforeRollback.playerSect);
        setTaskList(snapshot.stateBeforeRollback.taskList);
        setAppointmentList(snapshot.stateBeforeRollback.appointmentList);
        setStory(snapshot.stateBeforeRollback.story);
        setMemorySystem(snapshot.stateBeforeRollback.memorySystem);
        setHistory(snapshot.historyBeforeRollback);
    };

    // Liên kết Frontend: Khi thời gian trò chơi khớp với cài đặt lễ hội, tự động đồng bộ "Tên/Giới thiệu/Hiệu ứng" vào môi trường.
    useEffect(() => {
        const md = extractMonthAndDay(environment?.time);
        const matched = md ? festivals.find(f => f.month === md.month && f.day === md.day) : undefined;
        const nextFestival = matched
            ? {
                name: matched.name?.trim() || '',
                introduction: matched.description?.trim() || '',
                effect: matched.effect?.trim() || ''
            }
            : null;

        const currentFestival = environment?.festival || null;
        const sameFestival = !!(
            (!currentFestival && !nextFestival) ||
            (
                currentFestival &&
                nextFestival &&
                (currentFestival.name || '') === (nextFestival.name || '') &&
                (currentFestival.introduction || '') === (nextFestival.introduction || '') &&
                (currentFestival.effect || '') === (nextFestival.effect || '')
            )
        );

        if (sameFestival) return;
        setEnvironment(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                festival: nextFestival
            };
        });
    }, [environment?.time, environment?.festival, festivals, setEnvironment]);

    const standardizeGameSettings = (raw?: Partial<GameSettings> | null): GameSettings => ({
        ...(() => {
            const readBoolean = (value: unknown, fallback: boolean): boolean => (
                typeof value === 'boolean' ? value : fallback
            );
            const fallbackActionOptions = typeof gameConfig?.enableActionOptions === 'boolean' ? gameConfig.enableActionOptions : true;
            const fallbackCot = typeof gameConfig?.enablePseudoCotInjection === 'boolean' ? gameConfig.enablePseudoCotInjection : true;
            const fallbackMulti = typeof gameConfig?.enableMultiThinking === 'boolean' ? gameConfig.enableMultiThinking : false;
            const fallbackNoControl = typeof gameConfig?.enablePreventSpeaking === 'boolean' ? gameConfig.enablePreventSpeaking : true;
            const fallbackDisclaimer = typeof gameConfig?.enableDisclaimerOutput === 'boolean' ? gameConfig.enableDisclaimerOutput : true;
            return {
                enableActionOptions: readBoolean(raw?.enableActionOptions, fallbackActionOptions),
                enablePseudoCotInjection: readBoolean(raw?.enablePseudoCotInjection, fallbackCot),
                enableMultiThinking: readBoolean(raw?.enableMultiThinking, fallbackMulti),
                enablePreventSpeaking: readBoolean(raw?.enablePreventSpeaking, fallbackNoControl),
                enableDisclaimerOutput: readBoolean(raw?.enableDisclaimerOutput, fallbackDisclaimer),
                enableExtraPrompt: readBoolean(raw?.enableExtraPrompt, false),
                enableRealWorldMode: readBoolean(raw?.enableRealWorldMode, false)
            };
        })(),
        bodyLengthRequirement: (() => {
            const candidate = raw?.bodyLengthRequirement as unknown;
            if (typeof candidate === 'number' && Number.isFinite(candidate)) return Math.max(50, Math.floor(candidate));
            if (typeof candidate === 'string') {
                const n = Number(candidate.replace(/[^\d]/g, ''));
                if (Number.isFinite(n) && n > 0) return Math.max(50, Math.floor(n));
            }
            if (typeof gameConfig?.bodyLengthRequirement === 'number' && Number.isFinite(gameConfig.bodyLengthRequirement)) {
                return Math.max(50, Math.floor(gameConfig.bodyLengthRequirement));
            }
            return 450;
        })(),
        narrativePerspective: (raw?.narrativePerspective === 'Ngôi thứ nhất' || raw?.narrativePerspective === 'Ngôi thứ hai' || raw?.narrativePerspective === 'Ngôi thứ ba'
            ? raw.narrativePerspective
            : (gameConfig?.narrativePerspective || 'Ngôi thứ hai')) as 'Ngôi thứ nhất' | 'Ngôi thứ hai' | 'Ngôi thứ ba',
        storyStyle: (raw?.storyStyle === 'Tu luyện' || raw?.storyStyle === 'Thông thường' || raw?.storyStyle === 'Tu la tràng' || raw?.storyStyle === 'Thuần ái'
            ? raw.storyStyle
            : (gameConfig?.storyStyle || 'Thông thường')) as any,
        extraPrompt: typeof raw?.extraPrompt === 'string'
            ? (() => {
                const candidate = raw.extraPrompt;
                const trimmed = candidate.trim();
                if (!trimmed) return defaultExtraSystemPrompt;
                return candidate;
            })()
            : (() => {
                const candidate = typeof gameConfig?.extraPrompt === 'string' ? gameConfig.extraPrompt : defaultExtraSystemPrompt;
                const trimmed = candidate.trim();
                if (!trimmed) return defaultExtraSystemPrompt;
                return candidate;
            })()
    });
    const buildCotDisguisePrompt = (config: GameSettings): string => {
        if (config?.enableMultiThinking === true) {
            return defaultMultipleReasoningCOTHistoryPrompt.trim();
        }
        return defaultCOTFakeHistoryMessagePrompt.trim();
    };
    const getRawAiMessage = (rawText: string): string => (typeof rawText === 'string' ? rawText : '');
    const formatErrorDetails = (error: any): string => {
        if (!error) return 'Unknown error';
        if (typeof error === 'string') return error;
        const lines: string[] = [];
        if (error?.name) lines.push(`Name: ${error.name}`);
        if (typeof error?.status === 'number') lines.push(`Status: ${error.status}`);
        if (typeof error?.message === 'string' && error.message.trim()) {
            lines.push(`Message: ${error.message}`);
        }
        const detail = error?.detail ?? error?.parseDetail;
        if (detail) {
            const detailText = typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2);
            lines.push('Detail:');
            lines.push(detailText);
        }
        if (lines.length > 0) return lines.join('\n');
        try {
            return JSON.stringify(error, null, 2);
        } catch {
            return String(error);
        }
    };
    const extractParseError = (error: any): string => {
        if (!error) return 'The returned content does not comply with the tag protocol.';
        if (typeof error === 'string' && error.trim().length > 0) return error.trim();
        if (typeof error?.parseDetail === 'string' && error.parseDetail.trim().length > 0) {
            return error.parseDetail.trim();
        }
        if (typeof error?.message === 'string' && error.message.trim().length > 0) {
            return error.message.trim();
        }
        return 'The returned content does not comply with the tag protocol.';
    };

    const handleStartNewGameWizard = () => {
        clearRollSnapshot();
        resetAutoSaveStatus();
        setRecentStartingConfig(null);
        setLoading(false);
        setMemorySystem({ recallArchives: [], instantMemory: [], shortTermMemory: [], midTermMemory: [], longTermMemory: [] });
        setHistory([]);
        setWorldEvents([]);
        setView('new_game');
    };

    const createEmptySectStatus = (): DetailedSectStructure => ({
        id: 'none',
        name: 'Chưa gia nhập môn phái',
        description: 'Chưa gia nhập môn phái',
        introduction: 'Hiện tại chưa gia nhập môn phái nào.',
        sectRules: [],
        sectFunds: 0,
        sectResources: 0,
        constructionLevel: 0,
        playerPosition: 'None',
        playerContribution: 0,
        taskList: [],
        exchangeList: [],
        importantMembers: []
    });

    const createPlaceholderSectStatus = (charData: CharacterData): DetailedSectStructure => {
        const hasJoinedSect = typeof charData?.sectId === 'string' && charData.sectId !== 'none';
        if (!hasJoinedSect) return createEmptySectStatus();
        return {
            id: charData.sectId || 'unknown',
            name: '',
            description: '',
            introduction: '',
            sectRules: [],
            sectFunds: 0,
            sectResources: 0,
            constructionLevel: 0,
            playerPosition: charData.sectPosition || 'Member',
            playerContribution: typeof charData.sectContribution === 'number' ? charData.sectContribution : 0,
            taskList: [],
            exchangeList: [],
            importantMembers: []
        };
    };

    const createBlankStartEnvironment = (): EnvironmentData => ({
        majorLocation: '',
        mediumLocation: '',
        minorLocation: '',
        specificLocation: '',
        festival: null,
        weather: { type: '', intensity: 0, description: '' },
        gameDays: 1,
        Year: 2026,
        Month: 3,
        Day: 23,
        Hour: 6,
        Minute: 15,
        timeProgressEnabled: true,
        currentRegionId: '',
        currentAreaId: '',
        season: 'Xuân',
        envVariables: null,
        time: 'Sáng',
        karma: 0,
        worldTick: 0
    });

    const createOpeningBlankWorld = (): WorldDataStructure => {
        const skeleton = WorldDataExporter.transformSkeleton(FULL_WORLD_SKELETON);
        return {
            ...skeleton,
            time: { Year: 2026, Month: 3, Day: 23, Hour: 6, Minute: 15 }
        };
    };

    const standardizeWorldStatus = (raw?: any): WorldDataStructure => {
        const worldData = raw && typeof raw === 'object' ? raw : {};
        const buildings = Array.isArray(worldData.buildings) ? worldData.buildings : [];

        // Data Migration: If the world has 113 or fewer buildings (legacy WORLD_STRUCTURE size),
        // we auto-expand it to the full 3400+ node skeleton.
        if (buildings.length <= 113) {
            console.log(`[useGame] World expansion triggered: migrating from ${buildings.length} nodes to nodes.`);
            const fullSkeleton = WorldDataExporter.transformSkeleton(FULL_WORLD_SKELETON);
            return {
                activeNpcList: Array.isArray(worldData.activeNpcList) ? worldData.activeNpcList : [],
                buildings: fullSkeleton.buildings,
                ongoingEvents: Array.isArray(worldData.ongoingEvents) ? worldData.ongoingEvents : [],
                settledEvents: Array.isArray(worldData.settledEvents) ? worldData.settledEvents : [],
                worldHistory: Array.isArray(worldData.worldHistory) ? worldData.worldHistory : [],
                visitedNodeIds: [],
                metNpcIds: Array.isArray(worldData.metNpcIds) ? worldData.metNpcIds : [],
                time: worldData.time || { Year: 2026, Month: 3, Day: 23, Hour: 6, Minute: 15 }
            };
        }

        return {
            activeNpcList: Array.isArray(worldData.activeNpcList) ? worldData.activeNpcList : [],
            buildings: buildings,
            ongoingEvents: Array.isArray(worldData.ongoingEvents) ? worldData.ongoingEvents : [],
            settledEvents: Array.isArray(worldData.settledEvents) ? worldData.settledEvents : [],
            worldHistory: Array.isArray(worldData.worldHistory) ? worldData.worldHistory : [],
            visitedNodeIds: Array.isArray(worldData.visitedNodeIds) ? worldData.visitedNodeIds : [],
            metNpcIds: Array.isArray(worldData.metNpcIds) ? worldData.metNpcIds : [],
            time: worldData.time || { Year: 2026, Month: 3, Day: 23, Hour: 6, Minute: 15 }
        };
    };

    const createOpeningBlankBattle = (): BattleStatus => ({
        isInBattle: false,
        enemy: null
    });

    const parseStoryTimeValue = (raw?: any): number | null => {
        if (!raw) return null;
        const normalized = normalizeCanonicalGameTime(raw);
        if (!normalized) return null;
        const m = normalized.match(/^(\d{1,6}):(\d{2}):(\d{2}):(\d{2}):(\d{2})$/);
        if (!m) return null;
        const year = Number(m[1]);
        const month = Number(m[2]);
        const day = Number(m[3]);
        const hour = Number(m[4]);
        const minute = Number(m[5]);
        return (((year * 12 + month) * 31 + day) * 24 + hour) * 60 + minute;
    };

    const createBlankOpeningStory = (): StorySystemStructure => ({
        currentChapter: {
            id: 'ch_0',
            index: 1,
            title: 'Mở đầu',
            summary: '',
            backgroundStory: '',
            mainConflict: '',
            endConditions: [],
            foreshadowingList: []
        },
        nextChapterPreview: { title: '', outline: '' },
        historicalArchives: [],
        shortTermPlanning: '',
        mediumTermPlanning: '',
        longTermPlanning: '',
        pendingEvents: [],
        worldQuestList: [],
        promiseList: [],
        storyVariables: {},
        actionCountSinceLastChapter: 0
    });

    const standardizeStoryStatus = (raw?: any): StorySystemStructure => {
        const storyRaw = raw && typeof raw === 'object' ? raw : null;
        const plainText = (value: any): string => (typeof value === 'string' ? value.trim() : '');

        const chapterRaw = storyRaw?.currentChapter;
        const previewRaw = storyRaw?.nextChapterPreview;
        const archivesRaw = storyRaw?.historicalArchives || [];
        const storyVarsRaw = storyRaw?.storyVariables || {};
        const pendingEventsRaw = storyRaw?.pendingEvents || [];
        const worldQuestListRaw = storyRaw?.worldQuestList || storyRaw?.['Nhiệm vụ thế giới'] || [];
        const promiseListRaw = storyRaw?.promiseList || storyRaw?.['Hứa hẹn'] || [];

        const archives = Array.isArray(archivesRaw) ? archivesRaw : [];
        const pendingEvents = Array.isArray(pendingEventsRaw)
            ? pendingEventsRaw
                .map((ev: any) => {
                    if (!ev || typeof ev !== 'object') return null;
                    return {
                        name: plainText(ev?.name),
                        description: plainText(ev?.description),
                        triggerConditionOrTime: plainText(ev?.triggerConditionOrTime),
                        expirationTime: plainText(ev?.expirationTime)
                    };
                })
                .filter(Boolean)
            : [];

        return {
            currentChapter: {
                id: plainText(chapterRaw?.id),
                index: Number(chapterRaw?.index) || 1,
                title: plainText(chapterRaw?.title),
                summary: plainText(chapterRaw?.summary),
                backgroundStory: plainText(chapterRaw?.backgroundStory),
                mainConflict: plainText(chapterRaw?.mainConflict),
                endConditions: (Array.isArray(chapterRaw?.endConditions)
                    ? chapterRaw.endConditions.map((cond: any) => ({
                        type: plainText(cond?.type) as any,
                        description: plainText(cond?.description),
                        targetValue: cond?.targetValue,
                        correspondingVariableKey: plainText(cond?.correspondingVariableKey)
                    }))
                    : []) as any,
                foreshadowingList: Array.isArray(chapterRaw?.foreshadowingList)
                    ? chapterRaw.foreshadowingList
                        .map((item: any) => plainText(item))
                        .filter((item: string) => item.length > 0)
                    : []
            },
            nextChapterPreview: {
                title: plainText(previewRaw?.title),
                outline: plainText(previewRaw?.outline)
            },
            historicalArchives: archives.map((arc: any) => ({
                title: plainText(arc?.title),
                summary: plainText(arc?.summary),
                backgroundStory: plainText(arc?.backgroundStory),
                epilogue: plainText(arc?.epilogue)
            })),
            shortTermPlanning: plainText(storyRaw?.shortTermPlanning),
            mediumTermPlanning: plainText(storyRaw?.mediumTermPlanning),
            longTermPlanning: plainText(storyRaw?.longTermPlanning),
            pendingEvents,
            worldQuestList: Array.isArray(worldQuestListRaw) ? worldQuestListRaw : [],
            promiseList: Array.isArray(promiseListRaw) ? promiseListRaw : [],
            storyVariables: (storyVarsRaw || {}) as Record<string, boolean | number | string>,
            actionCountSinceLastChapter: Number(storyRaw?.actionCountSinceLastChapter) || 0
        };
    };



    const autoClearAfterBattle = (battleLike: any, storyLike?: any): BattleStatus => {
        const battle = normalizeCombatStatus(battleLike);
        const enemy = battle.enemy;
        const variableMarkerEnd =
            storyLike?.storyVariables?.['Is in combat?'] === false ||
            storyLike?.storyVariables?.['Combat ended'] === true ||
            storyLike?.storyVariables?.['Leave combat'] === true;

        const shouldClear =
            battle.isInBattle !== true ||
            !enemy ||
            (typeof enemy?.currentHp === 'number' && enemy.currentHp <= 0) ||
            (typeof enemy?.currentEnergy === 'number' && enemy.currentEnergy <= 0) ||
            variableMarkerEnd;

        if (shouldClear) {
            return {
                isInBattle: false,
                enemy: null
            };
        }

        return battle;
    };


    const createStartingBasicStatus = (charData: CharacterData, _worldConfig: WorldGenConfig) => {
        const hasJoinedSect = typeof charData?.sectId === 'string' && charData.sectId !== 'none';
        const sectState: DetailedSectStructure = createPlaceholderSectStatus(charData);
        const initialTasks: any[] = hasJoinedSect ? [] : [];
        const initialAgreements: any[] = hasJoinedSect ? [] : [];

        return {
            character: deepCopy(charData),
            environment: createBlankStartEnvironment(),
            social: [],
            world: createOpeningBlankWorld(),
            battle: createOpeningBlankBattle(),
            playerSect: sectState,
            taskList: initialTasks,
            appointmentList: initialAgreements,
            story: createBlankOpeningStory()
        };
    };

    const createEmptyMemorySystem = (): MemorySystem => ({
        recallArchives: [],
        instantMemory: [],
        shortTermMemory: [],
        midTermMemory: [],
        longTermMemory: []
    });

    const standardizeAndUpdateState = (gameStateData: any) => {
        if (!gameStateData) return;
        if (gameStateData.character) {
            setCharacter(gameStateData.character);
        }
        if (gameStateData.environment) {
            setEnvironment(normalizeEnvironment(gameStateData.environment));
        }
        const socialUpdate = gameStateData.social || gameStateData.Social || gameStateData.SocialNet || gameStateData['Danh hiệp phả'];
        if (socialUpdate) {
            setSocial(standardizeSocialList(socialUpdate));
        }
        if (gameStateData.world) {
            const worldRaw = normalizeWorldStatus(gameStateData.world);
            setWorld(prev => ({
                ...worldRaw,
                metNpcIds: Array.isArray(worldRaw.metNpcIds) ? worldRaw.metNpcIds : prev.metNpcIds
            }));
        }
        if (gameStateData.battle) {
            setBattle(normalizeCombatStatus(gameStateData.battle));
        }
        if (gameStateData.playerSect) {
            setPlayerSect(gameStateData.playerSect);
        }
        if (gameStateData.taskList) {
            setTaskList(gameStateData.taskList);
        }
        if (gameStateData.appointmentList) {
            setAppointmentList(gameStateData.appointmentList);
        }
        if (gameStateData.story) {
            setStory(normalizeStoryStatus(gameStateData.story));
        }
    };

    const applyOpeningBaseState = (openingBase: any) => {
        setCharacter(openingBase.character || openingBase.Role);
        setEnvironment(normalizeEnvironment(openingBase.environment || openingBase.Environment));
        const socialData = openingBase.social || openingBase.Social || openingBase.SocialNet || openingBase['Danh hiệp phả'] || [];
        setSocial(standardizeSocialList(socialData));
        const worldRaw = normalizeWorldStatus(openingBase.world || openingBase.World);
        setWorld(worldRaw);
        setBattle(normalizeCombatStatus(openingBase.battle || openingBase.Combat));
        setPlayerSect(openingBase.playerSect || openingBase.PlayerSect);
        setTaskList(openingBase.taskList || openingBase.TaskList || []);
        setAppointmentList(openingBase.appointmentList || openingBase.AgreementList || []);
        setStory(normalizeStoryStatus(openingBase.story || openingBase.Story));
        setMemorySystem(createEmptyMemorySystem());
        setHistory([]);
        setWorldEvents([]);
    };

    const buildSystemPrompt = (
        promptPool: any[],
        memoryData: MemorySystem,
        socialData: any[],
        statePayload: any,
        options?: {
            disableMidLongMemory?: boolean;
            disableShortMemory?: boolean;
        }
    ): {
        systemPrompt: string;
        shortMemoryContext: string;
        contextPieces: {
            aiCharacterDeclaration: string;
            worldPrompt: string;
            mapBuildingStatus: string;
            otherPrompts: string;
            outputProtocolPrompt: string;
            wordCountRequirementPrompt: string;
            disclaimerOutputPrompt: string;
            leaveNpcArchive: string;
            longTermMemory: string;
            mediumTermMemory: string;
            presentNpcArchive: string;
            gameSettings: string;
            worldEvolution: string;
            tavernPreset: string;
            storyArrangement: string;

            worldState: string;
            environmentalState: string;
            characterStatus: string;
            combatStatus: string;
            sectStatus: string;
            taskStatus: string;
            agreementStatus: string;
        };
    } => {
        const buildEnvironmentalStatusText = (payload: any) => {
            const env = normalizeEnvironment(payload?.Environment || payload?.environment);
            const orderedEnv = {
                time: env.time || '',
                majorLocation: env.majorLocation || '',
                mediumLocation: env.mediumLocation || '',
                minorLocation: env.minorLocation || '',
                specificLocation: env.specificLocation || '',
                x: env.x,
                y: env.y,
                biomeId: env.biomeId,
                regionId: env.regionId,
                nearbyNodes: env.nearbyNodes,
                festival: env.festival,
                weather: env.weather,
                environmentalVariables: env.envVariables,
                gameDays: env.gameDays || 1,
                karma: env.karma || 0,
                worldTick: env.worldTick || 0
            };
            return `【Thông tin môi trường hiện tại】\n${JSON.stringify(orderedEnv, null, 2)} `;
        };

        const buildCharacterStatusText = (payload: any) => {
            const rawRole = payload?.Role || payload?.role || payload?.character || {};
            const role = normalizeInventoryMapping(rawRole);
            const getText = (value: any) => (typeof value === 'string' ? value : '');
            const getNumericalValue = (value: any, fallback: number = 0) => (
                typeof value === 'number' && Number.isFinite(value) ? value : fallback
            );
            // Strip image/base64 data from items to prevent token bloat
            const stripImageFromItem = (item: any) => {
                if (!item || typeof item !== 'object') return item;
                const { image, avatar, icon, thumbnail, ...rest } = item;
                return rest;
            };

            const orderedRole = {
                name: role.name || '',
                gender: role.gender || 'Nam',
                age: role.age || 18,
                birthDate: role.birthDate || '',
                appearance: role.appearance || '',
                title: role.title || '',
                realm: role.realm || '',
                talentList: role.talentList || [],
                background: role.background,
                sectId: role.sectId || 'none',
                sectPosition: role.sectPosition || '',
                sectContribution: role.sectContribution || 0,
                money: role.money,
                survival: {
                    energy: { current: role.currentEnergy, max: role.maxEnergy },
                    fullness: { current: role.currentFullness, max: role.maxFullness },
                    thirst: { current: role.currentThirst, max: role.maxThirst },
                    meridianStatus: role.meridianStatus || 'Bình thường',
                    weight: { current: role.currentWeight, max: role.maxWeight }
                },
                attributes: {
                    strength: role.strength || 10,
                    agility: role.agility || 10,
                    constitution: role.constitution || 10,
                    rootBone: role.rootBone || 10,
                    intelligence: role.intelligence || 10,
                    luck: role.luck || 10,
                    tamTinh: role.tamTinh || 10
                },
                bodyPartHP: {
                    head: { hp: `${role.headCurrentHp}/${role.headMaxHp}`, status: role.headStatus || 'Khỏe mạnh' },
                    chest: { hp: `${role.chestCurrentHp}/${role.chestMaxHp}`, status: role.chestStatus || 'Khỏe mạnh' },
                    abdomen: { hp: `${role.abdomenCurrentHp}/${role.abdomenMaxHp}`, status: role.abdomenStatus || 'Khỏe mạnh' },
                    leftArm: { hp: `${role.leftArmCurrentHp}/${role.leftArmMaxHp}`, status: role.leftArmStatus || 'Khỏe mạnh' },
                    rightArm: { hp: `${role.rightArmCurrentHp}/${role.rightArmMaxHp}`, status: role.rightArmStatus || 'Khỏe mạnh' },
                    leftLeg: { hp: `${role.leftLegCurrentHp}/${role.leftLegMaxHp}`, status: role.leftLegStatus || 'Khỏe mạnh' },
                    rightLeg: { hp: `${role.rightLegCurrentHp}/${role.rightLegMaxHp}`, status: role.rightLegStatus || 'Khỏe mạnh' }
                },
                equipment: role.equipment ? stripImageFromItem(role.equipment) : undefined,
                itemList: (role.itemList || []).map(stripImageFromItem),
                kungfuList: role.kungfuList || [],
                experience: {
                    current: role.currentExp || 0,
                    nextLevel: role.levelUpExp || 100
                },
                playerBuffs: role.playerBuffs || []
            };

            return `【Dữ liệu nhân vật người chơi】\n${JSON.stringify(orderedRole, null, 2)}`;
        };
        const normalizeText = (value: any) => (
            typeof value === 'string'
                ? value.trim().replace(/\s+/g, '').toLowerCase()
                : ''
        );
        const buildWorldStatusText = (payload: any) => {
            const world = normalizeWorldStatus(payload?.World || payload?.world);

            // USE COMPACT SUMMARY INSTEAD OF SENDING 3400+ NODES
            const worldSummary = WorldDataExporter.getStoryContextSummary(FULL_WORLD_SKELETON);

            const orderedWorld = {
                activeNpcList: (world.activeNpcList || []).slice(0, 20).map((npc: any) => ({
                    id: npc.id || '',
                    fullName: npc.fullName || '',
                    appellation: npc.appellation || '',
                    affiliatedFaction: npc.affiliatedFaction || '',
                    realm: npc.realm || '',
                    currentLocation: npc.currentLocation || '',
                    status: npc.status || '',
                    currentActionDescription: npc.currentActionDescription || '',
                    actionStartTime: npc.actionStartTime || '',
                    estimatedCompletionTime: npc.estimatedCompletionTime || ''
                })),
                worldSummary: worldSummary,
                ongoingEvents: (world.ongoingEvents || []),
                settledEvents: (world.settledEvents || []).slice(-15),
                worldHistory: (world.worldHistory || []).slice(-10)
            };

            return `【Thông tin thế giới】\n${JSON.stringify(orderedWorld, null, 2)}`;
        };
        const buildCombatStatusText = (payload: any) => {
            const battle = normalizeCombatStatus(payload?.Combat || payload?.battle);
            return `【Trạng thái chiến đấu】\n${JSON.stringify(battle, null, 2)}`;
        };
        const buildSectStatusText = (payload: any) => {
            const sect = payload?.playerSect && typeof payload?.playerSect === 'object' ? payload?.playerSect : {};
            const getText = (value: any) => (typeof value === 'string' ? value : '');
            const getArray = (value: any) => (Array.isArray(value) ? value : []);
            const getNumericalValue = (value: any, fallback: number = 0) => (
                typeof value === 'number' && Number.isFinite(value) ? value : fallback
            );
            const taskList = getArray(sect?.taskList).slice(0, 15).map((task: any) => ({
                id: getText(task?.id),
                title: getText(task?.title),
                description: getText(task?.description),
                type: getText(task?.type),
                difficulty: getNumericalValue(task?.difficulty),
                publishDate: getText(task?.publishDate),
                deadline: getText(task?.deadline),
                refreshDate: getText(task?.refreshDate),
                rewardContribution: getNumericalValue(task?.rewardContribution),
                bonusFunds: getNumericalValue(task?.bonusFunds),
                rewardItems: getArray(task?.rewardItems),
                currentStatus: getText(task?.currentStatus)
            }));
            const exchangeList = getArray(sect?.exchangeList).slice(0, 20).map((item: any) => ({
                id: getText(item?.id),
                itemName: getText(item?.itemName),
                type: getText(item?.type),
                exchangePrice: getNumericalValue(item?.exchangePrice),
                stock: getNumericalValue(item?.stock),
                requiredPosition: getText(item?.requiredPosition)
            }));
            const importantMembers = getArray(sect?.importantMembers).map((member: any) => ({
                id: getText(member?.id),
                fullName: getText(member?.fullName),
                gender: getText(member?.gender),
                age: getNumericalValue(member?.age),
                realm: getText(member?.realm),
                identity: getText(member?.identity),
                introduction: getText(member?.introduction)
            }));
            const orderedSect = {
                id: getText(sect?.id),
                name: getText(sect?.name),
                introduction: getText(sect?.introduction),
                sectRules: getArray(sect?.sectRules),
                sectFunds: getNumericalValue(sect?.sectFunds),
                sectResources: getNumericalValue(sect?.sectResources),
                constructionLevel: getNumericalValue(sect?.constructionLevel),
                playerPosition: getText(sect?.playerPosition),
                playerContribution: getNumericalValue(sect?.playerContribution),
                taskList,
                exchangeList,
                importantMembers
            };
            return `【Tông môn của người chơi】\n${JSON.stringify(orderedSect, null, 2)} `;
        };
        const buildTaskListText = (payload: any) => {
            const tasks = Array.isArray(payload?.taskList) ? payload?.taskList : [];
            const getText = (value: any) => (typeof value === 'string' ? value : '');
            const getArray = (value: any) => (Array.isArray(value) ? value : []);
            const getNumericalValue = (value: any, fallback: number = 0) => (
                typeof value === 'number' && Number.isFinite(value) ? value : fallback
            );
            const getBoolean = (value: any) => (typeof value === 'boolean' ? value : false);
            const orderedTasks = tasks.slice(0, 10).map((task: any) => ({
                title: getText(task?.title),
                description: getText(task?.description),
                type: getText(task?.type),
                publisher: getText(task?.publisher),
                publishLocation: getText(task?.publishLocation),
                recommendedRealm: getText(task?.recommendedRealm),
                deadline: getText(task?.deadline),
                currentStatus: getText(task?.currentStatus),
                targetList: getArray(task?.targetList).map((goal: any) => ({
                    description: getText(goal?.description),
                    currentProgress: getNumericalValue(goal?.currentProgress),
                    totalRequiredProgress: getNumericalValue(goal?.totalRequiredProgress),
                    completionStatus: getBoolean(goal?.completionStatus)
                })),
                rewardDescription: getArray(task?.rewardDescription),
                hiddenPlotLines: getText(task?.hiddenPlotLines)
            }));
            return `【Danh sách nhiệm vụ】\n${JSON.stringify(orderedTasks, null, 2)}`;
        };
        const buildPactListText = (payload: any) => {
            const agreements = Array.isArray(payload?.appointmentList) ? payload?.appointmentList : [];
            const getText = (value: any) => (typeof value === 'string' ? value : '');
            const getNumericalValue = (value: any, fallback: number = 0) => (
                typeof value === 'number' && Number.isFinite(value) ? value : fallback
            );
            const orderedAgreements = agreements.slice(0, 10).map((item: any) => ({
                object: getText(item?.object),
                title: getText(item?.title),
                nature: getText(item?.nature),
                oathContent: getText(item?.oathContent),
                agreedLocation: getText(item?.agreedLocation),
                agreedTime: getText(item?.agreedTime),
                validPeriod: getNumericalValue(item?.validPeriod),
                currentStatus: getText(item?.currentStatus),
                performanceConsequences: getText(item?.performanceConsequences),
                consequencesOfBreach: getText(item?.consequencesOfBreach),
                backgroundStory: getText(item?.backgroundStory)
            }));
            return `【Danh sách thỏa ước】\n${JSON.stringify(orderedAgreements, null, 2)}`;
        };

        const constructMapBuildingStateText = (payload: any) => {
            const source = payload || {};
            const env = normalizeEnvironment(source?.Environment || source?.environment);
            const world = normalizeWorldStatus(source?.World || source?.world);

            const currentSpecificLocation = typeof env?.specificLocation === 'string' ? env.specificLocation.trim() : '';
            const buildingList = Array.isArray(world.buildings) ? world.buildings : [];
            const mapText = '- (Dữ liệu bản đồ được truy xuất động dựa trên tọa độ)';

            const currentLocationNormalization = normalizeText(currentSpecificLocation);
            const hitBuilding = buildingList.filter((building: any) => {
                const nameNormalization = normalizeText(building?.name);
                if (!currentLocationNormalization || !nameNormalization) return false;
                return currentLocationNormalization === nameNormalization
                    || currentLocationNormalization.startsWith(nameNormalization)
                    || currentLocationNormalization.includes(nameNormalization);
            });

            const buildingText = hitBuilding.length > 0
                ? hitBuilding.map((building: any) => {
                    const name = typeof building?.name === 'string' ? building.name.trim() : 'Kiến trúc không tên';
                    const desc = typeof building?.description === 'string' ? building.description.trim() : 'Không có mô tả';
                    const ownership = building?.ownership && typeof building.ownership === 'object'
                        ? [
                            building.ownership?.majorLocation || 'Không rõ Đại địa điểm',
                            building.ownership?.mediumLocation || 'Không rõ Trung địa điểm',
                            building.ownership?.minorLocation || 'Không rõ Tiểu địa điểm'
                        ].join(' > ')
                        : 'Không rõ quy thuộc';
                    return `- Tên: ${name} | Quy thuộc: ${ownership}\n  Mô tả: ${desc}`;
                }).join('\n')
                : `- Vị trí cụ thể hiện tại「${currentSpecificLocation || 'Không rõ'}」Dữ liệu kiến trúc không khớp(Chỉ tiêm tóm tắt bản đồ)`;

            return [
                '【Bản đồ và Kiến trúc】',
                `Vị trí cụ thể hiện tại: ${currentSpecificLocation || 'Không rõ'}`,
                'Danh sách bản đồ:',
                mapText,
                '',
                'Dữ liệu kiến trúc cho vị trí hiện tại(Chỉ tiêm khi specificLocations khớp với kiến trúc tương ứng):',
                buildingText
            ].join('\n');
        };
        const buildStoryArrangement = (payload: any) => {
            const normalized = normalizeStoryStatus(payload?.Story || payload?.story);
            const orderedStory = {
                currentChapter: {
                    id: normalized.currentChapter?.id ?? '',
                    index: normalized.currentChapter?.index ?? 1,
                    title: normalized.currentChapter?.title ?? '',
                    summary: normalized.currentChapter?.summary ?? '',
                    backgroundStory: normalized.currentChapter?.backgroundStory ?? '',
                    mainConflict: normalized.currentChapter?.mainConflict ?? '',
                    endConditions: (normalized.currentChapter?.endConditions || []).map((cond: any) => ({
                        type: cond?.type ?? 'Event',
                        description: cond?.description ?? '',
                        ...(cond?.checkValue !== undefined ? { checkValue: cond.checkValue } : {}),
                        ...(cond?.variableKey ? { variableKey: cond.variableKey } : {})
                    })),
                    foreshadowingList: normalized.currentChapter?.foreshadowingList || []
                },
                nextChapterPreview: {
                    title: normalized.nextChapterPreview?.title ?? '',
                    outline: normalized.nextChapterPreview?.outline ?? ''
                },
                historicalArchives: normalized.historicalArchives || [],
                shortTermPlanning: normalized.shortTermPlanning || '',
                mediumTermPlanning: normalized.mediumTermPlanning || '',
                longTermPlanning: normalized.longTermPlanning || '',
                pendingEvents: normalized.pendingEvents || [],
                storyVariables: normalized.storyVariables || {}
            };

            const branchInfo = `【Phân nhánh câu chuyện】\nTrạng thái hiện tại: ${orderedStory.storyVariables?.currentBranch || 'Nhánh chính (Main Branch)'}\nCác biến số phân nhánh: ${Object.keys(orderedStory.storyVariables || {}).filter(k => k.toLowerCase().includes('branch')).join(', ') || 'Không có'}`;

            return `【Sắp xếp cốt truyện】\n${JSON.stringify(orderedStory, null, 2)}\n\n${branchInfo} `;
        };


        const perspectivePromptIds = [
            'write_perspective_first',
            'write_perspective_second',
            'write_perspective_third',
            'writing_perspective_first',
            'writing_perspective_second',
            'writing_perspective_third'
        ];
        const normalizedGameConfig = normalizeGameSettings(gameConfig);
        const applyMultiThoughtPromptSwitch = (
            pool: PromptStructure[],
            enabled: boolean
        ): PromptStructure[] => {
            if (!enabled) return pool;
            const hasMultiCot = pool.some(p => p.id === 'core_cot_multi');
            const hasMultiFormat = pool.some(p => p.id === 'core_format_multi');
            let nextPool = pool.map(p => {
                if (p.id === 'core_cot') return { ...p, enabled: false };
                if (p.id === 'core_format') return { ...p, enabled: false };
                if (p.id === 'core_cot_multi') return { ...p, enabled: true };
                if (p.id === 'core_format_multi') return { ...p, enabled: true };
                return p;
            });
            if (!hasMultiCot) {
                nextPool = [...nextPool, { ...Core_ChainOfThought_MultiThought, enabled: true }];
            }
            if (!hasMultiFormat) {
                nextPool = [...nextPool, { ...Core_OutputFormat_MultiThought, enabled: true }];
            }
            return nextPool;
        };


        const applyPreventSpeakingPromptSwitch = (
            pool: PromptStructure[],
            enabled: boolean
        ): PromptStructure[] => {
            const hasNoControl = pool.some(p => p.id === 'write_no_control');
            let nextPool = pool.map(p => {
                if (p.id === 'write_no_control') return { ...p, enabled: enabled };
                return p;
            });
            if (enabled && !hasNoControl) {
                nextPool = [...nextPool, { ...Writing_PreventSpeaking, enabled: true }];
            }
            return nextPool;
        };
        let effectivePromptPool = applyMultiThoughtPromptSwitch(
            promptPool,
            normalizedGameConfig.enableMultiThinking === true
        );

        effectivePromptPool = applyPreventSpeakingPromptSwitch(
            effectivePromptPool,
            normalizedGameConfig.enablePreventSpeaking !== false
        );

        const playerName = statePayload?.Role?.name || statePayload?.role?.name || statePayload?.character?.name || statePayload?.Role?.['Full Name'] || character?.name || 'Unnamed';
        const renderPromptText = (content: string) => content.replace(/\$\{playerName\}/g, playerName);
        const aiCharacterDeclaration = buildAICharacterDeclarationPrompt(playerName);
        const applyWritingSettings = (promptId: string, content: string) => {
            if (promptId !== 'write_req') return content;
            const lengthRule = constructWordCountRequirementPrompt(normalizedGameConfig.bodyLengthRequirement);
            if (/<Word count>[\s\S]*?<\/Word count>/im.test(content)) {
                return content.replace(/<Word count>[\s\S]*?<\/Word count>/im, lengthRule);
            }
            if (/<Số chữ>[\s\S]*?<\/Số chữ>/m.test(content)) {
                return content.replace(/<Số chữ>[\s\S]*?<\/Số chữ>/m, lengthRule);
            }
            return `${content.trim()}\n${lengthRule}`;
        };

        const enabledPrompts = effectivePromptPool.filter(p => p.enabled);
        const perspectiveSuffixMap: Record<string, string> = {
            'Ngôi thứ nhất': 'first',
            'Ngôi thứ hai': 'second',
            'Ngôi thứ ba': 'third'
        };
        const perspectiveSuffix = perspectiveSuffixMap[normalizedGameConfig.narrativePerspective] || 'second';
        const selectedPerspectivePrompt =
            enabledPrompts.find(p => p.id === `writing_perspective_${perspectiveSuffix}`) ||
            enabledPrompts.find(p => p.id === `write_perspective_${perspectiveSuffix}`);
        const fallbackPerspectivePrompt =
            enabledPrompts.find(p => p.id === 'writing_perspective_second') ||
            enabledPrompts.find(p => p.id === 'write_perspective_second');

        const worldPrompt = renderPromptText(enabledPrompts.find(p => p.id === 'core_world')?.content || '');
        const writeReqPrompt = enabledPrompts.find(p => p.id === 'write_req');
        const writeReqContent = writeReqPrompt
            ? applyWritingSettings(writeReqPrompt.id, renderPromptText(writeReqPrompt.content))
            : '';
        const otherPromptContents = enabledPrompts
            .filter(p => p.id !== 'core_world' && p.id !== 'core_action_options' && !perspectivePromptIds.includes(p.id) && p.id !== 'write_req')
            .map(p => applyWritingSettings(p.id, renderPromptText(p.content)));
        const actionOptionsPromptContent = renderPromptText(
            actionOptionsPrompt(promptPool, normalizedGameConfig.enableActionOptions)
        );
        const activePerspectiveContent = applyWritingSettings(
            selectedPerspectivePrompt?.id || '',
            renderPromptText(selectedPerspectivePrompt?.content || fallbackPerspectivePrompt?.content || '')
        );
        const otherPrompts = [...otherPromptContents, actionOptionsPromptContent]
            .filter(Boolean)
            .join('\n\n');
        const outputProtocolPrompt = renderPromptText(getOutputProtocolPrompt(promptPool));
        const lengthRequirementPrompt = constructWordCountRequirementPrompt(normalizedGameConfig.bodyLengthRequirement);
        const disclaimerRequirementPrompt = normalizedGameConfig.enableDisclaimerOutput
            ? constructDisclaimerOutputRequirementsPrompt()
            : '';

        const npcContext = buildNPCContext(socialData || [], memoryConfig);
        const contextMapAndBuilding = constructMapBuildingStateText(statePayload);

        // World Evolution prompt injection
        const fmp = apiConfig?.featureModelPlaceholder;
        const isWorldEvolutionEnabled = fmp?.worldEvolutionIndependentModelToggle !== false;
        const worldEvolutionBlock = (isWorldEvolutionEnabled && fmp?.worldEvolutionPrompt)
            ? `【Tiến hóa thế giới】\n${fmp.worldEvolutionPrompt}`
            : '';

        // Tavern Presets (Prompt Library) injection
        const activePreset = tavernSettings?.presets?.find(p => p.id === tavernSettings.activePresetId);
        const presetPrompt = activePreset?.prompt || '';
        const presetStrategy = tavernSettings?.postProcessing || 'Thêm vào sau prompt thế giới/cốt truyện gốc';
        const isPresetEnabled = tavernSettings?.enabled !== false;

        let finalSystemPrompt = worldPrompt.trim();
        let tavernPresetBlock = '';

        if (isPresetEnabled && presetPrompt) {
            tavernPresetBlock = `【Thư viện Prompt - ${activePreset?.name}】\n${presetPrompt}`;
            if (presetStrategy === 'Thêm vào trước prompt thế giới') {
                finalSystemPrompt = `${tavernPresetBlock}\n\n${finalSystemPrompt}`;
            } else if (presetStrategy === 'Đè hoàn toàn prompt hệ thống') {
                finalSystemPrompt = tavernPresetBlock;
            } else {
                // Default: append
                finalSystemPrompt = `${finalSystemPrompt}\n\n${tavernPresetBlock}`;
            }
        }

        const promptHeader = [
            finalSystemPrompt,
            contextMapAndBuilding,
            worldEvolutionBlock,
            npcContext.departureDataBlock,
            otherPrompts.trim()
        ].filter(Boolean).join('\n\n');

        const longMemory = options?.disableMidLongMemory
            ? '【Ký ức dài hạn】\n(Hệ thống truy xuất ký ức cốt truyện đã tiếp quản. Không tiêm đoạn này)'
            : `【Ký ức dài hạn】\n${memoryData.longTermMemory.slice(-25).join('\n') || 'Trống'}`;
        const midMemory = options?.disableMidLongMemory
            ? '【Ký ức trung hạn】\n(Hệ thống truy xuất ký ức cốt truyện đã tiếp quản. Không tiêm đoạn này)'
            : `【Ký ức trung hạn】\n${(memoryData.midTermMemory || []).slice(-25).join('\n') || 'Trống'}`;
        const contextMemory = options?.disableMidLongMemory ? '' : `${longMemory}\n${midMemory}`;
        const contextNPCData = npcContext.presentDataBlock;
        const ntlTierLine = normalizedGameConfig.storyStyle === 'NTLHarem'
            ? `Cấp độ NTLHarem: ${normalizedGameConfig.ntlHaremTier}`
            : '';
        const contextSettings = [
            '【Thiết lập game】',
            `Yêu cầu số chữ: ${normalizedGameConfig.bodyLengthRequirement} chữ`,
            `Góc nhìn trần thuật: ${normalizedGameConfig.narrativePerspective}`,
            `Phong cách câu chuyện: ${normalizedGameConfig.storyStyle}`,
            `Chức năng lựa chọn hành động: ${normalizedGameConfig.enableActionOptions ? 'Mở' : 'Đóng'}`,
            `Ngăn chặn nói chuyện: ${normalizedGameConfig.enablePreventSpeaking ? 'Mở' : 'Đóng'}`,
            `Xuất lời cảnh báo: ${normalizedGameConfig.enableDisclaimerOutput ? 'Mở' : 'Đóng'}`,
            `Tiêm giả COT: ${normalizedGameConfig.enablePseudoCotInjection ? 'Mở' : 'Đóng'}`,
            `Chế độ đa suy nghĩ: ${normalizedGameConfig.enableMultiThinking ? 'Mở' : 'Đóng'}`,


            `Chế độ thế giới thực: ${normalizedGameConfig.enableRealWorldMode ? 'Mở' : 'Đóng'}`,

            ...(normalizedGameConfig.enableExtraPrompt && normalizedGameConfig.extraPrompt
                ? [
                    '',
                    '【Prompt bổ sung tùy chỉnh】',
                    normalizedGameConfig.extraPrompt
                ]
                : []),
            ...(normalizedGameConfig.enableRealWorldMode
                ? [
                    '',
                    '【Quy tắc thế giới thực - Thiên Đạo Vận Hành】',
                    normalizedGameConfig.customRealWorldRules?.trim() || 'Thế giới vận hành theo các luật Nhân Quả, Vận Động, Thời Gian và Tương Quan Thực Tế. Mọi diễn biến phải đảm bảo tính chân thực và logic tối cao của một thế giới võ hiệp thực thụ. Mọi cuộc chiến dựa trên thực lực, tu vi, pháp bảo và thiên thời. Sinh linh tuân thủ các quy luật sinh học, lão hóa và giới hạn của bản chất. Tuyệt đối cấm các bước nhảy vọt logic hoặc buff sức mạnh vô căn cứ.'
                ]
                : []),

            '',
            '【Gợi ý ngôi kể tương ứng】',
            activePerspectiveContent || 'Chưa cấu hình',
            '',
            '【Gợi ý yêu cầu số chữ tương ứng】',
            writeReqContent || 'Chưa cấu hình'
        ].join('\n');
        const contextStoryPlan = buildStoryArrangement(statePayload);

        const contextWorldState = buildWorldStatusText(statePayload);
        const contextEnvironmentState = buildEnvironmentalStatusText(statePayload);
        const contextRoleState = buildCharacterStatusText(statePayload);
        const contextBattleState = buildCombatStatusText(statePayload);
        const contextSectState = buildSectStatusText(statePayload);
        const contextTaskState = buildTaskListText(statePayload);
        const contextAgreementState = buildPactListText(statePayload);
        const shortMemoryEntries = options?.disableShortMemory
            ? []
            : (memoryData.shortTermMemory || [])
                .slice(-30)
                .map(item => item.trim())
                .filter(Boolean);
        const shortMemoryContext = options?.disableShortMemory
            ? ''
            : shortMemoryEntries.length > 0
                ? `【Ký ức ngắn hạn】\n${shortMemoryEntries.join('\n')}`
                : '';

        return {
            systemPrompt: [
                promptHeader,
                contextMemory,
                contextNPCData,
                contextSettings,
                contextStoryPlan,

                contextWorldState,
                contextEnvironmentState,
                contextRoleState,
                contextBattleState,
                contextSectState,
                contextTaskState,
                contextAgreementState,
                '',
                '【GIAO THỨC NGÔN NGỮ BẮT BUỘC】',
                '- BẮT BUỘC SỬ DỤNG TIẾNG VIỆT 100% cho TẤT CẢ các phản hồi.',
                '- NGHIÊM CẤM xuất hiện tiếng Anh hoặc tiếng Trung trong bất kỳ trường nào (bao gồm cả suy nghĩ nội bộ và lệnh hệ thống).',
                '- Mọi mô tả, đối thoại, phán định và kế hoạch phải được trình bày trôi chảy bằng tiếng Việt.'
            ]
                .filter(Boolean)
                .join('\n\n'),
            shortMemoryContext,
            contextPieces: {
                aiCharacterDeclaration: aiCharacterDeclaration,
                worldPrompt: worldPrompt.trim(),
                mapBuildingStatus: contextMapAndBuilding,
                otherPrompts: otherPrompts.trim(),
                outputProtocolPrompt: outputProtocolPrompt,
                wordCountRequirementPrompt: lengthRequirementPrompt,
                disclaimerOutputPrompt: disclaimerRequirementPrompt,
                leaveNpcArchive: npcContext.departureDataBlock,
                longTermMemory: longMemory,
                mediumTermMemory: midMemory,
                presentNpcArchive: contextNPCData,
                gameSettings: contextSettings,
                worldEvolution: worldEvolutionBlock,
                tavernPreset: tavernPresetBlock,
                storyArrangement: contextStoryPlan,

                worldState: contextWorldState,
                environmentalState: contextEnvironmentState,
                characterStatus: contextRoleState,
                combatStatus: contextBattleState,
                sectStatus: contextSectState,
                taskStatus: contextTaskState,
                agreementStatus: contextAgreementState
            }
        };
    };

    const handleGenerateWorld = async (
        worldConfig: WorldGenConfig,
        charData: CharacterData,
        mode: 'all' | 'step',
        openingStreaming: boolean = true
    ) => {
        const currentApi = getMainStoryApiConfig(apiConfig);
        const workerUrl = visualConfig?.textGenWorkerUrl;
        if (!hasAnyAiBackend(currentApi, workerUrl)) {
            alert("Vui lòng cấu hình API hoặc sử dụng Worker mặc định trong Cài đặt.");
            setShowSettings(true);
            return;
        }

        setRecentStartingConfig({
            worldConfig: deepCopy(worldConfig),
            charData: deepCopy(charData),
            openingStreaming
        });
        clearRollSnapshot();
        resetAutoSaveStatus();
        setStoryId(crypto.randomUUID());

        // Sync NSFW and Female Protagonist settings to global game config
        setGameConfig(prev => ({
            ...prev,
            storyStyle: worldConfig.storyStyle || prev.storyStyle || 'Thông thường',
        }));

        const openingBase = createStartingBasicStatus(charData, worldConfig);

        if (openingStreaming) {
            const worldStreamMarker = Date.now();
            setView('game');
            setHistory([
                {
                    role: 'system',
                    content: 'System: Generating data,Please wait...',
                    timestamp: worldStreamMarker
                },
                {
                    role: 'assistant',
                    content: openingStreaming ? '【Generating...】Preparing to connect model...' : '【Generating...】Waiting for model...',
                    timestamp: worldStreamMarker + 1
                }
            ]);
        }

        setLoading(true);
        setIsGenerating(true);
        setGenerationStartTime(Date.now());
        setGenerationMetadata(undefined);

        let worldStreamHeartbeat: ReturnType<typeof setInterval> | null = null;
        let worldDeltaReceived = false;
        try {
            // 1. Build worldview seed prompt (for world-prompt generation only)
            const worldPromptSeed = constructWorldviewSeedPrompt(worldConfig, charData);

            const difficulty = worldConfig.difficulty || 'normal';

            const isDifficultyPrompt = (p: PromptStructure) =>
                p.type === 'diff' || p.type === 'Difficulty setting' || (p as any).Type === 'Difficulty setting';

            // Filter prompts: Update Core World AND Enable/Disable Difficulty prompts
            const updatedPrompts = prompts.map(p => {
                // Update world prompt content
                if (p.id === 'core_world') {
                    return { ...p, content: worldPromptSeed };
                }

                // Toggle Difficulty Prompts (type is 'diff' in prompts/difficulty/*.ts)
                if (isDifficultyPrompt(p)) {
                    // 'custom' difficulty: preserve user's prompt library selections
                    if (difficulty === 'custom') return p;
                    // Otherwise: enable if the ID ends with the selected difficulty (e.g. "_hard")
                    // When no difficulty prompt matches (e.g. unknown value), default to 'easy'
                    const isTargetDifficulty = p.id.endsWith(`_${difficulty}`);
                    return { ...p, enabled: isTargetDifficulty };
                }

                return p;
            });

            const enabledDifficultyPrompts = updatedPrompts
                .filter(p => isDifficultyPrompt(p) && p.enabled)
                .map(p => p.content)
                .join('\n\n');

            // For 'custom' difficulty, if no difficulty prompts are enabled, default to 'easy'
            const finalDifficultyPrompts = difficulty === 'custom' && !enabledDifficultyPrompts
                ? updatedPrompts
                    .filter(p => isDifficultyPrompt(p) && p.id.endsWith('_easy'))
                    .map(p => p.content)
                    .join('\n\n')
                : enabledDifficultyPrompts;

            setPrompts(updatedPrompts);
            // Save immediately so subsequent calls use it
            await dbService.saveSetting('prompts', updatedPrompts);


            const worldGenerationContext = constructWorldGenContextPrompt(
                worldPromptSeed,
                difficulty,
                finalDifficultyPrompts
            );

            // 2. Call AI Service
            if (openingStreaming) {
                let pulse = 0;
                worldStreamHeartbeat = setInterval(() => {
                    if (worldDeltaReceived) return;
                    pulse = (pulse + 1) % 4;
                    const dots = '.'.repeat(pulse) || '.';
                    setHistory(prev => prev.map(item => {
                        if (
                            item.role === 'assistant' &&
                            !item.structuredResponse &&
                            typeof item.content === 'string' &&
                            item.content.startsWith('【Đang tạo...】')
                        ) {
                            return {
                                ...item,
                                content: `【Đang tạo...】Khởi tạo thế giới${dots}`
                            };
                        }
                        return item;
                    }));
                }, 420);
            }

            const worldGameConfig = normalizeGameSettings(gameConfig);
            const worldResponse = await aiService.generateWorldData(
                worldGenerationContext,
                charData,
                currentApi,
                openingStreaming
                    ? {
                        stream: openingStreaming,
                        onDelta: (_delta, accumulated) => {
                            worldDeltaReceived = true;
                            setHistory(prev => prev.map(item => {
                                if (
                                    item.role === 'assistant' &&
                                    !item.structuredResponse &&
                                    typeof item.content === 'string' &&
                                    item.content.startsWith('【Đang tạo...】')
                                ) {
                                    return {
                                        ...item,
                                        content: `【Đang tạo...】Khởi tạo thế giới: ${accumulated}`
                                    };
                                }
                                return item;
                            }));
                        }
                    }
                    : undefined,
                workerUrl
            );
            if (worldStreamHeartbeat) clearInterval(worldStreamHeartbeat);

            const worldPromptContent = worldResponse.world_prompt?.trim() || worldPromptSeed;

            // 3. Determine starting location based on character data and full skeleton (now handles biome-only then random)
            const startingLocation = await aiService.determineStartingLocation(
                charData,
                FULL_WORLD_SKELETON,
                currentApi,
                workerUrl
            );

            // 4. Update state with filtered world skeleton data (we still transform full skeleton but with discovery filtering later)
            // Note: user specifically asked to unlock based on XY, so we don't filter the maps array in world state yet, 
            // but we filter the MapGraph display.
            const worldSkeletonData = WorldDataExporter.transformSkeleton(FULL_WORLD_SKELETON);

            // 4.1 Initialize visited nodes (Discovery system - radius 150 around starting XY)
            // This reveals approximately 15-25 nodes depending on density, meeting user requirement.
            const sx = startingLocation.x || 500;
            const sy = startingLocation.y || 500;
            const initialVisitedNodes = MapService.getNodesByProximity(sx, sy, 150);
            const initialVisitedIds = initialVisitedNodes.map(n => n.id);

            openingBase.world = {
                ...openingBase.world,
                buildings: worldSkeletonData.buildings || [],
                visitedNodeIds: initialVisitedIds,
            };

            openingBase.environment = {
                ...openingBase.environment,
                majorLocation: startingLocation.majorLocation,
                mediumLocation: startingLocation.mediumLocation,
                minorLocation: startingLocation.minorLocation,
                specificLocation: startingLocation.minorLocation,
                x: startingLocation.x,
                y: startingLocation.y,
                biomeId: startingLocation.biomeId,
                regionId: startingLocation.regionId,
            };

            openingBase.character = {
                ...openingBase.character,
                personalityStats: startingLocation.personalityStats || {
                    righteousness: 50, evil: 0, arrogance: 10, humility: 30, coldness: 10, passion: 50
                }
            };

            const finalPrompts = updatedPrompts.map(p => (
                p.id === 'core_world' ? { ...p, content: worldPromptContent } : p
            ));
            setPrompts(finalPrompts);
            await dbService.saveSetting('prompts', finalPrompts);

            // Mode Handling
            if (mode === 'step') {
                // step Mode used for manual initialization,Still need to write the blank ground state to the frontend first.。
                applyOpeningBaseState(openingBase);
                setView('game');
                alert("Worldview prompt written. Please input commands in the chat box to start initialization.");
            } else {
                // We pass genData explicitly because state updates might be async/batched
                await generateOpeningStory(openingBase, finalPrompts, openingStreaming, currentApi, startingLocation.reason);
                // Trigger Visual Summary review step
            }
        } catch (error: any) {
            if (worldStreamHeartbeat) clearInterval(worldStreamHeartbeat);
            console.error(error);
            const errorMessage = error?.message || 'Unknown error';
            if (openingStreaming) {
                setHistory(prev => {
                    const patched = prev.map(item => {
                        if (
                            item.role === 'assistant' &&
                            !item.structuredResponse &&
                            typeof item.content === 'string' &&
                            item.content.startsWith('【Đang tạo...】')
                        ) {
                            return { ...item, content: `【Tạo thất bại】${errorMessage}` };
                        }
                        return item;
                    });

                    return [
                        ...patched,
                        {
                            role: 'system',
                            content: `[Khởi tạo thất bại] ${errorMessage}\nBấm nút tia sét bên trái thanh nhập liệu để "Khởi động nhanh" thử lại ngay, các tham số tạo nhân vật vẫn được giữ lại.`,
                            timestamp: Date.now()
                        }
                    ];
                });
            } else {
                alert("World generation failed: " + errorMessage);
            }
        } finally {
            if (worldStreamHeartbeat) clearInterval(worldStreamHeartbeat);
            setLoading(false);
            setIsGenerating(false);
        }
    };

    const generateOpeningStory = async (
        contextData: any,
        promptSnapshot: PromptStructure[],
        useStreaming: boolean,
        apiForOpening: ApiConfig,
        startingReason?: string
    ) => {
        const initialHistory: ChatHistory[] = [
            {
                role: 'system',
                content: 'System: Generating opening content......',
                timestamp: Date.now()
            }
        ];
        setHistory(initialHistory);
        let openingStreamHeartbeat: ReturnType<typeof setInterval> | null = null;
        let openingDeltaReceived = false;

        try {
            const controller = new AbortController();
            abortControllerRef.current = controller;

            const openingMem: MemorySystem = { recallArchives: [], instantMemory: [], shortTermMemory: [], midTermMemory: [], longTermMemory: [] };
            const openingEnv = normalizeEnvironment(contextData?.environment || environment);

            const mergedWorldForOpening = contextData.world || world;

            const openingStatePayload = {
                character: contextData.character || character,
                environment: openingEnv,
                world: mergedWorldForOpening,
                battle: contextData.battle || battle,
                playerSect: contextData.playerSect || playerSect,
                taskList: contextData.taskList || taskList,
                appointmentList: contextData.appointmentList || appointmentList,
                story: normalizeStoryStatus(contextData.story || story, openingEnv)
            };
            const openingContext = buildSystemPrompt(
                promptSnapshot,
                openingMem,
                contextData.social || [],
                openingStatePayload
            );
            const openingScriptContext = [
                openingContext.shortMemoryContext,
                `【Xem nhanh cốt truyện (Script)】\nKhởi tạo thế giới hoàn tất, Hồi I sắp sửa bắt đầu.`
            ].filter(Boolean).join('\n\n');

            const streamMarker = Date.now();
            if (useStreaming) {
                setHistory([
                    ...initialHistory,
                    {
                        role: 'assistant',
                        content: '',
                        timestamp: streamMarker,
                        gameTime: openingEnv?.time || "Unknown time"
                    }
                ]);
                let pulse = 0;
                openingStreamHeartbeat = setInterval(() => {
                    if (openingDeltaReceived) return;
                    pulse = (pulse + 1) % 4;
                    const dots = '.'.repeat(pulse) || '.';
                    setHistory(prev => prev.map(item => {
                        if (
                            item.timestamp === streamMarker &&
                            item.role === 'assistant' &&
                            !item.structuredResponse
                        ) {
                            return { ...item, content: `【Đang tạo...】Khởi tạo câu chuyện${dots}` };
                        }
                        return item;
                    }));
                }, 420);
            }

            const openingGameConfig = normalizeGameSettings(gameConfig);
            const openingLengthRequirementPrompt = constructWordCountRequirementPrompt(10000);
            const openingDisclaimerRequirementPrompt = openingContext.contextPieces.disclaimerOutputPrompt || undefined;
            const openingOutputProtocolPrompt = openingContext.contextPieces.outputProtocolPrompt;
            const combinedExtraPrompt = openingGameConfig.extraPrompt || '';

            const aiResult = await aiService.generateStoryResponse(
                openingContext.systemPrompt,
                openingScriptContext,
                `${startingInitializationTaskPrompt}\n\n【Lý do chọn địa điểm xuất phát】\n${startingReason || 'Hệ thống tự động chọn vị trí phù hợp với căn cơ.'}`,
                apiForOpening,
                controller.signal,
                useStreaming
                    ? {
                        stream: true,
                        onDelta: (_delta, accumulated) => {
                            openingDeltaReceived = true;
                            setHistory(prev => prev.map(item => {
                                if (
                                    item.timestamp === streamMarker &&
                                    item.role === 'assistant' &&
                                    !item.structuredResponse
                                ) {
                                    return { ...item, content: accumulated };
                                }
                                return item;
                            }));
                        }
                    }
                    : undefined,
                combinedExtraPrompt,
                {
                    enableCotInjection: openingGameConfig.enablePseudoCotInjection !== false,
                    leadingSystemPrompt: openingContext.contextPieces.aiCharacterDeclaration,
                    styleAssistantPrompt: constructStorylineStyleAssistantPrompt(openingGameConfig.storyStyle),
                    outputProtocolPrompt: openingOutputProtocolPrompt,
                    cotPseudoHistoryPrompt: buildCotDisguisePrompt(openingGameConfig),
                    lengthRequirementPrompt: openingLengthRequirementPrompt,
                    disclaimerRequirementPrompt: openingDisclaimerRequirementPrompt
                },
                visualConfig?.textGenWorkerUrl
            );
            const aiData = aiResult.response;
            if (openingStreamHeartbeat) clearInterval(openingStreamHeartbeat);

            // Apply commands (use generated opening state as base to avoid stale state race)
            const openingStateAfterCommands = processResponseCommands(aiData, {
                character: contextData.character || character,
                environment: contextData.environment || environment,
                social: contextData.social || social,
                world: mergedWorldForOpening,
                battle: contextData.battle || battle,
                story: normalizeStoryStatus(contextData.story || story, contextData.environment || environment)
            });
            // Initial phase:Non tavern_commands Writable field(Sect/Task/Promise)Must also be reset at this time,Avoid following old save data.。
            setPlayerSect(contextData.playerSect || createEmptySectStatus());
            setTaskList(Array.isArray(contextData.taskList) ? contextData.taskList : []);
            setAppointmentList(Array.isArray(contextData.appointmentList) ? contextData.appointmentList : []);
            setWorldEvents([]);
 
            // NPC Discovery: Identify NPCs mentioned in the opening response
            const responseNpcs = Array.isArray(aiData?.logs) 
                ? aiData.logs.map((log: any) => log.sender).filter((sender: string) => sender && sender !== 'Hệ thống')
                : [];
            const discoveredNpcIds = (mergedWorldForOpening.activeNpcList || [])
                .filter((npc: any) => responseNpcs.includes(npc.fullName) || responseNpcs.includes(npc.appellation))
                .map((npc: any) => npc.id);

            if (discoveredNpcIds.length > 0) {
                setWorld(prev => ({
                    ...prev,
                    metNpcIds: [...new Set([...(prev.metNpcIds || []), ...discoveredNpcIds])]
                }));
            }

            const openingCanonicalTime = normalizeCanonicalGameTime(openingStateAfterCommands?.environment?.time);
            const openingTime = openingCanonicalTime
                || openingStateAfterCommands?.environment?.time
                || contextData.environment?.time
                || "Unknown time";
            const openingImmediateEntry = buildRealTimeMemoryEntry(openingTime, '', aiData, { omitPlayerInput: true });
            const openingShortEntry = buildShortTermMemoryEntry(openingTime, 'Initial generation', aiData);
            const openingFreshMemory: MemorySystem = {
                recallArchives: [],
                instantMemory: [],
                shortTermMemory: [],
                midTermMemory: [],
                longTermMemory: []
            };
            setMemorySystem(writeFourMemorySegments(standardizeMemorySystem(openingFreshMemory), openingImmediateEntry, openingShortEntry));

            const newAiMsg: ChatHistory = {
                role: 'assistant',
                content: "Opening Story",
                structuredResponse: aiData,
                rawJson: getRawAiMessage(aiResult.rawText),
                timestamp: Date.now(),
                gameTime: openingTime
            };
            if (useStreaming) {
                setHistory(prev => prev.map(item => {
                    if (
                        item.timestamp === streamMarker &&
                        item.role === 'assistant' &&
                        !item.structuredResponse
                    ) {
                        return { ...newAiMsg };
                    }
                    return item;
                }));
            } else {
                setHistory([...initialHistory, newAiMsg]);
            }

            // Trigger auto-save after full opening response — pass latest state snapshot
            void performAutoSave({
                history: [...initialHistory, newAiMsg],
                stateOverride: openingStateAfterCommands
            });

        } catch (e: any) {
            if (openingStreamHeartbeat) clearInterval(openingStreamHeartbeat);
            if (e?.name === 'AbortError') {
                setHistory(initialHistory);
                throw e;
            }
            console.error("Story Gen Failed", e);
            throw e;
        } finally {
            if (openingStreamHeartbeat) clearInterval(openingStreamHeartbeat);
            abortControllerRef.current = null;
        }
    };

    const handleReturnToHome = () => {
        resetAutoSaveStatus();
        setView('home');
        return true;
    };

    const processResponseCommands = (
        response: GameResponse,
        baseState?: {
            character: CharacterData;
            environment: EnvironmentData;
            social: any[];
            world: WorldDataStructure;
            battle: BattleStatus;
            story: StorySystemStructure;
        }
    ) => {
        let charBuffer = baseState?.character || character;
        let envBuffer = normalizeEnvironment(baseState?.environment || environment);
        let socialBuffer = baseState?.social || social;
        let worldBuffer = normalizeWorldStatus(baseState?.world || world);
        let battleBuffer = normalizeCombatStatus(baseState?.battle || battle);
        let storyBuffer = normalizeStoryStatus(baseState?.story || story, envBuffer);
        let taskListBuffer = deepCopy(taskList);
        let appointmentListBuffer = deepCopy(appointmentList);
        let playerSectBuffer = deepCopy(playerSect);

        // 0. Update buffers with top-level fields from response if present
        // This ensures that full-state updates in the JSON are respected before partial commands are applied.
        const rawResponse = response as any;
        if (rawResponse.character) charBuffer = { ...charBuffer, ...rawResponse.character };
        if (rawResponse.environment) envBuffer = normalizeEnvironment({ ...envBuffer, ...rawResponse.environment });
        if (rawResponse.social) socialBuffer = standardizeSocialList(mergeSameNamesNPCList([...socialBuffer, ...(Array.isArray(rawResponse.social) ? rawResponse.social : [])]));
        if (rawResponse.world) worldBuffer = normalizeWorldStatus({ ...worldBuffer, ...rawResponse.world });
        if (rawResponse.battle) battleBuffer = normalizeCombatStatus({ ...battleBuffer, ...rawResponse.battle });
        if (rawResponse.story) storyBuffer = normalizeStoryStatus({ ...storyBuffer, ...rawResponse.story }, envBuffer);



        const allCommands: any[] = [
            ...(Array.isArray(response.tavern_commands) ? response.tavern_commands : [])
        ];

        // Handle Dynamic Location Spawn
        if (response.t_dynamic_location && typeof response.t_dynamic_location === 'object') {
            const loc = response.t_dynamic_location;
            if (loc.name && typeof loc.name === 'string') {
                let parentNode = MapService.findNodeByName(envBuffer.minorLocation)
                    || MapService.findNodeByName(envBuffer.specificLocation)
                    || MapService.findNodeByName(envBuffer.mediumLocation)
                    || MapService.findNodeByName(envBuffer.majorLocation);

                if (!parentNode) {
                    const nearNodes = MapService.getNodesByProximity(envBuffer.x ?? 1500, envBuffer.y ?? 1500, 2000);
                    if (nearNodes.length > 0) parentNode = nearNodes[0];
                }

                if (parentNode) {
                    const currentMins = envBuffer.gameDays ? (envBuffer.gameDays * 24 * 60 + envBuffer.Hour * 60 + envBuffer.Minute) : 0;
                    const newNode = MapService.generateDynamicNode(parentNode, loc.name, loc.type || 'Địa điểm', loc.description || '', currentMins);
                    worldBuffer.dynamicNodes = [...(worldBuffer.dynamicNodes || []), newNode];
                }
            }
        }

        // Also process t_ fields if they contain command-like strings
        const tFields: (keyof GameResponse)[] = ['t_npc', 't_state', 't_cmd', 't_var'];
        tFields.forEach(field => {
            const val = response[field];
            if (typeof val === 'string' && val.trim().length > 0) {
                const extracted = aiService.parseCommandBlock(val);
                if (extracted.length > 0) {
                    allCommands.push(...extracted);
                }
            }
        });

        if (allCommands.length > 0) {
            allCommands.forEach(cmd => {
                const res = applyStateCommand(charBuffer, envBuffer, socialBuffer, worldBuffer, battleBuffer, storyBuffer, taskListBuffer, appointmentListBuffer, playerSectBuffer, cmd.key, cmd.value, cmd.action);
                charBuffer = res.char;
                envBuffer = normalizeEnvironment(res.env);
                socialBuffer = standardizeSocialList(res.social);
                worldBuffer = normalizeWorldStatus(res.world);
                battleBuffer = normalizeCombatStatus(res.battle);
                storyBuffer = normalizeStoryStatus(res.story, envBuffer);
                taskListBuffer = res.taskList;
                appointmentListBuffer = res.appointmentList;
                playerSectBuffer = res.playerSect;
            });

            battleBuffer = autoClearAfterBattle(battleBuffer, storyBuffer);

            // Auto-recalculate currentWeight from itemList.
            // Items whose currentContainerId matches another item's ID are inside a container
            // and their weight is already counted via the container item's weight field.
            {
                const itemIds = new Set<string>(
                    (charBuffer.itemList || []).map((it: any) => it?.id).filter(Boolean)
                );
                let total = 0;
                for (const item of (charBuffer.itemList || [])) {
                    if (!item) continue;
                    if (item.currentContainerId && itemIds.has(item.currentContainerId)) continue;
                    total += typeof item.weight === 'number' ? item.weight : (parseFloat(item.weight) || 0);
                }
                charBuffer = { ...charBuffer, currentWeight: Math.round(total * 10) / 10 };
            }

            const finalState = {
                character: charBuffer,
                environment: envBuffer,
                social: socialBuffer,
                world: worldBuffer,
                battle: battleBuffer,
                story: storyBuffer,
                taskList: taskListBuffer,
                appointmentList: appointmentListBuffer,
                playerSect: playerSectBuffer
            };

            standardizeAndUpdateState(finalState);

            return finalState;
        }

        return {
            character: charBuffer,
            environment: envBuffer,
            social: socialBuffer,
            world: worldBuffer,
            battle: battleBuffer,
            story: storyBuffer
        };
    };

    const updateHistoryItem = (index: number, newRawText: string) => {
        let parsed: GameResponse;
        try {
            parsed = aiService.parseStoryRawText(newRawText);
        } catch (error: any) {
            console.error("Failed to update history: raw text parse failed", error?.message || error);
            return;
        }
        const newHistory = [...history];
        newHistory[index] = {
            ...newHistory[index],
            structuredResponse: parsed,
            rawJson: typeof newRawText === 'string' ? newRawText : '',
            content: "Parsed Content Updated"
        };
        setHistory(newHistory);
    };

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const buildContextSnapshot = (): ContextSnapshot => {
        const normalizedMem = standardizeMemorySystem(memorySystem);
        const recallConfig = apiConfig?.featureModelPlaceholder || ({} as any);
        const recallFeatureEnabled = Boolean(recallConfig.recallIndependentModelToggle);
        const recallMinRound = Math.max(1, Number(recallConfig.recallEarliestTriggerTurn) || 10);
        const nextRound = (Array.isArray(normalizedMem.recallArchives) ? normalizedMem.recallArchives.length : 0) + 1;
        const recallRoundReady = nextRound >= recallMinRound;
        const recallApi = getRecallApiConfig(apiConfig);
        const recallApiUsable = recallFeatureEnabled && isApiConfigUsable(recallApi);
        const recallContextMode = recallFeatureEnabled && recallRoundReady && recallApiUsable;
        const builtContext = buildSystemPrompt(
            prompts,
            normalizedMem,
            social,
            {
                character,
                environment: normalizeEnvironment(environment),
                world,
                battle,
                playerSect,
                taskList,
                appointmentList,
                story: normalizeStoryStatus(story, environment)
            },
            recallContextMode
                ? { disableMidLongMemory: true, disableShortMemory: true }
                : undefined
        );
        const historyScript = formatHistoryToScript(history) || 'None';
        const latestUserInput = [...history]
            .reverse()
            .find(item => item.role === 'user' && typeof item.content === 'string' && item.content.trim().length > 0)
            ?.content
            ?.trim() || 'None';
        const normalizedSnapshotGameConfig = normalizeGameSettings(gameConfig);
        const extraPrompt = typeof normalizedSnapshotGameConfig.extraPrompt === 'string' && normalizedSnapshotGameConfig.extraPrompt.trim().length > 0
            ? normalizedSnapshotGameConfig.extraPrompt.trim()
            : 'Not configured';
        const cotEnabled = normalizedSnapshotGameConfig.enablePseudoCotInjection !== false;
        const cotPseudoPrompt = cotEnabled ? buildCotDisguisePrompt(normalizedSnapshotGameConfig) : '';
        const styleAssistantPrompt = constructStorylineStyleAssistantPrompt(normalizedSnapshotGameConfig.storyStyle);
        const outputProtocolPrompt = builtContext.contextPieces.outputProtocolPrompt;
        const disclaimerRequirementPrompt = builtContext.contextPieces.disclaimerOutputPrompt;
        const sections: ContextSegment[] = [];
        let order = 1;
        const pushSection = (id: string, title: string, category: string, content: string) => {
            const trimmed = (content || '').trim();
            if (!trimmed) return;
            sections.push({
                id,
                title,
                category,
                order: order++,
                content: trimmed,
                tokenEstimate: estimateTextTokens(trimmed)
            });
        };

        pushSection('ai_role', 'AICharacter declaration', 'System', builtContext.contextPieces.aiCharacterDeclaration);
        pushSection('world_prompt', 'Worldview Prompt', 'System', builtContext.contextPieces.worldPrompt);
        pushSection('world_map', 'Maps and Buildings', 'System', builtContext.contextPieces.mapBuildingStatus);
        pushSection('npc_away', 'The following are characters not present', 'System', builtContext.contextPieces.leaveNpcArchive);
        pushSection('other_prompts', 'Narrative/Rule Prompt', 'System', builtContext.contextPieces.otherPrompts);
        pushSection('memory_long', 'Long-term memory', 'Memory', builtContext.contextPieces.longTermMemory);
        pushSection('memory_mid', 'Medium-term memory', 'Memory', builtContext.contextPieces.mediumTermMemory);
        pushSection('npc_present', 'The following are characters present', 'System', builtContext.contextPieces.presentNpcArchive);
        pushSection('game_settings', 'Game settings', 'System', builtContext.contextPieces.gameSettings);
        pushSection('story_plan', 'Story arrangement', 'System', builtContext.contextPieces.storyArrangement);

        pushSection('state_world', 'World', 'System', builtContext.contextPieces.worldState);
        pushSection('state_environment', 'Current environment', 'System', builtContext.contextPieces.environmentalState);
        pushSection('state_role', 'User character data', 'System', builtContext.contextPieces.characterStatus);
        pushSection('state_battle', 'Combat', 'System', builtContext.contextPieces.combatStatus);
        pushSection('state_sect', 'Player sect', 'System', builtContext.contextPieces.sectStatus);
        pushSection('state_tasks', 'Task list', 'System', builtContext.contextPieces.taskStatus);
        pushSection('state_agreements', 'Agreement list', 'System', builtContext.contextPieces.agreementStatus);
        pushSection('memory_short', 'Short-term memory', 'Memory', builtContext.shortMemoryContext);
        if (recallFeatureEnabled) {
            const fullN = Math.max(1, Number(apiConfig?.featureModelPlaceholder?.recallFullContextLimitN) || 20);
            const recallMemoryCorpus = constructContextForStorylineMemoryRetrieval(normalizedMem, fullN);
            const recallSystemPrompt = `${storyMemoryRetrievalCOTPrompt}\n\n${storylineMemoryRetrievalOutputFormatPrompt}`;
            pushSection('recall_system', 'Story Memory System Prompt', 'RecallAPI', recallSystemPrompt);
            pushSection('recall_corpus', 'Storyline memory retrieval database.', 'RecallAPI', recallMemoryCorpus);
        }
        pushSection('script', 'Xem nhanh cốt truyện (Script)', 'History', `【Xem nhanh cốt truyện (Script)】\n${historyScript}`);
        pushSection('player_input', 'Player input (Recent)', 'User', `< User input > ${latestUserInput} </User input>`);
        pushSection('style_assistant', 'Story Style Assistant message', 'System', styleAssistantPrompt);
        pushSection('output_protocol', 'Giao thức đầu ra thẻ', 'System', outputProtocolPrompt);
        // Disclaimer output requirements must be placed before the additional requirements prompt.
        pushSection('disclaimer_requirement', 'Yêu cầu xuất lời cảnh báo', 'System', disclaimerRequirementPrompt);
        // Additional requirement prompts are fixed at.COTBefore faking history messages。
        pushSection('extra_prompt', 'Extra Requirement Prompt', 'System', extraPrompt);
        // COTDisguised historical messages are fixed at the bottom.,Must be the last injected message in the snapshot.。
        // Injected content has no additional title wrapping.,Prevent the model from treating titles as learnable text patterns.。
        pushSection('cot_fake_history', 'COTFake history messages', 'System', cotPseudoPrompt || '');

        const fullText = sections.map(section => section.content).join('\n\n');
        return {
            sections,
            fullText,
            totalTokens: sections.reduce((sum, section) => sum + section.tokenEstimate, 0)
        };
    };

    // --- Core Send Logic ---
    const handleSend = async (
        content: string,
        isStreaming: boolean = true,
        options?: SendOptions
    ): Promise<SendResult> => {
        if (!content.trim() || loading) return {};
        const activeApi = getMainStoryApiConfig(apiConfig);
        const workerUrl = visualConfig?.textGenWorkerUrl;
        if (!hasAnyAiBackend(activeApi, workerUrl)) {
            alert("Vui lòng cấu hình API hoặc sử dụng Worker mặc định trong Cài đặt.");
            setShowSettings(true);
            return { cancelled: true };
        }

        // 1. Parse input and optional hidden recall tag
        const recallConfig = apiConfig?.featureModelPlaceholder || ({} as any);
        const recallFeatureEnabled = Boolean(recallConfig.recallIndependentModelToggle);
        const recallMinRound = Math.max(1, Number(recallConfig.recallEarliestTriggerTurn) || 10);
        const normalizedMemBeforeSend = standardizeMemorySystem(memorySystem);
        const nextRound = (Array.isArray(normalizedMemBeforeSend.recallArchives) ? normalizedMemBeforeSend.recallArchives.length : 0) + 1;
        const recallRoundReady = nextRound >= recallMinRound;
        const extracted = extractMemoryTag(content);
        let sendInput = extracted.cleanInput || content.trim();
        let recallTag = extracted.recallTag;
        let attachedRecallPreview = '';

        if (recallFeatureEnabled && recallRoundReady && !recallTag) {
            try {
                options?.onRecallProgress?.({ phase: 'start', text: 'Retrieving story memory......' });
                const recalled = await executeStoryMemoryRetrieval(
                    sendInput,
                    normalizedMemBeforeSend,
                    apiConfig,
                    {
                        onDelta: (_delta, accumulated) => {
                            options?.onRecallProgress?.({ phase: 'stream', text: accumulated });
                        },
                        workerUrl
                    }
                );
                if (!recalled) {
                    alert('Mô hình ký ức cốt truyện đã được bật, nhưng chưa có mô hình ký ức cốt truyện nào được cấu hình/API.');
                    setShowSettings(true);
                    return { cancelled: true };
                }
                attachedRecallPreview = recalled.previewText;
                options?.onRecallProgress?.({ phase: 'done', text: recalled.previewText });
                const silentConfirm = Boolean(apiConfig?.featureModelPlaceholder?.recallSilentConfirmation);
                if (!silentConfirm) {
                    return {
                        cancelled: true,
                        attachedRecallPreview: recalled.previewText,
                        preparedRecallTag: recalled.tagContent,
                        needRecallConfirm: true
                    };
                }
                recallTag = recalled.tagContent;
            } catch (e: any) {
                console.error('Story Memory retrieval failed', e);
                options?.onRecallProgress?.({ phase: 'error', text: e?.message || 'Story Memory retrieval failed' });
                alert(`Truy xuất ký ức cốt truyện thất bại: ${e?.message || 'Lỗi không rõ'}`);
                return { cancelled: true };
            }
        }

        if (!sendInput.trim()) {
            return { cancelled: true };
        }

        // 2. Calculate Game Time String
        const canonicalTime = normalizeCanonicalGameTime(environment.Hour?.toString() || '6');
        const currentGameTime = canonicalTime || environment.Hour?.toString() || `No.${environment.gameDays || 1}Day`;
        const historyBeforeSend = [...history];
        const memBeforeSend = normalizedMemBeforeSend;
        pushRollSnapshot({
            playerInput: sendInput,
            gameTime: currentGameTime,
            stateBeforeRollback: {
                character: deepCopy(character),
                environment: normalizeEnvironment(deepCopy(environment)),
                social: deepCopy(social),
                world: deepCopy(world),
                battle: deepCopy(battle),
                playerSect: deepCopy(playerSect),
                taskList: deepCopy(taskList),
                appointmentList: deepCopy(appointmentList),
                story: deepCopy(story),
                memorySystem: deepCopy(memBeforeSend)
            },
            historyBeforeRollback: deepCopy(historyBeforeSend)
        });

        // 3. Trim history window for AI context only (UI history must remain complete)
        let contextHistory = [...historyBeforeSend];
        if (contextHistory.length >= 20) {
            contextHistory = contextHistory.slice(-15);
        }
        const updatedMemSys = standardizeMemorySystem(memBeforeSend);

        // 4. Prepare New Message
        const newUserMsg: ChatHistory = {
            role: 'user',
            content: sendInput,
            timestamp: Date.now(),
            gameTime: currentGameTime
        };
        const updatedContextHistory = [...contextHistory, newUserMsg];
        const updatedDisplayHistory = [...historyBeforeSend, newUserMsg];
        setHistory(updatedDisplayHistory);
        setLoading(true);
        setIsGenerating(true);
        setGenerationStartTime(Date.now());
        setGenerationMetadata(undefined);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            // 5. Construct System Prompt
            const recallContextActiveForMain = recallFeatureEnabled && Boolean(recallTag);
            const currentNormalizedEnv = normalizeEnvironment(environment);
            const nearbyNodes = MapService.getNodesByProximity(currentNormalizedEnv.x || 0, currentNormalizedEnv.y || 0, 100);

            const builtContext = buildSystemPrompt(
                prompts,
                updatedMemSys,
                social,
                {
                    character,
                    environment: { ...currentNormalizedEnv, nearbyNodes },
                    world,
                    battle,
                    playerSect,
                    taskList,
                    appointmentList,
                    story: normalizeStoryStatus(story, environment)
                },
                recallContextActiveForMain
                    ? { disableMidLongMemory: true, disableShortMemory: true }
                    : undefined
            );
            const contextImmediate = [
                builtContext.shortMemoryContext,
                `【Instant story review(Script)】\n${formatHistoryToScript(updatedContextHistory) || 'None'}`,
                recallTag ? `【Story memory】\n${recallTag}` : ''
            ].filter(Boolean).join('\n\n');

            let streamMarker = 0;
            const useStream = isStreaming;
            if (useStream) {
                streamMarker = Date.now();
                setHistory([
                    ...updatedDisplayHistory,
                    {
                        role: 'assistant',
                        content: '',
                        timestamp: streamMarker,
                        gameTime: currentGameTime
                    }
                ]);
            }

            // 6. Call AI Service
            const runtimeGameConfig = normalizeGameSettings(gameConfig);
            const lengthRequirementPrompt = builtContext.contextPieces.wordCountRequirementPrompt;
            const disclaimerRequirementPrompt = builtContext.contextPieces.disclaimerOutputPrompt || undefined;
            const outputProtocolPrompt = builtContext.contextPieces.outputProtocolPrompt;

            const inputTokens = estimateTextTokens(builtContext.systemPrompt + contextImmediate + sendInput);
            setGenerationMetadata({ input: inputTokens, output: 0 });

            const aiResult = await aiService.generateStoryResponse(
                builtContext.systemPrompt,
                contextImmediate,
                sendInput,
                activeApi,
                controller.signal,
                useStream
                    ? {
                        stream: true,
                        onDelta: (_delta, accumulated) => {
                            setHistory(prev => prev.map(item => {
                                if (
                                    item.timestamp === streamMarker &&
                                    item.role === 'assistant' &&
                                    !item.structuredResponse
                                ) {
                                    return { ...item, content: accumulated };
                                }
                                return item;
                            }));
                        }
                    }
                    : undefined,
                runtimeGameConfig.extraPrompt,
                {
                    enableCotInjection: runtimeGameConfig.enablePseudoCotInjection !== false,
                    leadingSystemPrompt: builtContext.contextPieces.aiCharacterDeclaration,
                    styleAssistantPrompt: constructStorylineStyleAssistantPrompt(runtimeGameConfig.storyStyle),
                    outputProtocolPrompt,
                    cotPseudoHistoryPrompt: buildCotDisguisePrompt(runtimeGameConfig),
                    lengthRequirementPrompt,
                    disclaimerRequirementPrompt,
                    errorDetailLimit: Number.POSITIVE_INFINITY,
                    enableClaudeMode: (runtimeGameConfig as any).enableClaudeMode === true,
                    enableTagIntegrityCheck: (runtimeGameConfig as any).enableTagIntegrityCheck === true
                },
                workerUrl
            );
            const aiData = aiResult.response;
            const outputTokens = estimateTextTokens(aiResult.rawText);
            setGenerationMetadata(prev => prev ? { ...prev, output: outputTokens } : { input: 0, output: outputTokens });

            if (aiData && aiData.story) {
                if (aiData.story.narrative) {
                    aiData.story.narrative = formatNarrative(aiData.story.narrative);
                }
            }

            // NPC Discovery: Identify NPCs mentioned in the story response
            const responseNpcs = Array.isArray(aiData?.logs) 
                ? aiData.logs.map((log: any) => log.sender).filter((sender: string) => sender && sender !== 'Hệ thống')
                : [];
            const discoveredNpcIds = (world.activeNpcList || [])
                .filter((npc: any) => responseNpcs.includes(npc.fullName) || responseNpcs.includes(npc.appellation))
                .map((npc: any) => npc.id);

            if (discoveredNpcIds.length > 0) {
                setWorld(prev => ({
                    ...prev,
                    metNpcIds: [...new Set([...(prev.metNpcIds || []), ...discoveredNpcIds])]
                }));
            }

            // 7. Process Result
            const processedState = processResponseCommands(aiData);

            const immediateEntry = buildRealTimeMemoryEntry(currentGameTime, sendInput, aiData);
            const shortEntry = buildShortTermMemoryEntry(currentGameTime, sendInput, aiData);
            setMemorySystem(prev => writeFourMemorySegments(standardizeMemorySystem(prev), immediateEntry, shortEntry));

            const newAiMsg: ChatHistory = {
                role: 'assistant',
                content: "Structured Response",
                structuredResponse: aiData,
                rawJson: getRawAiMessage(aiResult.rawText),
                timestamp: Date.now(),
                gameTime: currentGameTime
            };
            if (useStream) {
                setHistory(prev => prev.map(item => {
                    if (
                        item.timestamp === streamMarker &&
                        item.role === 'assistant' &&
                        !item.structuredResponse
                    ) {
                        return { ...newAiMsg };
                    }
                    return item;
                }));
            } else {
                setHistory([...updatedDisplayHistory, newAiMsg]);
            }

            // 8. Auto Save Trigger
            void performAutoSave({
                history: [...updatedDisplayHistory, newAiMsg],
                stateOverride: processedState
            });

            // 9. Increment action count and check for auto-summarization
            const currentActionCount = Number(story.actionCountSinceLastChapter) || 0;
            const nextActionCount = currentActionCount + 1;

            if (nextActionCount >= 5) {
                // Trigger auto summarization (deferred to avoid blocking UI)
                setTimeout(() => {
                    handleSummarizeChapter();
                }, 500);
            } else {
                setStory(prev => ({ ...prev, actionCountSinceLastChapter: nextActionCount }));
            }

            return { attachedRecallPreview };

        } catch (error: any) {
            if (error.name === 'AbortError') {
                const snapshot = popRollSnapshot();
                if (snapshot) {
                    rollBackToSnapshot(snapshot);
                } else {
                    setHistory(historyBeforeSend);
                    setMemorySystem(memBeforeSend);
                }
                console.log("Request aborted by user");
                return { cancelled: true };
            } else if (error instanceof aiService.StoryResponseParseError || error?.name === 'StoryResponseParseError') {
                // Do not write pseudo-structures when parsing fails. assistant Message,Handed over to the frontend popup to confirm whether to restart.ROLL。
                setHistory(historyBeforeSend);
                setMemorySystem(memBeforeSend);
                const parseErrorRaw = extractParseError(error);
                return {
                    cancelled: true,
                    needRerollConfirm: true,
                    parseErrorMessage: parseErrorRaw,
                    parseErrorDetail: parseErrorRaw,
                    rawContent: (error as any).rawText || '',
                    canShowRaw: true
                };
            } else {
                popRollSnapshot();
                const detail = formatErrorDetails(error);
                const summary = typeof error?.message === 'string' && error.message.trim().length > 0
                    ? error.message
                    : (typeof error === 'string' ? error : 'Unknown error');
                // Removed permanent system error message from history as requested
                // const errorMsg: ChatHistory = { role: 'system', content: `[System error]: ${summary}`, timestamp: Date.now() };
                // setHistory([...updatedDisplayHistory, errorMsg]);

                return {
                    cancelled: true,
                    errorDetail: detail,
                    errorTitle: 'Yêu cầu thất bại'
                };
            }
        } finally {
            setLoading(false);
            setIsGenerating(false);
            setGenerationStartTime(undefined);
            setGenerationMetadata(undefined);
            abortControllerRef.current = null;
        }
        return {};
    };

    const handleSummarizeChapter = async () => {
        if (loading || isGenerating) return;

        try {
            setLoading(true);
            setIsGenerating(true);

            const currentChapter = story.currentChapter;
            if (!currentChapter) return;

            const activeApi = getMainStoryApiConfig(apiConfig);
            const workerUrl = visualConfig?.textGenWorkerUrl;

            // Structured summarization prompt for JSON mode
            const summaryPrompt = `Hãy tóm tắt diễn biến chính của chương này (Chương ${currentChapter.index}: ${currentChapter.title}) dựa trên các hành động vừa qua. Tóm tắt ngắn gọn, súc tích trong khoảng 100-150 chữ. Tập trung vào các sự kiện quan trọng nhất.

YÊU CẦU ĐỊNH DẠNG JSON (BẮT BUỘC):
{
  "story": { "narrative": "Nội dung tóm tắt ở đây..." },
  "logs": [
    { "sender": "Hệ thống", "text": "Tóm tắt chương ${currentChapter.index} đã hoàn tất." }
  ],
  "shortTerm": "Tóm tắt chương ${currentChapter.index}",
  "tavern_commands": []
}`;

            const aiResult = await aiService.generateStoryResponse(
                "Bạn là một biên tập viên tiểu thuyết kiếm hiệp chuyên nghiệp. Hãy tóm tắt chương truyện một cách lôi cuốn.",
                `Nội dung chương hiện tại:\nTitle: ${currentChapter.title}\nBackground: ${currentChapter.backgroundStory}\n\nDiễn biến gần đây:\n${formatHistoryToScript(history.slice(-15))}`,
                summaryPrompt,
                activeApi,
                undefined,
                undefined,
                undefined,
                { enableCotInjection: false },
                workerUrl
            );

            const summary = formatNarrative(aiResult.response?.story?.narrative || aiResult.rawText || "Cốt truyện tiếp diễn...");

            setStory(prev => {
                const updatedCurrent = { ...prev.currentChapter, summary };
                const newArchive = [...prev.historicalArchives, updatedCurrent];
                const nextIndex = newArchive.length + 1;

                return {
                    ...prev,
                    historicalArchives: newArchive,
                    currentChapter: {
                        index: nextIndex,
                        title: `Hồi ${nextIndex}`,
                        backgroundStory: summary,
                        summary: '',
                        events: []
                    },
                    actionCountSinceLastChapter: 0
                };
            });

            void performAutoSave({});

        } catch (error) {
            console.error("Failed to summarize chapter:", error);
            alert("Không thể tóm tắt chương: " + (error as any).message);
        } finally {
            setLoading(false);
            setIsGenerating(false);
        }
    };

    const handleRegenerate = (): string | null => {
        if (loading) return null;
        const snapshot = popRollSnapshot();
        if (!snapshot) return null;
        rollBackToSnapshot(snapshot);
        return snapshot.playerInput;
    };

    const handleClearHistory = async () => {
        setHistory([]);
        setMemorySystem(createEmptyMemorySystem());
        clearRollSnapshot();
        // Reset action count too
        setStory(prev => ({ ...prev, actionCountSinceLastChapter: 0 }));
        void performAutoSave({ history: [] });
    };

    const handleQuickRestart = async (mode: FastRestartMode = 'all') => {
        if (loading || !recentStartingConfig) return;
        clearRollSnapshot();
        resetAutoSaveStatus();
        const worldConfig = deepCopy(recentStartingConfig.worldConfig);
        const charData = deepCopy(recentStartingConfig.charData);
        const openingStreaming = recentStartingConfig.openingStreaming;

        if (mode === 'world_only') {
            await handleGenerateWorld(
                worldConfig,
                charData,
                'step',
                openingStreaming
            );
            return;
        }

        if (mode === 'opening_only') {
            const currentApi = getMainStoryApiConfig(apiConfig);
            const workerUrl = visualConfig?.textGenWorkerUrl;
            if (!hasAnyAiBackend(currentApi, workerUrl)) {
                alert("Vui lòng cấu hình API hoặc sử dụng Worker mặc định trong Cài đặt.");
                setShowSettings(true);
                return;
            }
            const openingBase = createStartingBasicStatus(charData, worldConfig);
            if (view !== 'game') {
                setView('game');
            }
            setLoading(true);
            setIsGenerating(true);
            setGenerationStartTime(Date.now());
            setGenerationMetadata(undefined);
            try {
                await generateOpeningStory(openingBase, prompts, openingStreaming, currentApi);
            } catch (error: any) {
                console.error('Initial story regeneration failed', error);
                alert(`Tạo lại cốt truyện mở đầu thất bại: ${error?.message || 'Lỗi không rõ'}`);
            } finally {
                setLoading(false);
                setIsGenerating(false);
            }
            return;
        }

        await handleGenerateWorld(
            worldConfig,
            charData,
            'all',
            openingStreaming
        );
    };

    // --- Persistence ---

    const saveSettings = async (newConfig: ApiSettings) => {
        const normalized = normalizeApiSettings(newConfig);
        console.log('[useGame] Persisting API settings:', normalized);

        // Auto-turn off NSFW prompt when useSystemGemini state changes
        // This prevents accidental NSFW generation when switching environments
        if (apiConfig.useSystemGemini !== normalized.useSystemGemini) {
            const nsfwPromptIndex = prompts.findIndex(p => p.id === 'writing_nsfw');
            if (nsfwPromptIndex !== -1 && prompts[nsfwPromptIndex].enabled) {
                const newPrompts = [...prompts];
                newPrompts[nsfwPromptIndex] = {
                    ...newPrompts[nsfwPromptIndex],
                    enabled: false
                };
                setPrompts(newPrompts);
                await dbService.saveSetting('prompts', newPrompts);
            }
        }

        setApiConfig(normalized);
        await dbService.saveSetting('api_settings', normalized);
    };
    const saveVisualSettings = async (newConfig: VisualSettings) => {
        setVisualConfig(newConfig);
        await dbService.saveSetting('visual_settings', newConfig);
    }
    const saveGameSettings = async (newConfig: GameSettings) => {
        const normalized = normalizeGameSettings(newConfig);
        setGameConfig(normalized);
        await dbService.saveSetting('game_settings', normalized);
    }
    const saveMemorySettings = async (newConfig: MemoryConfig) => {
        const normalized = standardizeMemoryConfig(newConfig);
        setMemoryConfig(normalized);
        await dbService.saveSetting('memory_settings', normalized);
    }
    const updatePrompts = async (newPrompts: PromptStructure[]) => {
        setPrompts(newPrompts);
        await dbService.saveSetting('prompts', newPrompts);
    };
    const updateFestivals = async (newFestivals: FestivalStructure[]) => {
        setFestivals(newFestivals);
        await dbService.saveSetting('festivals', newFestivals);
    };
    const saveTavernSettings = async (newConfig: TavernSettingsStructure) => {
        setTavernSettings(newConfig);
        await dbService.saveSetting('tavern_settings', newConfig);
    };

    const SAVE_FORMAT_VERSION = 2;
    const MIN_AUTO_SAVE_INTERVAL = 30000;

    const buildArchiveHistory = (sourceHistory?: ChatHistory[]): ChatHistory[] => {
        const rawHistory = Array.isArray(sourceHistory)
            ? sourceHistory
            : (Array.isArray(gameState.history) ? gameState.history : []);
        return deepCopy(rawHistory);
    };

    const buildArchiveMemorySystem = (): MemorySystem => {
        const normalizedMemory = standardizeMemorySystem(memorySystem);
        return deepCopy(normalizedMemory);
    };

    const buildAutoSaveSignature = (sourceHistory?: ChatHistory[]): string => {
        const historyBase = Array.isArray(sourceHistory)
            ? sourceHistory
            : (Array.isArray(gameState.history) ? gameState.history : []);
        const historySize = historyBase.length;
        const latestMsg = historySize > 0 ? historyBase[historySize - 1] : null;
        const latestDigest = latestMsg
            ? `${latestMsg.role}:${latestMsg.timestamp}:${(latestMsg.content || '').toString().slice(0, 30)}`
            : 'none';
        const timeText = normalizeCanonicalGameTime(gameState.environment.gameDays > 0 ? gameState.environment : null) || '1:01:01:06:00';
        const locationText = buildFullLocation(gameState.environment) || '';
        const socialCount = Array.isArray(gameState.social) ? gameState.social.length : 0;
        return `${timeText}|${locationText}|${historySize}|${latestDigest}|${socialCount}`;
    };

    const createSaveData = (
        type: 'manual' | 'auto',
        autoSignature?: string,
        snapshot?: {
            history?: ChatHistory[]; stateOverride?: {
                character?: CharacterData;
                environment?: EnvironmentData;
                social?: any[];
                world?: WorldDataStructure;
                battle?: BattleStatus;
                playerSect?: DetailedSectStructure;
                taskList?: any[];
                appointmentList?: any[];
                story?: StorySystemStructure;
            }
        }
    ): Omit<SaveStructure, 'id'> => {
        const historySource = Array.isArray(snapshot?.history)
            ? snapshot.history
            : (Array.isArray(gameState.history) ? gameState.history : []);
        const historySnapshot = buildArchiveHistory(historySource);
        const rawPromptsSnapshot = deepCopy(prompts);
        const promptsSnapshot = Array.isArray(rawPromptsSnapshot) ? rawPromptsSnapshot : undefined;
        const so = snapshot?.stateOverride;

        return {
            type: type,
            timestamp: Date.now(),
            metadata: {
                schemaVersion: SAVE_FORMAT_VERSION,
                historyItemCount: historySnapshot.length,
                isHistoryTrimmed: false,
                includesPromptSnapshot: Boolean(promptsSnapshot),
                autoSaveSignature: type === 'auto' ? (autoSignature || '') : undefined
            },
            characterData: deepCopy(so?.character ?? gameState.character),
            environmentInfo: normalizeEnvironment(deepCopy(so?.environment ?? gameState.environment)),
            history: historySnapshot,
            social: deepCopy(so?.social ?? gameState.social),
            world: deepCopy(so?.world ?? gameState.world),
            battle: deepCopy(so?.battle ?? gameState.battle),
            playerSect: deepCopy(so?.playerSect ?? gameState.playerSect),
            taskList: deepCopy(so?.taskList ?? gameState.taskList),
            appointmentList: deepCopy(so?.appointmentList ?? gameState.appointmentList),
            storyId: storyId,
            story: normalizeStoryStatus(deepCopy(so?.story ?? gameState.story), deepCopy(so?.environment ?? gameState.environment)),

            memorySystem: buildArchiveMemorySystem(),
            gameSettings: deepCopy(gameState.gameConfig),
            memoryConfig: deepCopy(gameState.memoryConfig),
            visualConfig: deepCopy(gameState.visualConfig),
            promptSnapshot: promptsSnapshot
        };
    };

    const handleSaveGame = async () => {
        const save = createSaveData('manual');
        await dbService.saveArchive(save);
        setHasSave(true);
    };

    const performAutoSave = async (snapshot?: {
        history?: ChatHistory[]; stateOverride?: {
            character?: CharacterData;
            environment?: EnvironmentData;
            social?: any[];
            world?: WorldDataStructure;
            battle?: BattleStatus;
            playerSect?: DetailedSectStructure;
            taskList?: any[];
            appointmentList?: any[];
            story?: StorySystemStructure;
        }
    }) => {
        const historySource = Array.isArray(snapshot?.history)
            ? snapshot.history
            : (Array.isArray(gameState.history) ? gameState.history : []);
        // Removed history.length === 0 check to allow starting state saves
        const signature = buildAutoSaveSignature(historySource);
        const now = Date.now();
        if (signature && signature === recentAutoSaveSignatureRef.current) return;
        if (
            recentAutoSaveTimestampRef.current > 0 &&
            now - recentAutoSaveTimestampRef.current < MIN_AUTO_SAVE_INTERVAL
        ) {
            return;
        }

        try {
            const save = createSaveData('auto', signature, { history: historySource, stateOverride: snapshot?.stateOverride });
            await dbService.saveArchive(save);
            recentAutoSaveSignatureRef.current = signature;
            recentAutoSaveTimestampRef.current = now;
            setHasSave(true);
        } catch (error) {
            console.error('Auto-save failed', error);
        }
    };

    const handleLoadGame = async (save: SaveStructure) => {
        clearRollSnapshot();
        resetAutoSaveStatus();
        setRecentStartingConfig(null);
        setCharacter(normalizeInventoryMapping(save.characterData));
        setEnvironment(normalizeEnvironment(save.environmentInfo || createBlankStartEnvironment()));
        setSocial(standardizeSocialList(save.social || []));
        setWorld(normalizeWorldStatus(save.world || createOpeningBlankWorld()));
        setBattle(normalizeCombatStatus(save.battle || createOpeningBlankBattle()));
        setPlayerSect(save.playerSect || createEmptySectStatus());
        setTaskList(save.taskList || []);
        setAppointmentList(save.appointmentList || []);
        setStory(normalizeStoryStatus(
            save.story || createBlankOpeningStory(),
            save.environmentInfo || createBlankStartEnvironment()
        ));

        setHistory(Array.isArray(save.history) ? save.history : []);
        setMemorySystem(standardizeMemorySystem(save.memorySystem));
        setStoryId(save.storyId);

        if (save.gameSettings) setGameConfig(normalizeGameSettings(save.gameSettings));
        if (save.memoryConfig) setMemoryConfig(standardizeMemoryConfig(save.memoryConfig));
        if (save.visualConfig) setVisualConfig(save.visualConfig);
        if (Array.isArray(save.promptSnapshot)) {
            setPrompts(save.promptSnapshot);
            await dbService.saveSetting('prompts', save.promptSnapshot);
        }

        setHasSave(true);
        setView('game');
        setShowSaveLoad({ show: false, mode: 'load' });
    };


    const updateNpcMajorRole = (npcId: string, isMajor: boolean) => {
        if (!npcId) return;
        setSocial((prev) => {
            const baseList = Array.isArray(prev) ? prev : [];
            const nextList = baseList.map((npc: any) => {
                if (!npc || npc.id !== npcId) return npc;
                return {
                    ...npc,
                    isImportant: isMajor
                };
            });
            return standardizeSocialList(nextList, { mergeSameNames: false });
        });
    };



    return {
        state: gameState,
        meta: {
            canRerollLatest: repeatableRollCount > 0,
            canQuickRestart: Boolean(recentStartingConfig)
        },
        setters: {
            setShowSettings, setShowInventory, setShowEquipment, setShowSocial, setShowTeam, setShowKungfu, setShowWorld, setShowMap, setShowSect, setShowTask, setShowAgreement, setShowStory, setShowMemory, setShowSaveLoad,
            setActiveTab, setCurrentTheme,
            setApiConfig, setVisualConfig, setPrompts,
            setBattle, setCharacter, setSocial, setWorld, setPlayerSect, setTaskList, setAppointmentList, setStory, setHistory, setEnvironment
        },
        actions: {
            handleSend,
            handleStop,
            handleRegenerate,
            handleClearHistory,
            saveSettings, saveVisualSettings, saveGameSettings, saveMemorySettings, saveTavernSettings,
            updatePrompts, updateFestivals,
            handleSaveGame, handleLoadGame,
            updateHistoryItem,
            handleStartNewGameWizard,
            handleGenerateWorld,
            handleReturnToHome,
            handleQuickRestart,
            updateNpcMajorRole,

            handleSummarizeChapter,
            getContextSnapshot: buildContextSnapshot
        }
    };
};



