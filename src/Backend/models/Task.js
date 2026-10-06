import mongoose from 'mongoose'

// =============================================================================
// MONGOOSE TASK SCHEMA & MODEL (Practical 5)
// =============================================================================
// Defines the structure, data types, constraints, and defaults for tasks
// stored in MongoDB.
// =============================================================================

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'], // Field must not be empty
    trim: true,                                 // Removes accidental leading/trailing spaces
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,                             // New tasks start incomplete
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],       // Restricts values to this list only
      message: '{VALUE} is not a valid priority. Must be low, medium, or high.',
    },
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,                          // Automatically timestamps creation
  },
})

// Practical 5 Supplementary: Pre-save middleware hook
// Runs automatically before saving a document to ensure the title is neatly trimmed
taskSchema.pre('save', function (next) {
  if (this.title) {
    this.title = this.title.trim()
  }
  next()
})

export const Task = mongoose.model('Task', taskSchema)
