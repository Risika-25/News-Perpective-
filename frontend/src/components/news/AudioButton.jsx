import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Square } from 'lucide-react';
import { getSpeechCode } from '../../constants/languages';

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];

const AudioButton = ({ text, defaultSpeed = 1.0 }) => {
  const [speaking, setSpeaking] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [showSpeeds, setShowSpeeds] = useState(false);

  useEffect(() => {
    setSpeed(defaultSpeed);
  }, [defaultSpeed]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const speak = (rate) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.lang = getSpeechCode(language);
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    speak(speed);
  };

  const changeSpeed = (e, newSpeed) => {
    e.stopPropagation();
    setSpeed(newSpeed);
    setShowSpeeds(false);
    if (speaking) {
      window.speechSynthesis.cancel();
      speak(newSpeed);
    }
  };

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      {/* Speed selector */}
      <div className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setShowSpeeds(!showSpeeds); }}
          className="px-1.5 py-0.5 rounded text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-blue-400 hover:bg-blue-400/10 transition min-w-[32px] text-center"
          title="Playback speed"
        >
          {speed}x
        </button>

        <AnimatePresence>
          {showSpeeds && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-xl overflow-hidden z-10"
            >
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={(e) => changeSpeed(e, s)}
                  className={`block w-full px-4 py-1.5 text-xs text-left hover:bg-blue-500/20 transition whitespace-nowrap ${
                    speed === s
                      ? 'text-blue-400 font-semibold bg-blue-500/10'
                      : 'text-[hsl(var(--foreground))]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Play/Stop button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className={`p-1.5 rounded-lg transition ${
          speaking
            ? 'text-blue-400 bg-blue-400/10 animate-pulse'
            : 'text-[hsl(var(--muted-foreground))] hover:text-blue-400 hover:bg-blue-400/10'
        }`}
        title={speaking ? 'Stop reading' : 'Listen to article'}
      >
        {speaking ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </motion.button>
    </div>
  );
};

export default AudioButton;

