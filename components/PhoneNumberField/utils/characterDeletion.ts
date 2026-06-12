import { SELECTION_TYPE } from '../consts/KEYBOARD_LAYOUT';

export function characterDeletion(phoneNumber: string, selection: SELECTION_TYPE): string {
  // Clamp to 1 to protect the leading '+'
  const start = Math.max(selection.start, 1);
  const end = Math.max(selection.end, 1);

  const isRange = start !== end;

  if (!selection.hasBeenSelected && !isRange && selection.start === 0) {
    return phoneNumber.slice(0, -1);
  }
  return phoneNumber.slice(0, start) + phoneNumber.slice(end + 1);
}
