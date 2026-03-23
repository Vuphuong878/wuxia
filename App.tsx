
import React from 'react';
import TopBar from './components/layout/TopBar';
import LeftPanel from './components/layout/LeftPanel';
import { ImageService, ImageCacheService } from './services/imageService';
import RightPanel from './components/layout/RightPanel';
import MobileQuickMenu from './components/layout/MobileQuickMenu';
import CharacterModal from './components/features/Character/CharacterModal';
import MobileCharacter from './components/features/Character/MobileCharacter';
import DeathOverlay from './components/features/Character/DeathOverlay';
import ChatList from './components/features/Chat/ChatList';
import InputArea from './components/features/Chat/InputArea';
import LandingPage from './components/layout/LandingPage';
import NewGameWizard from './components/features/NewGame/NewGameWizard';
import MobileNewGameWizard from './components/features/NewGame/mobile/MobileNewGameWizard';
import SettingsModal from './components/features/Settings/SettingsModal';
import MobileSettingsModal from './components/features/Settings/mobile/MobileSettingsModal';
import InventoryModal from './components/features/Inventory/InventoryModal';
import EquipmentModal from './components/features/Equipment/EquipmentModal';
import SocialModal from './components/features/Social/SocialModal';
import MobileSocial from './components/features/Social/MobileSocial';
import TeamModal from './components/features/Team/TeamModal';
import KungfuModal from './components/features/Kungfu/KungfuModal';
import WorldModal from './components/features/World/WorldModal';
import MapModal from './components/features/Map/MapModal';
import SectModal from './components/features/Sect/SectModal';
import MobileSect from './components/features/Sect/MobileSect';
import TaskModal from './components/features/Task/TaskModal';
import MobileTask from './components/features/Task/MobileTask';
import AgreementModal from './components/features/Agreement/AgreementModal';
import StoryModal from './components/features/Story/StoryModal';
import MobileStory from './components/features/Story/MobileStory';

import MemoryModal from './components/features/Memory/MemoryModal';
import MobileMemory from './components/features/Memory/MobileMemory';
import SaveLoadModal from './components/features/SaveLoad/SaveLoadModal'; // New
import VisualSummary from './components/features/NewGame/VisualSummary';
import InAppConfirmModal, { ConfirmOptions } from './components/ui/InAppConfirmModal';
import BattleOverlay from './components/features/battle/BattleOverlay';
import { useGame } from './hooks/useGame';
import './src/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';

const App: React.FC = () => {
    const { state, meta, setters, actions } = useGame();
    const [showCharacter, setShowCharacter] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(max-width: 767px)').matches;
    });
    const contextSnapshot = actions.getContextSnapshot();
    const confirmResolverRef = React.useRef<((value: boolean) => void) | null>(null);
    const [confirmState, setConfirmState] = React.useState<(ConfirmOptions & { open: boolean })>({
        open: false,
        title: 'Please confirm',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        danger: false
    });

    const [isGeneratingProtagonist, setIsGeneratingProtagonist] = React.useState(false);
    const [generatingNpcs, setGeneratingNpcs] = React.useState<Set<string>>(new Set());
    const generatingProtagonistFor = React.useRef<string | null>(null);
    const generatingItems = React.useRef<Set<string>>(new Set());
    const [pendingInputToPreload, setPendingInputToPreload] = React.useState<string>('');
    const generatingMaps = React.useRef<Set<string>>(new Set());

    const requestConfirm = React.useCallback((options: ConfirmOptions) => {
        return new Promise<boolean>((resolve) => {
            confirmResolverRef.current = resolve;
            setConfirmState({
                open: true,
                title: options.title || 'Please confirm',
                message: options.message,
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                danger: options.danger || false
            });
        });
    }, []);

    const resolveConfirm = React.useCallback((accepted: boolean) => {
        if (confirmResolverRef.current) {
            confirmResolverRef.current(accepted);
            confirmResolverRef.current = null;
        }
        setConfirmState((prev) => ({ ...prev, open: false }));
    }, []);

    React.useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    const parseActionOptionText = (option: unknown): string => {
        if (typeof option === 'string') return option.trim();
        if (typeof option === 'number' || typeof option === 'boolean') return String(option);
        if (option && typeof option === 'object') {
            const obj = option as Record<string, unknown>;
            const candidates = [obj.text, obj.label, obj.action, obj.name, obj.id];
            for (const candidate of candidates) {
                if (typeof candidate === 'string' && candidate.trim().length > 0) {
                    return candidate.trim();
                }
            }
        }
        return '';
    };

    const parseGameTimestampToNumber = (timeStr?: string): number => {
        if (!timeStr || typeof timeStr !== 'string') return 0;
        const m = timeStr.trim().match(/^(\d{1,6}):(\d{1,2}):(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
        if (!m) return 0;
        const year = Number(m[1]);
        const month = Number(m[2]);
        const day = Number(m[3]);
        const hour = Number(m[4]);
        const minute = Number(m[5]);
        return (((year * 12 + month) * 31 + day) * 24 + hour) * 60 + minute;
    };

    const tickerEvents = React.useMemo(() => {
        const ongoingEvents = Array.isArray(state.world?.ongoingEvents) ? state.world.ongoingEvents : [];
        const formatted = ongoingEvents
            .filter(evt => evt && (evt.currentStatus === 'In progress' || !evt.currentStatus))
            .sort((a, b) => parseGameTimestampToNumber(b.startTime) - parseGameTimestampToNumber(a.startTime))
            .map(evt => {
                const type = evt.type || 'Event';
                const start = evt.startTime || 'Unknown time';
                const title = evt.title || 'No title';
                const location = evt.location || 'Unknown location';
                return `【${type}】${start} ${title}（${location}）`;
            })
            .filter(Boolean);

        return formatted.length > 0 ? formatted : state.worldEvents;
    }, [state.world, state.worldEvents]);

    // Helper to get valid avatar URL
    const getValidAvatarUrl = (avatarStr?: string) => {
        if (!avatarStr || avatarStr.includes('default')) return undefined;
        if (avatarStr.startsWith('data:image/')) return avatarStr;
        let url = avatarStr.startsWith('/') ? avatarStr : `/images/${avatarStr}`;
        if (!url.match(/\.(png|jpe?g|webp|gif)$/i)) {
            url += '.png';
        }
        return url;
    };

    // Global Avatar Mapping
    const allAvatars = React.useMemo(() => {
        const map: Record<string, string> = {};
        // 1. Protagonist
        const pAvatar = state.character.avatar;
        if (pAvatar && !pAvatar.includes('default')) {
             const url = getValidAvatarUrl(pAvatar);
             if (url) {
                 map[state.character.id] = url;
                 map[state.character.name] = url;
                 map['Người chơi'] = url;
             }
        }
        // 2. NPCs
        if (Array.isArray(state.social)) {
            state.social.forEach(npc => {
                if (npc.avatar && !npc.avatar.includes('default')) {
                    const avatarUrl = getValidAvatarUrl(npc.avatar);
                    if (avatarUrl) {
                        map[npc.id] = avatarUrl;
                        map[npc.name] = avatarUrl;
                    }
                }
            });
        }
        return map;
    }, [state.character.name, state.character.avatar, state.social]);

    // Global Auto-generation logic for character and NPCs
    React.useEffect(() => {
        const checkAndGenerate = async () => {
            const visualConfig = state.visualConfig;
            const workerUrl = visualConfig.imageGenWorkerUrl;
            if (!workerUrl) return;

            // 1. Check Protagonist
            const Role = state.character;
            if (Role.name && !isGeneratingProtagonist && generatingProtagonistFor.current !== Role.name) {
                const needsProtagonistGen = (!Role.avatar || Role.avatar.includes('default')) && !Role.avatar?.startsWith('data:image/');
                const noCustomProtagonist = !localStorage.getItem('customAvatar');

                if (needsProtagonistGen && noCustomProtagonist) {
                    const prompt = ImageService.constructCharacterPrompt(Role);
                    const cacheKey = await ImageCacheService.generateCacheKey(prompt, (state as any).storyId);
                    const existingImage = await ImageService.checkImageExists('', cacheKey);
                    
                    if (existingImage) {
                        if (Role.avatar !== existingImage) {
                            state.setCharacter({ ...Role, avatar: existingImage });
                        }
                    } else {
                        generatingProtagonistFor.current = Role.name;
                        setIsGeneratingProtagonist(true);
                        try {
                            // constructCharacterPrompt now supports .appearance (protagonist field)
                            const dataUrl = await ImageService.generateAndCache(workerUrl, { prompt }, cacheKey);
                            if (dataUrl) {
                                state.setCharacter(prev => ({ ...prev, avatar: dataUrl }));
                            }
                        } catch (error) {
                            console.error('Character global auto-generation error:', error);
                        } finally {
                            setIsGeneratingProtagonist(false);
                            generatingProtagonistFor.current = null;
                        }
                    }
                }
            }

            if (Array.isArray(state.social)) {
                for (const npc of state.social) {
                    const needsNpcGen = (!npc.avatar || npc.avatar.includes('default')) && !npc.avatar?.startsWith('data:image/');
                    if (npc.name && needsNpcGen && !generatingNpcs.has(npc.name)) {
                        const prompt = ImageService.constructCharacterPrompt({
                            name: npc.name,
                            gender: npc.gender,
                            realm: npc.realm || 'Phàm nhân',
                            appearanceDescription: `${npc.identity || ''}. ${npc.appearanceDescription || ''}`.trim()
                        });
                        const cacheKey = await ImageCacheService.generateCacheKey(prompt, (state as any).storyId);
                        const existingNpcImage = await ImageService.checkImageExists('', cacheKey);

                        if (existingNpcImage) {
                            state.setSocial(prev => prev.map(n => n.name === npc.name ? { ...n, avatar: existingNpcImage } : n));
                        } else {
                            setGeneratingNpcs(prev => new Set(prev).add(npc.name));
                            try {
                                const dataUrl = await ImageService.generateAndCache(workerUrl, { prompt }, cacheKey);
                                if (dataUrl) {
                                    state.setSocial(prev => prev.map(n => {
                                        if (npc.id && n.id === npc.id) return { ...n, avatar: dataUrl };
                                        if (!npc.id && n.name === npc.name) return { ...n, avatar: dataUrl };
                                        return n;
                                    }));
/*
                                    state.setHistory(prev => [...prev, {
                                        role: 'system',
                                        content: `Đã tạo xong họa tượng cho [${npc.name}].`,
                                        timestamp: Date.now()
                                    }]);
*/
                                }
                            } catch (error) {
                                console.error(`NPC generation error for ${npc.name}:`, error);
                            } finally {
                                setGeneratingNpcs(prev => {
                                    const next = new Set(prev);
                                    next.delete(npc.name);
                                    return next;
                                });
                            }
                        }
                    }
                }
            }

            // 3. Check Inventory Items
            if (Array.isArray(state.character.itemList)) {
                for (const item of state.character.itemList) {
                    if (item.name && typeof item.image !== 'string' && !generatingItems.current.has(item.name)) {
                        const prompt = ImageService.constructItemPrompt(item);
                        const cacheKey = await ImageCacheService.generateCacheKey(prompt, (state as any).storyId);
                        const existingImage = await ImageService.checkImageExists(`/images/items/${item.name.replace(/\s+/g, '_')}.png`, cacheKey);
                        if (existingImage) {
                            state.setCharacter(prev => ({
                                ...prev,
                                itemList: prev.itemList.map(i => i.name === item.name ? { ...i, image: existingImage } : i)
                            }));
                        } else {
                            generatingItems.current.add(item.name);
                            try {
                                const dataUrl = await ImageService.generateAndCache(workerUrl, { prompt }, cacheKey);
                                if (dataUrl) {
                                    state.setCharacter(prev => ({
                                        ...prev,
                                        itemList: prev.itemList.map(i => i.name === item.name ? { ...i, image: dataUrl } : i)
                                    }));
                                }
                            } catch (error) {
                                console.error(`Item generation error for ${item.name}:`, error);
                            }
                        }
                    }
                }
            }

            // 4. Check Maps
            if (Array.isArray(state.world?.maps)) {
                for (const map of state.world.maps) {
                    const mapName = map.Name || map.name; // Some maps use Name instead of name
                    if (mapName && typeof map.image !== 'string' && !generatingMaps.current.has(mapName)) {
                        const prompt = ImageService.constructMapPrompt(map);
                        const cacheKey = await ImageCacheService.generateCacheKey(prompt, (state as any).storyId);
                        const existingImage = await ImageService.checkImageExists(`/images/maps/${mapName.replace(/\s+/g, '_')}.png`, cacheKey);
                        if (existingImage) {
                            state.setWorld(prev => ({
                                ...prev,
                                maps: prev.maps.map(m => (m.Name || m.name) === mapName ? { ...m, image: existingImage } : m)
                            }));
                        } else {
                            generatingMaps.current.add(mapName);
                            try {
                                const dataUrl = await ImageService.generateAndCache(workerUrl, { prompt }, cacheKey);
                                if (dataUrl) {
                                    state.setWorld(prev => ({
                                        ...prev,
                                        maps: prev.maps.map(m => (m.Name || m.name) === mapName ? { ...m, avatar: dataUrl } : m)
                                    }));
                                }
                            } catch (error) {
                                console.error(`Map generation error for ${mapName}:`, error);
                            }
                        }
                    }
                }
            }
        };

        if (state.view === 'game') {
            checkAndGenerate();
        }
    }, [state.character.name, state.character.avatar, state.social, state.character.itemList, state.world?.maps, state.visualConfig.imageGenWorkerUrl, state.view]);

    const renderTickerItems = (items: string[], keyPrefix: string) => (
        items.map((e, i) => (
            <span key={`${keyPrefix}-${i}`} className="mx-5 inline-block">{e}</span>
        ))
    );

    // Extract options from the latest assistant message
    const lastMessage = state.history[state.history.length - 1];
    const currentOptions = (lastMessage?.role === 'assistant' && Array.isArray(lastMessage.structuredResponse?.action_options))
        ? lastMessage.structuredResponse.action_options
            .map(parseActionOptionText)
            .filter(item => item.length > 0)
        : [];

    const activeMobileWindow =
        showCharacter ? 'Role' :
            state.showEquipment ? 'Equipment' :
                state.showInventory ? 'Inventory' :
                    state.showSocial ? 'Social' :
                        state.showKungfu ? 'Martial Arts' :
                            state.showWorld ? 'World' :
                                state.showMap ? 'Map' :
                                    state.showTeam ? 'Team' :
                                        state.showSect ? 'Sect' :
                                            state.showTask ? 'Task' :
                                                state.showAgreement ? 'Promise' :
                                                    state.showStory ? 'Story' :

                                                            state.showMemory ? 'Memory' :
                                                                state.showSaveLoad.show ? (state.showSaveLoad.mode === 'save' ? 'Save' : 'Read') :
                                                                    state.showSettings ? 'Settings' :
                                                                        null;

    const closeAllPanels = () => {
        setShowCharacter(false);
        setters.setShowInventory(false);
        setters.setShowEquipment(false);
        setters.setShowTeam(false);
        setters.setShowSocial(false);
        setters.setShowKungfu(false);
        setters.setShowWorld(false);
        setters.setShowMap(false);
        setters.setShowSect(false);
        setters.setShowTask(false);
        setters.setShowAgreement(false);
        setters.setShowStory(false);

        setters.setShowMemory(false);
        setters.setShowSaveLoad({ show: false, mode: 'save' });
        setters.setShowSettings(false);
    };

    const handleMobileMenuClick = (menu: string) => {
        const isActive = activeMobileWindow === menu;
        closeAllPanels();
        if (isActive) return;

        switch (menu) {
            case 'Role':
                setShowCharacter(true);
                break;
            case 'Equipment':
                setters.setShowEquipment(true);
                break;
            case 'Inventory':
                setters.setShowInventory(true);
                break;
            case 'Social':
                setters.setShowSocial(true);
                break;
            case 'Martial Arts':
                setters.setShowKungfu(true);
                break;
            case 'World':
                setters.setShowWorld(true);
                break;
            case 'Map':
                setters.setShowMap(true);
                break;
            case 'Team':
                setters.setShowTeam(true);
                break;
            case 'Sect':
                setters.setShowSect(true);
                break;
            case 'Task':
                setters.setShowTask(true);
                break;
            case 'Promise':
                setters.setShowAgreement(true);
                break;
            case 'Story':
                setters.setShowStory(true);
                break;

            case 'Memory':
                setters.setShowMemory(true);
                break;
            case 'Save':
                setters.setShowSaveLoad({ show: true, mode: 'save' });
                break;
            case 'Read':
                setters.setShowSaveLoad({ show: true, mode: 'load' });
                break;
            case 'Settings':
                setters.setShowSettings(true);
                break;
            default:
                break;
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-black relative flex flex-col p-3 transition-colors duration-500">

            {/* View Switching */}
            {state.view === 'home' && (
                <LandingPage
                    onStart={actions.handleStartNewGameWizard}
                    onLoad={() => setters.setShowSaveLoad({ show: true, mode: 'load' })}
                    onSettings={() => setters.setShowSettings(true)}
                    hasSave={state.hasSave}
                />
            )}

            {state.view === 'new_game' && (
                isMobile ? (
                    <MobileNewGameWizard
                        onComplete={actions.handleGenerateWorld}
                        onCancel={() => { state.setView('home'); }}
                        loading={state.loading}
                        requestConfirm={requestConfirm}
                    />
                ) : (
                    <NewGameWizard
                        onComplete={actions.handleGenerateWorld}
                        onCancel={() => { state.setView('home'); }}
                        loading={state.loading}
                        requestConfirm={requestConfirm}
                    />
                )
            )}

            {state.view === 'game' && (
                /* Main Game Frame Container */
                <div className="relative flex-1 flex flex-col w-full h-full rounded-none overflow-hidden bg-black shadow-2xl">

                    {/* Custom Background Layer */}
                    {state.visualConfig.backgroundImage && (
                        <div
                            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 opacity-60 pointer-events-none"
                            style={{ backgroundImage: `url(${state.visualConfig.backgroundImage})` }}
                        ></div>
                    )}

                    {/* Noise Overlay */}
                    <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none z-[5]"></div>

                    {/* Top Navigation Bar */}
                    <div className="shrink-0 z-40 bg-ink-black/90 border-b border-wuxia-gold/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative rounded-none overflow-visible mx-1 mt-1">
                        <TopBar
                            Environment={state.environment}
                            timeFormat={state.visualConfig.timeDisplayFormat}
                            festivals={state.festivals}
                        />
                    </div>

                    {/* Main interaction area in the middle */}
                    <div className="flex-1 flex overflow-hidden relative z-10 mx-1 mb-1">

                        {/* Left sidebar */}
                        <div className="hidden md:block w-[14.285714%] h-full relative z-20 bg-ink-black/95 border-r border-wuxia-gold/20 flex flex-col shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
                            <LeftPanel 
                                Role={state.character} 
                                Social={state.social}
                                onOpenCharacter={() => setShowCharacter(true)}
                                visualConfig={state.visualConfig}
                                onUpdateCharacter={state.setCharacter}
                                isGenerating={isGeneratingProtagonist}
                                generatingNames={generatingNpcs}
                                allAvatars={allAvatars}
                            />
                        </div>

                        {/* Middle sidebar - Chat Area */}
                        <div className="flex-1 flex flex-col relative z-0 min-w-0 transition-colors duration-500">
                             <ChatList
                                history={state.history}
                                loading={state.loading}
                                scrollRef={state.scrollRef}
                                onUpdateHistory={actions.updateHistoryItem}
                                renderCount={state.visualConfig.renderLayers}
                                generationStartTime={state.generationStartTime}
                                generationMetadata={state.generationMetadata}
                                modelName={state.apiConfig?.model}
                                allAvatars={allAvatars}
                                npcs={state.social as any[]}
                                playerName={state.character.name}
                                playerId={state.character.id}
                                generatingNames={generatingNpcs}
                                isPlayerGenerating={isGeneratingProtagonist}
                                onClearHistory={actions.handleClearHistory}
                                onRetry={() => {
                                    const input = actions.handleRegenerate();
                                    if (input) setPendingInputToPreload(input);
                                }}
                                onReroll={() => {
                                    const input = actions.handleRegenerate();
                                    if (input) actions.handleSend(input, true);
                                }}
                            />
                            <InputArea
                                onSend={actions.handleSend}
                                onStop={actions.handleStop}
                                onRegenerate={actions.handleRegenerate}
                                onQuickRestart={actions.handleQuickRestart}
                                requestConfirm={requestConfirm}
                                loading={state.loading}
                                canReroll={meta.canRerollLatest}
                                canQuickRestart={meta.canQuickRestart}
                                options={currentOptions}
                                enableRetryOnParseFail={(state.gameConfig as any).enableRetryOnParseFail !== false}
                                initialValue={pendingInputToPreload}
                                onInitialValueConsumed={() => setPendingInputToPreload('')}
                            />
                        </div>

                        {/* Right sidebar */}
                        <div className="hidden md:block w-[14.285714%] h-full relative z-20 bg-ink-black/95 border-l border-wuxia-gold/20 flex flex-col shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
                            <RightPanel
                                onOpenSettings={() => setters.setShowSettings(true)}
                                onOpenInventory={() => setters.setShowInventory(true)}
                                onOpenEquipment={() => setters.setShowEquipment(true)}
                                onOpenTeam={() => setters.setShowTeam(true)}
                                onOpenSocial={() => setters.setShowSocial(true)}
                                onOpenKungfu={() => setters.setShowKungfu(true)}
                                onOpenWorld={() => setters.setShowWorld(true)}
                                onOpenMap={() => setters.setShowMap(true)}
                                onOpenSect={() => setters.setShowSect(true)}
                                onOpenTask={() => setters.setShowTask(true)}
                                onOpenAgreement={() => setters.setShowAgreement(true)}
                                onOpenStory={() => setters.setShowStory(true)}

                                onOpenMemory={() => setters.setShowMemory(true)}

                                onSave={() => setters.setShowSaveLoad({ show: true, mode: 'save' })}
                                onLoad={() => setters.setShowSaveLoad({ show: true, mode: 'load' })}
                                onExit={actions.handleReturnToHome}
                            />
                        </div>
                    </div>

                    {/* Mobile Shortcut Menu */}
                    <MobileQuickMenu
                        activeWindow={activeMobileWindow}
                        onMenuClick={handleMobileMenuClick}

                    />

                    {/* Bottom world events bar for mobile devices. */}
                    <div className="md:hidden shrink-0 h-[32px] bg-ink-black/90 border-t border-wuxia-gold/20 flex items-center text-[10px] font-mono text-wuxia-gold-dark relative mx-1 mb-1 overflow-hidden pb-[env(safe-area-inset-bottom)]">
                        <div className="shrink-0 h-full px-2 flex items-center border-r border-gray-800 text-wuxia-gold/90 tracking-wider">
                            World major events
                        </div>
                        <div className="flex-1 overflow-hidden relative h-full flex items-center">
                            <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-ink-black to-transparent z-10 pointer-events-none"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-ink-black to-transparent z-10 pointer-events-none"></div>
                            {tickerEvents && tickerEvents.length > 0 ? (
                                <div className="w-full overflow-hidden">
                                    <div
                                        className="flex items-center gap-8 whitespace-nowrap min-w-max animate-marquee-linear text-[10px] text-wuxia-gold/70 tracking-wide"
                                        style={{ ['--marquee-duration' as any]: '28s' }}
                                    >
                                        <div className="flex items-center gap-8">
                                            {renderTickerItems(tickerEvents, 'm')}
                                        </div>
                                        <div className="flex items-center gap-8" aria-hidden>
                                            {renderTickerItems(tickerEvents, 'm-dup')}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full text-center text-[10px] text-gray-700 tracking-wider">
                                    Jianghu is peaceful，No major events yet...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="hidden md:flex shrink-0 h-[37px] bg-ink-black/90 border-t border-wuxia-gold/20 justify-between px-4 items-center text-xs font-mono text-wuxia-gold-dark z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.8)] relative rounded-b-xl mx-1 mb-1 overflow-hidden">

                        {/* Left Label: World Events */}
                        <div className="shrink-0 text-wuxia-gold font-bold mr-2 z-20 bg-ink-black/90 px-2 flex items-center h-full border-r border-gray-800">
                            【World major events】
                        </div>

                        {/* Center Ticker */}
                        <div className="flex-1 overflow-hidden relative h-full flex items-center mx-2">
                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-ink-black to-transparent z-10 pointer-events-none"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-ink-black to-transparent z-10 pointer-events-none"></div>

                            {tickerEvents && tickerEvents.length > 0 ? (
                                <div className="w-full overflow-hidden">
                                    <div
                                        className="flex items-center gap-10 whitespace-nowrap min-w-max animate-marquee-linear text-[10px] text-wuxia-gold/70 font-mono tracking-wider"
                                        style={{ ['--marquee-duration' as any]: '36s' }}
                                    >
                                        <div className="flex items-center gap-10">
                                            {renderTickerItems(tickerEvents, 'd')}
                                        </div>
                                        <div className="flex items-center gap-10" aria-hidden>
                                            {renderTickerItems(tickerEvents, 'd-dup')}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full text-center text-[10px] text-gray-700 font-mono tracking-widest">
                                    Jianghu is peaceful，No major events yet...
                                </div>
                            )}
                        </div>

                        {/* Right Label: Version */}
                        <div className="shrink-0 text-wuxia-gold font-bold ml-2 z-20 /90 px-2 flex items-center h-full border-l border-gray-800">
                            【V0.0.1】
                        </div>
                    </div>
                </div>
            )}

            {/* Global Golden Border Frame */}
            <div className="pointer-events-none fixed inset-3 z-[100] border-4 border-double border-wuxia-gold/40 rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
                {/* Corner Ornaments */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-wuxia-gold rounded-tl-xl shadow-[-2px_-2px_5px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-wuxia-gold rounded-tr-xl shadow-[2px_-2px_5px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-wuxia-gold rounded-bl-xl shadow-[-2px_2px_5px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-wuxia-gold rounded-br-xl shadow-[2px_2px_5px_rgba(0,0,0,0.5)]"></div>

                {/* Mid-point Accents */}
                <div className="absolute top-1/2 left-0 w-1 h-12 -translate-y-1/2 bg-wuxia-gold/60"></div>
                <div className="absolute top-1/2 right-0 w-1 h-12 -translate-y-1/2 bg-wuxia-gold/60"></div>
            </div>

            {/* Save/Load Modal */}
            {state.showSaveLoad.show && (
                <SaveLoadModal
                    onClose={() => setters.setShowSaveLoad({ show: false, mode: 'save' })}
                    onLoadGame={actions.handleLoadGame}
                    onSaveGame={actions.handleSaveGame}
                    mode={state.showSaveLoad.mode}
                    requestConfirm={requestConfirm}
                />
            )}

            {/* Settings Modal - Visible in both views if requested */}
            {state.showSettings && (
                isMobile ? (
                    <MobileSettingsModal
                        activeTab={state.activeTab}
                        onTabChange={setters.setActiveTab}
                        onClose={() => setters.setShowSettings(false)}
                        apiConfig={state.apiConfig}
                        visualConfig={state.visualConfig}
                        gameConfig={state.gameConfig}
                        memoryConfig={state.memoryConfig}
                        tavernSettings={state.tavernSettings}
                        prompts={state.prompts}
                        festivals={state.festivals}
                        currentTheme={state.currentTheme}
                        history={state.history}
                        memorySystem={state.memorySystem}
                        contextSnapshot={contextSnapshot}
                        onSaveApi={actions.saveSettings}
                        onSaveVisual={actions.saveVisualSettings}
                        onSaveGame={actions.saveGameSettings}
                        onSaveMemory={actions.saveMemorySettings}
                        onSaveTavern={actions.saveTavernSettings}
                        onUpdatePrompts={actions.updatePrompts}
                        onUpdateFestivals={actions.updateFestivals}
                        onThemeChange={setters.setCurrentTheme}
                        requestConfirm={requestConfirm}
                        onReturnToHome={async () => {
                            const ok = await requestConfirm({
                                title: 'Return home',
                                message: 'Are you sure you want to return to home page?？Unsaved progress will be lost.。',
                                confirmText: 'Back',
                                danger: true
                            });
                            if (!ok) return;
                            actions.handleReturnToHome();
                            setters.setShowSettings(false);
                        }}
                        isHome={state.view === 'home'}
                    />
                ) : (
                    <SettingsModal
                        activeTab={state.activeTab}
                        onTabChange={setters.setActiveTab}
                        onClose={() => setters.setShowSettings(false)}
                        apiConfig={state.apiConfig}
                        visualConfig={state.visualConfig}
                        gameConfig={state.gameConfig}
                        memoryConfig={state.memoryConfig}
                        tavernSettings={state.tavernSettings}
                        prompts={state.prompts}
                        festivals={state.festivals}
                        currentTheme={state.currentTheme}
                        history={state.history}
                        memorySystem={state.memorySystem}
                        contextSnapshot={contextSnapshot}
                        onSaveApi={actions.saveSettings}
                        onSaveVisual={actions.saveVisualSettings}
                        onSaveGame={actions.saveGameSettings}
                        onSaveMemory={actions.saveMemorySettings}
                        onSaveTavern={actions.saveTavernSettings}
                        onUpdatePrompts={actions.updatePrompts}
                        onUpdateFestivals={actions.updateFestivals}
                        onThemeChange={setters.setCurrentTheme}
                        requestConfirm={requestConfirm}
                        onReturnToHome={async () => {
                            const ok = await requestConfirm({
                                title: 'Return home',
                                message: 'Are you sure you want to return to home page?？Unsaved progress will be lost.。',
                                confirmText: 'Back',
                                danger: true
                            });
                            if (!ok) return;
                            actions.handleReturnToHome();
                            setters.setShowSettings(false);
                        }}
                        isHome={state.view === 'home'}
                    />
                )
            )}

            <InAppConfirmModal
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                confirmText={confirmState.confirmText}
                cancelText={confirmState.cancelText}
                danger={confirmState.danger}
                onConfirm={() => resolveConfirm(true)}
                onCancel={() => resolveConfirm(false)}
            />

            {/* In-Game Modals */}
            {state.view === 'game' && (
                <>
                    {state.battle.isInBattle && (
                        <BattleOverlay 
                            state={state as any} 
                            onAction={actions.handleSend}
                            onClose={() => setters.setBattle({ ...state.battle, isInBattle: false })}
                        />
                    )}
                    {state.showInventory && (
                        <InventoryModal
                            character={state.character}
                            onClose={() => setters.setShowInventory(false)}
                        />
                    )}

                    {showCharacter && (
                        <>
                            <CharacterModal
                                character={state.character}
                                onClose={() => setShowCharacter(false)}
                            />
                            <MobileCharacter
                                character={state.character}
                                onClose={() => setShowCharacter(false)}
                            />
                        </>
                    )}

                    {state.showEquipment && (
                        <EquipmentModal
                            character={state.character}
                            onClose={() => setters.setShowEquipment(false)}
                        />
                    )}

                    {state.showTeam && (
                        <TeamModal
                            character={state.character}
                            teammates={state.social}
                            allAvatars={allAvatars}
                            onClose={() => setters.setShowTeam(false)}
                        />
                    )}

                    {state.showSocial && (
                        <>
                            <SocialModal
                                socialList={state.social}
                                allAvatars={allAvatars}
                                onClose={() => setters.setShowSocial(false)}
                                playerName={state.character.name}
                                onToggleMajorRole={actions.updateNpcMajorRole}
                            />
                            <MobileSocial
                                socialList={state.social}
                                allAvatars={allAvatars}
                                onClose={() => setters.setShowSocial(false)}
                                playerName={state.character.name}
                                onToggleMajorRole={actions.updateNpcMajorRole}
                            />
                        </>
                    )}

                    {/* Death Overlay Integration */}
                    {state.character.isDead && (
                        <DeathOverlay
                            character={state.character}
                            onRestart={actions.handleQuickRestart}
                        />
                    )}

                    {state.showKungfu && (
                        <KungfuModal
                            skills={state.character.kungfuList}
                            onClose={() => setters.setShowKungfu(false)}
                        />
                    )}

                    {state.showWorld && (
                        <WorldModal
                            world={state.world}
                            onClose={() => setters.setShowWorld(false)}
                        />
                    )}

                    {state.showMap && (
                        <MapModal
                            world={state.world}
                            env={state.environment}
                            onClose={() => setters.setShowMap(false)}
                        />
                    )}

                    {state.showSect && (
                        <>
                            <SectModal
                                sectData={state.playerSect}
                                currentTime={state.environment.hour}
                                onClose={() => setters.setShowSect(false)}
                            />
                            <MobileSect
                                sectData={state.playerSect}
                                currentTime={state.environment.hour}
                                onClose={() => setters.setShowSect(false)}
                            />
                        </>
                    )}

                    {state.showTask && (
                        <>
                            <TaskModal
                                tasks={state.taskList}
                                onClose={() => setters.setShowTask(false)}
                            />
                            {isMobile && (
                                <MobileTask
                                    tasks={state.taskList}
                                    onClose={() => setters.setShowTask(false)}
                                />
                            )}
                        </>
                    )}

                    {state.showAgreement && (
                        <AgreementModal
                            agreements={state.appointmentList}
                            onClose={() => setters.setShowAgreement(false)}
                        />
                    )}

                    {state.showStory && (
                        <>
                            <StoryModal
                                open={state.showStory}
                                story={state.story}
                                onClose={() => setters.setShowStory(false)}
                                onSaveChapter={actions.handleSummarizeChapter}
                            />
                            {isMobile && (
                                <MobileStory
                                    open={state.showStory}
                                    story={state.story}
                                    onClose={() => setters.setShowStory(false)}
                                    onSaveChapter={actions.handleSummarizeChapter}
                                />
                            )}
                        </>
                    )}



                    {state.showMemory && (
                        <>
                            <MemoryModal
                                isOpen={true}
                                history={state.history}
                                memorySystem={state.memorySystem}
                                onClose={() => setters.setShowMemory(false)}
                                currentTime={state.environment?.hour}
                            />
                            <MobileMemory
                                history={state.history}
                                memorySystem={state.memorySystem}
                                onClose={() => setters.setShowMemory(false)}
                                currentTime={state.environment?.hour}
                            />
                        </>
                    )}
                </>
            )}

        </div>
    );
};

export default App;
