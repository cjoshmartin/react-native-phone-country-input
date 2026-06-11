import { useMemo, useRef } from 'react';
import { TextInput } from 'react-native';

import { CountryCode } from './consts/regions';

export interface onPressReturn {
  countryDetails: CountryCode | null;
  phoneNumber: string;
  isValid: boolean;
  correctLength: number;
}

export interface PhoneNumberFieldProps extends React.ComponentProps<typeof TextInput> {
  underlineInput?: typeof TextInput | React.ReactNode | null;
  onInputChange?: (outcome: onPressReturn) => void;
  onOpen?: () => void;
}

export function PhoneNumberField(props: PhoneNumberFieldProps) {
  const { underlineInput, onOpen, ...textInputProps } = props;
  const selectionRef = useRef({ start: 0, end: 0 });

  const Input = useMemo(() => {
    if (!underlineInput) {
      return TextInput;
    }
    return underlineInput;
  }, [underlineInput]);

  return (
    <Input
      {...textInputProps}
      value={'+' + props.value}
      showSoftInputOnFocus={false}
      onPressIn={onOpen}
      onSelectionChange={(e: unknown) => (selectionRef.current = e.nativeEvent.selection)}
    />
  );
}
