import { SELECTION_TYPE } from '../consts/KEYBOARD_LAYOUT';

export function characterDeletion(phoneNumber: string, selection: SELECTION_TYPE): string {
  // Clamp to 1 to protect the leading '+'
  const start = Math.max(selection.start, 1);
  const end = Math.max(selection.end, 1);

  if (selection.start === selection.end && !selection.hasBeenSelected) {
    return phoneNumber.slice(0, -1)
  } else if (selection.start !== selection.end) {
    // delete the selected range
    const startingText = phoneNumber.slice(0, start);
    const endingText = phoneNumber.slice(end);
    const result = startingText + endingText;

    return result;
  } else if (selection.start > 0) {
    // delete the character before the cursor
    const startingText = phoneNumber.slice(0, start - 1);
    const endingText = phoneNumber.slice(start);
    const result = startingText + endingText;

    return result;
  }
  return '';
}
