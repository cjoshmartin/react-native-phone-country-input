import { CountryId } from 'components/PhoneNumberField/enum/CountryIds';
import { OpinionatedPhoneNumberField } from 'components/PhoneNumberField/OpinionatedPhoneNumberField/OpinionatedPhoneNumberField';
import { onPressReturn } from 'components/PhoneNumberField/PhoneNumberField';
import { spacing, borders } from 'components/PhoneNumberField/Styling/Sizing';
import React from 'react';
import { PortalHost, PortalProvider } from 'react-native-teleport';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import 'react-native-gesture-handler';

function StyledTextInput(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      style={[
        {
          flex: 1,
          borderWidth: borders.DEFAULT,
          borderColor: 'gray',
          padding: spacing[2.5],
        },
        props.style,
      ]}
    />
  );
}

function StyledPhoneButton(props: React.ComponentProps<typeof Pressable>) {
  return (
    <Pressable
      {...props}
      style={[
        {
          flexDirection: 'row',
          gap: spacing[1],
          paddingHorizontal: spacing[1],
          borderWidth: borders.DEFAULT,
          borderColor: 'gray',
          alignItems: 'center',
        },
      ]}>
      {props.children}
    </Pressable>
  );
}

function StyledModal() {
  return <View></View>;
}

const DISALLOWED_COUNTRY_CODES = [
  CountryId.ANTIGUA_AND_BARBUDA,
  CountryId.ANGUILLA,
  CountryId.UNITED_STATES_VIRGIN_ISLANDS,
  CountryId.TURKS_AND_CAICOS_ISLANDS,
  CountryId.TRINIDAD_AND_TOBAGO,
  CountryId.SINT_MAARTEN,
  CountryId.SAINT_VINCENT_AND_THE_GRENADINES,
  CountryId.SAINT_LUCIA,
  CountryId.SAINT_KITTS_AND_NEVIS,
  CountryId.PUERTO_RICO,
  CountryId.NORTHERN_MARIANA_ISLANDS,
  CountryId.MONTSERRAT,
  CountryId.JAMAICA,
  CountryId.GUAM,
  CountryId.GRENADA,
  CountryId.DOMINICAN_REPUBLIC,
  CountryId.DOMINICA,
  CountryId.CAYMAN_ISLANDS,
  CountryId.BRITISH_VIRGIN_ISLANDS,
  CountryId.BERMUDA,
  CountryId.BARBADOS,
  CountryId.BAHAMAS,
  CountryId.AMERICAN_SAMOA,
];

export default function App() {
  const [value, setValue] = React.useState('');
  const [outcome, setOutcome] = React.useState<onPressReturn | null>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const onPress = React.useCallback((outcome: onPressReturn) => {
    setValue(outcome?.phoneNumber);
    setOutcome(outcome);
  }, []);

  return (
    <PortalProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <OpinionatedPhoneNumberField
            underlineInput={StyledTextInput}
            underlineButton={StyledPhoneButton}
            underlineModal={null}
            onOutcomeChange={onPress}
            value={value}
            style={styles.input}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disallowedCountryCodes={DISALLOWED_COUNTRY_CODES}
          />
          <View
            style={{
              margin: spacing[5],
              gap: spacing[2.5],
            }}>
            <Text>{isFocused ? 'Input is focused' : 'Input is not focused'}</Text>
            <Text>Outcome:{!outcome && <Text>No outcome yet</Text>}</Text>
            {outcome && (
              <View
                style={{
                  marginLeft: spacing[2.5],
                  gap: spacing[1],
                }}>
                <Text>phoneNumber: {outcome.phoneNumber}</Text>
                <Text>correctLength: {outcome.correctLength}</Text>
                <Text style={{ color: outcome.isValid ? 'green' : 'red' }}>
                  isValid: {outcome.isValid.toString()}
                </Text>
                <Text>Country Details: {!outcome.countryDetails && <Text>None Found</Text>}</Text>
                {outcome.countryDetails && (
                  <View style={{ marginLeft: spacing[2.5], gap: spacing[1] }}>
                    <Text>flag: {outcome.countryDetails?.flag}</Text>
                    <Text>name: {outcome.countryDetails?.name}</Text>
                    <Text>code: {outcome.countryDetails?.code}</Text>
                    <Text>id: {outcome.countryDetails?.id}</Text>
                    <Text>mask: {outcome.countryDetails?.mask}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          <PortalHost
            // @ts-ignore
            style={StyleSheet.absoluteFillObject}
            name="ipad-keyboard"
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </PortalProvider>
  );
}

const styles = StyleSheet.create({
  input: {
    margin: spacing[3],
    padding: spacing[2.5],
  },
});
