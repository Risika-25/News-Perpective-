import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History, ExternalLink, Clock } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const ReadingHistory = () => {
    const { token } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/news/history`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHistory(res.data.readingHistory || []);
            } catch (err) {
                console.error('Failed to fetch history:', err);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchHistory();
    }, [token]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <History className="w-6 h-6 text-blue-400" />
                    <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Reading History</h1>
                </div>
                <p className="text-[hsl(var(--muted-foreground))]">Articles you've read recently</p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-24">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Empty */}
            {!loading && history.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 gap-4 text-[hsl(var(--muted-foreground))]"
                >
                    <History className="w-16 h-16 opacity-30" />
                    <p className="text-xl font-semibold text-[hsl(var(--foreground))]">No reading history yet</p>
                    <p>Articles you click on will appear here</p>
                </motion.div>
            )}

            {/* History List */}
            {!loading && history.length > 0 && (
                <div className="flex flex-col gap-3">
                    {history.map((item, index) => (
                        <motion.div
                            key={item._id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className="flex items-center justify-between p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl hover:border-blue-500/40 transition group"
                        >
                            <div className="flex-1 min-w-0 mr-4">
                                <p className="text-[hsl(var(--foreground))] font-medium text-sm line-clamp-1 group-hover:text-blue-400 transition">
                                    {item.title}
                                </p>
                                <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] mt-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(item.readAt)}
                                </span>
                            </div>
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition shrink-0"
                            >
                                <ExternalLink className="w-3 h-3" />
                                Read again
                            </a>
                        </motion.div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default ReadingHistory;
