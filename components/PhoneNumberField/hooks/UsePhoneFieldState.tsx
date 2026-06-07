import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CountryCode } from '../consts/regions';
import { CountryId } from '../enum/CountryIds';
import { generateCountryCodeList } from '../utils/generateCountryCodeList';
import { getDefaultRegion } from '../utils/getDefaultRegion';
import { onPressReturn } from '../PhoneNumberField';
import { maskToPhoneNumber } from '../utils/maskToPhoneNumber';
import { matchCountryCode } from '../utils/matchCountryCode';

interface usePhoneFieldStateParams {
  allowedCountryCodes?: CountryId[] | null;
  disallowedCountryCodes?: CountryId[] | null;
}

interface usePhoneFieldStateReturn {
  country?: CountryCode;
  filteredCountryCodes?: CountryCode[];
  phoneNumber?: string;
  outcome?: onPressReturn;
  onChangeText: (phoneNumber: string) => void;
  onChangeFlag: (countryCode: string) => void;
}

export function usePhoneFieldState({
  allowedCountryCodes,
  disallowedCountryCodes,
}: usePhoneFieldStateParams): usePhoneFieldStateReturn {
  const [country, setCountry] = useState<CountryCode | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [outcome, setOutcome] = useState<onPressReturn | undefined>(undefined);

  const filteredCountryCodes = useMemo(() => {
    return generateCountryCodeList(
      allowedCountryCodes ?? undefined,
      disallowedCountryCodes ?? undefined
    );
  }, [allowedCountryCodes, disallowedCountryCodes]);

  const onChangeText = useCallback(
    (_value: string) => {
      const cleanedValue = _value.replace('+', ''); // remove non-digit characters

      // parse the country code from the phone number and set the country state
      let matchedCountry = matchCountryCode(filteredCountryCodes, _value);
      console.log('matchedCountry', matchedCountry);
      setCountry(matchedCountry || undefined);

      if (!!matchedCountry && cleanedValue.length >= 2) {
        // apply masking to the phone number based on the matched country code
        const output = maskToPhoneNumber(
          cleanedValue,
          matchedCountry?.code.replace('+', ''),
          matchedCountry?.mask
        );
        setPhoneNumber(output);
        const ouputWthOutMask = output.replace(/\D/g, '');
        console.debug(output, ouputWthOutMask);

        const correctLength = (matchedCountry.code + matchedCountry.mask).length;
        setOutcome({
          countryDetails: matchedCountry || null,
          phoneNumber: ouputWthOutMask,
          isValid: !!matchedCountry && cleanedValue.length + 1 === correctLength,
          correctLength,
        });
      } else {
        setPhoneNumber(cleanedValue);
        const correctLength = ((matchedCountry?.code ?? '') + (matchedCountry?.mask ?? '')).length;
        setOutcome({
          countryDetails: matchedCountry || null,
          phoneNumber: cleanedValue,
          isValid: !!matchedCountry && cleanedValue.length + 1 === correctLength,
          correctLength,
        });
      }
    },
    [filteredCountryCodes]
  );

  useEffect(() => {
    // Should only run on first render
    // console.debug('usePhoneFieldState useEffect HAS RAN!', filteredCountryCodes);
    const defaultRegion = getDefaultRegion(filteredCountryCodes);
    console.log(defaultRegion);
    setCountry(defaultRegion);
    onChangeText(defaultRegion?.code ?? ''); // set the default country code in the input field on load

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    country,
    filteredCountryCodes,
    phoneNumber,
    outcome,
    onChangeText,
  };
}
