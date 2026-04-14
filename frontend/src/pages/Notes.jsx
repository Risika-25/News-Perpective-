import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Search, Trash2, Pencil, Tag, Clock } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import NoteModal from '../components/notes/NoteModal';
import { useAuth } from '../context/AuthContext';

const Notes = () => {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    if (editNote) {
      // Update
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/notes/${editNote._id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => prev.map((n) => (n._id === editNote._id ? res.data.note : n)));
    } else {
      // Create
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/notes`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => [res.data.note, ...prev]);
    }
    setEditNote(null);
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    await axios.delete(`${import.meta.env.VITE_API_URL}/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes((prev) => prev.filter((n) => n._id !== noteId));
  };

  const openEdit = (note) => {
    setEditNote(note);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditNote(null);
    setModalOpen(true);
  };

  // All unique tags
  const allTags = [...new Set(notes.flatMap((n) => n.tags))];

  // Filtered notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !activeTag || note.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <FileText className="w-6 h-6 text-blue-400" />
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Notes</h1>
          </div>
          <p className="text-[hsl(var(--muted-foreground))]">Your personal knowledge base</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Note
        </motion.button>
      </div>

      {/* Search + Tag Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Tag Filter Pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTag('')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              !activeTag
                ? 'bg-blue-600 text-white'
                : 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:bg-blue-600/20'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                activeTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:bg-blue-600/20'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && filteredNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-4 text-[hsl(var(--muted-foreground))]"
        >
          <FileText className="w-16 h-16 opacity-30" />
          <p className="text-xl font-semibold text-[hsl(var(--foreground))]">
            {notes.length === 0 ? 'No notes yet' : 'No matching notes'}
          </p>
          <p>{notes.length === 0 ? 'Click "New Note" to get started' : 'Try a different search or tag'}</p>
        </motion.div>
      )}

      {/* Notes Grid */}
      {!loading && filteredNotes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-5 hover:border-blue-500/40 hover:shadow-lg transition-all flex flex-col gap-3"
              >
                {/* Title */}
                <h3 className="font-semibold text-[hsl(var(--foreground))] line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {note.title}
                </h3>

                {/* Content Preview */}
                {note.content && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-3 leading-relaxed flex-1">
                    {note.content}
                  </p>
                )}

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-0.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs rounded-full"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer: date + actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
                  <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                    <Clock className="w-3 h-3" />
                    {formatDate(note.updatedAt)}
                  </span>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEdit(note)}
                      className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-blue-400 hover:bg-blue-400/10 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(note._id)}
                      className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-red-400 hover:bg-red-400/10 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditNote(null); }}
        onSave={handleSave}
        editNote={editNote}
      />
    </DashboardLayout>
  );
};

export default Notes;
