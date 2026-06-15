import React, { useState } from 'react';
import { Pressable, PressableProps, StyleSheet, View, Text } from 'react-native';
import { colors } from '../Styling/Colors';
// import { Box } from '@/components/ui/box';
// import { GetColor } from '@/utils/get-color';

interface KeypadButtonContainerProps extends PressableProps {
  children: React.ReactNode;
  onPress?: PressableProps['onPress'];
  bgColor?: string | null;
  bgPressedColor?: string | null;
}

export default function KeypadButtonContainer({
  children,
  bgColor = colors.white,
  bgPressedColor = colors.gray[300],
  ...props
}: KeypadButtonContainerProps) {
  const [isCurrentlyPressed, setIsCurrentlyPressed] = useState(false);

  return (
    <Pressable
      style={styles.pressable}
      unstable_pressDelay={0}
      onPressIn={() => {
        setIsCurrentlyPressed(true);
      }}
      onPressOut={() => {
        setIsCurrentlyPressed(false);
      }}
      {...props}>
      <View
        style={[
          styles.container,
          { backgroundColor: (isCurrentlyPressed ? bgPressedColor : bgColor) ?? undefined },
        ]}>
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
});
