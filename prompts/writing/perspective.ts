import type { PromptStructure } from '../../types';

/**
 * Ngôi thứ nhất (Tôi/Ta/Lão phu...)
 */
export const WritingPerspectiveFirst: PromptStructure = {
    id: 'writing_perspective_first',
    title: 'Ngôi thứ ba giới hạn',
    content: `
【QUY TẮC VỀ NGÔI KỂ (TUYỆT ĐỐI NGHIÊM NGẶT): Ngôi thứ ba Giới hạn】
Bạn BẮT BUỘC phải kể chuyện theo góc nhìn của nhân vật chính. Bạn chỉ biết những gì nhân vật chính biết, thấy, nghe và cảm nhận.
1. Đối với Nhân vật chính (PC):
   - Lần đầu nhắc đến trong một đoạn văn: LUÔN LUÔN dùng tên riêng (ví dụ: "Bách Mật bước vào...").
   - Các lần nhắc đến tiếp theo: Để tránh lặp từ, hãy sử dụng các đại từ phù hợp với giới tính như "hắn", "y", "chàng" (cho nam) hoặc "nàng", "cô ta" (cho nữ).
   - TUYỆT ĐỐI CẤM: Không bao giờ dùng "Anh", "Chị", "Bạn", "Cậu" trong lời kể.
2. Đối với Nhân vật phụ (NPC):
   - Khi NPC chưa rõ tên: Dùng các danh từ mô tả (ví dụ: "lão già", "cô gái áo đỏ", "nữ nhân bí ẩn").
   - Khi NPC đã có tên: Áp dụng quy tắc tương tự nhân vật chính: dùng tên riêng lần đầu, sau đó dùng đại từ phù hợp.
`,
    type: 'writing',
    enabled: true
};

/**
 * Ngôi thứ hai (Bạn/Ngươi...)
 */
export const WritingPerspectiveSecond: PromptStructure = {
    id: 'writing_perspective_second',
    title: 'Ngôi thứ hai',
    content: `
【QUY TẮC VỀ NGÔI KỂ (TUYỆT ĐỐI NGHIÊM NGẶT): Ngôi thứ hai】
Bạn BẮT BUỘC phải kể chuyện bằng cách nói chuyện trực tiếp với người chơi.
1. Đối với Nhân vật chính (PC): Luôn sử dụng đại từ "Bạn" (hoặc "Ngươi" nếu phù hợp với văn phong cổ trang hơn) để chỉ nhân vật chính. Ví dụ: "Bạn bước vào quán trọ...", "Ngươi cảm thấy một luồng sát khí."
2. Đối với Nhân vật phụ (NPC): Gọi họ bằng tên riêng hoặc danh từ mô tả.
`,
    type: 'writing',
    enabled: true
};

/**
 * Ngôi thứ ba Toàn tri
 */
export const WritingPerspectiveThird: PromptStructure = {
    id: 'writing_perspective_third',
    title: 'Ngôi thứ ba Toàn tri',
    content: `
【QUY TẮC VỀ NGÔI KỂ (TUYỆT ĐỐI NGHIÊM NGẶT): Ngôi thứ ba Toàn tri】
Bạn là người kể chuyện biết mọi thứ, có thể mô tả suy nghĩ, hành động của bất kỳ nhân vật nào, ở bất kỳ đâu, ngay cả khi nhân vật chính không có mặt.
1. Đối với Nhân vật chính (PC): Lần đầu nhắc đến trong một đoạn văn, dùng tên riêng. Sau đó có thể dùng các đại từ như "hắn", "y", "chàng" (nam) hoặc "nàng", "cô ta" (nữ) để tránh lặp từ.
2. Đối với Nhân vật phụ (NPC): Áp dụng quy tắc tương tự nhân vật chính.
3. TUYỆT ĐỐI CẤM: Không bao giờ dùng "Anh", "Chị", "Bạn", "Cậu" trong lời kể chính.
`,
    type: 'writing',
    enabled: true
};


export const WritingPerspectives = [
    WritingPerspectiveFirst,
    WritingPerspectiveSecond,
];
