import { PromptStructure } from '../../types';

export const coreDataFormat: PromptStructure = {
  id: 'core_data',
  title: 'Data Format Definition',
  content: `
<Data structure definition>
# 【Data Structure Definition】WuXia SaveData (V3.0 English Structural)

> Objective: Define the "executable and complete" state tree of this project. AI MUST strictly follow this definition when creating \`tavern_commands\`.
> Principle: Check path first, then match fields, finally check type and constraints.

## 0. Platinum Path Rules (CRITICAL)
- \`gameState.Character\`: { \`id\`, \`name\`, \`gender\`, \`age\`, \`realm\`, \`karma\` }
- \`gameState.Inventory\` (All baggage, items, equipment in bag)
- \`gameState.Kungfu\` (All manuals, moves, internal kungfu)
- \`gameState.Equipment\` (Currently equipped slots)
- \`gameState.Combat\` (Current battle status and enemies)
- \`gameState.Environment\` (Time, location, weather, progress)
- \`gameState.Social\` (Social NPC list, favorability, memories)
- \`gameState.Team\` (Teammates/Followers list)
- \`gameState.World\` (Major events, rumors, global NPCs)
- \`gameState.Map\` (Coordinate info, buildings, areas)
- \`gameState.Story\` (Chapters, foreshadowing, story variables)
- \`gameState.TaskList\` (Active mission list)
- \`gameState.AppointmentList\` (Scheduled meetings/promises)

## 1. NPC Structure (Social/Team)
- \`id\` (BẮT BUỘC: \`snake_case\`, không dấu, permanent), \`name\`, \`gender\`, \`age\`, \`identity\`, \`realm\`
- \`appearanceDescription\`: Visual description (Mandatory for key NPCs)
- \`corePersonalityTraits\`: Personality description (Mandatory for accurate roleplay)
- \`favorability\`: Number (Interpersonal point)
- \`relationStatus\`: String (Stranger, Friend, Lover, Enemy, etc.)
- \`memories\`: Array of {content, time}
- \`socialNetworkVariables\`: Array of {targetName, relation, note}
- \`isPresent\`: Boolean (True if NPC is in current scene)
- \`isTeammate\`: Boolean

## 2. Environment Structure
- \`time\`: \`YYYY:MM:DD:HH:MM\`
- \`gameDays\`: Number (Total days passed)
- \`majorLocation\`, \`mediumLocation\`, \`minorLocation\`, \`specificLocation\`
- \`x\`, \`y\`: Number (Global Coordinates 0-1000)
- \`biomeId\`, \`regionId\`: String (Permanent identifiers)
- \`weather\`: { \`type\`, \`description\`, \`endDate\` }
- \`karma\`: Number (World karma value)
- \`level_3_nodes\`: Array of {
              id: string,
              name: string,
              type: "Thành trì" | "Tông môn" | "Bí cảnh" | "Thôn trang" | "Di tích" | "Hang động" | "Rừng rậm",
              faction: string,
              description: string,
              x: number (0-1000),
              y: number (0-1000),
              possibleOrigins: string[], // Danh sách các xuất thân tiềm năng tại đây
              typicalPersonalities: string[] // Các loại tính cách đặc trưng của nhân vật tại đây
            }
- \`worldTick\`: Number (Global world progression tick)

## 3. Combat Structure
- \`isInBattle\`: Boolean
- \`enemy\`: { \`id\`, \`name\`, \`currentHp\`, \`maxHp\`, \`attack\`, \`defense\` } | null

## 4. Item Structure (Inventory)
- \`id\`, \`name\`, \`description\`, \`type\`, \`quality\`, \`weight\`, \`spaceOccupied\`, \`value\`
- \`currentContainerId\`: Path/ID where item is stored.
- \`containerProperties\`: {maxCapacity, currentUsedSpace, maxSingleItemSize}

</Data structure definition>
`.trim(),
  type: 'core setting',
  enabled: true
};
