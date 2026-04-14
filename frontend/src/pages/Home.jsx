import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, TrendingUp } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import SearchBar from '../components/news/SearchBar';
import ArticleCard from '../components/news/ArticleCard';
import { useNews } from '../context/NewsContext';

const Home = () => {
    const { articles, loading, error, searchNews } = useNews();
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (query) => {
        setHasSearched(true);
        await searchNews(query);
    };

    return (
        <DashboardLayout>
            {/* Hero Search Section */}
            <div className="mb-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-3">
                        Discover the News
                    </h1>
                    <p className="text-[hsl(var(--muted-foreground))] text-lg">
                        Search any topic and get diverse perspectives from across the web
                    </p>
                </motion.div>

                <SearchBar onSearch={handleSearch} isLoading={loading} />
            </div>

            {/* Error */}
            {error && (
                <div className="text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                    ⚠️ {error}
                </div>
            )}

            {/* Results */}
            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-24 gap-4"
                    >
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-[hsl(var(--muted-foreground))]">Fetching articles...</p>
                    </motion.div>
                )}

                {!loading && hasSearched && articles.length === 0 && (
                    <motion.div
                        key="no-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24"
                    >
                        <Newspaper className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
                        <p className="text-[hsl(var(--foreground))] text-xl font-semibold">No articles found</p>
                        <p className="text-[hsl(var(--muted-foreground))] mt-2">Try a different search term</p>
                    </motion.div>
                )}

                {!loading && articles.length > 0 && (
                    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                                {articles.length} Articles Found
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {articles.map((article, index) => (
                                <ArticleCard key={article.url} article={article} index={index} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {!hasSearched && !loading && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-24 gap-3 text-[hsl(var(--muted-foreground))]"
                    >
                        <Newspaper className="w-16 h-16 opacity-30" />
                        <p className="text-lg">Search above to discover articles</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Home;
