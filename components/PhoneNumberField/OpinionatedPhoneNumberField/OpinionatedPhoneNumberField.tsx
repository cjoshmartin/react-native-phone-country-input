import React, { useEffect, useRef } from 'react';
import { View, Modal, Pressable } from 'react-native';
import { spacing } from '../Styling/Sizing';
import { onPressReturn, PhoneNumberField, PhoneNumberFieldProps } from '../PhoneNumberField';
import { CountrySelector } from '../CountrySelector/CountrySelector';
import { usePhoneFieldState } from '../hooks/UsePhoneFieldState';
import { CountryId } from '../enum/CountryIds';

interface OpinionatedPhoneNumberFieldProps extends PhoneNumberFieldProps {
  // This component is opinionated and will have the country selector and phone number field styled in a specific way. It will also have some default behavior such as only allowing US and CA country codes. The user can still pass in props to customize the behavior of the phone number field and country selector but the styling and layout will be fixed.
  // I want to make this component as easy to use as possible for common use cases while still allowing for customization when needed.
  underlineButton?: typeof Pressable | null;
  underlineModal?: typeof Modal | null;
  allowedCountryCodes?: CountryId[] | null;
  disallowedCountryCodes?: CountryId[] | null;
  onOutcomeChange: (outcome?: onPressReturn) => void;
}

export function OpinionatedPhoneNumberField({
  underlineButton,
  underlineModal,
  style,
  allowedCountryCodes,
  disallowedCountryCodes,
  onOutcomeChange,
  ...props
}: OpinionatedPhoneNumberFieldProps) {
  const { filteredCountryCodes, outcome, onChangeText, onChangeFlag, phoneNumber } =
    usePhoneFieldState({
      allowedCountryCodes,
      disallowedCountryCodes,
    });

  // const textInput = useRef(undefined);

  useEffect(() => {
    onOutcomeChange(outcome);
  }, [onOutcomeChange, outcome]);

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          gap: spacing[1],
        },
        style,
      ]}>
      <CountrySelector
        value={outcome?.countryDetails}
        onSelectCountry={onChangeFlag}
        underlineButton={underlineButton}
        underlineModal={underlineModal}
        filtedredCountryCodes={filteredCountryCodes}
      />
      <PhoneNumberField
        // ref={textInput}
        {...props}
        value={phoneNumber}
        onChangeText={onChangeText}
      />
    </View>
  );
}
