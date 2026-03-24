import { describe, expect, it } from 'vitest';
import { StatWorldEvolution } from './world';

describe('StatWorldEvolution prompt', () => {
  it('includes time unit and current world time setup', () => {
    expect(StatWorldEvolution.content).toContain('Canh giờ');
    expect(StatWorldEvolution.content).toContain('Giáp tý');
    expect(StatWorldEvolution.content).toContain('Nguyên hội');
    expect(StatWorldEvolution.content).toContain('Nguyên Hội lịch năm 3726, tháng Chạp, ngày 23, giờ Thân ba khắc');
  });

  it('integrates seclusion rules with gameState updates', () => {
    expect(StatWorldEvolution.content).toContain('Thiết lập Bế quan');
    expect(StatWorldEvolution.content).toContain('Thời lượng & Xác suất Bế quan theo cảnh giới');
    expect(StatWorldEvolution.content).toContain('gameState.Story.pendingEvents');
    expect(StatWorldEvolution.content).toContain('gameState.World.ongoingEvents');
    expect(StatWorldEvolution.content).toContain('gameState.Character.meridianStatus');
    expect(StatWorldEvolution.content).toContain('gameState.Environment.specificLocation');
    expect(StatWorldEvolution.content).toContain('gameState.Environment.time');
  });
});
