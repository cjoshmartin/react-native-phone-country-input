import { memo, useCallback, useMemo } from 'react';
import { BACK_BUTTON, GLOBE_BUTTON, KEYPAD_KEY } from '../consts/KEYBOARD_LAYOUT';
import KeypadButtonContainer from './KeypadButtonContainer';
import { Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface KeypadButtonProps {
  currentKey: KEYPAD_KEY;
  onPress: (_key: KEYPAD_KEY) => void;
}

function KeypadButton({ currentKey, onPress }: KeypadButtonProps) {
  const handlePress = useCallback(() => onPress(currentKey), [onPress, currentKey]);

  const isBackButton = useMemo(() => currentKey.main === BACK_BUTTON, [currentKey.main]);
  const isGlobeButton = useMemo(() => currentKey.main === GLOBE_BUTTON, [currentKey.main]);

  if (isGlobeButton) {
    return (
      <KeypadButtonContainer
        bgColor={null}
        bgPressedColor={'background-color: rgba(0, 0, 0, 0.1);'}
        onPress={() => onCountryPickerOpenChange(true)}
        key="country-button">
        <Feather name="globe" className="text-4xl text-typography-black" />
      </KeypadButtonContainer>
    );
  }

  if (isBackButton) {
    return (
      <KeypadButtonContainer
        bgColor={null}
        bgPressedColor={'background-color: rgba(0, 0, 0, 0.1);'}
        onPress={handlePress}
        onLongPress={() => handleSetValue('')}
        key="back-button">
        <Feather name="delete" className="text-4xl text-typography-black" />
        <Text bold className="text-typography-black">
          clear
        </Text>
      </KeypadButtonContainer>
    );
  }

  return (
    <KeypadButtonContainer onPress={handlePress}>
      <Text style={{}}>{currentKey.main}</Text>
      {(currentKey?.subtext ?? '').length > 0 && <Text>{currentKey.subtext}</Text>}
    </KeypadButtonContainer>
  );
}

export { KeypadButton };
export default memo(KeypadButton);
