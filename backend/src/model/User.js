import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export function validPassword(value) {
  return typeof value === 'string' && Array.from(value).length >= 6 && Buffer.byteLength(value, 'utf8') <= 72;
}

function hideCredentials(_document, result) {
  delete result.password;
  delete result.accessToken;
  delete result.refreshToken;
  delete result.__v;
  return result;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String, required: true, select: false,
    validate: { validator: validPassword, message: 'Password must have at least 6 characters and at most 72 UTF-8 bytes.' },
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
  accessToken: { type: String, default: null, select: false },
  refreshToken: { type: String, default: null, select: false },
}, {
  timestamps: true,
  toJSON: { transform: hideCredentials },
  toObject: { transform: hideCredentials },
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});

export const User = mongoose.model('User', userSchema);
