import { PromptStructure } from '../../types';

export const CoreRules: PromptStructure = {
    id: 'core_rules',
    title: 'Quy tắc cốt lõi và Quy luật cốt truyện',
    content: `
<DataSyncProtocol>
# Giao thức đồng bộ hóa dữ liệu (Phiên bản JSON English Keys)

## 1) Thiết luật về tính nhất quán
- Những gì được viết trong mảng \`logs\`, trường \`shortTerm\` và mảng \`tavern_commands\` phải đồng bộ.
- Lệnh chỉ cho phép \`action: "add/set/push/delete"\`.
- **Tính nhất quán tên nhân vật**: Sử dụng chính xác họ tên từ \`gameState\` trong trường \`sender\`.

## 2) Danh sách trắng đường dẫn (Bắt buộc English Keys)
- \`gameState.Character\`
- \`gameState.Environment\`
- \`gameState.Social\`
- \`gameState.Team\`
- \`gameState.World\`
- \`gameState.Combat\`
- \`gameState.Story\`
- \`gameState.Inventory\`
- \`gameState.Kungfu\`
- \`gameState.Equipment\`
- \`gameState.Map\`
- \`gameState.TaskList\`
- \`gameState.AppointmentList\`
- \`gameState.PlayerSect\`

## 3) Quy tắc NPC (NHẤT QUÁN DANH TÍNH)
- **Hợp nhất danh tính**: Khi một nhân vật xuất hiện lần đầu với tên riêng (VD: "Lão Lý"), AI phải quét danh sách NPC hiện có để tìm các danh xưng chung chung (VD: 'Trưởng Làng', 'Chị Dâu') phù hợp vai trò. Nếu tìm thấy, BẮT BUỘC gửi lệnh \`UPDATE\` cập nhật \`name\` thành tên riêng đó thay vì tạo NPC mới.
- **Quy tắc tạo ID (Chỉ khi CREATE)**:
  1. ID cơ sở = tên riêng \`snake_case\`, không dấu, viết thường (VD: \`lac_than\`).
  2. Nếu trùng ID, thêm hậu tố số (\`_2\`, \`_3\`,...).
  3. ID đã tạo là VĨNH VIỄN và KHÔNG ĐƯỢC THAY ĐỔI.
- Cập nhật NPC xã hội qua \`gameState.Social[i].Field\` (VD: \`favorability\`, \`identity\`, \`memories\`).
- Nhân vật rời cảnh phải set \`isPresent: false\`.
- Tương tác xã hội phải ghi vào \`memories\` và cập nhật \`favorability\`.

## 4) Tiêu chuẩn văn bản (logs)
- \`"sender": "Cảnh vật"\` - Miêu tả cảnh quan.
- \`"sender": "Bối cảnh"\` - Miêu tả hành động/tâm trạng (PHẢI bám sát \`corePersonalityTraits\` của NPC).
- \`"sender": "Tên nhân vật"\` - Lời thoại.

## 5) Định dạng Phán đoán
- \`Tên hành động｜Kết quả｜Kích hoạt [Người chơi/NPC]:Tên thực tế｜Giá trị phán đoán X/Độ khó Y｜... \`

## 6) Hệ thống Tính cách và Khí chất (Personality Metrics)
- **Chỉ số tính cách**: \`righteousness\` (Chính nghĩa), \`evil\` (Tà niệm), \`arrogance\` (Ngạo mạn), \`humility\` (Khiêm tốn), \`coldness\` (Lạnh lùng), \`passion\` (Nhiệt huyết) - Thang điểm 0-100.
- **Quy tắc cập nhật**:
  - Hành động giúp người, trừ hại -> Tăng \`righteousness\` (Ví dụ: +5).
  - Hành động tàn nhẫn, tư lợi, phản trắc -> Tăng \`evil\` (+10).
  - Coi thường người khác, khoe khoang -> Tăng \`arrogance\`.
  - Tôn trọng giới hạn, khiêm nhường, nhận lỗi -> Tăng \`humility\`.
- AI phải phản ánh tính cách hiện tại qua lời thoại và hành động của nhân vật chính trong \`logs\`.
- Khi tính cách thay đổi vượt ngưỡng (Ví dụ: Evil > 80), AI có thể đề xuất các danh hiệu (\`title\`) ma giáo hoặc thay đổi cách xưng hô của NPC.

</DataSyncProtocol>
    `.trim(),
    type: 'core setting',
    enabled: true
};
