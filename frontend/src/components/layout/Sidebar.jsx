import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Bookmark, History, FileText, User, BarChart2, Search } from 'lucide-react';

const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/saved', icon: Bookmark, label: 'Saved' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/notes', icon: FileText, label: 'Notes' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
];

const Sidebar = () => {
    return (
        <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-65px)] border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
            ${isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <motion.div whileHover={{ scale: 1.1 }}>
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                            </motion.div>
                            {label}
                        </>
                    )}
                </NavLink>
            ))}
        </aside>
    );
};

export default Sidebar;
