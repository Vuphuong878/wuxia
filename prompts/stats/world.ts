import { PromptStructure } from '../../types';

export const StatWorldEvolution: PromptStructure = {
    id: 'stat_world',
    title: 'Giao thức Tiến hóa Thế giới và Vận hành',
    content: `
<world_evolution_protocol>
# 【Quy tắc Tiến hóa Thế giới (Ánh xạ vào gameState.World & Environment)】

## 1. Cấu trúc Thế giới 3-9-81 (CỐ ĐỊNH)
- **3 Đại Địa (Regions)**:
    - **Bắc Đảo**: Tuyết phủ, dãy núi cao, hang băng. (Coordinates: Around y < -500)
    - **Nam Lục**: Bình nguyên xích đạo, hoang mạc. (Coordinates: Around y > 500)
    - **Đông Hải**: Quần đảo ven biển, vực sâu. (Coordinates: Around x > 500)
- **9 Thành Phố (Cities)**: 3 thành mỗi vùng (Thanh Vân, Hàn Băng, Vô Kỵ; Xích Hỏa, Hoàng Sa, Lâm Hải; Vạn Đảo, Hải Long, Lưu Ly).
- **81 Địa Điểm (Locations)**: 9 địa điểm mỗi thành (Miếu, Tửu Lâu, Võ Đường, Hang Động, v.v.).

## 2. Cơ chế Thời gian
- **Cấu trúc**: \`gameState.World.time\` theo định dạng \`YYYY:MM:DD:HH:MM\`.
- Mỗi lượt hành động thường tiêu tốn 15-30 phút.

## 3. Quy tắc Vận hành và Tác động
- **Dịch chuyển**: Khi Player di chuyển, tọa độ \`gameState.World.coordinate\` phải được cập nhật tương ứng với các địa điểm trong hệ thống 3-9-81.
- **Tiến hóa NPC**: NPC tại 81 địa điểm này có lịch trình và sự kiện riêng.

## 4. Quản lý Sự kiện Thế giới
- \`worldEvents\`: Danh sách các sự kiện (Chiến tranh, Thiên tai, Tin đồn) diễn ra tại các tọa độ cụ thể.

## 5. Ví dụ Lệnh (Hợp lệ)
- \`{"action": "SET", "key": "gameState.Environment.majorLocation", "value": "Thanh Vân Thành"}\`
- \`{"action": "SET", "key": "gameState.World.coordinate", "value": "-1000,-1000"}\`
- \`{"action": "SET", "key": "gameState.Environment.time", "value": "2026:03:24:08:30"}\`

## 6. Quy tắc cốt lõi: Hệ thống Cơ Duyên Động cho NPC (BẮT BUỘC gắn gameState)
- Điều kiện kích hoạt đồng thời:
  1) Có khoảng nghỉ tự sự (nhảy thời gian, bế quan, di chuyển đường dài).
  2) NPC đang ở khu vực rủi ro (hoang dã, bí cảnh, phế tích, dãy núi yêu thú...).
  3) NPC thuộc nhóm tán tu/đệ tử cấp thấp/mạo hiểm giả, không phải nhân vật cốt lõi.
- Kiểm định ngẫu nhiên d100:
  - 01-40: Cơ Duyên Vi Mạt.
  - 41-75: Cơ Duyên Phổ Thông.
  - 76-95: Cơ Duyên Trọng Đại.
  - 96-100: Nghịch Thiên Cải Mệnh.
- Ghi nhận kết quả bằng lệnh hợp lệ:
  - Gắn nhãn: \`{"action":"PUSH","key":"gameState.World.activeNpcList[i].tags","value":"Thân Mang Dị Bảo"}\`
  - Cập nhật hành vi: \`{"action":"SET","key":"gameState.World.activeNpcList[i].currentActionDescription","value":"Ẩn nấp tu luyện để tránh truy sát"}\`
  - Lan truyền tin đồn/sự kiện: \`{"action":"PUSH","key":"gameState.World.ongoingEvents","value":{"id":"EVT_x","type":"Tin đồn","title":"Tin đồn cơ duyên trọng đại","content":"...","location":"...","startTime":"YYYY:MM:DD:HH:MM","estimatedEndTime":"YYYY:MM:DD:HH:MM","currentStatus":"Đang diễn ra","isMajorEvent":true,"relatedAffiliations":[],"relatedCharacters":[]}}\`
  - Móc câu cốt truyện: \`{"action":"PUSH","key":"gameState.Story.pendingEvents","value":{"name":"Truy tìm dị bảo","description":"Tin đồn về NPC đắc bảo","triggerConditionOrTime":"Khi tới phường thị liên quan","expirationTime":"YYYY:MM:DD:HH:MM"}}\`
- Với Cơ Duyên Trọng Đại trở lên, bắt buộc tạo hệ quả xã hội trong \`gameState.World.ongoingEvents\` hoặc \`gameState.Story.pendingEvents\`.

## 7. Các Thế lực và Tổ chức chính (Lore chuẩn thế giới)
- Thiên Cơ Các, Quảng Hàn Cung, Thái Dương Thần Cung, Thục Sơn Kiếm Môn, Côn Luân Đạo Môn, Đại Lôi Âm Tự.
- Tam Thanh Đạo Tông (Thái Thanh Tông, Ngọc Hư Tông, Thông Thiên Tông), Vạn Pháp Tông.
- Huyết Thần Cung, Vạn Hồn Điện, Hợp Hoan Tông, Thi Ma Tông.
- Khi phát sinh sự kiện liên quan thế lực, ưu tiên liên kết bằng \`relatedAffiliations\` trong \`gameState.World.ongoingEvents\`.

## 8. Hệ thống cấp độ Linh dược
- Phàm giai / Huyền giai / Địa giai / Thiên giai.
- Khi NPC hoặc người chơi thu được linh dược cấp Địa giai trở lên, cần tạo ảnh hưởng hệ quả (tranh đoạt, truy sát, chiêu mộ) vào \`gameState.World.ongoingEvents\`.

## 9. Phân loại vật liệu Luyện khí
- Ngũ Hành Tinh Kim, Tinh Thần Sa, Hư Không Thạch, Vật liệu Tiên Thiên.
- Vật liệu cấp cao phải có độ hiếm phù hợp và hệ quả tương ứng với bối cảnh hiện tại.

## 10. Tài nguyên chiến lược đặc biệt
- Long Mạch, Linh Nhãn Chi Tuyền, Mỏ Quặng.
- Tranh chấp tài nguyên quy mô thế lực phải được mô hình hóa thành sự kiện thế giới và có thể ảnh hưởng tuyến truyện chính.

</world_evolution_protocol>
`,
    type: 'num',
    enabled: true
};
