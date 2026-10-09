import { InputValidationDirective } from './input-validation.directive';
import { ElementRef } from '@angular/core';

describe('InputValidationDirective', () => {
  it('should create an instance', () => {
    const elementRefMock = new ElementRef(document.createElement('input'));
    const directive = new InputValidationDirective(elementRefMock);
    expect(directive).toBeTruthy();
  });

  function makeDirectiveWithValue(value: string) {
    const input = document.createElement('input');
    input.value = value;
    const elRef = new ElementRef(input);
    const dir = new InputValidationDirective(elRef);
    return { dir, input };
  }

  function makeEventSpy() {
    return { stopPropagation: jest.fn() } as any;
  }

  it('should early-return when no validationType is set', () => {
    const { dir, input } = makeDirectiveWithValue('abc 123');
    const ev = makeEventSpy();

    dir.onInputChange(ev);

    expect(input.value).toBe('abc 123');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  it('should log error on invalid validationType', () => {
    const { dir, input } = makeDirectiveWithValue('abc 123');
    const ev = makeEventSpy();
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (dir as any).validationType = 'unknown-type';
    dir.onInputChange(ev);

    expect(errSpy).toHaveBeenCalledWith('Invalid validation type:', 'unknown-type');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
    expect(input.value).toBe('abc 123');
  });

  it('alpha: should keep only letters and spaces and call stopPropagation on change', () => {
    const { dir, input } = makeDirectiveWithValue('A b 1!c');
    const ev = makeEventSpy();

    (dir as any).validationType = 'alpha';
    dir.onInputChange(ev);

    expect(input.value).toBe('A b c');
    expect(ev.stopPropagation).toHaveBeenCalled();
  });

  it('alpha: should not call stopPropagation when value remains unchanged', () => {
    const { dir, input } = makeDirectiveWithValue('Abc Def');
    const ev = makeEventSpy();

    (dir as any).validationType = 'alpha';
    dir.onInputChange(ev);

    expect(input.value).toBe('Abc Def');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  // New cases to cover applyBasicValidation early returns for alpha
  it('alpha: first-char single space should clear input and not call stopPropagation', () => {
    const { dir, input } = makeDirectiveWithValue(' ');
    const ev = makeEventSpy();

    (dir as any).validationType = 'alpha';
    dir.onInputChange(ev);

    expect(input.value).toBe('');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  it('alpha: string of only spaces should clear input and not call stopPropagation', () => {
    const { dir, input } = makeDirectiveWithValue('    ');
    const ev = makeEventSpy();

    (dir as any).validationType = 'alpha';
    dir.onInputChange(ev);

    expect(input.value).toBe('');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  it('alphaNumeric: should keep letters and digits, removing spaces and symbols', () => {
    const { dir, input } = makeDirectiveWithValue('A 1 b_-');
    const ev = makeEventSpy();

    (dir as any).validationType = 'alphaNumeric';
    dir.onInputChange(ev);

    expect(input.value).toBe('A1b');
    expect(ev.stopPropagation).toHaveBeenCalled();
  });

  it('alphaNumeric: should not call stopPropagation when value remains unchanged', () => {
    const { dir, input } = makeDirectiveWithValue('Abc123');
    const ev = makeEventSpy();

    (dir as any).validationType = 'alphaNumeric';
    dir.onInputChange(ev);

    expect(input.value).toBe('Abc123');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  // New cases to cover applyBasicValidation early returns for alphaNumeric
  it('alphaNumeric: first-char single space should clear input and not call stopPropagation', () => {
    const { dir, input } = makeDirectiveWithValue(' ');
    const ev = makeEventSpy();

    (dir as any).validationType = 'alphaNumeric';
    dir.onInputChange(ev);

    expect(input.value).toBe('');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  it('alphaNumeric: string of only spaces should clear input and not call stopPropagation', () => {
    const { dir, input } = makeDirectiveWithValue('   ');
    const ev = makeEventSpy();

    (dir as any).validationType = 'alphaNumeric';
    dir.onInputChange(ev);

    expect(input.value).toBe('');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  it('numbersOnly: should keep only digits', () => {
    const { dir, input } = makeDirectiveWithValue(' 12a3! ');
    const ev = makeEventSpy();

    (dir as any).validationType = 'numbersOnly';
    dir.onInputChange(ev);

    expect(input.value).toBe('123');
    expect(ev.stopPropagation).toHaveBeenCalled();
  });

  it('numbersOnly: should not call stopPropagation when value remains unchanged', () => {
    const { dir, input } = makeDirectiveWithValue('123456');
    const ev = makeEventSpy();

    (dir as any).validationType = 'numbersOnly';
    dir.onInputChange(ev);

    expect(input.value).toBe('123456');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  it('numbersOnly: first-char single space should clear input and not call stopPropagation', () => {
    const { dir, input } = makeDirectiveWithValue(' ');
    const ev = makeEventSpy();

    (dir as any).validationType = 'numbersOnly';
    dir.onInputChange(ev);

    expect(input.value).toBe('');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  it('numbersOnly: string of only spaces should clear input and not call stopPropagation', () => {
    const { dir, input } = makeDirectiveWithValue('    ');
    const ev = makeEventSpy();

    (dir as any).validationType = 'numbersOnly';
    dir.onInputChange(ev);

    expect(input.value).toBe('');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  it('appAlphaNumericSpace: should allow letters, digits, spaces; trim left spaces', () => {
    const { dir, input } = makeDirectiveWithValue('   a b c 123!? ');
    const ev = makeEventSpy();

    (dir as any).validationType = 'appAlphaNumericSpace';
    dir.onInputChange(ev);

    // symbols removed, leading spaces trimmed, trailing space preserved
    expect(input.value).toBe('a b c 123 ');
    expect(ev.stopPropagation).toHaveBeenCalled();
  });

  it('appAlphaNumericSpace: unchanged valid value should not call stopPropagation', () => {
    const { dir, input } = makeDirectiveWithValue('Abc 123');
    const ev = makeEventSpy();

    (dir as any).validationType = 'appAlphaNumericSpace';
    dir.onInputChange(ev);

    expect(input.value).toBe('Abc 123');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  it('appAlphaNumericSpace: only spaces should become empty and call stopPropagation', () => {
    const { dir, input } = makeDirectiveWithValue('     ');
    const ev = makeEventSpy();

    (dir as any).validationType = 'appAlphaNumericSpace';
    dir.onInputChange(ev);

    expect(input.value).toBe('');
    expect(ev.stopPropagation).toHaveBeenCalled();
  });

  // New: trim-left removes tabs/newlines as whitespace
  it('appAlphaNumericSpace: trims left tabs/newlines and keeps internal spaces', () => {
    const { dir, input } = makeDirectiveWithValue('\t\n   Ab 12');
    const ev = makeEventSpy();

    (dir as any).validationType = 'appAlphaNumericSpace';
    dir.onInputChange(ev);

    expect(input.value).toBe('Ab 12');
    expect(ev.stopPropagation).toHaveBeenCalled();
  });

  it('appAlphaNumericSpecial: should allow letters, digits and ()/\\-; remove others', () => {
    const { dir, input } = makeDirectiveWithValue('a(b)c-1/2\\3 _*+');
    const ev = makeEventSpy();

    (dir as any).validationType = 'appAlphaNumericSpecial';
    dir.onInputChange(ev);

    expect(input.value).toBe('a(b)c-1/2\\3');
    expect(ev.stopPropagation).toHaveBeenCalled();
  });

  it('appAlphaNumericSpecial: unchanged valid value should not call stopPropagation', () => {
    const { dir, input } = makeDirectiveWithValue('Abc-123/()\\');
    const ev = makeEventSpy();

    (dir as any).validationType = 'appAlphaNumericSpecial';
    dir.onInputChange(ev);

    expect(input.value).toBe('Abc-123/()\\');
    expect(ev.stopPropagation).not.toHaveBeenCalled();
  });

  // Additional edge cases to improve coverage
  describe('Additional edge cases', () => {
    function makeDirectiveWithValue(value: string) {
      const input = document.createElement('input');
      input.value = value;
      const elRef = new ElementRef(input);
      const dir = new InputValidationDirective(elRef);
      return { dir, input };
    }
    function makeEventSpy() {
      return { stopPropagation: jest.fn() } as any;
    }

    it('alpha: empty string should remain unchanged and not stop propagation', () => {
      const { dir, input } = makeDirectiveWithValue('');
      const ev = makeEventSpy();
      (dir as any).validationType = 'alpha';
      dir.onInputChange(ev);
      expect(input.value).toBe('');
      expect(ev.stopPropagation).not.toHaveBeenCalled();
    });

    it('numbersOnly: letters only should become empty and stop propagation', () => {
      const { dir, input } = makeDirectiveWithValue('abc');
      const ev = makeEventSpy();
      (dir as any).validationType = 'numbersOnly';
      dir.onInputChange(ev);
      expect(input.value).toBe('');
      expect(ev.stopPropagation).toHaveBeenCalled();
    });

    it('alpha: digits only should become empty and stop propagation', () => {
      const { dir, input } = makeDirectiveWithValue('1234');
      const ev = makeEventSpy();
      (dir as any).validationType = 'alpha';
      dir.onInputChange(ev);
      expect(input.value).toBe('');
      expect(ev.stopPropagation).toHaveBeenCalled();
    });

    it('appAlphaNumericSpace: empty string should not trigger stopPropagation', () => {
      const { dir, input } = makeDirectiveWithValue('');
      const ev = makeEventSpy();
      (dir as any).validationType = 'appAlphaNumericSpace';
      dir.onInputChange(ev);
      expect(input.value).toBe('');
      expect(ev.stopPropagation).not.toHaveBeenCalled();
    });

    it('appAlphaNumericSpecial: only disallowed characters should clear input and stop propagation', () => {
      const { dir, input } = makeDirectiveWithValue('_*&@');
      const ev = makeEventSpy();
      (dir as any).validationType = 'appAlphaNumericSpecial';
      dir.onInputChange(ev);
      expect(input.value).toBe('');
      expect(ev.stopPropagation).toHaveBeenCalled();
    });

    it('appAlphaNumericSpace: single leading space should be trimmed and stop propagation', () => {
      const { dir, input } = makeDirectiveWithValue(' Ab');
      const ev = makeEventSpy();
      (dir as any).validationType = 'appAlphaNumericSpace';
      dir.onInputChange(ev);
      expect(input.value).toBe('Ab');
      expect(ev.stopPropagation).toHaveBeenCalled();
    });
  });
});
