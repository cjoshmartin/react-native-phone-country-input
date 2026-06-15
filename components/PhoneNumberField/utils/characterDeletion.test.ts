import { characterDeletion } from './characterDeletion';

describe('characterDeletion', () => {
  // ── backspace (collapsed cursor) ──────────────────────────────────────────

  it('deletes the character before the cursor', () => {
    //                         01234
    expect(characterDeletion('+1234', { start: 3, end: 3, hasBeenSelected: true })).toBe('+124');
  });

  it('deletes at the end of the string', () => {
    //                         01234
    expect(characterDeletion('+1234', { start: 4, end: 4, hasBeenSelected: true })).toBe('+123');
  });

  it('deletes the first digit when cursor is after it', () => {
    //                         01234
    expect(characterDeletion('+1234', { start: 1, end: 1, hasBeenSelected: true })).toBe('+234');
  });

  it('clamps backspace to protect the leading + when cursor is at 0', () => {
    //                         01
    expect(characterDeletion('+1', { start: 0, end: 0, hasBeenSelected: true })).toBe('+');
  });

  it('deletes from the end when cursor is at 0 with no prior selection', () => {
    expect(characterDeletion('+1312', { start: 0, end: 0, hasBeenSelected: false })).toBe('+131');
  });

  // ── range deletion ────────────────────────────────────────────────────────

  it('deletes a selected range in the middle', () => {
    // start=2: 2 digits before selection → first selected char is at index 3
    // end=4:   4 digits before selection end → last selected char is at index 4
    // selects '3' and '4', preserves '+12' and '' → '+12'
    //                         01234
    expect(characterDeletion('+1234', { start: 2, end: 4, hasBeenSelected: true })).toBe('+12');
  });

  it('deletes from the first digit when selection starts at 0', () => {
    // start=0: 0 digits before selection → first selected char is at index 1
    // end=3:   selects '1', '2', '3', preserves '+' and '4' → '+4'
    //                         01234
    expect(characterDeletion('+1234', { start: 0, end: 3, hasBeenSelected: true })).toBe('+4');
  });

  it('deletes a single char range', () => {
    // start=1, end=2: selects the single char at index 2 ('2')
    //                         01234
    expect(characterDeletion('+1234', { start: 1, end: 2, hasBeenSelected: true })).toBe('+134');
  });

  it('deletes all digits when the full string is selected', () => {
    //                         01234
    expect(characterDeletion('+1234', { start: 0, end: 4, hasBeenSelected: true })).toBe('+');
  });
});
