
import { PromptStructure } from '../../types';

export const coreWorldMechanics: PromptStructure = {
    id: 'core_world_mechanics',
    title: 'Pháp Tắc Thế Giới',
    content: `
# Pháp Tắc Thế Giới: Nghiệp Lực, Pháp Tắc và Bế Quan
[System Note: Quản lý sự vận hành vĩ mô của thế giới tu chân thông qua các biến số Karma (Nghiệp Lực) và World Tick (Pháp Tắc).]

## I. Hệ Thống Nghiệp Lực (Karma - Nghiệp Lực)
- **Cơ chế**: AI theo dõi giá trị \`karma\` trong EnvironmentData.
- **Tác động**:
  - \`karma > 50\`: Thế giới bắt đầu "ghét bỏ". Gặp điềm gở, giá cả giao thương đắt đỏ, xác suất rơi vào bẫy cao hơn.
  - \`karma > 100 (Thiên Phạt Sơ Cấp)\`: Thời tiết luôn u ám nơi {{user}} đi qua. Lôi kiếp nhỏ thường xuyên đánh xuống "nhầm" vị trí.
  - \`karma > 300 (Thiên Đạo Ruồng Rẫy)\`: Các tông môn phe Thiện sẽ truy sát. May mắn (Luck) bị trừ 50% vĩnh viễn cho đến khi tẩy nghiệp.
  - \`karma < -50 (Công Đức)\`: Vận khí hanh thông, dễ gặp kỳ ngộ, mua bán được giảm giá.

## II. Vòng Quay Pháp Tắc (World Tick - Pháp Tắc)
- **Cơ chế**: Biến số \`worldTick\` tự động tăng sau mỗi lượt tương tác.
- **Sự kiện chu kỳ**:
  - **Mỗi 10 Tick (Biến động nhỏ)**: Thay đổi thời tiết khu vực, giá cả thị trường biến động.
  - **Mỗi 30 Tick (Biến động trung)**: Bí cảnh ngẫu nhiên xuất hiện, một tiểu tông môn bị diệt vong hoặc quật khởi.
  - **Mỗi 100 Tick (Đại Kiếp Thế Giới)**: Thay đổi cục diện chính trị toàn lục địa, thiên tai quy mô lớn hoặc sự thức tỉnh của cổ đại ma thần.

## III. Cơ Chế Bế Quan (Seclusion Mechanics)
- **Yếu tố duration**: AI quyết định thời gian bế quan dựa trên: (Độ khó công pháp / Căn cốt) * (Linh khí môi trường).
- **Rủi ro**: 
  - Đột phá không phải lúc nào cũng thành công. 
  - Nếu bế quan quá lâu mà không có chuẩn bị, có xác suất \`Qi Deviation\` (Tẩu hỏa nhập ma) hoặc \`Heart Demon\` (Tâm ma xâm lấn).
  - Khi bế quan, hãy kích hoạt "Hệ thống Cơ Duyên Động Cho NPC" để cập nhật thế giới bên ngoài.
`.trim(),
    type: 'core',
    enabled: true
};
