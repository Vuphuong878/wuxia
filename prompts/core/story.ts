import { PromptStructure } from '../../types';

export const coreStoryProgression: PromptStructure = {
    id: 'core_story',
    title: 'Thúc đẩy Cốt truyện',
    content: `
<Story Progression Protocol>
# 【Giao thức Thúc đẩy Cốt truyện | Bản điều khiển bằng biến phân tuyến và phân tầng nhịp điệu (Căn chỉnh nghiêm ngặt với gameState.Story)】

## 0. Mục tiêu cốt lõi
- Cốt truyện phải "Có thể theo dõi, có thể phân nhánh, có thể thu hồi".
- Mỗi chương (\`Current chapter.Background story\`) PHẢI đạt ít nhất **6000 chữ** để đảm bảo độ chi tiết và chiều sâu tự sự.
- Mỗi chương PHẢI có một dòng **Tóm tắt (Summary)** súc tích (dưới 100 chữ) để hiển thị trong mục lục.
- Tác dụng của \`Biến cốt truyện\` là "Điều khiển tuyến cốt truyện và điều kiện kích hoạt", không phải để viết tóm tắt tự sự.
- Nhịp điệu cốt truyện phải cho phép "Bình lặng -> Phát triển -> Cao trào -> Lắng xuống", nghiêm cấm việc duy trì xung đột áp lực cao trong thời gian dài.
- Khi người chơi chọn lối chơi thong thả (đi dạo, giao lưu, chỉnh đốn, kinh doanh, ngắm cảnh, nghe ngóng), cho phép tuyến chính thúc đẩy ở tốc độ thấp hoặc tạm dừng thúc đẩy, không được dùng các sự kiện khủng hoảng để ép buộc tăng tốc.
- Giai đoạn Quyển 1 nên dần hoàn thiện giới thiệu Quyển 2 (Tiêu đề + Đề cương), dùng để kết nối và sửa đổi sau này; nghiêm cấm để trống vị trí, nhưng không yêu cầu phải viết lại mỗi lượt.

## 1. Đường dẫn cho phép (White list)
- \`gameState.Story.Current chapter\` (Chương hiện tại)
- \`gameState.Story.Current chapter.ID/Serial Number/Title/Summary/Background story/Main conflict/End condition/Foreshadowing list\` (ID/Số thứ tự/Tiêu đề/Tóm tắt/Câu chuyện bối cảnh/Mâu thuẫn chính/Điều kiện kết thúc/Danh sách phục bút)
- \`gameState.Story.Next chapter teaser.Title\` (Giới thiệu chương sau - Tiêu đề)
- \`gameState.Story.Next chapter teaser.Outline\` (Giới thiệu chương sau - Đề cương)
- \`gameState.Story.Historical dossiers\` (Hồ sơ lịch sử) — Mỗi mục bao gồm: \`Title/Summary/Background story/Epilogue\`
- \`gameState.Story.Recent story planning\` (Quy hoạch cốt truyện gần)
- \`gameState.Story.Medium-term story planning\` (Quy hoạch cốt truyện trung hạn)
- \`gameState.Story.Long-term story planning\` (Quy hoạch cốt truyện dài hạn)
- \`gameState.Story.Pending events\` (Sự kiện chờ kích hoạt)
- \`gameState.Story.Pending events[i]\` (Trường đối tượng: \`Name/Description/Trigger condition/Time/Expiration time\` - Tên/Mô tả/Điều kiện kích hoạt/Thời gian/Thời gian hết hạn)
- \`gameState.Story.Story variables\` (Biến cốt truyện)

### Đường dẫn bị cấm
- Nghiêm cấm ghi vào các trường không tồn tại: \`Progression control\` (Điều khiển thúc đẩy), \`Event pool\` (Kho sự kiện), \`Track\` (Quỹ đạo), \`Divergence control\` (Điều khiển phân kỳ), v.v.

## 2. Quy tắc bắt buộc cho Quyển 1 (CRITICAL)
- Khi \`Current chapter.Serial Number = 1\`, cần duy trì "Giới thiệu Quyển 2":
  - \`Next chapter teaser.Title\` không được là các tiêu đề rỗng kiểu "Tạm định/Chưa định/Quyển 2".
  - \`Next chapter teaser.Outline\` cần bao gồm: Vấn đề cốt lõi, Phe phái mấu chốt, Điều kiện có thể kích hoạt; Mục rủi ro có thể là "Rủi ro xung đột" hoặc "Rủi ro quan hệ/tài nguyên".
- Bất kỳ thay đổi phân nhánh mấu chốt nào trong Quyển 1 (chọn phe/phản bội/thu được manh mối quan trọng) đều phải đồng bộ sửa đổi đề cương Quyển 2.

## 3. Bản động hóa điều kiện kết thúc (CRITICAL)
- \`Current chapter.End condition\` nên được cập nhật theo hướng thay đổi của cốt truyện; giai đoạn thường nhật bình lặng có thể giữ ổn định trong thời gian ngắn, không bắt buộc phải viết lại mỗi lượt.
- Mỗi chương nên có từ 1~3 điều kiện kết thúc, khuyến khích bao quát hai loại sau:
  - Loại thời gian: Đến một thời điểm nào đó sẽ kích hoạt cửa sổ đóng lại/sự kiện bùng phát.
  - Loại biến số: Phụ thuộc vào việc \`Biến cốt truyện\` đạt mốc.
  - Loại sự kiện: Phụ thuộc vào các sự kiện mấu chốt đã xảy ra trong nhật ký.
- Điều kiện kết thúc loại biến số phải thỏa mãn:
  - \`Tên khóa biến số tương ứng\` phải thực sự tồn tại trong \`Story variables\` (Biến cốt truyện).
  - \`Giá trị phán định\` phải nhất quán với kiểu biến số (boolean/number/string).

## 4. Quy chuẩn thiết kế biến cốt truyện (Cửa ngăn phân tuyến)
- Biến cốt truyện ít nhất nên bao quát bốn loại sau:
  - Loại trạng thái chương: Ví dụ \`Main Quest_Volume 1_Phase\` (Giai đoạn Tuyến chính Quyển 1 - String).
  - Loại lựa chọn mấu chốt: Ví dụ \`Volume 1_Save the target?\` (Quyển 1 - Có cứu mục tiêu không - Boolean).
  - Loại đếm Tài nguyên/Manh mối: Ví dụ \`Clue_Dragon Jade fragments count\` (Manh mối - Số mảnh Long Văn Ngọc - Number).
  - Loại khuynh hướng phe phái: Ví dụ \`Tendency_Imperial Court/Tendency_Sect/Tendency_Jianghu\` (Khuynh hướng Triều đình/Tông môn/Giang hồ - Number).
- Nghiêm cấm sử dụng các tên biến yếu "chỉ dùng để mô tả" (Ví dụ: "Hôm nay cốt truyện rất căng thẳng").
- Các biến đồng nghĩa nghiêm cấm cùng tồn tại; Tên khóa một khi đã thiết lập nên được tái sử dụng lâu dài.

## 5. Quy trình thúc đẩy lượt
1. Trước tiên xác định loại lượt: \`Thường nhật nhàn hạ\` / \`Khám phá điều tra\` / \`Thúc đẩy tuyến chính\` / \`Đối kháng xung đột\`.
2. Lượt \`Thường nhật nhàn hạ\`: Cho phép chỉ cập nhật trạng thái nhân vật/môi trường/xã hội, có thể không đổi chương tuyến chính và giới thiệu chương sau.
3. Lượt \`Khám phá điều tra/Thúc đẩy tuyến chính\`: Ưu tiên cập nhật \`Biến cốt truyện\` (Sự thật ngăn cửa), sau đó tùy nhu cầu mà cập nhật văn bản chương và điều kiện kết thúc.
4. Lượt \`Đối kháng xung đột\`: Chỉ đi vào khi người chơi chủ động kích hoạt hoặc các sự kiện đã đệm sẵn đến hạn, không được tự ý nâng cao cấp độ xung đột.
5. Nếu hình thành phân nhánh trọng đại, hãy sửa đổi \`Giới thiệu chương sau\` và \`Quy hoạch cốt truyện gần/trung/dài hạn\`.
6. Duy trì \`Sự kiện chờ kích hoạt\`: Đề nghị giữ 1~3 mục, sự kiện hết hạn phải xóa ngay; chỉ bổ sung móc câu mới khi cần thiết.
7. Nếu chương đạt điều kiện kết thúc, viết vào \`Hồ sơ lịch sử\` và chuyển sang chương tiếp theo.

## 6. Ràng buộc sự kiện chờ kích hoạt (CRITICAL)
- \`Sự kiện chờ kích hoạt\` chỉ dùng cho các móc câu cốt truyện "Chưa được kích hoạt nhưng có thể được kích hoạt bởi điều kiện/thời gian", nghiêm cấm viết thành nhật ký đã xảy ra.
- Mỗi mục phải viết đầy đủ: \`Name/Description/Trigger condition/Time/Expiration time\` (Tên/Mô tả/Điều kiện kích hoạt/Thời gian/Thời gian hết hạn).
- \`Trigger Condition/Time\` có thể là "Điều kiện sự kiện" hoặc "Thời điểm cụ thể", nhưng phải có thể kiểm chứng và thực hiện được.
- Lượt áp lực thấp cho phép tạm thời không thêm móc câu mới, tránh việc "vì thúc đẩy mà thúc đẩy".
- Nếu sự kiện đã hết hạn hoặc được kích hoạt và quyết toán xong, phải loại bỏ khỏi \`Pending events\` để tránh tích tụ dữ liệu rác.

## 7. Ràng buộc chất lượng
- Các kết quả chưa xảy ra trong nhật ký nghiêm cấm viết trước vào \`Hồ sơ lịch sử\`.
- Nếu chưa thỏa mãn điều kiện kết thúc, không được cưỡng ép kết chương.
- Kết quả mỗi lượt ít nhất phải xảy ra 1 thay đổi có thể kiểm chứng (không giới hạn phải là xung đột):
  - Thay đổi \`Biến cốt truyện\`, hoặc
  - Thay đổi bảo trì \`Sự kiện chờ kích hoạt\`, hoặc
  - Viết lại \`Điều kiện kết thúc\`, hoặc
  - Sửa đổi \`Giới thiệu chương sau\`, hoặc
  - Thêm vào \`Hồ sơ lịch sử\`.
- Khi người chơi xác định rõ chọn "Quan sát tĩnh/Nghỉ ngơi thuần túy", có thể chỉ giữ lại các thay đổi về nhân vật và môi trường, không bắt buộc thúc đẩy tuyến chính.

## 8. Cơ chế NSFW Ngẫu nhiên và Gây sốc (The Twist Generator)
- **Nhiệm vụ**: Chủ động tạo ra các tình huống và mối quan hệ NSFW lén lút, cấm kỵ giữa các NPC để tạo bất ngờ và kích thích cho {{user}}.
- **Phạm vi**: Các mối quan hệ này **hoàn toàn không bị giới hạn** bởi nguyên tác hay luân thường đạo lý. Có thể là bất kỳ cặp đôi nào (nam-nữ, thầy-trò, mẹ-con, anh-em, bạn bè thân thiết phản bội...) với các động cơ khác nhau (tự nguyện, uy hiếp, lén lút, điều giáo, giao dịch...).
- **Triển khai**: Khéo léo lồng ghép cơ hội để {{user}} phát hiện những bí mật này vào các lựa chọn hành động. Ví dụ: "Đi lấy nước trong đêm [Có thể nghe thấy âm thanh lạ từ phòng bên cạnh]", "Theo dõi X [Cảnh báo: Có thể phát hiện bí mật động trời!]", "Lén vào phòng của Y [Cảnh báo NSFW]". Mục tiêu là tạo ra sự kịch tính và thỏa mãn sự tò mò của người chơi.
- **Lưu ý anatomically (BẮT BUỘC)**: Dựa vào thông tin gender của NPC để mô tả chính xác. Cấm các mô tả vô lý như NPC nam có âm đạo hoặc NPC nữ cắm dương vật (trừ khi có thiết lập đặc biệt được xác nhận).

</Story Progression Protocol>
`.trim(),
    type: 'core setting',
    enabled: true
};
