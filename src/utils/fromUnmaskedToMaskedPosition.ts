export function fromUnmaskedToMaskedPosition(maskedValue: string, unmaskedPos: number): number {
  if (unmaskedPos <= 0) return 1;
  let digitCount = 0;
  for (let i = 0; i < maskedValue.length; i++) {
    if (/\d/.test(maskedValue[i])) {
      digitCount++;
      if (digitCount === unmaskedPos) {
        return i + 1;
      }
    }
  }
  return maskedValue.length;
}
