import mongoose from 'mongoose';

export function validWebsiteUrl(value) {
  if (value === '') return true;
  if (typeof value !== 'string' || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true, match: /^https:\/\// },
  publicId: { type: String, required: true },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, immutable: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 100000 },
  websiteUrl: {
    type: String, trim: true, default: '', maxlength: 2048,
    validate: { validator: validWebsiteUrl, message: 'Enter a valid HTTP or HTTPS website URL.' },
  },
  images: {
    type: [imageSchema], required: true,
    validate: { validator: (images) => images.length >= 1 && images.length <= 10, message: 'One to ten images are required.' },
  },
}, {
  timestamps: true,
  optimisticConcurrency: true,
  toJSON: { transform(_document, result) { delete result.__v; return result; } },
});

projectSchema.index({ createdAt: -1, _id: -1 });

export const Project = mongoose.model('Project', projectSchema);
