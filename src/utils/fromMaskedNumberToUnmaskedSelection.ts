export function fromMaskedNumberToUnmaskedSelection(
  maskedValue: string,
  maskedPoint: number
): number {
  let count = 0;
  for (let i = 0; i < maskedPoint && i < maskedValue.length; i++) {
    if (/\d/.test(maskedValue[i])) count++;
  }
  return count;
}
