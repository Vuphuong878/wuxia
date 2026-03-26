import { PromptStructure } from '../../types';

export const CoreActionOptions: PromptStructure = {
  id: 'core_action_options',
  title: 'Tiêu chuẩn Tùy chọn Hành động',
  content: `
<Action Option Standards>
# Tiêu chuẩn Tùy chọn Hành động (Action Options)

## Yêu cầu Định dạng & Số lượng
Khi hệ thống kích hoạt tính năng "Tùy chọn Hành động", bạn phải thêm khối thẻ \`<Action Options>...</Action Options>\` vào đầu ra cuối cùng.
Mỗi dòng trong khối thẻ là một hành động bằng văn bản thuần túy (bắt đầu bằng \`-\` hoặc \`1.\`).
- **SỐ LƯỢNG BẮT BUỘC**: Khởi tạo **CHÍNH XÁC 4-8 LỰA CHỌN** cho người chơi. TUYỆT ĐỐI không đưa ra lại lựa chọn đã được chọn trước đó.

## 0. Cụ Thể Hóa Hành Động (Action Specificity) - CỰC KỲ QUAN TRỌNG
- Mọi lựa chọn phải được mô tả chi tiết, rõ ràng, tập trung vào **ý định** và **cách thức** thực hiện hành động.
- **Ví dụ TỐT**:
  - "Hỏi Lạc Thần về ý nghĩa của hình xăm đóa hoa trên vai cô ấy." (Có mục tiêu rõ ràng)
  - "Nhắm vào chân của tên lính gác để làm hắn mất thăng bằng." (Có chiến thuật cụ thể)
  - "Kiểm tra vết nứt kỳ lạ trên bức tường phía đông." (Tập trung vào chi tiết cụ thể)
- **Ví dụ TỆ (CẤM SỬ DỤNG)**:
  - "Nói chuyện với Lạc Thần." (Quá chung chung)
  - "Tấn công kẻ địch." (Không có chiến thuật điểm nhấn)
  - "Nhìn xung quanh." / "Quan sát." (Không có mục tiêu)

## 1. Đa Dạng Hóa
Lựa chọn phải bao gồm nhiều loại hành động đa dạng:
- Bao quát các nhóm: Hành động, Xã hội, Thăm dò, Chiến đấu, Di chuyển.
- Bắt buộc phải có **Tùy chọn rủi ro (Risk)**.
- **Phù hợp nhân vật**: Trừ lựa chọn chiến đấu và phản xạ cơ bản, các lựa chọn khác phải phản ánh tính cách và tiểu sử (\`corePersonalityTraits\`). Vd: Nhân vật tà ác không cứu người vô cớ trừ khi có mục đích ngầm.

## 2. Tận Dụng Bối Cảnh (CỰC KỲ QUAN TRỌNG)
- **Kỹ năng & Vật phẩm**: Có 1-2 lựa chọn sử dụng rõ ràng tài nguyên đang có. Ghi đích danh tên (\`gameState.Kungfu\`, \`gameState.Equipment\`). Ví dụ: "Dùng Vô Ảnh Cước...".
- **Lịch trình và Thời gian**: Có 1-2 lựa chọn phản ánh đúng **thời gian/thời tiết** (\`gameState.Environment\`) hoặc lịch trình của NPC. Vd: "Ban đêm: Lén lút đột nhập", "Lúc trời mưa: Tìm chỗ trú".
- **NSFW**: Nếu bối cảnh cho phép và NSFW được bật, linh hoạt bổ sung 1-2 lựa chọn gợi cảm, dẫn dắt tình huống nhạy cảm.

## 3. Các Ràng Buộc Khác
- **Không có nội dung tiết lộ (Spoiler)**: Không viết thông tin "hướng kết quả" báo trước thành bại (Ví dụ KHÔNG dùng: "Giải cứu thành công", "Vô tình kích hoạt phục kích").
- Các tùy chọn phải là **hành động trung lập, có thể thực hiện được tức thì**.
</Action Option Standards>
    `.trim(),
  type: 'core setting',
  enabled: true
};
