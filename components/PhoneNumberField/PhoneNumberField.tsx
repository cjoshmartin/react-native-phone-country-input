import { useCallback, useEffect, useMemo, useState } from 'react';
import { TextInput } from 'react-native';

import { CountryCode } from './consts/regions';
import { maskToPhoneNumber } from './utils/maskToPhoneNumber';
import { matchCountryCode } from './utils/matchCountryCode';

export interface onPressReturn {
  countryDetails: CountryCode | null;
  phoneNumber: string;
  isValid: boolean;
  correctLength: number;
}

// props to this compoent
// whitelist of country codes of what is allowed to be entered in the phone number field. default is null
// blacklist of countries that shouldn't appear in the list. default is null
// underlining of the input field. default is false
export interface PhoneNumberFieldProps extends React.ComponentProps<typeof TextInput> {
  underlineInput?: typeof TextInput | React.ReactNode | null;
  onInputChange?: (outcome: onPressReturn) => void;
}

export function PhoneNumberField(props: PhoneNumberFieldProps) {
  const { underlineInput, ...textInputProps } = props;
  const [internalValue, setinternalValue] = useState('');
  const [country, setCountry] = useState<CountryCode | null>(null);

  const Input = useMemo(() => {
    if (!underlineInput) {
      return TextInput;
    }
    return underlineInput;
  }, [underlineInput]);

  const onChangeText = useCallback(
    (_value: string) => {
      const cleanedValue = _value.replace('+', ''); // remove non-digit characters

      // parse the country code from the phone number and set the country state
      let matchedCountry = matchCountryCode(filteredCountryCodes, _value);
      console.log('matchedCountry', matchedCountry);
      setCountry(matchedCountry || null);

      if (!!matchedCountry && cleanedValue.length >= 2) {
        // apply masking to the phone number based on the matched country code
        const output = maskToPhoneNumber(
          cleanedValue,
          matchedCountry?.code.replace('+', ''),
          matchedCountry?.mask
        );
        setinternalValue(output);
        const ouputWthOutMask = output.replace(/\D/g, '');
        console.debug(output, ouputWthOutMask);

        if (textInputProps?.onInputChange) {
          const correctLength = (matchedCountry.code + matchedCountry.mask).length;
          textInputProps?.onInputChange({
            countryDetails: matchedCountry || null,
            phoneNumber: ouputWthOutMask,
            isValid: !!matchedCountry && cleanedValue.length + 1 === correctLength,
            correctLength,
          });
        }
      } else {
        setinternalValue(cleanedValue);
        if (textInputProps?.onInputChange) {
          const correctLength = ((matchedCountry?.code ?? '') + (matchedCountry?.mask ?? ''))
            .length;
          textInputProps.onInputChange({
            countryDetails: matchedCountry || null,
            phoneNumber: cleanedValue,
            isValid: !!matchedCountry && cleanedValue.length + 1 === correctLength,
            correctLength,
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [textInputProps.onChangeText, setinternalValue]
  );
  return (
    <>
      <Input
        {...textInputProps}
        // placeholder={country?.mask.replace('#', '_')}
        value={'+' + props.value}
        // onChangeText={onChangeText}
      />
    </>
  );
}
