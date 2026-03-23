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
