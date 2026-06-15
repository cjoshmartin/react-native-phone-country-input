import { View } from 'react-native';
import { GAP, KEYPAD_KEY, KEYPAD_ROW } from '../consts/KEYBOARD_LAYOUT';
import { KeypadButton } from './KeypadButton';
import { memo, useMemo } from 'react';

export interface KeypadRowProps {
  row: KEYPAD_ROW;
  onPress: (_value: KEYPAD_KEY) => void;
}

function KeypadRow({ row, onPress }: KeypadRowProps) {
  const keyboardRow = useMemo(() => {
    return row.map((_key, i) => {
      return <KeypadButton currentKey={_key} key={_key.main + (i + '')} onPress={onPress} />;
    });
  }, [onPress, row]);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        gap: GAP,
      }}>
      {keyboardRow}
    </View>
  );
}

export default memo(KeypadRow);
