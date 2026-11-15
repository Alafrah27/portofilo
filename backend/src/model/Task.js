import mongoose from 'mongoose';

export const TASK_STATUSES = ['todo', 'in-progress', 'done'];
export const TASK_PRIORITIES = ['low', 'medium', 'high'];

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, immutable: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  status: { type: String, enum: TASK_STATUSES, default: 'todo', required: true },
  priority: { type: String, enum: TASK_PRIORITIES, default: 'medium', required: true },
  dueDate: { type: Date, default: null },
}, {
  timestamps: true,
  optimisticConcurrency: true,
  toJSON: { transform(_document, result) { delete result.__v; return result; } },
});
taskSchema.index({ createdAt: -1, _id: -1 });

export const Task = mongoose.model('Task', taskSchema);
