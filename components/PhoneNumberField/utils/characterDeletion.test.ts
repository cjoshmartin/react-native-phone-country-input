import { characterDeletion } from './characterDeletion';

describe('characterDeletion', () => {
  it('deletes the character before the cursor', () => {
    // //                     01234
    expect(characterDeletion('+1234', { start: 3, end: 3, hasBeenSelected: true })).toBe('+124');
  });

  it('deletes a selected range', () => {
    //                        01234
    expect(characterDeletion('+1234', { start: 2, end: 4, hasBeenSelected: true })).toBe('+1');
  });

  it('clamps selection start to 1 to protect the leading +', () => {
    // selection from 0→3 clamps start to 1, so '+' is preserved
    //                        01234           0->1
    expect(characterDeletion('+1234', { start: 0, end: 3, hasBeenSelected: true })).toBe('+4');
  });

  it('returns empty string when cursor is at 0 with no selection', () => {
    expect(characterDeletion('+1', { start: 0, end: 0, hasBeenSelected: true })).toBe('+');
  });

  it('should delete at the end of the string if both start and end are zero and hasBeenSelected is false', () => {
    expect(characterDeletion('+1312', { start: 0, end: 0, hasBeenSelected: false })).toBe('+131');
  });
});
