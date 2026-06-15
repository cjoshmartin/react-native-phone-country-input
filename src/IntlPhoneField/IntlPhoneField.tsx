import React, { useEffect } from 'react';
import { View, Modal, Pressable } from 'react-native';
import { spacing } from '../Styling/Sizing';
import { PhoneFieldOutcome, PhoneNumberField, PhoneNumberFieldProps } from '../PhoneNumberField';
import { CountrySelector } from '../CountrySelector/CountrySelector';
import { usePhoneFieldState } from '../hooks/UsePhoneFieldState';
import { CountryId } from '../enum/CountryIds';

import Keyboard from '../Keyboard/Keyboard';

export interface IntlPhoneFieldProps extends PhoneNumberFieldProps {
  underlineButton?: React.ComponentType<React.ComponentProps<typeof Pressable>> | null;
  underlineModal?: React.ComponentType<React.ComponentProps<typeof Modal>> | null;
  allowedCountryCodes?: CountryId[] | null;
  disallowedCountryCodes?: CountryId[] | null;
  onOutcomeChange: (outcome?: PhoneFieldOutcome) => void;
}

export function IntlPhoneField({
  underlineButton,
  underlineModal,
  style,
  allowedCountryCodes,
  disallowedCountryCodes,
  onOutcomeChange,
  ...props
}: IntlPhoneFieldProps) {
  const {
    filteredCountryCodes,
    outcome,
    onChangeText,
    onChangeFlag,
    onKeyPress,
    phoneNumber,
    onCopy,
    onPaste,
    isKeyboardOpen,
    openKeyboard,
    closeKeyboard,
    isCountrySelectorOpen,
    openCountrySelector,
    closeCountrySelector,
    onTextSelection,
    cursorPosition,
  } = usePhoneFieldState({
    allowedCountryCodes,
    disallowedCountryCodes,
  });

  useEffect(() => {
    onOutcomeChange(outcome);
  }, [onOutcomeChange, outcome]);

  return (
    <>
      <View
        style={[
          {
            flexDirection: 'row',
            gap: spacing[1],
          },
          style,
        ]}>
        <CountrySelector
          value={outcome?.countryDetails ?? null}
          onSelectCountry={onChangeFlag}
          underlineButton={underlineButton}
          underlineModal={underlineModal}
          filtedredCountryCodes={filteredCountryCodes}
          isOpen={isCountrySelectorOpen}
          onOpenChange={(open) => (open ? openCountrySelector() : closeCountrySelector())}
        />
        <PhoneNumberField
          {...props}
          value={phoneNumber}
          onChangeText={onChangeText}
          onOpen={openKeyboard}
          onTextSelection={onTextSelection}
          selection={cursorPosition}
        />
      </View>
      <Keyboard
        onKeyPress={onKeyPress}
        value={phoneNumber}
        onCopy={onCopy}
        onPaste={onPaste}
        isOpen={isKeyboardOpen}
        onClose={closeKeyboard}
      />
    </>
  );
}
