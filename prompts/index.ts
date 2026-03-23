
import { PromptStructure } from '../types';

// Core
import { Core_OutputFormat } from './core/format';
import { CoreRules } from './core/rules';
import { coreDataFormat } from './core/data';
import { coreMemoryLaws } from './core/memory'; 
import { coreWorldview } from './core/world'; 
import { CoreChainOfThought } from './core/cot';   
import { CoreChainOfThoughtMulti } from './core/cotMulti';
import { CoreAncientRealism } from './core/ancientRealism';
import { coreStoryProgression } from './core/story';
import { CoreActionOptions } from './core/actionOptions';
import { coreTimeProgression } from './core/timeProgress';
import { Core_OutputFormat_MultiThought } from './core/formatMulti';

// Stats
import { StatCharacter } from './stats/character';
import { StatItem } from './stats/items';
import { StatKungfu } from './stats/kungfu';
import { StatWorldEvolution } from './stats/world'; 
import { StatOtherSettings } from './stats/others';
import { StatCombat } from './stats/combat';
import { StatBodyHealth } from './stats/body';
import { StatExperience } from './stats/experience';
import { StatCultivation } from './stats/cultivation';
import { StatNpcReference } from './stats/npc';
import { StatResourceDrop } from './stats/drop';
import { StatRecovery } from './stats/recovery';
import { StatItemWeight } from './stats/itemWeight';

// Difficulty
import { Difficulty_Game } from './difficulty/game';
import { Difficulty_Judgment } from './difficulty/check';
import { Difficulty_Physiology } from './difficulty/physiology';

// Writing
import { WritingPerspectiveFirst, WritingPerspectiveSecond, WritingPerspectiveThird } from './writing/perspective';
import { WritingRequirements } from './writing/requirements';
import { WritingNoControl } from './writing/noControl';
import { WritingStyle } from './writing/style';

import { WritingEmotionGuard } from './writing/emotionGuard';

export const DefaultPrompts: PromptStructure[] = [
    // Core
    coreWorldview,
    CoreAncientRealism,
    Core_OutputFormat,
    Core_OutputFormat_MultiThought,
    CoreRules,
    coreStoryProgression,
    coreTimeProgression,
    CoreActionOptions,
    coreDataFormat,
    coreMemoryLaws,
    CoreChainOfThought,
    CoreChainOfThoughtMulti,

    // Stats
    StatCharacter,
    StatItem,
    StatKungfu,
    StatWorldEvolution,
    StatOtherSettings,
    StatCombat,
    StatBodyHealth,
    StatExperience,
    StatCultivation,
    StatNpcReference,
    StatResourceDrop,
    StatRecovery,
    StatItemWeight,

    // Difficulty (Arrays)
    ...Difficulty_Game,
    ...Difficulty_Judgment,
    ...Difficulty_Physiology,

    // Writing
    WritingPerspectiveFirst,
    WritingPerspectiveSecond,
    WritingPerspectiveThird,
    WritingRequirements,
    WritingNoControl,
    WritingStyle,

    WritingEmotionGuard
];
