import { fromMaskedNumberToUnmaskedSelection } from './fromMaskedNumberToUnmaskedSelection';

describe('fromMaskedNumberToUnmaskedSelection', () => {
  it('should setup the correct starting index when on a para', () => {
    //                   123456
    const maskedValue = '1(307)-410-6456';
    //                     1234
    const unmaskedValue = '13074106456';

    const unmaskedIndex = 6;
    const expectedValue = 4;

    const actual = fromMaskedNumberToUnmaskedSelection(maskedValue, unmaskedIndex);
    expect(actual).toBe(expectedValue);
  });

  it('should setup the correct starting index when after a para and dash', () => {
    //                   1234567
    const maskedValue = '1(307)-410-6456';
    //                     1234
    const unmaskedValue = '13074106456';

    const unmaskedIndex = 7;
    const expectedValue = 4;

    const actual = fromMaskedNumberToUnmaskedSelection(maskedValue, unmaskedIndex);
    expect(actual).toBe(expectedValue);
  });

  it('should setup the correct starting index when after dash', () => {
    //                   12345678901
    const maskedValue = '1(307)-410-6456';
    //                     1234567
    const unmaskedValue = '13074106456';

    const unmaskedIndex = 11;
    const expectedValue = 7;

    const actual = fromMaskedNumberToUnmaskedSelection(maskedValue, unmaskedIndex);
    expect(actual).toBe(expectedValue);
  });

  it('should setup the correct starting index when at first char', () => {
    //                   1
    const maskedValue = '1(307)-410-6456';
    //                     1
    const unmaskedValue = '13074106456';

    const unmaskedIndex = 1;
    const expectedValue = 1;

    const actual = fromMaskedNumberToUnmaskedSelection(maskedValue, unmaskedIndex);
    expect(actual).toBe(expectedValue);
  });
});
