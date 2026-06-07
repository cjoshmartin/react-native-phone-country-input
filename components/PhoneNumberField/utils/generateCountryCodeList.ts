import { countryCodeList } from '../consts/regions';
import { CountryId } from '../enum/CountryIds';

export function generateCountryCodeList(
  allowedCountryCodes?: CountryId[],
  disallowedCountryCodes?: CountryId[]
) {
  return (
    countryCodeList
      .filter(({ id }) => {
        if (allowedCountryCodes && !allowedCountryCodes.includes(id)) {
          return false;
        }
        if (disallowedCountryCodes && disallowedCountryCodes.includes(id)) {
          return false;
        }
        return true;
      })
      // sort by longer country codes first to ensure that we match the most specific country code when parsing the phone number
      .sort((a, b) => b.code.length - a.code.length)
  );
}
