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

  const Input = useMemo(() => {
    if (!underlineInput) {
      return TextInput;
    }
    return underlineInput;
  }, [underlineInput]);

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
