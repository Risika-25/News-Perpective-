import AudioButton from './AudioButton';
import SummaryModal from '../ai/SummaryModal';
import { motion } from 'framer-motion';
import { ExternalLink, Bookmark, BookmarkCheck, Clock, Globe, Sparkles } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ArticleCard = ({ article, index }) => {
    const { token,user } = useAuth();
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleSave = async (e) => {
        e.stopPropagation();
    if (!token || saved) return;
    setSaving(true);
    try {
        await axios.post(
            `${import.meta.env.VITE_API_URL}/news/save`,
            {
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage,
                source: article.source?.name,
                publishedAt: article.publishedAt,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setSaved(true);
    } catch (err) {
        console.error('Save failed:', err);
    }
    setSaving(false);
    };
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [summary, setSummary] = useState('');
    const [summarizing, setSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState('');


    const handleClick = async () => {
        window.open(article.url, '_blank', 'noopener,noreferrer');
        // Track reading history silently in background
        if (token) {
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/news/history`,
                    { title: article.title, url: article.url },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (err) {
                // Fail silently — not critical
            }
        }
    };
    const handleSummarize = async (e) => {
    e.stopPropagation();
    setSummary('');
    setSummaryError('');
    setSummaryOpen(true);
    setSummarizing(true);
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/ai/summarize`,
            {
                text: `${article.title}. ${article.description || ''}`,
                url: article.url,  // sends URL so backend scrapes full article
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setSummary(res.data.summary);
    } catch (err) {
        setSummaryError(err.response?.data?.message || 'Failed to generate summary. Please try again.');
    } finally {
        setSummarizing(false);
    }
};

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer group"
            onClick={handleClick}
        >
            {/* Image */}
            {article.urlToImage ? (
                <div className="relative h-44 overflow-hidden bg-[hsl(var(--secondary))]">
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            ) : (
                <div className="h-44 bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                    <Globe className="w-12 h-12 text-blue-400/50" />
                </div>
            )}

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                {/* Source + Date */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                        {article.source?.name || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                        <Clock className="w-3 h-3" />
                        {formatDate(article.publishedAt)}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-[hsl(var(--foreground))] font-semibold text-sm leading-snug mb-2 line-clamp-3 flex-1 group-hover:text-blue-400 transition-colors">
                    {article.title}
                </h3>

                {/* Description */}
                <p className="text-[hsl(var(--muted-foreground))] text-xs leading-relaxed line-clamp-4 mb-3">
                    {article.description || article.content?.replace(/\[\+\d+ chars?\]/g, '') || 'No preview available.'}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
                    <span className="flex items-center gap-1 text-xs text-blue-400 font-medium">
                        <ExternalLink className="w-3 h-3" />
                        Read article
                    </span>
                    <div className="flex items-center gap-1">
                    {/* 🔊 Audio */}
                   <AudioButton
                        text={`${article.title}. ${article.description || ''}`}
                        defaultSpeed={user?.preferences?.playbackSpeed || 1.0}
                        language={user?.preferences?.language || 'en'}
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSummarize}
                        className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-purple-400 hover:bg-purple-400/10 transition"
                        title="AI Summarize"
                        >
                        <Sparkles className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSave}
                        disabled={saving || saved || !token}
                        className={`p-1.5 rounded-lg transition ${saved
                            ? 'text-green-400 bg-green-400/10'
                            : 'text-[hsl(var(--muted-foreground))] hover:text-blue-400 hover:bg-blue-400/10'
                            }`}
                        title={saved ? 'Saved!' : 'Save article'}
                    >
                        {saved ? (
                            <BookmarkCheck className="w-4 h-4" />
                        ) : (
                            <Bookmark className="w-4 h-4" />
                        )}
                    </motion.button>
                </div>
            </div>
            </div>
            <SummaryModal
                isOpen={summaryOpen}
                onClose={() => setSummaryOpen(false)}
                article={article}
                summary={summary}
                loading={summarizing}
                error={summaryError}
                playbackSpeed={user?.preferences?.playbackSpeed || 1.0}
                language={user?.preferences?.language || 'en'}
            />

        </motion.div>
    );
};

export default ArticleCard;
