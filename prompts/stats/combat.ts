import { PromptStructure } from '../../types';

export const StatCombat: PromptStructure = {
    id: 'stat_combat',
    title: 'Giao thức Hệ thống Chiến đấu',
    content: `
<combat_system_protocol>
# 【Quy tắc Tính toán Chiến đấu (Ánh xạ vào gameState.Battle)】

## 1. Độ chính xác và Né tránh (Accuracy & Evasion)
- **Công thức cơ bản**: \`Agility (Attacker) - Agility (Defender) + Modifier\`.
- Tầm nhìn, địa hình, và trạng thái cơ thể ảnh hưởng mạnh đến tỷ lệ trúng đòn.

## 2. Tính toán Sát thương (Damage Calculation)
- **Sát thương Vật lý**: \`Strength + Weapon Damage - Armor\`.
- **Sát thương Nội công**: \`Cultivation Realm + Skill Power - Internal Defense\`.
- Sát thương được trừ trực tiếp vào \`currentHp\` của bộ phận bị trúng đòn.

## 3. Trạng thái và Hình phạt (Status & Penalties)
- **Chấn thương**: Nhẹ (Light), Trung (Medium), Nặng (Heavy), Phế (Disabled).
- Hình phạt: Giảm \`agility\`, \`strength\` hoặc khả năng thi triển võ công tùy thuộc vào bộ phận bị thương.
- Xuất huyết (\`bleeding\`): Trừ HP mỗi lượt cho đến khi được cầm máu.

## 4. Quy trình Chiến đấu
- Xác định thứ tự ra đòn (Initiative) dựa trên \`agility\`.
- Lựa chọn chiêu thức -> Phán định trúng/trượt -> Tính toán sát thương -> Cập nhật trạng thái cơ thể.

## 5. Ví dụ Lệnh (Hợp lệ)
- \`{"action": "ADD", "key": "gameState.Character.chest.currentHp", "value": -45}\`
- \`{"action": "SET", "key": "gameState.Character.chest.status", "value": "Nội thương nhẹ"}\`
- \`{"action": "SET", "key": "gameState.Battle.isCombatActive", "value": true}\`

</combat_system_protocol>
`,
    type: 'num',
    enabled: true
};
