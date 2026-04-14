const Note = require('../models/Note.js');

// Get all notes for logged-in user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, tags, articleUrl, articleTitle } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const note = await Note.create({
      userId: req.user.id,
      title,
      content: content || '',
      tags: tags || [],
      articleUrl: articleUrl || '',
      articleTitle: articleTitle || '',
    });
    res.status(201).json({ note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    const { title, content, tags } = req.body;
    note.title = title ?? note.title;
    note.content = content ?? note.content;
    note.tags = tags ?? note.tags;
    await note.save();
    res.json({ note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
