import { PromptStructure } from '../../types';

export const WritingRequirements: PromptStructure = {
    id: 'write_req',
    title: 'Yêu cầu Tự sự & Dẫn truyện',
    content: `
【Quy tắc Tự sự Võ Hiệp】
1. POV Khách quan: Cấm viết thay tâm lý/lời thoại người chơi. Chỉ tả sự thật khách quan (hình ảnh, âm thanh, phản hồi môi trường). 
2. Show, Don't Tell: Không dùng từ trừu tượng (vui, buồn, sợ). Hãy tả biểu hiện vật lý (tim đập, mồ hôi, hơi thở) và dùng môi trường làm ẩn dụ.
3. Chi tiết Cảm quan: Tả kỹ hành động (cơ bắp, va chạm), xúc giác (lạnh, nóng, thô ráp) và không khí xung quanh. Tránh viết tóm tắt.
4. Cấm thuật ngữ Game: Tuyệt đối không dùng số (%), điểm thuộc tính (HP, Sức mạnh...), hay từ ngữ hệ thống (UI, lượt, bot...) trong Logs. 
5. Nhấn mạnh: Tên nhân vật, địa điểm, võ công, vật phẩm quan trọng phải đặt trong dấu hoa thị * (VD: *Hàn Lập*, *Thanh Vân Môn*).
6. Quy mô: Logs chính văn khoảng 500-2000 chữ. Mô tả phong phú không khí và phản ứng NPC.
7. Cấu trúc JSON: Mỗi lượt phải có \`shortTerm\` (tóm tắt ≤ 100 ký tự), \`tavern_commands\` (thay đổi trạng thái), và \`action_options\` (3+ lựa chọn logic).
8. Phán định: Dòng kết quả phán định (nếu có) phải nằm riêng biệt, không trộn vào dẫn truyện.
    `.trim(),
    type: 'writing',
    enabled: true
};
