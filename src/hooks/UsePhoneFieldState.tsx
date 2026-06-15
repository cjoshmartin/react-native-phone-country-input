import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CountryCode } from '../consts/regions';
import { CountryId } from '../enum/CountryIds';
import { generateCountryCodeList } from '../utils/generateCountryCodeList';
import { getDefaultRegion } from '../utils/getDefaultRegion';
import { PhoneFieldOutcome } from '../PhoneNumberField';
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
import { fromUnmaskedToMaskedPosition } from '../utils/fromUnmaskedToMaskedPosition';

export interface usePhoneFieldStateParams {
  allowedCountryCodes?: CountryId[] | null;
  disallowedCountryCodes?: CountryId[] | null;
}

export interface usePhoneFieldStateReturn {
  country?: CountryCode;
  filteredCountryCodes?: CountryCode[];
  phoneNumber?: string;
  outcome?: PhoneFieldOutcome;
  onChangeText: (phoneNumber: string) => void;
  onChangeFlag: (newCountry: CountryCode) => void;
  onKeyPress: (_key: KEYPAD_KEY) => void;
  onCopy: () => void;
  onPaste: () => Promise<boolean>;
  isKeyboardOpen: boolean;
  openKeyboard: () => void;
  closeKeyboard: () => void;
  isCountrySelectorOpen: boolean;
  openCountrySelector: () => void;
  closeCountrySelector: () => void;
  onTextSelection: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
  onClearText: () => void;
  cursorPosition: { start: number; end: number };
}

export function usePhoneFieldState({
  allowedCountryCodes,
  disallowedCountryCodes,
}: usePhoneFieldStateParams): usePhoneFieldStateReturn {
  const [country, setCountry] = useState<CountryCode | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const phoneNumberRef = useRef(phoneNumber);
  const [outcome, setOutcome] = useState<PhoneFieldOutcome | undefined>(undefined);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number }>({
    start: 1,
    end: 1,
  });
  const selectionRef = useRef<SELECTION_TYPE>({
    start: 1,
    end: 1,
    hasBeenSelected: false,
    hasBeenConsumed: true,
  });

  const openKeyboard = useCallback(() => setIsKeyboardOpen(true), []);
  const closeKeyboard = useCallback(() => setIsKeyboardOpen(false), []);

  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  const openCountrySelector = useCallback(() => setIsCountrySelectorOpen(true), []);
  const closeCountrySelector = useCallback(() => setIsCountrySelectorOpen(false), []);

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
        const expectedDigitCount =
          matchedCountry.code.replace(/\D/g, '').length +
          matchedCountry.mask.replace(/[^#]/g, '').length;
        setOutcome({
          countryDetails: matchedCountry || null,
          phoneNumber: ouputWthOutMask,
          isValid: ouputWthOutMask.length === expectedDigitCount,
          correctLength,
        });
      } else {
        setPhoneNumber(cleanedValue);
        phoneNumberRef.current = cleanedValue;
        const correctLength = ((matchedCountry?.code ?? '') + (matchedCountry?.mask ?? '')).length;
        setOutcome({
          countryDetails: matchedCountry || null,
          phoneNumber: cleanedValue,
          isValid: false,
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
  }, []);

  const onKeyPress = useCallback(
    (_key: KEYPAD_KEY) => {
      const current = phoneNumberRef.current;
      const existing_number = '+' + (current ?? '').replace(/\D/g, '');
      const { start, end } = selectionRef.current;

      if (_key.main === BACK_BUTTON) {
        const isRange = start !== end;
        if (start > 0 || isRange) {
          const outcome = characterDeletion(existing_number, selectionRef.current);
          onChangeText(outcome);
          if (start > 0) {
            selectionRef.current = { start: start - 1, end: start - 1, hasBeenSelected: true };
          }
        }
      } else if (_key.main === CLEAR_BUTTON) {
        onChangeText('');
        selectionRef.current = { start: 0, end: 0, hasBeenSelected: false };
      } else if (_key.main === GLOBE_BUTTON) {
        openCountrySelector();
      } else {
        const outcome = characterInsert(existing_number, _key.main, selectionRef.current);
        onChangeText(outcome);
        if (phoneNumberRef.current && selectionRef.current.start < phoneNumberRef.current.length) {
          selectionRef.current = { start: start + 1, end: start + 1, hasBeenSelected: true };
        }
      }

      const newMasked = '+' + (phoneNumberRef.current ?? '');
      const maskedStart = fromUnmaskedToMaskedPosition(newMasked, selectionRef.current.start);
      setCursorPosition({ start: maskedStart, end: maskedStart });
    },
    [onChangeText, openCountrySelector]
  );

  const onCopy = useCallback(async () => {
    console.log('copying phone number: ', outcome?.phoneNumber);
    Clipboard.setString(outcome?.phoneNumber ?? '');
  }, [outcome?.phoneNumber]);

  const onPaste = useCallback(async (): Promise<boolean> => {
    const clipBoardContents = (await Clipboard.getString()).trim();
    if (!/^\+?\d+$/.test(clipBoardContents)) {
      return false;
    }
    onChangeText(clipBoardContents);
    const newMasked = '+' + (phoneNumberRef.current ?? '');
    const unmaskedEnd = (phoneNumberRef.current ?? '').replace(/\D/g, '').length;
    selectionRef.current = { start: unmaskedEnd, end: unmaskedEnd, hasBeenSelected: true, hasBeenConsumed: false };
    const maskedEnd = fromUnmaskedToMaskedPosition(newMasked, unmaskedEnd);
    setCursorPosition({ start: maskedEnd, end: maskedEnd });
    return true;
  }, [onChangeText]);

  const onTextSelection = useCallback(
    (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      const next = e.nativeEvent.selection;
      // Include '+' so maskedPoint indexes align with the displayed string
      const maskedValue = '+' + (phoneNumberRef.current ?? '');
      const start = fromMaskedNumberToUnmaskedSelection(maskedValue, next.start);
      const end = fromMaskedNumberToUnmaskedSelection(maskedValue, next.end);
      selectionRef.current = { start, end, hasBeenSelected: true, hasBeenConsumed: false };
      setCursorPosition({ start: next.start, end: next.end });
    },
    []
  );

  useEffect(() => {
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
    isCountrySelectorOpen,
    openCountrySelector,
    closeCountrySelector,
    onTextSelection,
    onClearText,
    cursorPosition,
  };
}
