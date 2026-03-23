import { CharacterData, EnvironmentData, EquipmentSlot } from '../../types';
import { normalizeCanonicalGameTime } from './timeUtils';

const deepCopy = <T,>(data: T): T => JSON.parse(JSON.stringify(data)) as T;
const DefaultEquipmentTemplate = {
    head: 'None',
    chest: 'None',
    legs: 'None',
    hands: 'None',
    feet: 'None',
    mainWeapon: 'None',
    subWeapon: 'None',
    hiddenWeapon: 'None',
    back: 'None',
    waist: 'None',
    mount: 'None'
};
const DefaultMoneyTemplate = {
    gold: 0,
    silver: 0,
    copper: 0
};
const normalizeCurrency = (value: unknown): number => {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.floor(n));
};
const getLocationFragment = (raw: unknown): string => (typeof raw === 'string' ? raw.trim() : '');
const removeSpecificLocationRedundancy = (specificRaw: string, smallRaw: string): string => {
    const specific = getLocationFragment(specificRaw);
    const small = getLocationFragment(smallRaw);
    if (!specific || !small) return specific;
    if (!specific.startsWith(small)) return specific;
    const stripped = specific.slice(small.length).replace(/^[\s\-—>·/|，,、。:：]+/, '').trim();
    return stripped || specific;
};
const normalizeEnvironment = (rawEnv?: any): EnvironmentData => {
    const source = rawEnv && typeof rawEnv === 'object' ? rawEnv : {};
    const major = getLocationFragment(source?.majorLocation);
    const medium = getLocationFragment(source?.mediumLocation);
    const minor = getLocationFragment(source?.minorLocation);
    const originalSpecific = getLocationFragment(source?.specificLocation);
    const specific = removeSpecificLocationRedundancy(originalSpecific, minor);
    const rawFestival = source?.festival && typeof source.festival === 'object' ? source.festival : null;
    const rawFestivalName = typeof source?.festival === 'string' ? source.festival.trim() : '';
    const festivalSource = rawFestival;
    const festival = festivalSource
        ? {
            name: typeof festivalSource?.name === 'string'
                ? festivalSource.name.trim()
                : rawFestivalName,
            description: typeof festivalSource?.description === 'string'
                ? festivalSource.description.trim()
                : '',
            effect: typeof festivalSource?.effect === 'string' ? festivalSource.effect.trim() : ''
        }
        : (rawFestivalName ? { name: rawFestivalName, description: '', effect: '' } : null);
    const originalGameDays = typeof source?.gameDays === 'number' && Number.isFinite(source.gameDays)
        ? source.gameDays
        : 1;
    const rawWeather = source?.weather;
    const weather = typeof rawWeather === 'string'
        ? { type: rawWeather.trim(), endDate: '' }
        : {
            type: typeof rawWeather?.type === 'string' ? rawWeather.type.trim() : '',
            endDate: typeof rawWeather?.endDate === 'string' ? rawWeather.endDate.trim() : ''
        };
    const rawEnvVar = source?.envVariables || source?.env;
    const envVariables = typeof rawEnvVar === 'string'
        ? { name: rawEnvVar.trim(), description: '', effect: '' }
        : (rawEnvVar && typeof rawEnvVar === 'object'
            ? {
                name: typeof rawEnvVar?.name === 'string' ? rawEnvVar.name.trim() : '',
                description: typeof rawEnvVar?.description === 'string' ? rawEnvVar.description.trim() : '',
                effect: typeof rawEnvVar?.effect === 'string' ? rawEnvVar.effect.trim() : ''
            }
            : null);
    return {
        ...source,
        majorLocation: major,
        mediumLocation: medium,
        minorLocation: minor,
        specificLocation: specific,
        festival,
        weather,
        envVariables,
        gameDays: Math.max(1, Math.floor(originalGameDays)),
        year: typeof source?.year === 'number' && Number.isFinite(source.year) ? source.year : 1,
        month: typeof source?.month === 'number' && Number.isFinite(source.month) ? source.month : 1,
        day: typeof source?.day === 'number' && Number.isFinite(source.day) ? source.day : 1,
        hour: typeof source?.hour === 'number' && Number.isFinite(source.hour) ? source.hour : 6,
        time: typeof source?.time === 'string' ? source.time : '06:00',
        season: typeof source?.season === 'string' ? source.season : 'Xuân',
        timeProgressEnabled: source?.timeProgressEnabled ?? true
    } as any;
};
const buildFullLocation = (env: any): string => {
    const normalized = normalizeEnvironment(env);
    const parts = [normalized.majorLocation, normalized.mediumLocation, normalized.minorLocation, normalized.specificLocation]
        .map((part) => (part || '').trim())
        .filter(Boolean);
    const unique = parts.filter((part, idx) => parts.indexOf(part) === idx);
    return unique.length > 0 ? unique.join(' > ') : 'Unknown location';
};
const DefaultCharacterTemplate: CharacterData = {
    id: 'player',
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
    strength: 0,
    agility: 0,
    constitution: 0,
    rootBone: 0,
    intelligence: 0,
    luck: 0,
    tamTinh: 5,
    baseStats: {
        strength: 0,
        agility: 0,
        constitution: 0,
        rootBone: 0,
        intelligence: 0,
        luck: 0,
        tamTinh: 5
    },
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

const normalizeInventoryMapping = (rawRole: CharacterData): CharacterData => {
    const slotList: EquipmentSlot[] = ['head', 'chest', 'legs', 'hands', 'feet', 'mainWeapon', 'subWeapon', 'hiddenWeapon', 'back', 'waist', 'mount'];
    const slotSet = new Set<string>(slotList);
    const slotIDFragmentMapping: Record<EquipmentSlot, string> = {
        head: 'head',
        chest: 'chest',
        legs: 'legs',
        hands: 'hands',
        feet: 'feet',
        mainWeapon: 'main_weapon',
        subWeapon: 'off_weapon',
        hiddenWeapon: 'hidden_weapon',
        back: 'back',
        waist: 'waist',
        mount: 'mount'
    };
    const slotTypeMapping: Record<EquipmentSlot, 'Weapon' | 'Armor' | 'Container' | 'Miscellaneous'> = {
        head: 'Armor',
        chest: 'Armor',
        legs: 'Armor',
        hands: 'Armor',
        feet: 'Armor',
        mainWeapon: 'Weapon',
        subWeapon: 'Weapon',
        hiddenWeapon: 'Weapon',
        back: 'Container',
        waist: 'Container',
        mount: 'Miscellaneous'
    };

    const role: CharacterData = { ...deepCopy(DefaultCharacterTemplate), ...deepCopy(rawRole) };
    if (typeof (role as any).appearance !== 'string' || !(role as any).appearance.trim()) {
        (role as any).appearance = 'Ordinary appearance, simply dressed.';
    }
    const rawMoney = (role as any).money && typeof (role as any).money === 'object' ? (role as any).money : {};
    (role as any).money = {
        ...(rawMoney || {}),
        gold: normalizeCurrency(rawMoney?.gold ?? DefaultMoneyTemplate.gold),
        silver: normalizeCurrency(rawMoney?.silver ?? DefaultMoneyTemplate.silver),
        copper: normalizeCurrency(rawMoney?.copper ?? DefaultMoneyTemplate.copper)
    };

    const rawEquip = role?.equipment && typeof role.equipment === 'object' ? role.equipment : ({} as any);
    role.equipment = { ...DefaultEquipmentTemplate, ...(rawEquip as any) };

    const sourceList = Array.isArray(role?.itemList) ? role.itemList : [];

    const deduped: any[] = [];
    const seenIds = new Set<string>();
    sourceList.forEach((item: any, idx: number) => {
        // Accept both uppercase ID (legacy) and lowercase id (model-aligned / AI-pushed)
        const rawId = (typeof item?.ID === 'string' && item.ID.trim().length > 0)
            ? item.ID.trim()
            : (typeof item?.id === 'string' && item.id.trim().length > 0)
                ? item.id.trim()
                : '';

        // Avoid generic "Item00" style IDs if a name is available
        const isGeneric = !rawId || /^(item|itm)_?\d+$/i.test(rawId);
        let id = rawId;

        if (isGeneric && typeof item?.name === 'string' && item.name.trim().length > 0) {
            // Slugify name roughly, but keep it readable for AI
            const nameSlug = item.name.trim().toLowerCase().replace(/\s+/g, '_').slice(0, 20);
            id = `itm_${nameSlug}_${idx}`;
        } else if (!rawId) {
            id = `itm_auto_${idx}`;
        }

        if (seenIds.has(id)) return;
        seenIds.add(id);
        deduped.push({ ...item, ID: id, id: id }); // Ensure both uppercase and lowercase variants are consistent
    });

    const itemById = new Map<string, any>(deduped.map((item) => [item.ID, item]));
    // Recognize containers by containerProperties (model), containerAttributes (legacy),
    // or the untranslated Vietnamese key "Thuộc tính vật chứa" (from AI push before SUBKEY_MAP fix)
    const isContainerItem = (item: any) =>
        item?.containerProperties || item?.containerAttributes || item?.['container_properties'] || item?.['Thuộc tính vật chứa'];
    const containerIds = new Set<string>(
        deduped
            .filter((item) => isContainerItem(item))
            .map((item) => item.ID)
    );
    const findItemByRef = (idOrName: string): any | undefined => {
        return itemById.get(idOrName) || deduped.find((item) => item?.name === idOrName);
    };
    const createFallbackEquippedItem = (slot: EquipmentSlot, itemName: string): any => {
        let baseId = `itm_auto_equip_${slotIDFragmentMapping[slot]}`;
        let candidate = baseId;
        let suffix = 1;
        while (seenIds.has(candidate)) {
            candidate = `${baseId}_${suffix++}`;
        }
        seenIds.add(candidate);
        const type = slotTypeMapping[slot];
        // Use Vietnamese type names consistent with model/ItemType and what AI writes
        const typeVietnamese = type === 'Weapon' ? 'Vũ khí' : type === 'Armor' ? 'Phòng cụ' : type === 'Container' ? 'Vật chứa' : 'Tạp vật';
        const generated: any = {
            id: candidate,
            name: itemName,
            description: `Tự động hoàn thiện từ vị trí trang bị: ${slot}`,
            type: typeVietnamese,
            quality: 'Phàm phẩm',
            weight: slot === 'mount' ? 30 : 1,
            spaceOccupied: 1,
            value: 0,
            currentDurability: 100,
            maxDurability: 100,
            attributes: [],
            equippedSlot: slot,
            currentContainerId: slot
        };
        if (type === 'Container') {
            generated.equipPosition = slot === 'back' ? 'Lưng' : 'Thắt lưng';
            generated.containerProperties = {
                maxCapacity: slot === 'back' ? 20 : 8,
                currentUsedSpace: 0,
                maxSingleItemSize: slot === 'back' ? 5 : 3,
                weightReductionRatio: 0
            };
            containerIds.add(candidate);
        }
        if (type === 'Weapon') {
            generated.weaponSubtype = slot === 'hiddenWeapon' ? 'Ám khí' : 'Kiếm';
            generated.minAttack = 1;
            generated.maxAttack = 3;
            generated.speedModifier = 1;
            generated.parryRate = 0;
        }
        if (type === 'Armor') {
            const armorPositionMapping: Record<string, string> = {
                head: 'Đầu',
                chest: 'Ngực',
                legs: 'Chân',
                hands: 'Tay',
                feet: 'Bàn chân'
            };
            generated.equipPosition = armorPositionMapping[slot] || 'Ngực';
            generated.coveredParts = slot === 'head'
                ? ['Đầu']
                : slot === 'chest'
                    ? ['Ngực', 'Bụng']
                    : slot === 'legs'
                        ? ['Chân trái', 'Chân phải']
                        : slot === 'hands'
                            ? ['Cánh tay trái', 'Cánh tay phải']
                            : ['Bàn chân'];
            generated.physicalDefense = 1;
            generated.innerDefense = 1;
        }
        deduped.push(generated);
        itemById.set(candidate, generated);
        return generated;
    };
    const equippedByItemId = new Map<string, EquipmentSlot>();
    if (role.equipment && typeof role.equipment === 'object') {
        Object.entries(role.equipment).forEach(([slot, itemRef]) => {
            if (typeof itemRef === 'string' && itemRef.trim()) {
                const found = findItemByRef(itemRef);
                if (found) {
                    equippedByItemId.set(found.id, slot as EquipmentSlot);
                } else {
                    const fallback = createFallbackEquippedItem(slot as EquipmentSlot, itemRef);
                    equippedByItemId.set(fallback.id, slot as EquipmentSlot);
                }
            } else if (itemRef && typeof itemRef === 'object' && (itemRef as any).id) {
                const found = findItemByRef((itemRef as any).id);
                if (found) {
                    equippedByItemId.set(found.id, slot as EquipmentSlot);
                } else {
                    deduped.push(itemRef);
                    itemById.set((itemRef as any).id, itemRef);
                    equippedByItemId.set((itemRef as any).id, slot as EquipmentSlot);
                }
            }
        });
    }

    deduped.forEach((item) => {
        const slot = equippedByItemId.get(item.id);
        if (slot) {
            item.equippedSlot = slot;
            item.currentContainerId = slot;
        } else {
            delete item.equippedSlot;
            // Support both currentContainerId (model) and legacy containerId
            const containerRef = item.currentContainerId || item.containerId || '';
            if (containerIds.has(containerRef)) {
                item.currentContainerId = containerRef;
            } else {
                item.currentContainerId = '';
            }
        }
    });

    const locationById = new Map<string, string>();
    deduped.forEach((item) => {
        if (item.equippedSlot) {
            locationById.set(item.id, item.equippedSlot);
        } else if (item.currentContainerId) {
            locationById.set(item.id, item.currentContainerId);
        }
    });
    let changed = true;
    while (changed) {
        changed = false;
        deduped.forEach((item) => {
            if (!item.equippedSlot && item.currentContainerId) {
                const parentLocation = locationById.get(item.currentContainerId);
                if (parentLocation && parentLocation !== item.currentContainerId) {
                    item.currentContainerId = parentLocation;
                    locationById.set(item.id, parentLocation);
                    changed = true;
                }
            }
        });
    }

    deduped.forEach((container) => {
        if (isContainerItem(container)) {
            let used = 0;
            deduped.forEach((item) => {
                const itemRef = item.currentContainerId || item.containerId || '';
                if (itemRef === container.ID && item.ID !== container.ID) {
                    used += (item.spaceOccupied || item.occupiedSpace || 1);
                }
            });
            // Update containerProperties (model-aligned)
            if (container.containerProperties) {
                container.containerProperties.currentUsedSpace = used;
            }
            // Also keep legacy containerAttributes in sync for backward compat
            if (container.containerAttributes) {
                container.containerAttributes.currentSpace = used;
            }
        }
    });

    role.itemList = deduped;
    return role;
};

const getFirstNonEmptyText = (...values: unknown[]): string | undefined => {
    for (const value of values) {
        if (typeof value === 'string' && value.trim().length > 0) {
            return value.trim();
        }
    }
    return undefined;
};

const getFieldText = (obj: any, key: string): string | undefined => {
    return typeof obj?.[key] === 'string' ? obj[key].trim() : undefined;
};

const textQualityScore = (raw?: string): number => {
    if (!raw || raw.trim().length === 0) return 0;
    const text = raw.trim();
    if (/^(Unknown|None|None|Not recorded|Unnamed|\?+|n\/a)$/i.test(text)) return 1;
    return 2 + Math.min(text.length, 200) / 1000;
};

const getBetterText = (left?: string, right?: string): string | undefined => {
    const l = left?.trim();
    const r = right?.trim();
    const lScore = textQualityScore(l);
    const rScore = textQualityScore(r);
    if (rScore > lScore) return r;
    if (lScore > rScore) return l;
    if ((r?.length || 0) > (l?.length || 0)) return r;
    return l || r;
};

const normalizedKey = (raw: unknown): string => {
    if (typeof raw !== 'string') return '';
    return raw.trim().replace(/\s+/g, '').toLowerCase();
};

const parsingMemoryTimeSortValue = (raw?: string): number => {
    if (!raw) return Number.MAX_SAFE_INTEGER;
    const canonical = normalizeCanonicalGameTime(raw);
    if (!canonical) return Number.MAX_SAFE_INTEGER;
    const m = canonical.match(/^(\d{1,6}):(\d{2}):(\d{2}):(\d{2}):(\d{2})$/);
    if (!m) return Number.MAX_SAFE_INTEGER;
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    const hour = Number(m[4]);
    const minute = Number(m[5]);
    return (((year * 12 + month) * 31 + day) * 24 + hour) * 60 + minute;
};

const standardizationNPCMemory = (memoryRaw: any): Array<{ content: string; time: string }> => {
    if (!Array.isArray(memoryRaw)) return [];

    const normalized = memoryRaw
        .map((m: any) => {
            const content = typeof m?.content === 'string' ? m.content.trim() : '';
            const originalTime = typeof m?.time === 'string' ? m.time.trim() : '';
            const time = originalTime ? (normalizeCanonicalGameTime(originalTime) || originalTime) : '';
            return { content, time };
        })
        .filter((m) => m.content.length > 0 || m.time.length > 0);

    const timeByContent = new Map<string, string>();
    const contentByTime = new Map<string, string>();
    normalized.forEach((m) => {
        if (m.content && m.time && !timeByContent.has(m.content)) {
            timeByContent.set(m.content, m.time);
        }
        if (m.time && m.content && !contentByTime.has(m.time)) {
            contentByTime.set(m.time, m.content);
        }
    });

    normalized.forEach((m) => {
        if (!m.time && m.content && timeByContent.has(m.content)) {
            m.time = timeByContent.get(m.content)!;
        }
        if (!m.content && m.time && contentByTime.has(m.time)) {
            m.content = contentByTime.get(m.time)!;
        }
    });

    const unique = new Map<string, { content: string; time: string }>();
    normalized
        .filter((m) => m.content.length > 0)
        .forEach((m) => {
            const key = `${m.time}__${m.content}`;
            if (!unique.has(key)) {
                unique.set(key, { content: m.content, time: m.time || 'Unknown time' });
            }
        });

    return Array.from(unique.values())
        .sort((a, b) => parsingMemoryTimeSortValue(a.time) - parsingMemoryTimeSortValue(b.time));
};

const mergeStringArrays = (a: any, b: any): string[] | undefined => {
    const merged: string[] = [];
    const seen = new Set<string>();
    const push = (value: unknown) => {
        if (typeof value !== 'string') return;
        const text = value.trim();
        if (!text) return;
        if (seen.has(text)) return;
        seen.add(text);
        merged.push(text);
    };
    if (Array.isArray(a)) a.forEach(push);
    if (Array.isArray(b)) b.forEach(push);
    return merged.length > 0 ? merged : undefined;
};

const standardizeRelationshipVariables = (raw: any): Array<{ targetName: string; relation: string; note?: string }> | undefined => {
    if (!Array.isArray(raw)) return undefined;
    const merged = new Map<string, { targetName: string; relation: string; note?: string }>();
    raw.forEach((item: any) => {
        if (!item || typeof item !== 'object') return;
        const targetName = getFirstNonEmptyText(item?.targetName, item?.targetName, item?.targetName) || '';
        const relation = getFirstNonEmptyText(item?.relation, item?.relation) || '';
        const note = typeof item?.note === 'string' ? item.note.trim() : '';
        if (!targetName || !relation) return;
        const key = `${targetName}__${relation}`;
        merged.set(key, {
            targetName,
            relation,
            ...(note ? { note } : {})
        });
    });
    const out = Array.from(merged.values());
    return out.length > 0 ? out : undefined;
};

const mergeRelationshipVariables = (a: any, b: any): Array<{ targetName: string; relation: string; note?: string }> | undefined => {
    const merged = new Map<string, { targetName: string; relation: string; note?: string }>();
    const pushList = (raw: any) => {
        const normalized = standardizeRelationshipVariables(raw);
        if (!normalized) return;
        normalized.forEach((item) => {
            const key = `${item.targetName}__${item.relation}`;
            merged.set(key, item);
        });
    };
    pushList(a);
    pushList(b);
    const out = Array.from(merged.values());
    return out.length > 0 ? out : undefined;
};



export const standardizeSingleNPC = (rawNpc: any, fallbackIndex: number): any => {
    const npc = rawNpc && typeof rawNpc === 'object' ? rawNpc : {};
    const appearanceDescription = getFirstNonEmptyText(
        npc?.appearanceDescription,
        npc?.appearanceDescription,
        npc?.appearanceDescription
    );
    const bodyDescription = getFirstNonEmptyText(
        npc?.bodyDescription,
        npc?.bodyDescription
    );
    const clothingStyle = getFirstNonEmptyText(
        npc?.clothingStyle,
        npc?.clothingStyle
    );
    const memories = standardizationNPCMemory(npc?.memories || npc?.Memory);
    const corePersonalityTraits = getFirstNonEmptyText(npc?.corePersonalityTraits);
    const favorabilityBreakthroughCondition = getFirstNonEmptyText(npc?.favorabilityBreakthroughCondition);
    const relationBreakthroughCondition = getFirstNonEmptyText(npc?.relationBreakthroughCondition);
    const socialNetworkVariables = standardizeRelationshipVariables(npc?.socialNetworkVariables);

    return {
        ...npc,
        id: getFirstNonEmptyText(npc?.id, npc?.ID, `npc_${fallbackIndex}`) || `npc_${fallbackIndex}`,
        name: (() => {
            const rawName = getFirstNonEmptyText(npc?.name, npc?.fullName, npc?.['Họ tên']);
            const isGeneric = !rawName || /^(role|npc|char)_?\d+$/i.test(rawName);
            if (isGeneric && typeof npc?.identity === 'string' && npc.identity.trim().length > 0) {
                return npc.identity.trim();
            }
            return rawName || `Vô danh ${fallbackIndex}`;
        })(),
        gender: typeof npc?.gender === 'string' ? npc.gender : 'Unknown',
        age: Number.isFinite(Number(npc?.age)) ? Number(npc.age) : undefined,
        realm: typeof npc?.realm === 'string' ? npc.realm : 'Unknown realm',
        identity: typeof npc?.identity === 'string' ? npc.identity : 'Unknown identity',
        isPresent: typeof npc?.isPresent === 'boolean' ? npc.isPresent : true,
        isTeammate: typeof npc?.isTeammate === 'boolean' ? npc.isTeammate : false,
        isMainCharacter: typeof npc?.isMainCharacter === 'boolean' ? npc.isMainCharacter : false,
        favorability: Number.isFinite(Number(npc?.favorability)) ? Number(npc.favorability) : 0,
        relationStatus: typeof npc?.relationStatus === 'string' ? npc.relationStatus : 'Unknown',
        description: typeof npc?.description === 'string' ? npc.description : 'No intro yet',
        memories,
        ...(corePersonalityTraits ? { corePersonalityTraits } : {}),
        ...(favorabilityBreakthroughCondition ? { favorabilityBreakthroughCondition } : {}),
        ...(relationBreakthroughCondition ? { relationBreakthroughCondition } : {}),
        ...(Array.isArray(socialNetworkVariables) && socialNetworkVariables.length > 0 ? { socialNetworkVariables } : {}),
        ...(appearanceDescription ? { appearanceDescription } : {}),
        ...(bodyDescription ? { bodyDescription } : {}),
        ...(clothingStyle ? { clothingStyle } : {})
    };
};

const mergeNPCObject = (leftRaw: any, rightRaw: any, fallbackIndex: number): any => {
    const left = standardizeSingleNPC(leftRaw, fallbackIndex);
    const right = standardizeSingleNPC(rightRaw, fallbackIndex);
    const mergedMemories = standardizationNPCMemory([...(left.memories || []), ...(right.memories || [])]);

    const mergedEquip = (() => {
        const leftEquip = left?.currentEquipment && typeof left.currentEquipment === 'object' ? left.currentEquipment : undefined;
        const rightEquip = right?.currentEquipment && typeof right.currentEquipment === 'object' ? right.currentEquipment : undefined;
        if (!leftEquip && !rightEquip) return undefined;
        const keys = ['mainWeapon', 'subWeapon', 'clothing', 'accessory', 'underwear_top', 'underwear_bottom', 'socks', 'shoes'];
        const out: Record<string, string> = {};
        keys.forEach((k) => {
            const text = getBetterText(getFieldText(leftEquip, k), getFieldText(rightEquip, k));
            if (text) out[k] = text;
        });
        return Object.keys(out).length > 0 ? out : undefined;
    })();
    const mergedRelationNet = mergeRelationshipVariables(left?.socialNetworkVariables, right?.socialNetworkVariables);

    return {
        ...left,
        ...right,
        id: getFirstNonEmptyText(right.id, left.id, `npc_${fallbackIndex}`) || `npc_${fallbackIndex}`,
        name: getFirstNonEmptyText(right.name, left.name, `Role${fallbackIndex}`) || `Role${fallbackIndex}`,
        gender: getBetterText(getFieldText(left, 'gender'), getFieldText(right, 'gender')) || 'Unknown',
        age: Number.isFinite(Number(right?.age))
            ? Number(right.age)
            : (Number.isFinite(Number(left?.age)) ? Number(left.age) : undefined),
        realm: getBetterText(getFieldText(left, 'realm'), getFieldText(right, 'realm')) || 'Unknown realm',
        identity: getBetterText(getFieldText(left, 'identity'), getFieldText(right, 'identity')) || 'Unknown identity',
        isPresent: typeof right?.isPresent === 'boolean'
            ? right.isPresent
            : (typeof left?.isPresent === 'boolean' ? left.isPresent : true),
        isTeammate: typeof right?.isTeammate === 'boolean'
            ? right.isTeammate
            : (typeof left?.isTeammate === 'boolean' ? left.isTeammate : false),
        isMainCharacter: Boolean(left?.isMainCharacter) || Boolean(right?.isMainCharacter),
        favorability: Number.isFinite(Number(right?.favorability))
            ? Number(right.favorability)
            : (Number.isFinite(Number(left?.favorability)) ? Number(left.favorability) : 0),
        relationStatus: getBetterText(getFieldText(left, 'relationStatus'), getFieldText(right, 'relationStatus')) || 'Unknown',
        description: getBetterText(getFieldText(left, 'description'), getFieldText(right, 'description')) || 'No intro yet',
        corePersonalityTraits: getBetterText(getFieldText(left, 'corePersonalityTraits'), getFieldText(right, 'corePersonalityTraits')),
        favorabilityBreakthroughCondition: getBetterText(getFieldText(left, 'favorabilityBreakthroughCondition'), getFieldText(right, 'favorabilityBreakthroughCondition')),
        relationBreakthroughCondition: getBetterText(getFieldText(left, 'relationBreakthroughCondition'), getFieldText(right, 'relationBreakthroughCondition')),
        socialNetworkVariables: mergedRelationNet,
        appearanceDescription: getBetterText(getFieldText(left, 'appearanceDescription'), getFieldText(right, 'appearanceDescription')),
        bodyDescription: getBetterText(getFieldText(left, 'bodyDescription'), getFieldText(right, 'bodyDescription')),
        clothingStyle: getBetterText(getFieldText(left, 'clothingStyle'), getFieldText(right, 'clothingStyle')),
        attack: Number.isFinite(Number(right?.attack))
            ? Number(right.attack)
            : (Number.isFinite(Number(left?.attack)) ? Number(left.attack) : undefined),
        defense: Number.isFinite(Number(right?.defense))
            ? Number(right.defense)
            : (Number.isFinite(Number(left?.defense)) ? Number(left.defense) : undefined),
        lastUpdateTime: (() => {
            const leftTimeRaw = getFieldText(left, 'lastUpdateTime');
            const rightTimeRaw = getFieldText(right, 'lastUpdateTime');
            const l = leftTimeRaw ? (normalizeCanonicalGameTime(leftTimeRaw) || leftTimeRaw) : undefined;
            const r = rightTimeRaw ? (normalizeCanonicalGameTime(rightTimeRaw) || rightTimeRaw) : undefined;
            return getBetterText(l, r);
        })(),
        currentHp: Number.isFinite(Number(right?.currentHp))
            ? Number(right.currentHp)
            : (Number.isFinite(Number(left?.currentHp)) ? Number(left.currentHp) : undefined),
        maxHp: Number.isFinite(Number(right?.maxHp))
            ? Number(right.maxHp)
            : (Number.isFinite(Number(left?.maxHp)) ? Number(left.maxHp) : undefined),
        currentEnergy: Number.isFinite(Number(right?.currentEnergy))
            ? Number(right.currentEnergy)
            : (Number.isFinite(Number(left?.currentEnergy)) ? Number(left.currentEnergy) : undefined),
        maxEnergy: Number.isFinite(Number(right?.maxEnergy))
            ? Number(right.maxEnergy)
            : (Number.isFinite(Number(left?.maxEnergy)) ? Number(left.maxEnergy) : undefined),
        currentEquipment: mergedEquip,
        inventory: mergeStringArrays(left?.inventory, right?.inventory),
        memories: mergedMemories
    };
};

const mergeSameNamesNPCList = (list: any[]): any[] => {
    if (!Array.isArray(list)) return [];
    const merged: any[] = [];
    const nameIndexMap = new Map<string, number>();
    const idIndexMap = new Map<string, number>();

    list.forEach((rawNpc, index) => {
        const normalized = standardizeSingleNPC(rawNpc, index);
        const nameKey = normalizedKey(normalized?.name);
        const idKey = normalizedKey(normalized?.id);
        const idMatchedIndex = idKey ? idIndexMap.get(idKey) : undefined;
        const nameMatchedIndex = nameKey ? nameIndexMap.get(nameKey) : undefined;
        const targetIndex = typeof idMatchedIndex === 'number'
            ? idMatchedIndex
            : (typeof nameMatchedIndex === 'number' ? nameMatchedIndex : -1);

        if (targetIndex < 0) {
            const pushIndex = merged.length;
            merged.push(normalized);
            const newNameKey = normalizedKey(normalized?.name);
            const newIdKey = normalizedKey(normalized?.id);
            if (newNameKey) nameIndexMap.set(newNameKey, pushIndex);
            if (newIdKey) idIndexMap.set(newIdKey, pushIndex);
            return;
        }

        merged[targetIndex] = mergeNPCObject(merged[targetIndex], normalized, targetIndex);
        const mergedNameKey = normalizedKey(merged[targetIndex]?.name);
        const mergedIdKey = normalizedKey(merged[targetIndex]?.id);
        if (mergedNameKey) nameIndexMap.set(mergedNameKey, targetIndex);
        if (mergedIdKey) idIndexMap.set(mergedIdKey, targetIndex);
    });

    return merged;
};

const normalizeLocationAffiliation = (raw: any): any => {
    const source = raw && typeof raw === 'object' ? raw : {};
    const getTargetValue = (primary: any, ...fallbacks: any[]) => {
        if (primary !== undefined && primary !== null) return primary;
        for (const f of fallbacks) {
            if (f !== undefined && f !== null) return f;
        }
        return '';
    };

    let medium = getTargetValue(source.mediumLocation, source.area, source['Địa điểm Vừa'], source['Trung địa điểm'], source['Địa điểm trung'], source['Thành thị'], source['Thành phố']);
    if (typeof medium === 'string' && (medium.includes(',') || medium.includes(';') || medium.includes('，'))) {
        medium = medium.split(/[,\r\n;，]+/).map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(medium)) {
        medium = medium.map(m => (typeof m === 'string' ? m.trim() : m)).filter(Boolean);
    }

    const major = getTargetValue(source.majorLocation, source.region, source['Địa điểm Lớn'], source['Đại địa điểm'], source['Địa điểm lớn'], source['Vùng'], source['Vùng lớn']);

    let minor = getTargetValue(source.minorLocation, source.subArea, source['Địa điểm Nhỏ'], source['Tiểu địa điểm'], source['Địa điểm nhỏ'], source['Khu vực'], source['Công trình'], source['Kiến trúc']);
    if (typeof minor === 'string' && (minor.includes(',') || minor.includes(';') || minor.includes('，'))) {
        minor = minor.split(/[,\r\n;，]+/).map(s => s.trim()).filter(Boolean);
    }

    return {
        majorLocation: (typeof major === 'string' ? major.trim() : major) || '',
        mediumLocation: medium || '',
        minorLocation: minor || ''
    };
};

const normalizeSingleMap = (raw: any): any => {
    const m = raw && typeof raw === 'object' ? raw : {};
    let buildingsRaw = m.internalBuildings || m['Kiến trúc nội khu'] || m['Danh sách kiến trúc'] || m['Kiến trúc nội bộ'] || m['Kiến trúc'] || [];
    if (typeof buildingsRaw === 'string') {
        buildingsRaw = buildingsRaw.split(/[,\r\n;]+/).map(s => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(buildingsRaw)) {
        buildingsRaw = [buildingsRaw];
    }

    const internalBuildings = buildingsRaw.map((b: any) => {
        if (typeof b === 'string') return { name: b.trim(), description: '', affiliation: {} };
        if (b && typeof b === 'object') return normalizeSingleBuilding(b);
        return null;
    }).filter(Boolean);

    return {
        name: getFirstNonEmptyText(m.name, m.Name, m['Tên'], m['Tên địa điểm'], m['Địa danh']) || 'Unnamed Location',
        coordinate: getFirstNonEmptyText(m.coordinate, m.coordinates, m.Coordinate, m['Tọa độ'], m['Vị trí'], m['Vị trí bản đồ']) || 'Unknown',
        description: getFirstNonEmptyText(m.description, m.Description, m['Mô tả'], m['Cảnh vật'], m['Chi tiết']) || '',
        avatar: m.avatar || m.image || m['Ảnh'] || m['Hình ảnh'] || '',
        affiliation: normalizeLocationAffiliation(m.affiliation || m.ownership || m['Sở hữu'] || m['Quy thuộc'] || m['Thuộc về'] || m['Nằm trong']),
        internalBuildings
    };
};

const normalizeSingleBuilding = (raw: any): any => {
    const b = raw && typeof raw === 'object' ? raw : {};
    return {
        name: getFirstNonEmptyText(b.name, b.Name, b['Tên'], b['Tên kiến trúc']) || 'Unnamed Building',
        description: getFirstNonEmptyText(b.description, b.Description, b['Mô tả'], b['Chi tiết kiến trúc']) || '',
        affiliation: normalizeLocationAffiliation(b.affiliation || b.ownership || b['Sở hữu'] || b['Quy thuộc'] || b['Thuộc về'] || b['Nằm trong'])
    };
};

const standardizeSocialList = (list: any[], options?: { mergeSameNames?: boolean }): any[] => {
    if (!Array.isArray(list)) return [];
    const normalized = list.map((npc, index) => standardizeSingleNPC(npc, index));
    if (options?.mergeSameNames === false) return normalized;
    return mergeSameNamesNPCList(normalized);
};

const normalizeWorldStatus = (raw?: any): any => {
    const world = raw && typeof raw === 'object' ? raw : {};
    const rawMaps = Array.isArray(world.maps) ? world.maps
        : (Array.isArray(world.Maps) ? world.Maps
            : (Array.isArray(world['Bản đồ']) ? world['Bản đồ']
                : (Array.isArray(world['Danh sách bản đồ']) ? world['Danh sách bản đồ'] : [])));
    const rawBuildings = Array.isArray(world.buildings) ? world.buildings
        : (Array.isArray(world.Buildings) ? world.Buildings
            : (Array.isArray(world['Kiến trúc']) ? world['Kiến trúc'] : []));
    const rawOngoing = Array.isArray(world.ongoingEvents) ? world.ongoingEvents
        : (Array.isArray(world['Sự kiện đang diễn ra']) ? world['Sự kiện đang diễn ra'] : []);
    const rawSettled = Array.isArray(world.settledEvents) ? world.settledEvents
        : (Array.isArray(world['Sự kiện đã kết thúc']) ? world['Sự kiện đã kết thúc'] : []);

    return {
        ...world,
        activeNpcList: Array.isArray(world.activeNpcList) ? world.activeNpcList : [],
        maps: rawMaps.map((m: any) => normalizeSingleMap(m)),
        buildings: rawBuildings.map((b: any) => normalizeSingleBuilding(b)),
        ongoingEvents: rawOngoing,
        settledEvents: rawSettled,
        worldHistory: Array.isArray(world.worldHistory) ? world.worldHistory : []
    };
};

const normalizeCombatStatus = (raw?: any): any => {
    const battle = raw && typeof raw === 'object' ? raw : {};
    const enemy = battle.enemy && typeof battle.enemy === 'object' ? battle.enemy : null;
    return {
        ...battle,
        isInBattle: Boolean(battle.isInBattle),
        enemy: enemy ? {
            ...enemy,
            name: typeof enemy.name === 'string' ? enemy.name : 'Unknown',
            realm: typeof enemy.realm === 'string' ? enemy.realm : 'Unknown',
            description: typeof enemy.description === 'string' ? enemy.description : '',
            skills: Array.isArray(enemy.skills) ? enemy.skills : [],
            combatPower: Number(enemy.combatPower) || 0,
            defense: Number(enemy.defense) || 0,
            currentHp: Number(enemy.currentHp) || 0,
            maxHp: Number(enemy.maxHp) || 100,
            currentEnergy: Number(enemy.currentEnergy) || 0,
            maxEnergy: Number(enemy.maxEnergy) || 100
        } : null
    };
};

const normalizeStoryStatus = (raw?: any, env?: any): any => {
    const story = raw && typeof raw === 'object' ? raw : {};
    const currentChapter = story.currentChapter && typeof story.currentChapter === 'object' ? story.currentChapter : {};
    return {
        ...story,
        currentChapter: {
            ...currentChapter,
            id: typeof currentChapter.id === 'string' ? currentChapter.id : 'ch_0',
            index: Number(currentChapter.index) || 0,
            title: typeof currentChapter.title === 'string' ? currentChapter.title : 'Intro',
            summary: typeof currentChapter.summary === 'string' ? currentChapter.summary : '',
            backgroundStory: typeof currentChapter.backgroundStory === 'string' ? currentChapter.backgroundStory : '',
            mainConflict: typeof currentChapter.mainConflict === 'string' ? currentChapter.mainConflict : '',
            endConditions: Array.isArray(currentChapter.endConditions) ? currentChapter.endConditions : [],
            foreshadowingList: Array.isArray(currentChapter.foreshadowingList) ? currentChapter.foreshadowingList : []
        },
        nextChapterPreview: story.nextChapterPreview && typeof story.nextChapterPreview === 'object' ? story.nextChapterPreview : { title: '', outline: '' },
        historicalArchives: Array.isArray(story.historicalArchives) ? story.historicalArchives : [],
        shortTermPlanning: typeof story.shortTermPlanning === 'string' ? story.shortTermPlanning : '',
        mediumTermPlanning: typeof story.mediumTermPlanning === 'string' ? story.mediumTermPlanning : '',
        longTermPlanning: typeof story.longTermPlanning === 'string' ? story.longTermPlanning : '',
        pendingEvents: Array.isArray(story.pendingEvents) ? story.pendingEvents : [],
        worldQuestList: Array.isArray(story.worldQuestList) ? story.worldQuestList : (Array.isArray(story['Nhiệm vụ thế giới']) ? story['Nhiệm vụ thế giới'] : []),
        promiseList: Array.isArray(story.promiseList) ? story.promiseList : (Array.isArray(story['Hứa hẹn']) ? story['Hứa hẹn'] : []),
        storyVariables: story.storyVariables && typeof story.storyVariables === 'object' ? story.storyVariables : {},
        actionCountSinceLastChapter: Number(story.actionCountSinceLastChapter) || 0
    };
};

const normalizeGameSettings = (raw?: any): any => {
    const settings = raw && typeof raw === 'object' ? raw : {};
    // Pattern guide: `!== false` means "true by default when undefined (opt-out flag)";
    //                `=== true`  means "false by default when undefined (opt-in flag)".
    const result: any = {
        ...settings,
        // 450 tokens ≈ a balanced turn length for wuxia narrative
        bodyLengthRequirement: (() => {
            const val = Number(settings.bodyLengthRequirement);
            if (val === 1500) return 3000;
            return val || 3000;
        })(),
        // Default to 2nd-person (Ngôi thứ hai) — most immersive for interactive fiction
        narrativePerspective: typeof settings.narrativePerspective === 'string' ? settings.narrativePerspective : 'Ngôi thứ hai',
        jsonMode: typeof settings.jsonMode === 'string' ? settings.jsonMode : 'auto',
        // Opt-out flags (enabled by default)
        enableActionOptions: settings.enableActionOptions !== false,
        enablePreventSpeaking: settings.enablePreventSpeaking !== false,
        enablePseudoCotInjection: settings.enablePseudoCotInjection !== false,
        enableDisclaimerOutput: settings.enableDisclaimerOutput !== false,
        // Opt-in flags (disabled by default)
        enableMultiThinking: settings.enableMultiThinking === true,

        storyStyle: typeof settings.storyStyle === 'string' ? settings.storyStyle : 'Thông thường',
        extraPrompt: typeof settings.extraPrompt === 'string' ? settings.extraPrompt : ''
    };
    if (settings.enableClaudeMode !== undefined) result.enableClaudeMode = settings.enableClaudeMode === true;
    if (settings.enableTagIntegrityCheck !== undefined) result.enableTagIntegrityCheck = settings.enableTagIntegrityCheck === true;
    if (settings.enableTagAutoFix !== undefined) result.enableTagAutoFix = settings.enableTagAutoFix !== false;
    if (settings.enableRetryOnParseFail !== undefined) result.enableRetryOnParseFail = settings.enableRetryOnParseFail !== false;
    if (settings.enableVariableCalibration !== undefined) result.enableVariableCalibration = settings.enableVariableCalibration === true;
    if (settings.enableRealWorldMode !== undefined) result.enableRealWorldMode = settings.enableRealWorldMode === true;
    if (typeof settings.realityPerspective === 'string') result.realityPerspective = settings.realityPerspective;
    if (typeof settings.realityStyle === 'string') result.realityStyle = settings.realityStyle;
    if (typeof settings.realityLogicPrompt === 'string') result.realityLogicPrompt = settings.realityLogicPrompt;
    return result;
};



export {
    normalizeEnvironment,
    buildFullLocation,
    normalizeInventoryMapping,
    standardizeSocialList,
    normalizeWorldStatus,
    normalizeCombatStatus,
    normalizeStoryStatus,
    normalizeGameSettings
};

