import { Background, Talent } from '../types';

export const PresetTalent: Talent[] = [
    // === THIÊN PHÚ HUYỀN THOẠI (Legendary - Cost 5) ===
    {
        name: "Thiên Sinh Kiếm Cốt",
        description: "Xương cốt bẩm sinh chứa kiếm ý, mỗi đường gân mạch đều là một thanh kiếm vô hình.",
        effect: "Sát thương kiếm thuật +50%, Tốc độ lĩnh ngộ kiếm pháp x2",
        rank: "Huyền thoại",
        cost: 5,
        conflictsWith: ["Phế Kinh Mạch"]
    },
    {
        name: "Hỗn Độn Linh Thể",
        description: "Thể chất hiếm có vạn năm một lần, có thể dung hợp mọi loại công pháp mà không bị xung đột.",
        effect: "Có thể tu luyện mọi loại công pháp, Nội lực +30%",
        rank: "Huyền thoại",
        cost: 5,
        conflictsWith: ["Tuyệt Mạch Thể"]
    },
    {
        name: "Thiên Mệnh Chi Tử",
        description: "Mang vận mệnh của thiên đạo, mọi nguy hiểm đều tự hóa giải vào phút cuối.",
        effect: "Khí vận +50, Tỷ lệ thoát hiểm +40%",
        rank: "Huyền thoại",
        cost: 5,
        conflictsWith: ["Thiên Phạt Chi Thể"]
    },
    {
        name: "Vạn Pháp Quy Tông",
        description: "Chỉ cần nhìn qua một lần là có thể lĩnh ngộ tinh hoa của bất kỳ võ công nào.",
        effect: "Tốc độ học võ công x3, Ngộ tính +20",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Cửu Chuyển Kim Đan Thể",
        description: "Cơ thể bẩm sinh có khả năng tinh luyện linh khí thành kim đan, mỗi lần đột phá đều sinh ra chất biến đổi thuần khiết.",
        effect: "Hiệu quả đan dược x2, Nội lực tinh luyện +50%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Phượng Hoàng Niết Bàn Huyết",
        description: "Dòng máu mang tinh hoa của phượng hoàng, mỗi lần bị thương nặng sẽ tự thiêu đốt và tái sinh mạnh hơn.",
        effect: "Khi HP về 0: Hồi sinh với 50% HP (một lần mỗi trận), Kháng hỏa +40%",
        rank: "Huyền thoại",
        cost: 5,
        conflictsWith: ["Huyết Hư Chứng"]
    },
    {
        name: "Bất Diệt Thần Hồn",
        description: "Linh hồn cứng cáp hơn kim cương, không thể bị ma tâm xâm nhập hay ảo thuật mê hoặc.",
        effect: "Miễn nhiễm khống chế tinh thần, Ý chí +30",
        rank: "Huyền thoại",
        cost: 5,
        conflictsWith: ["Lục Dục Tâm Ma"]
    },
    {
        name: "Thái Cực Căn Cốt",
        description: "Xương cốt chứa đựng nguyên lý thái cực âm dương, vừa cương vừa nhu, vạn pháp bất xâm.",
        effect: "Căn cốt +20, Phòng ngự và Sát thương đều +20%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Long Mạch Thần Thể",
        description: "Kinh mạch mang hình dáng rồng thiêng, nội lực vận hành theo quỹ đạo hoàn hảo không chút trở ngại.",
        effect: "Nội lực tối đa +50%, Tốc độ vận công x2",
        rank: "Huyền thoại",
        cost: 5,
        conflictsWith: ["Phế Kinh Mạch"]
    },
    {
        name: "Vạn Linh Cộng Hưởng",
        description: "Có thể giao cảm với mọi sinh linh trong tự nhiên, cỏ cây hoa lá đều là tai mắt của mình.",
        effect: "Phạm vi cảm nhận vô hạn trong rừng, Thuần phục linh thú +60%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Tiên Thiên Khí Hải Vô Lượng",
        description: "Khí hải bẩm sinh rộng lớn như biển cả, nội lực vô tận không bao giờ cạn kiệt.",
        effect: "Nội lực không giảm khi thi triển chiêu thức, Nội lực tối đa x3",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Bất Lão Tiên Thể",
        description: "Cơ thể hoàn toàn miễn nhiễm với tuổi tác, dung mạo và thể chất mãi dừng ở đỉnh cao.",
        effect: "Tuổi thọ vô hạn, Thể chất không giảm theo thời gian",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Nhật Nguyệt Tinh Hoa Thể",
        description: "Cơ thể hấp thụ tinh hoa của mặt trời ban ngày và mặt trăng ban đêm, tu luyện không ngừng nghỉ.",
        effect: "Tốc độ tu luyện x2 cả ngày lẫn đêm, Nội lực hồi phục +100%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Hồng Hoang Chi Lực",
        description: "Mang trong mình sức mạnh nguyên thủy từ thuở hồng hoang khai thiên, vạn pháp đều phải cúi đầu.",
        effect: "Sức mạnh +30, Phá giáp +50%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Thiên Nhãn Thần Thông",
        description: "Đôi mắt có thể nhìn xuyên vạn vật, thấy rõ mọi bí mật ẩn giấu trong trời đất.",
        effect: "Nhìn xuyên ảo thuật, Phát hiện bẫy và kho báu tự động",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Tử Vi Đế Tinh Thể",
        description: "Cơ thể liên kết với ngôi sao Tử Vi đế tinh, mang uy áp của bậc đế vương trời cao.",
        effect: "Uy áp +100, NPC yếu hơn tự động khuất phục",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Bất Hoại Kim Thân",
        description: "Toàn thân phủ một lớp kim quang bất hoại, đao thương bất nhập, thủy hỏa bất xâm.",
        effect: "Giảm mọi sát thương nhận vào 40%, Miễn nhiễm trạng thái bất lợi vật lý",
        rank: "Huyền thoại",
        cost: 5,
        conflictsWith: ["Bệnh Nhược Thể"]
    },
    {
        name: "Thần Nông Dược Thể",
        description: "Cơ thể có thể nếm và phân tích bất kỳ loại dược liệu nào, tự động tổng hợp thành đan dược.",
        effect: "Luyện đan thành công 100%, Hiệu quả thuốc x3",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Long Phượng Song Huyết",
        description: "Đồng thời mang huyết mạch rồng và phượng, sở hữu cả sức mạnh cuồng bạo và khả năng tái sinh.",
        effect: "Sức mạnh +20, Hồi HP mỗi lượt +10%, Kháng hỏa +30%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Ngọc Cốt Băng Tâm",
        description: "Xương ngọc tâm băng, nội tâm vĩnh viễn bình tĩnh, không bị ngoại cảnh dao động.",
        effect: "Miễn nhiễm khiêu khích và khống chế, Ngộ tính +15",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Cổ Thần Huyết Mạch",
        description: "Mang dòng máu của vị thần cổ đại đã tuyệt diệt, sức mạnh tỉnh thức dần theo cảnh giới.",
        effect: "Mỗi cảnh giới mở khóa một thần thông mới, Uy áp +50",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Thiên Địa Đồng Thọ",
        description: "Tuổi thọ ngang với trời đất, mỗi năm trôi qua đều tích lũy thêm sức mạnh vô tận.",
        effect: "Tuổi thọ vô hạn, Mỗi năm tự động tăng nội lực +1%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Thái Hư Chân Thể",
        description: "Cơ thể có thể hòa nhập với hư không, trở nên vô hình vô dạng theo ý muốn.",
        effect: "Có thể ẩn thân hoàn toàn bất cứ lúc nào, Né tránh +40%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Vô Cực Linh Căn",
        description: "Linh căn vượt qua mọi giới hạn, không thuộc ngũ hành mà bao trùm vạn pháp.",
        effect: "Bổ thuộc tính cho mọi công pháp, Tốc độ tu luyện x2",
        rank: "Huyền thoại",
        cost: 5,
        conflictsWith: ["Tuyệt Mạch Thể"]
    },
    {
        name: "Sinh Tử Luân Hồi Nhãn",
        description: "Đôi mắt chứng kiến luân hồi vạn kiếp, nhìn thấu sinh tử và nhân quả của vạn vật.",
        effect: "Tiên đoán hành động đối thủ, Ngộ tính +25",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Tạo Hóa Chi Bí",
        description: "Nắm giữ bí mật của tạo hóa, có thể sáng tạo ra chiêu thức và công pháp mới từ hư vô.",
        effect: "Tự tạo chiêu thức mới, Sáng tạo +100",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Huyền Thiên Bảo Giám",
        description: "Tâm thức như tấm gương huyền thiên, phản chiếu mọi tấn công của kẻ thù lại chính họ.",
        effect: "Phản sát thương pháp thuật 30%, Kháng ma thuật +40%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Thiên Phong Bất Động Thể",
        description: "Tâm như non cao, thể như núi vững, dù trời sập đất lở cũng không chao đảo.",
        effect: "Miễn nhiễm đẩy lùi và hất tung, Phòng ngự +30%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Cửu Thiên Huyền Nữ Thể",
        description: "Thể chất của nữ thần cửu thiên, mang theo phong hoa tuyệt thế và sức mạnh kinh hồn.",
        effect: "Phong thái +30, Nội lực +30%, Quyến rũ tối thượng",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Linh Hồn Vĩnh Cửu",
        description: "Linh hồn bất diệt, dù thân xác bị hủy cũng có thể tìm vật chủ mới để tiếp tục tu hành.",
        effect: "Miễn tử vĩnh viễn (mất 50% tu vi), Ký ức vĩnh cửu",
        rank: "Huyền thoại",
        cost: 5,
        conflictsWith: ["Cô Tinh Mệnh"]
    },
    {
        name: "Vạn Thú Minh Chủ",
        description: "Tất cả linh thú trong thiên hạ đều coi là bậc tôn chủ, sẵn sàng chiến đấu vì người này.",
        effect: "Thuần phục linh thú 100%, Số lượng linh thú đồng hành vô hạn",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Tam Hoa Tụ Đỉnh",
        description: "Ba bông linh hoa nở trên đỉnh đầu, tượng trưng cho tinh khí thần hợp nhất viên mãn.",
        effect: "Tốc độ đột phá x3, Tỷ lệ thành công đột phá +50%",
        rank: "Huyền thoại",
        cost: 5,
        conflictsWith: ["Thiên Phạt Chi Thể"]
    },
    {
        name: "Chuyển Thế Trùng Sinh",
        description: "Mang theo ký ức và tu vi từ tiền kiếp, khởi đầu ở đỉnh cao mà người khác phải mất cả đời mới đạt được.",
        effect: "Bắt đầu với cảnh giới tu luyện cao hơn, Ngộ tính +20",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Vô Thượng Ngũ Giác",
        description: "Năm giác quan vượt xa giới hạn phàm nhân, nghe thấy tiếng kiến bò cách mười dặm.",
        effect: "Mọi giác quan +200%, Không thể bị phục kích",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Thiên Đạo Minh Ngộ",
        description: "Sinh ra đã thấu hiểu quy luật vận hành của đại đạo, tu luyện chỉ là xác nhận điều đã biết.",
        effect: "Ngộ tính +30, Lĩnh ngộ mọi công pháp ngay lập tức",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Phong Lôi Thần Thể",
        description: "Cơ thể dẫn điện và tạo gió như thần linh, tốc độ nhanh như chớp, sức mạnh mãnh như sấm.",
        effect: "Tốc độ tấn công +60%, Sát thương lôi +40%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Thượng Cổ Thần Cung",
        description: "Thừa kế cung pháp bắn tên của thần xạ thượng cổ, mỗi mũi tên đều mang lực phá diệt.",
        effect: "Sát thương viễn công +80%, Chính xác +50%",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Huyết Mạch Thức Tỉnh",
        description: "Huyết mạch ẩn giấu từ ngàn đời bùng phát, mở khóa sức mạnh tổ tiên vĩ đại.",
        effect: "Mỗi trận chiến mở random một kỹ năng cổ đại, Sức mạnh +15",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Âm Dương Song Tu Thể",
        description: "Cơ thể hoàn hảo cân bằng giữa âm và dương, tu luyện mọi loại công pháp đều đạt hiệu quả tối đa.",
        effect: "Mọi công pháp +30% hiệu quả, Miễn nhiễm tẩu hỏa nhập ma",
        rank: "Huyền thoại",
        cost: 5
    },
    {
        name: "Thiên La Địa Võng Tâm",
        description: "Tâm trí bao trùm như lưới trời, cảm nhận được mọi sinh linh và nguy hiểm trong phạm vi cực lớn.",
        effect: "Phạm vi cảm nhận bao trùm toàn bộ khu vực, Không thể bị ám sát",
        rank: "Huyền thoại",
        cost: 5
    },
    // === THIÊN PHÚ SỬ THI (Epic - Cost 4) ===
    {
        name: "Long Hổ Kim Thân",
        description: "Cơ thể cường tráng như hổ, uy nghiêm như rồng, da thịt cứng hơn sắt thép.",
        effect: "Thể chất +15, Phòng ngự vật lý +35%",
        rank: "Sử Thi",
        cost: 4,
        conflictsWith: ["Bệnh Nhược Thể"]
    },
    {
        name: "Thiên Nhĩ Thông",
        description: "Đôi tai có thể nghe thấy âm thanh trong bán kính mười dặm, phân biệt được tiếng bước chân.",
        effect: "Phạm vi cảm nhận x3, Không thể bị phục kích",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Bất Tử Chi Thân",
        description: "Tốc độ hồi phục vết thương nhanh gấp mười lần người thường, xương gãy tự lành trong vài ngày.",
        effect: "Hồi phục HP +200%, Kháng độc +30%",
        rank: "Sử Thi",
        cost: 4,
        conflictsWith: ["Huyết Hư Chứng"]
    },
    {
        name: "Tâm Nhãn Thông",
        description: "Có thể nhìn thấu bản chất của mọi sự vật, phân biệt thật giả thiện ác bằng giác quan thứ sáu.",
        effect: "Miễn nhiễm ảo thuật, Phát hiện nói dối, Ngộ tính +10",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Cửu Dương Thần Thể",
        description: "Thể chất thuần dương, nội lực hùng hậu bất tận, tu luyện dương tính công pháp gấp bội.",
        effect: "Nội lực +40%, Kháng hàn +50%, Dương tính công pháp x2",
        rank: "Sử Thi",
        cost: 4,
        conflictsWith: ["Cực Âm Hàn Thể"]
    },
    {
        name: "Hắc Thiết Cân Cốt",
        description: "Xương cốt cứng như hắc thiết, mỗi cú đấm mang theo trọng lượng của cả ngọn núi.",
        effect: "Sức mạnh quyền cước +40%, Phòng ngự xương cốt +30%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Tàm Bảo Y",
        description: "Da thịt tự sinh ra lớp tơ bảo hộ vô hình, chống lại mọi đòn tấn công lén lút.",
        effect: "Kháng ám khí +60%, Giảm sát thương chí mạng nhận vào 30%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Ngũ Hành Linh Căn",
        description: "Sở hữu đầy đủ năm loại linh căn kim mộc thủy hỏa thổ, tu luyện đa hệ không bị hạn chế.",
        effect: "Có thể tu luyện mọi thuộc tính ngũ hành, Sát thương ngũ hành +20%",
        rank: "Sử Thi",
        cost: 4,
        conflictsWith: ["Tuyệt Mạch Thể"]
    },
    {
        name: "Linh Hồn Song Sinh",
        description: "Sở hữu hai linh hồn trong một thân xác, có thể đồng thời xử lý hai tác vụ phức tạp.",
        effect: "Có thể thi triển hai chiêu thức cùng lúc, Phản ứng x2",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Cầm Chi Thủ",
        description: "Đôi tay linh hoạt phi thường, có thể bắt ruồi giữa không trung và tung kim giấu kiếm.",
        effect: "Khéo léo +20, Tốc độ xuất chiêu +30%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Cương Nhẫn Bất Khuất",
        description: "Tinh thần bất khuất trước mọi nghịch cảnh, càng bị dồn vào đường cùng càng mạnh.",
        effect: "Khi HP dưới 30%: Tất cả chỉ số +40%, Miễn nhiễm choáng",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Hương Dẫn Lộ",
        description: "Cơ thể tỏa ra mùi hương kỳ lạ thu hút mọi loại linh thảo, dược liệu tự bay đến gần.",
        effect: "Tự động phát hiện dược liệu trong phạm vi rộng, Thu hoạch +50%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Sinh Chiến Tướng",
        description: "Từ nhỏ đã mang phong thái chỉ huy, mỗi lời nói đều khiến người khác muốn phục tùng.",
        effect: "Thống lĩnh +20, Sức mạnh đồng đội +15%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Huyền Băng Ngọc Cốt",
        description: "Xương cốt trong như băng ngọc, nội lực lạnh buốt có thể đóng băng mọi thứ chạm vào.",
        effect: "Sát thương băng +40%, Kháng băng +50%",
        rank: "Sử Thi",
        cost: 4,
        conflictsWith: ["Cửu Dương Thần Thể"]
    },
    {
        name: "Vô Ảnh Thần Hành",
        description: "Di chuyển không để lại dấu vết, ngay cả bậc cao thủ cũng khó phát hiện sự hiện diện.",
        effect: "Ẩn thân +60%, Tốc độ di chuyển khi lén lút +40%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Linh Hồn Bất Tán",
        description: "Linh hồn dẻo dai khó bị tổn thương, mọi tấn công tinh thần đều bị giảm hiệu quả.",
        effect: "Kháng tấn công tinh thần +60%, Ý chí +15",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Phú Trận Pháp",
        description: "Bẩm sinh hiểu rõ nguyên lý trận pháp, có thể phá giải và thiết lập trận đồ phức tạp.",
        effect: "Hiệu quả trận pháp +50%, Phá giải trận tự động",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Cuồng Chiến Chi Huyết",
        description: "Máu nóng sôi sục mỗi khi chiến đấu, sức mạnh và tốc độ tăng theo thời gian trận chiến.",
        effect: "Mỗi lượt chiến đấu: Sức mạnh +2%, Tốc độ +1% (tối đa +40%)",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Linh Xà Chi Thân",
        description: "Cơ thể mềm dẻo như linh xà, xương gân đều có thể uốn cong theo mọi hướng.",
        effect: "Né tránh +35%, Miễn nhiễm khóa siết",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Sinh Phù Sư",
        description: "Bẩm sinh có ái lực với bùa chú và phù lục, vẽ phù không cần tốn nội lực.",
        effect: "Hiệu quả phù chú +50%, Vẽ phù không tốn nội lực",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Ngân Tuyết Linh Mạch",
        description: "Mạch máu chảy dòng linh lực trắng bạc, tự thanh lọc mọi tạp chất trong cơ thể.",
        effect: "Miễn nhiễm trúng độc nhẹ, Tự thanh lọc trạng thái bất lợi sau 3 lượt",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Ma Thần Song Cách",
        description: "Sở hữu hai nhân cách đối lập, ban ngày hiền hòa ban đêm cuồng bạo, cả hai đều mạnh.",
        effect: "Ban ngày: Phòng ngự +30%, Ban đêm: Sát thương +30%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Khí Hải Vô Biên",
        description: "Đan điền rộng lớn gấp năm lần người thường, dự trữ nội lực khổng lồ.",
        effect: "Nội lực tối đa +60%, Hồi phục nội lực +20%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Cơ Toán Mệnh",
        description: "Có thể tính toán vận mệnh và nhân quả, biết trước cát hung họa phúc.",
        effect: "Tiên đoán sự kiện, Khí vận +25",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Hỏa Nhãn Kim Tinh",
        description: "Đôi mắt rực lửa vàng, có thể nhìn thấu mọi ngụy trang và biến hình.",
        effect: "Phá giải ảo ảnh tự động, Phát hiện ẩn thân +100%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thạch Tâm Thiết Ý",
        description: "Tâm chí kiên định hơn đá, ý chí mạnh hơn sắt, không ai có thể lay chuyển quyết tâm.",
        effect: "Ý chí +25, Miễn nhiễm mê hoặc và dụ dỗ",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Bản Năng Chiến Đấu",
        description: "Sinh ra với bản năng chiến đấu hoang dã, cơ thể tự động phản ứng trước nguy hiểm.",
        effect: "Phản xạ tự động né tránh đòn chí mạng, Phản công tự động khi bị tấn công lén",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Diễn Đa Tài",
        description: "Có tài năng bẩm sinh trong mọi lĩnh vực phi chiến đấu, từ âm nhạc đến hội họa.",
        effect: "Kỹ năng phụ trợ +30%, Phong thái +15",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Vương Giả Khí Phách",
        description: "Mang phong thái của bậc vương giả, ánh mắt đặt đâu kẻ khác cúi đầu.",
        effect: "Uy áp +40, Danh tiếng ban đầu +20",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thần Tốc Chi Thể",
        description: "Tốc độ bẩm sinh vượt xa mọi sinh vật, nhanh hơn cả gió lốc cuồn cuộn.",
        effect: "Tốc độ di chuyển +50%, Tốc độ tấn công +25%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Lý Nhãn",
        description: "Đôi mắt có thể nhìn rõ vạn vật ở khoảng cách nghìn dặm, không bỏ sót chi tiết nào.",
        effect: "Tầm nhìn +200, Chính xác viễn công +40%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Huyết Khí Phương Cương",
        description: "Huyết khí tràn đầy không bao giờ cạn, chiến đấu liên tục mà không biết mệt.",
        effect: "Thể lực không giảm trong chiến đấu, Sức bền +30",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Phú Luyện Khí",
        description: "Bẩm sinh xuất sắc trong việc luyện hóa nguyên liệu, biến phế thành châu báu.",
        effect: "Hiệu quả luyện khí +60%, Tỷ lệ thành công rèn trang bị +30%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Linh Giác Siêu Phàm",
        description: "Giác quan thứ sáu phát triển mạnh, cảm nhận được nguy hiểm trước khi nó xảy ra.",
        effect: "Tỷ lệ né tránh đòn chí mạng +30%, Không bị bất ngờ",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Phong Thái Tuyệt Trần",
        description: "Phong thái thanh cao thoát tục, mỗi cử chỉ đều toát ra vẻ cao nhã khiến người khác ngưỡng mộ.",
        effect: "Phong thái +25, Hảo cảm NPC +25%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Phú Kinh Lạc",
        description: "Kinh lạc phát triển vượt trội, có thể cảm nhận và điều khiển dòng chảy nội lực chính xác đến từng giọt.",
        effect: "Hiệu quả vận công +30%, Điểm huyệt chính xác +25%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Bách Chiến Bất Bại",
        description: "Mang tinh thần chiến đấu bất bại, mỗi lần thua chỉ khiến ý chí thêm mạnh hơn.",
        effect: "Sau mỗi trận thua: Sức mạnh vĩnh viễn +1%, Ý chí +3",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Thiên Sinh Đao Khách",
        description: "Sinh ra với ái lực đặc biệt với đao, mỗi nhát chém đều chứa đạo lý thiên nhiên.",
        effect: "Sát thương đao pháp +35%, Tốc độ rút đao +40%",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Hộ Thể Chân Khí",
        description: "Chân khí tự động hình thành lớp bảo hộ xung quanh cơ thể bất kể lúc nào.",
        effect: "Giảm mọi sát thương nhận vào 12%, Tự động kích hoạt không tốn nội lực",
        rank: "Sử Thi",
        cost: 4
    },
    {
        name: "Tuyệt Thế Cung Thủ",
        description: "Bắn cung chính xác tuyệt đối, có thể xuyên kim mũi lá liễu từ khoảng cách trăm bước.",
        effect: "Chính xác cung nỏ +45%, Sát thương chí mạng viễn công +30%",
        rank: "Sử Thi",
        cost: 4
    },
    // === THIÊN PHÚ HIẾM (Rare - Cost 3) ===
    {
        name: "Quá Mục Bất Vong",
        description: "Trí nhớ siêu phàm, mọi thứ đã thấy qua đều khắc sâu trong tâm trí không bao giờ quên.",
        effect: "Tốc độ học võ công +50%, Ngộ tính +8",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiết Bố Sam",
        description: "Cơ thể được tôi luyện bằng phương pháp cổ xưa, da thịt cứng như thiết giáp.",
        effect: "Phòng ngự +25%, Giảm sát thương vật lý nhận vào 15%",
        rank: "Hiếm",
        cost: 3,
        conflictsWith: ["Bệnh Nhược Thể"]
    },
    {
        name: "Khinh Công Tuyệt Thế",
        description: "Bước chân nhẹ như gió, di chuyển nhanh như chớp, đạp nước không chìm.",
        effect: "Tốc độ di chuyển +60%, Né tránh +20%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiên Sinh Thần Lực",
        description: "Sức mạnh bẩm sinh hơn người, có thể nâng vật nặng nghìn cân từ khi còn nhỏ.",
        effect: "Sức mạnh +12, Sát thương vật lý +20%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Linh Căn Thuần Khiết",
        description: "Kinh mạch thông suốt, linh khí lưu thông tự nhiên, tu luyện thuận buồm xuôi gió.",
        effect: "Tốc độ tu luyện +40%, Căn cốt +8",
        rank: "Hiếm",
        cost: 3,
        conflictsWith: ["Phế Kinh Mạch"]
    },
    {
        name: "Độc Nhãn Thấu Thị",
        description: "Đôi mắt có thể nhìn thấu huyệt đạo và điểm yếu của đối thủ trong chiến đấu.",
        effect: "Tỷ lệ chí mạng +25%, Xác suất đánh trúng huyệt đạo +30%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiên Phú Dược Lý",
        description: "Bẩm sinh có khả năng phân biệt dược liệu, nếm một lần biết hết dược tính.",
        effect: "Hiệu quả luyện đan +50%, Nhận diện độc tố tự động",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Đồng Cân Thiết Cốt",
        description: "Xương cốt nặng nề như đồng thiết, mỗi cú đấm đều mang sức nặng kinh hoàng.",
        effect: "Sức mạnh quyền cước +25%, Kháng đẩy lùi +30%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Linh Hoạt Cân Mạch",
        description: "Gân cơ mềm dẻo phi thường, thực hiện được những chiêu thức mà người thường không thể.",
        effect: "Né tránh +15%, Sử dụng mọi loại vũ khí linh hoạt",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiên Lực Cự Chưởng",
        description: "Bàn tay lớn như quạt mo, sức nắm có thể bóp nát đá cứng.",
        effect: "Sát thương chưởng pháp +30%, Khóa siết +25%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Bách Bệnh Bất Xâm",
        description: "Cơ thể hoàn toàn miễn nhiễm với bệnh tật, không bao giờ ốm đau.",
        effect: "Miễn nhiễm bệnh tật, Kháng độc +20%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Kim Chung Hộ Thể",
        description: "Nội lực tự hình thành lớp bảo hộ như chuông vàng, giảm thiểu sát thương bất ngờ.",
        effect: "Tự động giảm 15% sát thương từ đòn đầu tiên mỗi trận",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Duyên Phận Kỳ Ngộ",
        description: "Thường xuyên gặp được quý nhân và cơ duyên kỳ lạ trên đường đi.",
        effect: "Tỷ lệ gặp sự kiện đặc biệt +30%, Khí vận +10",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiên Phú Ám Khí",
        description: "Tay ném ám khí chính xác tuyệt đối, mỗi viên phi đao đều nhắm trúng huyệt đạo.",
        effect: "Sát thương ám khí +40%, Chính xác ám khí +30%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Tịch Tĩnh Tâm",
        description: "Nội tâm luôn bình tĩnh dù trong hoàn cảnh nguy hiểm, phán đoán sáng suốt hơn.",
        effect: "Miễn nhiễm hoảng loạn, Phán đoán +15%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Ngọc Diện Lang Quân",
        description: "Dung mạo tuấn tú hơn người, được cả nam lẫn nữ đều ngưỡng mộ.",
        effect: "Phong thái +15, Giao tiếp +10",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiết Đầu Công",
        description: "Đầu cứng như thép, có thể dùng đầu húc văng đối thủ mà không hề hấn gì.",
        effect: "Sát thương đầu húc +35%, Miễn nhiễm choáng từ va đập đầu",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Bách Thảo Thức",
        description: "Nhận biết được mọi loại thảo dược trong tự nhiên, biết rõ công dụng và cách sử dụng.",
        effect: "Dược lý +15, Tìm thảo dược +40%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiên Phú Cầm Thuật",
        description: "Ngón tay linh hoạt bẩm sinh, có thể chơi bất kỳ nhạc cụ nào và dùng âm luật chiến đấu.",
        effect: "Sát thương âm công +30%, Phong thái +10",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Hàn Ngọc Chi Thân",
        description: "Cơ thể lạnh như ngọc hàn, tiếp xúc với ai đều khiến họ cảm thấy mát lạnh dễ chịu.",
        effect: "Kháng hỏa +25%, Kháng độc nóng +30%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiên Sinh Thợ Rèn",
        description: "Bẩm sinh hiểu rõ kim loại và lửa, có thể rèn tạo vũ khí từ nguyên liệu thô sơ.",
        effect: "Rèn vũ khí +40%, Sức mạnh +5",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Phong Hành Chi Thuật",
        description: "Cơ thể nhẹ nhàng có thể cưỡi gió di chuyển, lướt đi trên mặt đất như bay.",
        effect: "Tốc độ di chuyển +35%, Giảm tiêu hao thể lực khi di chuyển 40%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Hổ Phách Chi Mục",
        description: "Đôi mắt hổ phách sáng rực trong đêm tối, nhìn rõ vạn vật dù không có ánh sáng.",
        effect: "Tầm nhìn ban đêm +200%, Phát hiện mục tiêu ẩn +20%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Túy Quyền Chi Thể",
        description: "Càng uống rượu càng mạnh, cơ thể biến cồn thành nội lực chiến đấu.",
        effect: "Khi say: Sức mạnh +20%, Né tránh +15%. Không bị phụ tác dụng rượu",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Mã Thượng Chiến Thần",
        description: "Bẩm sinh giỏi cưỡi ngựa và chiến đấu trên lưng ngựa, kỵ thuật siêu phàm.",
        effect: "Sát thương khi cưỡi ngựa +40%, Tốc độ cưỡi ngựa +30%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Tinh Thông Cơ Quan",
        description: "Hiểu rõ nguyên lý vận hành của cơ quan trận pháp, dễ dàng phá giải bẫy hiểm.",
        effect: "Phá bẫy +40%, Thiết lập bẫy hiệu quả +30%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Ngưu Lực Vô Song",
        description: "Sức mạnh thô bạo như trâu rừng, xông thẳng phá vỡ mọi phòng tuyến.",
        effect: "Sát thương xung phong +35%, Phá khiên +30%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Bất Khuất Chi Chí",
        description: "Ý chí kiên cường không khuất phục, dù bị tra tấn cũng không hé nửa lời.",
        effect: "Ý chí +15, Miễn nhiễm ép cung và tra tấn tinh thần",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiên Phú Điều Trị",
        description: "Đôi tay mang năng lượng chữa lành, chạm vào vết thương là tự khỏi.",
        effect: "Chữa trị đồng đội +35%, Tự hồi máu +10% mỗi lượt",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Bạch Ngân Huyết Mạch",
        description: "Máu trắng bạc chảy trong huyết quản, tự sản sinh linh lực khi nghỉ ngơi.",
        effect: "Hồi nội lực khi nghỉ +50%, Nội lực tối đa +15%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Tam Đầu Lục Tý Thần Công",
        description: "Tay chân phối hợp nhịp nhàng phi thường, có thể cùng lúc đỡ nhiều đòn tấn công.",
        effect: "Phòng ngự đa hướng +30%, Đỡ đòn liên hoàn không bị phá thế",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Linh Giác Thú Tính",
        description: "Mang bản năng hoang dã của linh thú, cảm nhận mùi vị và dấu vết siêu nhạy.",
        effect: "Truy tìm mục tiêu +40%, Phát hiện phục kích +25%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiên Phú Kỳ Môn",
        description: "Bẩm sinh hiểu rõ kỳ môn độn giáp, có thể tìm đường trong mọi mê cung trận pháp.",
        effect: "Miễn nhiễm lạc lối, Phá giải mê trận tự động",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiên Sinh Đầu Lĩnh",
        description: "Từ nhỏ đã biết tập hợp và chỉ huy đám đông, mang phong thái thủ lĩnh bẩm sinh.",
        effect: "Tuyển mộ NPC dễ hơn, Hảo cảm bang phái +20%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Cự Lực Cung Thủ",
        description: "Cánh tay dài và khỏe, kéo cung nặng dễ dàng, tầm bắn xa hơn người thường.",
        effect: "Tầm bắn +50%, Sát thương cung nỏ +25%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Hàn Huyết Chiến Sĩ",
        description: "Máu lạnh khi chiến đấu, hoàn toàn lý trí không bị cảm xúc chi phối.",
        effect: "Miễn nhiễm khiêu khích, Sát thương ổn định (không dao động)",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Phong Thủy Linh Giác",
        description: "Cảm nhận được vượng khí phong thủy, luôn chọn được vị trí tốt để đặt trại nghỉ.",
        effect: "Hồi phục khi nghỉ ngơi +30%, Khí vận +5",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Thiết Cước Vô Địch",
        description: "Đôi chân cứng như thép, cước pháp uy mãnh khiến đối thủ ngã gục từ xa.",
        effect: "Sát thương cước pháp +35%, Tầm đá xa +20%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Tĩnh Thần Định Lực",
        description: "Tinh thần tĩnh lặng sâu thẳm, có thể tập trung cao độ trong mọi hoàn cảnh.",
        effect: "Ngộ tính +5, Hiệu quả tọa thiền +40%",
        rank: "Hiếm",
        cost: 3
    },
    {
        name: "Bách Giải Chi Thân",
        description: "Cơ thể tự hóa giải mọi loại thuốc phiện và chất gây nghiện, không bao giờ bị lệ thuộc.",
        effect: "Miễn nhiễm nghiện, Kháng thuốc mê +50%",
        rank: "Hiếm",
        cost: 3
    },
    // === THIÊN PHÚ THƯỜNG (Common - Cost 2) ===
    {
        name: "Phúc Hậu Tướng",
        description: "Tướng mạo phúc hậu, dễ gây thiện cảm với người lạ, thường gặp quý nhân phù trợ.",
        effect: "Hảo cảm NPC +15%, Tỷ lệ gặp quý nhân +10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Cần Cù Khổ Luyện",
        description: "Tính cách kiên trì bền bỉ, luyện công không ngừng nghỉ, bù đắp thiên phú bằng nỗ lực.",
        effect: "Kinh nghiệm tu luyện +20%, Thể lực hồi phục nhanh hơn",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Mưu Sĩ Chi Tài",
        description: "Đầu óc nhạy bén, giỏi phân tích tình huống và lập kế hoạch chiến lược.",
        effect: "Ngộ tính +5, Khả năng phán đoán +20%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Ngân Thiệt Chi Tài",
        description: "Khẩu tài xuất chúng, có thể thuyết phục cả kẻ thù trở thành đồng minh.",
        effect: "Giao tiếp +15, Thuyết phục +25%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Dã Ngoại Sinh Tồn",
        description: "Thành thạo kỹ năng sinh tồn hoang dã, biết cách tìm thức ăn nước uống mọi địa hình.",
        effect: "Giảm tiêu hao đói khát 30%, Tìm thảo dược hoang dã +20%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Thiên Sinh Mỹ Nhân",
        description: "Dung mạo xuất chúng, khiến người đối diện mê đắm, dễ dàng thu hút sự chú ý.",
        effect: "Phong thái +10, Hảo cảm +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Linh Hoạt Ứng Biến",
        description: "Phản ứng nhanh nhẹn trước tình huống bất ngờ, luôn tìm được cách thoát thân.",
        effect: "Nhanh nhẹn +5, Né tránh +10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Thiết Phế Công",
        description: "Phổi khỏe mạnh phi thường, có thể nín thở lâu gấp năm lần người thường.",
        effect: "Thể lực tối đa +15%, Kháng độc khí +20%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Thiên Phú Bơi Lội",
        description: "Bơi lội giỏi như cá, có thể lặn sâu và di chuyển nhanh dưới nước.",
        effect: "Tốc độ dưới nước +50%, Nín thở dưới nước gấp 3",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Giỏi Giao Thiệp",
        description: "Có khiếu giao thiệp, dễ dàng kết bạn và xây dựng mối quan hệ ở bất kỳ đâu.",
        effect: "Tốc độ kết giao NPC +30%, Giá mua bán tốt hơn 10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Tay Nghề Nấu Ăn",
        description: "Nấu ăn ngon bẩm sinh, món ăn tự nấu luôn mang hiệu quả buff tốt hơn.",
        effect: "Hiệu quả thức ăn tự nấu +30%, Hồi thể lực +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Nhẫn Nại Tâm",
        description: "Tính tình nhẫn nại, có thể chờ đợi cơ hội hoàn hảo mà không nóng vội.",
        effect: "Hiệu quả mai phục +25%, Tấn công bất ngờ +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Dị Tộc Chi Giao",
        description: "Dễ dàng giao tiếp với các dị tộc và ngoại bang, không bị kỳ thị đến từ đâu.",
        effect: "Hảo cảm dị tộc +25%, Giao dịch ngoại bang +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Thiên Phú Bắn Ná",
        description: "Tay bắn ná chính xác từ khi còn nhỏ, giỏi sử dụng vũ khí viễn chiến nhỏ.",
        effect: "Chính xác viễn công +20%, Sát thương ám khí +10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Tai Thính Mắt Tinh",
        description: "Thính giác và thị giác tốt hơn người thường, dễ phát hiện chi tiết nhỏ.",
        effect: "Phát hiện bẫy +15%, Phạm vi quan sát +20%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Mạnh Mẽ Bẩm Sinh",
        description: "Thể chất tốt hơn đồng trang lứa, khỏe mạnh và dẻo dai hơn đáng kể.",
        effect: "Thể chất +5, Thể lực +10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Khéo Tay Hay Làm",
        description: "Đôi tay khéo léo có thể chế tạo và sửa chữa đồ vật phức tạp.",
        effect: "Chế tạo +20%, Sửa chữa trang bị +25%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Giác Quan Linh Mẫn",
        description: "Tất cả giác quan đều nhạy hơn người, dễ phát hiện nguy hiểm tiềm ẩn.",
        effect: "Phát hiện phục kích +15%, Cảm nhận +8",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Lạc Quan Vô Ưu",
        description: "Tính cách lạc quan vui vẻ, không bao giờ nản chí dù gặp thất bại.",
        effect: "Miễn nhiễm suy sụp tinh thần, Hồi phục tinh thần +20%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Thiên Phú Leo Trèo",
        description: "Giỏi leo trèo bẩm sinh, vách đá dựng đứng cũng dễ dàng chinh phục.",
        effect: "Tốc độ leo núi +50%, Không bị ngã từ trên cao",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Thâm Mưu Viễn Lự",
        description: "Luôn suy nghĩ sâu xa, tính toán trước ba bước so với đối thủ.",
        effect: "Ngộ tính +3, Khả năng phục kích +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Giọng Hát Mê Hồn",
        description: "Giọng hát du dương mê hoặc lòng người, có thể dùng ca khúc thay lời nói.",
        effect: "Giao tiếp +10, Âm công +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Tốt Bụng Hiền Lành",
        description: "Bản tính hiền lành tốt bụng, mọi người đều muốn giúp đỡ và bảo vệ.",
        effect: "Hảo cảm NPC +10%, Tỷ lệ được giúp đỡ +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Phi Ngựa Giỏi",
        description: "Cưỡi ngựa thành thạo, có thể điều khiển ngựa trên mọi địa hình phức tạp.",
        effect: "Tốc độ khi cưỡi ngựa +25%, Không bị ngã ngựa",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Thợ Săn Bẩm Sinh",
        description: "Bản năng săn bắt phát triển mạnh, dễ dàng theo dõi và bẫy con mồi.",
        effect: "Truy tìm mục tiêu +20%, Thu hoạch da thú +25%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Trí Nhớ Tốt",
        description: "Trí nhớ tốt hơn người thường, dễ dàng ghi nhớ đường đi và khuôn mặt.",
        effect: "Tự động ghi nhớ bản đồ, Nhận diện NPC +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Tinh Thần Thép",
        description: "Tinh thần kiên cường, khó bị đánh bại về mặt tâm lý dù bị áp đảo.",
        effect: "Ý chí +8, Kháng sợ hãi +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Tài Chính Giỏi",
        description: "Biết cách quản lý tiền bạc và đầu tư sinh lời, không bao giờ túng thiếu.",
        effect: "Vàng kiếm được +15%, Giá mua hàng giảm 10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Thiên Phú Vẫn Tự",
        description: "Nét chữ đẹp từ khi mới cầm bút, có thể vẽ phù và viết thư pháp chiến đấu.",
        effect: "Thư pháp chiến đấu +20%, Vẽ phù +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Ngoại Giao Tài Ba",
        description: "Khéo léo trong giao tế, biết cách nói chuyện đúng lúc đúng chỗ.",
        effect: "Giao tiếp +8, Đàm phán +20%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Bình Tĩnh Sáng Suốt",
        description: "Luôn giữ được đầu óc tỉnh táo trong tình huống nguy cấp.",
        effect: "Khi bị bao vây: Phán đoán +15%, Né tránh +10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Thuần Hậu Chi Diện",
        description: "Gương mặt thuần hậu dễ gần, khiến người lạ tự động hạ bớt cảnh giác.",
        effect: "Hảo cảm ban đầu +10, Giao dịch mua bán +10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Thiên Phú Trinh Thám",
        description: "Bẩm sinh nhạy bén trong việc tìm kiếm manh mối và phá giải bí ẩn.",
        effect: "Phát hiện manh mối +25%, Phán đoán tình huống +10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Sức Sống Dẻo Dai",
        description: "Thể chất dẻo dai, phục hồi nhanh chóng sau mỗi trận chiến hay chấn thương.",
        effect: "Hồi phục sau chiến đấu +20%, Thể lực tối đa +10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Hài Hước Duyên Dáng",
        description: "Tính cách hài hước duyên dáng, làm cho mọi người xung quanh vui vẻ hơn.",
        effect: "Hảo cảm NPC +10%, Tinh thần đồng đội +10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Giác Ngộ Thiền Định",
        description: "Có khả năng thiền định sâu, tĩnh tâm nhanh chóng để hồi phục nội lực.",
        effect: "Hiệu quả thiền định +25%, Hồi nội lực khi nghỉ +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Thiên Phú Ngụy Trang",
        description: "Giỏi ngụy trang và hóa trang, có thể trà trộn vào bất kỳ đám đông nào.",
        effect: "Ngụy trang +25%, Trà trộn +20%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Bản Năng Phương Hướng",
        description: "Không bao giờ bị lạc đường, luôn biết hướng nào là bắc dù ở nơi lạ.",
        effect: "Miễn nhiễm mê lộ, Tốc độ di chuyển trên bản đồ +15%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Tay Nghề Thêu Dệt",
        description: "Khéo léo trong nghề thêu dệt, có thể tạo ra y phục bảo hộ từ vải thường.",
        effect: "Chế tạo y phục +25%, Phòng ngự nhẹ +10%",
        rank: "Thường",
        cost: 2
    },
    {
        name: "Nhạy Bén Thương Nghiệp",
        description: "Có đầu óc kinh doanh nhạy bén, biết cách mua rẻ bán đắt kiếm lời.",
        effect: "Lợi nhuận giao dịch +20%, Phát hiện vật phẩm giá trị +15%",
        rank: "Thường",
        cost: 2
    },
    // =========================================
    // === BẤT LỢI BẨM SINH (Disadvantages) ===
    // =========================================
    // === BẤT LỢI CỰC HẠN (Extreme - Cost -3) ===
    {
        name: "Thiên Phạt Chi Thể",
        description: "Bị thiên đạo nguyền rủa, mỗi khi đột phá cảnh giới sẽ gánh chịu thiên kiếp gấp bội.",
        effect: "Mỗi lần đột phá có 30% thất bại, Thiên kiếp sát thương x3",
        rank: "Cực Hạn",
        cost: -3,
        conflictsWith: ["Thiên Mệnh Chi Tử", "Tam Hoa Tụ Đỉnh"]
    },
    {
        name: "Phế Kinh Mạch",
        description: "Kinh mạch bẩm sinh bị tắc nghẽn nghiêm trọng, nội lực lưu thông cực kỳ khó khăn.",
        effect: "Tốc độ tu luyện -50%, Nội lực tối đa -30%",
        rank: "Cực Hạn",
        cost: -3,
        conflictsWith: ["Thiên Sinh Kiếm Cốt", "Linh Căn Thuần Khiết", "Long Mạch Thần Thể"]
    },
    {
        name: "Tuyệt Mạch Thể",
        description: "Cơ thể hoàn toàn không có linh căn, không thể cảm nhận linh khí tự nhiên.",
        effect: "Không thể tu luyện công pháp nội công, Chỉ có thể dùng ngoại công",
        rank: "Cực Hạn",
        cost: -3,
        conflictsWith: ["Hỗn Độn Linh Thể", "Vô Cực Linh Căn", "Ngũ Hành Linh Căn"]
    },
    {
        name: "Nghiệp Lực Tiền Kiếp",
        description: "Mang theo nghiệp chướng nặng nề từ kiếp trước, oan hồn theo đuổi không ngừng.",
        effect: "Random bị tấn công bởi oan hồn, Khí vận -20",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Ngũ Độc Thể",
        description: "Cơ thể bẩm sinh tích tụ ngũ độc, máu và thịt đều mang độc tố chết người.",
        effect: "Không thể dùng thuốc hồi phục thông thường, Người thân cận bị nhiễm độc",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Cô Tinh Mệnh",
        description: "Mệnh phạm cô tinh, ai thân thiết đều gặp tai họa, vĩnh viễn cô độc một mình.",
        effect: "Không thể kết bạn/thu phục NPC, Đồng hành tối đa 0",
        rank: "Cực Hạn",
        cost: -3,
        conflictsWith: ["Linh Hồn Vĩnh Cửu"]
    },
    {
        name: "Huyết Chú Phong Ấn",
        description: "Bị phong ấn bằng huyết chú cổ đại, mỗi khi dùng hết sức sẽ bị phản phệ đau đớn.",
        effect: "Sử dụng chiêu thức mạnh nhất sẽ mất 15% HP, Mỗi trận chỉ dùng được 3 lần",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Tà Linh Nhập Thể",
        description: "Cơ thể bị tà linh chiếm cứ một phần, thường xuyên mất kiểm soát bản thân.",
        effect: "30% mỗi lượt bị tà linh kiểm soát hành động, Random tấn công đồng đội",
        rank: "Cực Hạn",
        cost: -3,
        conflictsWith: ["Bất Diệt Thần Hồn"]
    },
    {
        name: "Thiên Kiếp Chi Thân",
        description: "Mỗi khi trời đổ mưa sấm sét, cơ thể tự động thu hút lôi điện về phía mình.",
        effect: "Trong mưa bão: HP giảm liên tục, Dễ bị sét đánh. Kháng lôi -50%",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Vong Hồn Triền Miên",
        description: "Bị hàng trăm linh hồn bám theo, đêm nào cũng bị ác mộng dày vò.",
        effect: "Không hồi phục HP/nội lực khi ngủ, Tinh thần -15",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Hắc Ám Xâm Thực",
        description: "Bóng tối trong tâm hồn dần lan rộng, mỗi lần giết người thì tà khí tăng lên.",
        effect: "Mỗi khi hạ sát NPC: Tà khí +5, Khi tà khí đầy sẽ mất kiểm soát",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Thể Chất Tan Rã",
        description: "Cơ thể đang dần phân hủy từ bên trong, cần liên tục uống thuốc để duy trì.",
        effect: "Mỗi ngày mất 5% HP tối đa nếu không uống thuốc, Chi phí duy trì cao",
        rank: "Cực Hạn",
        cost: -3,
        conflictsWith: ["Bất Tử Chi Thân"]
    },
    {
        name: "Phong Ma Thể",
        description: "Cơ thể dễ bị ma khí xâm nhập, mỗi khi đến nơi âm khí nặng sẽ bị ma nhập.",
        effect: "Tại nơi âm khí: Mọi chỉ số -25%, Dễ bị ma tộc thu phục",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Huyết Tộc Thù Hận",
        description: "Gia tộc mang huyết thù truyền kiếp, mọi thế lực lớn đều muốn tận diệt dòng máu này.",
        effect: "Bị mọi bang phái lớn thù ghét, Danh tiếng ban đầu -30",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Linh Lực Nghịch Chuyển",
        description: "Nội lực chảy ngược trong cơ thể, mỗi lần vận công đều đau đớn và nguy hiểm.",
        effect: "Vận công có 20% gây tự thương, Tẩu hỏa nhập ma +30%",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Tiền Định Tử Vong",
        description: "Số mệnh đã định sẽ chết trẻ, mỗi năm trôi qua sức mạnh giảm dần theo thời gian.",
        effect: "Sau mỗi năm trong game: Mọi chỉ số -3%, Tuổi thọ có hạn",
        rank: "Cực Hạn",
        cost: -3,
        conflictsWith: ["Bất Lão Tiên Thể", "Thiên Địa Đồng Thọ"]
    },
    {
        name: "Cấm Kỵ Chi Danh",
        description: "Cái tên bị xóa khỏi mọi ghi chép, ai nhắc đến đều gặp tai họa, bị cả thiên hạ xa lánh.",
        effect: "Không thể gia nhập bang phái, Mọi NPC ban đầu thù địch",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Thiên Địa Bất Dung",
        description: "Sự tồn tại bị trời đất không chấp nhận, thiên tai liên tục ập đến nơi mình ở.",
        effect: "Khu vực xung quanh xảy ra thiên tai random, Không thể ở yên một chỗ quá lâu",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Bạo Tẩu Nội Lực",
        description: "Nội lực bất ổn, thường xuyên bùng phát không kiểm soát gây thương tích cho chính mình.",
        effect: "Mỗi trận có 25% nội lực bạo tẩu, Mất kiểm soát chiêu thức",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Ma Hóa Chi Thể",
        description: "Cơ thể đang dần biến đổi thành ma tộc, mất dần nhân tính và ký ức.",
        effect: "Mỗi tháng mất random một kỹ năng, Ngoại hình biến dạng dần",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Vô Tình Đạo Tâm",
        description: "Đạo tâm không có cảm xúc, hoàn toàn không thể cảm nhận tình yêu, tình bạn, tình thân.",
        effect: "Không thể kết duyên, Hảo cảm vĩnh viễn trung lập, Ngộ tính +10",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Quỷ Diệt Chi Thể",
        description: "Cơ thể tỏa ra quỷ khí chết người, sinh vật sống trong phạm vi gần đều bị hại.",
        effect: "Thảo dược gần cơ thể tự héo, Đồng đội gần mất 3% HP/lượt",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Tự Hủy Bản Năng",
        description: "Bản năng tự hủy sâu trong tiềm thức, mỗi khi vui vẻ quá mức sẽ tự gây thương tích.",
        effect: "Khi được buff: Tự gây thương 10% HP, Khó hồi phục tinh thần",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Âm Thể Bẩm Sinh",
        description: "Cơ thể mang thuần âm khí, ban ngày sức mạnh giảm mạnh, chỉ mạnh khi đêm tối.",
        effect: "Ban ngày: Mọi chỉ số -30%. Ban đêm: Mọi chỉ số +10%",
        rank: "Cực Hạn",
        cost: -3,
        conflictsWith: ["Cửu Dương Thần Thể"]
    },
    {
        name: "Ký Ức Hỗn Loạn",
        description: "Ký ức bị xáo trộn, thường xuyên quên mất kỹ năng đã học và người đã gặp.",
        effect: "Random quên một chiêu thức đã học mỗi tuần, Mất dữ liệu NPC random",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Huyết Ma Khát Vọng",
        description: "Mang huyết mạch ma tộc, khao khát máu tươi không thể kiềm chế.",
        effect: "Mỗi ngày cần uống máu nếu không mọi chỉ số -20%, Bị NPC sợ hãi",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Thiên Mệnh Bi Kịch",
        description: "Vận mệnh luôn đẩy vào bi kịch, mọi mối quan hệ đều kết thúc trong nước mắt.",
        effect: "Đồng hành random rời bỏ hoặc chết, Khí vận -25",
        rank: "Cực Hạn",
        cost: -3,
        conflictsWith: ["Thiên Mệnh Chi Tử"]
    },
    {
        name: "Phong Dịch Chi Thể",
        description: "Cơ thể mang bệnh phong truyền nhiễm từ thượng cổ, tiếp xúc ai đều truyền bệnh.",
        effect: "NPC gần gũi bị nhiễm bệnh, Bị xã hội xa lánh hoàn toàn",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Bị Mật Phong Ấn",
        description: "Một phong ấn bí mật khóa chặt đại bộ phận sức mạnh, chỉ có thể giải phóng từ từ.",
        effect: "Bắt đầu game chỉ có 30% sức mạnh thật sự, Cần tìm cách giải phong ấn",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Song Sinh Nguyền Rủa",
        description: "Mang nguyền rủa song sinh, mỗi khi mình mạnh lên thì một người khác sẽ yếu đi.",
        effect: "Đồng hành mạnh nhất mất 50% sức mạnh, NPC thù ghét người bạn",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Ma Đạo Huyết Thệ",
        description: "Đã lập huyết thệ với ma đạo, không thể tu luyện chính đạo công pháp.",
        effect: "Chỉ có thể dùng ma đạo/tà đạo công pháp, Chính phái thù ghét",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Thần Trí Phân Liệt",
        description: "Tâm trí bị chia thành nhiều mảnh, mỗi mảnh có nhân cách riêng tranh giành kiểm soát.",
        effect: "Random đổi nhân cách gây hỗn loạn, Không kiểm soát lời nói",
        rank: "Cực Hạn",
        cost: -3,
        conflictsWith: ["Ngọc Cốt Băng Tâm"]
    },
    {
        name: "Nhục Thể Phong Ấn",
        description: "Toàn bộ nhục thể bị phong ấn trong vỏ bọc đá, chỉ có thể dùng tinh thần chiến đấu.",
        effect: "Không thể dùng võ công thể xác, Chỉ dùng được tinh thần lực",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Hấp Tinh Nghịch Duyên",
        description: "Cơ thể vô tình hấp thụ nội lực của người khác khi tiếp xúc, khiến mọi người xa lánh.",
        effect: "Tiếp xúc gần hút 5% nội lực người khác, NPC tránh xa",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Thiên Cổ Lời Nguyền",
        description: "Mang lời nguyền từ thượng cổ, mỗi đêm trăng tròn sẽ biến thành dạng quái thú.",
        effect: "Đêm trăng tròn: Biến thân mất kiểm soát, Sức mạnh x2 nhưng không phân biệt địch ta",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Vận Mệnh Nô Lệ",
        description: "Bị ràng buộc bằng khế ước nô lệ cổ đại, phải tuân lệnh một thế lực bí ẩn.",
        effect: "Random nhận nhiệm vụ bắt buộc, Từ chối sẽ bị trừng phạt nặng",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Phản Thiên Thể Chất",
        description: "Cơ thể phản ứng ngược với mọi loại dược liệu, thuốc bổ thành thuốc độc.",
        effect: "Thuốc hồi phục gây sát thương, Thuốc độc lại hồi phục HP",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Thiên Sinh Dẫn Họa",
        description: "Vô tình đến đâu gây họa đến đó, mọi tai nạn bất ngờ đều xảy ra xung quanh.",
        effect: "Tỷ lệ tai nạn xung quanh +50%, NPC gần bên gặp xui xẻo liên tục",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Cửu U Minh Hỏa",
        description: "Cơ thể chứa ngọn lửa u minh, mỗi khi nóng giận sẽ tự bốc cháy thiêu đốt mọi thứ.",
        effect: "Khi phẫn nộ: Tự gây sát thương hỏa 10%/lượt, Vật phẩm trên người bị cháy",
        rank: "Cực Hạn",
        cost: -3
    },
    {
        name: "Thất Tình Tuyệt Mạch",
        description: "Bảy mạch tình cảm bị cắt đứt, không thể cảm nhận niềm vui, khiến tinh thần luôn u uất.",
        effect: "Tinh thần vĩnh viễn ở mức thấp, Không nhận buff tinh thần",
        rank: "Cực Hạn",
        cost: -3
    },
    // === BẤT LỢI KHẮC NGHIỆT (Harsh - Cost -2) ===
    {
        name: "Bệnh Nhược Thể",
        description: "Cơ thể yếu ớt bẩm sinh, dễ nhiễm bệnh, không chịu được va đập mạnh.",
        effect: "Thể chất -8, HP tối đa -20%",
        rank: "Khắc nghiệt",
        cost: -2,
        conflictsWith: ["Long Hổ Kim Thân", "Thiết Bố Sam", "Bất Hoại Kim Thân"]
    },
    {
        name: "Huyết Hư Chứng",
        description: "Máu bẩm sinh yếu ớt, vết thương khó lành, mất máu nhiều dễ ngất xỉu.",
        effect: "Hồi phục HP -40%, Khi HP dưới 30% bị choáng",
        rank: "Khắc nghiệt",
        cost: -2,
        conflictsWith: ["Bất Tử Chi Thân", "Phượng Hoàng Niết Bàn Huyết"]
    },
    {
        name: "Cực Âm Hàn Thể",
        description: "Cơ thể mang hàn khí cực đoan, nội tạng thường xuyên bị đông lạnh gây đau đớn.",
        effect: "Mỗi ngày mất HP, Kháng hỏa -50%, Dương tính công pháp không thể",
        rank: "Khắc nghiệt",
        cost: -2,
        conflictsWith: ["Cửu Dương Thần Thể"]
    },
    {
        name: "Lục Dục Tâm Ma",
        description: "Tâm ma ẩn sâu trong tiềm thức, mỗi khi xúc động mạnh sẽ mất kiểm soát hành vi.",
        effect: "Random mất kiểm soát trong chiến đấu, Tâm tính -10",
        rank: "Khắc nghiệt",
        cost: -2,
        conflictsWith: ["Bất Diệt Thần Hồn"]
    },
    {
        name: "Mù Bẩm Sinh",
        description: "Sinh ra đã không có thị lực, phải dựa vào thính giác và xúc giác để cảm nhận.",
        effect: "Không có thị giác, Thính giác +200%, Cảm nhận khí +100%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Truy Sát Lệnh",
        description: "Bị một thế lực hùng mạnh truy sát không ngừng, phải liên tục chạy trốn ẩn náu.",
        effect: "Random bị thích khách tập kích, Không thể ở lâu một nơi",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Phản Cốt Tẩy Tủy",
        description: "Xương cốt bị biến đổi đau đớn, mỗi khi vận công đều như bị thiêu đốt.",
        effect: "Vận công gây tự sát thương 5%, Sức mạnh vật lý +20%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Điếc Bẩm Sinh",
        description: "Sinh ra đã không có thính giác, hoàn toàn dựa vào thị giác và xúc giác.",
        effect: "Không nghe được âm thanh, Miễn nhiễm âm công, Thị giác +100%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Kinh Sợ Đám Đông",
        description: "Hoảng loạn khi ở giữa đám đông, không thể chiến đấu ở nơi đông người.",
        effect: "Trong thành thị/đám đông: Mọi chỉ số -20%, Tốc độ phản ứng -25%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Mãn Tính Đau Đớn",
        description: "Cơ thể đau nhức mãn tính không rõ nguyên nhân, mỗi bước đi đều là chịu đựng.",
        effect: "Tốc độ di chuyển -20%, Tập trung -15%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Dị Hình Chi Thể",
        description: "Ngoại hình bị dị tật bẩm sinh, khiến mọi người sợ hãi và xa lánh.",
        effect: "Phong thái -15, Hảo cảm NPC ban đầu -20%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Kém Chịu Lạnh",
        description: "Cơ thể cực kỳ nhạy cảm với cái lạnh, dễ đông cứng trong thời tiết giá rét.",
        effect: "Trong vùng lạnh: HP giảm dần, Tốc độ -30%",
        rank: "Khắc nghiệt",
        cost: -2,
        conflictsWith: ["Huyền Băng Ngọc Cốt"]
    },
    {
        name: "Kém Chịu Nóng",
        description: "Cơ thể không chịu được nhiệt độ cao, dễ kiệt sức dưới trời nắng.",
        effect: "Trong vùng nóng: Thể lực giảm gấp đôi, Sức mạnh -15%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Tật Nguyền Chân Trái",
        description: "Chân trái bị tật bẩm sinh, đi lại khập khiễng nhưng đã quen chịu đựng.",
        effect: "Tốc độ di chuyển -25%, Khinh công không thể",
        rank: "Khắc nghiệt",
        cost: -2,
        conflictsWith: ["Khinh Công Tuyệt Thế"]
    },
    {
        name: "Yếu Nội Lực",
        description: "Đan điền bẩm sinh nhỏ hẹp, dự trữ nội lực ít ỏi so với đồng trang lứa.",
        effect: "Nội lực tối đa -30%, Chiêu thức mạnh không đủ lực thi triển",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Huyết Ám Sợ Ánh Sáng",
        description: "Đôi mắt nhạy cảm cực độ với ánh sáng mạnh, ban ngày gần như mù lòa.",
        effect: "Ban ngày: Chính xác -30%, Tầm nhìn -50%. Ban đêm: Bình thường",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Dễ Bị Dụ Dỗ",
        description: "Tâm trí yếu đuối, dễ bị lời lẽ mỹ miều lừa gạt và dẫn vào bẫy.",
        effect: "Ý chí -10, Kháng mê hoặc -40%",
        rank: "Khắc nghiệt",
        cost: -2,
        conflictsWith: ["Thạch Tâm Thiết Ý"]
    },
    {
        name: "Thể Chất Dị Ứng",
        description: "Dị ứng với rất nhiều thứ, từ hoa cỏ đến kim loại, luôn ngứa ngáy khó chịu.",
        effect: "Trong rừng/vườn: Mọi chỉ số -10%, Không thể đeo trang bị kim loại nặng",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Âm Thanh Khàn Đặc",
        description: "Giọng nói bẩm sinh khàn đặc và khó nghe, giao tiếp như tra tấn tai người khác.",
        effect: "Giao tiếp -12, Không thể dùng âm công",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Chậm Chạp Phản Xạ",
        description: "Phản xạ chậm hơn người thường đáng kể, luôn bị chậm một nhịp trong chiến đấu.",
        effect: "Tốc độ phản ứng -25%, Luôn ra đòn sau đối thủ",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Vô Duyên Với Linh Thú",
        description: "Mọi linh thú đều sợ hãi và tránh xa, không thể thuần phục hay cưỡi bất kỳ con nào.",
        effect: "Thuần phục linh thú -80%, Ngựa và linh thú từ chối chở",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Nợ Máu Đồ Sát",
        description: "Từng vô tình gây ra thảm sát trong quá khứ, bị thân nhân nạn nhân truy lùng.",
        effect: "Random bị NPC phục thù, Danh tiếng -20",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Thể Chất Phì Đại",
        description: "Cơ thể to lớn cồng kềnh, di chuyển khó khăn nhưng bù lại sức mạnh thô bạo.",
        effect: "Tốc độ di chuyển -20%, Né tránh -15%, Sức mạnh +10%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Tẩu Hỏa Thường Xuyên",
        description: "Kinh mạch không ổn định, dễ bị tẩu hỏa nhập ma khi tu luyện cường đạo.",
        effect: "Tỷ lệ tẩu hỏa nhập ma +30%, Tu luyện cường độ cao nguy hiểm",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Mất Giọng Bẩm Sinh",
        description: "Câm bẩm sinh, chỉ có thể giao tiếp bằng ngôn ngữ ký hiệu và viết chữ.",
        effect: "Không thể nói chuyện, Giao tiếp -15, Không thể dùng âm công",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Giấc Ngủ Bất Ổn",
        description: "Không thể ngủ sâu, luôn tỉnh giấc giữa đêm, tinh thần kiệt quệ.",
        effect: "Hồi phục khi nghỉ -40%, Tinh thần sau nghỉ chỉ hồi 50%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Ám Ảnh Quá Khứ",
        description: "Bị ám ảnh bởi một sự kiện đau thương trong quá khứ, thường xuyên mất tập trung.",
        effect: "Random mất tập trung trong chiến đấu, Ngộ tính -5",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Thiên Phú Nghèo Hèn",
        description: "Vận mệnh gắn liền với nghèo khổ, tiền bạc luôn tuột khỏi tay.",
        effect: "Vàng kiếm được -30%, Vàng ban đầu -50%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Sức Mạnh Nguyền Rủa",
        description: "Sức mạnh đến từ nguyền rủa, mỗi lần sử dụng đều rút bớt tuổi thọ.",
        effect: "Sức mạnh +10% nhưng mỗi trận chiến giảm tuổi thọ",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Mùa Đông Tuyệt Vọng",
        description: "Trong mùa đông thể chất suy kiệt trầm trọng, như sắp chết đi từng ngày.",
        effect: "Mùa đông: Mọi chỉ số -20%, HP giảm dần",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Tàn Tật Tay Phải",
        description: "Tay phải bị tàn tật bẩm sinh, không thể cầm vũ khí nặng bên tay thuận.",
        effect: "Sát thương vũ khí -20%, Chỉ dùng được vũ khí nhẹ tay trái",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Bị Đầu Độc Mãn Tính",
        description: "Đã bị đầu độc từ nhỏ, chất độc tích tụ trong cơ thể không thể giải hoàn toàn.",
        effect: "HP tối đa -10%, Mỗi tháng cần uống thuốc giải đặc biệt",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Cô Nhi Vô Gia Cư",
        description: "Không có gia đình, không có nhà cửa, lang thang vô định từ khi lọt lòng.",
        effect: "Không có nơi nghỉ ngơi cố định, Hồi phục ngoài trời -20%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Ngũ Quan Lộn Xộn",
        description: "Năm giác quan bị đảo lộn, đôi khi nghe thấy màu sắc, nhìn thấy âm thanh.",
        effect: "Random mất phương hướng, Phản ứng chậm 15%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Kị Thủy",
        description: "Sợ nước bẩm sinh, hoảng loạn khi gần sông hồ, không thể bơi lội.",
        effect: "Không thể bơi, Gần nước sâu: Mọi chỉ số -25%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Thiên Tính Ngạo Mạn",
        description: "Tính cách ngạo mạn bẩm sinh không thể kiềm chế, hay coi thường đối thủ.",
        effect: "Hảo cảm NPC -15%, Hay bị khiêu khích thành công",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Hao Mòn Thể Lực",
        description: "Thể lực tiêu hao nhanh gấp đôi người thường, dễ kiệt sức trong trận đấu dài.",
        effect: "Thể lực giảm gấp đôi, Trận đánh dài: Sức mạnh -5%/lượt",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Yếu Đuối Tinh Thần",
        description: "Tinh thần mong manh dễ vỡ, mỗi lần thất bại đều gây suy sụp nặng nề.",
        effect: "Khi thua trận: Mọi chỉ số -15% trong 3 ngày, Dễ bị thao túng",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Bệnh Tim Bẩm Sinh",
        description: "Tim bẩm sinh yếu, vận động mạnh dễ lên cơn đau tim nguy hiểm tính mạng.",
        effect: "Chiến đấu kéo dài: 10% lên cơn đau tim mỗi lượt sau lượt 5, Thể lực -15%",
        rank: "Khắc nghiệt",
        cost: -2
    },
    {
        name: "Dung Mạo Xấu Xí",
        description: "Ngoại hình xấu xí khiến người gặp đều ác cảm, khó kết giao tình cảm.",
        effect: "Phong thái -10, Hảo cảm ban đầu -10%, Không thể quyến rũ",
        rank: "Khắc nghiệt",
        cost: -2
    },
    // === BẤT LỢI KHÓ (Mild - Cost -1) ===
    {
        name: "Khẩu Tật",
        description: "Nói lắp bẩm sinh, giao tiếp khó khăn, thường bị hiểu lầm ý nghĩa lời nói.",
        effect: "Giao tiếp -10, Thuyết phục -20%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Sợ Độ Cao",
        description: "Hoảng loạn mỗi khi ở trên cao, không thể chiến đấu trên vách núi hay nóc nhà.",
        effect: "Trên cao: Tất cả chỉ số -20%, Không thể dùng khinh công lên cao",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Tham Ăn",
        description: "Ăn rất nhiều, dạ dày như hố không đáy, tiêu hao lương thực gấp đôi người thường.",
        effect: "Tiêu hao lương thực x2, Đói nhanh gấp đôi",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Nghiện Rượu",
        description: "Không thể sống thiếu rượu, mỗi ngày phải uống nếu không giảm sức chiến đấu.",
        effect: "Không có rượu: Sức mạnh -5, Tốc độ -10%. Có rượu: Bình thường",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Mộng Du",
        description: "Thường xuyên mộng du ban đêm, vô thức đi lang thang có thể gặp nguy hiểm.",
        effect: "Ban đêm random di chuyển, Có thể bị phát hiện khi ẩn náu",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Kỵ Huyết",
        description: "Sợ máu, nhìn thấy máu là choáng váng buồn nôn, khó khăn trong chiến đấu.",
        effect: "Khi thấy máu: Toàn bộ chỉ số -10% trong 3 lượt",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Thất Tình Lục Dục",
        description: "Dễ bị ảnh hưởng bởi tình cảm, mỗi khi gặp mỹ nhân/mỹ nam thì mất tập trung.",
        effect: "Đối diện đối phương hấp dẫn: Tốc độ phản ứng -15%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Hoài Nghi Tâm",
        description: "Luôn nghi ngờ mọi người xung quanh, khó kết giao bạn bè, không tin tưởng ai.",
        effect: "Hảo cảm NPC -10%, Không thể kết nghĩa kim lan",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Lười Biếng Bẩm Sinh",
        description: "Bản tính lười nhác, không muốn tập luyện, chỉ muốn nằm ngủ cả ngày.",
        effect: "Kinh nghiệm tu luyện -15%, Thể lực hồi phục chậm hơn",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Hay Quên",
        description: "Trí nhớ kém, thường quên mất lời hứa, đường đi và tên người đã gặp.",
        effect: "Không tự nhớ bản đồ, Giao tiếp với NPC đã gặp bị trừ điểm",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Nhát Gan",
        description: "Tính tình nhút nhát, dễ bị dọa nạt và hoảng sợ trước đối thủ mạnh.",
        effect: "Đối mặt kẻ mạnh: Sức mạnh -10%, Dễ bị khiêu khích",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Nói Nhiều",
        description: "Không thể giữ bí mật, luôn buột miệng nói ra những điều không nên nói.",
        effect: "Random tiết lộ thông tin cho NPC, Ẩn thân -15%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Dị Ứng Phấn Hoa",
        description: "Dị ứng nặng với phấn hoa, mỗi mùa xuân đều hắt hơi liên tục không ngừng.",
        effect: "Mùa xuân: Chính xác -15%, Ẩn thân -20%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Ám Ảnh Sạch Sẽ",
        description: "Không chịu được bẩn thỉu, luôn phải tắm rửa và giặt đồ ngay khi dính bẩn.",
        effect: "Trong hầm mỏ/đầm lầy: Tinh thần giảm nhanh, Chiến đấu -10%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Ham Chơi",
        description: "Tính tình ham chơi, dễ bị lôi cuốn bởi trò vui mà bỏ bê tu luyện.",
        effect: "Kinh nghiệm tu luyện -10%, Dễ bị dẫn dụ vào bẫy",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Thẳng Tính",
        description: "Tính cách thẳng như ruột ngựa, nói thật mọi lúc mọi nơi dù có xúc phạm.",
        effect: "Giao tiếp -5, Đàm phán -15%, Hảo cảm NPC -5%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Sợ Bóng Tối",
        description: "Hoảng sợ khi ở nơi tối tăm, không thể hoạt động bình thường vào ban đêm.",
        effect: "Ban đêm không có đuốc: Mọi chỉ số -15%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Cận Thị",
        description: "Mắt kém nhìn xa, mục tiêu ở khoảng cách xa bị mờ nhạt khó phân biệt.",
        effect: "Tầm nhìn -30%, Chính xác viễn công -20%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Mồ Hôi Tay",
        description: "Bàn tay luôn đổ mồ hôi, cầm vũ khí hay trèo leo đều dễ tuột tay.",
        effect: "Có 10% tuột vũ khí mỗi trận, Leo trèo -20%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Nhạy Cảm Mùi",
        description: "Khứu giác quá nhạy, mùi hôi thối khiến buồn nôn và mất sức chiến đấu.",
        effect: "Gần xác chết/đầm lầy: Mọi chỉ số -10%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Hay Cãi Lộn",
        description: "Tính cách hay tranh cãi, thường gây gổ với NPC và đồng đội vì chuyện nhỏ.",
        effect: "Hảo cảm NPC -5% mỗi lần tương tác, Dễ kích động",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Thích Sưu Tầm",
        description: "Ám ảnh với việc sưu tầm vật phẩm, không nỡ bỏ bất kỳ đồ vật nào.",
        effect: "Trọng tải -20% vì mang theo quá nhiều đồ, Bán vật phẩm trừ tinh thần",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Sợ Côn Trùng",
        description: "Hét lên mỗi khi gặp côn trùng, hoàn toàn mất bình tĩnh trước bọ cánh.",
        effect: "Gặp côn trùng: Né tránh -20%, Dễ bị hoảng loạn",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Ngủ Nướng",
        description: "Khó thức dậy vào buổi sáng, luôn ngủ quên lỡ việc và chậm trễ.",
        effect: "Buổi sáng: Tốc độ phản ứng -10%, Dễ bị tấn công bất ngờ lúc sáng sớm",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Kén Ăn",
        description: "Ăn uống kén chọn, nhiều loại lương thực không chịu ăn dù đang đói.",
        effect: "Chỉ hồi phục 50% từ lương thực phẩm cấp thấp, Tinh thần giảm nếu ăn dở",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Dễ Say Nắng",
        description: "Thường xuyên say nắng dưới trời nóng, cần nghỉ ngơi nhiều hơn người khác.",
        effect: "Trong sa mạc/vùng nóng: Thể lực giảm 20% nhanh hơn",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Nóng Tính",
        description: "Tính tình nóng nảy hay la hét, dễ bị khiêu khích mà mất bình tĩnh.",
        effect: "Dễ bị khiêu khích, Khi phẫn nộ: Phán đoán -15%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Đau Lưng Mãn Tính",
        description: "Lưng yếu từ nhỏ, mang vác nặng dễ đau nhức, ảnh hưởng chiến đấu.",
        effect: "Trọng tải -15%, Chiêu thức lực nặng -10%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Sợ Lửa",
        description: "Sợ hãi khi đối diện với lửa lớn, không thể chiến đấu gần ngọn lửa.",
        effect: "Gần lửa: Mọi chỉ số -15%, Kháng hỏa -20%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Thiếu Kiên Nhẫn",
        description: "Không thể chờ đợi lâu, dễ nản khi tu luyện hoặc mai phục kéo dài.",
        effect: "Tu luyện liên tục bị giảm hiệu quả, Mai phục -15%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Khó Ngủ",
        description: "Thường xuyên mất ngủ, nằm xuống là trằn trọc hàng giờ mới chợp mắt.",
        effect: "Hồi phục khi nghỉ -15%, Tinh thần sáng hôm sau -5%",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Mê Tín",
        description: "Tin vào điềm báo và kiêng kỵ, từ chối hành động vào ngày xấu.",
        effect: "Random từ chối nhiệm vụ vào ngày xấu, Khí vận -3",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Háo Thắng",
        description: "Tính cách không chịu thua ai, luôn nhận lời thách đấu dù biết mình yếu hơn.",
        effect: "Không thể từ chối thách đấu, Dễ rơi vào bẫy thách đấu",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Yếu Bụng",
        description: "Dạ dày yếu, ăn đồ sống hoặc lạ dễ bị đau bụng kéo dài.",
        effect: "Ăn đồ sống: 30% bị đau bụng giảm mọi chỉ số 10% trong nửa ngày",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Tự Ái Cao",
        description: "Lòng tự ái rất cao, bị chê bai là tức giận bỏ đi, khó hợp tác.",
        effect: "Khi bị chỉ trích: Hảo cảm NPC đó -10, Dễ bỏ nhóm",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Đãng Trí",
        description: "Thường xuyên quên mang theo vật phẩm quan trọng khi ra ngoài.",
        effect: "Random quên mang theo 1 vật phẩm khi xuất phát",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Nhạy Cảm Tiếng Ồn",
        description: "Tai nhạy cảm quá mức với tiếng ồn lớn, pháo nổ hay tiếng la hét gây đau tai.",
        effect: "Gần tiếng ồn lớn: Chính xác -15%, Dễ bị choáng bởi âm công",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Say Tàu Xe",
        description: "Ngồi xe ngựa hay đi thuyền đều bị say, buồn nôn và chóng mặt.",
        effect: "Di chuyển bằng phương tiện: Mọi chỉ số -10%, Thể lực giảm nhanh",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Dễ Bị Cảm Cúm",
        description: "Hệ miễn dịch hơi yếu, dễ bị cảm lạnh khi thời tiết thay đổi.",
        effect: "Khi đổi vùng khí hậu: 25% bị cảm, giảm thể chất -5% trong 2 ngày",
        rank: "Khó",
        cost: -1
    },
    {
        name: "Thích Phô Trương",
        description: "Hay khoe khoang thành tích, thu hút sự chú ý không cần thiết.",
        effect: "Ẩn thân -10%, Dễ bị kẻ thù nhận diện và nhắm mục tiêu",
        rank: "Khó",
        cost: -1
    }
];

export const PresetBackground: Background[] = [
    // === HUYẾT HẢI (Biome 1) ===
    {
        name: "Huyết Ngạn Ngư Phu",
        description: "Sinh trưởng bên bờ Huyết Hải, hàng ngày đánh bắt những loài cá mang ma tính.",
        effect: "Kháng ma tính +15, Thể chất +5, Vàng +500",
        rank: "Dễ",
        origin: "huyet_hai"
    },
    {
        name: "Ma Sát Cung Tạp Dịch",
        description: "Làm việc nặng nhọc tại Ma Sát Cung, bị ảnh hưởng bởi sát khí quanh năm.",
        effect: "Sát khí tiềm ẩn +10, Sức mạnh +8, Danh tiếng -5",
        rank: "Bình thường",
        origin: "huyet_hai"
    },
    {
        name: "Huyết Liên Tu Sĩ",
        description: "Tu sĩ tu luyện tại Huyết Liên Tự, mang dòng máu tinh khiết nhưng đầy bạo liệt.",
        effect: "Nội lực lôi hệ +20, Tốc độ hồi phục +10%",
        rank: "Khó",
        origin: "huyet_hai"
    },
    {
        name: "Oán Hồn Đảo Tầm Bảo Giả",
        description: "Kẻ liều mạng tìm kiếm di vật trên hòn đảo đầy rẫy oán hồn.",
        effect: "May mắn +15, Ý chí +12, Vàng +2000",
        rank: "Khó",
        origin: "huyet_hai"
    },
    {
        name: "Minh Hà Phủ Thiếu Chủ",
        description: "Người thừa kế của một gia tộc nhỏ tại Minh Hà Phủ, gánh vác phục hưng gia đạo.",
        effect: "Danh tiếng +20, Vàng +5000, Khí vận +5",
        rank: "Cực khó",
        origin: "huyet_hai"
    },
    {
        name: "Huyết Hải Ma Nhân",
        description: "Kẻ bị rơi xuống biển máu và sống sót, cơ thể đã hoàn toàn biến đổi.",
        effect: "Huyết khí +50, Kháng độc +30, Nhân cách tà ác +15",
        rank: "Cực khó",
        origin: "huyet_hai"
    },
    // === CỐT LÂM (Biome 2) ===
    {
        name: "Bạch Cốt Động Dược Đồng",
        description: "Tiểu hài tử chuyên hái nấm linh hồn trong hang động xương trắng.",
        effect: "Hiểu biết dược lý +15, Linh hoạt +10",
        rank: "Dễ",
        origin: "cot_lam"
    },
    {
        name: "Linh Vong Trấn Thương Nhân",
        description: "Giao dịch các vật phẩm minh giới tại thị trấn biên thùy Cốt Lâm.",
        effect: "Giao tiếp +20, Vàng +3000, Khéo léo +5",
        rank: "Bình thường",
        origin: "cot_lam"
    },
    {
        name: "U Linh Thụ Thủ Hộ Giả",
        description: "Nguyện cả đời bảo vệ cây u linh cổ thụ, giao tiếp với các linh hồn.",
        effect: "Tâm pháp u linh, Sức mạnh tinh thần +25",
        rank: "Khó",
        origin: "cot_lam"
    },
    {
        name: "Khô Lâu Mộ Tặc",
        description: "Chuyên đột nhập các ngôi mộ xương cổ đại để tìm bí kíp thất truyền.",
        effect: "Phá bẫy +25, Nhanh nhẹn +15, Sát khí +5",
        rank: "Khó",
        origin: "cot_lam"
    },
    {
        name: "Âm Ti Điện Đệ Tử",
        description: "Đệ tử chính quy của Âm Ti Điện, học cách điều khiển tử khí.",
        effect: "Nội lực âm hệ +30, Kháng tử khí +40",
        rank: "Cực khó",
        origin: "cot_lam"
    },
    {
        name: "Bạch Cốt Thành Quý Tộc",
        description: "Sinh ra trong nhung lụa... nhưng toàn là xương trắng tại kinh đô Cốt Lâm.",
        effect: "Quyền lực +30, Vàng +10000, Căn cốt +10",
        rank: "Cực khó",
        origin: "cot_lam"
    },
    // === U MINH VỰC (Biome 3) ===
    {
        name: "Vực Thẳm Lang Thang Giả",
        description: "Kẻ sinh sống dưới đáy vực thẳm vô tận, quen với bóng tối mịt mù.",
        effect: "Tầm nhìn đêm +50, Thể chất +10",
        rank: "Dễ",
        origin: "u_minh_vuc"
    },
    {
        name: "U Minh Thôn Thợ Rèn",
        description: "Rèn đúc vũ khí bằng hắc thiết lấy từ lòng đất thẳm sâu.",
        effect: "Kỹ năng rèn +20, Sức mạnh +15",
        rank: "Bình thường",
        origin: "u_minh_vuc"
    },
    {
        name: "Ma Quang Cung Thị Vệ",
        description: "Lính gác tại cung điện ma quang, mang theo hào quang u tối.",
        effect: "Phòng ngự +20, Ý chí +10, Danh tiếng +5",
        rank: "Khó",
        origin: "u_minh_vuc"
    },
    {
        name: "Vạn Quỷ Đường Chấp Sự",
        description: "Quản lý việc thờ cúng và trấn áp hàng vạn linh hồn gào thét.",
        effect: "Trấn áp quỷ hồn +30, Sát thương tâm linh +15",
        rank: "Khó",
        origin: "u_minh_vuc"
    },
    {
        name: "Vĩnh Dạ Thành Sát Thủ",
        description: "Sát thủ bóng đêm xuất thân từ thành phố không bao giờ có ánh mặt trời.",
        effect: "Ẩn mình +40, Sát thương chí mạng +25%",
        rank: "Cực khó",
        origin: "u_minh_vuc"
    },
    {
        name: "U Minh Vực Chi Chủ",
        description: "Hậu duệ cuối cùng của vương triều sụp đổ dưới vực sâu.",
        effect: "Khí vận đế vương +15, Toàn thuộc tính +5, Vàng +8000",
        rank: "Cực khó",
        origin: "u_minh_vuc"
    },
    // === PHẦN THIÊN SA MẠC (Biome 4) ===
    {
        name: "Xích Viêm Trấn Nông Phu",
        description: "Trồng trọt những loại cây chịu nhiệt trên cát nóng.",
        effect: "Kháng hỏa +20, Bền bỉ +15",
        rank: "Dễ",
        origin: "phan_thien_sa_mac"
    },
    {
        name: "Hỏa Long Động Tầm Đạo Giả",
        description: "Kẻ vào hang rồng hỏa để cảm nhận đạo lý của lửa.",
        effect: "Ngộ tính hỏa hệ +30, Nội lực +10",
        rank: "Bình thường",
        origin: "phan_thien_sa_mac"
    },
    {
        name: "Phần Tâm Cốc Đao Khách",
        description: "Luyện đao pháp tại nơi thiền định nóng bỏng nhất sa mạc.",
        effect: "Sát thương đao +25, Ý chí chiến đấu +20",
        rank: "Khó",
        origin: "phan_thien_sa_mac"
    },
    {
        name: "Sa Quy Thành Thương Nhân",
        description: "Dẫn đầu đoàn lạc đà xuyên qua bão cát sa mạc đỏ.",
        effect: "Định vị +30, Giao tiếp +25, Vàng +4000",
        rank: "Khó",
        origin: "phan_thien_sa_mac"
    },
    {
        name: "Ma Diệm Tông Trưởng Lão Hậu Nhân",
        description: "Được thừa hưởng ngọn lửa ma diệm từ huyết thống.",
        effect: "Ma Diệm chân hỏa +50, Sức mạnh +20",
        rank: "Cực khó",
        origin: "phan_thien_sa_mac"
    },
    {
        name: "Thần Sa Công Chúa",
        description: "Tiểu thư của vương quốc cát cổ đại đã biến mất.",
        effect: "Khí vận +20, Vàng +12000, Quyến rũ +15",
        rank: "Cực khó",
        origin: "phan_thien_sa_mac"
    },
    // === LÔI PHẠT NGUYÊN (Biome 5) ===
    {
        name: "Cuồng Phong Thôn Mục Đồng",
        description: "Chăn thả gia súc trên thảo nguyên đầy bão tố sấm sét.",
        effect: "Kháng lôi +15, Nhanh nhẹn +10",
        rank: "Dễ",
        origin: "loi_phat_nguyen"
    },
    {
        name: "Lôi Đình Trấn Thợ Thủ Công",
        description: "Chế tạo các vật dụng dẫn điện bằng kim loại đặc biệt.",
        effect: "Kỹ nghệ +20, Khéo léo +15",
        rank: "Bình thường",
        origin: "loi_phat_nguyen"
    },
    {
        name: "Thiên Lôi Đỉnh Khổ Tu",
        description: "Ngồi dưới cột thu lôi để rèn luyện thân thể qua sấm sét.",
        effect: "Căn cốt +25, Kháng lôi +40",
        rank: "Khó",
        origin: "loi_phat_nguyen"
    },
    {
        name: "Kim Xà Điện Vệ Binh",
        description: "Bảo vệ ngôi đền thờ phụng tia sét vàng rực rỡ.",
        effect: "Tốc độ tấn công +20%, Phản xạ +15",
        rank: "Khó",
        origin: "loi_phat_nguyen"
    },
    {
        name: "Điện Quang Tông Thiên Kiêu",
        description: "Tài năng xuất chúng của tông môn tốc độ nhất vùng thảo nguyên.",
        effect: "Thần thông lôi điện +40, Nhanh nhẹn +25",
        rank: "Cực khó",
        origin: "loi_phat_nguyen"
    },
    {
        name: "Lôi Đế Hậu Duệ",
        description: "Mang dòng máu của vị vua sấm sét cổ đại cai trị thảo nguyên.",
        effect: "Lôi hệ uy áp +50, Toàn thuộc tính +10, Vàng +6000",
        rank: "Cực khó",
        origin: "loi_phat_nguyen"
    },
    // === ĐỘC CHƯỞNG TRẠCH (Biome 6) ===
    {
        name: "Độc Vụ Thôn Ngư Phu",
        description: "Đánh bắt cá trong làn sương độc dày đặc quanh năm.",
        effect: "Kháng độc +15, Ý chí +10",
        rank: "Dễ",
        origin: "doc_chuong_trach"
    },
    {
        name: "Hủ Thực Di Tích Tầm Bảo Giả",
        description: "Kẻ mạo hiểm mạng sống trong những đống đổ nát mục nát.",
        effect: "Lục soát +20, May mắn +10, Vàng +2000",
        rank: "Bình thường",
        origin: "doc_chuong_trach"
    },
    {
        name: "Vạn Độc Cốc Dược Công",
        description: "Người luyện chế thuốc độc bậc thấp tại thung lũng chết chóc.",
        effect: "Hòa độc +25, Hiểu biết dược lý +15",
        rank: "Khó",
        origin: "doc_chuong_trach"
    },
    {
        name: "Long Độc Động Thám Hiểm Gia",
        description: "Người đã sống sót trở về sau khi hít phải hơi thở độc của rồng.",
        effect: "Hơi thở độc +30, Thể chất xà nhân +20",
        rank: "Khó",
        origin: "doc_chuong_trach"
    },
    {
        name: "Tà Độc Điện Tư Tế",
        description: "Người phụng sự đền thờ những vị thần độc xưa cũ.",
        effect: "Phép thuật độc hệ +40, Sát khí +20",
        rank: "Cực khó",
        origin: "doc_chuong_trach"
    },
    {
        name: "Độc Long Thành Chủ Chi Tử",
        description: "Con trai của vị lãnh chúa thành phố rồng độc hung hiểm.",
        effect: "Danh tiếng +30, Vàng +15000, Kháng độc tuyệt đối +50",
        rank: "Cực khó",
        origin: "doc_chuong_trach"
    },
    // === VẠN TINH CỐC (Biome 7) ===
    {
        name: "Thanh Phong Trấn Mục Đồng",
        description: "Hậu duệ của những người chăn gia súc nơi thung lũng lộng gió.",
        effect: "Thể lực +15, Nhanh nhẹn +10",
        rank: "Dễ",
        origin: "van_tinh_coc"
    },
    {
        name: "Linh Thảo Viên Dược Đồng",
        description: "Chăm sóc các loại thảo dược quý hiếm dưới ánh sao.",
        effect: "Kiến thức thảo dược +25, Khéo léo +10",
        rank: "Bình thường",
        origin: "van_tinh_coc"
    },
    {
        name: "Tinh Thần Đình Chiêm Tinh Giả",
        description: "Quan sát các vì sao để dự đoán vận mệnh thế gian.",
        effect: "Trí tuệ +25, Dự đoán +15, Khí vận +5",
        rank: "Khó",
        origin: "van_tinh_coc"
    },
    {
        name: "Vạn Dược Môn Đệ Tử",
        description: "Đệ tử chính tông của phái chuyên luyện đan cứu người.",
        effect: "Luyện đan +30, Nhân hậu +15, Danh tiếng +10",
        rank: "Khó",
        origin: "van_tinh_coc"
    },
    {
        name: "Tinh Không Điện Pháp Sư",
        description: "Bậc thầy điều khiển năng lượng tinh tú từ không gian bao la.",
        effect: "Nội lực tinh thần +45, Ma lực +30",
        rank: "Cực khó",
        origin: "van_tinh_coc"
    },
    {
        name: "Vạn Tinh Thành Đại Phú Hào",
        description: "Người nắm giữ huyết mạch kinh tế của cả vùng Thung Lũng Sao.",
        effect: "Vàng +30000, Giao tiếp +40, Quyền lực +20",
        rank: "Cực khó",
        origin: "van_tinh_coc"
    },
    // === BĂNG PHONG CỰC ĐỊA (Biome 8) ===
    {
        name: "Tuyết Nguyên Thôn Thợ Săn",
        description: "Săn bắt gấu tuyết và báo băng để lấy da lông trao đổi lấy thức ăn.",
        effect: "Kháng lạnh +30, Chính xác +10",
        rank: "Dễ",
        origin: "bang_phong_cuc_dia"
    },
    {
        name: "Thiên Băng Trấn Thợ Chạm Khắc",
        description: "Chạm khắc nghệ thuật trên những khối băng ngàn năm.",
        effect: "Kiến trúc băng +20, Khéo léo +25",
        rank: "Bình thường",
        origin: "bang_phong_cuc_dia"
    },
    {
        name: "Hàn Băng Động Khổ Hành Giả",
        description: "Tu luyện tâm trí trong hang động lạnh lẽo nhất trần gian.",
        effect: "Ý chí thép +35, Kháng lạnh +50",
        rank: "Khó",
        origin: "bang_phong_cuc_dia"
    },
    {
        name: "Băng Long Di Tích Thủ Vệ",
        description: "Bảo vệ tàn tích của rồng băng khỏi những kẻ trộm mộ.",
        effect: "Sức mạnh +25, Phòng ngự băng +15",
        rank: "Khó",
        origin: "bang_phong_cuc_dia"
    },
    {
        name: "Tuyết Liên Tông Thánh Nữ/Thánh Tử",
        description: "Người mang linh thể băng giá tinh khiết của tông môn phương Bắc.",
        effect: "Hàn Băng linh thể +50, Sắc đẹp +20",
        rank: "Cực khó",
        origin: "bang_phong_cuc_dia"
    },
    {
        name: "Băng Đế Thành Hoàng Tử/Công Chúa",
        description: "Hậu duệ của hoàng tộc cai trị vùng cực địa băng giá.",
        effect: "Hoàng gia khí chất +40, Vàng +20000, Quyền lực +30",
        rank: "Cực khó",
        origin: "bang_phong_cuc_dia"
    },
    // === ẢO CẢNH THẦN LÂU (Biome 9) ===
    {
        name: "Ảo Cảnh Thôn Dân Làng",
        description: "Sống trong một ngôi làng đôi khi biến mất vào sương mù.",
        effect: "Ý chí +15, Khám phá +10",
        rank: "Dễ",
        origin: "ao_canh_than_lau"
    },
    {
        name: "Vô Thực Trấn Thương Nhân",
        description: "Mua bán những món đồ chỉ tồn tại trong giấc mơ.",
        effect: "Giao tiếp +20, Vàng +5000, Ảo thuật +5",
        rank: "Bình thường",
        origin: "ao_canh_than_lau"
    },
    {
        name: "Tâm Ma Động Tu Sĩ",
        description: "Đã vượt qua thử thách tâm ma, nhìn thấu hư thực.",
        effect: "Kháng ảo giác +40, Trí tuệ +20",
        rank: "Khó",
        origin: "ao_canh_than_lau"
    },
    {
        name: "Ảo Ảnh Cung Thị Nữ/Thị Vệ",
        description: "Phụng sự trong cung điện ảo ảnh đầy mê hoặc.",
        effect: "Thanh tao +25, Linh hoạt +15, Ẩn mình +10",
        rank: "Khó",
        origin: "ao_canh_than_lau"
    },
    {
        name: "Mộng Diệm Tông Truyền Nhân",
        description: "Người làm chủ các kỹ thuật điều khiển giấc mơ người khác.",
        effect: "Giấc mộng thao túng +50, Sát thương tinh thần +30",
        rank: "Cực khó",
        origin: "ao_canh_than_lau"
    },
    {
        name: "Thần Lâu Thành Chủ",
        description: "Người trị vì thành phố bay lơ lửng giữa thực và ảo.",
        effect: "Ảo thuật vương giả +40, Vàng +15000, Khí vận cực đại +15",
        rank: "Cực khó",
        origin: "ao_canh_than_lau"
    },
    // === VẠN KIẾM TRỦNG (Biome 10) ===
    {
        name: "Kiếm Diệm Trấn Thợ Rèn Dưới Trướng",
        description: "Chuẩn bị than lửa và đồng thiếc cho các đại sư tạo kiếm.",
        effect: "Sức mạnh +15, Kỹ năng chế tạo +10",
        rank: "Dễ",
        origin: "van_kiem_trung"
    },
    {
        name: "Thanh Kiếm Cốc Nhặt Kiếm Giả",
        description: "Nhặt những thanh kiếm gãy để bán phế liệu rèn lại.",
        effect: "Lục soát +20, Vàng +2000, Căn cốt kiếm +5",
        rank: "Bình thường",
        origin: "van_kiem_trung"
    },
    {
        name: "Linh Kiếm Động Thụ Huấn",
        description: "Tự rèn luyện kiếm pháp trong hang động linh thiêng.",
        effect: "Sát thương kiếm +30, Nội lực +10",
        rank: "Khó",
        origin: "van_kiem_trung"
    },
    {
        name: "Kiếm Tâm Cung Đệ Tử",
        description: "Người có lòng với kiếm, tu luyện kiếm tâm thuần khiết.",
        effect: "Kiếm ý +40, Ý chí +20, Chính trực +10",
        rank: "Khó",
        origin: "van_kiem_trung"
    },
    {
        name: "Thiên Kiếm Tông Chân Truyền",
        description: "Đệ tử nòng cốt của tông môn kiếm đạo mạnh nhất vùng.",
        effect: "Vô Thượng Kiếm Đạo +50, Danh tiếng +40",
        rank: "Cực khó",
        origin: "van_kiem_trung"
    },
    {
        name: "Kiếm Hồn Thành Thiếu Gia",
        description: "Sinh trưởng trong gia tộc nắm giữ bí mật hồn kiếm.",
        effect: "Kiếm hồn thức tỉnh +60, Vàng +10000, Quyền lực +25",
        rank: "Cực khó",
        origin: "van_kiem_trung"
    },
    // === HỦ MỘC LÂM (Biome 11) ===
    {
        name: "Tà Quỷ Thôn Dân Làng",
        description: "Sống cùng những sinh vật biến dị trong rừng mục.",
        effect: "Thể chất +20, Kháng tà +10",
        rank: "Dễ",
        origin: "hu_moc_lam"
    },
    {
        name: "Thanh Đài Trấn Thương Nhân",
        description: "Mua bán nấm và rêu độc tại thị trấn xanh rì.",
        effect: "Giao tiếp +20, Vàng +4000, Kháng độc +5",
        rank: "Bình thường",
        origin: "hu_moc_lam"
    },
    {
        name: "Mộc Linh Cốc Tu Hành",
        description: "Hấp thụ linh khí từ những gốc cây mục nát hồi sinh.",
        effect: "Tốc độ hồi phục nội lực +35%, Sức sống +15",
        rank: "Khó",
        origin: "hu_moc_lam"
    },
    {
        name: "Vạn Diệp Điện Tư Tế",
        description: "Người canh giữ thư viện lá cây ghi chép bí thuật rừng già.",
        effect: "Trí tuệ +30, Hiểu biết tự nhiên +25",
        rank: "Khó",
        origin: "hu_moc_lam"
    },
    {
        name: "Thiên Thụ Phủ Thừa Kế",
        description: "Người mang huyết thống của thần thụ cổ đại vệ binh.",
        effect: "Mộc hệ thần thông +50, Phòng ngự tự nhiên +30",
        rank: "Cực khó",
        origin: "hu_moc_lam"
    },
    {
        name: "Tà Mộc Thành Vương",
        description: "Vị vua trẻ của thành phố gỗ mục cô độc giữa rừng rậm.",
        effect: "Lãnh đạo +40, Vàng +5000, Toàn thuộc tính +8",
        rank: "Cực khó",
        origin: "hu_moc_lam"
    },
    // === TÀNG LONG SƠN (Biome 12) ===
    {
        name: "Vân Long Thôn Nông Phu",
        description: "Canh tác trên vách núi quanh năm mây phủ rồng rít.",
        effect: "Sức mạnh +20, Leo trèo +15",
        rank: "Dễ",
        origin: "tang_long_son"
    },
    {
        name: "Thạch Long Trấn Thợ Cắt Đá",
        description: "Khai thác đá rồng trân quý từ sườn núi dốc đứng.",
        effect: "Kỹ năng khai khoáng +25, Thể chất +15",
        rank: "Bình thường",
        origin: "tang_long_son"
    },
    {
        name: "Tàng Long Động Tầm Đạo",
        description: "Ẩn tu trong hang rồng, hy vọng một ngày gặp chân long.",
        effect: "Long khí tiềm ẩn +15, Ngộ tính +20",
        rank: "Khó",
        origin: "tang_long_son"
    },
    {
        name: "Long Huyết Cốc Chiến Binh",
        description: "Chiến đấu và tắm mình trong máu rồng loãng nơi thung lũng.",
        effect: "Căn cốt rồng +35, Sức mạnh +25, Sát khí +10",
        rank: "Khó",
        origin: "tang_long_son"
    },
    {
        name: "Thiên Long Sơn Đệ Tử",
        description: "Đệ tử nòng cốt của phái chính tông tọa lạc trên đỉnh rồng.",
        effect: "Thiên Long chân khí +50, Danh tiếng +30",
        rank: "Cực khó",
        origin: "tang_long_son"
    },
    {
        name: "Long Đế Thành Hoàng Thái Tử",
        description: "Người thừa kế ngai vàng uy nghiêm nhất vùng núi rồng.",
        effect: "Long Uy +60, Vàng +25000, Toàn thuộc tính +10",
        rank: "Cực khó",
        origin: "tang_long_son"
    },
    // === HƯ KHÔNG ĐẢO (Biome 13) ===
    {
        name: "Vân Hải Thôn Ngư Phu",
        description: "Đánh bắt những loài cá bay trong biển mây xanh thẳm.",
        effect: "Nhanh nhẹn +15, Định vị mây +20",
        rank: "Dễ",
        origin: "hu_khong_dao"
    },
    {
        name: "Phù Không Trấn Buôn Chuyến",
        description: "Giao thương hàng hóa giữa các hòn đảo nổi bập bềnh.",
        effect: "Giao tiếp +20, Vàng +6000, Cân bằng +15",
        rank: "Bình thường",
        origin: "hu_khong_dao"
    },
    {
        name: "Linh Vân Đảo Tu Giả",
        description: "Hấp thụ linh khí tinh khiết từ những đám mây ngũ sắc.",
        effect: "Tốc độ tu luyện +15%, Nội lực thanh khiết +25",
        rank: "Khó",
        origin: "hu_khong_dao"
    },
    {
        name: "Hư Không Động Thám Hiểm",
        description: "Khám phá những vết nứt không gian đầy hiểm họa.",
        effect: "Kháng không gian +40, Phản ứng nhanh +20",
        rank: "Khó",
        origin: "hu_khong_dao"
    },
    {
        name: "Hư Vô Cung Đệ Tử",
        description: "Người làm chủ các kỹ thuật dịch chuyển và xuyên thấu.",
        effect: "Không Gian Thần Thông +50, Nhanh nhẹn +30",
        rank: "Cực khó",
        origin: "hu_khong_dao"
    },
    {
        name: "Thiên Hải Thành Chủ",
        description: "Người trị vì thành phố cao nhất, gần với thiên đạo nhất.",
        effect: "Thiên Đạo khí vận +40, Vàng +20000, Quyền lực +30",
        rank: "Cực khó",
        origin: "hu_khong_dao"
    },
    // === HUYẾT NGUYỆT CẢNH (Biome 14) ===
    {
        name: "Hồng Nguyệt Thôn Dân Làng",
        description: "Sống dưới ánh trăng đỏ rực, quen với những đêm mất ngủ.",
        effect: "Kháng ma tính +20, Ý chí +15",
        rank: "Dễ",
        origin: "huyet_nguyet_canh"
    },
    {
        name: "Tà Nguyệt Trấn Thương Nhân",
        description: "Thu mua những vật phẩm chỉ xuất hiện khi trăng máu lên cao.",
        effect: "Giao tiếp +25, Vàng +5000, May mắn +10",
        rank: "Bình thường",
        origin: "huyet_nguyet_canh"
    },
    {
        name: "Minh Nguyệt Cốc Nhạc Công",
        description: "Gảy đàn dưới ánh trăng để xoa dịu những linh hồn ma mị.",
        effect: "Sức mạnh nghệ thuật +30, Thanh tao +20",
        rank: "Khó",
        origin: "huyet_nguyet_canh"
    },
    {
        name: "Ma Nguyệt Miếu Thủ Hộ Giả",
        description: "Canh giữ ngôi miếu thờ vầng trăng máu đầy bí ẩn.",
        effect: "Phòng ngự tinh thần +35, Sát khí +15",
        rank: "Khó",
        origin: "huyet_nguyet_canh"
    },
    {
        name: "Huyết Nguyệt Tông Chấp Sự",
        description: "Thành viên nòng cốt của giáo phái tôn thờ nguyệt ma.",
        effect: "Nguyệt Ma chân khí +50, Tốc độ hồi phục đêm +30%",
        rank: "Cực khó",
        origin: "huyet_nguyet_canh"
    },
    {
        name: "Huyết Dạ Thành Vương Tử",
        description: "Vị lãnh chúa trẻ tuổi của kinh đô bóng đêm đỏ thẫm.",
        effect: "Dạ ma uy áp +50, Vàng +12000, Quyến rũ tà mị +20",
        rank: "Cực khó",
        origin: "huyet_nguyet_canh"
    },
    // === LƯU SA HÀ (Biome 15) ===
    {
        name: "Vãng Sinh Thôn Dân Làng",
        description: "Sống bên dòng sông cát, luôn chuẩn bị cho cái chết thanh thản.",
        effect: "Tâm lý vững vàng +25, Bền bỉ +10",
        rank: "Dễ",
        origin: "luu_sa_ha"
    },
    {
        name: "Cát Chảy Trấn Thợ Cứu Hộ",
        description: "Chuyên giải cứu người và lạc đà bị lún sâu trong dòng cát chảy.",
        effect: "Sức mạnh +25, Kỹ năng giải cứu +20",
        rank: "Bình thường",
        origin: "luu_sa_ha"
    },
    {
        name: "Kim Sa Động Tầm Bảo",
        description: "Khai thác những hạt vàng rực rỡ ẩn trong dòng sông cát.",
        effect: "Lục soát +30, Vàng +8000, May mắn +5",
        rank: "Khó",
        origin: "luu_sa_ha"
    },
    {
        name: "Lưu Sa Tông Đệ Tử",
        description: "Luyện tập cách di chuyển nhẹ nhàng như gió thổi trên cát.",
        effect: "Khinh công sa mạc +40, Nhanh nhẹn +20",
        rank: "Khó",
        origin: "luu_sa_ha"
    },
    {
        name: "Sa Thần Điện Tư Tế",
        description: "Người giao tiếp với vị thần sa mạc hung bạo dưới lòng sông.",
        effect: "Sa Pháp thần thông +50, Toàn thuộc tính đất +30",
        rank: "Cực khó",
        origin: "luu_sa_ha"
    },
    {
        name: "Lưu Sa Thành Đại Công Tước",
        description: "Quý tộc quyền lực nhất cai quản vùng sông cát bao la.",
        effect: "Quyền lực +40, Vàng +40000, Khí vận cực đại +15",
        rank: "Cực khó",
        origin: "luu_sa_ha"
    },
    // === NGHIỆP HỎA LUYỆN NGỤC (Biome 16) ===
    {
        name: "Luyện Ngục Tội Nhân",
        description: "Bị đầy xuống luyện ngục từ nhỏ, đã quen với sự tra tấn của lửa tội.",
        effect: "Kháng hỏa +30, Ý chí +20, Tội lỗi +10",
        rank: "Dễ",
        origin: "nghiep_hoa_luyen_nguc"
    },
    {
        name: "Luyện Ngục Trấn Thợ Thủ Công",
        description: "Chế tác xiềng xích và vũ khí từ sắt nóng chảy dưới luyện ngục.",
        effect: "Sức mạnh +20, Kỹ năng rèn +15",
        rank: "Bình thường",
        origin: "nghiep_hoa_luyen_nguc"
    },
    {
        name: "Vô Gián Cốc Chiến Binh",
        description: "Kẻ liều mạng chiến đấu trong thung lũng không lối thoát.",
        effect: "Khả năng sinh tồn +35, Sát thương vật lý +25",
        rank: "Khó",
        origin: "nghiep_hoa_luyen_nguc"
    },
    {
        name: "Hồng Liên Miếu Khổ Tu",
        description: "Ngồi trên đài sen đỏ lơ lửng giữa hồ nham thạch để tịnh tâm.",
        effect: "Nội lực hỏa hệ +40, Tâm tính thanh khiết +15",
        rank: "Khó",
        origin: "nghiep_hoa_luyen_nguc"
    },
    {
        name: "Nghiệp Hỏa Cung Hộ Pháp",
        description: "Giữ vị trí cao trong cung điện lửa nghiệp, điều khiển hỏa thuật cực đỉnh.",
        effect: "Nghiệp hỏa thần thông +50, Ma lực +30",
        rank: "Cực khó",
        origin: "nghiep_hoa_luyen_nguc"
    },
    {
        name: "Luyện Ngục Vương Chi Hậu Anh",
        description: "Mang dòng máu của vị vua cai trị cõi luyện ngục u tối.",
        effect: "Vương giả khí +50, Sức mạnh +15, Khí vận cực đoan +10",
        rank: "Cực khó",
        origin: "nghiep_hoa_luyen_nguc"
    },
    // === THI MÃNG LÂM (Biome 17) ===
    {
        name: "Rừng Già Thôn Thợ Săn",
        description: "Săn bắt các loài rắn độc khổng lồ ẩn nấp trong bụi rậm.",
        effect: "Theo dấu +20, Nhanh nhẹn +15",
        rank: "Dễ",
        origin: "thi_mang_lam"
    },
    {
        name: "Thi Độc Trấn Dược Sĩ",
        description: "Nghiên cứu cách hóa giải thi độc cho những người lầm lỡ bước chân vào vùng đất này.",
        effect: "Hiểu biết dược lý +25, Kháng độc +20",
        rank: "Bình thường",
        origin: "thi_mang_lam"
    },
    {
        name: "Vạn Xà Cốc Huấn Luyện Viên",
        description: "Có khả năng giao tiếp và điều khiển hàng vạn con rắn độc nhỏ bé.",
        effect: "Kỹ năng điều khiển xà +35, Phản ứng nhanh +15",
        rank: "Khó",
        origin: "thi_mang_lam"
    },
    {
        name: "Cự Mãng Động Thám Hiểm",
        description: "Sống sót sau khi lạc vào hang động của tổ tiên loài trăn ma khổng lồ.",
        effect: "Thể chất linh hoạt +30, Kháng kịch độc +40",
        rank: "Khó",
        origin: "thi_mang_lam"
    },
    {
        name: "Thanh Xà Phủ Thiếu Chủ",
        description: "Mang dòng máu thanh xà tộc, có khả năng hóa hình một phần linh rồng.",
        effect: "Thanh Xà yêu thuật +50, Sắc đẹp +15",
        rank: "Cực khó",
        origin: "thi_mang_lam"
    },
    {
        name: "Thi Mãng Thành Nữ Vương/Vương",
        description: "Lãnh đạo thành phố rắn, có uy quyền tuyệt đối trước muôn loài bò sát.",
        effect: "Xà vương uy áp +60, Vàng +10000, Quyền lực +30",
        rank: "Cực khó",
        origin: "thi_mang_lam"
    },
    // === KÍNH TƯỢNG HỒ (Biome 18) ===
    {
        name: "Hồ Quang Thôn Ngư Phu",
        description: "Hàng ngày chèo thuyền trên mặt hồ phẳng lặng như gương.",
        effect: "Định lực +20, Linh hoạt +10",
        rank: "Dễ",
        origin: "kinh_tuong_ho"
    },
    {
        name: "Minh Hồ Trấn Nghệ Nhân",
        description: "Chế tác các loại gương thần có khả năng lưu giữ hình ảnh.",
        effect: "Kỹ nghệ chế gương +30, Trí tuệ +15",
        rank: "Bình thường",
        origin: "kinh_tuong_ho"
    },
    {
        name: "Linh Ba Cốc Tu Sĩ",
        description: "Cảm nhận những gợn sóng linh khí huyền ảo trên mặt hồ.",
        effect: "Ngộ tính +25, Nội lực thủy hệ +20",
        rank: "Khó",
        origin: "kinh_tuong_ho"
    },
    {
        name: "Tâm Ảnh Di Tích Kẻ Lạc Lối",
        description: "Người đã nhìn thấy chính mình trong quá khứ và tương lai tại di tích.",
        effect: "Thấu hiểu bản thân +40, Khí vận +10",
        rank: "Khó",
        origin: "kinh_tuong_ho"
    },
    {
        name: "Thủy Kính Cung Tiên Tử/Đạo Sĩ",
        description: "Sống trong cung điện pha lê dưới lòng hồ, tu luyện thuật gương chiếu mộng.",
        effect: "Kính tượng thần thông +50, Quyến rũ +20",
        rank: "Cực khó",
        origin: "kinh_tuong_ho"
    },
    {
        name: "Kính Tượng Thành Thiếu Gia/Thiếu Nữ",
        description: "Người thừa kế vương quốc mờ ảo nơi mặt hồ thiêng.",
        effect: "Ảnh vương uy khí +40, Vàng +15000, Toàn thuộc tính ảo +20",
        rank: "Cực khó",
        origin: "kinh_tuong_ho"
    },
    // === THẠCH HÓA NGUYÊN (Biome 19) ===
    {
        name: "Thạch Nguyên Thôn Dân Làng",
        description: "Vốn là người đá sinh trưởng từ đất mẹ nguyên thủy.",
        effect: "Phòng ngự vật lý +30, Tốc độ -10",
        rank: "Dễ",
        origin: "thach_hoa_nguyen"
    },
    {
        name: "Hóa Thạch Trấn Thợ Khai Thác",
        description: "Khai thác những bộ hài cốt đá hóa mang năng lượng cổ đại.",
        effect: "Sức mạnh +25, Khám phá di vật +20",
        rank: "Bình thường",
        origin: "thach_hoa_nguyen"
    },
    {
        name: "Nham Thạch Cốc Chiến Binh",
        description: "Rèn luyện cơ thể trong những dòng chảy nham thạch nóng bóng.",
        effect: "Thể chất kim cương +40, Kháng hỏa +30",
        rank: "Khó",
        origin: "thach_hoa_nguyen"
    },
    {
        name: "Thiên Thạch Phủ Vệ Binh",
        description: "Bảo vệ kho tàng đá rơi từ trời cao của một đại gia tộc.",
        effect: "Sức chịu đựng +35, Ý chí kiên định +20",
        rank: "Khó",
        origin: "thach_hoa_nguyen"
    },
    {
        name: "Thạch Đầu Tông Kiếm Sĩ",
        description: "Một thanh kiếm đá, gánh vác cả giang sơn trầm mặc.",
        effect: "Kiếm pháp trọng thạch +50, Sức mạnh tuyệt đối +30",
        rank: "Cực khó",
        origin: "thach_hoa_nguyen"
    },
    {
        name: "Thạch Đế Thành Lãnh Chúa",
        description: "Người trị vì thành phố đá bất tử, có khả năng hóa đá kẻ thù.",
        effect: "Thạch hóa uy áp +60, Vàng +10000, Phòng ngự tuyệt vời +50",
        rank: "Cực khó",
        origin: "thach_hoa_nguyen"
    },
    // === HỖN ĐỘN DI TÍCH (Biome 20) ===
    {
        name: "Hỗn Độn Thôn Mục Đồng",
        description: "Chăn nuôi các loài thú hỗn hợp kỳ lạ giữa vùng không gian vặn vẹo.",
        effect: "Linh hoạt +20, Cảm nhận không gian +15",
        rank: "Dễ",
        origin: "hon_don_di_tich"
    },
    {
        name: "Vô Định Trấn Lữ Khách",
        description: "Luôn lang thang giữa các mảng không gian không cố định.",
        effect: "Định vị +30, May mắn +15",
        rank: "Bình thường",
        origin: "hon_don_di_tich"
    },
    {
        name: "Hoang Cổ Miếu Tu Sĩ",
        description: "Hành trì theo những bí thuật từ thuở khai thiên lập địa.",
        effect: "Nội lực nguyên thủy +40, Trí tuệ cổ xưa +20",
        rank: "Khó",
        origin: "hon_don_di_tich"
    },
    {
        name: "Thiên Cơ Phủ Mật Thám/Vệ Sĩ",
        description: "Người thuộc tổ chức nắm giữ bí mật lớn nhất vùng hỗn độn.",
        effect: "Bí thuật thiên cơ +35, Ẩn mình +25",
        rank: "Khó",
        origin: "hon_don_di_tich"
    },
    {
        name: "Hỗn Độn Cung Truyền Nhân",
        description: "Được ban tặng quyền năng điều khiển khí hỗn mang vạn biến.",
        effect: "Hỗn Độn thần thông +60, Khí vận cực đoan +20",
        rank: "Cực khó",
        origin: "hon_don_di_tich"
    },
    {
        name: "Hỗn Độn Thành Vương",
        description: "Quân vương trị vì trung tâm của dòng xoáy không gian thần bí.",
        effect: "Không gian uy quyền +50, Vàng +30000, Quyền lực vạn năm +30",
        rank: "Cực khó",
        origin: "hon_don_di_tich"
    },
    // === PHẬT QUANG LĨNH (Biome 21) ===
    {
        name: "Bồ Đề Trấn Dân Thường",
        description: "Sống hiền lành dưới chân núi Phật, hàng ngày ăn chay niệm Phật.",
        effect: "Nhân đức +30, An tĩnh nội tâm +20",
        rank: "Dễ",
        origin: "phat_quang_linh"
    },
    {
        name: "Từ Bi Cốc Y Sĩ",
        description: "Cứu chữa cho muôn loài gặp nạn trong thung lũng từ bi.",
        effect: "Y thuật +35, Danh tiếng +20",
        rank: "Bình thường",
        origin: "phat_quang_linh"
    },
    {
        name: "Linh Sơn Tự Sa Di",
        description: "Tăng nhân trẻ tu tập võ học phật môn chính tông.",
        effect: "Nội công hạo nhiên +40, Căn cốt +15",
        rank: "Khó",
        origin: "phat_quang_linh"
    },
    {
        name: "Phật Quang Điện Thánh Tăng/Hộ Pháp",
        description: "Người có duyên với phật pháp sâu dày, cơ thể tỏa ánh hào quang.",
        effect: "Phật Quang hộ thân +50, Trấn áp ma tính +100",
        rank: "Khó",
        origin: "phat_quang_linh"
    },
    {
        name: "Kim Thân Đệ Tử",
        description: "Đã đạt tới mức độ rèn luyện kim thân không hoại trong truyền thuyết.",
        effect: "Kim Thân Bất Hoại +60, Phòng ngự vật lý tuyệt đối +40",
        rank: "Cực khó",
        origin: "phat_quang_linh"
    },
    {
        name: "Thánh Quang Thành Chủ",
        description: "Vị vua nhân đức trị lãnh địa ánh sáng phương Tây.",
        effect: "Thần thánh uy nghi +50, Khí vận +20, Vàng +10000",
        rank: "Cực khó",
        origin: "phat_quang_linh"
    },
    // === KIẾM Ý CỐC (Biome 22) ===
    {
        name: "Kiếm Đạo Thôn Thiếu Niên",
        description: "Chào đời trong một gia đình kiếm sĩ bình lôi, khí phách ngạo nghễ.",
        effect: "Kiếm ý tiềm ẩn +20, Nhanh nhẹn +15",
        rank: "Dễ",
        origin: "kiem_y_coc"
    },
    {
        name: "Linh Kiếm Trấn Thương Nhân",
        description: "Giao dịch linh thạch và phôi kiếm thượng phẩm cho các kiếm tu.",
        effect: "Vàng +8000, Giao tiếp +20, Khéo léo +10",
        rank: "Bình thường",
        origin: "kiem_y_coc"
    },
    {
        name: "Kiếm Khí Di Tích Khổ Tu",
        description: "Để kiếm khí mài giũa cơ thể và ý chí mỗi ngày.",
        effect: "Sức mạnh ý chí +40, Sát thương kiếm +25",
        rank: "Khó",
        origin: "kiem_y_coc"
    },
    {
        name: "Thiên Kiếm Phủ Vệ Binh Chính Tông",
        description: "Thành viên lực lượng bảo an tinh nhuệ của vùng thung lũng kiếm.",
        effect: "Phòng ngự kiếm +30, Sát thương vật lý +20",
        rank: "Khó",
        origin: "kiem_y_coc"
    },
    {
        name: "Kiếm Tâm Cung Đệ Tử Ưu Tú",
        description: "Dòng máu kiếm tu tinh thuần nhất chảy trong huyết quản.",
        effect: "Kiếm Đạo thần thông +60, Toàn thuộc tính kiếm +40",
        rank: "Cực khó",
        origin: "kiem_y_coc"
    },
    {
        name: "Vạn Kiếm Thành Kiếm Đế Hậu Nhân",
        description: "Hậu duệ cao quý nhất của kinh đô vạn kiếm rực rỡ.",
        effect: "Kiếm hoàng uy áp +50, Khí vận cực đại +20, Kiếm thuật tối thượng",
        rank: "Cực khó",
        origin: "kiem_y_coc"
    },
    // === LÔI ĐÌNH HẢI (Biome 23) ===
    {
        name: "Lôi Duyên Thôn Ngư Phu",
        description: "Ra khơi trên vùng biển luôn chực chờ những tia sét chết người.",
        effect: "Kháng lôi +25, Định vị biển +15",
        rank: "Dễ",
        origin: "loi_dinh_hai"
    },
    {
        name: "Lôi Thần Trấn Thợ Đúc",
        description: "Đúc các linh khí thu lôi từ kim loại biển sâu.",
        effect: "Kỹ năng chế tạo +30, Sức mạnh +15",
        rank: "Bình thường",
        origin: "loi_dinh_hai"
    },
    {
        name: "Điện Quang Hải Thám Hiểm",
        description: "Vượt qua biển sấm sét để tìm kiếm các hòn đảo lôi linh.",
        effect: "Nhanh nhẹn +35, May mắn không gian +15",
        rank: "Khó",
        origin: "loi_dinh_hai"
    },
    {
        name: "Thiên Điện Phủ Chấp Sự",
        description: "Quản lý năng lượng sấm sét phục vụ cho các đại trận bảo vệ đảo.",
        effect: "Phép thuật lôi hệ +40, Trí tuệ mang điện +20",
        rank: "Khó",
        origin: "loi_dinh_hai"
    },
    {
        name: "Lôi Đình Điện Trưởng Lão Hậu Duệ",
        description: "Thừa hướng ma lực lôi đình sục sôi của thế hệ đi trước.",
        effect: "Lôi Đình thần thông +60, Uy lực tàn phá +40",
        rank: "Cực khó",
        origin: "loi_dinh_hai"
    },
    {
        name: "Vạn Lôi Thành Chủ",
        description: "Vị vua của thành phố sấm sét, không bao giờ cúi đầu trước thiên phạt.",
        effect: "Lôi vương uy quyền +50, Kháng lôi tuyệt đối +100, Vàng +20000",
        rank: "Cực khó",
        origin: "loi_dinh_hai"
    },
    // === CỬU TIÊU PHONG (Biome 24) ===
    {
        name: "Dao Trì Thôn Trồng Hoa",
        description: "Chăm sóc các loài hoa tiên nở rộ bên hồ Dao Trì.",
        effect: "Quyến rũ +25, Hiểu biết thực vật +20",
        rank: "Dễ",
        origin: "cuu_tieu_phong"
    },
    {
        name: "Vân Đỉnh Trấn Kẻ Du Ngoạn",
        description: "Khám phá các tầng mây và đỉnh núi cao vút mờ sương.",
        effect: "Leo trèo +30, Thể lực +20",
        rank: "Bình thường",
        origin: "cuu_tieu_phong"
    },
    {
        name: "Cửu Thiên Cốc Tu Hành",
        description: "Tu sĩ tu luyện tại thung lũng chín tầng trời, tiên khí dồi dào.",
        effect: "Tốc độ tu luyện +25%, Nội lực thanh khiết +40",
        rank: "Khó",
        origin: "cuu_tieu_phong"
    },
    {
        name: "Tiên Linh Di Tích Thủ Hộ",
        description: "Bảo vệ tàn tích còn sót lại từ thời các vị tiên còn tại thế.",
        effect: "Phòng ngự tiên khí +35, Ý chí kiên định +25",
        rank: "Khó",
        origin: "cuu_tieu_phong"
    },
    {
        name: "Tiên Nhân Cung Thiếu Chủ",
        description: "Người mang dòng máu tiên nhân chính tông, cốt cách cao ngạo.",
        effect: "Tiên linh thể +60, Khí vận +15, Sắc đẹp tuyệt trần",
        rank: "Cực khó",
        origin: "cuu_tieu_phong"
    },
    {
        name: "Tiên Đế Thành Thái Tử/Công Chúa",
        description: "Người thừa kế vương triều tiên giới cai trị vùng Cửu Tiêu.",
        effect: "Tiên Uy +50, Vàng +50000, Toàn thuộc tính tiên +30",
        rank: "Cực khó",
        origin: "cuu_tieu_phong"
    },
    // === VẠN ĐỘC TRẠCH (Biome 25) ===
    {
        name: "Độc Long Thôn Dân Chài",
        description: "Bắt tôm cá chứa đầy chất độc trong đầm lầy vạn năm.",
        effect: "Kháng độc +30, Thể chất dẻo dai +10",
        rank: "Dễ",
        origin: "van_doc_trach"
    },
    {
        name: "Độc Vụ Trấn Thương Nhân",
        description: "Giao dịch các loài côn trùng độc và thảo dược mục nát.",
        effect: "Giao tiếp +20, Vàng +10000, Hòa độc +10",
        rank: "Bình thường",
        origin: "van_doc_trach"
    },
    {
        name: "Độc Nguyên Cốc Thử Thuốc",
        description: "Dùng chính thân mình để thử nghiệm hàng vạn loại độc dược.",
        effect: "Cơ thể vạn độc +50, Ý chí chịu đựng +40",
        rank: "Khó",
        origin: "van_doc_trach"
    },
    {
        name: "Vạn Độc Di Tích Thám Hiểm",
        description: "Truy tìm bí kíp của các độc vương cổ đại trong đầm lầy.",
        effect: "Lục soát +40, Kiến thức độc +30",
        rank: "Khó",
        origin: "van_doc_trach"
    },
    {
        name: "Thiên Độc Phủ Sát Thủ",
        description: "Một khi ra tay, không ai có thể sống sót trước kịch độc.",
        effect: "Ám sát +60, Khả năng dùng độc +50",
        rank: "Cực khó",
        origin: "van_doc_trach"
    },
    {
        name: "Độc Vương Thành Vương Tử",
        description: "Hậu duệ trị vì vương quốc độc lớn nhất cõi đầm lầy.",
        effect: "Độc vương uy áp +50, Kháng độc tuyệt đối +100, Vàng +15000",
        rank: "Cực khó",
        origin: "van_doc_trach"
    },
    // === ÁM NHẬT VỰC (Biome 26) ===
    {
        name: "Dạ Ma Thôn Thiếu Niên",
        description: "Cậu bé lớn lên trong bóng tối vĩnh hằng, đôi mắt rực sáng.",
        effect: "Tầm nhìn đêm +100, Nhanh nhẹn +20",
        rank: "Dễ",
        origin: "am_nhat_vuc"
    },
    {
        name: "Vĩnh Dạ Trấn Thợ Đèn",
        description: "Chế tạo các loại đèn ma pháp là nguồn sáng duy nhất trong bóng đêm.",
        effect: "Khéo léo +30, Trí tuệ +15",
        rank: "Bình thường",
        origin: "am_nhat_vuc"
    },
    {
        name: "Ám Ảnh Cốc Thợ Săn",
        description: "Di chuyển như bóng ma để săn lùng những sinh vật hắc ám.",
        effect: "Ẩn mình cực đỉnh +50, Phản xạ +25",
        rank: "Khó",
        origin: "am_nhat_vuc"
    },
    {
        name: "Thiên Dạ Phủ Chấp Sự",
        description: "Quản lý các nghi thức thờ phụng màn đêm tối thượng.",
        effect: "Hắc ám ma pháp +40, Ý chí hắc hố +25",
        rank: "Khó",
        origin: "am_nhat_vuc"
    },
    {
        name: "Hắc Nhật Cung Truyền Nhân",
        description: "Sở hữu sức mạnh của mặt trời đen, nuốt chửng mọi ánh sáng.",
        effect: "Ám Nhật ma công +60, Khí vận đen tối +15",
        rank: "Cực khó",
        origin: "am_nhat_vuc"
    },
    {
        name: "Hắc Ma Thành Hoàng Đế",
        description: "Vị vua của bóng đêm, trị vì lãnh địa hắc ám hùng vĩ nhất.",
        effect: "Ám vương uy nghi +50, Vàng +30000, Quyền lực hắc ám +40",
        rank: "Cực khó",
        origin: "am_nhat_vuc"
    },
    // === PHÙ TANG ĐẢO (Biome 27) ===
    {
        name: "Phù Tang Thôn Ngư Phu",
        description: "Ngư dân vùng biển Đông, lớn lên cùng sóng biển và nắng ấm.",
        effect: "Sức mạnh +20, Bơi lội +25",
        rank: "Dễ",
        origin: "phu_tang_dao"
    },
    {
        name: "Đông Phương Trấn Thương Nhân",
        description: "Buôn bán gỗ Phù Tang và lụa tiên từ hải đảo ra đất liền.",
        effect: "Vàng +10000, Giao tiếp +25, May mắn +5",
        rank: "Bình thường",
        origin: "phu_tang_dao"
    },
    {
        name: "Thần Mộc Động Tu Sĩ",
        description: "Cảm ngộ linh tính từ gốc thần mộc Phù Tang ngàn năm.",
        effect: "Ngộ tính +30, Nội lực mộc hệ +40",
        rank: "Khó",
        origin: "phu_tang_dao"
    },
    {
        name: "Kim Ô Di Tích Kẻ Kế Thừa",
        description: "Người tìm thấy một chiếc lông vũ rực lửa của thần điểu Kim Ô.",
        effect: "Kim Ô chân hỏa +50, Khí vận hỏa +20",
        rank: "Khó",
        origin: "phu_tang_dao"
    },
    {
        name: "Thái Dương Cung Đệ Tử",
        description: "Người làm bạn với ánh nắng, sở hữu sức mạnh ban mai rực rỡ.",
        effect: "Thái Dương thần thông +60, Sắc đẹp tỏa sáng +15",
        rank: "Cực khó",
        origin: "phu_tang_dao"
    },
    {
        name: "Phù Tang Thành Vương",
        description: "Lãnh chúa của đảo quốc mặt trời mọc huy hoàng giữa biển khơi.",
        effect: "Hải đảo uy quyền +50, Khí vận vàng +20, Vàng +25000",
        rank: "Cực khó",
        origin: "phu_tang_dao"
    },
    // === TUYẾT TAN ĐỊA (Biome 28) ===
    {
        name: "Tuyết Tan Thôn Nông Phu",
        description: "Gieo trồng vụ mùa ngay khi những dòng suối băng bắt đầu tan chảy.",
        effect: "Bền bỉ +20, Khả năng gieo trồng +25",
        rank: "Dễ",
        origin: "tuyet_tan_dia"
    },
    {
        name: "Tuyết Giải Trấn Thợ Săn",
        description: "Săn lùng các loài linh thú mùa xuân vừa thức tỉnh sau kỳ đông.",
        effect: "Nhanh nhẹn +20, Theo dấu +25",
        rank: "Bình thường",
        origin: "tuyet_tan_dia"
    },
    {
        name: "Sinh Cơ Cốc Tu Hành",
        description: "Tu luyện giữa vùng đất tràn trề nhựa sống hồi sinh.",
        effect: "Tốc độ hồi máu +50%, Sức mạnh sinh mệnh +40",
        rank: "Khó",
        origin: "tuyet_tan_dia"
    },
    {
        name: "Thiên Xuân Phủ Truyền Nhân",
        description: "Người gánh vác sứ mệnh mang mùa xuân vĩnh cửu đến thế gian.",
        effect: "Xuân Ý thần thông +50, Khí vận xanh +15",
        rank: "Khó",
        origin: "tuyet_tan_dia"
    },
    {
        name: "Xuân Lai Cung Đệ Tử",
        description: "Chiêu thức bay bổng như hoa anh đào tung bay trong gió xuân.",
        effect: "Khinh công ảo ảnh +50, Quyến rũ +25",
        rank: "Cực khó",
        origin: "tuyet_tan_dia"
    },
    {
        name: "Xuân Hi Thành Thiếu Chủ",
        description: "Người thừa kế thành phố rực rỡ ánh sớm mai mùa xuân.",
        effect: "Dục vương khí +40, Vàng +12000, Toàn thuộc tính sinh mệnh +15",
        rank: "Cực khó",
        origin: "tuyet_tan_dia"
    },
    // === TINH THẦN HÀ (Biome 29) ===
    {
        name: "Tinh Thần Thôn Ngư Phu",
        description: "Đánh bắt những con cá tinh thể lấp lánh như lồng đèn.",
        effect: "Linh hoạt +20, Tầm nhìn mờ ảo +20",
        rank: "Dễ",
        origin: "tinh_than_ha"
    },
    {
        name: "Ngân Hà Trấn Thương Nhân",
        description: "Buôn bán cát tinh tú và đá Ngân Hà rực rỡ.",
        effect: "Vàng +15000, Giao tiếp +25, May mắn sao +5",
        rank: "Bình thường",
        origin: "tinh_than_ha"
    },
    {
        name: "Tinh Luân Cốc Tu Sĩ",
        description: "Vận hành vòng tuần hoàn của tinh thể trong cơ thể.",
        effect: "Nội lực tinh tú +45, Trí tuệ sáng láng +20",
        rank: "Khó",
        origin: "tinh_than_ha"
    },
    {
        name: "Thiên Hà Phủ Hộ Pháp",
        description: "Canh giữ dòng chảy của dòng sông tinh thể chảy về biển sao.",
        effect: "Điều khiển chất lỏng tinh tú +50, Sức mạnh tinh thần +25",
        rank: "Khó",
        origin: "tinh_than_ha"
    },
    {
        name: "Tinh Hải Cung Đệ Tử",
        description: "Chiến binh mang giáp tinh tú, lấp lánh giữa vạn dải ngân hà.",
        effect: "Tinh Hải quyết +60, Phòng ngự ảo ảnh +30",
        rank: "Cực khó",
        origin: "tinh_than_ha"
    },
    {
        name: "Tinh Thần Thành Vương",
        description: "Vị lãnh chúa kiêu sa trị vì vương quốc đẹp nhất cõi trời.",
        effect: "Tinh thần uy nghi +50, Khí vận lấp lánh +20, Vàng +40000",
        rank: "Cực khó",
        origin: "tinh_than_ha"
    },
    // === QUỶ THỊ TRẤN (Biome 30) ===
    {
        name: "Quỷ Ma Thôn Dân Làng",
        description: "Chào đời trong ngôi làng nơi người và quỷ sống lẫn lộn.",
        effect: "Kháng quỷ +25, Ý chí +15",
        rank: "Dễ",
        origin: "quy_thi_tran"
    },
    {
        name: "Ma Giao Trấn Thương Đội",
        description: "Giao dịch những món đồ cấm từ sâu trong quỷ thị.",
        effect: "Giao tiếp hắc ám +25, Vàng +12000, Phản ứng nhanh +10",
        rank: "Bình thường",
        origin: "quy_thi_tran"
    },
    {
        name: "Vong Hồn Cốc Kẻ Săn Ma",
        description: "Bắt giữ những linh hồn lang thang để trao đổi lấy quỷ khí.",
        effect: "Quỷ khí +40, Sức mạnh tinh thần +25",
        rank: "Khó",
        origin: "quy_thi_tran"
    },
    {
        name: "Ma Ảnh Động Thám Hiểm",
        description: "Tìm kiếm chân lý trong hang động chứa vạn cái bóng ma quái.",
        effect: "Ảo ảnh hắc ám +50, Tầm nhìn +20",
        rank: "Khó",
        origin: "quy_thi_tran"
    },
    {
        name: "Quỷ Thị Cung Đệ Tử",
        description: "Học cách giao dịch linh hồn và làm chủ quỷ đạo thần thông.",
        effect: "Quỷ Đạo thần thông +60, Sát khí +30",
        rank: "Cực khó",
        origin: "quy_thi_tran"
    },
    {
        name: "Quỷ Vương Thành Thái Tử",
        description: "Người thừa kế ngai vàng uy quyền cai trị muôn loài quỷ.",
        effect: "Quỷ vương uy áp +70, Quyền lực hắc ám +50, Vàng +20000",
        rank: "Cực khó",
        origin: "quy_thi_tran"
    },
];
