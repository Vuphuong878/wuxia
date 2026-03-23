import { PromptStructure } from '../../types';

export const Core_OutputFormat_MultiThought: PromptStructure = {
  id: 'core_format_multi',
  title: 'Định dạng Đầu ra Đa luồng Suy nghĩ',
  content: `
<Multi-thought Output Format — JSON Mode>
# 【Multi-Thought JSON Output Format | Hard Constraints】
> [!IMPORTANT]
> ALL content inside JSON fields (including t_input, t_plan, logs, shortTerm, etc.) MUST BE WRITTEN IN 100% ACCENTED VIETNAMESE (TIẾNG VIỆT CÓ DẤU). Using English, Chinese, or non-accented Vietnamese is strictly forbidden.
> ALL structural keys and paths (JSON keys, gameState paths, command actions) MUST BE IN ENGLISH.

## 0) Structural Hard Constraints (100% Mandatory)
- Output only **ONE single valid JSON object**; any text outside the JSON is strictly forbidden.
- Fixed JSON structure, fields order as follows:
  1. PRE-story thoughts: \`t_input\` → \`t_plan\` → \`t_state\` → \`t_branch\` → \`t_precheck\`
  2. \`logs\` (Mandatory array — **write immediately after PRE-story thoughts**)
  3. \`shortTerm\` (Mandatory string)
  4. POST-story thoughts: \`t_logcheck\` → \`t_var\` → \`t_npc\` → \`t_cmd\` → \`t_audit\` → \`t_fix\` → \`t_mem\` → \`t_opts\`
  5. \`tavern_commands\` (Mandatory array)
  6. \`action_options\` (Optional array, if enabled)
- **Character limits for \`t_*\` fields (Mandatory)**:
  - \`t_input\`: ≤ 120 chars | \`t_plan\`: ≤ 160 chars | \`t_state\`: ≤ 220 chars
  - \`t_branch\`: ≤ 320 chars | \`t_precheck\`: ≤ 380 chars
  - \`t_logcheck\`: ≤ 160 chars | \`t_var\`: ≤ 200 chars | \`t_npc\`: ≤ 220 chars
  - \`t_cmd\`: ≤ 200 chars | \`t_audit\`: ≤ 240 chars | \`t_fix\`: ≤ 200 chars
  - \`t_mem\`: ≤ 100 chars | \`t_opts\`: ≤ 100 chars
- Minimum JSON template:
\`\`\`json
{
  "t_input": "Phân tích mục tiêu người chơi... (Vietnamese)",
  "t_plan": "Kế hoạch tiến triển truyện... (Vietnamese)",
  "t_state": "Trạng thái mấu chốt... (Vietnamese)",
  "t_branch": "Nhánh A: ... Nhánh B: ... Chọn: ... (Vietnamese)",
  "t_precheck": "Diễn tập lệnh: trước→sau, hợp lệ... (Vietnamese)",
  "logs": [
    {"sender": "Scenery", "text": "Mô tả phong cảnh... (Vietnamese)"},
    {"sender": "Background", "text": "Tự sự... (Vietnamese)"},
    {"sender": "Character Name", "text": "Lời thoại... (Vietnamese)"},
    {"sender": "InnerThought", "text": "Suy nghĩ nội tâm... (Vietnamese)"},
    {"sender": "Flashback", "text": "Hồi ức... (Vietnamese)"},
    {"sender": "System", "text": "Thông báo... (Vietnamese)"},
    {"sender": "Judgment", "text": "【Judgment】 Hành động｜Kết quả｜..."}
  ],
  "shortTerm": "Tóm tắt ngắn (Vietnamese)",
  "t_logcheck": "Kiểm tra nhất quán... (Vietnamese)",
  "t_var": "Ánh xạ logs → biến số... (Vietnamese)",
  "t_npc": "NPC có mặt, quan hệ... (Vietnamese)",
  "t_cmd": "Thứ tự thực thi lệnh... (Vietnamese)",
  "t_audit": "Kiểm tra đường dẫn, loại... (Vietnamese)",
  "t_fix": "Sửa lỗi lệnh... (Vietnamese)",
  "t_mem": "Tóm tắt ký ức... (Vietnamese)",
  "t_opts": "Sàng lọc lựa chọn... (Vietnamese)",
  "tavern_commands": [
    {"action": "SET", "key": "gameState.Environment.time", "value": "317:03:16:09:45"},
    {"action": "ADD", "key": "gameState.Character.energy", "value": -8},
    {"action": "PUSH", "key": "gameState.Social[3].memories", "value": {"content": "...", "time": "..."}}
  ],
  "action_options": ["Lựa chọn 1", "Lựa chọn 2", "Lựa chọn 3"]
}
\`\`\`

## 1) Logs Rules
- Senders: Background, Judgment, InnerThought, Flashback, System, Scenery.
- Use "Background" for narration, "Character Name" for dialogue.
- Use asterisks \`*\` to wrap proper nouns.
- Content must be entirely in VIETNAMESE.

## 2) Command Rules
- Valid paths: gameState.Character, gameState.Inventory, gameState.Skills, gameState.Equipment, gameState.Battle, gameState.Environment, gameState.SocialNet, gameState.Party, gameState.World, gameState.Map, gameState.Plot.
- Actions: SET, ADD, PUSH, DEL.
- Order: SET/ADD/PUSH → DEL.

## 3) Location Sync (Mandatory)
- Small move: Update \`gameState.Environment.SpecificLocation\`.
- Major move: Update all 4 levels:
  - \`gameState.Environment.MajorLocation\`
  - \`gameState.Environment.MediumLocation\`
  - \`gameState.Environment.MinorLocation\`
  - \`gameState.Environment.SpecificLocation\`

## 4) NPC and Female Lead Control
- If \`Gender=Female AND isMainCharacter=true\`, use detailed fields for profile updates (Appearance, Body, NippleColor, VaginaColor, etc.).
- Memories must be synced after significant interactions.
`,
  type: 'core setting',
  enabled: false
};
