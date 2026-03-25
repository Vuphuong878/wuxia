import React, { useEffect, useMemo, useRef, useState } from 'react';
import GameButton from '../../ui/GameButton';
import { WorldGenConfig, CharacterData, Talent, Background, GameDifficulty, StoryStyleType, TalentRank } from '../../../types';
import { PresetTalent, PresetBackground } from '../../../data/presets';
import { OrnateBorder } from '../../ui/decorations/OrnateBorder';
import InlineSelect from '../../ui/InlineSelect';
import ToggleSwitch from '../../ui/ToggleSwitch';
import * as dbService from '../../../services/dbService';
import { Dices, Save, Download, LogOut, X, Plus, Minus, Users, Swords, Check } from 'lucide-react';
import { RadarChart, RadarData } from '../../shared/RadarChart';
import { StatBar } from '../../shared/StatBar';

interface Props {
    onComplete: (
        worldConfig: WorldGenConfig,
        charData: CharacterData,
        mode: 'all' | 'step',
        openingStreaming: boolean
    ) => void;
    onCancel: () => void;
    loading: boolean;
    requestConfirm?: (options: { title?: string; message: string; confirmText?: string; cancelText?: string; danger?: boolean }) => Promise<boolean>;
}

const STEPS = ['Thế giới quan', 'Hồ sơ hiệp khách', 'Thuộc tính nhân vật', 'Thân thế xuất thân', 'Bất lợi bẩm sinh', 'Thiên phú linh khiếu', 'Xác nhận tạo'];

const WORLD_NAMES = ['Thương Khung Giới', 'Huyền Âm Thế Giới', 'Thái Hư Kiếm Vực', 'Trọng Tiêu Thần Giới', 'Vạn Kiếm Thánh Địa', 'Hỗn Độn Thần Vực', 'Tử Tiêu Cửu Thiên', 'Huyết Sát Giang Hồ', 'Phong Lôi Vũ Giới', 'Thiên Long Bát Bộ Giới', 'Cửu Châu Kiếm Giới', 'Mặc Sắc Vô Biên Giới', 'Bách Kiếm Tông Thế Giới', 'Thiên Địa Huyền Hoàng Giới', 'Trường Hà Vạn Cổ Giới', 'Hồng Hoang Thần Giới', 'Kiếm Vũ Thiên Duyên Giới', 'Vô Cực Vạn Giới', 'Tiêu Diêu Vũ Giới', 'Đại Thiên Địa Giới', 'Thanh Hoá', 'Nam Định', 'Bàn Cổ Giới', 'Hỗn Độn Tinh Không', 'Hồng Mông Đại Thế Giới', 'Thần Ma Chiến Trường', 'Cửu U Minh Giới', 'Thiên Đạo Thần Vực', 'Linh Giới', 'Tiên Giới', 'Phàm Nhân Giới', 'Yêu Giới', 'Ma Giới', 'Phật Quốc', 'Tu La Đạo', 'Sâm La Điện', 'Cửu Trùng Thiên', 'Thập Bát Tầng Địa Ngục', 'Vạn Yêu Cốc', 'Bách Thảo Viên', 'Kiếm Trủng', 'Đao Vực', 'Thủy Tinh Cung', 'Hỏa Diệm Sơn', 'Lôi Âm Tự', 'Phong Thần Đài', 'Tru Tiên Trận', 'Vạn Tiên Trận', 'Cửu Khúc Hoàng Hà Trận', 'Thái Cực Đồ', 'Bàn Cổ Phiên', 'Hỗn Độn Chung'];
const DYNASTY_PRESETS = [
    'Anh hùng tranh đỉnh, cuối triều đại suy tàn, bốn phương nổi loạn',
    'Thiên hạ đại loạn, quần hùng cát cứ, giang sơn phân liệt',
    'Thịnh thế thái bình, triều đình hưng thịnh nhưng ẩn chứa mưu đồ',
    'Loạn thế xuân thu, chư hầu tranh bá, kẻ sĩ tứ phương tụ hội',
    'Triều đại khai quốc, anh kiệt vân tập, vươn tay lập cơ nghiệp',
    'Ma đạo quật khởi, chính tà đối lập, thiên hạ đại chiến sắp nổ ra',
    'Bắc phương dị tộc nam xâm, biên cương nguy cấp, anh hùng xuất thế',
    'Cố quốc phồn hoa, đế đô hào hoa náo nhiệt, tranh quyền đoạt vị thâm',
    'Thiên tử mất quyền, quyền thần lộng hành, chư hầu mỗi người một cõi',
    'Vương triều mạt thế, dân gian lầm than, hào kiệt tứ khởi khởi nghĩa',
    'Thượng cổ hồng hoang, vạn tộc mọc lên như nấm, nhân loại chỉ là hạt cát',
    'Đế quốc tu chân hùng mạnh, cai trị tinh vực, khoa học và tiên pháp kết hợp',
    'Thế giới tàn phá sau kỷ nguyên hắc ám, linh khí khô kiệt, tà ma hoành hành',
    'Cửu thiên thập địa, tiên giới sụp đổ, chư thần vẫn lạc, trần gian hỗn loạn',
    'Vương triều yêu tộc thống trị, nhân loại bị nô dịch, khởi nghĩa ngầm khắp nơi',
    'Tam giới phân tranh, thiên, địa, nhân giới giao thoa, chiến hỏa liên miên',
    'Thế giới ngầm dưới lòng đất, các thành bang tranh đoạt tài nguyên khoáng thạch',
    'Quần đảo lơ lửng trên không, các tông môn chiến đấu giành giật linh mạch',
    'Thời kỳ mạt pháp, tu sĩ ẩn nấp, phàm nhân nắm quyền bằng hỏa khí',
    'Thế giới bị nguyền rủa, màn đêm vĩnh hằng, ánh sáng là thứ xa xỉ nhất',
    'Đế quốc sụp đổ, chư hầu nổi lên, chiến tranh liên miên không dứt',
    'Triều đại mới thành lập, bách phế đãi hưng, nhân tài được trọng dụng',
    'Nữ đế đăng cơ, thiên hạ thái bình, nhưng sóng ngầm cuộn trào trong triều đình',
    'Quyền thần lộng quyền, ấu chúa bù nhìn, trung thần nghĩa sĩ tìm cách cứu vãn',
    'Ngoại tộc xâm lăng, sơn hà phá toái, anh hùng hào kiệt đứng lên bảo vệ đất nước',
    'Tôn giáo trị quốc, thần quyền lấn át vương quyền, bá tánh lầm than',
    'Thương nghiệp phồn thịnh, tiền tài quyết định tất cả, võ lâm bị đồng tiền chi phối',
    'Khoa học kỹ thuật phát triển, cơ giáp kết hợp võ thuật, thời đại mới bắt đầu',
    'Thế giới bị ô nhiễm, dị nhân xuất hiện, trật tự cũ sụp đổ, trật tự mới đang hình thành',
    'Trái đất sau tận thế, con người sinh tồn trong những khu định cư nhỏ bé',
    'Vương triều hủ bại, tham quan ô lại hoành hành, dân chúng lầm than oán thán',
    'Hoàng đế u mê, sủng ái yêu phi, triều chính bỏ bê, trung gian nịnh thần lộng hành',
    'Thái tử bị phế, chư hoàng tử tranh ngôi, cốt nhục tương tàn, máu chảy thành sông',
    'Tiên triều giáng lâm, phàm nhân bị coi như kiến hôi, mặc tình chém giết',
    'Yêu ma hoành hành, nhân loại co cụm trong những tòa thành được bảo vệ bởi trận pháp',
    'Thế giới song song, hai triều đại đối lập nhau, chiến tranh không bao giờ kết thúc',
    'Du mục trỗi dậy, kỵ binh càn quét thiên hạ, đế chế nông nghiệp sụp đổ',
    'Hải tặc hoành hành, các quốc gia ven biển liên minh chống lại, đại chiến trên biển',
    'Thế giới ngầm trỗi dậy, các bang phái hắc ám kiểm soát mọi thứ, chính quyền chỉ là bù nhìn',
    'Thời đại hoàng kim, võ đạo hưng thịnh, thiên tài xuất hiện lớp lớp'
];
const TIANJIAO_PRESETS = [
    'Thiên tài đồng xuất, tranh giành đỉnh phong, một thời hào kiệt vân tập',
    'Thiên mệnh chi tử xuất thế, thần binh lợi khí tái xuất giang hồ',
    'Bách niên kỳ tài cùng thời xuất hiện, võ học đỉnh thịnh chưa từng có',
    'Thiên cơ đại biến, thiên kiều mỗi người thân mang cơ duyên trọng đại',
    'Ma đạo thánh nhân tái thế, chính đạo liên minh đồng tâm đối kháng',
    'Vạn kiếm quy tông, thiên kiều thân mang kiếm mệnh bẩm sinh đặc biệt',
    'Cổ thần phong ấn tan vỡ, thiên địa linh khí bạo trướng phi thường',
    'Thần ma đại chiến tàn dư giác thức, thiên kiều kế thừa cổ thần di sản',
    'Kim thiếp xuất thế, tiên nhân truyền thừa, thiên tài tranh đoạt cơ duyên',
    'Huyết mạch giác thức, phong thần bảng tái hiện, thiên kiều tham chiến',
    'Thần thể giáng thế, vạn năm hiếm gặp, dẫn động thiên địa dị tượng',
    'Người mang hệ thống, nghịch thiên cải mệnh, càn quét mọi thiên tài',
    'Trùng sinh giả mang theo ký ức kiếp trước, thề báo thù rửa hận',
    'Kẻ xuyên không từ thế giới khác, mang theo tri thức hiện đại áp đảo quần hùng',
    'Phế vật quật khởi, ngẫu nhiên đạt được truyền thừa thượng cổ',
    'Yêu nghiệt song tu, chính tà kiêm tu, không dung nạp bởi thế gian',
    'Kẻ mang huyết mạch cấm kỵ, bị cả thiên hạ truy sát nhưng càng đánh càng mạnh',
    'Khí vận chi tử, đi đường vấp cục đá cũng nhặt được thần binh',
    'Kiếm tu cực đoan, chỉ tu một kiếm, phá vạn pháp, chém rách thương khung',
    'Luyện đan kỳ tài, lấy đan nhập đạo, khống chế vô số cường giả',
    'Sở hữu dị hỏa trong truyền thuyết, luyện đan luyện khí vô song',
    'Mang trong mình huyết mạch Thần Long, nhục thân cường hãn vô địch',
    'Trời sinh Kiếm Cốt, vạn kiếm thần phục, kiếm đạo thiên tài',
    'Sở hữu Cửu Âm Tuyệt Mạch, tu luyện ma công tiến triển cực nhanh',
    'Mang Thái Dương Chi Thể, hỏa hệ pháp thuật uy lực kinh người',
    'Trời sinh Đạo Thể, tu luyện bất kỳ công pháp nào cũng dễ như trở bàn tay',
    'Sở hữu Thiên Nhãn, nhìn thấu mọi ảo ảnh, trận pháp',
    'Mang Không Gian Chi Lực, di chuyển tức thời, vô ảnh vô tung',
    'Sở hữu Thời Gian Chi Lực, thao túng thời gian, nghịch chuyển sinh tử',
    'Mang Hỗn Độn Chi Thể, dung hợp vạn vật, vạn pháp bất xâm',
    'Trời sinh Phật Tâm, từ bi hỉ xả, độ hóa chúng sinh',
    'Sở hữu Ma Tôn Truyền Thừa, tà ác vô cùng, sát phạt quyết đoán',
    'Mang Yêu Tộc Huyết Mạch, biến hóa khôn lường, sức mạnh hoang dã',
    'Sở hữu Quỷ Đạo Truyền Thừa, thao túng linh hồn, luyện chế ác quỷ',
    'Trời sinh Độc Thể, vạn độc bất xâm, độc thuật thiên hạ đệ nhất',
    'Mang Tinh Tú Chi Lực, mượn sức mạnh các vì sao, uy lực vô cùng',
    'Sở hữu Ngũ Hành Chi Thể, tinh thông ngũ hành pháp thuật, tương sinh tương khắc',
    'Trời sinh Lôi Đình Chi Thể, thao túng sấm sét, uy chấn bát phương',
    'Mang Phong Bạo Chi Lực, tốc độ cực nhanh, xé rách không gian',
    'Sở hữu Băng Tuyết Chi Thể, đóng băng vạn vật, tuyệt tình tuyệt nghĩa',
    'Trời sinh Âm Dương Chi Thể, cân bằng âm dương, sinh tử luân hồi',
    'Mang Sinh Mệnh Chi Lực, chữa trị mọi vết thương, cải tử hoàn sinh',
    'Sở hữu Hủy Diệt Chi Lực, phá hủy mọi thứ, không gì cản nổi',
    'Trời sinh Ảo Thuật Thiên Tài, tạo ra ảo ảnh chân thực, khiến người ta điên loạn',
    'Mang Khôi Lỗi Chi Thuật, chế tạo khôi lỗi chiến đấu, một người như một đạo quân',
    'Sở hữu Ngự Thú Chi Thuật, thuần phục vạn thú, thống lĩnh yêu tộc',
    'Trời sinh Trận Pháp Tông Sư, bố trí trận pháp kinh thiên động địa',
    'Mang Phù Lục Chi Thuật, vẽ bùa gọi thần, uy lực khôn lường',
    'Sở hữu Luyện Khí Tông Sư, rèn đúc thần binh lợi khí, danh chấn thiên hạ',
    'Trời sinh Luyện Đan Tông Sư, luyện chế tiên đan thần dược, cải tử hoàn sinh'
];
const MALE_NAMES = ['Hàn Lập', 'Lý Vân', 'Thẩm Lãng', 'Vương Lâm', 'Lâm Động', 'Vũ Hao', 'Trần Phong', 'Tiêu Viêm', 'Lục Minh', 'Dương Khai', 'Trương Hiên', 'Lưu Vũ', 'Tề Thiên', 'Bạch Lộc', 'Hàn Yên', 'Giang Phong', 'Tuấn Kiệt', 'Mộ Dung Long', 'Diệp Phàm', 'Nhạc Thiên', 'Độ Mixi', 'Cố Trường Ca', 'Phương Hàn', 'Mạnh Hạo', 'Bạch Tiểu Thuần', 'Kỷ Ninh', 'La Phong', 'Tô Minh', 'Thạch Hạo', 'Diệp Tôn', 'Sở Phong', 'Trần Phàm', 'Lý Thất Dạ', 'Tiêu Thần', 'Lâm Minh', 'Dương Kỳ', 'Tần Vũ', 'Thạch Nham', 'Giang Trần', 'Lâm Phong', 'Sở Mặc', 'Bạch Khởi', 'Hạng Vũ', 'Lữ Bố', 'Quan Vũ', 'Trương Phi', 'Triệu Vân', 'Mã Siêu', 'Hoàng Trung', 'Gia Cát Lượng', 'Tào Tháo', 'Tôn Quyền', 'Lưu Bị', 'Chu Du', 'Tư Mã Ý', 'Quách Gia', 'Tuân Úc', 'Giả Hủ', 'Bàng Thống', 'Khương Duy', 'Đặng Ngải', 'Chung Hội', 'Lục Tốn', 'Lã Mông', 'Cam Ninh', 'Thái Sử Từ'];
const FEMALE_NAMES = ['Vân Nguyệt', 'Tiểu Tiên', 'Lệ Hồng', 'Tuyết Nhi', 'Linh Nhi', 'Băng Nhi', 'Tử Hà', 'Minh Nguyệt', 'Lam Tinh', 'Hương Hồng', 'Thúy Vân', 'Bạch Lộ', 'Tiểu Vũ', 'Thiên Tâm', 'Kim Tuyến', 'Mộng Nhi', 'Sương Nhi', 'Long Nữ', 'Phù Dao', 'Dao Cơ', 'Lãnh Như Sương', 'Nam Cung Uyển', 'Cơ Tử Nguyệt', 'An Diệu Y', 'Nhan Như Ngọc', 'Bích Dao', 'Lục Tuyết Kỳ', 'Hoa Thiên Cốt', 'Bạch Thiển', 'Phượng Cửu', 'Tô Đát Kỷ', 'Liễu Như Thị', 'Mục Niệm Từ', 'Tiểu Long Nữ', 'Vương Ngữ Yên', 'Nhậm Doanh Doanh', 'Chu Chỉ Nhược', 'Triệu Mẫn', 'Hoàng Dung', 'Lý Mạc Sầu', 'Điêu Thuyền', 'Đại Kiều', 'Tiểu Kiều', 'Tôn Thượng Hương', 'Chân Mật', 'Thái Diễm', 'Hoàng Nguyệt Anh', 'Trương Xuân Hoa', 'Vương Nguyên Cơ', 'Tân Hiến Anh', 'Hạ Hầu Lệnh Nữ', 'Mã Vân Lộc', 'Lữ Linh Khởi', 'Quan Ngân Bình', 'Trương Tinh Thải', 'Bào Tam Nương', 'Hoa Mộc Lan', 'Võ Tắc Thiên', 'Dương Quý Phi', 'Vương Chiêu Quân', 'Tây Thi', 'Triệu Phi Yến', 'Đát Kỷ', 'Bao Tự', 'Lữ Hậu'];
const APPEARANCE_PRESETS = [
    'Mình hạc xương mai, phong tư trác tuyệt, ánh mắt thâm thúy tựa tinh thần.',
    'Dáng người vạm vỡ, mặt mày góc cạnh, tản ra khí thế uy dũng áp bách.',
    'Dung mạo tú lệ, da thịt như ngọc, khí chất phiêu diêu tựa tiên nhân hạ phàm.',
    'Thân hình thon dài, ăn mặc giản dị nhưng toát lên vẻ sắc bén lạnh lùng.',
    'Khuôn mặt thanh tú, khóe môi luôn vương nụ cười như có như không, ánh mắt thấu triệt.',
    'Tóc xõa tung bay, cuồng ngạo bất kham, mang theo vài phần tà mị.',
    'Nho nhã điềm đạm, cử chỉ khoan thai, như thư sinh thế gia mang đầy thi thư khí chất.',
    'Gương mặt băng lãnh, ánh mắt vô diện vô ba, như người nhẫn nhịn ngàn năm tuyết.',
    'Thiên tư quốc sắc, dung mạo khuuyên thành, mỗi cái cau mày đều khiến thế nhân điên đảo.',
    'Mình đầy sẹo chiến trận, ánh mắt kiên định, toát ra sát khí được tôi luyện qua ngàn trận sinh tử.',
    'Bạch y phiêu phiêu, tóc đen như thác, mang theo tiên khí mờ ảo không dính bụi trần.',
    'Cơ bắp cuồn cuộn, xăm trổ đầy mình, tỏa ra hung uy của hồng hoang mãnh thú.',
    'Dung mạo tà dị, đôi mắt hai màu, nụ cười luôn mang theo sự nguy hiểm chết người.',
    'Thân hình nhỏ nhắn, khuôn mặt ngây thơ nhưng ánh mắt lại già dặn, thâm thúy vô cùng.',
    'Mặc hắc bào che kín toàn thân, chỉ để lộ đôi mắt đỏ ngầu rực sáng trong đêm.',
    'Khuôn mặt chữ điền, lông mày rậm, ánh mắt cương trực, toát lên vẻ chính khí lẫm liệt.',
    'Dáng người gầy gò, ốm yếu, ho khan liên tục, nhưng ánh mắt lại sắc như dao.',
    'Mập mạp, bụng phệ, luôn nở nụ cười hòa ái, trông như một vị phú gia hiền lành.',
    'Thân hình cao lớn, vạm vỡ, cơ bắp cuồn cuộn, da ngăm đen, trông như một ngọn núi.',
    'Khuôn mặt thanh tú, da trắng như tuyết, môi đỏ như son, đẹp như tranh vẽ.',
    'Mắt xếch, môi mỏng, nụ cười nhếch mép, toát lên vẻ xảo quyệt, mưu mô.',
    'Tóc bạc phơ, râu dài đến ngực, khuôn mặt đầy nếp nhăn, nhưng ánh mắt lại tinh anh.',
    'Đầu trọc lốc, trên đầu có sáu chấm hương sẹo, mặc áo cà sa, tay cầm tràng hạt.',
    'Mặc đạo bào, tay cầm phất trần, phong thái tiên phong đạo cốt.',
    'Mặc y phục dạ hành đen tuyền, chỉ để lộ đôi mắt lạnh lẽo, vô tình.',
    'Mặc chiến giáp uy vũ, tay cầm trường thương, khí thế hiên ngang, lẫm liệt.',
    'Mặc cẩm bào lụa là, đeo ngọc bội, tay cầm quạt giấy, phong lưu phóng khoáng.',
    'Mặc áo vải thô sơ, đi dép rơm, trông như một người nông dân bình thường.',
    'Mặc y phục rách rưới, tóc tai bù xù, người bốc mùi hôi thối, trông như một kẻ ăn mày.',
    'Khuôn mặt bị hủy dung, chằng chịt sẹo, trông vô cùng đáng sợ.',
    'Cụt một tay, nhưng tay còn lại cầm kiếm vô cùng vững chắc.',
    'Mù hai mắt, nhưng thính giác cực kỳ nhạy bén, có thể nghe tiếng gió đoán vị trí.',
    'Đi thọt một chân, nhưng di chuyển lại vô cùng linh hoạt, quỷ dị.',
    'Trên mặt có một vết sẹo dài từ trán xuống cằm, tăng thêm vẻ hung hãn.',
    'Có một nốt ruồi son giữa trán, trông vô cùng đặc biệt.',
    'Mắt hai màu, một bên xanh, một bên đỏ, trông vô cùng tà dị.',
    'Tóc màu bạch kim, dài chấm gót, bay lượn trong gió.',
    'Tóc màu đỏ rực, như ngọn lửa đang bùng cháy.'
];
const PERSONALITY_PRESETS = [
    'Chí khí cao vời, coi trọng nghĩa khí, ghét ác như thù, luôn sẵn lòng giúp đỡ kẻ yếu.',
    'Lạnh lùng cô độc, ít nói cười, hành sự quyết đoán, chỉ tin tưởng vào bản thân và thanh kiếm trong tay.',
    'Phóng khoáng tự tại, tiêu diêu giang hồ, yêu rượu và thơ ca, không thích sự ràng buộc của quy tắc.',
    'Tâm cơ thâm trầm, mưu định sau mới hành động, giỏi che giấu cảm xúc, khó lòng nhìn thấu.',
    'Hiền lành chất phác, thật thà bao dung, luôn nhìn thấy điểm tốt ở người khác, tâm tính thiện lương.',
    'Kiêu ngạo bất khuất, khí thế lăng người, không bao giờ chịu cúi đầu trước cường quyền.',
    'Trầm tĩnh điềm đạm, suy nghĩ thấu đáo, hành sự cẩn trọng, là người đáng tin cậy trong mọi tình huống.',
    'Hoạt bát lém lỉnh, ham học hỏi, tính tình tò mò, đôi khi hơi tinh quái nhưng bản chất tốt.',
    'Chính trực vô tư, tuân thủ đạo lý, kiên định với lý tưởng của bản thân dù gặp bao gian khổ.',
    'Âm trầm quái gở, lời nói sắc sảo, hành tung bí ẩn, khiến người khác vừa sợ vừa kính.',
    'Sát phạt quả đoán, nhổ cỏ tận gốc, tuyệt đối không để lại hậu họa.',
    'Cẩn thận chặt chẽ, luôn chừa cho mình đường lui, không bao giờ tin tưởng ai hoàn toàn.',
    'Điên cuồng khát máu, càng trong nghịch cảnh càng hưng phấn, coi chiến đấu là lẽ sống.',
    'Bề ngoài ôn hòa, nho nhã nhưng bên trong tàn nhẫn, mưu mô xảo quyệt.',
    'Chỉ quan tâm đến lợi ích, không màng tình cảm, sẵn sàng bán đứng tất cả vì trường sinh.',
    'Tham lam, keo kiệt, coi tiền như mạng, sẵn sàng làm mọi thứ vì tiền.',
    'Háo sắc, phong lưu, thấy gái đẹp là không rời mắt, dễ bị mỹ nhân kế.',
    'Nhát gan, sợ chết, gặp nguy hiểm là bỏ chạy đầu tiên, luôn tìm cách bảo toàn tính mạng.',
    'Nóng nảy, lỗ mãng, hành động thiếu suy nghĩ, dễ bị kích động.',
    'Bảo thủ, cố chấp, không chịu lắng nghe ý kiến người khác, luôn cho mình là đúng.',
    'Tự ti, mặc cảm, luôn nghĩ mình kém cỏi, không dám thể hiện bản thân.',
    'Kiêu ngạo, tự phụ, coi thường người khác, luôn cho mình là nhất.',
    'Đa nghi, tào tháo, không tin tưởng bất kỳ ai, luôn nghi ngờ người khác có ý đồ xấu.',
    'Độc ác, tàn nhẫn, thích hành hạ người khác, không có tính người.',
    'Giả tạo, đạo đức giả, bề ngoài thì tỏ ra tốt bụng, nhưng bên trong lại mưu mô xảo quyệt.',
    'Lười biếng, ỷ lại, không muốn làm việc, chỉ thích hưởng thụ.',
    'Vô trách nhiệm, đùn đẩy lỗi lầm cho người khác, không dám nhận sai.',
    'Ba phải, gió chiều nào che chiều ấy, không có lập trường vững vàng.',
    'Nịnh bợ, luồn cúi, luôn tìm cách lấy lòng cấp trên, chà đạp cấp dưới.',
    'Ghen tị, đố kỵ, không muốn ai hơn mình, luôn tìm cách dìm hàng người khác.',
    'Thù dai, nhớ lâu, ai đắc tội là nhớ mãi không quên, tìm cơ hội trả thù.',
    'Cố chấp, thù hận, sống chỉ để trả thù, không quan tâm đến bất cứ điều gì khác.',
    'Tuyệt vọng, bi quan, luôn nghĩ đến những điều tồi tệ nhất, không có niềm tin vào cuộc sống.',
    'Điên loạn, mất trí, hành động không kiểm soát, không ai đoán trước được.',
    'Lạnh nhạt, vô tình, không quan tâm đến bất kỳ ai, kể cả người thân.',
    'Ngây thơ, trong sáng, dễ tin người, dễ bị lừa gạt.',
    'Tốt bụng, hiền lành, luôn sẵn sàng giúp đỡ người khác, không màng danh lợi.',
    'Dũng cảm, kiên cường, không sợ gian khổ, luôn tiến về phía trước.',
    'Thông minh, tài trí, suy nghĩ logic, giải quyết vấn đề nhanh chóng.',
    'Hài hước, vui tính, luôn mang lại tiếng cười cho mọi người.',
    'Lãng mạn, mộng mơ, thích những điều bay bổng, không thực tế.',
    'Thực dụng, tính toán, luôn cân nhắc lợi hại trước khi làm bất cứ việc gì.',
    'Trầm cảm, u sầu, luôn mang trong mình một nỗi buồn không tên.',
    'Lạc quan, yêu đời, luôn nhìn thấy mặt tốt của vấn đề.',
    'Bình tĩnh, điềm đạm, không bao giờ hoảng loạn trước khó khăn.'
];
const CUSTOM_TALENT_STORAGE_KEY = 'new_game_custom_talents';
const CUSTOM_BACKGROUND_STORAGE_KEY = 'new_game_custom_backgrounds';
const WIZARD_SAVE_KEY = 'wuxia_wizard_autosave';

// === Talent Point System Constants ===
const BASE_TALENT_POINTS = 4;
const RANK_COLORS: Record<TalentRank, { border: string; bg: string; text: string; badge: string; glow: string }> = {
    'Huyền thoại': { border: 'border-yellow-400', bg: 'bg-yellow-400/10', text: 'text-yellow-400', badge: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50', glow: 'shadow-yellow-400/20' },
    'Sử Thi': { border: 'border-purple-400', bg: 'bg-purple-400/10', text: 'text-purple-400', badge: 'bg-purple-400/20 text-purple-300 border-purple-400/50', glow: 'shadow-purple-400/20' },
    'Hiếm': { border: 'border-blue-400', bg: 'bg-blue-400/10', text: 'text-blue-400', badge: 'bg-blue-400/20 text-blue-300 border-blue-400/50', glow: 'shadow-blue-400/20' },
    'Thường': { border: 'border-green-400', bg: 'bg-green-400/10', text: 'text-green-400', badge: 'bg-green-400/20 text-green-300 border-green-400/50', glow: 'shadow-green-400/20' },
    'Cực Hạn': { border: 'border-red-600', bg: 'bg-red-600/10', text: 'text-red-400', badge: 'bg-red-600/20 text-red-300 border-red-600/50', glow: 'shadow-red-600/20' },
    'Khắc nghiệt': { border: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/50', glow: 'shadow-orange-500/20' },
    'Khó': { border: 'border-amber-400', bg: 'bg-amber-400/10', text: 'text-amber-400', badge: 'bg-amber-400/20 text-amber-300 border-amber-400/50', glow: 'shadow-amber-400/20' },
};
const DEBUFF_RANKS: TalentRank[] = ['Cực Hạn', 'Khắc nghiệt', 'Khó'];
const BUFF_RANKS: TalentRank[] = ['Huyền thoại', 'Sử Thi', 'Hiếm', 'Thường'];
const DIFFICULTY_OPTIONS: Array<{ value: GameDifficulty; label: string }> = [
    { value: 'relaxed', label: 'Thư giãn (Chế độ truyện)' },
    { value: 'easy', label: 'Dễ (Tân thủ giang hồ)' },
    { value: 'normal', label: 'Bình thường (Trải nghiệm tiêu chuẩn)' },
    { value: 'hard', label: 'Khó (Gươm đao lóe sáng)' },
    { value: 'extreme', label: 'Cực hạn (Địa ngục A-tu-la)' },
    { value: 'custom', label: 'Tùy chỉnh (Theo thư viện prompt)' }
];
const POWER_LEVEL_OPTIONS: Array<{ value: WorldGenConfig['powerLevel']; label: string }> = [
    { value: 'Low-tier Martial', label: 'Võ lực thấp (Quyền cước binh khí)' },
    { value: 'Mid-tier Martial', label: 'Võ lực trung (Nội lực phát ngoại)' },
    { value: 'High-tier Martial', label: 'Võ lực cao (Dời núi lấp biển)' },
    { value: 'Cultivations', label: 'Tu tiên (Trường sinh đắc đạo)' }
];
const WORLD_SIZE_OPTIONS: Array<{ value: WorldGenConfig['worldSize']; label: string }> = [
    { value: 'A tiny place', label: 'Một vùng nhỏ (Một đảo hoặc thành phố)' },
    { value: 'Grand Nine Provinces', label: 'Đại Cửu Châu (Vạn dặm sơn hà)' },
    { value: 'Endless planes', label: 'Bình diện vô tận (Đa thế giới)' }
];
const SECT_DENSITY_OPTIONS: Array<{ value: WorldGenConfig['sectDensity']; label: string }> = [
    { value: 'Rare', label: 'Hiếm có (Ẩn cư tự tại)' },
    { value: 'Moderate', label: 'Vừa phải (Vài môn phái lớn)' },
    { value: 'Standing like trees', label: 'Nhiều như rừng (Trăm nhà tranh luận)' }
];

const STORY_STYLE_OPTIONS: Array<{ value: StoryStyleType; label: string }> = [
    { value: 'Thông thường', label: 'Thông thường (Cốt truyện tự nhiên)' },
    { value: 'Tu luyện', label: 'Tu luyện (Vượt cấp, tranh đoạt)' },
    { value: 'Tu la tràng', label: 'Tu la tràng (Drama, tranh giành tình cảm)' },
    { value: 'Tu Tiên Ưu Ám', label: 'Tu Tiên Ưu Ám (U ám & Chân tình)' }
];



const STAT_LABELS: Record<string, string> = {
    strength: 'Sức mạnh',
    agility: 'Thân pháp',
    constitution: 'Thể chất',
    rootBone: 'Căn cốt',
    intelligence: 'Ngộ tính',
    luck: 'Phúc duyên',
    tamTinh: 'Tâm tính',
};

const STAT_COLORS: Record<string, string> = {
    strength: '#ef4444',      // Red
    agility: '#22c55e',       // Green
    constitution: '#eab308',  // Yellow
    rootBone: '#3b82f6',      // Blue
    intelligence: '#a855f7',  // Purple
    luck: '#f97316',          // Orange
    tamTinh: '#06b6d4',       // Cyan
};

const STAT_ICONS: Record<string, React.ReactNode> = {
    strength: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <path d="M14.5 7L12 4.5L9.5 7" /><path d="M12 4.5V21" /><path d="M7 16l5 5 5-5" /><path d="M2 12h20" />
        </svg>
    ),
    agility: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    ),
    constitution: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    rootBone: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    ),
    intelligence: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
    ),
    luck: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    tamTinh: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 0 20" />
        </svg>
    ),
};
const GENDER_LABELS: Record<string, string> = { 'Male': 'Nam', 'Female': 'Nữ' };


type DropdownProps = {
    value: number;
    options: number[];
    suffix: string;
    open: boolean;
    onToggle: () => void;
    onSelect: (next: number) => void;
    containerRef: React.RefObject<HTMLDivElement>;
};

const CompactDropdown: React.FC<DropdownProps> = ({
    value,
    options,
    suffix,
    open,
    onToggle,
    onSelect,
    containerRef,
}) => (
    <div className="relative" ref={containerRef}>
        <button
            type="button"
            onClick={onToggle}
            className="w-full bg-transparent border border-wuxia-gold/30 p-3 text-wuxia-gold outline-none focus:border-wuxia-gold rounded-md flex items-center justify-between gap-2 transition-all shadow-inner shadow-black/40"
        >
            <span className="font-mono text-sm">{value}{suffix}</span>
            <svg
                className={`w-4 h-4 text-wuxia-gold/40 transition-transform ${open ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
        </button>
        {open && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-black/95 border border-wuxia-gold/20 rounded-md shadow-[0_12px_30px_rgba(0,0,0,0.6)] z-50">
                <div className="max-h-[336px] overflow-y-auto custom-scrollbar py-1">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => onSelect(opt)}
                            className={`w-full px-3 h-7 flex items-center text-sm font-mono transition-colors ${opt === value ? 'bg-wuxia-gold/20 text-wuxia-gold' : 'text-gray-300 hover:bg-wuxia-gold/[0.05]'
                                }`}
                        >
                            {opt}{suffix}
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const NewGameWizard: React.FC<Props> = ({ onComplete, onCancel, loading, requestConfirm }) => {
    const [step, setStep] = useState(0);

    // --- State: World Config ---
    const [worldConfig, setWorldConfig] = useState<WorldGenConfig>({
        worldName: '',
        powerLevel: 'Mid-tier Martial',
        worldSize: 'Grand Nine Provinces',
        dynastySetting: '',
        sectDensity: 'Standing like trees',
        tianjiaoSetting: '',
        difficulty: 'normal' as GameDifficulty, // Default difficulty
        storyStyle: 'Thông thường'
    });

    // --- State: Character Config ---
    const [charName, setCharName] = useState('');
    const [charGender, setCharGender] = useState<'Male' | 'Female'>('Male');
    const [charAge, setCharAge] = useState(18);
    const [charAppearance, setCharAppearance] = useState('');
    const [charPersonality, setCharPersonality] = useState('');
    const [birthMonth, setBirthMonth] = useState(1);
    const [birthDay, setBirthDay] = useState(1);
    const [monthOpen, setMonthOpen] = useState(false);
    const [dayOpen, setDayOpen] = useState(false);
    const monthRef = useRef<HTMLDivElement>(null);
    const dayRef = useRef<HTMLDivElement>(null);

    // Attributes (Total 60 points to distribute)
    const MAX_POINTS = 60;
    const [stats, setStats] = useState({
        strength: 5, agility: 5, constitution: 5, rootBone: 5, intelligence: 5, luck: 5, tamTinh: 5
    });

    const radarData = useMemo(() => Object.entries(stats).map(([key, val]) => ({
        label: STAT_LABELS[key] || key,
        value: val,
        color: STAT_COLORS[key] || '#e6c86e'
    })) as RadarData[], [stats]);

    // Talents & Background
    const [selectedBackground, setSelectedBackground] = useState<Background>(PresetBackground[0]);
    const [selectedTalents, setSelectedTalents] = useState<Talent[]>([]);
    const [customTalentList, setCustomTalentList] = useState<Talent[]>([]);
    const [customBackgroundList, setCustomBackgroundList] = useState<Background[]>([]);

    // Gacha animation state
    const [gachaFlash, setGachaFlash] = useState<string | null>(null);
    const triggerGacha = (key: string, action: () => void) => {
        setGachaFlash(key);
        action();
        setTimeout(() => setGachaFlash(null), 600);
    };

    // Random helpers
    const randomFrom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randomWorldName = () => setWorldConfig(c => ({ ...c, worldName: randomFrom(WORLD_NAMES) }));
    const randomDynasty = () => setWorldConfig(c => ({ ...c, dynastySetting: randomFrom(DYNASTY_PRESETS) }));
    const randomTianjiao = () => setWorldConfig(c => ({ ...c, tianjiaoSetting: randomFrom(TIANJIAO_PRESETS) }));
    const randomCharName = () => setCharName(charGender === 'Female' ? randomFrom(FEMALE_NAMES) : randomFrom(MALE_NAMES));
    const randomAppearance = () => setCharAppearance(randomFrom(APPEARANCE_PRESETS));
    const randomPersonality = () => setCharPersonality(randomFrom(PERSONALITY_PRESETS));
    const gachaBackground = () => {
        if (filteredBackgroundOptions.length === 0) return;
        const idx = Math.floor(Math.random() * filteredBackgroundOptions.length);
        setSelectedBackground(filteredBackgroundOptions[idx]);
    };
    const gachaTalent = () => {
        const totalPoints = BASE_TALENT_POINTS + selectedTalents.filter(t => t.cost < 0).reduce((sum, t) => sum + Math.abs(t.cost), 0);
        const spentPoints = selectedTalents.filter(t => t.cost > 0).reduce((sum, t) => sum + t.cost, 0);
        const available = totalPoints - spentPoints;
        const unselected = allTalentOptions.filter(t => !selectedTalents.find(x => x.name === t.name) && t.cost > 0 && t.cost <= available);
        if (unselected.length === 0) return;
        const pick = randomFrom(unselected);
        setSelectedTalents(prev => [...prev, pick]);
    };

    // Custom Inputs
    const [customTalent, setCustomTalent] = useState<Talent>({ name: '', description: '', effect: '', rank: 'Thường', cost: 2 });
    const [talentFilter, setTalentFilter] = useState<'all' | TalentRank>('all');
    const [showCustomTalent, setShowCustomTalent] = useState(false);
    const [showCustomDebuff, setShowCustomDebuff] = useState(false);
    const [customBackground, setCustomBackground] = useState<Background>({ name: '', description: '', effect: '' });
    const [showCustomBackground, setShowCustomBackground] = useState(false);
    const [openingStreaming, setOpeningStreaming] = useState(true);
    const [saveMsg, setSaveMsg] = useState('');

    const showSaveLoadMsg = (msg: string) => {
        setSaveMsg(msg);
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const saveWizardConfig = async () => {
        const config = {
            step, worldConfig, charName, charGender, charAge, charAppearance, charPersonality,
            birthMonth, birthDay, stats, selectedBackground, selectedTalents, openingStreaming
        };
        try {
            await dbService.saveSetting(WIZARD_SAVE_KEY, config);
            showSaveLoadMsg('Đã lưu bản nháp!');
        } catch (e) {
            console.error(e);
            showSaveLoadMsg('Lưu thất bại!');
        }
    };

    const loadWizardConfig = async () => {
        try {
            const saved = await dbService.getSetting(WIZARD_SAVE_KEY);
            if (!saved || typeof saved !== 'object') {
                showSaveLoadMsg('Không thấy bản lưu!');
                return;
            }
            // Use logical updates for each piece of state
            if (typeof saved.step === 'number') setStep(saved.step);
            if (saved.worldConfig) setWorldConfig({ ...worldConfig, ...saved.worldConfig });
            if (typeof saved.charName === 'string') setCharName(saved.charName);
            if (saved.charGender) setCharGender(saved.charGender);
            if (typeof saved.charAge === 'number') setCharAge(saved.charAge);
            if (typeof saved.charAppearance === 'string') setCharAppearance(saved.charAppearance);
            if (typeof saved.charPersonality === 'string') setCharPersonality(saved.charPersonality);
            if (typeof saved.birthMonth === 'number') setBirthMonth(saved.birthMonth);
            if (typeof saved.birthDay === 'number') setBirthDay(saved.birthDay);
            if (saved.stats) setStats({ ...stats, ...saved.stats });
            if (saved.selectedBackground) setSelectedBackground(saved.selectedBackground);
            if (Array.isArray(saved.selectedTalents)) setSelectedTalents(saved.selectedTalents);
            if (typeof saved.openingStreaming === 'boolean') setOpeningStreaming(saved.openingStreaming);

            showSaveLoadMsg('Tải thành công!');
        } catch (e) {
            console.error(e);
            showSaveLoadMsg('Lỗi khi tải!');
        }
    };

    // --- Logic ---
    const monthOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
    const dayOptions = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
    const standardizeTalent = (raw: Talent): Talent | null => {
        const name = raw?.name?.trim() || '';
        const description = raw?.description?.trim() || '';
        const effect = raw?.effect?.trim() || '';
        if (!name || !description || !effect) return null;
        return {
            ...raw,
            name,
            description,
            effect,
            rank: raw.rank || 'Thường',
            cost: raw.cost ?? 2,
            conflictsWith: raw.conflictsWith || [],
            excludedBackgrounds: raw.excludedBackgrounds || []
        };
    };
    const standardizeBackground = (raw: Background): Background | null => {
        const name = raw?.name?.trim() || '';
        const description = raw?.description?.trim() || '';
        const effect = raw?.effect?.trim() || '';
        if (!name || !description || !effect) return null;
        return { name, description, effect, rank: raw.rank || 'Bình thường' };
    };
    const mergeAndDeduplicateTalents = (rawList: Talent[]): Talent[] => {
        const map = new Map<string, Talent>();
        rawList.forEach((item) => {
            const normalized = standardizeTalent(item);
            if (!normalized) return;
            map.set(normalized.name, normalized);
        });
        return Array.from(map.values());
    };
    const mergeAndDeduplicateBackgrounds = (rawList: Background[]): Background[] => {
        const map = new Map<string, Background>();
        rawList.forEach((item) => {
            const normalized = standardizeBackground(item);
            if (!normalized) return;
            map.set(normalized.name, normalized);
        });
        return Array.from(map.values());
    };
    const allBackgroundOptions = useMemo(
        () => [...PresetBackground, ...customBackgroundList.filter(item => !PresetBackground.some(p => p.name === item.name))],
        [customBackgroundList]
    );

    const filteredBackgroundOptions = useMemo(() => {
        const diff = worldConfig.difficulty;
        return allBackgroundOptions.filter(bg => {
            const rank = bg.rank || 'Bình thường';
            // Mapping:
            // relaxed, easy -> All (Dễ, Bình thường, Khó, Cực khó)
            // normal -> Bình thường, Khó, Cực khó
            // hard -> Khó, Cực khó
            // extreme -> Cực khó
            if (diff === 'relaxed' || diff === 'easy') return true;
            if (diff === 'normal') return ['Bình thường', 'Khó', 'Cực khó'].includes(rank);
            if (diff === 'hard') return ['Khó', 'Cực khó'].includes(rank);
            if (diff === 'extreme') return rank === 'Cực khó';
            return true;
        });
    }, [allBackgroundOptions, worldConfig.difficulty]);

    const allTalentOptions = useMemo(
        () => [...PresetTalent, ...customTalentList.filter(item => !PresetTalent.some(p => p.name === item.name))],
        [customTalentList]
    );

    const usedPoints = (Object.values(stats) as number[]).reduce((a, b) => a + b, 0);
    const remainingPoints = MAX_POINTS - usedPoints;
    const stepProgress = ((step + 1) / STEPS.length) * 100;
    const currentStepLabel = STEPS[step] || 'Tạo';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (monthRef.current && monthRef.current.contains(target)) return;
            if (dayRef.current && dayRef.current.contains(target)) return;
            setMonthOpen(false);
            setDayOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const loadCustomConfig = async () => {
            try {
                const savedTalents = await dbService.getSetting(CUSTOM_TALENT_STORAGE_KEY);
                const savedBackgrounds = await dbService.getSetting(CUSTOM_BACKGROUND_STORAGE_KEY);
                if (Array.isArray(savedTalents)) {
                    setCustomTalentList(mergeAndDeduplicateTalents(savedTalents as Talent[]));
                }
                if (Array.isArray(savedBackgrounds)) {
                    setCustomBackgroundList(mergeAndDeduplicateBackgrounds(savedBackgrounds as Background[]));
                }
            } catch (error) {
                console.error('Load custom identity/Talent failed', error);
            }
        };
        loadCustomConfig();
    }, []);

    const handleStatChange = (key: keyof typeof stats, delta: number) => {
        const current = stats[key];
        if (delta > 0 && remainingPoints <= 0) return;
        if (delta > 0 && current >= 20) return; // 20-point cap
        if (delta < 0 && current <= 1) return;
        setStats({ ...stats, [key]: current + delta });
    };

    // Talent point calculations
    const selectedDebuffs = selectedTalents.filter(t => t.cost < 0);
    const selectedBuffs = selectedTalents.filter(t => t.cost > 0);
    const debuffPoints = selectedDebuffs.reduce((sum, t) => sum + Math.abs(t.cost), 0);
    const totalTalentPoints = BASE_TALENT_POINTS + debuffPoints;
    const spentTalentPoints = selectedBuffs.reduce((sum, t) => sum + t.cost, 0);
    const remainingTalentPoints = totalTalentPoints - spentTalentPoints;
    const hasDebuff = selectedDebuffs.length > 0;

    const toggleTalent = (t: Talent) => {
        if (selectedTalents.find(x => x.name === t.name)) {
            setSelectedTalents(selectedTalents.filter(x => x.name !== t.name));
        } else {
            // Check Background Exclusion
            if (t.excludedBackgrounds?.includes(selectedBackground.name)) {
                alert(`Thân thế "${selectedBackground.name}" không thể chọn thiên bẩm này!`);
                return;
            }

            // Check Talent Conflicts
            const conflict = selectedTalents.find(s =>
                t.conflictsWith?.includes(s.name) || s.conflictsWith?.includes(t.name)
            );
            if (conflict) {
                alert(`Xung đột! Không thể chọn cùng với "${conflict.name}".`);
                return;
            }

            if (t.cost > 0 && t.cost > remainingTalentPoints) {
                alert(`Không đủ điểm! Cần ${t.cost} điểm, còn ${remainingTalentPoints} điểm.`);
                return;
            }
            setSelectedTalents([...selectedTalents, t]);
        }
    };

    const addCustomTalent = async () => {
        const normalized = standardizeTalent(customTalent);
        if (!normalized) {
            alert("Vui lòng điền đầy đủ thiên bẩm tùy chỉnh (Tên/Mô tả/Hiệu ứng)");
            return;
        }
        const isAlreadySelected = selectedTalents.some(x => x.name === normalized.name);
        if (!isAlreadySelected && normalized.cost > 0 && normalized.cost > remainingTalentPoints) {
            alert(`Không đủ điểm! Cần ${normalized.cost} điểm, còn ${remainingTalentPoints} điểm.`);
            return;
        }

        const nextCustomTalentList = mergeAndDeduplicateTalents([...customTalentList, normalized]);
        setCustomTalentList(nextCustomTalentList);
        setSelectedTalents(
            isAlreadySelected
                ? selectedTalents.map(item => (item.name === normalized.name ? normalized : item))
                : [...selectedTalents, normalized]
        );
        setCustomTalent({ name: '', description: '', effect: '', rank: 'Thường', cost: 2 });
        setShowCustomTalent(false);
        try {
            await dbService.saveSetting(CUSTOM_TALENT_STORAGE_KEY, nextCustomTalentList);
        } catch (error) {
            console.error('Failed to save custom talent', error);
        }
    };

    const addCustomDebuff = async () => {
        const normalized = standardizeTalent(customTalent);
        if (!normalized) {
            alert("Vui lòng điền đầy đủ bất lợi tùy chỉnh (Tên/Mô tả/Hiệu ứng)");
            return;
        }

        const nextCustomTalentList = mergeAndDeduplicateTalents([...customTalentList, normalized]);
        setCustomTalentList(nextCustomTalentList);
        setSelectedTalents([...selectedTalents, normalized]);
        setCustomTalent({ name: '', description: '', effect: '', rank: 'Khó', cost: -2 });
        setShowCustomDebuff(false);
        try {
            await dbService.saveSetting(CUSTOM_TALENT_STORAGE_KEY, nextCustomTalentList);
        } catch (error) {
            console.error('Failed to save custom debuff', error);
        }
    };

    const addCustomBackground = async () => {
        const name = customBackground.name.trim();
        const description = customBackground.description.trim();
        const effect = customBackground.effect.trim();
        if (!name || !description || !effect) {
            alert("Vui lòng điền đầy đủ thân thế tùy chỉnh (Tên/Mô tả/Hiệu ứng)");
            return;
        }
        const nextBg: Background = { name, description, effect, rank: 'Bình thường' };
        const nextCustomBackgroundList = mergeAndDeduplicateBackgrounds([...customBackgroundList, nextBg]);
        setCustomBackgroundList(nextCustomBackgroundList);
        setSelectedBackground(nextBg);
        setCustomBackground({ name: '', description: '', effect: '' });
        setShowCustomBackground(false);
        try {
            await dbService.saveSetting(CUSTOM_BACKGROUND_STORAGE_KEY, nextCustomBackgroundList);
        } catch (error) {
            console.error('Failed to save custom identity', error);
        }
    };

    const handleGenerate = async () => {
        if (!charName.trim()) {
            alert("Vui lòng nhập tên nhân vật trước");
            setStep(1); // Go to Hồ sơ step
            return;
        }

        // Construct final character data object
        const charData: CharacterData = {
            // Format birthday string from state
            birthDate: `${birthMonth}Tháng${birthDay}Ngày`,

            ...stats, // Strength, agility, constitution, rootBone, intelligence, luck, tamTinh
            name: charName.trim(),
            gender: charGender === 'Male' ? 'Nam' : 'Nữ',
            age: charAge,
            appearance: charAppearance.trim() || 'Ngoại hình bình thường, ăn mặc giản dị.',
            personality: charPersonality.trim() || 'Tâm tính chính trực, hành hiệp trượng nghĩa.',
            talentList: selectedTalents,
            background: selectedBackground,

            // Lưu chỉ số thiên bẩm ban đầu (baseStats)
            baseStats: { ...stats },

            // Defaults
            title: "", realm: "",
            sectId: "none", sectPosition: "None", sectContribution: 0,
            money: { gold: 0, silver: 0, copper: 0 },
            currentEnergy: 100, maxEnergy: 100,
            currentFullness: 80, maxFullness: 100,
            currentThirst: 80, maxThirst: 100,
            currentWeight: 0, maxWeight: 100 + (stats.strength * 10),

            headCurrentHp: 100, headMaxHp: 100, headStatus: "Normal",
            chestCurrentHp: 100, chestMaxHp: 100, chestStatus: "Normal",
            abdomenCurrentHp: 100, abdomenMaxHp: 100, abdomenStatus: "Normal",
            leftArmCurrentHp: 100, leftArmMaxHp: 100, leftArmStatus: "Normal",
            rightArmCurrentHp: 100, rightArmMaxHp: 100, rightArmStatus: "Normal",
            leftLegCurrentHp: 100, leftLegMaxHp: 100, leftLegStatus: "Normal",
            rightLegCurrentHp: 100, rightLegMaxHp: 100, rightLegStatus: "Normal",

            equipment: { head: "None", chest: "None", legs: "None", hands: "None", feet: "None", mainWeapon: "None", subWeapon: "None", hiddenWeapon: "None", back: "None", waist: "None", mount: "None" },
            itemList: [], kungfuList: [],
            currentExp: 0, levelUpExp: 100, playerBuffs: []
        };

        onComplete(worldConfig, charData, openingStreaming ? 'all' : 'step', openingStreaming);
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-black/95 relative overflow-hidden p-2 md:p-10 z-50">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none"></div>

            {/* Main Container */}
            <div className="w-full max-w-5xl h-full border border-wuxia-gold/30 rounded-lg md:rounded-xl bg-black/50 shadow-2xl flex flex-col overflow-hidden relative backdrop-blur-sm">

                <div className="hidden md:flex h-16 border-b border-wuxia-gold/10 items-center justify-between px-8 bg-black/40">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-serif font-bold text-wuxia-gold tracking-widest">Sáng tác</h2>
                        {saveMsg && (
                            <div className="text-[10px] font-mono text-wuxia-gold/80 bg-wuxia-gold/10 px-2 py-1 rounded border border-wuxia-gold/20 animate-fade-in">
                                {saveMsg}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex gap-2">
                            {STEPS.map((s, idx) => (
                                <div key={idx} className={`flex items-center gap-2 ${idx === step ? 'text-wuxia-gold' : 'text-wuxia-gold/30'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${idx === step ? 'border-wuxia-gold bg-wuxia-gold/20 shadow-[0_0_10px_rgba(230,200,110,0.3)]' : 'border-wuxia-gold/20'}`}>
                                        {idx + 1}
                                    </div>
                                    <span className="text-xs font-bold hidden md:block">{s}</span>
                                    {idx < STEPS.length - 1 && <div className="w-8 h-px bg-wuxia-gold/10 hidden md:block"></div>}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-1 px-2 rounded hover:bg-white/5 text-wuxia-gold/40 hover:text-red-500 transition-all flex items-center gap-1 group border border-transparent hover:border-red-500/20"
                            title="Đóng"
                        >
                            <span className="text-[11px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">THOÁT</span>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="md:hidden border-b border-wuxia-gold/10 bg-black/50 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-serif font-bold text-wuxia-gold tracking-wider">Sáng tác</h2>
                        <span className="text-[11px] text-wuxia-gold/40 font-mono">{step + 1}/{STEPS.length}</span>
                    </div>
                    <div className="mt-2 text-xs text-wuxia-gold font-bold tracking-widest">{currentStepLabel}</div>
                    <div className="mt-2 h-1 w-full bg-black/60 border border-wuxia-gold/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-wuxia-gold shadow-[0_0_5px_rgba(230,200,110,0.5)] transition-all duration-300"
                            style={{ width: `${stepProgress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-black/20 relative">

                    {/* STEP 1: WORLD SETTINGS */}
                    {step === 0 && (
                        <div className="animate-slide-in max-w-4xl mx-auto">
                            <OrnateBorder className="p-4 md:p-8">
                                <h3 className="text-xl font-serif font-bold text-wuxia-gold border-b border-wuxia-gold/30 pb-3 mb-6">Thiết lập quy luật thế giới</h3>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Tên thế giới</label>
                                            <div className="relative">
                                                <input
                                                    value={worldConfig.worldName}
                                                    onChange={e => setWorldConfig({ ...worldConfig, worldName: e.target.value })}
                                                    placeholder="Nhập tên thế giới..."
                                                    className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-3 pr-12 text-wuxia-gold outline-none rounded-md transition-all font-serif tracking-wider placeholder-wuxia-gold/30"
                                                />
                                                <button
                                                    onClick={randomWorldName}
                                                    title="Random tên thế giới"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-wuxia-gold/15 text-wuxia-gold transition-all duration-200 text-lg hover:scale-110 active:scale-95"
                                                ><Dices className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Độ khó</label>
                                            <InlineSelect
                                                value={worldConfig.difficulty}
                                                options={DIFFICULTY_OPTIONS}
                                                onChange={(val) => setWorldConfig(prev => ({ ...prev, difficulty: val as GameDifficulty }))}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Hệ thống vũ lực</label>
                                            <InlineSelect
                                                value={worldConfig.powerLevel}
                                                options={POWER_LEVEL_OPTIONS}
                                                onChange={(val) => setWorldConfig(prev => ({ ...prev, powerLevel: val as WorldGenConfig['powerLevel'] }))}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Bản đồ thế giới</label>
                                            <InlineSelect
                                                value={worldConfig.worldSize}
                                                options={WORLD_SIZE_OPTIONS}
                                                onChange={(val) => setWorldConfig(prev => ({ ...prev, worldSize: val as WorldGenConfig['worldSize'] }))}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Mật độ môn phái</label>
                                            <InlineSelect
                                                value={worldConfig.sectDensity}
                                                options={SECT_DENSITY_OPTIONS}
                                                onChange={(val) => setWorldConfig(prev => ({ ...prev, sectDensity: val as WorldGenConfig['sectDensity'] }))}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-wuxia-gold group-hover:text-amber-300 transition-colors block italic">Phong cách truyện</label>
                                            <InlineSelect
                                                value={worldConfig.storyStyle || 'Thông thường'}
                                                options={STORY_STYLE_OPTIONS}
                                                onChange={(val) => setWorldConfig(prev => ({ ...prev, storyStyle: val as StoryStyleType }))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-wuxia-gold font-serif font-bold italic opacity-80 block">Bối cảnh triều đại (Tùy chỉnh)</label>
                                        <div className="relative">
                                            <input
                                                value={worldConfig.dynastySetting}
                                                onChange={e => setWorldConfig({ ...worldConfig, dynastySetting: e.target.value })}
                                                placeholder="Anh hùng tranh đỉnh, cuối triều đại suy tàn"
                                                className="w-full bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-3 pr-24 text-wuxia-gold outline-none rounded-md transition-all font-serif tracking-wider placeholder-wuxia-gold/30"
                                            />
                                            <button
                                                onClick={randomDynasty}
                                                title="AI ngẫu nhiên bối cảnh triều đại"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-wuxia-gold/15 text-wuxia-gold transition-all duration-200 text-lg hover:scale-110 active:scale-95"
                                            >
                                                <Dices className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-wuxia-gold font-serif font-bold italic opacity-80 block">Thiên kiều/Thiết lập vũ lực (Tùy chỉnh)</label>
                                        <div className="relative">
                                            <textarea
                                                value={worldConfig.tianjiaoSetting}
                                                onChange={e => setWorldConfig({ ...worldConfig, tianjiaoSetting: e.target.value })}
                                                placeholder="Thời kỳ tranh giành, thiên tài xuất hiện đồng loạt"
                                                className="w-full h-24 bg-transparent border border-wuxia-gold/20 focus:border-wuxia-gold p-3 pr-24 text-wuxia-gold outline-none rounded-md transition-all resize-none font-serif placeholder-wuxia-gold/30"
                                            />
                                            <button
                                                onClick={randomTianjiao}
                                                title="AI ngẫu nhiên thiết lập thiên kiều"
                                                className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-wuxia-gold/15 text-wuxia-gold transition-all duration-200 text-lg hover:scale-110 active:scale-95"
                                            >
                                                <Dices className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </OrnateBorder>
                        </div>
                    )}

                    {/* STEP 2: PROFILE (Hồ sơ) */}
                    {step === 1 && (
                        <div className="animate-slide-in relative z-10 w-full">
                            <h3 className="text-2xl font-serif font-bold text-wuxia-gold border-b border-wuxia-gold/30 pb-3 mb-8 flex items-center gap-3">
                                <span className="bg-wuxia-gold/20 p-2 rounded-full"><Users className="w-5 h-5" /></span>
                                Hồ sơ hiệp khách
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-stretch">
                                {/* Info Panel */}
                                <div className="md:col-span-2 flex flex-col">
                                    <OrnateBorder className="p-8 bg-black/40 backdrop-blur-md h-full">
                                        <div className="space-y-2 relative group">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm text-wuxia-gold/70 font-serif font-bold italic block group-hover:text-amber-300 transition-colors">Họ và tên</label>
                                                <button onClick={randomCharName} className="text-wuxia-gold/50 hover:text-wuxia-gold transition-colors" title="Tên ngẫu nhiên">
                                                    <Dices className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <input
                                                value={charName}
                                                onChange={e => setCharName(e.target.value)}
                                                placeholder="Nhập tôn hiệu của bạn..."
                                                className="w-full bg-transparent border-b border-wuxia-gold/20 focus:border-wuxia-gold py-3 text-wuxia-gold outline-none transition-all font-serif text-xl tracking-widest placeholder-wuxia-gold/20 italic"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 mt-8">
                                            <div className="space-y-4">
                                                <label className="text-sm text-wuxia-gold/70 font-serif font-bold italic block">Giới tính</label>
                                                <div className="flex gap-4">
                                                    <button onClick={() => setCharGender('Male')} className={`flex-1 py-3 rounded border transition-all ${charGender === 'Male' ? 'bg-wuxia-gold/20 border-wuxia-gold text-wuxia-gold shadow-[0_0_15px_rgba(230,200,110,0.2)]' : 'border-wuxia-gold/10 text-wuxia-gold/40 hover:border-wuxia-gold/30'}`}>Nam</button>
                                                    <button onClick={() => setCharGender('Female')} className={`flex-1 py-3 rounded border transition-all ${charGender === 'Female' ? 'bg-wuxia-gold/20 border-wuxia-gold text-wuxia-gold shadow-[0_0_15px_rgba(230,200,110,0.2)]' : 'border-wuxia-gold/10 text-wuxia-gold/40 hover:border-wuxia-gold/30'}`}>Nữ</button>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-sm text-wuxia-gold/70 font-serif font-bold italic block">Tuổi tác</label>
                                                <div className="flex items-center gap-4 bg-black/40 border border-wuxia-gold/20 p-2 rounded-lg">
                                                    <button onClick={() => setCharAge(Math.max(14, charAge - 1))} className="p-1 hover:text-wuxia-gold transition-colors"><Minus className="w-4 h-4" /></button>
                                                    <span className="flex-1 text-center font-mono text-xl text-wuxia-gold">{charAge}</span>
                                                    <button onClick={() => setCharAge(Math.min(100, charAge + 1))} className="p-1 hover:text-wuxia-gold transition-colors"><Plus className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mt-8">
                                            <label className="text-sm text-wuxia-gold/70 font-serif font-bold italic block">Ngày sinh</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative group">
                                                    <select value={birthMonth} onChange={e => setBirthMonth(Number(e.target.value))} className="w-full bg-black/40 border border-wuxia-gold/20 p-3 text-wuxia-gold rounded-md outline-none focus:border-wuxia-gold appearance-none font-serif">
                                                        {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1} className="bg-neutral-900">Tháng {i + 1}</option>)}
                                                    </select>
                                                </div>
                                                <div className="relative">
                                                    <select value={birthDay} onChange={e => setBirthDay(Number(e.target.value))} className="w-full bg-black/40 border border-wuxia-gold/20 p-3 text-wuxia-gold rounded-md outline-none focus:border-wuxia-gold appearance-none font-serif">
                                                        {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={i + 1} className="bg-neutral-900">Ngày {i + 1}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </OrnateBorder>
                                </div>

                                {/* Appearance & Personality */}
                                <div className="md:col-span-3 flex flex-col">
                                    <OrnateBorder className="p-8 bg-black/40 backdrop-blur-md h-full">
                                        <div className="space-y-6">
                                            <div className="space-y-4 group">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm text-wuxia-gold/70 font-serif font-bold italic block">Ngoại hình</label>
                                                    <button onClick={randomAppearance} className="text-wuxia-gold/50 hover:text-wuxia-gold transition-colors"><Dices className="w-4 h-4" /></button>
                                                </div>
                                                <textarea
                                                    value={charAppearance}
                                                    onChange={e => setCharAppearance(e.target.value)}
                                                    placeholder="Mô tả vẻ ngoài của bạn..."
                                                    className="w-full h-32 bg-black/20 border border-wuxia-gold/10 focus:border-wuxia-gold/40 p-4 text-wuxia-gold outline-none rounded-xl transition-all resize-none font-serif text-lg leading-relaxed shadow-inner"
                                                />
                                            </div>
                                            <div className="space-y-4 group">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm text-wuxia-gold/70 font-serif font-bold italic block">Tâm tính</label>
                                                    <button onClick={randomPersonality} className="text-wuxia-gold/50 hover:text-wuxia-gold transition-colors"><Dices className="w-4 h-4" /></button>
                                                </div>
                                                <textarea
                                                    value={charPersonality}
                                                    onChange={e => setCharPersonality(e.target.value)}
                                                    placeholder="Bản tính thực sự ẩn sau lớp vỏ bọc..."
                                                    className="w-full h-32 bg-black/20 border border-wuxia-gold/10 focus:border-wuxia-gold/40 p-4 text-wuxia-gold outline-none rounded-xl transition-all resize-none font-serif text-lg leading-relaxed shadow-inner"
                                                />
                                            </div>
                                        </div>
                                    </OrnateBorder>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: ATTRIBUTES (Thuộc tính) */}
                    {step === 2 && (
                        <div className="animate-slide-in relative z-10 w-full max-w-5xl mx-auto">
                            <h3 className="text-xl font-serif font-bold text-wuxia-gold border-b border-wuxia-gold/30 pb-3 mb-6 flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-wuxia-gold/20 p-1.5 rounded-full"><Swords className="w-4 h-4" /></span>
                                    Thuộc tính hiệp khách
                                </div>
                                <div className="text-xs font-mono flex items-center gap-4">
                                    <span className="text-gray-400">Điểm dư:</span>
                                    <span className={`text-xl font-bold ${remainingPoints > 0 ? 'text-green-400 animate-pulse' : 'text-red-400'}`}>
                                        {remainingPoints}
                                    </span>
                                </div>
                            </h3>

                            <OrnateBorder className="p-4 bg-black/40 backdrop-blur-md overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[440px]">
                                    {/* Left: Radar Chart (5 columns) */}
                                    <div className="lg:col-span-5 flex items-center justify-center bg-black/20 rounded-2xl border border-wuxia-gold/10 p-6 shadow-inner relative overflow-hidden h-full">
                                        <div className="w-full aspect-square max-w-[340px] flex items-center justify-center">
                                            <RadarChart
                                                data={radarData}
                                                size={300}
                                                maxValue={20}
                                            />
                                        </div>
                                    </div>

                                    {/* Right: Stat Bars (7 columns) */}
                                    <div className="lg:col-span-7 flex flex-col h-full">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            {(Object.keys(stats) as Array<keyof typeof stats & string>).map((key) => (
                                                <div key={key} className="bg-black/30 border border-wuxia-gold/10 p-3 rounded-lg hover:border-wuxia-gold/30 transition-all">
                                                    <StatBar
                                                        label={STAT_LABELS[key]}
                                                        value={stats[key]}
                                                        max={20}
                                                        showControls={true}
                                                        onIncrease={() => handleStatChange(key, 1)}
                                                        onDecrease={() => handleStatChange(key, -1)}
                                                        disabledIncrease={remainingPoints <= 0 || stats[key] >= 20}
                                                        disabledDecrease={stats[key] <= 1}
                                                        color={STAT_COLORS[key]}
                                                        icon={STAT_ICONS[key]}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 p-3 bg-wuxia-gold/5 rounded-lg border border-wuxia-gold/10 text-[10px] text-wuxia-gold/50 italic text-center">
                                            Phân bổ điểm thuộc tính khôn ngoan sẽ quyết định vận mệnh của bạn trong giang hồ.
                                        </div>
                                    </div>
                                </div>
                            </OrnateBorder>
                        </div>
                    )}

                    {/* STEP 4: BACKGROUNDS (shifted to step 3) */}
                    {step === 3 && (
                        <div className="animate-slide-in w-full">
                            <div className="flex justify-between items-center border-b border-wuxia-gold/30 pb-3 mb-8">
                                <h3 className="text-2xl font-serif font-bold text-wuxia-gold">Thân thế xuất thân</h3>
                                <button
                                    onClick={() => triggerGacha('bg', gachaBackground)}
                                    className={`flex items-center gap-2 px-4 py-1.5 bg-wuxia-gold/10 hover:bg-wuxia-gold/20 text-wuxia-gold rounded-lg border border-wuxia-gold/30 transition-all font-serif text-sm group ${gachaFlash === 'bg' ? 'ring-2 ring-wuxia-gold bg-wuxia-gold/30' : ''}`}
                                    title="Gacha xuất thân (+ May mắn)"
                                >
                                    <Dices className={`w-4 h-4 transition-transform duration-500 ${gachaFlash === 'bg' ? 'rotate-180 scale-125' : 'group-hover:rotate-12'}`} />
                                    <span>Gacha Thân thế</span>
                                </button>
                            </div>

                            {showCustomBackground && (
                                <div className="bg-black/40 border border-wuxia-gold/30 p-8 mb-8 rounded-xl space-y-6 shadow-glow-sm relative animate-in fade-in slide-in-from-top-4 duration-500">
                                    <button onClick={() => setShowCustomBackground(false)} className="absolute top-4 right-4 text-wuxia-gold/50 hover:text-red-400 transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-wuxia-gold/50 uppercase tracking-widest ml-1">Tên thân thế</label>
                                            <input
                                                placeholder="VD: Thái tử phủ Giang Nam"
                                                value={customBackground.name}
                                                onChange={e => setCustomBackground({ ...customBackground, name: e.target.value })}
                                                className="w-full bg-black/60 border border-wuxia-gold/30 focus:border-wuxia-gold p-3 text-sm text-wuxia-gold outline-none rounded-lg transition-all font-serif"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-wuxia-gold/50 uppercase tracking-widest ml-1">Hiệu ứng cơ bản</label>
                                            <input
                                                placeholder="VD: Mảnh sắt vụn +100, Danh vọng +50"
                                                value={customBackground.effect}
                                                onChange={e => setCustomBackground({ ...customBackground, effect: e.target.value })}
                                                className="w-full bg-black/60 border border-wuxia-gold/30 focus:border-wuxia-gold p-3 text-sm text-wuxia-gold outline-none rounded-lg transition-all font-serif italic"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-wuxia-gold/50 uppercase tracking-widest ml-1">Mô tả bối cảnh</label>
                                        <textarea
                                            placeholder="Nhập mô tả sâu sắc về thân thế này..."
                                            value={customBackground.description}
                                            onChange={e => setCustomBackground({ ...customBackground, description: e.target.value })}
                                            className="w-full h-24 bg-black/60 border border-wuxia-gold/30 focus:border-wuxia-gold p-3 text-sm text-wuxia-gold outline-none rounded-lg transition-all resize-none font-serif leading-relaxed"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <GameButton onClick={() => setShowCustomBackground(false)} variant="secondary" className="flex-1">Hủy</GameButton>
                                        <GameButton onClick={addCustomBackground} variant="primary" className="flex-[2]">Khai mở kỳ ngộ</GameButton>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredBackgroundOptions.map((bg, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedBackground(bg)}
                                        className={`group relative p-6 rounded-xl border transition-all cursor-pointer ${selectedBackground.name === bg.name ? 'bg-wuxia-gold/10 border-wuxia-gold shadow-[0_0_20px_rgba(230,200,110,0.15)]' : 'bg-black/40 border-wuxia-gold/10 hover:border-wuxia-gold/30'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-lg font-serif font-bold text-wuxia-gold">{bg.name}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded border ${bg.rank === 'Cực khó' ? 'border-red-500/50 text-red-400 bg-red-400/10' : bg.rank === 'Khó' ? 'border-orange-500/50 text-orange-400 bg-orange-400/10' : 'border-green-500/50 text-green-400 bg-green-400/10'}`}>
                                                {bg.rank}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-4 line-clamp-2 h-8 font-serif italic">"{bg.description}"</p>
                                        <div className="pt-3 border-t border-wuxia-gold/10">
                                            <div className="text-[10px] text-wuxia-gold/50 font-bold mb-1 uppercase tracking-widest">Hiệu ứng</div>
                                            <div className="text-xs text-gray-300 line-clamp-2 min-h-[32px]">{bg.effect}</div>
                                        </div>
                                        {selectedBackground.name === bg.name && (
                                            <div className="absolute -top-2 -right-2 bg-wuxia-gold text-black rounded-full p-1 shadow-lg border border-black animate-scale-in">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div
                                    onClick={() => setShowCustomBackground(true)}
                                    className="p-6 rounded-xl border border-dashed border-wuxia-gold/20 hover:border-wuxia-gold/50 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer bg-black/20 group hover:bg-wuxia-gold/5"
                                >
                                    <div className="w-12 h-12 rounded-full border border-wuxia-gold/20 flex items-center justify-center text-wuxia-gold/40 group-hover:text-wuxia-gold group-hover:border-wuxia-gold transition-all">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-serif text-wuxia-gold/40 group-hover:text-wuxia-gold">Thân thế kỳ ngộ</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: BẤT LỢI (Debuffs) */}
                    {step === 4 && (() => {
                        const rankPriority: Record<string, number> = { 'Cực Hạn': 0, 'Khắc nghiệt': 1, 'Khó': 2 };
                        const debuffTalents = allTalentOptions
                            .filter(t => t.cost < 0)
                            .sort((a, b) => (rankPriority[a.rank] ?? 99) - (rankPriority[b.rank] ?? 99));

                        return (
                            <div className="space-y-6 animate-slide-in max-w-5xl mx-auto">
                                {/* Point Counter */}
                                <div className="flex items-center justify-between py-2 px-8 bg-black/60 border border-wuxia-gold/30 rounded-xl text-center max-w-2xl mx-auto flex-wrap gap-4">
                                    <div>
                                        <div className="text-[10px] text-wuxia-gold/50 uppercase tracking-widest">Cơ bản</div>
                                        <div className="text-xl font-bold text-wuxia-gold font-mono">{BASE_TALENT_POINTS}</div>
                                    </div>
                                    <div className="text-wuxia-gold/30 text-lg">+</div>
                                    <div className="bg-red-400/5 px-4 py-2 rounded-lg border border-red-500/20">
                                        <div className="text-[10px] text-red-400/70 uppercase tracking-widest">Nghiệp lực</div>
                                        <div className="text-xl font-bold text-red-400 font-mono">+{debuffPoints}</div>
                                    </div>
                                    <div className="text-wuxia-gold/30 text-lg">=</div>
                                    <div className="bg-emerald-400/5 px-4 py-2 rounded-lg border border-emerald-500/20 shadow-glow-sm">
                                        <div className="text-[10px] text-emerald-400/70 uppercase tracking-widest">Tổng điểm bẩm sinh</div>
                                        <div className="text-xl font-bold text-emerald-400 font-mono">{totalTalentPoints}</div>
                                    </div>
                                </div>

                                <OrnateBorder className="p-5">
                                    <div className="flex justify-between items-center border-b border-red-500/30 pb-3 mb-6">
                                        <h3 className="text-xl font-serif font-bold text-red-400 flex items-center gap-2">
                                            <span className="text-2xl">☠</span> Bất lợi bẩm sinh <span className="text-xs font-normal text-red-400/60 italic">(Chọn để tăng điểm Thiên phú)</span>
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            {!hasDebuff && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 animate-pulse">⚠</span>}
                                            <button
                                                onClick={() => {
                                                    setCustomTalent({ name: '', description: '', effect: '', rank: 'Khó', cost: 3 });
                                                    setShowCustomDebuff(!showCustomDebuff);
                                                }}
                                                className="text-[10px] text-red-400 hover:underline font-bold whitespace-nowrap"
                                            >
                                                + Tạo Bất lợi
                                            </button>
                                        </div>
                                    </div>

                                    {showCustomDebuff && (
                                        <div className="relative bg-black/40 border border-red-900/40 p-5 mb-8 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 shadow-inner shadow-black/60 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <button
                                                onClick={() => setShowCustomDebuff(false)}
                                                className="absolute top-3 right-3 p-1 text-red-500/40 hover:text-red-500 transition-colors"
                                                title="Đóng"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                            <div className="space-y-1">
                                                <label className="text-[10px] text-red-400/50 uppercase ml-1">Tên bất lợi</label>
                                                <input
                                                    placeholder="VD: Tuyệt mệnh chi thể"
                                                    value={customTalent.name}
                                                    onChange={e => setCustomTalent({ ...customTalent, name: e.target.value })}
                                                    className="w-full bg-black/60 border border-red-900/30 focus:border-red-500 p-2.5 text-xs text-red-400 outline-none rounded-lg font-serif transition-colors"
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-[10px] text-red-400/50 uppercase ml-1">Cấp bậc</label>
                                                    <InlineSelect
                                                        value={customTalent.rank}
                                                        options={DEBUFF_RANKS as any}
                                                        onChange={(val) => setCustomTalent({ ...customTalent, rank: val as any })}
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="w-20 space-y-1">
                                                    <label className="text-[10px] text-red-400/50 uppercase ml-1">Điểm cộng</label>
                                                    <input
                                                        type="number"
                                                        value={customTalent.cost}
                                                        onChange={e => setCustomTalent({ ...customTalent, cost: parseInt(e.target.value) })}
                                                        className="w-full bg-black/60 border border-red-900/30 p-2 text-xs text-red-400 outline-none rounded-lg text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-[10px] text-red-400/50 uppercase ml-1">Hiệu ứng cơ bản</label>
                                                <input
                                                    placeholder="VD: Tuổi thọ tối đa = 25, Thể chất -15"
                                                    value={customTalent.effect}
                                                    onChange={e => setCustomTalent({ ...customTalent, effect: e.target.value })}
                                                    className="w-full bg-black/60 border border-red-900/30 focus:border-red-500 p-2.5 text-xs text-red-400 outline-none rounded-lg font-serif italic transition-colors"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-[10px] text-red-400/50 uppercase ml-1">Mô tả bối cảnh</label>
                                                <textarea
                                                    placeholder="Nhập mô tả sâu sắc hơn về bất lợi này..."
                                                    value={customTalent.description}
                                                    onChange={e => setCustomTalent({ ...customTalent, description: e.target.value })}
                                                    className="w-full h-20 bg-black/60 border border-red-900/30 focus:border-red-500 p-2.5 text-xs text-red-400 outline-none rounded-lg transition-all resize-none font-serif leading-relaxed"
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex gap-3 mt-2">
                                                <button
                                                    onClick={() => setShowCustomDebuff(false)}
                                                    className="flex-1 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-gray-500 hover:text-gray-300 text-[10px] font-bold transition-all uppercase tracking-widest"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    onClick={() => addCustomDebuff()}
                                                    className="flex-[2] py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 hover:border-red-500 text-red-400 text-xs font-bold rounded-lg shadow-glow-sm transition-all"
                                                >
                                                    Phát kiến Nghiệp lực
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {debuffTalents.map((t, idx) => {
                                            const isSelected = !!selectedTalents.find(x => x.name === t.name);
                                            const rc = RANK_COLORS[t.rank] || RANK_COLORS['Thường'];

                                            // Check if this debuff is excluded by current background
                                            const isExcluded = t.excludedBackgrounds?.includes(selectedBackground.name);

                                            return (
                                                <div
                                                    key={`debuff-${idx}`}
                                                    onClick={() => !isExcluded && toggleTalent(t)}
                                                    className={`group relative p-4 border rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${isSelected
                                                        ? `${rc.border} ${rc.bg} shadow-xl ${rc.glow}`
                                                        : isExcluded
                                                            ? 'border-red-900/30 bg-red-950/10 grayscale opacity-40 cursor-not-allowed'
                                                            : 'border-white/10 bg-black/20 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className={`font-bold text-sm font-serif ${isSelected ? rc.text : isExcluded ? 'text-red-800' : 'text-gray-400 group-hover:text-gray-200'}`}>{t.name}</span>
                                                        <div className="flex items-center gap-1.5 min-w-max">
                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase tracking-tighter ${rc.badge}`}>{t.rank}</span>
                                                            <span className="text-[11px] font-bold text-red-400 font-mono">+{Math.abs(t.cost)}đ</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 mt-1.5 italic line-clamp-1 group-hover:text-gray-400">{t.description}</div>
                                                    <div className="text-[11px] text-gray-300 mt-3 font-mono leading-relaxed line-clamp-2 border-t border-white/5 pt-2">{t.effect}</div>

                                                    {isExcluded && (
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/80 transition-opacity rounded-xl p-4">
                                                            <span className="text-[10px] text-red-500 font-bold text-center leading-tight">Xuất thân "{selectedBackground.name}"<br />không thể có bất lợi này</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </OrnateBorder>
                            </div>
                        );
                    })()}

                    {/* STEP 6: THIÊN PHÚ (Buffs) */}
                    {step === 5 && (() => {
                        const rankPriority: Record<string, number> = { 'Huyền thoại': 0, 'Sử Thi': 1, 'Hiếm': 2, 'Thường': 3 };
                        const buffTalents = allTalentOptions
                            .filter(t => t.cost > 0)
                            .sort((a, b) => (rankPriority[a.rank] ?? 99) - (rankPriority[b.rank] ?? 99));

                        const filteredBuffs = talentFilter === 'all' ? buffTalents : buffTalents.filter(t => t.rank === talentFilter);
                        return (
                            <div className="space-y-6 animate-slide-in max-w-5xl mx-auto">
                                <div className="flex items-center justify-between py-3 px-8 bg-black/60 border border-wuxia-gold/30 rounded-2xl text-center max-w-2xl mx-auto shadow-2xl flex-wrap gap-4">
                                    <div>
                                        <div className="text-[10px] text-wuxia-gold/50 uppercase tracking-widest">Tổng điểm</div>
                                        <div className="text-xl font-bold text-wuxia-gold font-mono">{totalTalentPoints}</div>
                                    </div>
                                    <div className="text-wuxia-gold/30 text-lg">-</div>
                                    <div className="bg-blue-400/5 px-4 py-2 rounded-lg border border-blue-500/20">
                                        <div className="text-[10px] text-blue-400/70 uppercase tracking-widest">Đã dùng</div>
                                        <div className="text-xl font-bold text-blue-400 font-mono">{spentTalentPoints}</div>
                                    </div>
                                    <div className="text-wuxia-gold/30 text-lg">=</div>
                                    <div className="bg-emerald-400/5 px-4 py-2 rounded-lg border border-emerald-500/20 shadow-glow-sm">
                                        <div className="text-[10px] text-emerald-400/70 uppercase tracking-widest">Điểm còn lại</div>
                                        <div className={`text-2xl font-bold font-mono transition-colors ${remainingTalentPoints > 0 ? 'text-emerald-400' : remainingTalentPoints === 0 ? 'text-wuxia-gold' : 'text-red-500'}`}>{remainingTalentPoints}</div>
                                    </div>
                                </div>

                                <OrnateBorder className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-center border-b border-wuxia-gold/30 pb-4 mb-6 gap-4">
                                        <h3 className="text-xl font-serif font-bold text-wuxia-gold flex items-center gap-3">
                                            <span className="text-2xl">✨</span> Thiên phú linh khiếu
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <div className="flex gap-1.5 flex-wrap justify-center">
                                                {['all', ...BUFF_RANKS].map(r => (
                                                    <button
                                                        key={r}
                                                        onClick={() => setTalentFilter(r as any)}
                                                        className={`text-[10px] px-3 py-1 rounded border transition-all ${talentFilter === r ? 'border-wuxia-gold bg-wuxia-gold/20 text-wuxia-gold shadow-glow-sm' : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'}`}
                                                    >
                                                        {r === 'all' ? 'Tất cả' : r}
                                                    </button>
                                                ))}
                                            </div>
                                            <button onClick={() => setShowCustomTalent(!showCustomTalent)} className="text-[10px] text-wuxia-gold hover:underline font-bold whitespace-nowrap">+ Tạo Thiên Phú</button>
                                        </div>
                                    </div>

                                    {showCustomTalent && (
                                        <div className="relative bg-black/40 border border-wuxia-gold/30 p-5 mb-8 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 shadow-inner shadow-black/60 animate-in fade-in slide-in-from-top-2 duration-300">
                                            {/* Close Button Top Right */}
                                            <button
                                                onClick={() => setShowCustomTalent(false)}
                                                className="absolute top-3 right-3 p-1 text-wuxia-gold/40 hover:text-red-500 transition-colors"
                                                title="Đóng"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                            <div className="space-y-1">
                                                <label className="text-[10px] text-wuxia-gold/50 uppercase ml-1">Tên thiên phú</label>
                                                <input
                                                    placeholder="VD: Cốt cách kinh nhân"
                                                    value={customTalent.name}
                                                    onChange={e => setCustomTalent({ ...customTalent, name: e.target.value })}
                                                    className="w-full bg-black/60 border border-wuxia-gold/20 focus:border-wuxia-gold p-2.5 text-xs text-wuxia-gold outline-none rounded-lg font-serif transition-colors"
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-[10px] text-wuxia-gold/50 uppercase ml-1">Cấp bậc</label>
                                                    <InlineSelect
                                                        value={customTalent.rank}
                                                        options={BUFF_RANKS as any}
                                                        onChange={(val) => setCustomTalent({ ...customTalent, rank: val as any })}
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="w-20 space-y-1">
                                                    <label className="text-[10px] text-wuxia-gold/50 uppercase ml-1">Điểm</label>
                                                    <input
                                                        type="number"
                                                        value={customTalent.cost}
                                                        onChange={e => setCustomTalent({ ...customTalent, cost: parseInt(e.target.value) })}
                                                        className="w-full bg-black/60 border border-wuxia-gold/20 p-2 text-xs text-wuxia-gold outline-none rounded-lg text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-[10px] text-wuxia-gold/50 uppercase ml-1">Hiệu ứng cơ bản (Logically relevant)</label>
                                                <input
                                                    placeholder="VD: Tu luyện tốc độ tăng 50%"
                                                    value={customTalent.effect}
                                                    onChange={e => setCustomTalent({ ...customTalent, effect: e.target.value })}
                                                    className="w-full bg-black/60 border border-wuxia-gold/20 focus:border-wuxia-gold p-2.5 text-xs text-wuxia-gold outline-none rounded-lg font-serif italic transition-colors"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-[10px] text-wuxia-gold/50 uppercase ml-1">Mô tả bối cảnh</label>
                                                <textarea
                                                    placeholder="Nhập mô tả sâu sắc hơn về thiên phú này..."
                                                    value={customTalent.description}
                                                    onChange={e => setCustomTalent({ ...customTalent, description: e.target.value })}
                                                    className="w-full h-20 bg-black/60 border border-wuxia-gold/20 focus:border-wuxia-gold p-2.5 text-xs text-wuxia-gold outline-none rounded-lg transition-all resize-none font-serif leading-relaxed"
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex gap-3 mt-2">
                                                <button
                                                    onClick={() => setShowCustomTalent(false)}
                                                    className="flex-1 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-gray-500 hover:text-gray-300 text-[10px] font-bold transition-all uppercase tracking-widest"
                                                >
                                                    Hủy
                                                </button>
                                                <GameButton
                                                    onClick={addCustomTalent}
                                                    variant="secondary"
                                                    className="flex-[2] py-2 text-xs font-bold shadow-glow-sm"
                                                >
                                                    Phát hiện Thiên phú linh tú
                                                </GameButton>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredBuffs.map((t, idx) => {
                                            const isSelected = !!selectedTalents.find(x => x.name === t.name);
                                            const rc = RANK_COLORS[t.rank] || RANK_COLORS['Thường'];
                                            const isExcluded = t.excludedBackgrounds?.includes(selectedBackground.name);
                                            const canAfford = t.cost <= remainingTalentPoints;

                                            return (
                                                <div
                                                    key={`buff-${idx}`}
                                                    onClick={() => !isExcluded && toggleTalent(t)}
                                                    className={`group relative p-4 border rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${isSelected
                                                        ? `${rc.border} ${rc.bg} shadow-xl ${rc.glow}`
                                                        : isExcluded
                                                            ? 'border-red-900/30 bg-red-950/10 grayscale opacity-40 cursor-not-allowed'
                                                            : canAfford
                                                                ? 'border-white/10 bg-black/20 hover:border-white/20'
                                                                : 'border-white/5 bg-black/10 opacity-60'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className={`font-bold text-sm font-serif truncate ${isSelected ? rc.text : isExcluded ? 'text-red-800' : 'text-gray-300 group-hover:text-white'}`}>{t.name}</span>
                                                        <div className="flex items-center gap-1.5 min-w-max">
                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase tracking-tighter ${rc.badge}`}>{t.rank}</span>
                                                            <span className={`text-[11px] font-bold font-mono ${isSelected ? 'text-white' : 'text-blue-400'}`}>-{t.cost}đ</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 mt-1.5 italic line-clamp-1 group-hover:text-gray-400">{t.description}</div>
                                                    <div className="text-[11px] text-gray-300 mt-3 font-mono leading-relaxed line-clamp-2 border-t border-white/5 pt-2">{t.effect}</div>

                                                    {isExcluded && (
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/80 transition-opacity rounded-xl p-4">
                                                            <span className="text-[10px] text-red-500 font-bold text-center leading-tight">Xuất thân "{selectedBackground.name}"<br />không thể chọn {t.name}</span>
                                                        </div>
                                                    )}
                                                    {!isSelected && !isExcluded && !canAfford && (
                                                        <div className="absolute top-0 right-0 -mt-1 -mr-1 px-1.5 py-0.5 bg-red-500/80 text-[8px] text-white rounded font-bold">Hết điểm</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </OrnateBorder>
                            </div>
                        );
                    })()}

                    {/* STEP 7: CONFIRMATION */}
                    {step === 6 && (
                        <div className="flex flex-col items-center justify-center space-y-8 animate-slide-in h-full">
                            <h3 className="text-2xl font-serif font-bold text-wuxia-gold tracking-widest text-center">Xác nhận phong vân chi lộ</h3>

                            <OrnateBorder className="max-w-lg w-full p-6">
                                <div className="text-sm space-y-3 font-mono text-wuxia-gold/70">
                                    <p>Thế giới: <span className="text-wuxia-gold">{worldConfig.worldName || 'Chưa điền tên'}</span> <span className='text-wuxia-gold/40'>({POWER_LEVEL_OPTIONS.find(o => o.value === worldConfig.powerLevel)?.label ?? worldConfig.powerLevel})</span></p>
                                    <p>Độ khó: <span className="text-wuxia-gold">{DIFFICULTY_OPTIONS.find(o => o.value === worldConfig.difficulty)?.label ?? worldConfig.difficulty}</span></p>
                                    <p>Nhân vật chính: <span className="text-wuxia-gold">{charName.trim() || 'Chưa điền tên'}</span> <span className='text-wuxia-gold/40'>({GENDER_LABELS[charGender] ?? charGender}, {charAge} tuổi)</span></p>
                                    <p>Ngoại hình: <span className="text-wuxia-gold">{charAppearance.trim() || 'Chưa điền'}</span></p>
                                    <p>Tính cách: <span className="text-wuxia-gold">{charPersonality.trim() || 'Chưa điền'}</span></p>
                                    <p>Thân thế: <span className="text-wuxia-gold">{selectedBackground.name}</span> <span className="text-[10px] text-wuxia-gold/40">({selectedBackground.rank})</span></p>
                                    <div className="pt-2 border-t border-wuxia-gold/10 space-y-2">
                                        <p className="text-emerald-400/80">Thiên phú/Linh kiếu:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedBuffs.length > 0 ? selectedBuffs.map(t => (
                                                <span key={t.name} className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">{t.name}</span>
                                            )) : <span className="text-gray-600 italic text-[10px]">Chưa chọn</span>}
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-wuxia-gold/10 space-y-2">
                                        <p className="text-red-400/80">Bất lợi/Nghiệp lực:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedDebuffs.length > 0 ? selectedDebuffs.map(t => (
                                                <span key={t.name} className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px]">{t.name}</span>
                                            )) : <span className="text-gray-600 italic text-[10px]">Chưa chọn Bất lợi (Gợi ý: chọn để có thêm điểm Thiên phú)</span>}
                                        </div>
                                    </div>

                                    {(remainingTalentPoints >= 2 || selectedDebuffs.length === 0) && (
                                        <div className="mt-4 p-3 bg-red-950/20 border border-red-500/30 rounded-lg space-y-2">
                                            <p className="text-xs text-red-400 font-bold flex items-center gap-2">
                                                <span>⚠️</span> Cảnh báo tu luyện:
                                            </p>
                                            {selectedDebuffs.length === 0 && (
                                                <p className="text-[10px] text-red-400/80 italic">• Bạn chưa chọn Bất lợi nào. Đây là cơ hội để nhận thêm điểm Thiên phú cực hiếm.</p>
                                            )}
                                            {remainingTalentPoints >= 2 && (
                                                <p className="text-[10px] text-red-400/80 italic">• Bạn còn dư {remainingTalentPoints} điểm Thiên phú. Đừng lãng phí linh khí trời ban!</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </OrnateBorder>


                            <div className="flex flex-col gap-4 w-full max-w-md">
                                <GameButton onClick={() => { void handleGenerate(); }} variant="primary" className="w-full py-4 text-lg">
                                    Tạo một chạm (Thế giới + Cốt truyện)
                                </GameButton>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Nav */}
                <div className="hidden md:flex h-16 border-t border-wuxia-gold/10 items-center justify-between px-8 bg-black/40">
                    {step > 0 ? (
                        <GameButton onClick={() => setStep(step - 1)} variant="secondary" className="px-6 py-2 border-opacity-50 opacity-80 hover:opacity-100">
                            &larr; Bước trước
                        </GameButton>
                    ) : (
                        <GameButton onClick={onCancel} variant="secondary" className="px-6 py-2 !border-red-500/50 !text-red-500/80 hover:!bg-red-500/10 hover:!text-red-500 flex items-center gap-2">
                            <LogOut className="w-4 h-4" /> Thoát
                        </GameButton>
                    )}


                    {step < STEPS.length - 1 ? (
                        <GameButton onClick={() => setStep(step + 1)} variant="primary" className="px-6 py-2">
                            Bước tiếp &rarr;
                        </GameButton>
                    ) : null}
                </div>
                <div className="md:hidden border-t border-wuxia-gold/10 bg-black/60 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+10px)]">
                    <div className="flex items-center gap-2">
                        {step > 0 ? (
                            <GameButton onClick={() => setStep(step - 1)} variant="secondary" className="flex-1 py-2 text-xs">
                                Bước trước
                            </GameButton>
                        ) : (
                            <GameButton onClick={onCancel} variant="secondary" className="flex-1 py-2 text-xs !border-red-500/50 !text-red-400">
                                Hủy
                            </GameButton>
                        )}
                        {step < STEPS.length - 1 ? (
                            <GameButton onClick={() => setStep(step + 1)} variant="primary" className="flex-1 py-2 text-xs">
                                Bước tiếp
                            </GameButton>
                        ) : (
                            <GameButton onClick={() => { void handleGenerate(); }} variant="primary" className="flex-1 py-2 text-xs">
                                Tạo một chạm
                            </GameButton>
                        )}
                    </div>                </div>

            </div>
        </div>
    );
};

export default NewGameWizard;



