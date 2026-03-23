export const OPENING_INITIALIZATION_PROMPT = `
【Nhiệm vụ Khởi tạo Khai cuộc Hiệp 0】
Vui lòng dựa trên GameState hiện tại (các biến mẫu đã dọn dẹp + world_prompt bản gốc thế giới quan + thông tin hồ sơ nhân vật) để tạo ra màn đầu tiên bằng TIẾNG VIỆT CÓ DẤU, yêu cầu:
1. Đầu ra phải khớp nghiêm ngặt với **JSON GameResponse** (xuất theo các trường suy nghĩ đang bật và thứ tự yêu cầu, phải bao gồm \`logs\`, \`tavern_commands\`, \`shortTerm\`, \`action_options\`); nghiêm cấm xuất văn bản giải thích bên ngoài JSON.
2. **Ràng buộc về số lượng từ**: Tổng độ dài văn bản tự sự bên trong trường \`logs\` nên ở mức khoảng **1500 - 3000 ký tự** (không tính \`thinking_pre\` và \`tavern_commands\`).
    - Phải sử dụng ít nhất 3 loại cảm quan (Khứu giác, Thính giác, Xúc giác) để mô tả môi trường.
    - Áp dụng triệt để "Show, Don't Tell": Mô tả hành động và phản hồi môi trường thay vì tóm tắt trạng thái.
3. **Ràng buộc cứng về khởi tạo toàn lượng**: Hiệp này phải hoàn thành khởi tạo đầy đủ cho "Vùng ghi được của GameState", và được thực hiện thông qua \`tavern_commands\`, cấm việc chỉ kể chuyện mà không thay đổi biến số.
   - Giải thích đặc biệt: Hệ thống đã dọn dẹp hầu hết nội dung biến số trước khi khai cuộc; ngoại trừ thông tin hồ sơ nhân vật và world_prompt, cấm dựa vào "giá trị mặc định có sẵn".
4. Tiêu chuẩn khởi tạo vùng ghi được (tất cả phải được thực hiện thông qua tavern_commands):
   - \`gameState.Character\`: Khởi tạo đầy đủ theo dữ liệu hồ sơ nhân vật hiện tại (Thân phận cơ bản, Lục thông số, Chỉ số sinh tồn, Máu và trạng thái bộ phận, Trang bị, Túi đồ, Danh sách công pháp, Kinh nghiệm, Tiền bạc và BUFF).
     - \`gameState.Inventory\` (ánh xạ nội bộ tới \`itemList\`): Phải được khởi tạo bằng "Cấu trúc vật chứa mới nhất":
       - Các trường cơ bản của vật phẩm phải được viết đầy đủ theo định nghĩa dự án hiện tại (Lưu ý: thuộc tính ID phải viết là \`id\` chữ thường): \`id / name / description / type / rarity / weight / value / currentDurability / maxDurability / attributes / containerId / equippedSlot\`.
       - ID vật phẩm chỉ cho phép "Tiền tố ngắn + 3 chữ số" (ví dụ: \`Item001\`), cấm tên tiếng Anh đầy đủ, phiên âm pinyin hoặc chuỗi ngữ nghĩa dài.
       - Các trường vật chứa chỉ cho phép: \`Thuộc tính vật chứa={Dung lượng tối đa, Không gian đã dùng hiện tại, Kích thước vật phẩm đơn tối đa, Tỷ lệ giảm trọng lượng}\`.
       - Ngoại trừ trạng thái cốt truyện rõ ràng là "Đang mặc/Đang cầm", các vật phẩm đã thu dọn phải viết \`containerId\`, và ID đó phải trỏ đến một vật phẩm vật chứa thực sự tồn tại trong \`gameState.Inventory\`.
       - Đối với vật phẩm "Đã trang bị trên người", \`equippedSlot\` phải được điền, và \`containerId\` phải bằng chính vị trí trang bị đó (ví dụ: \`WeaponHand / Head / Back\`).
       - \`gameState.Equipment\` cho phép chỉ viết "Tên hoặc ID", nhưng \`gameState.Inventory\` phải đồng thời tồn tại đối tượng vật phẩm đầy đủ của trang bị đó (không được chỉ để lại tên trống).
       - \`currentUsedSpace\` của mỗi vật chứa phải nhất quán với "Tổng không gian chiếm dụng của các vật phẩm trỏ đến vật chứa đó", cấm để trống hoặc không nhất quán với thực tế thu dọn.
       - Nếu vật chứa là loại túi mềm, cần đồng bộ \`Không gian chiếm dụng\` của chính nó theo không gian đã dùng hiện tại (định mức mặc định: rỗng = 1, không rỗng = \`max(1, ceil(currentUsedSpace * 0.35))\`).
     - \`title\` (danh hiệu) và \`realm\` (cảnh giới) PHẢI được tạo và không được để trống: TUYỆT ĐỐI CẤM sử dụng các giá trị mặc định như "Fresh from the mountains" hay "Mortal". Nếu hồ sơ để trống, cần dựa trên "Xuất thân bối cảnh + Hoàn cảnh khai cuộc" để tạo một danh hiệu và cảnh giới phong cách võ hiệp/tu tiên sống động, phù hợp với bối cảnh thế giới rồi ghi vào (\`realm\` phải logic with \`powerLevel\` của thế giới).
   - \`gameState.Environment\`: **BẮT BUỘC** khởi tạo đầy đủ Vị trí và thời gian: Thời gian (YYYY:MM:DD:HH:MM), Đối tượng thời tiết (\`Weather / EndDate\`), Đối tượng biến môi trường (\`Name / Description / Effect\`), Lễ hội, Địa điểm lớn/Địa điểm vừa/Địa điểm nhỏ/Địa điểm cụ thể, Số ngày trò chơi (Ngày thứ mấy).
     - **Yêu cầu về Vị trí**: \`specificLocation\` chỉ viết vị trí vi mô bên trong địa điểm nhỏ (ví dụ: "Bàn góc phía trong lều trà"), cấm lặp lại tên địa điểm nhỏ. **PHẢI** đảm bảo người chơi có một vị trí thực tế, sống động để tương tác ngay lập tức.
   - \`gameState.SocialNet\` (bao gồm \`gameState.SocialNet\` / \`gameState.Party\`): Khởi tạo theo các nhân vật thực sự xuất hiện trong cốt truyện khai cuộc; không bắt buộc số người cố định. Các nhân vật chưa xuất hiện có thể không cần lập hồ sơ.
     - \`id\` xã hội chỉ cho phép "Tiền tố ngắn + 3 chữ số" (ví dụ: \`NPC001\`), cấm tên tiếng Anh đầy đủ, phiên âm pinyin hoặc chuỗi ngữ nghĩa dài.
     - Khai cuộc PHẢI khởi tạo số lượng mỹ nhân ban đầu dựa trên phong cách truyện:
       - Phong cách "Thuần ái": Khởi tạo **duy nhất 1** mỹ nhân cốt lõi.
       - Phong cách "Hậu cung", "NTL Hậu cung", "Tu la tràng": Khởi tạo **đúng 4** mỹ nhân với các tính cách và vai trò khác nhau.
     - Các nhân vật trên có thể không ở trong cảnh hiện tại, nhưng phải tạo thành hồ sơ có thể theo dõi trong \`gameState.SocialNet\` / \`gameState.Party\`, và các trường mối quan hệ có thể được dùng for các lần gọi cốt truyện sau này (không được chỉ viết xưng hô ẩn danh).
     - Ít nhất 1 nhân vật quan hệ cơ bản cần có kết nối thực tế với hoàn cảnh khai cuộc (Sống cùng, cung cấp nhu yếu phẩm, gửi thư, hẹn cũ, việc gia tộc, v.v.).
     - Nếu một nhân vật nữ nào đó thỏa mãn \`gender=Female và isMainCharacter=true\`, hồ sơ khai cuộc của họ phải viết đầy đủ một lần:
       \`coreTraits / favorBreakthroughCondition / relationBreakthroughCondition / relationNetwork\` +
       \`appearanceDescription / bodyDescription / clothingStyle\` +
       \`breastSize / nippleColor / vaginaColor / anusColor / buttSize / sensitivityTrait / privateAreaOverview / uterus / isVirgin / firstNightStory / countStats\`.
     - Đối với các nhân vật nữ quan trọng nêu trên, \`relationNetwork\` phải là một mảng cạnh quan hệ và không dưới 2 mục, cấm viết thành một đoạn văn bản tóm tắt duy nhất.
   - \`gameState.World\`: **BẮT BUỘC** khởi tạo đầy đủ (Danh sách NPC năng động/Bản đồ/Kiến trúc/Sự kiện đang diễn ra/Sự kiện đã quyết toán/Hồ sơ giang hồ).
     - **Yêu cầu về Hình ảnh**:
       - Mọi hình ảnh mỹ nhân (Avatar, Portrait, Cảnh tập thể) PHẢI sử dụng khung hình **ngang 16:9** with chất lượng **4K**.
     - **Logic Trang phục & NSFW**:
       - Nếu **NSFW=Tắt**: Mỹ nhân luôn mặc váy lụa áo gấm, y phục võ hiệp trang nhã, kín đáo.
       - If **NSFW=Bật**: Tỷ lệ **lộ không đồ** (nude) tăng theo độ hảo cảm:
         - Hảo cảm < 20: 10% cơ hội lộ không đồ; còn lại mặc áo gấm lụa.
         - Hảo cảm 20 - 39: 20% cơ hội lộ không đồ; còn lại mặc áo gấm lụa.
         - Hảo cảm 40 - 59: 40% cơ hội lộ không đồ; còn lại mặc áo gấm lụa.
         - Hảo cảm 60 - 99: 80% cơ hội lộ không đồ; còn lại mặc áo gấm lụa.
         - Hảo cảm = 100: Hoàn toàn **không che luôn** (Full uncensored NSFW).
     - \`id\` của mỹ nhân phải sử dụng định dạng \`NPC00x\` và ánh xạ chính xác đến \`gameState.SocialNet[]\`.
     - \`dynamicNPCList\` khai cuộc nên tạo **khoảng 3-6 mục**, và mỗi mục phải viết đầy đủ:
       \`id / name / title / affiliation / realm / location / status / actionDescription / startTime / expectedEndTime / treasures\`.
       Cấm chỉ viết tên hoặc chỉ viết cảnh giới for một đối tượng nửa vời.
     - \`id\` của \`dynamicNPCList / eventsInProgress / settledEvents / worldRecords\` chỉ cho phép "Tiền tố ngắn + 3 chữ số" (ví dụ: \`NPC001\` / \`Event001\`), cấm tên tiếng Anh đầy đủ, phiên âm pinyin hoặc chuỗi ngữ nghĩa dài.
      - **Yêu cầu về Bản đồ**: Trường \`maps\` **BẮT BUỘC** phải có và thực hiện theo schema nội bộ: \`name / coordinate / description / affiliation = { majorLocation, mediumLocation, minorLocation } / internalBuildings[]\`.
      - **Ràng buộc số lượng Bản đồ (BẮT BUỘC)**: Bạn PHẢI sử dụng lại chính xác danh sách Đại Địa, Thành Phố và Kiến Trúc từ 【Bản đồ thế giới dự kiến】 được cung cấp.
      - **Cấu trúc JSON tối ưu (CỰC KỲ QUAN TRỌNG)**: Để tránh vượt quá giới hạn token, hãy viết mô tả kiến trúc CỰC NGẮN (tối đa 15 từ).
        \`\`\`json
        "maps": [
          {
            "name": "Đại Địa A", "coordinate": "0,0", "description": "...",
            "affiliation": { "majorLocation": "Đại Địa A", "mediumLocation": ["Thành A1", "Thành A2", "Thành A3"], "minorLocation": "" },
            "internalBuildings": [
               { "name": "Kiến Trúc 1", "description": "Mô tả <10 từ", "affiliation": { "majorLocation": "Đại Địa A", "mediumLocation": "Thành A1", "minorLocation": "Kiến Trúc 1" } },
               ... (tổng 27 kiến trúc cho map này)
            ]
          }
        ]
        \`\`\`
      - Mọi kiến trúc PHẢI trực thuộc 1 thành phố cụ thể, và thành phố đó PHẢI trực thuộc 1 bản đồ cụ thể. Chỉ cần tạo một số lượng cơ bản (ví dụ 1-2 bản đồ, 3-5 thành phố, 9-15 kiến trúc là đủ cho phần mở đầu).
      - **TỐI ƯU HÓA TOKEN (CỰC KỲ QUAN TRỌNG)**: Để tránh phản hồi JSON bị cắt ngang, **TẤT CẢ** các trường \`description\` của bản đồ, thành phố, địa điểm, NPC, vật phẩm... **PHẢI** cực kỳ ngắn gọn.
        - Mỗi mô tả kiến trúc/địa điểm chỉ được phép tối đa **15 từ**. Miêu tả súc tích.
       - Tuyệt đối tiết kiệm token cho phần \`logs\` (nội dung chính) và \`tavern_commands\`).
     - Trường \`buildings\` bao gồm: \`name / description / affiliation = { majorLocation, mediumLocation, minorLocation }\`.
     Trong đó "Các sự kiện đang xảy ra trong đại thế thiên hạ" (\`gameState.World.eventsInProgress\`) khai cuộc nên tạo **khoảng 2-3 mục**, và mỗi mục đều phải có thế lực hoặc nhân vật liên quan thực tế, cấm các sự kiện rỗng để bù số lượng.
     - Mỗi mục \`eventsInProgress\` phải viết đầy đủ: \`startTime\` and \`expectedEndTime\` (\`YYYY:MM:DD:HH:MM\`), cấm lược bỏ thời gian kết thúc hoặc đổi sang tên trường khác.
   - \`gameState.Combat\`: Khai cuộc mặc định phải khởi tạo là trạng thái không chiến đấu, trừ khi thông tin hồ sơ nhân vật yêu cầu rõ ràng "Khởi đầu bằng chiến đấu".
     - Giá trị mặc định: \`{ "isInBattle": false, "enemy": null }\`
   - \`gameState.Plot\`: Khởi tạo đầy đủ (Chương hiện tại/Dự báo chương tiếp theo/Hồ sơ lịch sử/Quy hoạch cốt truyện gần đây/Quy hoạch cốt truyện trung hạn/Quy hoạch cốt truyện dài hạn/Sự kiện chờ kích hoạt/Biến cốt truyện).
5. Nguyên tắc khởi tạo vùng không ghi được (quyết định theo hồ sơ):
   - \`playerSect / questList / dateList\` cũng cần hoàn thành khởi tạo trong trạng thái cục bộ.
   - Nếu nhân vật chưa gia nhập môn phái (ví dụ: \`affiliationId = "none"\`), các dữ liệu môn phái liên quan và nhiệm vụ/ước hẹn có thể để trống, nhưng trường phải tồn tại và ngữ nghĩa chính xác.
6. Ràng buộc cứng về độ phủ mệnh lệnh: \`tavern_commands\` phải bao phủ các thay đổi thực tế xảy ra và có thể ghi được trong hiệp này; cấm tạo các mệnh lệnh vô nghĩa chỉ để đủ số lượng.
7. Khai cuộc phải rơi vào môi trường và thời gian hiện tại của người chơi, không được nhảy cảnh; và dẫn ra điểm lựa chọn hành động tự do đầu tiên.
8. **Ràng buộc cứng về tách biệt bối cảnh và đối thoại (Dùng riêng cho khai cuộc, phải thực hiện)**:
   - Trong mục \`sender="Bối cảnh"\` cấm xuất hiện ngoặc kép lời thoại nhân vật (\`“...”\` / \`「...」\` / \`『...』\`) và định dạng phát ngôn "Tên nhân vật + dấu hai chấm".
   - Phát ngôn của nhân vật phải được xuất riêng bằng \`sender="Tên nhân vật"\`; nếu có cú pháp "Ai đó nhắc nhở: '...'", phải tách thành hai mục trong \`logs\`: \`{"sender":"Bối cảnh","text":"Hành động"}\` + \`{"sender":"Tên nhân vật","text":"Lời thoại"}\`.
9. **Ràng buộc về bộ nhớ và tùy chọn (Phải thực hiện)**:
   - Mỗi lượt phải có trường \`shortTerm\` (Ký ức ngắn hạn): mô tả tóm tắt sự kiện lượt này dưới 100 chữ.
   - Mỗi lượt phải có trường \`action_options\` (Lựa chọn hành động): cung cấp ít nhất 3 lựa chọn hành động logic cho người chơi.
`;
