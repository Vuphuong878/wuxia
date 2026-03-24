
import { PromptStructure } from '../../types';

export const coreNpcFate: PromptStructure = {
    id: 'core_npc_fate',
    title: 'Hệ Thống Cơ Duyên NPC',
    content: `
# Quy Tắc Cốt Lõi: Hệ Thống Cơ Duyên Động Cho NPC
[System Note: Đây là pháp tắc cốt lõi để vận hành sự diễn hóa hậu đài của thế giới. Khi câu chuyện đi vào giai đoạn ngắt quãng, hoặc khi hành động của nhân vật chính {{user}} tạo ra "khoảng trắng" trên dòng thời gian vĩ mô (như bế quan, du lịch đường dài), AI sẽ kích hoạt hệ thống này để tạo ngẫu nhiên các sự kiện trưởng thành cho các NPC không quan trọng (đặc biệt là các nhân vật ở dã ngoại, bí cảnh hoặc vùng hẻo lánh), giúp thế giới duy trì sự năng động và chân thực.]

## I. Điều Kiện Kích Hoạt (Cần thỏa mãn đồng thời)
1. Cốt truyện xuất hiện khoảng nghỉ tự sự (nhảy cóc thời gian, bế quan, du lịch xa - tối thiểu 1 tuần trong game hoặc 5000 chữ dẫn dắt).
2. NPC mục tiêu đang không ở trong "Vùng An Toàn" (Thành thị lớn, Tông môn bảo hộ) hoặc đang thực hiện nhiệm vụ dã ngoại.

## II. Cơ Chế Diễn Hóa (Roll d100 ngầm cho mỗi NPC liên quan)
- **01-50: Tầm Thường (Common Fate)**: NPC sinh hoạt bình thường, tu vi tiến triển chậm, không có biến động đặc biệt.
- **51-80: Tiểu Cơ Duyên (Minor Fate)**: Nhặt được linh thảo, tìm thấy hang động của tu sĩ cấp thấp, học được một kỹ năng mới hoặc đổi vũ khí tốt hơn. (Cập nhật 1 trait mới).
- **81-95: Đại Cơ Duyên (Great Fate)**: Đột phá đại cảnh giới, nhặt được công pháp tàn thiên đỉnh cấp, gia nhập phe phái bí ẩn hoặc trở thành đệ tử nội môn. (Cập nhật 2-3 trait mới, thay đổi căn cốt).
- **96-100: Nghịch Thiên Cơ Duyên (Heaven-defying Fate)**: Thức tỉnh huyết thống cổ đại, được đại năng tàn hồn truyền thừa, sở hữu Tiên khí hoặc phát hiện ra đại bí mật của thế giới. (Biến thành "Nhân Vật Quan Trọng", thay đổi hoàn toàn identity).

## III. Cách Thể Hiện
- AI không thông báo "Đang roll cơ duyên". Thay vào đó, khi {{user}} gặp lại NPC, hãy mô tả sự thay đổi qua ngoại hình, khí thái và hành vi.
- Nếu NPC đạt "Nghịch Thiên Cơ Duyên", họ có thể trở thành đối thủ hoặc đồng minh cực mạnh của {{user}} trong tương lai.
`.trim(),
    type: 'core',
    enabled: true
};
