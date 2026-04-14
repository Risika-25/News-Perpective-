import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, ExternalLink, Clock, Globe } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const SavedArticles = () => {
    const { token } = useAuth();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);

    // Fetch saved articles on mount
    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/news/saved`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setArticles(res.data.savedArticles || []);
            } catch (err) {
                console.error('Failed to fetch saved articles:', err);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchSaved();
    }, [token]);

    const handleRemove = async (articleId) => {
        setRemoving(articleId);
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/news/saved/${articleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setArticles((prev) => prev.filter((a) => a._id !== articleId));
        } catch (err) {
            console.error('Remove failed:', err);
        }
        setRemoving(null);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Bookmark className="w-6 h-6 text-blue-400" />
                    <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Saved Articles</h1>
                </div>
                <p className="text-[hsl(var(--muted-foreground))]">
                    Your personal reading collection
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-24">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Empty */}
            {!loading && articles.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 gap-4 text-[hsl(var(--muted-foreground))]"
                >
                    <Bookmark className="w-16 h-16 opacity-30" />
                    <p className="text-xl font-semibold text-[hsl(var(--foreground))]">No saved articles yet</p>
                    <p>Go to Home and bookmark articles you want to read later</p>
                </motion.div>
            )}

            {/* Articles Grid */}
            {!loading && articles.length > 0 && (
                <>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
                        {articles.length} article{articles.length !== 1 ? 's' : ''} saved
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        <AnimatePresence>
                            {articles.map((article, index) => (
                                <motion.div
                                    key={article._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
                                >
                                    {/* Placeholder image area */}
                                    {article.urlToImage ? (
                                        <img
                                            src={article.urlToImage}
                                            alt={article.title}
                                            className="w-full h-40 object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="h-40 bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                                            <Globe className="w-10 h-10 text-blue-400/50" />
                                        </div>
                                    )}

                                    <div className="p-4 flex flex-col flex-1">
                                        {/* Source + Date */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                                                {article.source || 'Unknown'}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(article.savedAt)}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-[hsl(var(--foreground))] font-semibold text-sm leading-snug mb-2 line-clamp-3 flex-1">
                                            {article.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-[hsl(var(--muted-foreground))] text-xs line-clamp-2 mb-3">
                                            {article.description}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1 text-xs text-blue-400 font-medium hover:text-blue-300 transition"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                Read article
                                            </a>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemove(article._id)}
                                                disabled={removing === article._id}
                                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                                                title="Remove from saved"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default SavedArticles;
