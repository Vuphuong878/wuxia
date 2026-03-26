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
【Nhiệm vụ: Thiết lập 20 Châu lục và Vị trí khởi đầu】
Dựa trên bối cảnh và thân phận của nhân vật, hãy thực hiện các bước sau:
1. Chọn ra danh sách 20 CHÂU LỤC (Biomes) phù hợp nhất từ danh sách cấu trúc thế giới bên dưới để kiến tạo nên bản đồ thế giới của nhân vật.
2. Từ 20 Châu lục đã chọn, hãy xác định DUY NHẤT một Châu lục làm nơi khởi đầu (majorLocation).
3. Xác định loại địa điểm khởi đầu cụ thể và các chỉ số tính cách ban đầu.

【Thông tin nhân vật】
- Tên: ${charData.name}
- Bối cảnh: ${charData.background?.name}
- Mô tả bối cảnh: ${charData.background?.description}
- Thiên phú: ${charData.talentList.map(t => t.name).join(', ')}

【Cấu trúc thế giới (Danh sách các Biome/Vùng lớn)】
${worldStructure}

【Yêu cầu đầu ra】
CHỈ xuất ra một đối tượng JSON hợp lệ:
{
  "selectedContinents": ["Tên châu lục 1", "Tên châu lục 2", ..., "Tên châu lục 20"],
  "majorLocation": "Tên châu lục khởi đầu (phải nằm trong danh sách 20 cái trên)",
  "type": "Loại địa điểm khởi đầu (ví dụ: Thành thị, Môn phái, Thôn trang, Sơn động...)",
  "personalityStats": {
    "righteousness": number (0-100),
    "evil": number (0-100),
    "arrogance": number (0-100),
    "humility": number (0-100),
    "coldness": number (0-100),
    "passion": number (0-100)
  },
  "reason": "Giải thích ngắn gọn sự lựa chọn 20 châu lục và vị trí khởi đầu này."
}
*Hệ thống sẽ tự động chỉ định tọa độ và địa điểm chi tiết (minorLocation) dựa trên Vùng và Loại địa điểm bạn chọn.*
`.trim();
