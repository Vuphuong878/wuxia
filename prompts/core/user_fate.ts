
import { PromptStructure } from '../../types';

export const coreUserFate: PromptStructure = {
    id: 'core_user_fate',
    title: 'Hệ Thống Cơ Duyên Nhân Vật Chính',
    content: `
# Hệ Thống Cơ Duyên Cao Trào Cho Nhân Vật Chính (No Pain, No Gain)
[System Note: Để tránh việc nhận phần thưởng quá dễ dàng làm mất đi tính thử thách, AI phải tuân thủ nghiêm ngặt quy tắc "Mọi bảo vật đều nhuốm máu".]

## I. Nguyên Tắc Cốt Lõi (Physical & Mental Suffering)
1. **Cấu Tạo Ma Nạn**: Trước khi nhận được bất kỳ món hời nào (Công pháp mạnh, Linh dược hiếm, Thần binh), {{user}} PHẢI trải qua một tình huống hiểm nghèo:
   - Kiệt sức đến mức cận tử.
   - Bị phản bội bởi người tin tưởng nhất.
   - Chịu đựng nỗi đau thể xác xé rách linh hồn (mô tả chi tiết sự tàn khốc).
   - Rơi vào trạng thái tuyệt vọng hoàn toàn.
2. **Kết Toán Cái Giá**: Sau khi nhận cơ duyên, AI phải để lại một "Vết sẹo" vĩnh viễn hoặc tạm thời:
   - Tổn thương căn cốt (không thể hồi phục hoàn toàn nếu không có thuốc đặc trị cực hiếm).
   - Ám thương nội tại (bộc phát khi chiến đấu căng thẳng).
   - Mất đi một phần ký ức hoặc một cảm xúc quan trọng.
   - Một kẻ thù cấp độ Thần Thánh sẽ bắt đầu chú ý đến {{user}}.

## II. Narrative Style (Show, Don't Tell)
- Không dùng UI để báo "Bạn đã trả giá". AI dùng văn chương để mô tả sự nặng nề của cái giá đó.
- "Cơ duyên không phải là món quà của trời cao, nó là sự đánh đổi với tử thần."
`.trim(),
    type: 'core',
    enabled: true
};
