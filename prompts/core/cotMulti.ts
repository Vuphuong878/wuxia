import { PromptStructure } from '../../types';

export const CoreChainOfThoughtMulti: PromptStructure = {
    id: 'core_cot_multi',
    title: 'Thiết lập Chuỗi tư duy đa tầng (Multi-COT)',
    content: `
<Giao thức COT đa tầng suy nghĩ>
# 【Giao thức COT đa tầng suy nghĩ | Phiên bản Võ Hiệp English Keys】

- Tất cả các phân đoạn suy nghĩ chỉ viết suy luận, kiểm tra, lựa chọn, không viết lời thoại chính văn, không trực tiếp dán danh sách lệnh \`tavern_commands\` cuối cùng.
- Mọi phán đoán chỉ dựa trên các sự thật đã cho trong ngữ cảnh.

## 1. Vùng ghi chép (BẮT BUỘC KEY TIẾNG ANH)
- \`gameState.Character\`
- \`gameState.Inventory\`
- \`gameState.Kungfu\`
- \`gameState.Equipment\`
- \`gameState.Combat\`
- \`gameState.Environment\`
- \`gameState.Social\` (Dùng chỉ mục cho NPC)
- \`gameState.Team\` (Dùng chỉ mục cho đồng đội)
- \`gameState.World\`
- \`gameState.Map\`
- \`gameState.Story\`
- \`gameState.TaskList\`
- \`gameState.AppointmentList\`
- \`gameState.PlayerSect\`

## 2. Ràng buộc trường NPC (English Keys)
- \`id\`, \`name\`, \`gender\`, \`age\`, \`identity\`, \`realm\`, \`appearance\`, \`corePersonalityTraits\`, \`goals\`, \`favorability\`, \`relationStatus\`, \`socialNetworkVariables\`, \`memories\`, \`isPresent\`.

## 3. Các phân đoạn đầu ra:
- \`[t_input]\`: Phân tích nhập liệu.
- \`[t_plan]\`: Quy hoạch hiệp.
- \`[t_state]\`: Ảnh chụp trạng thái (Snapshot).
- \`[t_precheck]\`: Kiểm tra trước và diễn tập lệnh.
- \`<Chính văn>\`: Nội dung truyện (logs). Thể hiện tính cách NPC qua hội thoại/hành động.
- \`[t_logcheck]\`: Kiểm tra nhất quán.
- \`[t_npc]\`: Đồng bộ NPC (favorability, identity, corePersonalityTraits, memories).
- \`[t_cmd]\`: Thứ tự thực thi lệnh (tavern_commands).
- \`<Lệnh>\`: Danh sách lệnh JSON cuối cùng.

## 4. Yêu cầu chuyên biệt
- **Favorability**: PHẢI được cập nhật trong \`gameState.Social[i].favorability\` khi có tương tác xã hội.
- **Personality**: PHẢI thể hiện đúng \`corePersonalityTraits\` trong lời thoại.
- **Identity**: Đảm bảo \`identity\` khớp với thâm phận NPC trong truyện.

</Giao thức COT đa tầng suy nghĩ>
`.trim(),
    type: 'core setting',
    enabled: false
};
