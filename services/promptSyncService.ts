import * as dbService from './dbService';
import { DefaultPrompts } from '../prompts';
import { PromptStructure } from '../models/system';

const REMOTE_PROMPTS_URL = 'https://raw.githubusercontent.com/username/repo/main/prompts.json'; // Placeholder URL

export class PromptSyncService {
    /**
     * Synchronizes prompts from local defaults and remote source.
     * Returns the updated prompts array.
     */
    static async syncPrompts(currentPrompts: PromptStructure[]): Promise<PromptStructure[]> {
        let synced = [...currentPrompts];
        let hasChanges = false;

        // 1. Sync with local defaults
        for (const defaultPrompt of DefaultPrompts) {
            const index = synced.findIndex(p => p.id === defaultPrompt.id);
            if (index === -1) {
                synced.push({ ...defaultPrompt });
                hasChanges = true;
            } else if (synced[index].content !== defaultPrompt.content || synced[index].title !== defaultPrompt.title) {
                console.log(`[PromptSyncService] Local sync update: ${defaultPrompt.id}`);
                synced[index] = { 
                    ...synced[index], 
                    content: defaultPrompt.content, 
                    title: defaultPrompt.title 
                };
                hasChanges = true;
            }
        }

        if (hasChanges) {
            await dbService.saveSetting('prompts', synced);
        }

        // 2. Sync with remote source in the background
        this.syncWithRemote(synced).catch(err => {
            console.error('[PromptSyncService] Remote sync failed:', err);
        });

        return synced;
    }

    /**
     * Fetches prompts from remote URL and updates local database in background.
     */
    private static async syncWithRemote(currentPrompts: PromptStructure[]): Promise<void> {
        try {
            console.log('[PromptSyncService] Checking for remote updates...');
            const response = await fetch(REMOTE_PROMPTS_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const remotePrompts = await response.json() as PromptStructure[];
            if (!Array.isArray(remotePrompts)) {
                throw new Error('Invalid remote prompt format');
            }

            let synced = [...currentPrompts];
            let remoteUpdated = false;

            for (const remotePrompt of remotePrompts) {
                const index = synced.findIndex(p => p.id === remotePrompt.id);
                if (index === -1) {
                    synced.push({ ...remotePrompt });
                    remoteUpdated = true;
                } else if (synced[index].content !== remotePrompt.content || synced[index].title !== remotePrompt.title) {
                    console.log(`[PromptSyncService] Remote update for: ${remotePrompt.id}`);
                    synced[index] = { 
                        ...synced[index], 
                        content: remotePrompt.content, 
                        title: remotePrompt.title 
                    };
                    remoteUpdated = true;
                }
            }

            if (remoteUpdated) {
                await dbService.saveSetting('prompts', synced);
                console.log('[PromptSyncService] Remote sync completed with updates.');
                window.dispatchEvent(new CustomEvent('prompts-updated-remotely', { detail: synced }));
            } else {
                console.log('[PromptSyncService] No remote updates found.');
            }
        } catch (error) {
            console.warn('[PromptSyncService] Remote sync skipped:', error instanceof Error ? error.message : String(error));
        }
    }
}
