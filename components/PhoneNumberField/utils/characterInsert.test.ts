import { SELECTION_TYPE } from '../consts/KEYBOARD_LAYOUT';
import { characterInsert } from './characterInsert';

describe('characterInsert', () => {
  // ── append (no prior selection) ───────────────────────────────────────────

  it('appends when start=0 and hasBeenSelected is false', () => {
    const selection: SELECTION_TYPE = { start: 0, end: 0, hasBeenSelected: false };
    expect(characterInsert('+13', '6', selection)).toBe('+136');
  });

  it('appends to a single-digit number when hasBeenSelected is false', () => {
    const selection: SELECTION_TYPE = { start: 0, end: 0, hasBeenSelected: false };
    expect(characterInsert('+1', '3', selection)).toBe('+13');
  });

  // ── non-range insert (collapsed cursor) ───────────────────────────────────

  it('inserts at the end when cursor is after the last digit', () => {
    //                             0 1
    const selection: SELECTION_TYPE = { start: 1, end: 1, hasBeenSelected: true };
    expect(characterInsert('+1', '3', selection)).toBe('+13');
  });

  it('inserts in the middle, shifting digits right', () => {
    // cursor after digit 2 (start=2); inserts '9' before the '3'
    //                             0 1 2 3 4 5
    const selection: SELECTION_TYPE = { start: 2, end: 2, hasBeenSelected: true };
    expect(characterInsert('+12345', '9', selection)).toBe('+129345');
  });

  it('inserts after the first digit when cursor is at start=0 with a prior selection', () => {
    // start=0 is clamped to 1 in the non-range path to protect the country code
    //                             0 1 2 3 4 5
    const selection: SELECTION_TYPE = { start: 0, end: 0, hasBeenSelected: true };
    expect(characterInsert('+12345', '9', selection)).toBe('+192345');
  });

  // ── range replace ─────────────────────────────────────────────────────────

  it('replaces a range in the middle', () => {
    // start=2: 2 digits before selection → first selected char at index 3
    // end=5:   5 digits before selection end → last selected char at index 5
    // selects '0','7','4' at indices 3–5, replaces with '368'
    //                                   0 1 2 3 4 5 6 7 8 9 …
    const selection: SELECTION_TYPE = { start: 2, end: 5, hasBeenSelected: true };
    expect(characterInsert('+13074106456', '368', selection)).toBe('+13368106456');
  });

  it('replaces from the first digit when start=0', () => {
    // start=0: selection begins at index 1 (first digit)
    // end=3:   selects '1','2','3', replaces with '9'
    const selection: SELECTION_TYPE = { start: 0, end: 3, hasBeenSelected: true };
    expect(characterInsert('+12345', '9', selection)).toBe('+945');
  });

  it('replaces a single-digit selection', () => {
    // start=1, end=2: selects char at index 2 ('2'), replaces with '9'
    const selection: SELECTION_TYPE = { start: 1, end: 2, hasBeenSelected: true };
    expect(characterInsert('+12345', '9', selection)).toBe('+19345');
  });

  it('replaces the entire number', () => {
    // start=0, end=5: selects all 5 digits, replaces with '9'
    const selection: SELECTION_TYPE = { start: 0, end: 5, hasBeenSelected: true };
    expect(characterInsert('+12345', '9', selection)).toBe('+9');
  });
});
