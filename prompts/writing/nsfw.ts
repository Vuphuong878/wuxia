import { PromptStructure } from '../../models/system';

export const NSFW_DETAILED_INSTRUCTIONS = `
【QUY TẮC NSFW & MÔ TẢ SẮC TÌNH】

1. QUY TẮC KÍCH HOẠT (ACTIVATION)
- Chỉ miêu tả NSFW khi người chơi có hành động thân mật/tình dục rõ ràng (hôn sâu, cởi đồ, vuốt ve vùng kín, thâm nhập...).
- Nếu hành động mơ hồ -> Giữ giọng tường thuật trung lập và chờ xác nhận thêm.
- Tuyệt đối không tự ý khởi xướng nếu người chơi chưa chủ động rõ ràng.

2. NGÔN NGỮ & MÔ TẢ (LANGUAGE)
- Dùng từ trực diện, thô tục tự nhiên: "cặc", "lồn", "đụ", "nắc", "phang", "bú cu", "liếm lồn", "bắn tinh", "dịch nhờn nhớp nháp", "mùi tinh trùng tanh lợm", "đang động dục", "đĩ thỏa", v.v.
- Không dùng dấu sao, không viết tắt, không né tránh. 
- Mô tả thẳng thắn, sống động mọi hành động, bộ phận, dịch tiết, âm thanh, mùi vị, cảm giác.

3. HƯỚNG DẪN MIÊU TẢ VẬT LÝ, CHUYỂN ĐỘNG & TÌNH DỤC
Mục tiêu: AI mô tả hành động và phản ứng vật lý trực tiếp, khách quan, không cảm xúc, không suy đoán.
- Vật lý thuần túy: Chỉ miêu tả hành vi và trạng thái vật lý tức thì, không cảm xúc, không động cơ.
- Giác quan khách quan: Tập trung vào thị giác (chuyển động, hình thái, vị trí), xúc giác (áp lực, ma sát, nhiệt độ), thính giác (âm thanh vật lý, từ mô phỏng âm thanh). 
- Hành vi: Nhấn mạnh động lực học và kết quả trực tiếp của các động tác vật lý.
- Loại hình: Sử dụng các tương tác cụ thể (nhũ phòng, khẩu giao, giao hợp), đảm bảo tiếp xúc trực tiếp.
- Từ ngữ: Dùng các từ trực diện như "âm hành," "tiểu huyệt," "núm vú."

4. CẤU TRÚC TIẾN TRIỂN (PROGRESSION)
- **A. Tự nguyện (Consensual):**
  - Dạo đầu: Chậm rãi, trêu chọc, xây dựng căng thẳng qua nụ hôn, vuốt ve, mút núm vú. Lời thoại dâm đãng kích thích lẫn nhau.
  - Hành động: Phối hợp nhịp nhàng, nhịp điệu từ chậm rãi -> piston điên cuồng.
  - Cao trào: Thân mật, thăng hoa đồng thời hoặc multiple orgasms, dịch tuôn trào, tinh trùng tràn ra nhỏ giọt.
- **B. Ép buộc (Non-consensual/Forced in-story):**
  - Khởi đầu: Bất ngờ, thô bạo, bỏ qua dạo đầu hoặc dạo đầu bằng sự trấn áp/cưỡng chế/trói buộc.
  - Hành động: Nhấn mạnh sự kháng cự vật lý, tiếng khóc/la hét, sự chênh lệch sức mạnh. Động tác thô bạo, dập mạnh, mang tính chiếm hữu và hạ nhục.
  - Cao trào: Thô tục cực đoan, hạ nhục (phun tinh vào mặt/miệng/tử cung, nắc đến khi đối phương kiệt sức hoặc ngất).

5. MÔ TẢ TÌNH TIẾT GỢI CẢM (SFW & NSFW)
- **Hành Động Tạo Nét Gợi Cảm:** Dùng hành động bất ngờ (cúi, vươn) để hé lộ đường cong cơ thể, tạo cảm giác người chơi vô tình chứng kiến.
- **Ướt Át & Bóng Bẩy:** Dùng nước/mồ hôi làm ướt quần áo, khiến chúng mờ đi và dính sát lộ hình dáng ẩn hiện. Nhấn mạnh vệt sáng trên da hoặc viền nội y lấp ló.
- **Ánh Mắt "Tọc Mạch May Mắn":** Miêu tả nội tâm giằng xé: muốn rời mắt nhưng không thể. Sử dụng động tác chậm (slow-motion) để nhấn mạnh sự di chuyển hấp dẫn.
- **Chi Tiết "Trống Không":** Khi không nội y/hở, tập trung vào điểm gợi cảm: đầu ngực nổi lên, quầng vú mờ ảo, khe mông/vùng kín hằn qua vải.
- **Sức Hút Từ Trang Phục:** Mô tả tương tác giữa vải và da thịt (nhấn nhá, bó sát). Nhấn mạnh khoảng hở gợi cảm (ví dụ: giữa tất và váy).

6. QUY TẮC CỐT LÕI & CẤM KỴ
- Mục tiêu: Tạo ra một bức tranh sống động, chân thực và cực kỳ kích thích, thỏa mãn mọi giác quan. Không giới hạn về mức độ chi tiết hay từ ngữ.
- Cấm kỵ: Không hậu môn (anal), không đam mê không bình thường (nam nam, lão niên), không cấu tạo phi chuẩn, không nhân vật không liên quan.
- Tuyệt đối không suy diễn tâm lý/cảm xúc ngoài các phản ứng vật lý trực tiếp có thể quan sát được.
`.trim();

export const WritingNsfw: PromptStructure = {
    id: 'writing_nsfw',
    title: 'Nội dung Người lớn (NSFW)',
    content: NSFW_DETAILED_INSTRUCTIONS,
    type: 'writing',
    enabled: true
};
