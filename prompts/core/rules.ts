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
- **BẮT BUỘC TẠO THỰC THỂ**: Nếu nhân vật mới xuất hiện có tên riêng hoặc danh xưng cụ thể mà không thể hợp nhất, bạn **BẮT BUỘC** gửi lệnh \`PUSH\` vào \`gameState.Social\` để tạo thực thể NPC mới ngay trong lượt đó. Nghiêm cấm chỉ để tên trong \`logs\` mà không có dữ liệu trong hệ thống.
- **Mẫu Cấu trúc PUSH NPC mới (MANDATORY)**:
  \`\`\`json
  {
    "action": "PUSH",
    "key": "gameState.Social",
    "value": {
      "id": "snake_case_id",
      "name": "Tiếng Việt có dấu",
      "gender": "Nam/Nữ",
      "age": 18,
      "identity": "Thân phận cụ thể",
      "realm": "Cảnh giới hiện tại",
      "appearance": "Mô tả ngoại hình (Trang phục, khí chất, đặc điểm nhận dạng)",
      "corePersonalityTraits": "Tính cách cốt lõi (Để AI roleplay nhất quán)",
      "favorability": 0,
      "relationStatus": "Người lạ",
      "isPresent": true,
      "currentHp": 100,
      "maxHp": 100,
      "status": "Khỏe mạnh",
      "memories": []
    }
  }
  \`\`\`
- **Quy tắc Tên và ID**:
  1. \`name\`: Tiếng Việt có dấu (VD: "Chung Hội", "Lão Ăn Mày").
  2. \`id\`: \`snake_case\`, không dấu, viết thường, vĩnh viễn (VD: \`chung_hoi\`, \`lao_an_may\`).
  3. Nếu trùng ID, thêm hậu tố số (\`_2\`, \`_3\`,...).
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
