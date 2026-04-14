import { createPortal } from 'react-dom';
import AudioButton from '../news/AudioButton';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, AlertCircle } from 'lucide-react';

const SummaryModal = ({ isOpen, onClose, article, summary, loading, error, playbackSpeed = 1.0, language = 'en' }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))] bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">AI Summary</h2>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Article title */}
              {article?.title && (
                <div className="px-6 pt-4 pb-2">
                  <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wide mb-1">
                    {article.source?.name || 'Article'}
                  </p>
                  <h3 className="text-sm font-medium text-[hsl(var(--foreground))] line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-4 min-h-[140px] flex items-center justify-center">
                {loading && (
                  <div className="flex flex-col items-center gap-3 text-[hsl(var(--muted-foreground))]">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    <p className="text-sm">Generating summary...</p>
                    <p className="text-xs opacity-60">This may take up to 30s on first run</p>
                  </div>
                )}

                {!loading && error && (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {!loading && summary && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                      <span className="text-xs text-blue-400 font-medium">AI Generated</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    </div>
                    <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed">
                      {summary}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-6 py-4 border-t border-[hsl(var(--border))]">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Powered by BART-Large-CNN
                  </p>
                  {summary && !loading && (
                    <AudioButton text={summary} defaultSpeed={playbackSpeed} language={language} />
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body  // 👈 Portal — renders outside the card's transform context
  );
};

export default SummaryModal;
