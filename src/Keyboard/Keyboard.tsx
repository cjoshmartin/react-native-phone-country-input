import React, { memo, MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { GAP, KEYBOARD_LAYOUT, KEYPAD_KEY } from '../consts/KEYBOARD_LAYOUT';
import KeypadRow from './KeypadRow';
import { Pressable, View, StyleSheet, Dimensions, Modal, Text } from 'react-native';
import { Portal } from 'react-native-teleport';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import KeyboardToolbar from './KeyboardToolbar';
import { spacing, radius, padding } from '../Styling/Sizing';
import { colors } from '../Styling/Colors';

export interface PasteErrorModalProps extends React.ComponentProps<typeof Modal> {
  isPasteErrorVisible: boolean;
  dismissPasteError: () => void;
}

export interface CopySuccessModalProps extends React.ComponentProps<typeof Modal> {
  isCopySuccessVisible: boolean;
  dismissCopySuccess: () => void;
}

export interface KeyboardProps {
  value?: string;
  onKeyPress: (_value: KEYPAD_KEY) => void;
  onCopy: () => void;
  onPaste: () => Promise<boolean>;
  isOpen: boolean;
  onClose: () => void;
  underlinePasteErrorModal?: React.ComponentType<PasteErrorModalProps> | null;
  underlineCopySuccessModal?: React.ComponentType<CopySuccessModalProps> | null;
}

function Keyboard(props: KeyboardProps) {
  const PasteErrorModal = useMemo(
    () => props.underlinePasteErrorModal ?? null,
    [props.underlinePasteErrorModal]
  );
  const CopySuccessModal = useMemo(
    () => props.underlineCopySuccessModal ?? null,
    [props.underlineCopySuccessModal]
  );

  const [isPasteErrorVisible, setIsPasteErrorVisible] = useState(false);
  const dismissPasteError = useCallback(() => setIsPasteErrorVisible(false), []);

  const [isCopySuccessVisible, setIsCopySuccessVisible] = useState(false);
  const dismissCopySuccess = useCallback(() => setIsCopySuccessVisible(false), []);

  const handlePaste = useCallback(() => {
    props.onPaste().then((success) => {
      if (!success) setIsPasteErrorVisible(true);
    });
  }, [props.onPaste]);

  const handleCopy = useCallback(() => {
    props.onCopy();
    setIsCopySuccessVisible(true);
  }, [props.onCopy]);

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
            onCopy={handleCopy}
            onPaste={handlePaste}
          />
          {layout}
        </View>
      </Animated.View>
      {PasteErrorModal ? (
        <PasteErrorModal
          visible={isPasteErrorVisible}
          onRequestClose={dismissPasteError}
          isPasteErrorVisible={isPasteErrorVisible}
          dismissPasteError={dismissPasteError}
          transparent
          animationType="fade"
        />
      ) : (
        <Modal
          visible={isPasteErrorVisible}
          onRequestClose={dismissPasteError}
          transparent
          animationType="fade">
          <Pressable style={pasteErrorStyles.overlay} onPress={dismissPasteError}>
            <View style={pasteErrorStyles.card}>
              <Text style={pasteErrorStyles.title}>Cannot Paste</Text>
              <Text style={pasteErrorStyles.message}>
                Clipboard does not contain a valid phone number.
              </Text>
              <Pressable style={pasteErrorStyles.button} onPress={dismissPasteError}>
                <Text style={pasteErrorStyles.buttonText}>OK</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}
      {CopySuccessModal ? (
        <CopySuccessModal
          visible={isCopySuccessVisible}
          onRequestClose={dismissCopySuccess}
          isCopySuccessVisible={isCopySuccessVisible}
          dismissCopySuccess={dismissCopySuccess}
          transparent
          animationType="fade"
        />
      ) : (
        <Modal
          visible={isCopySuccessVisible}
          onRequestClose={dismissCopySuccess}
          transparent
          animationType="fade">
          <Pressable style={copySuccessStyles.overlay} onPress={dismissCopySuccess}>
            <View style={copySuccessStyles.card}>
              <Text style={copySuccessStyles.title}>Copied</Text>
              <Text style={copySuccessStyles.message}>Phone number copied to clipboard.</Text>
              <Pressable style={copySuccessStyles.button} onPress={dismissCopySuccess}>
                <Text style={copySuccessStyles.buttonText}>OK</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}
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

const pasteErrorStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: padding[5],
    width: '100%',
    maxWidth: 320,
    gap: spacing[3],
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  message: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
  button: {
    marginTop: spacing[2],
    backgroundColor: colors.gray[100],
    borderRadius: radius.lg,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[8],
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray[800],
  },
});

const copySuccessStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: padding[5],
    width: '100%',
    maxWidth: 320,
    gap: spacing[3],
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.green[700],
  },
  message: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
  button: {
    marginTop: spacing[2],
    backgroundColor: colors.green[50],
    borderRadius: radius.lg,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[8],
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.green[700],
  },
});
