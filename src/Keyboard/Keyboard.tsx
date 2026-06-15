import React, { memo, MutableRefObject, useEffect, useMemo } from 'react';
import { GAP, KEYBOARD_LAYOUT, KEYPAD_KEY } from '../consts/KEYBOARD_LAYOUT';
import KeypadRow from './KeypadRow';
import { Pressable, View, StyleSheet, Dimensions } from 'react-native';
import { Portal } from 'react-native-teleport';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import KeyboardToolbar from './KeyboardToolbar';
import { spacing } from '../Styling/Sizing';

export interface KeyboardProps {
  value?: string;
  onKeyPress: (_value: KEYPAD_KEY) => void;
  onCopy: () => void;
  onPaste: () => void;
  isOpen: boolean;
  onClose: () => void;
}

function Keyboard(props: KeyboardProps) {
  const isOpenShared = useSharedValue(props.isOpen);

  useEffect(() => {
    isOpenShared.value = props.isOpen;
  }, [isOpenShared, props.isOpen]);

  const height = useSharedValue(0);
  const progress = useDerivedValue(() => withTiming(isOpenShared.value ? 0 : 1, { duration: 250 }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isOpenShared.value ? 1 : withDelay(250, withTiming(-1, { duration: 0 })),
  }));

  const layout = useMemo(() => {
    console.log('-- ⚠️  Rerender Keyboard--');
    return KEYBOARD_LAYOUT.map((row, i) => {
      return <KeypadRow row={row} key={'row-' + i} onPress={props.onKeyPress} />;
    });
  }, [props.onKeyPress]);

  const { height: screenHeight } = Dimensions.get('window');

  return (
    <Portal hostName="ipad-keyboard">
      {props.isOpen && (
        <Pressable style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]} onPress={props.onClose} />
      )}
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[sheetStyles.sheet, { height: screenHeight / 2.5 }, sheetStyle, backdropStyle]}>
        <View
          style={{
            flex: 1,
            gap: GAP,
            paddingBottom: spacing[14],
            paddingHorizontal: spacing[4],
          }}>
          <KeyboardToolbar
            onClose={props.onClose}
            value={props.value}
            onCopy={props.onCopy}
            onPaste={props.onPaste}
          />
          {layout}
        </View>
      </Animated.View>
    </Portal>
  );
}

export default memo(Keyboard);

const sheetStyles = StyleSheet.create({
  sheet: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: '#D1D5DB',
    zIndex: 3,
    gap: 12,
  },
});
