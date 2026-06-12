import { SELECTION_TYPE } from '../consts/KEYBOARD_LAYOUT';

export function characterInsert(
  phoneNumber: string,
  newChar: string,
  selection: SELECTION_TYPE
): string {
  const start = Math.max(selection.start, 1);
  const end = Math.max(selection.end, 1);

  // let outcome = '';

  const isARange = start !== end;
  if (isARange) {
    const firstHalf = phoneNumber.slice(0, start);
    const secondHalf = phoneNumber.slice(end + 1);
    return firstHalf + newChar + secondHalf;
  } else if (selection.start === 0 && !selection.hasBeenSelected) {
    return phoneNumber + newChar;
  } else {
    let outcome = [...phoneNumber];
    outcome[start + 1] = newChar;
    return outcome.join('');
  }
}
