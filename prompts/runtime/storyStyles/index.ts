import { storyStylePromptCultivation } from './cultivation';
import { storyStylePromptGeneral } from './general';
import { storyStylePromptShura } from './shura';
import { storyStylePromptPureLove } from './pureLove';

const stylePromptMapping: Record<string, string> = {
    'Tu luyện': storyStylePromptCultivation,
    'Thông thường': storyStylePromptGeneral,
    'Tu la tràng': storyStylePromptShura,
    'Thuần ái': storyStylePromptPureLove,
    // Compat
    Cultivation: storyStylePromptCultivation,
    General: storyStylePromptGeneral,
    'Asura field': storyStylePromptShura,
    'Pure Love': storyStylePromptPureLove,
};

export const getStoryStylePrompt = (style: string): string => {
    return stylePromptMapping[style] || stylePromptMapping['Thông thường'];
};

export const constructStorylineStyleAssistantPrompt = (style: string): string => {
    return `【Ưu tiên phong cách truyện】\n${getStoryStylePrompt(style)}`;
};
