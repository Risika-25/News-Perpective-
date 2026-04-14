import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

const SearchBar = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    const suggestions = ['Technology', 'AI', 'Climate', 'Finance', 'Sports', 'Politics'];

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for any news topic..."
                    className="w-full pl-12 pr-32 py-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500 text-base transition shadow-sm"
                />
                <motion.button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center gap-2"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Search className="w-4 h-4" />
                    )}
                    {isLoading ? 'Searching...' : 'Search'}
                </motion.button>
            </form>

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {suggestions.map((s) => (
                    <button
                        key={s}
                        onClick={() => {
                            setQuery(s);
                            onSearch(s);
                        }}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:bg-blue-600 hover:text-white transition-all duration-200"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;
