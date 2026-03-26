import { PromptStructure } from '../../types';

export const StatNpcReference: PromptStructure = {
    id: 'stat_npc',
    title: 'Giao thức Thuộc tính NPC',
    content: `
<npc_attribute_protocol>
# 【Quy tắc Dữ liệu NPC (Ánh xạ vào gameState.NPCs)】

## 1. Định danh Trường Bắt buộc (BẮT BUỘC sử dụng các khóa Tiếng Anh này)
- **Cơ bản**: \`id / name / gender / age / title / realm / appearance\`
- **Trạng thái**: \`currentHp / maxHp / status\`
- **Vị trí**: \`currentLocation (ID Map) / isPresent (Boolean)\`
- **Quan hệ**: \`favorability (-100 đến 100) / relationStatus (Kẻ thù/Người lạ/Bạn bè/Tri kỷ...)\`
- **Chiến đấu**: \`combatPower (Chỉ số sức mạnh tổng hợp)\`
- **Ghi nhớ**: \`shortTermMemory (Tóm tắt các tương tác gần đây)\`
- **Ngoại hình**: \`appearance (Mô tả chi tiết: kiểu tóc, y phục, đặc điểm khuôn mặt, khí chất, vật phẩm mang theo - Dùng để vẽ chân dung)\`

## 2. Phần mở rộng Teammate (Nếu là đồng đội)
- Nếu NPC trong \`gameState.Party\`, sử dụng các trường tương tự như Player:
- \`skillList (Mảng các ID kỹ năng) / equipment (Đối tượng trang bị)\`

## 3. Logic Hiện diện và Tương tác
- Nếu \`isPresent\` là false, NPC không thể tham gia đối thoại trực tiếp hoặc chiến đấu tại vị trí hiện tại của Player.
- Thay đổi \`favorability\` phải dựa trên: quà tặng, lựa chọn đối thoại, hành động giúp đỡ/hại, hoặc sự kiện thế giới.
- \`relationStatus\` tự động cập nhật khi \`favorability\` vượt qua các ngưỡng cột mốc.

## 4. Tính toán Sức mạnh Chiến đấu (Combat Power)
- Dựa trên \`realm\`, \`equipment\`, và \`skillList\`.
- Được sử dụng làm căn cứ cho logic "Trốn chạy/Chiến đấu/Đàm phán" của AI.

## 5. Quy tắc Nhất quán Xã hội
- NPC ghi nhớ các hành động của Player trong \`shortTermMemory\`. 
- Nếu Player giết người thân của NPC, \`favorability\` phải giảm mạnh và \`relationStatus\` chuyển thành "Tử thù".
- Hành vi của NPC phải nhất quán với \`personality\` và \`identity\` đã định nghĩa.

## 6. Ví dụ Lệnh (Hợp lệ)
- \`{"action": "SET", "key": "gameState.NPCs.NPC001.favorability", "value": 15}\`
- \`{"action": "SET", "key": "gameState.NPCs.NPC001.relationStatus", "value": "Bằng hữu"}\`
- \`{"action": "SET", "key": "gameState.NPCs.NPC001.isPresent", "value": true}\`
- \`{"action": "ADD", "key": "gameState.NPCs.NPC001.currentHp", "value": -40}\`

## 7. HỆ THỐNG NỘI TÂM ẨN & TÌNH CẢM PHỨC TẠP (CỰC KỲ QUAN TRỌNG)
- Khi cập nhật tình cảm của một NPC, TUYỆT ĐỐI KHÔNG được phản ứng máy móc. BẮT BUỘC phải thực hiện một bước "suy nghĩ nội tâm" dựa trên 5 lăng kính:
  1. **"Tính cách cốt lõi"**: Hành động của người chơi được diễn giải qua bản chất của NPC (ví dụ: đa nghi, thực dụng, nhân hậu, thù dai). NPC đa nghi không dễ tin chỉ sau một hành động tốt.
  2. **"Mục tiêu & động cơ cá nhân"**: Hành động này giúp ích hay cản trở mục tiêu/động cơ riêng của NPC? Hãy suy luận mục tiêu hợp lý cho NPC quan trọng nếu chưa có.
  3. **"Lịch sử tương tác"**: Hành động này có nhất quán với các hành động trước đây của người chơi không (dựa vào ký ức gần đây)? Một hành động tốt sau nhiều lần lừa dối sẽ bị coi là giả tạo.
  4. **"Bối cảnh & hoàn cảnh"**: Hành động này có phù hợp với tình huống hiện tại không (chiến đấu, nguy cấp...)?
  5. **"Mối quan hệ xã hội"**: Hành động của người chơi với đồng minh/kẻ thù của NPC ảnh hưởng thế nào? Giúp đỡ kẻ thù của NPC sẽ khiến họ coi bạn là mối đe dọa.
- **QUAN TRỌNG**: Quá trình phân tích 5 lăng kính này là **SUY NGHĨ NỘI TÂM**, **TUYỆT ĐỐI KHÔNG được viết ra truyện**. Chỉ thể hiện kết quả qua hành động, lời thoại, cảm xúc của NPC.

## 8. HỆ THỐNG NPC CHỦ ĐỘNG & GIAI ĐOẠN HÀNH ĐỘNG (NÂNG CẤP CỐT LÕI)
- Sau mỗi hành động của người chơi, lượt đi của AI chia thành HAI giai đoạn:
  1. **Phản ứng & kết quả**: Mô tả kết quả trực tiếp, ngay lập tức của hành động người chơi (bị động).
  2. **Hành động chủ động của NPC/thế giới**: Sau khi mô tả kết quả, BẮT BUỘC tự hỏi: "Có NPC/thế lực nào sẽ hành động ngay không?" Sử dụng các cú hích (tình cảm, mục tiêu, bối cảnh, tính cách NPC) để quyết định. Nếu có, mô tả chi tiết. Nếu sự kiện lớn xảy ra không do NPC.
- **QUY TẮC CẤM**: TUYỆT ĐỐI KHÔNG để người chơi quyết định thay NPC. NPC phải tự hành động hoặc bộc lộ thái độ trong giai đoạn 2 dựa trên tính cách/mục tiêu.
- **Lưu ý**: Chỉ sau khi hoàn thành cả hai giai đoạn, mới tạo lựa chọn mới cho người chơi.

</npc_attribute_protocol>
`,
    type: 'num',
    enabled: true
};
