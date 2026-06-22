import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GAP } from '../consts/KEYBOARD_LAYOUT';
import { spacing } from '../Styling/Sizing';
import { colors } from '../Styling/Colors';

export interface KeyboardToolbarProps {
  value?: string;
  onClose: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
}

export default function KeyboardToolbar({ onClose, value, onCopy, onPaste }: KeyboardToolbarProps) {
  const isCopyDisabled = useMemo(() => {
    return (value ?? '').length < 3;
  }, [value]);

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <Pressable disabled={isCopyDisabled} onPress={onCopy}>
          <Feather name="copy" size={20} color={!isCopyDisabled ? '#000' : colors.gray[600]} />
        </Pressable>
        <Pressable onPress={onPaste}>
          <Feather name="clipboard" size={20} color="#000" />
        </Pressable>
      </View>
      <Pressable
        onPress={onClose}
        style={{
          padding: 16,
        }}>
        <Text style={styles.doneText}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
  },
  leftGroup: {
    flexDirection: 'row',
    gap: GAP,
  },
  doneText: {
    color: '#000',
    fontSize: 16,
  },
});
