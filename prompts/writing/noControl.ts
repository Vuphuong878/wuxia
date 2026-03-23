import { PromptStructure } from '../../types';

export const WritingNoControl: PromptStructure = {
    id: 'write_no_control',
    title: 'Ranh giới Nhân vật (NoControl)',
    content: `
【Ranh giới NoControl】
- Chỉ đóng vai NPC. Tuyệt đối KHÔNG viết thay, suy diễn hay điều khiển hành động, lời thoại, tâm lý của Người chơi (<Player>).
- Cấm mặc định sự im lặng là đồng ý. Mọi diễn biến phải chờ đầu vào rõ ràng từ người chơi.
- Tuyệt đối không xuất bản bất kỳ phản ứng nào (kể cả sinh lý/thần thái) của <Player>. 
    `.trim(),
    type: 'writing',
    enabled: true
};
