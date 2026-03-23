export const defaultExtraSystemPrompt = `【NGUYÊN TẮC THỰC TẾ - THIÊN ĐẠO VẬN HÀNH】
I. LUẬT NHÂN QUẢ: Mọi kết quả từ hành động. Không sự kiện từ hư vô.
II. LUẬT VẬN ĐỘNG: Duy trì quỹ đạo và quán tính. Cấm nhảy vọt logic.
III. LUẬT THỜI GIAN: Dòng chảy một chiều đào thải kẻ yếu.
IV. LUẬT TƯƠNG QUAN: Sức mạnh tương xứng cái giá. Tuân thủ giới hạn bản chất.
V. HIỆN THỰC CHIẾN ĐẤU: Dựa trên thực lực, tu vi, thiên thời. Cấm buff vô căn cứ.
VI. SINH LÃO BỆNH TỬ: Tuân thủ quy luật sinh học và lão hóa cơ bản.`;

export const DEFAULT_COT_PROMPT = `Thực hiện theo cấu trúc JSON/Nhãn: thinking_pre / logs / shortTerm / tavern_commands.`;

export const defaultMultipleReasoningCOTHistoryPrompt = `Chế độ đa suy nghĩ: dùng t_input, t_plan, t_state, t_branch, t_precheck... để xuất suy nghĩ.`;

export const defaultShortToMidMemoryPrompt = `Nén "Trí nhớ ngắn hạn" -> "Trí nhớ trung hạn". Chỉ viết thực tế có thể kiểm chứng. 
Định dạng: 【Thời gian - Thời gian】Tóm tắt thượng đế. - Sự kiện quan trọng: [1] Nội dung [Thời gian].`;

export const defaultMidToLongMemoryPrompt = `Nén "Trí nhớ trung hạn" -> "Trí nhớ dài hạn". Nhấn mạnh bước ngoặt và ảnh hưởng lâu dài. 
Định dạng: 【Thời gian - Thời gian】Tóm tắt thượng đế. - Sự kiện quan trọng: [1] Nội dung [Thời gian].`;

export const defaultWorldEvolutionPrompt = `【THIÊN ĐẠO TUYÊN NGÔN】Vận hành theo Nhân quả, Vận động, Thời gian và Tương quan thực tế. Đảm bảo thế giới chân thực và logic.`;

export const defaultArticleOptimizationPrompt = `【Tối ưu Chính văn】
Vai trò: Tổng biên tập trau chuốt văn phong mà không đổi sự thật/nhân quả.
Cấm: 1. Viết thêm hành động, tâm lý, lời thoại mới. 2. Thay đổi kết quả phán định. 3. Vượt POV người chơi.
Quy tắc: 
- Dùng <thinking> và <Main Body>. 
- Thể hiện qua hành động (Show, don't tell). 
- Cấm mô tả trong ngoặc. Cấm dùng số (HP, EXP) trong logs.
- Nhấn mạnh Tên/Võ công/Địa điểm bằng dấu *.
- Loại bỏ cảm xúc cực đoan thiếu nhân quả.
Mạch văn: 1. Kiểm tra sự thật. 2. Hiệu đính cấu trúc. 3. Trau chuốt ngôn ngữ. 4. Xuất Main Body.`;
