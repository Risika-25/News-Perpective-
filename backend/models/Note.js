const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  articleUrl: {
    type: String,
    default: '',
  },
  articleTitle: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
