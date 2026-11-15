import bcrypt from 'bcryptjs';
import { User } from '../model/User.js';
import { HttpError } from '../utils/errors.js';
import {
  clearSessionCookies, createSession, hashToken, matchesToken,
  publicUser, setSessionCookies, verifyToken,
} from '../utils/session.js';

// Unknown accounts still incur the same bcrypt work as known accounts.
const dummyPasswordHash = bcrypt.hash('invalid-login-placeholder', 12);

export function authController(config) {
  return {
    async login(req, res) {
      const { email, password } = req.body || {};
      if (typeof email !== 'string' || email.length > 254
        || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        || typeof password !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72) {
        throw new HttpError(400, 'A valid email and password are required.');
      }
      const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
      const correctPassword = await bcrypt.compare(password, user?.password || await dummyPasswordHash);
      if (!user || !correctPassword) throw new HttpError(401, 'Invalid email or password.');
      if (user.role !== 'admin') throw new HttpError(403, 'Administrator access required.');
      const session = createSession(user._id, config);
      const updated = await User.findOneAndUpdate(
        { _id: user._id, role: 'admin', password: user.password },
        { $set: session.hashes }, { returnDocument: 'after' },
      );
      if (!updated) throw new HttpError(403, 'Administrator access required.');
      setSessionCookies(res, session, config);
      res.json({ user: publicUser(updated) });
    },

    async refresh(req, res) {
      try {
        const token = req.cookies.refreshToken;
        const payload = verifyToken(token, 'refresh', config);
        const user = await User.findById(payload.sub).select('+refreshToken');
        if (!user || !matchesToken(token, user.refreshToken)) throw new HttpError(401, 'Invalid or expired session.');
        if (user.role !== 'admin') {
          await User.updateOne({ _id: user._id, refreshToken: hashToken(token) }, {
            $set: { accessToken: null, refreshToken: null },
          });
          throw new HttpError(403, 'Administrator access required.');
        }
        const session = createSession(user._id, config);
        // Compare-and-swap prevents reuse and permits only one concurrent rotation.
        const updated = await User.findOneAndUpdate(
          { _id: user._id, role: 'admin', refreshToken: hashToken(token) },
          { $set: session.hashes }, { returnDocument: 'after' },
        );
        if (!updated) throw new HttpError(401, 'Invalid or expired session.');
        setSessionCookies(res, session, config);
        res.json({ user: publicUser(updated) });
      } catch (error) {
        if (error instanceof HttpError) clearSessionCookies(res, config);
        throw error;
      }
    },

    async logout(req, res) {
      for (const [type, field] of [['refresh', 'refreshToken'], ['access', 'accessToken']]) {
        const token = req.cookies[field];
        let payload;
        try { payload = verifyToken(token, type, config); }
        catch (error) { if (error instanceof HttpError) continue; throw error; }
        const result = await User.updateOne({ _id: payload.sub, [field]: hashToken(token) }, {
          $set: { accessToken: null, refreshToken: null },
        });
        if (result.matchedCount) break;
      }
      clearSessionCookies(res, config);
      res.status(204).end();
    },

    me(req, res) {
      res.json({ user: publicUser(req.user) });
    },
  };
}
