import { SELECTION_TYPE } from '../consts/KEYBOARD_LAYOUT';

export function characterInsert(
  phoneNumber: string,
  newChar: string,
  selection: SELECTION_TYPE
): string {
  const isARange = selection.start !== selection.end;

  if (isARange) {
    // selection.start digits are before the selection; first selected char is at index start+1
    return phoneNumber.slice(0, selection.start + 1) + newChar + phoneNumber.slice(selection.end + 1);
  } else if (selection.start === 0 && !selection.hasBeenSelected) {
    return phoneNumber + newChar;
  } else {
    // cursor is after `start` digits; insert before char at index start+1; clamp to protect '+'
    const start = Math.max(selection.start, 1);
    return phoneNumber.slice(0, start + 1) + newChar + phoneNumber.slice(start + 1);
  }
}
