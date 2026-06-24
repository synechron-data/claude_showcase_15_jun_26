'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loginUser, isTokenExpired } = require('../../src/auth/authService');

const CORRECT_PASSWORD = 'Correct@Pass1!';
let passwordHash;

beforeAll(async () => {
  passwordHash = await bcrypt.hash(CORRECT_PASSWORD, 10);
});

describe('loginUser', () => {
  const baseUser = {
    id: 'user-test-001',
    email: 'test@example.com',
    role: 'user',
  };

  test('throws Invalid credentials when password does not match stored hash', async () => {
    const userRecord = { ...baseUser, passwordHash };
    await expect(
      loginUser('test@example.com', 'wrongpassword', userRecord)
    ).rejects.toThrow('Invalid credentials');
  });

  test('returns accessToken, refreshToken, and user when credentials are correct', async () => {
    const userRecord = { ...baseUser, passwordHash };
    const result = await loginUser('test@example.com', CORRECT_PASSWORD, userRecord);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user).toEqual({
      id: 'user-test-001',
      email: 'test@example.com',
      role: 'user',
    });
  });

  test('throws Invalid credentials when userRecord is null', async () => {
    await expect(
      loginUser('test@example.com', CORRECT_PASSWORD, null)
    ).rejects.toThrow('Invalid credentials');
  });
});

describe('isTokenExpired', () => {
  const SECRET = 'test-secret';
  const nowSecs = () => Math.floor(Date.now() / 1000);

  test('returns false for a JWT whose exp is in the future', () => {
    const token = jwt.sign({ sub: 'u1', exp: nowSecs() + 3600 }, SECRET);
    expect(isTokenExpired(token)).toBe(false);
  });

  test('returns true for a JWT whose exp is in the past', () => {
    const token = jwt.sign({ sub: 'u1', exp: nowSecs() - 60 }, SECRET);
    expect(isTokenExpired(token)).toBe(true);
  });

  test('returns true for a non-JWT string such as a UUID refresh token', () => {
    // jwt.decode returns null for UUIDs; the null-guard fires before the
    // comparison, so UUID refresh tokens are always treated as expired.
    // Fixing expiry for UUID-based refresh tokens requires a separate change
    // to check createdAt + REFRESH_EXPIRES_IN from the token store instead.
    expect(isTokenExpired('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  test('returns true for null input', () => {
    expect(isTokenExpired(null)).toBe(true);
  });
});
