'use strict';

const bcrypt = require('bcryptjs');
const { loginUser } = require('../../src/auth/authService');

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
