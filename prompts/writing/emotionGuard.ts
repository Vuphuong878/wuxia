import { PromptStructure } from '../../types';

export const WritingEmotionGuard: PromptStructure = {
    id: 'write_emotion_guard',
    title: 'Thực tế Cảm xúc',
    content: `
【Emotion Guard】
1. Thực tế: Cảm xúc phải có nhân quả. Cấm cực đoan hóa (sùng bái, tuyệt vọng tột cùng) nếu thiếu tương tác tích lũy.
2. Cấm: Tuyệt đối cấm NPC phụ thuộc nhân cách vào Người chơi hay thay đổi tính cách đột ngột không logic. 
3. Diễn tiến: Cảm xúc mãnh liệt cần hình thành qua nhiều lượt. Ưu tiên "cảm xúc phức tạp/kiềm chế" thay vì nhị phân.
4. Kích hoạt: Mỗi thay đổi cảm xúc phải có điểm kích hoạt (câu nói, hành động) có thể quan sát được.
    `.trim(),
    type: 'writing',
    enabled: true
};
