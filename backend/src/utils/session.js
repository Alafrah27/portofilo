import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { HttpError } from './errors.js';

export const ACCESS_SECONDS = 15 * 60;
export const REFRESH_SECONDS = 7 * 24 * 60 * 60;
export const ISSUER = 'musdar-api';
export const AUDIENCE = 'musdar-admin';

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function matchesToken(token, storedHash) {
  if (typeof token !== 'string' || typeof storedHash !== 'string' || !/^[a-f0-9]{64}$/.test(storedHash)) return false;
  return timingSafeEqual(Buffer.from(hashToken(token)), Buffer.from(storedHash));
}

export function createSession(userId, config) {
  const sign = (type, secret, expiresIn) => jwt.sign({ tokenType: type }, secret, {
    subject: String(userId), jwtid: randomUUID(), issuer: ISSUER, audience: AUDIENCE,
    algorithm: 'HS256', expiresIn,
  });
  const accessToken = sign('access', config.accessSecret, ACCESS_SECONDS);
  const refreshToken = sign('refresh', config.refreshSecret, REFRESH_SECONDS);
  return {
    accessToken, refreshToken,
    hashes: { accessToken: hashToken(accessToken), refreshToken: hashToken(refreshToken) },
  };
}

export function verifyToken(token, type, config) {
  if (typeof token !== 'string') throw new HttpError(401, 'Authentication required.');
  try {
    const payload = jwt.verify(token, type === 'access' ? config.accessSecret : config.refreshSecret, {
      algorithms: ['HS256'], issuer: ISSUER, audience: AUDIENCE,
    });
    if (payload.tokenType !== type || !mongoose.isObjectIdOrHexString(payload.sub)
      || typeof payload.jti !== 'string' || !payload.jti || !Number.isInteger(payload.exp)) {
      throw new Error('Invalid token claims.');
    }
    return payload;
  } catch {
    throw new HttpError(401, 'Invalid or expired session.');
  }
}

function cookieOptions(config, type) {
  return {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: type === 'access' ? '/api' : '/api/auth',
  };
}

export function setSessionCookies(res, session, config) {
  res.cookie('accessToken', session.accessToken, { ...cookieOptions(config, 'access'), maxAge: ACCESS_SECONDS * 1000 });
  res.cookie('refreshToken', session.refreshToken, { ...cookieOptions(config, 'refresh'), maxAge: REFRESH_SECONDS * 1000 });
}

export function clearSessionCookies(res, config) {
  clearAccessCookie(res, config);
  res.clearCookie('refreshToken', cookieOptions(config, 'refresh'));
}

export function clearAccessCookie(res, config) {
  res.clearCookie('accessToken', cookieOptions(config, 'access'));
}

export function publicUser(user) {
  return { id: String(user._id), email: user.email, role: user.role };
}
