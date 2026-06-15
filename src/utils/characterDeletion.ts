import { SELECTION_TYPE } from '../consts/KEYBOARD_LAYOUT';

export function characterDeletion(phoneNumber: string, selection: SELECTION_TYPE): string {
  const isRange = selection.start !== selection.end;

  if (!selection.hasBeenSelected && !isRange && selection.start === 0) {
    return phoneNumber.slice(0, -1);
  }
  if (isRange) {
    // selection.start digits are before the selection; first selected char is at index start+1
    return phoneNumber.slice(0, selection.start + 1) + phoneNumber.slice(selection.end + 1);
  }
  // backspace: delete the digit immediately to the left of cursor (at index start); clamp to protect '+'
  const start = Math.max(selection.start, 1);
  return phoneNumber.slice(0, start) + phoneNumber.slice(start + 1);
}
