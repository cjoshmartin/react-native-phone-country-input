# react-native-intl-phone-field

An international phone number input for React Native with country selection, per-country number masking, and a custom keyboard that avoids the native soft keyboard.

## Features

- 270+ countries with flags, calling codes, and phone masks
- Custom keyboard — no system keyboard flicker or layout shift
- Automatic country detection from the device locale on mount
- Per-country number formatting (parentheses, dashes, spaces)
- Country selector modal with search and recently-used countries
- Copy / paste support
- Cursor position tracking inside masked input
- Filter countries via allow-list or deny-list
- Fully customizable: swap in your own `TextInput`, `Pressable`, or `Modal`
- Full TypeScript support

## Installation

```sh
npm install react-native-intl-phone-field
```

### Peer dependencies

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

## Setup

Wrap your app (or the screen that uses this component) in `PortalProvider` and render a `PortalHost`. The custom keyboard renders through a portal to escape z-index stacking.

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

`IntlPhoneField` is the ready-to-use component. Drop it in and handle the result via `onOutcomeChange`.

```tsx
import { IntlPhoneField, PhoneFieldOutcome } from 'react-native-intl-phone-field';

export default function MyScreen() {
  const handleChange = (outcome?: PhoneFieldOutcome) => {
    if (outcome?.isValid) {
      console.log('Phone:', outcome.phoneNumber); // digits only, no formatting
      console.log('Country:', outcome.countryDetails?.name);
    }
  };

  return <IntlPhoneField onOutcomeChange={handleChange} />;
}
```

## `IntlPhoneField` props

Extends all `TextInput` props plus:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onOutcomeChange` | `(outcome?: PhoneFieldOutcome) => void` | Yes | Called whenever the phone number or country changes |
| `allowedCountryCodes` | `CountryId[]` | No | Show only these countries in the selector |
| `disallowedCountryCodes` | `CountryId[]` | No | Hide these countries from the selector |
| `underlineInput` | `React.ComponentType` | No | Replace the default `TextInput` with your own styled component |
| `underlineButton` | `React.ComponentType` | No | Replace the country selector button with your own styled `Pressable` |
| `underlineModal` | `React.ComponentType` | No | Replace the country selector modal entirely |
| `style` | `ViewStyle` | No | Style applied to the outer row container |

### Custom styling example

```tsx
import { TextInput, Pressable } from 'react-native';
import { IntlPhoneField } from 'react-native-intl-phone-field';

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
    <IntlPhoneField
      underlineInput={StyledInput}
      underlineButton={StyledButton}
      onOutcomeChange={(outcome) => console.log(outcome)}
    />
  );
}
```

### Country filtering example

```tsx
import { IntlPhoneField, CountryId } from 'react-native-intl-phone-field';

const ALLOWED = [CountryId.UNITED_STATES, CountryId.CANADA, CountryId.MEXICO];

<IntlPhoneField
  allowedCountryCodes={ALLOWED}
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
} from 'react-native-intl-phone-field';
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

The state management hook that powers `IntlPhoneField`. Returns all state and handlers needed to wire up the sub-components independently.

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
| `onPaste` | `() => void` | Pastes from the clipboard into the field |
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

The custom phone keypad. Renders via a `PortalHost` (using `react-native-teleport`) and animates in/out with `react-native-reanimated`.

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Whether the keyboard is visible |
| `onClose` | `() => void` | Called when the Done button is pressed |
| `onKeyPress` | `(key: KEYPAD_KEY) => void` | Called for every key tap |
| `value` | `string` | Current phone number string (shown in the toolbar) |
| `onCopy` | `() => void` | Called when the Copy button is pressed |
| `onPaste` | `() => void` | Called when the Paste button is pressed |

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
import { CountryId } from 'react-native-intl-phone-field';
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
