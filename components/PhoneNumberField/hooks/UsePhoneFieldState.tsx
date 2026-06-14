import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CountryCode } from '../consts/regions';
import { CountryId } from '../enum/CountryIds';
import { generateCountryCodeList } from '../utils/generateCountryCodeList';
import { getDefaultRegion } from '../utils/getDefaultRegion';
import { onPressReturn } from '../PhoneNumberField';
import { maskToPhoneNumber } from '../utils/maskToPhoneNumber';
import { matchCountryCode } from '../utils/matchCountryCode';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  BACK_BUTTON,
  CLEAR_BUTTON,
  GLOBE_BUTTON,
  KEYPAD_KEY,
  SELECTION_TYPE,
} from '../consts/KEYBOARD_LAYOUT';
import { NativeSyntheticEvent, TextInputSelectionChangeEventData } from 'react-native';
import { characterDeletion } from '../utils/characterDeletion';
import { characterInsert } from '../utils/characterInsert';
import { fromMaskedNumberToUnmaskedSelection } from '../utils/fromMaskedNumberToUnmaskedSelection';

interface usePhoneFieldStateParams {
  allowedCountryCodes?: CountryId[] | null;
  disallowedCountryCodes?: CountryId[] | null;
}

interface usePhoneFieldStateReturn {
  country?: CountryCode;
  filteredCountryCodes?: CountryCode[];
  phoneNumber?: string;
  outcome?: onPressReturn;
  onChangeText: (phoneNumber: string) => void;
  onChangeFlag: (newCountry: CountryCode) => void;
  onKeyPress: (_key: KEYPAD_KEY) => void;
  onCopy: () => void;
  onPaste: () => void;
  isKeyboardOpen: boolean;
  openKeyboard: () => void;
  closeKeyboard: () => void;
  onTextSelection: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
  cursorPosition: { start: number; end: number } | undefined;
  onClearText: () => void;
}

export function usePhoneFieldState({
  allowedCountryCodes,
  disallowedCountryCodes,
}: usePhoneFieldStateParams): usePhoneFieldStateReturn {
  const [country, setCountry] = useState<CountryCode | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const phoneNumberRef = useRef(phoneNumber);
  const [outcome, setOutcome] = useState<onPressReturn | undefined>(undefined);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const selectionRef = useRef<SELECTION_TYPE>({
    start: 0,
    end: 0,
    hasBeenSelected: false,
    hasBeenConsumed: true,
  });
  const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number } | undefined>(
    undefined
  );
  // Holds the desired post-edit cursor position (in D = '+' + digits space) set by onKeyPress,
  // consumed by onChangeText once the new masked string is available.
  const intendedCursorPosRef = useRef<number | null>(null);

  const openKeyboard = useCallback(() => setIsKeyboardOpen(true), []);
  const closeKeyboard = useCallback(() => setIsKeyboardOpen(false), []);

  const filteredCountryCodes = useMemo(() => {
    return generateCountryCodeList(
      allowedCountryCodes ?? undefined,
      disallowedCountryCodes ?? undefined
    );
  }, [allowedCountryCodes, disallowedCountryCodes]);

  const onChangeText = useCallback(
    (_value: string) => {
      const cleanedValue = _value.replace('+', ''); // remove non-digit characters

      // parse the country code from the phone number and set the country state
      let matchedCountry = matchCountryCode(filteredCountryCodes, _value);
      console.log('matchedCountry', matchedCountry);
      setCountry(matchedCountry || undefined);

      if (!!matchedCountry && cleanedValue.length >= 2) {
        // apply masking to the phone number based on the matched country code
        const output = maskToPhoneNumber(
          cleanedValue,
          matchedCountry?.code.replace('+', ''),
          matchedCountry?.mask
        );
        setPhoneNumber(output);
        phoneNumberRef.current = output;
        const ouputWthOutMask = output.replace(/\D/g, '');
        console.debug(output, ouputWthOutMask);

        const correctLength = (matchedCountry.code + matchedCountry.mask).length;
        setOutcome({
          countryDetails: matchedCountry || null,
          phoneNumber: ouputWthOutMask,
          isValid: !!matchedCountry && cleanedValue.length + 1 === correctLength,
          correctLength,
        });
      } else {
        setPhoneNumber(cleanedValue);
        phoneNumberRef.current = cleanedValue;
        const correctLength = ((matchedCountry?.code ?? '') + (matchedCountry?.mask ?? '')).length;
        setOutcome({
          countryDetails: matchedCountry || null,
          phoneNumber: cleanedValue,
          isValid: !!matchedCountry && cleanedValue.length + 1 === correctLength,
          correctLength,
        });
      }
    },
    [filteredCountryCodes]
  );

  const onClearText = useCallback(() => {
    console.log('Refreshing....');
    if (!outcome) {
      console.error('Outcome is not defined, so cannot clear text');
      return;
    }
    const current_outcome = outcome;
    setPhoneNumber(current_outcome?.countryDetails?.code);
    phoneNumberRef.current = current_outcome?.countryDetails?.code;

    setOutcome({ ...current_outcome, phoneNumber: current_outcome?.countryDetails?.code ?? '' });
  }, [outcome]);

  const onChangeFlag = useCallback((newCountry: CountryCode) => {
    const _phoneNumber = newCountry.code.replace('+', '');

    setOutcome({
      countryDetails: newCountry,
      phoneNumber: _phoneNumber,
      isValid: false,
      correctLength: (newCountry.code + newCountry.mask).length,
    });
    setPhoneNumber(_phoneNumber);
    phoneNumberRef.current = _phoneNumber;
    setCountry(newCountry);
    // come back and hook up the buttons in list to this new function
    // also think about what state variables we want to use to manage this application
    // I want to add functionality that brings the most common phone number to the top
  }, []);

  const onKeyPress = useCallback(
    (_key: KEYPAD_KEY) => {
      const current = phoneNumberRef.current;
      console.log('current Phone-number: ', current);
      // Strip mask characters so digit-based positions from selectionRef align correctly
      const existing_number = '+' + (current ?? '').replace(/\D/g, '');
      console.log('selection: ', selectionRef.current, 'Number Length: ', existing_number.length);

      if (_key.main === BACK_BUTTON) {
        const { start, end } = selectionRef.current;

        // intendedCursorPosRef.current = start !== end ? start : Math.max(1, start - 1);

        const outcome = characterDeletion(existing_number, selectionRef.current);
        onChangeText(outcome);
        selectionRef.current = { start: start - 1, end: start - 1, hasBeenSelected: true };
        // if (start === end) {
        //   setCursorPosition({ start: start - 1, end: start - 1 });
        // }
      } else if (_key.main === CLEAR_BUTTON) {
        onChangeText('');
        selectionRef.current = { start: 0, end: 0, hasBeenSelected: false };
      } else if (_key.main !== GLOBE_BUTTON) {
        const { start, end } = selectionRef.current;
        const outcome = characterInsert(existing_number, _key.main, selectionRef.current);
        onChangeText(outcome);
        selectionRef.current = { start: start + 1, end: start + 1, hasBeenSelected: true };
        // if (start === end) {
        //   setCursorPosition({ start: start + 1, end: start + 1 });
        // }
      }
    },
    [onChangeText]
  );
  const onCopy = useCallback(async () => {
    console.log('copying phone number: ', outcome?.phoneNumber);
    Clipboard.setString(outcome?.phoneNumber ?? '');
  }, [outcome?.phoneNumber]);

  const onPaste = useCallback(async () => {
    const clipBoardContents = await Clipboard.getString();
    onChangeText(clipBoardContents);
  }, [onChangeText]);

  const onTextSelection = useCallback(
    (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      const prev = selectionRef.current;
      const next = e.nativeEvent.selection;
      console.log('Selection (masked): ', next);

      // Convert a position in the masked display string to its equivalent
      // digit-only position so characterDeletion/characterInsert work correctly
      // regardless of mask characters like '(', ')', '-', ' '.
      const maskedValue = '' + (phoneNumberRef.current ?? '');
      console.log('maskedValue: ', maskedValue);
      const start = fromMaskedNumberToUnmaskedSelection(maskedValue, next.start);
      const end = fromMaskedNumberToUnmaskedSelection(maskedValue, next.end);
      console.log('Selection (unmasked): ', { start, end });

      selectionRef.current = { start, end, hasBeenSelected: true, hasBeenConsumed: false };
      // Keep the controlled selection prop in sync so the TextInput
      // cursor stays where the user tapped.
      setCursorPosition(next);
    },
    []
  );

  useEffect(() => {
    // Should only run on first render
    // console.debug('usePhoneFieldState useEffect HAS RAN!', filteredCountryCodes);
    const defaultRegion = getDefaultRegion(filteredCountryCodes);
    console.log(defaultRegion);
    setCountry(defaultRegion);
    onChangeText(defaultRegion?.code ?? ''); // set the default country code in the input field on load

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    country,
    filteredCountryCodes,
    phoneNumber,
    outcome,
    onChangeText,
    onChangeFlag,
    onKeyPress,
    onCopy,
    onPaste,
    isKeyboardOpen,
    openKeyboard,
    closeKeyboard,
    onTextSelection,
    cursorPosition,
    onClearText,
  };
}
