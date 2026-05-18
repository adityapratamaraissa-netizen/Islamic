import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, ChevronLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Tasbih() {
  const navigate = useNavigate();
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('tasbih_count');
    return saved ? parseInt(saved) : 0;
  });
  const [target, setTarget] = useState(33);

  useEffect(() => {
    localStorage.setItem('tasbih_count', count.toString());
  }, [count]);

  const increment = () => {
    setCount(prev => prev + 1);
    // Haptic feedback visual
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const reset = () => {
    if (confirm('Reset hitungan dzikir?')) {
      setCount(0);
    }
  };

  const progress = (count % target) / target * 100;

  return (
    <div className="space-y-8 flex flex-col h-full items-center">
      <header className="w-full flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 glass-button rounded-full text-white">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Tasbih Digital</h2>
          <p className="text-islamic-soft text-sm">Hitung dzikir harian Anda</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        {/* Counter UI */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="144"
              cy="144"
              r="130"
              className="stroke-white/5 fill-none"
              strokeWidth="12"
            />
            <motion.circle
              cx="144"
              cy="144"
              r="130"
              className="stroke-islamic-gold fill-none"
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ strokeDasharray: "816", strokeDashoffset: "816" }}
              animate={{ strokeDashoffset: 816 - (816 * (progress / 100)) }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </svg>

          {/* Main Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={increment}
            className="w-56 h-56 rounded-full glass-card !bg-white/10 border-white/20 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.1)] group"
          >
            <span className="text-6xl font-bold text-white mb-2">{count}</span>
            <span className="text-xs text-white/40 uppercase tracking-widest group-hover:text-islamic-gold transition-colors">Tap di sini</span>
          </motion.button>
        </div>

        {/* Target Selector */}
        <div className="mt-12 flex gap-4">
          {[33, 99, 100].map(val => (
            <button
              key={val}
              onClick={() => setTarget(val)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                target === val ? 'bg-islamic-gold text-islamic-primary' : 'bg-white/5 text-white/40'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full flex gap-4">
        <button 
          onClick={reset}
          className="flex-1 glass-button flex items-center justify-center gap-2 text-rose-400 border-rose-500/20"
        >
          <RefreshCw size={18} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
