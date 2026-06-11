import { characterDeletion } from './characterDeletion';

describe('characterDeletion', () => {
  it('deletes the character before the cursor', () => {
    // cursor at 3 → deletes char at index 2 ('2'), leaving '+134'
    expect(characterDeletion('+1234', { start: 3, end: 3, hasBeenSelected: true })).toBe('+134');
  });

  it('deletes a selected range', () => {
    expect(characterDeletion('+1234', { start: 2, end: 4, hasBeenSelected: true })).toBe('+14');
  });

  it('clamps selection start to 1 to protect the leading +', () => {
    // selection from 0→3 clamps start to 1, so '+' is preserved
    expect(characterDeletion('+1234', { start: 0, end: 3, hasBeenSelected: true })).toBe('+34');
  });

  it('returns empty string when cursor is at 0 with no selection', () => {
    expect(characterDeletion('+1', { start: 0, end: 0, hasBeenSelected: true })).toBe('');
  });
});
