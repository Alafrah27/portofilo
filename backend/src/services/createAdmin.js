import { User, validPassword } from '../model/User.js';

export class AdminCreationError extends Error {}

export async function createAdmin({ email, password }) {
  if (typeof email !== 'string' || email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new AdminCreationError('Enter a valid email address.');
  }
  if (!validPassword(password)) throw new AdminCreationError('Password must have at least 6 characters and at most 72 UTF-8 bytes.');
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) throw new AdminCreationError('An account with this email already exists. No account was changed.');
  try {
    return await User.create({ email: normalizedEmail, password, role: 'admin' });
  } catch (error) {
    if (error.code === 11000) throw new AdminCreationError('An account with this email already exists. No account was changed.');
    throw error;
  }
}
