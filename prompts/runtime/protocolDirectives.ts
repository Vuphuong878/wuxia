import type { PromptStructure } from '../../types';
import { Core_OutputFormat } from '../core/format';
import { Core_OutputFormat_MultiThought } from '../core/formatMulti';
import { CoreActionOptions } from '../core/actionOptions';

const getPromptContent = (promptPool: PromptStructure[], id: string): string => {
    const hit = promptPool.find((item) => item.id === id);
    return typeof hit?.content === 'string' ? hit.content.trim() : '';
};

export const getOutputProtocolPrompt = (promptPool: PromptStructure[]): string => {
    return getPromptContent(promptPool, 'core_format')
        || getPromptContent(promptPool, 'core_format_multi')
        || (typeof Core_OutputFormat?.content === 'string' ? Core_OutputFormat.content.trim() : '')
        || (typeof Core_OutputFormat_MultiThought?.content === 'string' ? Core_OutputFormat_MultiThought.content.trim() : '');
};

export const getActionOptionsPrompt = (
    promptPool: PromptStructure[],
    enabled: boolean
): string => {
    if (!enabled) return '';
    return getPromptContent(promptPool, 'core_action_options')
        || (typeof CoreActionOptions?.content === 'string' ? CoreActionOptions.content.trim() : '');
};

export const constructWordCountRequirementPrompt = (minLength: number): string => {
    const safeValue = Number.isFinite(minLength) ? Math.max(50, Math.floor(minLength)) : 800;
    return [
        `<WordCount>Độ dài nội dung <Main Body> mong muốn khoảng **${safeValue} chữ**.</WordCount>`,
        'Lưu ý: Khuyến khích mô tả chi tiết từng hành động, biểu cảm, bối cảnh và nội tâm NPC.'
    ].join('\n');
};

export const constructDisclaimerOutputPrompt = (): string => {
    return [
        'Vui lòng xuất thẻ <disclaimer>...</disclaimer> ở cuối hiệp.',
        'Thông báo miễn trừ trách nhiệm phải được đặt sau thẻ <Command> và không được làm gián đoạn nội dung <Main Body>.'
    ].join('\n');
};
