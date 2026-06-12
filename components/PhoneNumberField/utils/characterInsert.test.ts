import { SELECTION_TYPE } from '../consts/KEYBOARD_LAYOUT';
import { characterInsert } from './characterInsert';

describe('characterInsert', () => {
  it('should insert at the end of the string if both start and end are zero and hasBeenSelected is false', () => {
    const intial = '+13';
    const charToAdd = '6';
    const selection: SELECTION_TYPE = { start: 0, end: 0, hasBeenSelected: false };
    const expected = '+136';

    const acutal = characterInsert(intial, charToAdd, selection);

    expect(acutal).toBe(expected);
  });
  it('should allow for a charactor insert at end of string', () => {
    const intial = '+1';
    const charToAdd = '3';
    const selection: SELECTION_TYPE = { start: 0, end: 0, hasBeenSelected: false };
    const expected = '+13';

    const acutal = characterInsert(intial, charToAdd, selection);

    expect(acutal).toBe(expected);
  });
  it('should allow for a charactor insert at end of string', () => {
    const intial = '+1';
    const charToAdd = '3';
    const selection: SELECTION_TYPE = { start: 1, end: 1, hasBeenSelected: true };
    const expected = '+13';

    const acutal = characterInsert(intial, charToAdd, selection);

    expect(acutal).toBe(expected);
  });

  it('should allow for a charactor insert at end of string', () => {
    //              012345
    const intial = '+13074106456';
    const charToAdd = '368';
    const selection: SELECTION_TYPE = { start: 3, end: 5, hasBeenSelected: true };
    //                012345
    const expected = '+13368106456';

    const acutal = characterInsert(intial, charToAdd, selection);

    expect(acutal).toBe(expected);
  });
});
