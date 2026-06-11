import { spacing } from '../Styling/Sizing';
export interface KEYPAD_KEY {
  main: string;
  subtext?: string;
}

export type KEYPAD_ROW = KEYPAD_KEY[];
export type KEYPAD_COLLECTION = KEYPAD_ROW[];

export const BACK_BUTTON = '<-';
export const GLOBE_BUTTON = '__';
export const GAP = spacing[1];

export const KEYBOARD_LAYOUT: KEYPAD_COLLECTION = [
  [{ main: '1' }, { main: '2', subtext: 'ABC' }, { main: '3', subtext: 'DEF' }],
  [
    { main: '4', subtext: 'GHI' },
    { main: '5', subtext: 'JKL' },
    { main: '6', subtext: 'MNO' },
  ],
  [
    { main: '7', subtext: 'PQRS' },
    { main: '8', subtext: 'TUV' },
    { main: '9', subtext: 'WXYZ' },
  ],
  [{ main: GLOBE_BUTTON }, { main: '0' }, { main: BACK_BUTTON }],
];
