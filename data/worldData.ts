export interface WorldLocation {
    id: string;
    name: string;
    type: 'region' | 'city' | 'sect' | 'landmark';
    parentId?: string;
    description: string;
    x: number; // 0-1000 coordinate
    y: number; // 0-1000 coordinate
    connections?: string[]; // IDs of connected locations
}

export const WORLD_REGIONS = [
    { id: 'tu_hi_thanh', name: 'Tử Hi Thành', description: 'Hoàng thành hoa lệ, trung tâm quyền lực của vương triều.' },
    { id: 'luu_ly_thanh', name: 'Lưu Ly Thành', description: 'Thủ phủ phương Bắc, quanh năm tuyết phủ trắng xóa.' },
    { id: 'huyen_vu_thanh', name: 'Huyền Vũ Thành', description: 'Trấn thủ phía Đông, cảng biển sầm uất.' },
    { id: 'chu_tuoc_mon', name: 'Chu Tước Môn', description: 'Thành trì phía Nam, nơi giao thương nhộn nhịp.' },
    { id: 'bach_ho_tu', name: 'Bạch Hổ Tự', description: 'Tây quan hiểm trở, cửa ngõ vào sa mạc vô tận.' },
    { id: 'tang_kiem_son_trang', name: 'Tàng Kiếm Sơn Trang', description: 'Giang hồ đệ nhất kiếm trang, trung tâm võ lâm.' },
    { id: 'huyet_nguyet_canh', name: 'Huyết Nguyệt Cảnh', description: 'Vùng đất chết, nơi nguy hiểm bậc nhất giang hồ.' },
    { id: 'con_luan_dinh', name: 'Côn Luân Đỉnh', description: 'Đỉnh núi tiên cảnh, nơi cư ngụ của các bậc cao nhân.' },
    { id: 'dao_hoa_dao', name: 'Đào Hoa Đảo', description: 'Hòn đảo hải ngoại tách biệt, thơ mộng nhưng bí ẩn.' },
    { id: 'van_thu_coc', name: 'Vạn Thú Cốc', description: 'Rừng già nguyên sinh, vùng đất của các mãnh thú.' },
    { id: 'u_minh_dien', name: 'U Minh Điện', description: 'Điện thờ tối tăm, nơi tà giáo cư ngụ.' },
    { id: 'phat_da_di_tich', name: 'Phật Đà Di Tích', description: 'Ngôi chùa cổ đổ nát tại Tây vực xa xôi.' },
    { id: 'kiem_y_phong', name: 'Kiếm Ý Phong', description: 'Nơi kiếm khí vương vấn, thánh địa của kiếm khách.' },
    { id: 'yeu_nguyet_cung', name: 'Yêu Nguyệt Cung', description: 'Cung điện ẩn cư dành cho các nữ cao thủ.' },
    { id: 'thanh_thuy_tran', name: 'Thanh Thủy Trấn', description: 'Ngôi làng yên bình bên dòng sông thơ mộng.' },
    { id: 'cuu_long_trai', name: 'Cửu Long Trại', description: 'Khu trại hỗn tạp, nơi luật lệ bị bỏ quên.' },
    { id: 'me_suong_lam', name: 'Mê Sương Lâm', description: 'Rừng sương mù ma mị, dễ đi khó về.' },
    { id: 'bang_tuyet_thanh', name: 'Băng Tuyết Thành', description: 'Cực Bắc lãnh lẽo, nơi chỉ có băng giá vĩnh cửu.' },
    { id: 'vo_danh_nguc', name: 'Vô Danh Ngục', description: 'Nhà tù biệt giam giam giữ những trọng phạm võ lâm.' },
    { id: 'ngoai_vuc', name: 'Ngoại Vực', description: 'Vùng biên giới bao la, nơi giao thoa nhiều văn hóa.' }
];

export const WORLD_STRUCTURE: WorldLocation[] = [
    { id: 'tu_hi_thanh', name: 'Tử Hi Thành', type: 'city', x: 500, y: 500, description: 'Hoàng thành.', connections: ['tang_kiem_son_trang', 'chu_tuoc_mon', 'huyen_vu_thanh', 'huyet_nguyet_canh'] },
    { id: 'luu_ly_thanh', name: 'Lưu Ly Thành', type: 'city', x: 500, y: 150, description: 'Bắc vương thành.', connections: ['huyet_nguyet_canh', 'bang_tuyet_thanh'] },
    { id: 'huyen_vu_thanh', name: 'Huyền Vũ Thành', type: 'city', x: 800, y: 400, description: 'Đông cảng.', connections: ['tu_hi_thanh', 'dao_hoa_dao'] },
    { id: 'chu_tuoc_mon', name: 'Chu Tước Môn', type: 'city', x: 500, y: 850, description: 'Nam thành.', connections: ['tu_hi_thanh', 'van_thu_coc', 'thanh_thuy_tran'] },
    { id: 'bach_ho_tu', name: 'Bạch Hổ Tự', type: 'city', x: 200, y: 400, description: 'Tây quan.', connections: ['tang_kiem_son_trang', 'phat_da_di_tich', 'ngoai_vuc'] },
    { id: 'tang_kiem_son_trang', name: 'Tàng Kiếm Sơn Trang', type: 'sect', x: 400, y: 450, description: 'Đệ nhất kiếm trang.', connections: ['tu_hi_thanh', 'bach_ho_tu', 'kiem_y_phong'] },
    { id: 'huyet_nguyet_canh', name: 'Huyết Nguyệt Cảnh', type: 'region', x: 450, y: 300, description: 'Tử địa.', connections: ['tu_hi_thanh', 'luu_ly_thanh', 'u_minh_dien'] },
    { id: 'con_luan_dinh', name: 'Côn Luân Đỉnh', type: 'sect', x: 150, y: 200, description: 'Tiên sơn.', connections: ['ngoai_vuc', 'yeu_nguyet_cung'] },
    { id: 'dao_hoa_dao', name: 'Đào Hoa Đảo', type: 'region', x: 900, y: 600, description: 'Đảo đào hoa.', connections: ['huyen_vu_thanh'] },
    { id: 'van_thu_coc', name: 'Vạn Thú Cốc', type: 'region', x: 700, y: 800, description: 'Lâm cốc.', connections: ['chu_tuoc_mon', 'cuu_long_trai'] },
    { id: 'u_minh_dien', name: 'U Minh Điện', type: 'sect', x: 600, y: 250, description: 'Ma đạo.', connections: ['huyet_nguyet_canh', 'me_suong_lam'] },
    { id: 'phat_da_di_tich', name: 'Phật Đà Di Tích', type: 'landmark', x: 100, y: 600, description: 'Di tích cổ.', connections: ['bach_ho_tu'] },
    { id: 'kiem_y_phong', name: 'Kiếm Ý Phong', type: 'landmark', x: 300, y: 550, description: 'Đỉnh kiếm.', connections: ['tang_kiem_son_trang'] },
    { id: 'yeu_nguyet_cung', name: 'Yêu Nguyệt Cung', type: 'sect', x: 300, y: 150, description: 'Ẩn cung.', connections: ['con_luan_dinh', 'me_suong_lam'] },
    { id: 'thanh_thuy_tran', name: 'Thanh Thủy Trấn', type: 'city', x: 300, y: 800, description: 'Trấn nhỏ.', connections: ['chu_tuoc_mon', 'vo_danh_nguc'] },
    { id: 'cuu_long_trai', name: 'Cửu Long Trại', type: 'region', x: 850, y: 800, description: 'Vô luật địa.', connections: ['van_thu_coc'] },
    { id: 'me_suong_lam', name: 'Mê Sương Lâm', type: 'region', x: 400, y: 100, description: 'Rừng sương.', connections: ['u_minh_dien', 'yeu_nguyet_cung'] },
    { id: 'bang_tuyet_thanh', name: 'Băng Tuyết Thành', type: 'city', x: 700, y: 100, description: 'Cực Bắc.', connections: ['luu_ly_thanh'] },
    { id: 'vo_danh_nguc', name: 'Vô Danh Ngục', type: 'landmark', x: 150, y: 850, description: 'Hắc ngục.', connections: ['thanh_thuy_tran'] },
    { id: 'ngoai_vuc', name: 'Ngoại Vực', type: 'region', x: 50, y: 400, description: 'Biên cương.', connections: ['bach_ho_tu', 'con_luan_dinh'] }
];

import worldSkeletonData from '../src/data/world_skeleton.json';
export const FULL_WORLD_SKELETON = worldSkeletonData;
