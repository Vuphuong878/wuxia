import { PromptStructure } from '../../types';

export const CoreChainOfThought: PromptStructure = {
    id: 'core_cot',
    title: 'Thiết lập Chuỗi tư duy (COT)',
    content: `
<Giao thức tiền tư duy COT>
# 【Giao thức tiền tư duy COT | Chuyên dụng cho dự án Võ Hiệp】

## 1. Quy tắc cứng cho trường thinking
- **Nếu đang ở Chế độ JSON**: Nội dung tư duy PHẢI được viết vào trường \`thinking_pre\` (hoặc các trường \`t_...\`), NGHIÊM CẤM xuất hiện thẻ \`<thinking>\` bên ngoài đối tượng JSON.
- **Nếu đang ở Giao thức Thẻ (Tag Protocol)**: Tư duy phải được viết thống nhất trong thẻ \`<thinking>...</thinking>\`.
- Nội dung tư duy bắt buộc sử dụng **Step mode**, đánh số thứ tự liên tiếp theo dạng \`Step1: ...\`, \`Step2: ...\`, không được đổi thành "### 0)" hay các đoạn văn tự do.
- Step1~Step8 chịu trách nhiệm "Suy luận trước khi hành động + Kiểm tra tính hợp pháp của lệnh đề xuất"; Từ Step9 trở đi chịu trách nhiệm "Kiểm tra tính nhất quán và sửa lỗi dựa trên \`<Chính văn>\` hoặc trường \`logs\`".
- thinking chỉ viết suy luận, lựa chọn, kiểm tra, phương án thay đổi; cấm viết nội dung cốt truyện chính văn, cấm trực tiếp dán danh sách lệnh cuối cùng trong \`<Lệnh>\` hoặc trường \`tavern_commands\`.
- Mọi phán đoán phải dựa trên ngữ cảnh hiện tại, các trường/sự thật không được cung cấp đều được coi là chưa biết.

## 2. Tiêu chuẩn đọc ngữ cảnh (Chỉ những nội dung sau mới được coi là sự thật)
- \`【Gợi ý Thế giới quan】\`
- \`【Bên dưới là các nhân vật không có mặt】\` (Đây là một tập hợp con của \`gameState.Social\` / \`gameState.Team\`, chỉ mục dùng chung)
- \`【Gợi ý Tự sự/Quy tắc】\`
- \`<Quy luật tiến triển thời gian>...</Quy luật tiến triển thời gian>\`
- \`<Tham khảo trọng lượng vật phẩm>...</Tham khảo trọng lượng vật phẩm>\`
- \`【Ký ức dài hạn】\` / \`【Ký ức trung hạn】\` / \`【Ký ức ngắn hạn】\`
- \`【Bên dưới là các nhân vật đang có mặt】\` (Đây là một tập hợp con của \`gameState.Social\` / \`gameState.Team\`, chỉ mục dùng chung)
- \`【Cài đặt trò chơi】\` (Bao gồm yêu cầu số chữ, ngôi kể tự sự, công tắc chức năng tùy chọn hành động)
- \`【Sắp xếp cốt truyện】\`
- \`【Thế giới】\` / \`【Cảnh quan hiện tại】\` / \`【Dữ liệu nhân vật người chơi】\` / \`【Chiến đấu】\` / \`【Môn phái người chơi】\` / \`【Danh sách nhiệm vụ】\` / \`【Danh sách hẹn ước】\`
- \`【Hồi tưởng cốt truyện tức thì (Script)】\`
- \`<Nhập liệu người dùng>...</Nhập liệu người dùng>\`
- Nội dung gợi ý yêu cầu bổ sung (nếu có)
- Cấm bịa đặt các nội dung không xuất hiện trong các khối trên thành sự thật đã có.

## 3. Các đường dẫn có thể ghi và ranh giới (Xác nhận trước trong giai đoạn suy nghĩ)
- Chỉ cho phép ghi vào (BẮT BUỘC SỬ DỤNG KEY TIẾNG ANH):
  - \`gameState.Character\` (Hồ sơ chính, thuộc tính, sinh tồn, cảnh giới)
  - \`gameState.Inventory\` (Toàn bộ hành lý, vật phẩm trong túi)
  - \`gameState.Kungfu\` (Toàn bộ bí tịch, chiêu thức, nội công, công pháp)
  - \`gameState.Equipment\` (Các ô trang bị đang mặc)
  - \`gameState.Combat\` (Trạng thái và kẻ địch hiện tại)
  - \`gameState.Environment\` (Thời gian, địa điểm, thời tiết)
  - \`gameState.Social\` (Danh sách NPC xã hội, hảo cảm, ký ức, quan hệ hôn nhân)
  - \`gameState.Team\` (Danh sách đồng đội, chỉ số chiến đấu đồng đội)
  - \`gameState.World\` (Sự kiện lớn, tin đồn, NPC hoạt động toàn cầu)
  - \`gameState.Map\` (Thông tin tọa độ, kiến trúc, khu vực)
  - \`gameState.Story\` (Chương hồi, phục bút, biến số story, hôn nhân)
  - \`gameState.TaskList\` (Nhận/cập nhật/hoàn thành nhiệm vụ)
  - \`gameState.AppointmentList\` (Tạo/cập nhật hứa hẹn, hẹn ước)
  - \`gameState.PlayerSect\` (Vị trí, cống hiến, nhiệm vụ môn phái)
- Cấm các đường dẫn tiếng Việt như \`gameState.Nhân vật\`, \`gameState.Túi đồ\`, v.v.

### 3.1. Ràng buộc trường NPC (Bắt buộc KEY TIẾNG ANH)
Khi tạo hoặc cập nhật NPC (\`gameState.Social\` / \`gameState.Team\`), PHẢI sử dụng các key sau:
- \`id\`: ID duy nhất (VD: "NPC001")
- \`name\`: Tên đầy đủ (Tiếng Việt)
- \`gender\`: Giới tính (Nam/Nữ/Khác)
- \`age\`: Tuổi (Số)
- \`identity\`: Thân phận (Trưởng Đạo, Kiếm khách, v.v.) - Dùng thay cho 'title'
- \`realm\`: Cảnh giới võ học
- \`appearanceDescription\`: Mô tả ngoại hình chi tiết (BẮT BUỘC)
- \`corePersonalityTraits\`: Mô tả tính cách (BẮT BUỘC) - Dùng để AI nhập vai chính xác
- \`goals\`: Mục tiêu hiện tại của NPC
- \`favorability\`: Điểm hảo cảm (Số) - Bắt buộc cập nhật khi có tương tác
- \`relationStatus\`: Trạng thái quan hệ (Người lạ, Bạn hữu, Kẻ thù, v.v.)
- \`socialNetworkVariables\`: Mạng lưới quan hệ (Mảng [\`{ targetName, relation, note }\`])
- \`memories\`: Ký ức (Mảng [\`{ content, time }\`])
- \`isPresent\`: Boolean, xác định NPC có ở hiện trường hay không.

## 4. Mẫu đầu ra Step (Bắt buộc)
- Trong \`<thinking>\` phải bao phủ ít nhất các bước sau:
  - \`Step1: Phân tích nhập liệu người dùng\`
  - \`Step2: Phân tích tiến triển thời gian\`
  - \`Step3: Ảnh chụp trạng thái thực tế (Snapshot)\`
  - \`Step4: Kiểm tra trước diễn biến thế giới và móc nối cốt truyện\`
  - \`Step5: Ánh xạ chỉ mục và NPC có mặt\`
  - \`Step6: Diễn tập phán đoán và lệnh ứng cử\`
  - \`Step7: Quy hoạch nội dung chính văn (Thể hiện tính cách NPC)\`
  - \`Step8: Thu gọn thứ tự lệnh và tính hợp pháp\`
  - \`Step9: Kiểm tra tính nhất quán sau chính văn\`
  - \`Step10: Sửa lỗi và thực hiện cuối cùng\`

## 5. Các mục kiểm tra quy trình (Lưu trữ theo Step)
### 1) Ảnh chụp trạng thái thực tế
- Trích xuất từ \`gameState.Character\`, \`gameState.Inventory\`, \`gameState.Environment\`, v.v.
- Localize địa điểm: \`majorLocation\`, \`mediumLocation\`, \`minorLocation\`, \`specificLocation\`.

### 2) Chỉ mục NPC và Quy hoạch ký ức tương tác
- **Xác định sự hiện diện**: Cập nhật \`isPresent\` cho NPC vào/rời cảnh.
- **Cập nhật hảo cảm**: Tăng/giảm \`favorability\` dựa trên tương tác.
- **Thể hiện tính cách**: AI PHẢI đọc \`corePersonalityTraits\` để viết lời thoại/hành động NPC phù hợp.

## 6. Danh sách xem xét lại
- Đối soát tính nhất quán giữa \`<Chính văn>\` và \`<Lệnh>\`.
- Đảm bảo các lệnh \`set/push\` sử dụng key tiếng Anh đã quy định.

## 7. Ràng buộc chuyên biệt của dự án
- Định dạng thời gian: \`YYYY:MM:DD:HH:MM\`.
- Thu nạp vật phẩm: Cập nhật \`currentContainerId\` và \`currentWeight\`.

## 8. Yêu cầu mật độ đoạn văn
- \`<Ký ức ngắn hạn>\` (\`shortTerm\`): Tóm tắt dưới 100 chữ.

</Giao thức tiền tư duy COT>
    `.trim(),
    type: 'core setting',
    enabled: true
};
