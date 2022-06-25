const mongoose = require('mongoose')

const NoteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      minlength: [6, 'Title should be at least 6 characters long'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: [6, 'Description should be at least 6 characters long'],
    },
    tag: {
      type: String,
      enum: ['General', 'Private', 'Public'],
      default: 'General',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('notes', NoteSchema)
