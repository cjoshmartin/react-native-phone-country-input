# react-native-phone-country-input

![shows changing the phone number country code](./readme_assets/fast_changing_country_code.gif)

An international phone number input for React Native with country selection, per-country number masking, and a custom keyboard that avoids the native soft keyboard. Ideal for quick changing country codes, entering phone numbers or using bigger devices like tablets that do not have native support for phone number keyboards.

[![npm version](https://img.shields.io/npm/v/react-native-phone-country-input.svg)](https://www.npmjs.com/package/react-native-phone-country-input)
[![npm downloads](https://img.shields.io/npm/dw/react-native-phone-country-input.svg)](https://www.npmjs.com/package/react-native-phone-country-input)
[![GitHub stars](https://img.shields.io/github/stars/cjoshmartin/react-native-phone-country-input.svg?style=social)](https://github.com/cjoshmartin/react-native-phone-country-input)
[![MIT License](https://img.shields.io/npm/l/react-native-phone-country-input.svg)](./LICENSE)

## Peer dependencies

Install these if they are not already in your project:

```sh
npm install \
  react-native-reanimated \
  react-native-gesture-handler \
  react-native-teleport \
  expo-localization \
  @react-native-async-storage/async-storage \
  @react-native-clipboard/clipboard
```

Follow each library's setup guide for any native configuration required.

## Installation

```sh
npm install react-native-phone-country-input
```

## Features

- 270+ countries with flags, calling codes, and phone masks
- Custom keyboard — no system keyboard flicker or layout shift. Great for iPad or Android tablets.
- Automatic country detection from the device locale on mount
- Per-country number formatting (parentheses, dashes, spaces)
- Country selector modal with search and recently-used countries
- Copy / paste support with built-in feedback modals (customizable)
- Cursor position tracking inside masked input
- Filter countries via allow-list (whitelist) or deny-list (blacklist)
- Fully customizable: swap in your own `TextInput`, `Pressable`, `Modal`, or feedback modals
- Full TypeScript support

Tested on: 
- Xiaomi Redmi Pad 2 9.7 (Android Tablet)
- Galaxy A06 5G (Android Phone)
- iPhone 16 Plus
- iPad Pro 12.9"



### Country code modal (with search and history)
![Using the Country code modal](./readme_assets/change_phone_number_fields.gif)

### On Paste
![What happens on paste](./readme_assets/onPaste.gif)

### Custom Keyboard
![Showing Keyboard](./readme_assets/keyboard_showcase.gif)

#### Keyboard on Android Tablet
![](./readme_assets/android-tablet-l.gif)
![](./readme_assets/android-tablet-p.gif)

#### Keyboard on iPad 
![](./readme_assets/ipad-l.gif)
![](./readme_assets/ipad-p.gif)

## Setup

Wrap your app (or the screen that uses this component) in `PortalProvider` and render a `PortalHost`. The custom keyboard and feedback modals render through a portal to escape z-index stacking.

```tsx
import { PortalProvider, PortalHost } from 'react-native-teleport';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <PortalProvider>
      {/* your app content */}
      <PortalHost style={StyleSheet.absoluteFillObject} name="ipad-keyboard" />
    </PortalProvider>
  );
}
```

## Quick start
`PhoneCountryInput` is the ready-to-use component. Drop it in and handle the result via `onOutcomeChange`.

> **See it in action:** [`App.tsx`](./App.tsx) in this repo is a working demo that uses `PhoneCountryInput` with custom-styled inputs, a country deny-list, and outcome display — a good starting point to copy from.

```tsx
import { PhoneCountryInput, PhoneFieldOutcome } from 'react-native-phone-country-input';

export default function MyScreen() {
  const handleChange = (outcome?: PhoneFieldOutcome) => {
    if (outcome?.isValid) {
      console.log('Phone:', outcome.phoneNumber); // digits only, no formatting
      console.log('Country:', outcome.countryDetails?.name);
    }
  };

  return <PhoneCountryInput onOutcomeChange={handleChange} />;
}
```

## `PhoneCountryInput` props

Extends all `TextInput` props plus:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onOutcomeChange` | `(outcome?: PhoneFieldOutcome) => void` | Yes | Called whenever the phone number or country changes |
| `allowedCountryCodes` | `CountryId[]` | No | Show only these countries in the selector |
| `disallowedCountryCodes` | `CountryId[]` | No | Hide these countries from the selector |
| `underlineInput` | `React.ComponentType` | No | Replace the default `TextInput` with your own styled component |
| `underlineButton` | `React.ComponentType` | No | Replace the country selector button with your own styled `Pressable` |
| `underlineModal` | `React.ComponentType` | No | Replace the country selector modal entirely |
| `underlinePasteErrorModal` | `React.ComponentType<PasteErrorModalProps>` | No | Replace the built-in "cannot paste" modal |
| `underlineCopySuccessModal` | `React.ComponentType<CopySuccessModalProps>` | No | Replace the built-in "copied" confirmation modal |
| `style` | `ViewStyle` | No | Style applied to the outer row container |

### Custom styling example

```tsx
import { TextInput, Pressable } from 'react-native';
import { PhoneCountryInput } from 'react-native-phone-country-input';

function StyledInput(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      style={[{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }, props.style]}
    />
  );
}

function StyledButton(props: React.ComponentProps<typeof Pressable>) {
  return (
    <Pressable {...props} style={{ padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
      {props.children}
    </Pressable>
  );
}

export default function MyScreen() {
  return (
    <PhoneCountryInput
      underlineInput={StyledInput}
      underlineButton={StyledButton}
      onOutcomeChange={(outcome) => console.log(outcome)}
    />
  );
}
```

### Country filtering example

```tsx
import { PhoneCountryInput, CountryId } from 'react-native-phone-country-input';

const ALLOWED = [CountryId.UNITED_STATES, CountryId.CANADA, CountryId.MEXICO];

<PhoneCountryInput
  allowedCountryCodes={ALLOWED}
  onOutcomeChange={(outcome) => console.log(outcome)}
/>
```

---

## Copy and paste feedback modals

When the user taps **Copy**, the keyboard shows a "Copied" confirmation modal. When the user taps **Paste** and the clipboard does not contain a recognisable phone number, a "Cannot Paste" error modal appears. Both modals have built-in defaults and can be replaced with your own UI.

### Default behaviour

No configuration needed — the defaults work out of the box:


#### Copy success
a modal with the title "Copied" and the message "Phone number copied to clipboard."

![](./readme_assets/copy_modal.png)

#### Paste error 
a modal with the title "Cannot Paste" and the message "Clipboard does not contain a valid phone number."

![Paste error](./readme_assets/cannot_paste.png)



### Replacing the paste-error modal
Pass a component that accepts `PasteErrorModalProps` to `underlinePasteErrorModal`:

```tsx
import { Modal, View, Text, Pressable } from 'react-native';
import { PhoneCountryInput, PasteErrorModalProps } from 'react-native-phone-country-input';

function MyPasteErrorModal({ isPasteErrorVisible, dismissPasteError }: PasteErrorModalProps) {
  return (
    <Modal visible={isPasteErrorVisible} transparent animationType="fade" onRequestClose={dismissPasteError}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }} onPress={dismissPasteError}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: 280 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Invalid number</Text>
          <Text style={{ color: '#666' }}>Paste a phone number with a country code (e.g. +1 555 123 4567).</Text>
          <Pressable onPress={dismissPasteError} style={{ marginTop: 16, alignSelf: 'flex-end' }}>
            <Text style={{ color: '#007AFF', fontWeight: '600' }}>Got it</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

<PhoneCountryInput
  underlinePasteErrorModal={MyPasteErrorModal}
  onOutcomeChange={(outcome) => console.log(outcome)}
/>
```

### Replacing the copy-success modal

Pass a component that accepts `CopySuccessModalProps` to `underlineCopySuccessModal`:

```tsx
import { Modal, View, Text, Pressable } from 'react-native';
import { PhoneCountryInput, CopySuccessModalProps } from 'react-native-phone-country-input';

function MyCopySuccessModal({ isCopySuccessVisible, dismissCopySuccess }: CopySuccessModalProps) {
  return (
    <Modal visible={isCopySuccessVisible} transparent animationType="fade" onRequestClose={dismissCopySuccess}>
      <Pressable style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }} onPress={dismissCopySuccess}>
        <View style={{ backgroundColor: '#22c55e', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>✓ Copied to clipboard</Text>
        </View>
      </Pressable>
    </Modal>
  );
}

<PhoneCountryInput
  underlineCopySuccessModal={MyCopySuccessModal}
  onOutcomeChange={(outcome) => console.log(outcome)}
/>
```

---

## Building your own UI with individual pieces

Import the sub-components and `usePhoneFieldState` to compose a completely custom layout.

```tsx
import {
  usePhoneFieldState,
  PhoneNumberField,
  CountrySelector,
  Keyboard,
  PhoneFieldOutcome,
} from 'react-native-phone-country-input';
import { View } from 'react-native';

export default function CustomPhoneInput({ onResult }: { onResult: (o: PhoneFieldOutcome) => void }) {
  const {
    // State
    outcome,
    phoneNumber,
    filteredCountryCodes,
    cursorPosition,
    isKeyboardOpen,
    isCountrySelectorOpen,
    // Handlers
    onChangeText,
    onChangeFlag,
    onKeyPress,
    onTextSelection,
    onCopy,
    onPaste,
    openKeyboard,
    closeKeyboard,
    openCountrySelector,
    closeCountrySelector,
  } = usePhoneFieldState({
    // optional: allowedCountryCodes, disallowedCountryCodes
  });

  return (
    <>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <CountrySelector
          value={outcome?.countryDetails ?? null}
          filtedredCountryCodes={filteredCountryCodes}
          onSelectCountry={onChangeFlag}
          isOpen={isCountrySelectorOpen}
          onOpenChange={(open) => (open ? openCountrySelector() : closeCountrySelector())}
        />
        <PhoneNumberField
          style={{ flex: 1 }}
          value={phoneNumber}
          onChangeText={onChangeText}
          onOpen={openKeyboard}
          onTextSelection={onTextSelection}
          selection={cursorPosition}
        />
      </View>
      <Keyboard
        value={phoneNumber}
        isOpen={isKeyboardOpen}
        onClose={closeKeyboard}
        onKeyPress={onKeyPress}
        onCopy={onCopy}
        onPaste={onPaste}
      />
    </>
  );
}
```

---

## API reference

### `usePhoneFieldState(params)`

The state management hook that powers `PhoneCountryInput`. Returns all state and handlers needed to wire up the sub-components independently.

**Params**

| Field | Type | Description |
|-------|------|-------------|
| `allowedCountryCodes` | `CountryId[]` | Show only these countries |
| `disallowedCountryCodes` | `CountryId[]` | Hide these countries |

**Returns**

| Field | Type | Description |
|-------|------|-------------|
| `outcome` | `PhoneFieldOutcome \| undefined` | Current validation result |
| `phoneNumber` | `string \| undefined` | Raw unmasked digits (no `+`) |
| `country` | `CountryCode \| undefined` | Currently selected country |
| `filteredCountryCodes` | `CountryCode[]` | Country list after filtering |
| `cursorPosition` | `{ start: number; end: number }` | Cursor position in the masked display string |
| `isKeyboardOpen` | `boolean` | Whether the custom keyboard is visible |
| `isCountrySelectorOpen` | `boolean` | Whether the country selector modal is open |
| `onChangeText` | `(value: string) => void` | Pass to `PhoneNumberField.onChangeText` |
| `onChangeFlag` | `(country: CountryCode) => void` | Pass to `CountrySelector.onSelectCountry` |
| `onKeyPress` | `(key: KEYPAD_KEY) => void` | Pass to `Keyboard.onKeyPress` |
| `onTextSelection` | `(e: NativeSyntheticEvent<...>) => void` | Pass to `PhoneNumberField.onTextSelection` |
| `onCopy` | `() => void` | Copies the current number to the clipboard |
| `onPaste` | `() => Promise<boolean>` | Pastes from clipboard — resolves `true` on success, `false` if the clipboard content is not a recognisable phone number |
| `onClearText` | `() => void` | Resets the field to the country code only |
| `openKeyboard` | `() => void` | — |
| `closeKeyboard` | `() => void` | — |
| `openCountrySelector` | `() => void` | — |
| `closeCountrySelector` | `() => void` | — |

---

### `PhoneNumberField`

The masked text input. Renders a `TextInput` (or your custom component) prefixed with `+`. Always passes `showSoftInputOnFocus={false}` — use `Keyboard` for input.

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Unmasked phone number (digits only, no `+`) |
| `onChangeText` | `(value: string) => void` | Text change handler |
| `onOpen` | `() => void` | Called when the field is pressed — open the keyboard here |
| `onTextSelection` | `(e) => void` | Selection change handler for cursor tracking |
| `selection` | `{ start: number; end: number }` | Controlled cursor position |
| `underlineInput` | `React.ComponentType` | Custom `TextInput` replacement |

---

### `CountrySelector`

The country flag button + selector modal. Supports both controlled (`isOpen`) and uncontrolled usage.

| Prop | Type | Description |
|------|------|-------------|
| `value` | `CountryCode \| null` | Currently selected country |
| `onSelectCountry` | `(country: CountryCode) => void` | Called when the user picks a country |
| `filtedredCountryCodes` | `CountryCode[]` | The country list to display |
| `isOpen` | `boolean` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | Called when open state should change |
| `underlineButton` | `React.ComponentType` | Custom button replacing the flag+chevron |
| `underlineModal` | `React.ComponentType` | Custom modal replacing the built-in sheet |

---

### `Keyboard`

The custom phone keypad. Renders via a `PortalHost` and animates in/out with `react-native-reanimated`. Manages copy/paste feedback modals internally.

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Whether the keyboard is visible |
| `onClose` | `() => void` | Called when the Done button is pressed |
| `onKeyPress` | `(key: KEYPAD_KEY) => void` | Called for every key tap |
| `value` | `string` | Current phone number string (shown in the toolbar) |
| `onCopy` | `() => void` | Called when the Copy button is pressed |
| `onPaste` | `() => Promise<boolean>` | Called when the Paste button is pressed — return `false` to trigger the paste-error modal |
| `underlinePasteErrorModal` | `React.ComponentType<PasteErrorModalProps>` | Replace the built-in "cannot paste" modal |
| `underlineCopySuccessModal` | `React.ComponentType<CopySuccessModalProps>` | Replace the built-in "copied" confirmation modal |

---

## Types

### `PhoneFieldOutcome`

```ts
interface PhoneFieldOutcome {
  phoneNumber: string;        // digits only, no formatting, no leading '+'
  isValid: boolean;           // true when digit count matches the country's mask
  correctLength: number;      // total character length when fully formatted (e.g. "+1 (555) 123-4567".length)
  countryDetails: CountryCode | null;
}
```

### `PasteErrorModalProps`

Received by a custom paste-error modal component.

```ts
interface PasteErrorModalProps extends React.ComponentProps<typeof Modal> {
  isPasteErrorVisible: boolean;   // whether the modal should be visible
  dismissPasteError: () => void;  // call this to close the modal
}
```

### `CopySuccessModalProps`

Received by a custom copy-success modal component.

```ts
interface CopySuccessModalProps extends React.ComponentProps<typeof Modal> {
  isCopySuccessVisible: boolean;   // whether the modal should be visible
  dismissCopySuccess: () => void;  // call this to close the modal
}
```

### `CountryCode`

```ts
interface CountryCode {
  id: CountryId;    // e.g. CountryId.UNITED_STATES
  code: string;     // e.g. '+1'
  flag: string;     // emoji flag, e.g. '🇺🇸'
  name: string;     // e.g. 'United States'
  mask: string;     // formatting template, e.g. ' (###) ###-####'
}
```

### `CountryId`

An enum with an entry for every supported country, e.g. `CountryId.UNITED_STATES`, `CountryId.UNITED_KINGDOM`, `CountryId.CANADA`. Import it to build allow/deny lists.

```ts
import { CountryId } from 'react-native-phone-country-input';
```

---

## Contributing

Pull requests are welcome. To work on the library locally, clone the repo and run the Expo demo app from the project root:

```sh
npm install
npm start        # starts the Expo dev server
npm run build    # compiles the library to lib/
npm test         # runs the unit test suite
```

## Inspired by

- [react-international-phone](https://github.com/ybrusentsov/react-international-phone)
- [react-native-phone-entry](https://github.com/anday013/react-native-phone-entry)
