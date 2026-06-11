import { SELECTION_TYPE } from '../consts/KEYBOARD_LAYOUT';
import { characterInsert } from './characterInsert';

describe('characterInsert', () => {
  it('should allow for a charactor insert at end of string', () => {
    const intial = '+1';
    const charToAdd = '3';
    const selection: SELECTION_TYPE = { start: 0, end: 0, hasBeenSelected: false };
    const expected = '+13';

    const acutal = characterInsert(intial, charToAdd, selection);

    expect(expected).toBe(acutal);
  });
  it('should allow for a charactor insert at end of string', () => {
    const intial = '+1';
    const charToAdd = '3';
    const selection: SELECTION_TYPE = { start: 0, end: 0, hasBeenSelected: false };
    const expected = '+13';

    const acutal = characterInsert(intial, charToAdd, selection);

    expect(expected).toBe(acutal);
  });
});
