import { WorldGenConfig, CharacterData } from '../../types';

export const constructWorldviewAnchorPrompt = (worldConfig: WorldGenConfig, charData: CharacterData): string => `
【Điểm neo thế giới hiện tại (World Bible Anchor)】
- Tên thế giới: ${worldConfig.worldName || '[Tên thế giới]'}
- Cấp độ sức mạnh: ${worldConfig.powerLevel}
- Quy mô thế giới: ${worldConfig.worldSize}
- Cấu trúc vương triều: ${worldConfig.dynastySetting || '[Bối cảnh triều đại chưa thiết lập]'}
- Mật độ tông môn: ${worldConfig.sectDensity}
- Thiết lập thiên kiêu: ${worldConfig.tianjiaoSetting || '[Thiết lập thiên kiêu/vũ lực chưa thiết lập]'}
- Độ khó trò chơi: ${worldConfig.difficulty || 'normal'}
- Phong cách truyện: ${worldConfig.storyStyle || 'Thông thường'}

【Điểm neo hồ sơ nhân vật chính】
- Họ tên/Giới tính/Tuổi: ${charData.name}/${charData.gender}/${charData.age}
- Ngày sinh: ${charData.birthDate}
- Ngoại hình: ${charData.appearance || 'Chưa mô tả'}
- Cảnh giới ban đầu: ${charData.realm}
- Lục căn (Sáu thuộc tính): Sức mạnh ${charData.strength} Nhanh nhẹn ${charData.agility} Thể chất ${charData.constitution} Căn cốt ${charData.rootBone} Ngộ tính ${charData.intelligence} Phước duyên ${charData.luck}
- Thiên phú: ${charData.talentList.map(t => t.name).join('、') || 'Không'}
- Bối cảnh: ${charData.background?.name || 'Chưa rõ'}（${charData.background?.description || 'Không có mô tả'}）
`.trim();

export const constructWorldviewSeedPrompt = (worldConfig: WorldGenConfig, charData: CharacterData): string => {
   const anchor = constructWorldviewAnchorPrompt(worldConfig, charData);
   return `
【Thiết lập thế giới quan (Ràng buộc theo bản lưu)】
Trường này là bản gốc thế giới quan duy nhất của bản lưu hiện tại, phải nhất quán lâu dài; các diễn biến tự sự, phán đoán và sự kiện sau này đều dựa trên cơ sở này.

1. **Sự nhất quán của thế giới**
   - Thế lực, cảnh giới, độ khan hiếm tài nguyên, trật tự xã hội phải nhất quán với bản gốc này.
   - Cấm thay đổi các quy luật cơ bản của thế giới trong cùng một bản lưu mà không có nguyên nhân nhân quả.

2. **Sự nhất quán của nhân vật chính**
   - Danh tính, xuất thân, lục căn, hoàn cảnh ban đầu của nhân vật chính phải nhất quán với điểm neo hồ sơ.
   - Vật phẩm, công pháp, mạng lưới quan hệ ở giai đoạn đầu phải phù hợp với nhân quả của việc “mới bước chân vào giang hồ”, không được đột nhiên có trang bị hay công pháp thần thánh.

3. **Ranh giới tự sự**
   - Thế giới quan dùng để ràng buộc, không trực tiếp quyết định thay cho người chơi.
   - Các sự kiện lớn trong thế giới cần được truy xuất và hiện thực hóa thông qua \`gameState.World\` và \`gameState.Plot\`.

4. **Thời gian và Địa điểm**
   - Sự tiến triển của thời gian và thay đổi địa điểm cần đồng bộ với \`gameState.Environment\`.
   - Xung đột không gian - thời gian (cùng một nhân vật ở nhiều nơi tại cùng một thời điểm) được coi là tự sự bất hợp lệ.

${anchor}
    `.trim();
};

export const constructWorldGenerationContextPrompt = (
   worldPromptSeed: string,
   difficulty: string,
   enabledDifficultyPrompts: string
): string => `
${worldPromptSeed}

【Ngữ cảnh nhiệm vụ tạo thế giới】
- Chế độ: Tạo thế giới mới
- Độ khó: ${difficulty}
- Mục tiêu tạo: Chỉ tạo world_prompt (Văn bản lời nhắc thế giới quan)

【Quy tắc độ khó được kích hoạt】
${enabledDifficultyPrompts || 'Chưa cung cấp'}
`.trim();

export const constructStartingLocationPrompt = (charData: CharacterData, worldStructure: string): string => `
【Nhiệm vụ: Xác định Vùng đất và Địa điểm khởi đầu — MỞ KHÓA BIOME】
Dựa trên hồ sơ nhân vật (Xuất thân, Thiên phú, Chỉ số), hãy chọn một Vùng đất (Biome) và Loại địa điểm (Type) phù hợp nhất để bắt đầu hành trình. 

【Hồ sơ nhân vật】
- Họ tên: ${charData.name}
- Xuất thân: ${charData.background?.name}
- Mô tả xuất thân: ${charData.background?.description}
- Hiệu ứng xuất thân: ${charData.background?.effect}
- Nguồn gốc (Origin): ${charData.background?.origin || 'Không xác định'}
- Thiên phú: ${charData.talentList.map(t => t.name).join(', ')}
- Cảnh giới: ${charData.realm}

【Danh sách Biomes và Loại địa điểm hợp lệ】
Hệ thống KHÔNG CHẤP NHẬN các ID hoặc Loại địa điểm nằm ngoài danh sách này. Hãy đối chiếu kỹ:
${worldStructure}

【QUY TẮC MỞ KHÓA BIOME — ƯU TIÊN TUYỆT ĐỐI】
1. **Ưu tiên Origin**: Nếu trường "Nguồn gốc (Origin)" tồn tại, hãy tìm Biome nào có "Xuất thân đặc trưng" CHỨA origin đó → chọn Biome đó. Đây là quy tắc mở khóa vùng đất dựa trên xuất thân.
   - Ví dụ: Origin = "Huyết Hải Ngư Thôn" → tìm biome có xuất thân đặc trưng chứa "Huyết" → chọn biome huyet_hai.
   - Ví dụ: Origin = "Kiếm Tâm Cung" → tìm biome liên quan đến kiếm → chọn biome kiem_y_coc.
2. **Fallback theo ngữ nghĩa**: Nếu Origin không khớp trực tiếp, hãy chọn Biome phù hợp nhất về mặt ngữ nghĩa với tên và mô tả xuất thân.
3. **Lựa chọn phải logic với Xuất thân**: Ví dụ "Thiếu chủ Ma Môn" nên ở vùng đất của Ma tộc hoặc nơi có sát khí cao. "Ăn mày" nên ở thành thị sầm uất.
4. **Cập nhật tâm tính**: Dựa trên bối cảnh và vị trí, hãy điều chỉnh lại các chỉ số personalityStats (0-100) cho phù hợp với một người vừa bước chân vào vị trí đó.

【Yêu cầu đầu ra JSON】
Trả về JSON chính xác:
{
  "biomeId": "ID của Biome được chọn (ví dụ: huyet_hai, trung_nguyen...)",
  "locationType": "Loại địa điểm được chọn từ danh sách có sẵn của Biome đó (ví dụ: 'Môn phái', 'Thành thị', 'Sơn động'...)",
  "personalityStats": {
    "righteousness": 0-100,
    "evil": 0-100,
    "arrogance": 0-100,
    "humility": 0-100,
    "coldness": 0-100,
    "passion": 0-100
  },
  "reason": "Giải thích tại sao nhân vật lại xuất hiện ở đây (kết hợp Xuất thân + Origin + Thiên phú + Biome)."
}
`.trim();
