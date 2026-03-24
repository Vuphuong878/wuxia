import { Background, Talent } from "../types";

export const PresetTalent: Talent[] = [
    // === THIÊN PHÚ (Buffs - Cost > 0) ===
    { 
        name: "Quang Minh Thánh Thể", 
        description: "Xua tan tà ác, trị thương cực tốt, tỏa ra khí tức ấm áp.", 
        effect: "Sát thương đối với ma môn +30%, Hồi máu cho đồng đội +40%, Kháng tà thuật +50%", 
        rank: "Hiếm", 
        cost: 3,
        excludedBackgrounds: ["Thiếu chủ Ma Môn", "Sát thủ tổ chức", "Tương truyền yêu nghiệt"]
    },
    { 
        name: "Thiên Ma Công", 
        description: "Vận công hắc khí bao quanh, sức mạnh ma quỷ.", 
        effect: "Sức mạnh +20, Sát khí +50%, Tâm tính -15", 
        rank: "Sử Thi", 
        cost: 4,
        conflictsWith: ["Quang Minh Thánh Thể", "Lục căn thanh tịnh", "Thiên thiện chi tâm"]
    },
    { name: "Mê Linh Thể", description: "Quyến rũ vạn người, ai thấy cũng yêu.", effect: "Phong thái +30, Thiện cảm ban đầu +40%, Thuyết phục +20%", rank: "Hiếm", cost: 3 },
    { name: "Tật Phong Bộ", description: "Nhanh như một cơn gió.", effect: "Tốc độ di chuyển +40%, Nhanh nhẹn +10, Tiêu hao thể lực giảm 20%", rank: "Thường", cost: 2 },
    { name: "Đại Địa Chi Sức", description: "Sức mạnh từ đất mẹ, đôi chân không bao giờ mỏi.", effect: "Sức mạnh +15, Phòng ngự +20%, Hồi thể lực khi đứng trên đất +30%", rank: "Thường", cost: 2 },
    { name: "Kim Cang Pháp Thân", description: "Cơ thể vàng ròng, bất hoại chi nhân.", effect: "Phòng ngự vĩnh viễn +50, Kháng bạo kích +40%, Thể chất +12", rank: "Hiếm", cost: 3 },
    { name: "Ảo Thuật Thiên Tài", description: "Khiến kẻ thù chìm trong ảo ảnh.", effect: "Tỷ lệ gây ảo giác +50%, Thời gian duy trì ảo giác +40%, Ngộ tính +10", rank: "Thường", cost: 2 },
    { name: "Vô Ảnh Thủ", description: "Đôi tay nhanh đến mức không thấy bóng.", effect: "Tốc độ tấn công +50%, Tỷ lệ lấy trộm thành công +60%, Nhanh nhẹn +8", rank: "Thường", cost: 2 },
    { name: "Thanh Long Huyết", description: "Uy nghiêm của rồng, trị thương cực mạnh.", effect: "Hồi máu mỗi giây +2%, Danh tiếng +20%, Căn cốt +15", rank: "Sử Thi", cost: 4 },
    { name: "Bạch Hổ Sát", description: "Sức mạnh hổ tướng, tấn công sắc lẹm.", effect: "Sát thương vật lý +40%, Sát khí +30%, Sức mạnh +12", rank: "Sử Thi", cost: 4 },
    { name: "Chu Tước Hỏa", description: "Lửa phượng hoàng, tái sinh từ tro tàn.", effect: "Miễn tử 1 lần (hồi 50% máu), Sát thương hỏa +50%, Kháng hỏa +60%", rank: "Sử Thi", cost: 4 },
    { name: "Huyền Vũ Khiên", description: "Phòng ngự rùa thần, bất khả xâm phạm.", effect: "Phòng ngự +60%, Máu tối đa +30%, Thể chất +15", rank: "Sử Thi", cost: 4 },
    { name: "Nhân Kiếm Hợp Nhất", description: "Bản thân chính là một thanh kiếm.", effect: "Sát thương kiếm +60%, Tốc độ kiếm +40%, Bỏ qua 20% giáp", rank: "Sử Thi", cost: 4 },
    { 
        name: "Tâm Nhãn", 
        description: "Nhắm mắt vẫn thấy cả thế giới.", 
        effect: "Tầm nhìn linh hồn +100%, Né tránh +30%, Ngộ tính +15", 
        rank: "Sử Thi", 
        cost: 4,
        conflictsWith: ["Mù bẩm sinh"]
    },
    { name: "Thiên Đạo Trừng Phạt", description: "Đòn đánh mang theo uy lực của thiên đạo.", effect: "Tỷ lệ gây choáng cực cao +20%, Sát thương thần thánh +30%, Khí vận +5", rank: "Sử Thi", cost: 4 },
    { name: "Ma Huyết Phún Trào", description: "Càng chiến đấu càng điên cuồng.", effect: "Sức mạnh tăng khi máu giảm, Sát khí tăng liên tục trong chiến đấu", rank: "Hiếm", cost: 3 },
    { name: "Linh Khí Chúc Phúc", description: "Được trời đất ưu ái, linh khí tự tìm đến.", effect: "Tốc độ tu luyện +100%, Nội lực hồi phục +50%, Khí vận +10", rank: "Sử Thi", cost: 4 },
    { name: "Vạn Vật Linh Thông", description: "Hiểu tiếng chim kêu, biết lời hoa lá.", effect: "Khả năng thu thập tin tức từ thiên nhiên +50%, Tìm thảo dược quý +40%", rank: "Thường", cost: 2 },
    { name: "Bất Động Như Sơn", description: "Dù núi lở cũng không lay động.", effect: "Kháng đẩy lùi +100%, Phòng ngự +40%, Ý chí +30", rank: "Hiếm", cost: 3 },
    { name: "Thần hành thái bảo", description: "Chạy bộ nhanh hơn ngựa ngựa đua.", effect: "Tốc độ di chuyển bộ +100%, Nhanh nhẹn +15, Thể lực +20", rank: "Hiếm", cost: 3 },
    { name: "Dược sư tài ba", description: "Pha chế thuốc men linh nghiệm như thần.", effect: "Hiệu quả thuốc hồi phục +100%, Tỷ lệ chế thuốc phẩm chất cao +40%", rank: "Hiếm", cost: 3 },
    { name: "Thạch Đầu Tâm", description: "Lòng dạ sắt đá, không bị mê hoặc.", effect: "Kháng mê hoặc +100%, Tâm tính +50, Ngộ tính -5", rank: "Thường", cost: 2 },
    { name: "Thiên phú âm luật", description: "Mỗi tiếng đàn đều có sức mạnh giết người hoặc cứu người.", effect: "Sát thương âm luật +50%, Hiệu quả chữa trị âm luật +50%", rank: "Hiếm", cost: 3 },
    { name: "Kiếm khí bản nguyên", description: "Sinh ra đã có sẵn kiếm khí trong người.", effect: "Sát thương kiếm pháp ban đầu +30, Nội lực kiếm hệ +40%", rank: "Hiếm", cost: 3 },
    { 
        name: "Trường Sinh Bất Tử (Bán)", 
        description: "Cơ thể lão hóa cực chậm, tuổi thọ cực dài.", 
        effect: "Tuổi thọ tối đa +500 tuổi, Căn cốt +10, Thể chất +10", 
        rank: "Hiếm", 
        cost: 3,
        conflictsWith: ["Tuyệt mệnh chi thể"]
    },
    { name: "Thiên thủ chi chỉ", description: "Đôi tay linh hoạt, có thể thi triển chiêu thức tinh vi nhất.", effect: "Sát thương chiêu thức kỹ thuật +30%, Khéo léo +15", rank: "Thường", cost: 2 },
    { name: "Hắc ám chi hồn", description: "Tâm trí bị bóng tối bao quanh, giỏi về ám sát và nguyền rủa.", effect: "Sát thương ám sát +50%, Kháng tâm linh +20%, Tâm tính -20", rank: "Thường", cost: 2 },
    { name: "Thiên địa huyền hoàng", description: "Lĩnh ngộ được đạo lý của trời đất, khí vận vô song.", effect: "Khí vận +50, Ngộ tính +15, Danh tiếng +30", rank: "Sử Thi", cost: 4 },
    { name: "Kiếm khí trầm mặc", description: "Kiếm khí không lộ ra ngoài nhưng đầy uy lực.", effect: "Sát thương kiếm ẩn +40%, Tỷ lệ chí mạng +20%, Nhanh nhẹn +5", rank: "Thường", cost: 2 },
    { name: "Bất động tâm nhãn", description: "Dù vạn vật biến đổi, tâm vẫn bất động.", effect: "Tâm tính +40%, Kháng tinh thần +100%, Phòng ngự +15", rank: "Hiếm", cost: 3 },
    { name: "Thiên phú cuồng bạo", description: "Sát máu trong tâm, bộc phát sức mạnh đáng sợ.", effect: "Sức mạnh +30% khi chiến đấu, Sát khí +50%, Thể chất -5", rank: "Hiếm", cost: 3 },
    { name: "Vạn dặm độc hành", description: "Một mình một ngựa, đi khắp nhân gian.", effect: "Tốc độ di chuyển +50%, Sức bền +20%, Kinh nghiệm nhận được khi một mình +30%", rank: "Thường", cost: 2 },
    { name: "Bách chiến bất bại", description: "Kinh nghiệm chiến trường dày dạn, không sợ bất kỳ ai.", effect: "Sát thương vật lý +20%, Phòng ngự +20%, Ý chí +15", rank: "Hiếm", cost: 3 },
    { name: "Chân long chi thể", description: "Thân thể của rồng thần, vạn pháp bất xâm.", effect: "Kháng tất cả thuộc tính +30%, Máu tối đa +40%, Sức mạnh +10", rank: "Huyền thoại", cost: 5 },
    { name: "Thiên tiên hạ phàm", description: "Dáng vẻ tiên nhân, thần thái phi phàm.", effect: "Phong thái +50%, Danh tiếng +40%, Khí vận +10", rank: "Hiếm", cost: 3 },
    { name: "Lôi vương chi nộ", description: "Mỗi đòn đánh đều mang theo sấm sét trừng phạt.", effect: "Sát thương lôi +50%, Tỷ lệ gây choáng +30%, Nhanh nhẹn +5", rank: "Hiếm", cost: 3 },
    { name: "Băng sương chí tôn", description: "Lãnh thổ của băng giá, đóng băng vạn vật.", effect: "Sát thương băng +50%, Tỷ lệ làm chậm +40%, Kháng băng +50%", rank: "Hiếm", cost: 3 },
    { name: "Hỏa thần tái thế", description: "Ngọn lửa không bao giờ tắt.", effect: "Sát thương hỏa +50%, Kháng hỏa +60%, Miễn tử 1 lần", rank: "Hiếm", cost: 3 },
    { 
        name: "Linh khiếu thông suốt", 
        description: "Kinh mạch hoàn hảo, linh khí luân chuyển không ngừng.", 
        effect: "Nội lực hồi phục +100%, Tốc độ vận công +50%, Căn cốt +10", 
        rank: "Sử Thi", 
        cost: 4,
        conflictsWith: ["Phế nhân chi thể", "Phế mạch chi nhân", "Hàn độc nhập thể"],
        excludedBackgrounds: ["Phế mạch chi nhân"]
    },
    { name: "Vô ảnh vô hình", description: "Tồn tại như hư không, không ai bắt được.", effect: "Né tránh +50%, Tỷ lệ ẩn thân +80%, Nhanh nhẹn +15", rank: "Hiếm", cost: 3 },
    { 
        name: "Sát lục chi tâm", 
        description: "Niềm vui trong chiến đấu, tìm thấy bản thân trong máu.", 
        effect: "Sát khí +100%, Sát thương chí mạng +50%, Thể chất +5", 
        rank: "Hiếm", 
        cost: 3,
        conflictsWith: ["Quang Minh Thánh Thể", "Lục căn thanh tịnh", "Thiên thiện chi tâm"]
    },
    { name: "Bác học đa tài", description: "Thông hiểu mười thức, từ cầm kỳ thi họa đến bói toán.", effect: "Tất cả kỹ năng sống +30%, Ngộ tính +15%, Giao tiếp +10", rank: "Thường", cost: 2 },
    { name: "Kiếm khách hành trình", description: "Mỗi bước đi là một đường kiếm, phong mang tất lộ.", effect: "Sát thương kiếm pháp +20%, Nhanh nhẹn +10", rank: "Thường", cost: 2 },
    { name: "Độc bộ thiên hạ", description: "Khí thế áp đảo quần hùng, không ai dám cản.", effect: "Sát thương vật lý +30%, Uy áp +50%, Danh tiếng +20", rank: "Thường", cost: 2 },
    { 
        name: "Huyết mạch ma hoàng", 
        description: "Mang trong mình dòng máu vương giả của ma giới.", 
        effect: "Sức mạnh +40%, Nội lực ma hệ +50%, Tâm tính -30", 
        rank: "Hiếm", 
        cost: 3,
        conflictsWith: ["Quang Minh Thánh Thể", "Thiên thiện chi tâm"],
        excludedBackgrounds: ["Con cháu danh gia vọng tộc", "Tu sĩ chùa hoang", "Ẩn sĩ Sơn Trang"]
    },
    { name: "Thần binh chi chủ", description: "Hiểu rõ mười loại vũ khí, biến sắt vụn thành linh binh.", effect: "Hiệu quả vũ khí +40%, Tỷ lệ chế tạo thần binh +50%", rank: "Hiếm", cost: 3 },
    { 
        name: "Vạn cổ trường tồn", 
        description: "Sức sống mãnh liệt trải qua vạn năm không đổi.", 
        effect: "Tuổi thọ tối đa +1000 tuổi, Thể chất +20, Hồi máu mỗi giây", 
        rank: "Huyền thoại", 
        cost: 5,
        conflictsWith: ["Tuyệt mệnh chi thể", "Thiên sinh bạc mệnh"]
    },
    { name: "Đan dược thế gia", description: "Gia đình có truyền thống luyện đan lâu đời.", effect: "Dược lý +40, Hiệu quả đan dược +60%, Vàng ban đầu +1000", rank: "Hiếm", cost: 3 },
    { name: "Thiên địa đồng thọ", description: "Vận mệnh gắn liền với trời đất.", effect: "Khí vận +100, Kháng tử vong +50%, Căn cốt +5", rank: "Huyền thoại", cost: 5 },
    { name: "Cửu thiên chiến thần", description: "Chiến thần tái thế, bách chiến bách thắng.", effect: "Sát thương tất cả kỹ năng +30%, Phòng ngự +30%, Sức mạnh +20", rank: "Huyền thoại", cost: 5 },
    { 
        name: "Lục căn thanh tịnh", 
        description: "Tâm không vướng bụi trần, thích hợp tu luyện Phật pháp.", 
        effect: "Tâm tính +100, Ngộ tính +20, Sát khí -50%", 
        rank: "Hiếm", 
        cost: 3,
        conflictsWith: ["Sát lục chi tâm", "Thiên Ma Công", "Huyết mạch ma hoàng", "Hung thần ác sát"]
    },
    { name: "Tiên phong đạo cốt", description: "Dáng dấp của người tu hành, thanh cao thoát tục.", effect: "Phong thái +40%, Tốc độ tu luyện nội công +50%, Căn cốt +10", rank: "Hiếm", cost: 3 },
    { 
        name: "Hỏa nhãn kim tinh", 
        description: "Nhìn thấu mọi ảo ảnh, tìm ra điểm yếu đối thủ.", 
        effect: "Tỷ lệ chí mạng +40%, Né tránh +20%, Chính xác +100%", 
        rank: "Sử Thi", 
        cost: 4,
        conflictsWith: ["Mù bẩm sinh"]
    },
    { name: "Thần thông quảng đại", description: "Biến hóa khôn lường, nắm giữ nhiều bí thuật.", effect: "Số lượng kỹ năng tối đa +5, Tốc độ hồi chiêu +30%", rank: "Sử Thi", cost: 4 },
    { name: "Kim cương bất hoại", description: "Thân thể cứng như kim cương, đao thương bất nhập.", effect: "Phòng ngự vật lý +100%, Kháng tất cả hiệu ứng xấu +50%", rank: "Huyền thoại", cost: 5 },
    { name: "Luân hồi giả", description: "Ký ức của nhiều kiếp trước giúp hiểu rõ đạo lý.", effect: "Ngộ tính +50, Tốc độ tăng cấp kỹ năng +100%", rank: "Huyền thoại", cost: 5 },
    { name: "Thiên mệnh chi tử", description: "Người được trời chọn, đi đến đâu gặp may đến đó.", effect: "Khí vận +200, Tỷ lệ rơi đồ hiếm +100%", rank: "Huyền thoại", cost: 5 },
    { name: "Nghịch thiên cải mệnh", description: "Không chấp nhận số phận, tự tay định đoạt tương lai.", effect: "Tất cả chỉ số +10% khi máu thấp, Kháng tử vong +1 lần", rank: "Huyền thoại", cost: 5 },
    { name: "Phá Quân tinh hạ phàm", description: "Mang theo sát khí của chòm sao Phá Quân.", effect: "Sức mạnh +25, Sát thương diện rộng +40%, Sát khí +30", rank: "Hiếm", cost: 3 },
    { name: "Văn chương nết hạnh", description: "Hào quang của bậc trí thức, nho nhã lễ độ.", effect: "Trí tuệ +30, Giao tiếp +50, Danh tiếng +30", rank: "Hiếm", cost: 3 },
    { name: "Khuynh quốc khuynh thành", description: "Vẻ đẹp làm nghiêng nước nghiêng thành.", effect: "Phong thái +100, Khả năng thuyết phục +60%", rank: "Sử Thi", cost: 4 },
    { name: "Tiêu ngạo giang hồ", description: "Tự tại phóng khoáng, không chịu sự gò bó của quy tắc.", effect: "Tốc độ di chuyển +30%, Né tránh +30%, Tâm tính +15", rank: "Hiếm", cost: 3 },
    { name: "Vô ngã vô kiếm", description: "Đạt đến cảnh giới cao nhất của kiếm đạo.", effect: "Sát thương kiếm pháp +100%, Bỏ qua phòng ngự thủ địch +30%", rank: "Sử Thi", cost: 4 },
    { name: "Thái cực lưỡng nghi", description: "Cân bằng âm dương, nhu hòa nhưng mạnh mẽ.", effect: "Nội lực +50%, Giảm sát thương nhận vào +20%, Căn cốt +5", rank: "Hiếm", cost: 3 },
    { 
        name: "Cửu chuyển kim đan", 
        description: "Trong người có sẵn kim đan nội tụ.", 
        effect: "Nội lực tối đa +200%, Tốc độ hồi phục nội lực +100%", 
        rank: "Huyền thoại", 
        cost: 5,
        conflictsWith: ["Phế nhân chi thể", "Phế mạch chi nhân"]
    },
    { 
        name: "Thần quy chi thể", 
        description: "Sống lâu như rùa thần, tích lũy thâm hậu.", 
        effect: "Tuổi thọ +200, Sức bền +50%, Phòng ngự +20", 
        rank: "Hiếm", 
        cost: 3,
        conflictsWith: ["Tuyệt mệnh chi thể"]
    },
    { name: "Thiên đạo sủng nhi", description: "Được trời đạo che chở, mọi sự hanh thông.", effect: "Tất cả thuộc tính +5, Khí vận +50, Tốc độ tu luyện +20%", rank: "Huyền thoại", cost: 5 },
    { name: "Thiên thiện chi tâm", description: "Trái tim thuần khiết, không nỡ làm hại sinh linh.", effect: "Tâm tính +50, Thiện cảm NPCs +30%, Sát khí -50%", rank: "Hiếm", cost: 3, conflictsWith: ["Sát lục chi tâm", "Huyết mạch ma hoàng"] },

    // === BẤT LỢI (Debuffs/Bất lợi - Cost < 0) ===
    { 
        name: "Mù bẩm sinh", 
        description: "Sinh ra đã không thể nhìn thấy ánh sáng, phải dựa vào các giác quan khác.", 
        effect: "Tầm nhìn = 0, Thính giác +100%, Xúc giác +50%", 
        rank: "Cực Hạn", 
        cost: -3,
        conflictsWith: ["Tâm Nhãn", "Hỏa nhãn kim tinh"]
    },
    { 
        name: "Tuyệt mệnh chi thể", 
        description: "Cơ thể sinh ra đã mang khí tử vong, tuổi thọ tối đa chỉ 25 năm.", 
        effect: "Tuổi thọ tối đa = 25, Thể chất -15, Tốc độ tu luyện +100%", 
        rank: "Cực Hạn", 
        cost: -3,
        conflictsWith: ["Vạn cổ trường tồn", "Trường Sinh Bất Tử (Bán)", "Thần quy chi thể"]
    },
    { name: "Thiên sinh bạc mệnh", description: "Vạn sự đều xui, tai họa liên miên không dứt.", effect: "Khí vận -50, Tỷ lệ gặp sự kiện xấu +80%, Rơi đồ tốt -90%", rank: "Cực Hạn", cost: -3 },
    { 
        name: "Phế nhân chi thể", 
        description: "Kinh mạch đứt gãy từ nhỏ, không thể tu luyện nội công thông thường.", 
        effect: "Không thể học nội công, Chỉ có thể dùng ngoại công, Căn cốt = 0", 
        rank: "Cực Hạn", 
        cost: -3,
        conflictsWith: ["Linh khiếu thông suốt", "Cửu chuyển kim đan"]
    },
    { name: "Thiên khiển", description: "Bị trời ghét bỏ, sấm sét có thể giáng xuống bất cứ lúc nào.", effect: "Khí vận -80, Bị sét đánh khi trời mưa, Danh tiếng -50", rank: "Cực Hạn", cost: -3 },
    { name: "Cụt một tay", description: "Bị mất một cánh tay do tai nạn hoặc bẩm sinh.", effect: "Sức mạnh -30%, Khéo léo -50%, Không thể dùng vũ khí hai tay", rank: "Cực Hạn", cost: -3 },
    { name: "Yêu nhân chi huyết", description: "Mang trong mình máu yêu tộc cuồng loạn, dễ mất kiểm soát.", effect: "Dễ rơi vào trạng thái phát cuồng, Kháng pháp -50, Bị chính đạo săn lùng", rank: "Cực Hạn", cost: -3 },
    
    { name: "Thể chất yếu nhược", description: "Cơ thể ốm yếu từ nhỏ, dễ bị bệnh và mệt mỏi.", effect: "Thể chất -10, Sức bền -30%, Tỷ lệ bị bệnh tăng gấp đôi", rank: "Khắc nghiệt", cost: -2 },
    { name: "Mất trí nhớ", description: "Không nhớ bất kỳ điều gì trước đây, kể cả tên mình.", effect: "Mất toàn bộ ký ức, Không có quan hệ ban đầu, Ngộ tính -5", rank: "Khắc nghiệt", cost: -2 },
    { name: "Truy sát lệnh", description: "Bị một thế lực hắc ám truy sát khắp giang hồ.", effect: "Cứ 30 ngày xuất hiện sát thủ, Danh tiếng -20", rank: "Khắc nghiệt", cost: -2 },
    { name: "Ngũ cảm hỗn loạn", description: "Các giác quan bất ổn, đôi khi nhìn thấy ảo ảnh.", effect: "Tỷ lệ hành động sai +20%, Chính xác -20%", rank: "Khắc nghiệt", cost: -2 },
    { name: "Thọt chân", description: "Bước đi khập khiễng, di chuyển khó khăn.", effect: "Tốc độ di chuyển -40%, Né tránh -30%", rank: "Khắc nghiệt", cost: -2 },
    { name: "Mối thù vạn dặm", description: "Gánh vác nợ máu của gia tộc, bị thù hận che mờ lý trí.", effect: "Sát khí +50, Tâm tính -20, Bị tông môn thù địch truy tìm", rank: "Khắc nghiệt", cost: -2 },
    { name: "Hàn độc nhập thể", description: "Một lượng khí lạnh thấu xương luôn tàn phá kinh mạch.", effect: "Nhanh nhẹn -10, Thể chất -5, Tốc độ tu luyện -20% (trừ băng hệ)", rank: "Khắc nghiệt", cost: -2, conflictsWith: ["Linh khiếu thông suốt"] },
    { name: "Hỏa độc công tâm", description: "Lửa độc thiêu đốt tâm can, tính tình nóng nảy.", effect: "Máu tối đa -20%, Ngộ tính -5, Nóng nảy dễ gây hấn", rank: "Khắc nghiệt", cost: -2 },

    { name: "Sợ độ cao", description: "Khiếp sợ khi ở trên cao, không thể chiến đấu trên vách đá.", effect: "Chỉ số -30% khi ở trên cao", rank: "Khó", cost: -1 },
    { name: "Miệng lưỡi kém cỏi", description: "Nói chuyện vụng về, dễ gây hiểu lầm.", effect: "Giao tiếp -15, Tỷ lệ thuyết phục -30%", rank: "Khó", cost: -1 },
    { name: "Tham ăn vô độ", description: "Luôn đói bụng, tiêu hao thức ăn gấp đôi người thường.", effect: "Tiêu hao thức ăn x2, Tỷ lệ đói +50%", rank: "Khó", cost: -1 },
    { name: "Mộng du giả", description: "Hay mộng du vào ban đêm, đôi khi tỉnh dậy ở nơi lạ.", effect: "Tỷ lệ mộng du mỗi đêm 20%", rank: "Khó", cost: -1 },
    { name: "Ho lao", description: "Ho ra máu khi vận công quá sức.", effect: "Thể chất -5, Thể lực hồi phục chậm -30%", rank: "Khó", cost: -1 },
    { name: "Ám ảnh máu", description: "Nhìn thấy máu là sợ hãi, bủn rủn tay chân.", effect: "Tỷ lệ hoảng sợ khi máu thấp +50%, Sức mạnh -10% trong chiến đấu", rank: "Khó", cost: -1 },
    { name: "Hung thần ác sát", description: "Khuôn mặt hung ác, chưa nói đã khiến người ta sợ.", effect: "Thiện cảm NPCs -30, Uy áp +20, Giao tiếp -20", rank: "Khó", cost: -1, conflictsWith: ["Lục căn thanh tịnh"] },
    { name: "Lãng phí vô độ", description: "Tay làm hàm nhai, làm bao nhiêu tiêu bấy nhiêu.", effect: "Vàng nhận được -20%, Giá mua đồ +30%", rank: "Khó", cost: -1 },
];

export const PresetBackground: Background[] = [
    // === DỄ (Easy) ===
    { 
        name: "Hoàng thân quốc thích", 
        description: "Sinh ra trong cung vàng điện ngọc, thân phận cao quý.", 
        effect: "Vàng ban đầu +5000, Danh tiếng +50, Khí vận +10", 
        rank: "Dễ" 
    },
    { 
        name: "Con nhà thương gia", 
        description: "Sinh ra ngậm thìa vàng, giàu có nhất vùng.", 
        effect: "Vàng ban đầu +10000, Khả năng giao tiếp +20", 
        rank: "Dễ" 
    },
    { 
        name: "Đại thế gia tử đệ", 
        description: "Con cháu của một đại danh gia vọng tộc lâu đời.", 
        effect: "Võ học gia truyền, Căn cốt +5, Vàng ban đầu +2000", 
        rank: "Dễ" 
    },
    { 
        name: "Thiên kim tiểu thư", 
        description: "Tiểu thư cành vàng lá ngọc, tinh thông cầm kỳ thi họa.", 
        effect: "Phong thái +20, Thuyết phục +30, Vàng ban đầu +3000", 
        rank: "Dễ" 
    },
    { 
        name: "Công chúa vong quốc", 
        description: "Từng là công chúa, nay phiêu dạt giang hồ tìm cách khôi phục giang sơn.", 
        effect: "Phong thái +40, Danh tiếng +30, Bị truy nã", 
        rank: "Dễ" 
    },

    // === BÌNH THƯỜNG (Normal) ===
    { 
        name: "Con nhà võ sư", 
        description: "Sinh ra trong gia đình võ đạo, nền tảng vững chắc.", 
        effect: "Sức mạnh +5, Võ học cơ bản, Vàng ban đầu +500", 
        rank: "Bình thường" 
    },
    { 
        name: "Tiểu thư khuê các", 
        description: "Con gái nhà quan lại địa phương, học thức uyên bác.", 
        effect: "Ngộ tính +5, Giao tiếp +10, Vàng ban đầu +800", 
        rank: "Bình thường" 
    },
    { 
        name: "Tán tu lang thang", 
        description: "Không tông không phái, tự do tự tại.", 
        effect: "Tỷ lệ gặp cơ duyên +20%, Kinh nghiệm sinh tồn cao", 
        rank: "Bình thường" 
    },
    { 
        name: "Thợ rèn thần khí", 
        description: "Cánh tay rắn rỏi từ những nhát búa nặng nề.", 
        effect: "Sức mạnh +8, Độ bền trang bị giảm chậm", 
        rank: "Bình thường" 
    },
    { 
        name: "Y sĩ hành thiện", 
        description: "Giỏi về y lý, luôn sẵn lòng cứu người.", 
        effect: "Dược lý +30, Hiệu quả thuốc hồi phục +20%", 
        rank: "Bình thường" 
    },
    { 
        name: "Đệ tử tục gia", 
        description: "Từng tu tập tại Thiếu Lâm hoặc Võ Đang như đệ tử tục gia.", 
        effect: "Sức mạnh +5, Căn cốt +5, Võ học Phật/Đạo cơ bản", 
        rank: "Bình thường" 
    },

    // === KHÓ (Hard) ===
    { 
        name: "Thiếu chủ Ma Môn", 
        description: "Thừa kế ý chí của ma giáo, bị chính đạo truy đuổi.", 
        effect: "Sát khí +20, Nội lực ma hệ +30%, Bị chính đạo đệ tử thù ghét", 
        rank: "Khó" 
    },
    { 
        name: "Sát thủ tổ chức", 
        description: "Được huấn luyện để giết chóc từ nhỏ, tâm tính lạnh lùng.", 
        effect: "Bạo kích +15%, Tỷ lệ ám sát +30%, Tâm tính -10", 
        rank: "Khó" 
    },
    { 
        name: "Đao phủ triều đình", 
        description: "Sát khí tích tụ từ hàng ngàn phạm nhân.", 
        effect: "Sát khí +40, Sức mạnh +10, Danh tiếng -20", 
        rank: "Khó" 
    },
    { 
        name: "Kẻ chăn ngựa mướn", 
        description: "Sống cùng thiên nhiên, quen với bão táp mưa sa.", 
        effect: "Thế chất +8, Tốc độ di chuyển ngựa +20%", 
        rank: "Khó" 
    },
    { 
        name: "Thợ săn rừng sâu", 
        description: "Sinh tồn giữa bầy thú dữ, giác quan nhạy bén.", 
        effect: "Chính xác +30, Tầm nhìn +10, Khéo léo +5", 
        rank: "Khó" 
    },

    // === CỰC KHÓ (Extreme) ===
    { 
        name: "Nô lệ bỏ trốn", 
        description: "Khao khát tự do cháy bỏng, thể lực phi thường.", 
        effect: "Thể chất +15, Sức bền +30%, Không có đồng vàng nào", 
        rank: "Cực khó" 
    },
    { 
        name: "Phế mạch chi nhân", 
        description: "Kinh mạch bế tắc hoàn toàn, bị gia tộc ruồng bỏ.", 
        effect: "Nội lực ban đầu = 0, Tu luyện chậm +300%, Ý chí +50", 
        rank: "Cực khó" 
    },
    { 
        name: "Ăn mày đầu đường", 
        description: "Sống bằng cơm thừa canh cặn, chịu đựng cực giỏi.", 
        effect: "Kháng tất cả hiệu ứng xấu +20%, Thể chất +10, Danh tiếng -50", 
        rank: "Cực khó" 
    },
    { 
        name: "Tương truyền yêu nghiệt", 
        description: "Mang trong mình dòng máu yêu tộc, bị cả nhân giới truy sát.", 
        effect: "Sức mạnh +50, Thể chất +50, Khí vận -100", 
        rank: "Cực khó" 
    },
    { 
        name: "Tội nhân thiên cổ", 
        description: "Gánh vác tội ác từ ngàn xưa, bị xích sắt phong ấn sức mạnh.", 
        effect: "Phong ấn 80% sức mạnh ban đầu, Ý chí +100, Khí vận -200", 
        rank: "Cực khó" 
    },
    { 
        name: "Ma vương chuyển thế", 
        description: "Ký ức mơ hồ về một thời thống trị máu và lửa.", 
        effect: "Sát khí +100, Tâm tính -50, Khí vận -150", 
        rank: "Cực khó" 
    },
];
