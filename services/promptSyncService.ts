import * as dbService from './dbService';
import { DefaultPrompts } from '../prompts';
import { PromptStructure } from '../models/system';

export class PromptSyncService {
    /**
     * Synchronizes prompts from local defaults in the application bundle.
     * This ensures that when the web app is rebuilt and redeployed with new prompts,
     * the user's local database is automatically updated.
     * Returns the updated prompts array.
     */
    static async syncPrompts(currentPrompts: PromptStructure[]): Promise<PromptStructure[]> {
        const defaultPromptMap = new Map(DefaultPrompts.map(p => [p.id, p]));
        const defaultIds = new Set(defaultPromptMap.keys());

        // 1. Start with the latest system prompts from code
        let synced = [...DefaultPrompts];
        
        // 2. Add back user-added prompts
        const userAddedPrompts = currentPrompts.filter(p => {
            // If it's a current system prompt, ignore it (we already have the latest version in 'synced')
            if (defaultIds.has(p.id)) return false;
            
            // It's not a current system ID. Check if it's user-added or a stale system prompt.
            // Heuristic for user-added: ID is a numeric timestamp (from Date.now().toString())
            const isTimestamp = /^\d+$/.test(p.id);
            const isUserAdded = isTimestamp || !p.isSystem;
            
            if (!isUserAdded) {
                console.log(`[PromptSyncService] Removing stale system prompt: ${p.id} (${p.title})`);
            }
            
            return isUserAdded;
        });

        synced = [...synced, ...userAddedPrompts];

        // 3. Detect changes to decide whether to save
        // We simplified the logic: we always rebuild the list.
        // To be efficient, we check if the result is different from currentPrompts.
        const hash = (plist: PromptStructure[]) => plist.map(p => `${p.id}-${p.content.length}`).join('|');
        const hasChanges = hash(synced) !== hash(currentPrompts);

        if (hasChanges) {
            await dbService.saveSetting('prompts', synced);
            console.log('[PromptSyncService] Prompt synchronization complete. System prompts updated/cleaned, user prompts preserved.');
        }

        return synced;
    }
}
