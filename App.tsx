import PhoneNumberField, { onPressReturn } from 'components/PhoneNumberField/PhoneNumberField';
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput } from 'react-native';

import 'react-native-gesture-handler';

export default function App() {
  const [value, setValue] = React.useState('');
  const [outcome, setOutcome] = React.useState<onPressReturn | null>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const onPress = (outcome: onPressReturn) => {
    setValue(outcome.phoneNumber);
    setOutcome(outcome);
  };

  return (
    <SafeAreaView>
      <PhoneNumberField
        underlineInput={TextInput}
        onInputChange={onPress}
        value={value}
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <View
        style={{
          margin: 20,
          gap: 10,
        }}>
        <Text>{isFocused ? 'Input is focused' : 'Input is not focused'}</Text>
        <Text>Outcome:{!outcome && <Text>No outcome yet</Text>}</Text>
        {outcome && (
          <View
            style={{
              marginLeft: 10,
              gap: 5,
            }}>
            <Text>phoneNumber: {outcome.phoneNumber}</Text>
            <Text>correctLength: {outcome.correctLength}</Text>
            <Text style={{ color: outcome.isValid ? 'green' : 'red' }}>
              isValid: {outcome.isValid.toString()}
            </Text>
            <Text>Country Details: {!outcome.countryDetails && <Text>None Found</Text>}</Text>
            {outcome.countryDetails && (
              <View style={{ marginLeft: 10, gap: 5 }}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
