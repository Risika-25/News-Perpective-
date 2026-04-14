import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, BookOpen, History, Search, FileText, TrendingUp } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, color, bg, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl ${bg} shrink-0`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <p className="text-[hsl(var(--muted-foreground))] text-sm">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  </motion.div>
);

const Analytics = () => {
  const { token } = useAuth();
  const [data, setData] = useState({
    saved: 0,
    history: [],
    searches: [],
    notes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [savedRes, historyRes, notesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/news/saved`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/news/history`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/notes`, { headers }),
        ]);
        setData({
          saved: savedRes.data.savedArticles?.length || 0,
          history: historyRes.data.readingHistory || [],
          notes: notesRes.data.notes?.length || 0,
          searches: [],
        });
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAll();
  }, [token]);

  // Reading activity per day (last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = d.toDateString();
      const count = data.history.filter(
        (item) => new Date(item.readAt).toDateString() === dateStr
      ).length;
      days.push({ label, count });
    }
    return days;
  };

  const activityDays = getLast7Days();
  const maxActivity = Math.max(...activityDays.map((d) => d.count), 1);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart2 className="w-6 h-6 text-blue-400" />
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Analytics</h1>
        </div>
        <p className="text-[hsl(var(--muted-foreground))]">Your reading insights and activity</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={BookOpen}  label="Articles Saved"  value={data.saved}            color="text-blue-400"   bg="bg-blue-400/10"   delay={0}   />
            <StatCard icon={History}   label="Articles Read"   value={data.history.length}   color="text-purple-400" bg="bg-purple-400/10" delay={0.1} />
            <StatCard icon={FileText}  label="Notes Created"   value={data.notes}            color="text-green-400"  bg="bg-green-400/10"  delay={0.2} />
            <StatCard icon={TrendingUp} label="Reading Streak" value={`${getStreak(data.history)}d`} color="text-orange-400" bg="bg-orange-400/10" delay={0.3} />
          </div>

          {/* Reading Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-6">
              Reading Activity — Last 7 Days
            </h2>
            <div className="flex items-end gap-3 h-36">
              {activityDays.map((day, i) => (
                <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-blue-400">
                    {day.count > 0 ? day.count : ''}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.count / maxActivity) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg min-h-[4px]"
                    style={{ minHeight: day.count > 0 ? undefined : '4px', opacity: day.count > 0 ? 1 : 0.2 }}
                  />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">{day.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent reads */}
          {data.history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">
                Recently Read
              </h2>
              <div className="flex flex-col gap-2">
                {data.history.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))] last:border-none">
                    <p className="text-sm text-[hsl(var(--foreground))] line-clamp-1 flex-1 mr-4">{item.title}</p>
                    <span className="text-xs text-[hsl(var(--muted-foreground))] shrink-0">
                      {new Date(item.readAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

// Helper: count consecutive days with reading activity
function getStreak(history) {
  if (!history.length) return 0;
  let streak = 0;
  const today = new Date().toDateString();
  const readDates = new Set(history.map((h) => new Date(h.readAt).toDateString()));
  let d = new Date();
  while (readDates.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default Analytics;
