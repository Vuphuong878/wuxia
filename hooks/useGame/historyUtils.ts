import { ChatHistory } from '../../types';

export const formatHistoryToScript = (historyItems: ChatHistory[]): string => {
    return historyItems.map((h) => {
        const timeStr = h.gameTime ? `【${h.gameTime}】\n` : '';
        if (h.role === 'user') {
            return `${timeStr}Player：${h.content}`;
        }
        if (h.role === 'assistant' && h.structuredResponse) {
            const logs = Array.isArray(h.structuredResponse.logs) ? h.structuredResponse.logs : [];
            const lines = logs
                .filter((l) => l.sender !== '【NSFWJudgment】' && l.sender !== 'Judgment' && l.sender !== '【Judgment】')
                .map((l) => `${l.sender}：${l.text}`).join('\n');
            if (!lines.trim()) return '';
            return `${timeStr}${lines}`;
        }
        return '';
    }).filter(item => item.trim().length > 0).join('\n\n');
};
