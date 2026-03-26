import { PromptStructure } from '../../types';

export const StatCultivation: PromptStructure = {
    id: 'stat_cult',
    title: 'Giao thức Hệ thống Tu vi',
    content: `
<cultivation_system_protocol>
# 【Hệ thống Tu vi 9 Đại Cảnh giới (Ánh xạ vào gameState.Character.realmTier & realm)】

## 1. Các trường Dữ liệu Cốt lõi (BẮT BUỘC sử dụng các khóa Tiếng Anh này)
- \`realmTier\`: Cấp độ cảnh giới (1-9).
- \`realm\`: Tên cảnh giới (Tiếng Việt).
- \`cultivationProgress\`: Tiến độ tu vi hiện tại (0-100%).
- \`breakthroughSuccess\`: Tỷ lệ thành công đột phá.

## 2. Khung Cảnh giới (Tham chiếu)
I. Cảnh giới Nhân Giới (Hạ Giới)
Đây là giai đoạn khởi đầu, tập trung vào việc tẩy tủy, luyện khí và ngưng tụ nguyên anh.
1. Phàm Nhân (Mortality)
2. Luyện Khí (Sơ kỳ - Trung kỳ - Hậu kỳ)
3. Trúc Cơ (Sơ kỳ - Trung kỳ - Hậu kỳ)
4. Kết Đan (Sơ kỳ - Trung kỳ - Hậu kỳ) - Hình thành Kim Đan.
5. Nguyên Anh (Sơ kỳ - Trung kỳ - Hậu kỳ) - Đạt đến mức này có thể coi là "lão quái vật" tại nhân giới.
6. Hóa Thần (Sơ kỳ - Trung kỳ - Hậu kỳ) - Cảnh giới cao nhất có thể đạt được tại các tiểu tinh cầu trước khi phi thăng.
II. Cảnh giới Linh Giới (Trung Giới)
Tại đây, tu sĩ bắt đầu tiếp xúc với sức mạnh của thiên địa quy luật và đối mặt với các lần Thiên Kiếp định kỳ.
6.  Luyện Hư (Sơ kỳ - Trung kỳ - Hậu kỳ) - Bắt đầu điều động linh khí thiên địa.
7.  Hợp Thể (Sơ kỳ - Trung kỳ - Hậu kỳ) - Thân thể và Nguyên Anh hợp nhất.
8.  Đại Thừa (Sơ kỳ - Trung kỳ - Hậu kỳ) - Đứng đầu một phương, chuẩn bị cho quá trình độ kiếp phi thăng tiên giới.
9.  Độ Kiếp (Giai đoạn chuyển tiếp) - Những người đã vượt qua thiên kiếp nhưng chưa chính thức phi thăng.
III. Cảnh giới Tiên Giới (Thượng Giới)
Giai đoạn này tu sĩ tu luyện "Tiên Nguyên Lực" và nắm giữ các loại "Thái Cổ Luật Lệnh".
10. Chân Tiên (Sơ kỳ - Trung kỳ - Hậu kỳ)
11. Kim Tiên (Sơ kỳ - Trung kỳ - Hậu kỳ)
12. Thái Ất Ngọc Tiên (Sơ kỳ - Trung kỳ - Hậu kỳ)
13. Đại La Tiên (Sơ kỳ - Trung kỳ - Hậu kỳ) - Chia làm 3 mức độ ngộ đạo (Cấp thấp - Trung cấp - Đỉnh phong).
14. Đạo Tổ (Cảnh giới tối cao) - Mỗi một loại quy luật trong vũ trụ chỉ có duy nhất một Đạo Tổ nắm giữ.

## 3. Công thức Tăng trưởng Tu vi
- Tăng trưởng dựa trên: \`comprehension\`, dược quán, và võ công tâm pháp.
- Mỗi lượt tu luyện sử dụng lệnh \`ADD\` vào \`cultivationProgress\`.

## 4. Đột phá Cảnh giới (Breakthrough)
- Khi \`cultivationProgress >= 100\`, Player có thể thực hiện đột phá.
- Thất bại đột phá gây phản phệ: Trừ mạnh \`currentHp\` hoặc giảm \`realmTier\`.

## 5. Ranh giới Năng lực
- Chênh lệch 1 \`realmTier\` tạo ra sự áp đảo về sức mạnh và thân pháp.
- Người ở cảnh giới cao có thể "nhìn thấu" chiêu thức của người cảnh giới thấp.

## 6. Ví dụ Lệnh (Hợp lệ)
- \`{"action": "ADD", "key": "gameState.Character.cultivationProgress", "value": 5}\`
- \`{"action": "SET", "key": "gameState.Character.realmTier", "value": 2}\`
- \`{"action": "SET", "key": "gameState.Character.realm", "value": "Luyện Khí Kỳ"}\`

</cultivation_system_protocol>
`,
    type: 'num',
    enabled: true
};
