import { CountryCode } from '../consts/regions';

export function matchCountryCode(
  filteredCountryCodes: CountryCode[],
  rawInput: string
): CountryCode | undefined {
  return filteredCountryCodes.find(({ code }) => {
    // intentional to use _value here instead of cleanedValue because we want to match against the raw input value that includes the '+' sign and any formatting characters, since country codes are typically prefixed with a '+' and may be followed by formatting characters like dashes or parentheses. Using cleanedValue would remove these characters and could lead to incorrect matching of country codes.

    const input_without_pls = rawInput.replace('+', '');
    const code_without_pls = code.replace('+', '');
    const result = input_without_pls.startsWith(code_without_pls);
    // console.debug(
    //   'checking code',
    //   code,
    //   'against cleanedValue',
    //   cleanedValue,
    //   'result',
    //   result
    // );
    return result;
  });
}
