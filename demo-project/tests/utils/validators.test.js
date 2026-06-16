'use strict';

const { validatePasswordStrength, validatePhoneNumber } = require('../../src/utils/validators');

describe('validatePasswordStrength', () => {
  // --- Happy path ---

  test('returns valid for a password meeting all requirements', () => {
    const result = validatePasswordStrength('Secure@Pass1');
    expect(result).toEqual({ valid: true, errors: [] });
  });

  test('accepts exactly 10 characters when all rules are met', () => {
    const result = validatePasswordStrength('Abcdefg1@x');
    expect(result).toEqual({ valid: true, errors: [] });
  });

  test('accepts special characters from various symbol sets', () => {
    expect(validatePasswordStrength('MyP4ssword!').valid).toBe(true);
    expect(validatePasswordStrength('MyP4ssword#').valid).toBe(true);
    expect(validatePasswordStrength('MyP4ssword$').valid).toBe(true);
    expect(validatePasswordStrength('MyP4ssword ').valid).toBe(true); // space counts as special
  });

  // --- Length boundary ---

  test('returns invalid when password is 9 characters (one below minimum)', () => {
    const result = validatePasswordStrength('Abcdef1@x');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be at least 10 characters');
  });

  test('returns invalid for empty string', () => {
    const result = validatePasswordStrength('');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be at least 10 characters');
  });

  // --- Missing individual requirements ---

  test('returns invalid when uppercase letter is missing', () => {
    const result = validatePasswordStrength('secure@pass1');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  test('returns invalid when lowercase letter is missing', () => {
    const result = validatePasswordStrength('SECURE@PASS1');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  test('returns invalid when digit is missing', () => {
    const result = validatePasswordStrength('Secure@Password');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  test('returns invalid when special character is missing', () => {
    const result = validatePasswordStrength('SecurePass1234');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  // --- Multiple failures reported together ---

  test('returns all applicable error messages when multiple rules fail', () => {
    const result = validatePasswordStrength('short');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be at least 10 characters');
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
    expect(result.errors).toContain('Password must contain at least one number');
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  // --- Invalid types ---

  test('returns invalid with error message when password is null', () => {
    const result = validatePasswordStrength(null);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be a string');
  });

  test('returns invalid with error message when password is undefined', () => {
    const result = validatePasswordStrength(undefined);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be a string');
  });

  test('returns invalid with error message when password is a number', () => {
    const result = validatePasswordStrength(12345678901);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be a string');
  });

  // --- Whitespace edge cases ---

  test('returns invalid for whitespace-only string', () => {
    const result = validatePasswordStrength('          '); // 10 spaces
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
    expect(result.errors).toContain('Password must contain at least one number');
    // spaces ARE special characters so no special-char error expected
    expect(result.errors).not.toContain('Password must contain at least one special character');
  });
});

describe('validatePhoneNumber', () => {
  // --- Happy path (user-specified accept cases) ---

  test('accepts US number in E.164 format', () => {
    expect(validatePhoneNumber('+14155552671')).toBe(true);
  });

  test('accepts UK number in E.164 format', () => {
    expect(validatePhoneNumber('+447911123456')).toBe(true);
  });

  test('accepts India number in E.164 format', () => {
    expect(validatePhoneNumber('+919876543210')).toBe(true);
  });

  // --- Reject cases (user-specified) ---

  test('rejects number without leading +', () => {
    expect(validatePhoneNumber('07911123456')).toBe(false);
  });

  test('rejects number with dashes', () => {
    expect(validatePhoneNumber('415-555-2671')).toBe(false);
  });

  test('rejects number with parentheses and spaces', () => {
    expect(validatePhoneNumber('(415) 555-2671')).toBe(false);
  });

  // --- Edge cases ---

  test('returns false for empty string', () => {
    expect(validatePhoneNumber('')).toBe(false);
  });

  test('returns false for null', () => {
    expect(validatePhoneNumber(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(validatePhoneNumber(undefined)).toBe(false);
  });

  test('returns false when input is a number type', () => {
    expect(validatePhoneNumber(14155552671)).toBe(false);
  });

  test('rejects a bare + with no digits', () => {
    expect(validatePhoneNumber('+')).toBe(false);
  });

  test('rejects country code starting with 0', () => {
    expect(validatePhoneNumber('+0123456789')).toBe(false);
  });

  test('rejects number exceeding 15 digits (E.164 max)', () => {
    expect(validatePhoneNumber('+1234567890123456')).toBe(false); // 16 digits after +
  });

  test('rejects whitespace-only string', () => {
    expect(validatePhoneNumber('   ')).toBe(false);
  });
});
