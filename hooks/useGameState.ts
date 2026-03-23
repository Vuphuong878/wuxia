
import { useState, useEffect, useRef } from 'react';
import {
    CharacterData,
    EnvironmentData as EnvironmentInfo,
    ChatHistory,
    ApiSettings,
    PromptStructure,
    ThemePreset,
    VisualSettings,
    FestivalStructure,
    NpcStructure,
    WorldDataStructure as WorldData,
    DetailedSectStructure as DetailedSect,
    QuestStructure as TaskStructure,
    AppointmentStructure,
    StorySystemStructure as StorySystem,
    GameSettings,
    MemoryConfig,
    MemorySystem,
    BattleStatus,
    TavernSettingsStructure,
    CoreStats
} from '../types';
import { DefaultPrompts } from '../prompts';
import { defaultMidToLongMemoryPrompt, defaultShortToMidMemoryPrompt, defaultExtraSystemPrompt, legacyDefaultAdditionalSystemPrompt } from '../prompts/runtime/defaults';
import { festivalList } from '../data/world';
import * as dbService from '../services/dbService';
import { PromptSyncService } from '../services/promptSyncService';
import { THEMES } from '../styles/themes';
import { createEmptyApiSettings, normalizeApiSettings } from '../utils/apiConfig';
import { estimateHistoryTokens } from '../utils/tokenEstimate';

const normalizeTavernSettings = (raw?: Partial<TavernSettingsStructure> | null): TavernSettingsStructure => ({
    enabled: raw?.enabled ?? false,
    activePresetId: raw?.activePresetId ?? null,
    postProcessing: raw?.postProcessing ?? 'Thêm vào sau prompt thế giới/cốt truyện gốc',
    presets: raw?.presets ?? []
});

export const useGameState = () => {
    const createEmptyCharacter = (): CharacterData => {
        const emptyStats: CoreStats = {
            strength: 0,
            agility: 0,
            constitution: 0,
            rootBone: 0,
            intelligence: 0,
            luck: 0,
            tamTinh: 5
        };

        return {
            name: '',
            gender: 'Nam',
            age: 16,
            avatar: '',
            birthDate: '',
            appearance: '',
            title: '',
            realm: '',
            talentList: [],
            background: { name: '', description: '', effect: '' },
            sectId: 'none',
            sectPosition: 'None',
            sectContribution: 0,
            money: { gold: 0, silver: 0, copper: 0 },
            currentEnergy: 0,
            maxEnergy: 0,
            currentFullness: 0,
            maxFullness: 0,
            currentThirst: 0,
            maxThirst: 0,
            meridianStatus: 'Bình thường',
            currentWeight: 0,
            maxWeight: 0,
            ...emptyStats,
            baseStats: { ...emptyStats },
            headCurrentHp: 0, headMaxHp: 0, headStatus: '',
            chestCurrentHp: 0, chestMaxHp: 0, chestStatus: '',
            abdomenCurrentHp: 0, abdomenMaxHp: 0, abdomenStatus: '',
            leftArmCurrentHp: 0, leftArmMaxHp: 0, leftArmStatus: '',
            rightArmCurrentHp: 0, rightArmMaxHp: 0, rightArmStatus: '',
            leftLegCurrentHp: 0, leftLegMaxHp: 0, leftLegStatus: '',
            rightLegCurrentHp: 0, rightLegMaxHp: 0, rightLegStatus: '',
            equipment: {
                head: 'None', chest: 'None', legs: 'None', hands: 'None', feet: 'None',
                mainWeapon: 'None', subWeapon: 'None', hiddenWeapon: 'None', back: 'None', waist: 'None', mount: 'None'
            },
            itemList: [],
            kungfuList: [],
            currentExp: 0,
            levelUpExp: 0,
            playerBuffs: [],
            personality: '',
            isDead: false
        };
    };
    const createEmptyEnvironment = (): EnvironmentInfo => ({
        gameDays: 1,
        year: 1,
        month: 1,
        day: 1,
        hour: 6,
        timeProgressEnabled: true,
        weather: { type: 'Nắng ráo', intensity: 50, description: 'Trời quang mây tạnh' },
        festival: null,
        currentRegionId: '',
        currentAreaId: '',
        envVariables: null,
        time: 'Sáng',
        season: 'Xuân'
    });

    const createEmptyWorld = (): WorldData => ({
        activeNpcList: [],
        maps: [],
        buildings: [],
        ongoingEvents: [],
        settledEvents: [],
        worldHistory: []
    });

    const createEmptySect = (): DetailedSect => ({
        id: 'none',
        name: 'No sect affiliation',
        description: 'Has not joined any sect yet。',
        sectFunds: 0,
        sectResources: 0,
        constructionLevel: 0,
        playerPosition: 'None',
        playerContribution: 0,
        taskList: [],
        exchangeList: [],
        importantMembers: [],
        sectRules: [],
        introduction: ''
    });

    const createEmptyStory = (): StorySystem => ({
        currentChapter: {
            id: '',
            index: 1,
            title: '',
            summary: '',
            backgroundStory: '',
            mainConflict: '',
            endConditions: [],
            foreshadowingList: []
        },
        nextChapterPreview: {
            title: '',
            outline: ''
        },
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



    // Persistence
    const [view, setView] = useState<'home' | 'game' | 'new_game'>('home');
    const [hasSave, setHasSave] = useState(false);

    // Game State
    const [character, setCharacter] = useState<CharacterData>(() => createEmptyCharacter());

    // Monitor for death condition (1 in 5 primary stats reaches 0)
    useEffect(() => {
        if (view === 'game' && character.name && !character.isDead) {
            const coreStatsToWatch = [
                character.strength,
                character.agility,
                character.constitution,
                character.rootBone,
                character.intelligence
            ];

            if (coreStatsToWatch.some(stat => stat <= 0)) {
                console.log('Character has died due to a primary core stat reaching zero.');
                setCharacter(prev => ({ ...prev, isDead: true }));
                // Trigger game over or notification logic here if needed
            }
        }
    }, [
        view,
        character.name, // Added character.name to dependencies
        character.strength,
        character.agility,
        character.constitution,
        character.rootBone,
        character.intelligence,
        character.isDead
    ]);
    const [environment, setEnvironment] = useState<EnvironmentInfo>(() => createEmptyEnvironment());
    const [social, setSocial] = useState<NpcStructure[]>([]);
    const [world, setWorld] = useState<WorldData>(() => createEmptyWorld());
    const [battle, setBattle] = useState<BattleStatus>(() => ({
        isInBattle: false,
        enemy: null
    }));
    const [playerSect, setPlayerSect] = useState<DetailedSect>(() => createEmptySect());
    const [taskList, setTaskList] = useState<TaskStructure[]>([]);
    const [appointmentList, setAppointmentList] = useState<AppointmentStructure[]>([]);
    const [story, setStory] = useState<StorySystem>(() => createEmptyStory());
    const [storyId, setStoryId] = useState<string | undefined>(undefined);

    // New Game State for Memory
    const [memorySystem, setMemorySystem] = useState<MemorySystem>({
        recallArchives: [],
        instantMemory: [],
        shortTermMemory: [],
        midTermMemory: [],
        longTermMemory: []
    });

    const [history, setHistory] = useState<ChatHistory[]>([]);
    const [loading, setLoading] = useState(false);

    const [worldEvents, setWorldEvents] = useState<string[]>([]);

    // UI/System State
    const [showSettings, setShowSettings] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [showEquipment, setShowEquipment] = useState(false);
    const [showSocial, setShowSocial] = useState(false);
    const [showTeam, setShowTeam] = useState(false);
    const [showKungfu, setShowKungfu] = useState(false);
    const [showWorld, setShowWorld] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showSect, setShowSect] = useState(false);
    const [showTask, setShowTask] = useState(false);
    const [showAgreement, setShowAgreement] = useState(false);
    const [showStory, setShowStory] = useState(false);
    const [showMemory, setShowMemory] = useState(false);
    const [showSaveLoad, setShowSaveLoad] = useState<{ show: boolean, mode: 'save' | 'load' }>({ show: false, mode: 'save' });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStartTime, setGenerationStartTime] = useState<number | undefined>(undefined);
    const [generationMetadata, setGenerationMetadata] = useState<{ input: number, output: number } | undefined>(undefined);

    const [activeTab, setActiveTab] = useState<'api' | 'recall' | 'prompt' | 'storage' | 'theme' | 'visual' | 'world' | 'game' | 'memory' | 'history' | 'context' | 'article_optimization' | 'world_evolution' | 'realworld'>('api');
    const [showVisualSummary, setShowVisualSummary] = useState(false);

    // Status State
    const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

    // Config State
    const [apiConfig, setApiConfig] = useState<ApiSettings>(() => createEmptyApiSettings());
    const [visualConfig, setVisualConfig] = useState<VisualSettings>({
        timeFormat: 'Traditional',
        renderLayers: 30,
        areaSettings: {},
        importedFonts: [],
        defaultFontSizeChat: 16,
        defaultLineHeightChat: 1.6,
        imageGenWorkerUrl: 'https://wuxia-image-gen.vudinhtrungv1010.workers.dev',
        textGenWorkerUrl: 'https://wuxia-nemotron-worker.vudinhtrungv1010.workers.dev'
    });
    const defaultGameSettings: GameSettings = {
        bodyLengthRequirement: 1500,
        narrativePerspective: 'Ngôi thứ hai',
        enableActionOptions: true,
        enablePseudoCotInjection: true,
        enableMultiThinking: false,
        enableNsfwMode: false,
        enablePreventSpeaking: true,
        enableDisclaimerOutput: true,
        enableRealWorldMode: false,
        storyStyle: 'Thông thường',
        ntlHaremTier: 'Không giới hạn',
        extraPrompt: defaultExtraSystemPrompt
    };
    const normalizeGameSettings = (raw?: Partial<GameSettings> | null): GameSettings => ({
        ...defaultGameSettings,
        ...(raw || {}),
        bodyLengthRequirement: (() => {
            const candidate = raw?.bodyLengthRequirement as unknown;
            if (typeof candidate === 'number' && Number.isFinite(candidate)) {
                // Force update from legacy default (10000) to current default
                if (candidate === 10000) return defaultGameSettings.bodyLengthRequirement;
                return Math.max(50, Math.floor(candidate));
            }
            if (typeof candidate === 'string') {
                const n = Number(candidate.replace(/[^\d]/g, ''));
                if (Number.isFinite(n) && n > 0) {
                    if (n === 10000) return defaultGameSettings.bodyLengthRequirement;
                    return Math.max(50, Math.floor(n));
                }
            }
            return defaultGameSettings.bodyLengthRequirement;
        })(),
        narrativePerspective: raw?.narrativePerspective === 'Ngôi thứ nhất' || raw?.narrativePerspective === 'Ngôi thứ hai' || raw?.narrativePerspective === 'Ngôi thứ ba'
            ? raw.narrativePerspective
            : defaultGameSettings.narrativePerspective,
        enableActionOptions: raw?.enableActionOptions !== false,
        enablePseudoCotInjection: raw?.enablePseudoCotInjection !== false,
        enableMultiThinking: raw?.enableMultiThinking === true,
        enableNsfwMode: raw?.enableNsfwMode === true,
        enablePreventSpeaking: raw?.enablePreventSpeaking !== false,
        enableDisclaimerOutput: raw?.enableDisclaimerOutput !== false,
        enableRealWorldMode: raw?.enableRealWorldMode === true,
        storyStyle: raw?.storyStyle === 'Hậu cung' || raw?.storyStyle === 'Tu luyện' || raw?.storyStyle === 'Thông thường' || raw?.storyStyle === 'Tu la tràng' || raw?.storyStyle === 'Thuần ái' || raw?.storyStyle === 'NTL Hậu cung'
            ? raw.storyStyle
            : defaultGameSettings.storyStyle,
        ntlHaremTier: raw?.ntlHaremTier === 'Cấm loạn luân' || raw?.ntlHaremTier === 'Giả loạn luân' || raw?.ntlHaremTier === 'Không giới hạn'
            ? raw.ntlHaremTier
            : defaultGameSettings.ntlHaremTier,
        extraPrompt: (() => {
            const candidate = typeof raw?.extraPrompt === 'string' ? raw.extraPrompt : defaultExtraSystemPrompt;
            const trimmed = candidate.trim();
            if (!trimmed) return defaultExtraSystemPrompt;
            if (trimmed === legacyDefaultAdditionalSystemPrompt.trim()) return defaultExtraSystemPrompt;
            return candidate;
        })()
    });
    const [gameConfig, setGameConfig] = useState<GameSettings>(defaultGameSettings);

    const defaultMemoryConfig: MemoryConfig = {
        shortTermThreshold: 30,
        midTermThreshold: 50,
        keyNpcImportantMemoryLimitN: 20,
        shortToMidPrompt: defaultShortToMidMemoryPrompt,
        midToLongPrompt: defaultMidToLongMemoryPrompt
    };
    const normalizeMemoryConfig = (raw?: Partial<MemoryConfig> | null): MemoryConfig => ({
        ...defaultMemoryConfig,
        ...(raw || {}),
        shortTermThreshold: Math.max(5, Number(raw?.shortTermThreshold ?? defaultMemoryConfig.shortTermThreshold) || defaultMemoryConfig.shortTermThreshold),
        midTermThreshold: Math.max(20, Number(raw?.midTermThreshold ?? defaultMemoryConfig.midTermThreshold) || defaultMemoryConfig.midTermThreshold),
        keyNpcImportantMemoryLimitN: Math.max(1, Number(raw?.keyNpcImportantMemoryLimitN ?? defaultMemoryConfig.keyNpcImportantMemoryLimitN) || defaultMemoryConfig.keyNpcImportantMemoryLimitN)
    });

    const [memoryConfig, setMemoryConfig] = useState<MemoryConfig>(defaultMemoryConfig);
    const [tavernSettings, setTavernSettings] = useState<TavernSettingsStructure>({
        enabled: false,
        activePresetId: null,
        postProcessing: 'Thêm vào sau prompt thế giới/cốt truyện gốc',
        presets: []
    });

    const [prompts, setPrompts] = useState<PromptStructure[]>(DefaultPrompts);
    // Removed legacy syncPrompts, now using PromptSyncService
    const [festivals, setFestivals] = useState<FestivalStructure[]>(festivalList);
    const [currentTheme, setCurrentTheme] = useState<ThemePreset>('ink');
    const [contextSize, setContextSize] = useState(0);

    const scrollRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Check for saves
    useEffect(() => {
        const checkSaves = async () => {
            try {
                const saves = await dbService.getSavesList();
                setHasSave(saves.length > 0);
            } catch (e) { console.error(e); }
        };
        checkSaves();
    }, [view]);

    // Init Settings
    useEffect(() => {
        const init = async () => {
            console.log('[useGameState] Starting settings initialization...');
            try {
                const [
                    themeRes,
                    apiRes,
                    promptsRes,
                    festivalsRes,
                    visualRes,
                    gameRes,
                    memoryRes,
                    tavernRes
                ] = await Promise.allSettled([
                    dbService.getSetting('app_theme'),
                    dbService.getSetting('api_settings'),
                    dbService.getSetting('prompts'),
                    dbService.getSetting('festivals'),
                    dbService.getSetting('visual_settings'),
                    dbService.getSetting('game_settings'),
                    dbService.getSetting('memory_settings'),
                    dbService.getSetting('tavern_settings')
                ]);

                if (themeRes.status === 'fulfilled' && themeRes.value) {
                    const val = themeRes.value as ThemePreset;
                    if (THEMES[val]) {
                        console.log('[useGameState] Loaded theme:', val);
                        setCurrentTheme(val);
                    }
                }

                if (apiRes.status === 'fulfilled') {
                    if (apiRes.value) {
                        console.log('[useGameState] Loaded API settings');
                        setApiConfig(normalizeApiSettings(apiRes.value as Partial<ApiSettings>));
                    } else {
                        setApiConfig(createEmptyApiSettings());
                    }
                }

                if (promptsRes.status === 'fulfilled') {
                    const loaded = (promptsRes.value as PromptStructure[]) || [];
                    const synced = await PromptSyncService.syncPrompts(loaded);
                    setPrompts(synced);
                }

                if (festivalsRes.status === 'fulfilled' && festivalsRes.value) {
                    setFestivals(festivalsRes.value as FestivalStructure[]);
                }

                if (visualRes.status === 'fulfilled' && visualRes.value) {
                    setVisualConfig(prev => ({
                        ...prev,
                        ...(visualRes.value as Partial<VisualSettings>)
                    }));
                }

                if (gameRes.status === 'fulfilled' && gameRes.value) {
                    setGameConfig(normalizeGameSettings(gameRes.value as Partial<GameSettings>));
                }

                if (memoryRes.status === 'fulfilled' && memoryRes.value) {
                    setMemoryConfig(normalizeMemoryConfig(memoryRes.value as Partial<MemoryConfig>));
                }

                if (tavernRes.status === 'fulfilled' && tavernRes.value) {
                    setTavernSettings(normalizeTavernSettings(tavernRes.value as Partial<TavernSettingsStructure>));
                }

                console.log('[useGameState] Settings initialization complete.');
                setIsSettingsLoaded(true);
            } catch (e) {
                console.error('[useGameState] Error during settings init:', e);
                // Still set to true so we don't block saving indefinitely, 
                // but at this point defaults remain.
                setIsSettingsLoaded(true);
            }
        };
        init();
    }, []);

    // Remote Prompts Background Update Listener
    useEffect(() => {
        const handleRemoteUpdate = (event: any) => {
            if (event.detail) {
                console.log('[useGameState] Applying remote prompt updates...');
                setPrompts(event.detail);
            }
        };
        window.addEventListener('prompts-updated-remotely', handleRemoteUpdate);
        return () => window.removeEventListener('prompts-updated-remotely', handleRemoteUpdate);
    }, []);

    // Theme Application
    useEffect(() => {
        const themeVars = THEMES[currentTheme] || THEMES['ink'];
        const root = document.documentElement;
        Object.entries(themeVars).forEach(([key, val]) => root.style.setProperty(key, val as string));

        // Root Cause Fix: Only save theme after we are sure we've loaded the initial value
        if (isSettingsLoaded) {
            console.log('[useGameState] Saving theme:', currentTheme);
            dbService.saveSetting('app_theme', currentTheme);
        }
    }, [currentTheme, isSettingsLoaded]);

    // Scroll & Context Size
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        setContextSize(estimateHistoryTokens(history));
    }, [history]);

    return {
        // State
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
        showVisualSummary, setShowVisualSummary,
        storyId, setStoryId,
        activeTab, setActiveTab,
        isGenerating, setIsGenerating,
        generationStartTime, setGenerationStartTime,
        generationMetadata, setGenerationMetadata,

        // Configs
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
    };
};
