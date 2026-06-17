import { useCallback, useEffect, useMemo, useState } from 'react';
import { CountryCode } from '../consts/regions';
import { Modal, Pressable, Text } from 'react-native';
import { CountrySelectorModal } from './CountrySelectorModal';
import { Feather } from '@expo/vector-icons';

// button for opening the country selector modal
interface CountrySelectorButtonProps extends React.ComponentProps<typeof Pressable> {
  value: CountryCode | null;
  underlineButton?: React.ComponentType<React.ComponentProps<typeof Pressable>> | null;
  isOpen?: boolean;
}

//

function CountrySelectorButton(props: CountrySelectorButtonProps) {
  const Button = useMemo(() => {
    if (props.underlineButton) {
      // console.debug('Using custom button for CountrySelectorButton');
      return props.underlineButton;
    }
    // console.debug('Using default Pressable for CountrySelectorButton');
    return Pressable;
  }, [props.underlineButton]);
  return (
    // This could be a simple button that, when pressed, opens the country selector modal
    <Button {...props}>
      <Text>{props.value ? props.value.flag : '🏴‍☠️'}</Text>
      <Feather name={`chevron-${props.isOpen ? 'up' : 'down'}`} size={14} color="gray" />
    </Button>
  );
}
export interface CountrySelectorProps extends React.ComponentProps<typeof CountrySelectorButton> {
  filtedredCountryCodes?: CountryCode[] | null;
  onSelectCountry?: (country: CountryCode) => void;
  value: CountryCode | null;
  underlineButton?: React.ComponentType<React.ComponentProps<typeof Pressable>> | null;
  underlineModal?: React.ComponentType<React.ComponentProps<typeof Modal>> | null;
  onOpenChange?: (open: boolean) => void;
}
export function CountrySelector(props: CountrySelectorProps) {
  const [internalValue, setInternalValue] = useState(props.value);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const { filtedredCountryCodes, onSelectCountry, onOpenChange } = props;

  const isControlled = props.isOpen !== undefined;
  const effectiveIsOpen = isControlled ? (props.isOpen ?? false) : internalIsOpen;

  const toggle = useCallback(() => {
    const next = !effectiveIsOpen;
    if (!isControlled) setInternalIsOpen(next);
    onOpenChange?.(next);
  }, [effectiveIsOpen, isControlled, onOpenChange]);

  useEffect(() => {
    setInternalValue(props.value);
  }, [props.value]);

  return (
    <>
      <CountrySelectorButton
        {...props}
        underlineButton={props.underlineButton}
        value={internalValue}
        isOpen={effectiveIsOpen}
        onPress={toggle}
      />
      <CountrySelectorModal
        value={internalValue}
        onSelectCountry={onSelectCountry ?? (() => {})}
        UserCountryCodes={filtedredCountryCodes}
        isOpen={effectiveIsOpen}
        toggleModalVisablity={toggle}
      />
    </>
  );
}
