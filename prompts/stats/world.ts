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
- Đơn vị quy ước hiển thị:
  - **Canh giờ**: 1 ngày = 12 canh giờ.
  - **Ngày/Tháng/Năm**: đồng bộ với lịch phàm tục.
  - **Giáp tý**: 60 năm.
  - **Nguyên hội**: 129,600 năm.
- Mốc thời gian mặc định của thế giới: **Nguyên Hội lịch năm 3726, tháng Chạp, ngày 23, giờ Thân ba khắc**.
- Khi có nhảy thời gian lớn (vài tháng/năm), ngoài \`gameState.Environment.time\` cần cập nhật mô tả thời đại trong logs để bảo toàn nhân quả.

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

## 11. Thiết lập Bế quan (BẮT BUỘC gắn gameState)
- Định nghĩa: Bế quan là trạng thái cách ly dài hạn để đột phá, tu công pháp, dưỡng thương hoặc tránh họa.
- Mục đích hợp lệ:
  - Đột phá cảnh giới.
  - Tu luyện công pháp/thần thông.
  - Điều dưỡng thương thế.
  - Tránh né truy sát/đại kiếp.
- Điều kiện bắt buộc trước khi vào bế quan:
  1) Có địa điểm an toàn (động phủ/mật thất/linh địa) trong \`gameState.Environment\`.
  2) Có tài nguyên tiêu hao đủ trong \`gameState.Inventory\` hoặc diễn giải rõ thiếu hụt.
  3) Có thời lượng dự kiến và rủi ro dự kiến trong \`gameState.Story.pendingEvents\`.

## 12. Thời lượng & Xác suất Bế quan theo cảnh giới (tham chiếu cân bằng)
- **Luyện Khí**: vài tháng đến vài năm; đốn ngộ ~10%; bình cảnh ~20%; rủi ro chính: kinh mạch tổn thương nhẹ.
- **Trúc Cơ**: vài năm đến vài chục năm; đốn ngộ ~5%; bình cảnh ~40%; rủi ro chính: đạo cơ bất ổn/tẩu hỏa.
- **Kim Đan**: vài chục đến vài trăm năm; đốn ngộ ~2%; bình cảnh ~60%; rủi ro chính: tâm ma, đan vỡ.
- **Nguyên Anh**: vài trăm đến vài ngàn năm; đốn ngộ ~1%; bình cảnh ~80%; rủi ro chính: thiên kiếp.
- Yếu tố làm thay đổi thời lượng thực tế:
  - Đốn ngộ (rút ngắn), bình cảnh (kéo dài), cạn tài nguyên (buộc xuất quan), cưỡng chế gián đoạn (biến cố/tẩu hỏa nhập ma).

## 13. Quy tắc cập nhật gameState khi Bế quan
- Khi bắt đầu bế quan:
  - \`{"action":"SET","key":"gameState.Character.meridianStatus","value":"Bế quan ổn định"}\`
  - \`{"action":"SET","key":"gameState.Environment.specificLocation","value":"Mật thất động phủ"}\`
  - \`{"action":"PUSH","key":"gameState.Story.pendingEvents","value":{"name":"Kết thúc bế quan","description":"Xuất quan sau thời lượng dự kiến","triggerConditionOrTime":"YYYY:MM:DD:HH:MM","expirationTime":"YYYY:MM:DD:HH:MM"}}\`
- Khi diễn tiến bế quan:
  - Cập nhật \`gameState.Environment.time\` theo bước nhảy thời gian phù hợp (tháng/năm/giáp tý).
  - Nếu phát sinh rủi ro, thêm sự kiện vào \`gameState.World.ongoingEvents\` (Tâm ma kiếp, can nhiễu, truy sát...).
- Khi xuất quan:
  - \`{"action":"SET","key":"gameState.Character.meridianStatus","value":"Ổn định"}\`
  - Đồng bộ kết quả đột phá/thất bại vào chỉ số nhân vật và cốt truyện.

</world_evolution_protocol>
`,
    type: 'num',
    enabled: true
};
