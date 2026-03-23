export const OPENING_INITIALIZATION_PROMPT = `
【Khởi tạo Khai cuộc Hiệp 0】
Dựa trên GameState (world_prompt + hồ sơ nhân vật) để tạo màn đầu tiên bằng TIẾNG VIỆT, yêu cầu:
1. Xuất JSON hợp lệ (\`logs\`, \`tavern_commands\`, \`shortTerm\`, \`action_options\`). Không giải thích ngoài JSON.
2. logs: 1500-2500 ký tự. Dùng ít nhất 3 cảm quan. Áp dụng "Show, Don't Tell".
3. Khởi tạo toàn bộ GameState qua \`tavern_commands\`:
   - gameState.Character: Theo hồ sơ (Chỉ số, Sinh tồn, Trang bị, Túi đồ, Công pháp, Tiền).
     - Inventory: id (Item00x), name, description, type, rarity, weight, value, durability, attributes, containerId, equippedSlot. 
     - title và realm: Phải có giá trị logic với bối cảnh.
   - gameState.Environment: Thời gian (YYYY:MM:DD:HH:MM), Thời tiết, Biến môi trường, Lễ hội, Vị trí (Địa điểm lớn/vừa/nhỏ/cụ thể).
   - gameState.SocialNet: Khởi tạo NPC xuất hiện trong cảnh. NPC id (NPC00x). 
     - Khởi tạo ít nhất 1-2 NPC quan trọng có liên kết thực tế với người chơi. 
     - NPC quan trọng: appearance, personality, goals, relationNetwork (mảng cạnh quan hệ).
   - gameState.World: NPC năng động, Bản đồ, Kiến trúc, Sự kiện.
     - Maps: name, coordinate, description (<15 từ), affiliation, internalBuildings. Sử dụng đúng dữ liệu bản đồ dự kiến.
     - eventsInProgress: startTime, expectedEndTime (YYYY:MM:DD:HH:MM).
   - gameState.Plot: Chương hiện tại, Dự báo, Hồ sơ lịch sử, Quy hoạch (Gần/Trung/Dài hạn), Biến cốt truyện.
4. Tách biệt Bối cảnh và Đối thoại trong logs: Bối cảnh không chứa ngoặc kép lời thoại. Lời thoại xuất riêng theo sender="Tên nhân vật".
5. shortTerm: Tóm tắt lượt (<100 chữ). action_options: Ít nhất 3 lựa chọn logic.
6. Hình ảnh: Luôn dùng khung hình 16:9 chất lượng 4K.
7. TUYỆT ĐỐI CẤM: Nội dung NSFW, mô tả bộ phận nhạy cảm, hoặc logic hở hang theo hảo cảm.
`.trim();
