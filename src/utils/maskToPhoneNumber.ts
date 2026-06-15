export function maskToPhoneNumber(rawInput: string, countryCode: string, mask: string): string {
  const justDigits = rawInput.replace(/\D/g, '');
  const restOfNumber = justDigits.slice(countryCode.length, justDigits.length);
  let digitIndex = 0;
  let maskedPart = '';

  for (const char of mask) {
    console.debug(
      'char',
      char,
      'digitIndex',
      digitIndex,
      'restOfNumber',
      restOfNumber,
      'restOfNumber[digitIndex]',
      restOfNumber[digitIndex],
      'Output',
      maskedPart
    );

    if (digitIndex >= restOfNumber.length) break;
    if (char === '#') {
      maskedPart += restOfNumber[digitIndex++];
    } else {
      maskedPart += char;
    }
  }

  return countryCode + maskedPart;
}
