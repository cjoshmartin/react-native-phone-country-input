import { SELECTION_TYPE } from '../consts/KEYBOARD_LAYOUT';

export function characterInsert(
  phoneNumber: string,
  newChar: string,
  selection: SELECTION_TYPE
): string {
  let outcome = '';
  if (selection.start === selection.end && !selection.hasBeenSelected) {
    const outcome = phoneNumber + newChar;
    return outcome;
  } else {
    const startingText = phoneNumber.slice(0, selection.start);
    const current_key = newChar;
    const endingText = phoneNumber.slice(selection.end);
    outcome = startingText + current_key + endingText;
  }

  return outcome;
}
