import { MutableRefObject, useMemo } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputSelectionChangeEventData } from 'react-native';

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
  onTextSelection?: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
}

export function PhoneNumberField(props: PhoneNumberFieldProps) {
  const { underlineInput, onOpen, onTextSelection, ...textInputProps } = props;

  const Input = useMemo(() => {
    if (!underlineInput) {
      return TextInput;
    }
    return underlineInput;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [underlineInput, props.selection]);

  return (
    <Input
      {...textInputProps}
      value={'+' + props.value}
      showSoftInputOnFocus={false}
      onPressIn={onOpen}
      onSelectionChange={onTextSelection}
      style={[
        props.style,
        {
          zIndex: 1,
        },
      ]}
    />
  );
}
