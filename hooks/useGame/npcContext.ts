import { MemoryConfig } from '../../types';
import { standardizeMemoryConfig } from './memoryUtils';
import { normalizeCanonicalGameTime } from './timeUtils';

export const buildNpcContext = (socialData: any[], memoryConfig: MemoryConfig): {
    presentDataBlock: string;
    departureDataBlock: string;
} => {
    const npcList = Array.isArray(socialData) ? socialData : [];
    const normalMemoryLimitN = 5;
    const config = standardizeMemoryConfig(memoryConfig);
    const keyMemoryLimitN = config.keyNpcImportantMemoryLimitN || 20;

    const clearEmptyFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
        return Object.fromEntries(
            Object.entries(obj).filter(([, value]) => {
                if (value === undefined || value === null) return false;
                if (typeof value === 'string' && value.trim().length === 0) return false;
                if (Array.isArray(value) && value.length === 0) return false;
                if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
                return true;
            })
        ) as Partial<T>;
    };

    const standardizeMemory = (npc: any, limit: number) => {
        if (!Array.isArray(npc?.memory)) return [];
        return npc.memory
            .map((m: any) => ({
                time: typeof m?.time === 'string'
                    ? (normalizeCanonicalGameTime(m.time) || m.time)
                    : 'Unknown time',
                content: typeof m?.content === 'string' ? m.content : String(m?.content ?? '')
            }))
            .filter((m: any) => m.content.trim().length > 0)
            .slice(-Math.max(1, limit));
    };

    const extractBaseData = (npc: any, index: number, isTeammate?: boolean) => {
        const corePersonalityTraits = typeof npc?.corePersonalityTraits === 'string' ? npc.corePersonalityTraits.trim() : '';
        const favorabilityBreakthroughCondition = typeof npc?.favorabilityBreakthroughCondition === 'string' ? npc.favorabilityBreakthroughCondition.trim() : '';
        const relationBreakthroughCondition = typeof npc?.relationBreakthroughCondition === 'string' ? npc.relationBreakthroughCondition.trim() : '';
        const relationshipNetwork = Array.isArray(npc?.relationshipNetwork)
            ? npc.relationshipNetwork
                .map((item: any) => ({
                    targetName: typeof item?.targetName === 'string' ? item.targetName.trim() : '',
                    relationship: typeof item?.relationship === 'string' ? item.relationship.trim() : '',
                    remark: typeof item?.remark === 'string' ? item.remark.trim() : undefined
                }))
                .filter((item: any) => item.targetName && item.relationship)
            : [];
        
        // Priority: fullName (legacy) -> name (standard) -> identity -> fallback ID
        const displayName = (typeof npc?.fullName === 'string' && npc.fullName.trim()) || 
                          (typeof npc?.name === 'string' && npc.name.trim()) || 
                          (typeof npc?.identity === 'string' && npc.identity.trim()) || 
                          `Role${index}`;

        return {
            index: index,
            id: typeof npc?.id === 'string' ? npc.id : `npc_${index}`,
            fullName: displayName,
            gender: typeof npc?.gender === 'string' ? npc.gender : 'Unknown',
            realm: typeof npc?.realm === 'string' ? npc.realm : 'Unknown realm',
            identity: typeof npc?.identity === 'string' ? npc.identity : 'Unknown identity',
            isTeammate,
            relationStatus: typeof npc?.relationStatus === 'string' ? npc.relationStatus : 'Unknown',
            favorability: typeof npc?.favorability === 'number' ? npc.favorability : 0,
            introduction: typeof npc?.introduction === 'string' ? npc.introduction : (typeof npc?.description === 'string' ? npc.description : 'No intro yet'),
            appearance: typeof npc?.appearance === 'string' ? npc.appearance : '',
            ...(corePersonalityTraits ? { corePersonalityTraits } : {}),
            ...(favorabilityBreakthroughCondition ? { favorabilityBreakthroughCondition } : {}),
            ...(relationBreakthroughCondition ? { relationBreakthroughCondition } : {}),
            ...(relationshipNetwork.length > 0 ? { relationshipNetwork } : {})
        };
    };

    const extractCompleteBasicData = (npc: any, index: number, isTeammate?: boolean) => {
        const basic = extractBaseData(npc, index, isTeammate);
        return clearEmptyFields({
            ...basic,
            age: typeof npc?.age === 'number' ? npc.age : undefined,
            appearance: typeof npc?.appearance === 'string' ? npc.appearance : undefined,
            bodyDescription: typeof npc?.bodyDescription === 'string' ? npc.bodyDescription : undefined,
            clothingStyle: typeof npc?.clothingStyle === 'string' ? npc.clothingStyle : undefined,
            breastSize: typeof npc?.breastSize === 'string' ? npc.breastSize : undefined,
            nippleColor: typeof npc?.nippleColor === 'string' ? npc.nippleColor : undefined,
            vaginalColor: typeof npc?.vaginalColor === 'string' ? npc.vaginalColor : undefined,
            analColor: typeof npc?.analColor === 'string' ? npc.analColor : undefined,
            hipSize: typeof npc?.hipSize === 'string' ? npc.hipSize : undefined,
            privateTraits: typeof npc?.privateTraits === 'string' ? npc.privateTraits : undefined,
            privateSummary: typeof npc?.privateSummary === 'string' ? npc.privateSummary : undefined,
            womb: typeof npc?.womb === 'object' && npc.womb ? npc.womb : undefined,
            isVirgin: typeof npc?.isVirgin === 'boolean' ? npc.isVirgin : undefined,
            firstNightTaker: typeof npc?.firstNightTaker === 'string' ? npc.firstNightTaker : undefined,
            firstNightTime: typeof npc?.firstNightTime === 'string'
                ? (normalizeCanonicalGameTime(npc.firstNightTime) || npc.firstNightTime)
                : undefined,
            firstNightDescription: typeof npc?.firstNightDescription === 'string' ? npc.firstNightDescription : undefined,
            countMouth: typeof npc?.countMouth === 'number' ? npc.countMouth : undefined,
            countChest: typeof npc?.countChest === 'number' ? npc.countChest : undefined,
            countGenitals: typeof npc?.countGenitals === 'number' ? npc.countGenitals : undefined,
            countRearCourt: typeof npc?.countRearCourt === 'number' ? npc.countRearCourt : undefined,
            countOrgasm: typeof npc?.countOrgasm === 'number' ? npc.countOrgasm : undefined
        });
    };

    const extractTeamCombatAdditions = (npc: any, isPresent?: boolean, isTeammate?: boolean) => {
        if (!isPresent || !isTeammate) return undefined;
        const additional = clearEmptyFields({
            attackPower: typeof npc?.attackPower === 'number' ? npc.attackPower : undefined,
            defensePower: typeof npc?.defensePower === 'number' ? npc.defensePower : undefined,
            lastUpdatedAt: typeof npc?.lastUpdatedAt === 'string'
                ? (normalizeCanonicalGameTime(npc.lastUpdatedAt) || npc.lastUpdatedAt)
                : undefined,
            currentHp: typeof npc?.currentHp === 'number' ? npc.currentHp : undefined,
            maxHp: typeof npc?.maxHp === 'number' ? npc.maxHp : undefined,
            currentEnergy: typeof npc?.currentEnergy === 'number' ? npc.currentEnergy : undefined,
            maxEnergy: typeof npc?.maxEnergy === 'number' ? npc.maxEnergy : undefined,
            currentEquipment: typeof npc?.currentEquipment === 'object' && npc.currentEquipment ? npc.currentEquipment : undefined,
            inventory: Array.isArray(npc?.inventory) ? npc.inventory : undefined
        });
        return Object.keys(additional).length > 0 ? additional : undefined;
    };

    const extractLastInteraction = (npc: any) => {
        const latestArr = standardizeMemory(npc, 1);
        const latest = latestArr.length > 0 ? latestArr[0] : null;
        return {
            content: latest?.content || 'No interactions yet',
            time: latest?.time || 'Unknown time'
        };
    };

    const toEntry = (npc: any, index: number) => {
        const isPresent = typeof npc?.isPresent === 'boolean' ? npc.isPresent : true;
        const isTeammate = typeof npc?.isTeammate === 'boolean' ? npc.isTeammate : false;
        const isMajorCharacter = typeof npc?.isMajorCharacter === 'boolean' ? npc.isMajorCharacter : false;
        const memoryLimit = isMajorCharacter ? keyMemoryLimitN : normalMemoryLimitN;
        const baseData = extractBaseData(npc, index, isTeammate);
        const completeData = extractCompleteBasicData(npc, index, isTeammate);
        const combatStatus = extractTeamCombatAdditions(npc, isPresent, isTeammate);
        const lastInteraction = extractLastInteraction(npc);
        return {
            index: baseData.index,
            id: baseData.id,
            fullName: baseData.fullName,
            gender: baseData.gender,
            realm: baseData.realm,
            introduction: baseData.introduction,
            isPresent,
            isTeammate,
            isMajorCharacter,
            baseData,
            completeData,
            combatStatus,
            lastInteraction,
            appearance: baseData.appearance,
            memories: standardizeMemory(npc, memoryLimit)
        };
    };

    const entries = npcList.map((npc, index) => toEntry(npc, index));

    const presenceData = Object.fromEntries(
        entries
            .filter(n => n.isPresent)
            .slice(0, 15) // Limit to top 15 present NPCs
            .map(n => {
                const key = `[${n.index}] ${n.fullName}`;
                const baseData = n.isMajorCharacter ? n.completeData : n.baseData;
                const data = {
                    ...baseData,
                    isMajorCharacter: n.isMajorCharacter,
                    memories: n.memories,
                    ...(n.combatStatus && { combatStatus: n.combatStatus })
                };
                return [key, data];
            })
    );

    const departureEntries = entries.filter(n => !n.isPresent);
    const majorDeparture = departureEntries.filter(n => n.isMajorCharacter).slice(0, 10);
    const minorDepartureCount = departureEntries.filter(n => !n.isMajorCharacter).length;

    const departureData = Object.fromEntries(
        majorDeparture.map(n => {
            const key = `[${n.index}] ${n.fullName}`;
            const data = {
                ...n.completeData,
                isMajorCharacter: n.isMajorCharacter,
                memories: n.memories
            };
            return [key, data];
        })
    );

    if (minorDepartureCount > 0) {
        (departureData as any)["_other_social_contacts_count"] = minorDepartureCount;
    }

    return {
        presentDataBlock: `【The following are characters present】(Derived from gameState.Social)\n${JSON.stringify(presenceData, null, 2)}`,
        departureDataBlock: `【The following are characters not present】(Derived from gameState.Social)\n${JSON.stringify(departureData, null, 2)}`
    };
};


