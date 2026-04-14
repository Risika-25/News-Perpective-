import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, BookOpen, History,
  Search, Settings, Loader2, Check
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES } from '../constants/languages';

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];
const FONT_SIZES = ['small', 'medium', 'large'];
const THEMES = ['light', 'dark'];

const Profile = () => {
  const { user, token, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Local prefs state for editing
  const [prefs, setPrefs] = useState({
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    playbackSpeed: 1.0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(res.data);
        // Sync prefs from live data
        if (res.data.preferences) {
          setPrefs({
            theme: res.data.preferences.theme || 'light',
            language: res.data.preferences.language || 'en',
            fontSize: res.data.preferences.fontSize || 'medium',
            playbackSpeed: res.data.preferences.playbackSpeed || 1.0,
          });
        }
      } catch (err) {
        setProfileData(user);
        if (user?.preferences) setPrefs(user.preferences);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handlePrefChange = (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/preferences`,
        prefs,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshUser(); // Sync AuthContext with fresh data
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  };

  const data = profileData || user;

  const statCards = [
    { icon: BookOpen,  label: 'Saved Articles', value: data?.savedArticles?.length ?? 0,   color: 'text-blue-400',   bg: 'bg-blue-400/10' },
    { icon: History,   label: 'Articles Read',  value: data?.readingHistory?.length ?? 0,  color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { icon: Search,    label: 'Searches Made',  value: data?.searchHistory?.length ?? 0,   color: 'text-green-400',  bg: 'bg-green-400/10' },
  ];

  const selectClass = "w-full bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-6 h-6 text-blue-400" />
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Profile</h1>
        </div>
        <p className="text-[hsl(var(--muted-foreground))]">Your account information</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
        </div>
      ) : (
        <div className="max-w-2xl flex flex-col gap-6">
          {/* Avatar Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 flex items-center gap-5"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0">
              {data?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">{data?.name}</h2>
              <div className="flex items-center gap-2 mt-1 text-[hsl(var(--muted-foreground))]">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{data?.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[hsl(var(--muted-foreground))]">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Member since {formatDate(data?.createdAt)}</span>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {statCards.map(({ icon: Icon, label, value, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
              >
                <div className={`p-3 rounded-xl ${bg}`}><Icon className={`w-5 h-5 ${color}`} /></div>
                <span className={`text-2xl font-bold ${color}`}>{value}</span>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{label}</span>
              </motion.div>
            ))}
          </div>

          {/* Preferences Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Preferences</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={savePreferences}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  saved
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50`}
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : saved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : null}
                {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Theme */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <label className="text-sm text-[hsl(var(--muted-foreground))]">Theme</label>
                <select
                  value={prefs.theme}
                  onChange={(e) => handlePrefChange('theme', e.target.value)}
                  className={selectClass}
                >
                  {THEMES.map((t) => (
                    <option key={t} value={t} className="bg-[hsl(var(--card))]">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <label className="text-sm text-[hsl(var(--muted-foreground))]">Language</label>
                <select
                  value={prefs.language}
                  onChange={(e) => handlePrefChange('language', e.target.value)}
                  className={selectClass}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value} className="bg-[hsl(var(--card))]">
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <label className="text-sm text-[hsl(var(--muted-foreground))]">Font Size</label>
                <select
                  value={prefs.fontSize}
                  onChange={(e) => handlePrefChange('fontSize', e.target.value)}
                  className={selectClass}
                >
                  {FONT_SIZES.map((f) => (
                    <option key={f} value={f} className="bg-[hsl(var(--card))]">
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Playback Speed */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <label className="text-sm text-[hsl(var(--muted-foreground))]">Playback Speed</label>
                <select
                  value={prefs.playbackSpeed}
                  onChange={(e) => handlePrefChange('playbackSpeed', parseFloat(e.target.value))}
                  className={selectClass}
                >
                  {SPEEDS.map((s) => (
                    <option key={s} value={s} className="bg-[hsl(var(--card))]">
                      {s}x
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Profile;


