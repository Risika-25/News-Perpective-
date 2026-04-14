import { motion } from 'framer-motion';
import { Moon, Sun, LogOut, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Radio className="w-6 h-6 text-blue-500" />
                    <span className="text-xl font-bold text-[hsl(var(--foreground))]">
                        NewsPodcast
                    </span>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Theme toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </motion.button>

                    {/* User info */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--secondary))]">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-[hsl(var(--foreground))] hidden sm:block">
                            {user?.name}
                        </span>
                    </div>

                    {/* Logout */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </header>
    );
};

export default Header;
