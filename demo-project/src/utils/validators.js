/**
 * Input Validation Utilities
 * Pure functions for validating user-supplied data before processing.
 */

/**
 * Validates an email address format.
 *
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates a password meets minimum requirements.
 * Requirements: at least 8 characters.
 *
 * @param {string} password
 * @returns {boolean}
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 8;
}

/**
 * Validates a UUID v4 string.
 *
 * @param {string} id
 * @returns {boolean}
 */
function validateUUID(id) {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Sanitizes a string by trimming whitespace and removing control characters.
 *
 * @param {string} input
 * @returns {string}
 */
function sanitizeString(input) {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Validates password strength.
 * Requires: min 10 characters, at least one uppercase letter, one lowercase
 * letter, one digit, and one special character.
 *
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validatePasswordStrength(password) {
  if (typeof password !== 'string') {
    return { valid: false, errors: ['Password must be a string'] };
  }

  const errors = [];

  if (password.length < 10) {
    errors.push('Password must be at least 10 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates an international phone number in E.164 format.
 * E.164: a '+' followed by 2–15 digits, country code must not start with 0.
 * Accepts: +14155552671, +447911123456, +919876543210
 * Rejects: 07911123456, 415-555-2671, (415) 555-2671
 *
 * @param {string} phone
 * @returns {boolean}
 */
function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return false;
  return /^\+[1-9]\d{1,14}$/.test(phone.trim());
}

module.exports = {
  validateEmail,
  validatePassword,
  validatePasswordStrength,
  validatePhoneNumber,
  validateUUID,
  sanitizeString
};
