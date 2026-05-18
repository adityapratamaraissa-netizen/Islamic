import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, Info, RefreshCw, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Qibla() {
  const navigate = useNavigate();
  const [heading, setHeading] = useState(0);
  const [qiblaDir, setQiblaDir] = useState(295); // Approximate for Indonesia
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const handleOrientation = (e: any) => {
      if (e.webkitCompassHeading) {
        setHeading(e.webkitCompassHeading);
      } else {
        setHeading(e.alpha);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    
    // Attempt to request permission if needed (iOS)
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .catch(() => setIsSupported(false));
    }

    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <div className="space-y-8 flex flex-col h-full">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 glass-button rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Arah Kiblat</h2>
          <p className="text-islamic-soft text-sm">Temukan arah Ka'bah</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center relative py-10">
        {/* Compass Outer */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
          {/* Static Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-white/5 shadow-[0_0_50px_rgba(255,215,0,0.1)]" />
          
          {/* Degree Markers */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute h-full w-px bg-white/20" 
              style={{ transform: `rotate(${i * 30}deg)` }} 
            />
          ))}

          {/* Rotating Compass */}
          <motion.div 
            animate={{ rotate: -heading }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Cardinal Points */}
            <span className="absolute top-4 text-xs font-bold text-white/40">N</span>
            <span className="absolute right-4 text-xs font-bold text-white/40">E</span>
            <span className="absolute bottom-4 text-xs font-bold text-white/40">S</span>
            <span className="absolute left-4 text-xs font-bold text-white/40">W</span>

            {/* Qibla Indicator (Ka'bah) */}
            <div 
              className="absolute inset-0 flex flex-col items-center"
              style={{ transform: `rotate(${qiblaDir}deg)` }}
            >
              <div className="flex flex-col items-center -mt-8">
                <div className="w-10 h-10 bg-islamic-gold rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                   <div className="w-6 h-6 bg-black rounded-sm border-t-2 border-islamic-gold/50" />
                </div>
                <div className="w-1 h-32 bg-gradient-to-b from-islamic-gold to-transparent" />
              </div>
            </div>

            {/* Compass Needle */}
            <div className="w-1.5 h-40 bg-gradient-to-b from-rose-500 via-white/50 to-white/10 rounded-full" />
          </motion.div>

          {/* Center Point */}
          <div className="absolute w-4 h-4 rounded-full bg-white shadow-xl z-20" />
        </div>

        {/* Info */}
        <div className="mt-12 text-center">
          <p className="text-4xl font-bold text-islamic-gold">
            {Math.round(heading)}°
          </p>
          <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Heading</p>
        </div>
      </div>

      <div className="glass-card !p-4 bg-amber-500/10 border-amber-500/20 flex gap-3">
        <Info className="text-amber-500 shrink-0" size={20} />
        <p className="text-xs text-amber-100/70 leading-relaxed">
          Gunakan sensor kompas perangkat Anda. Pastikan kalibrasi dengan gerakan angka 8 di udara jika arah tidak akurat.
        </p>
      </div>

      {!isSupported && (
        <p className="text-[10px] text-rose-400 text-center">
          Perangkat ini mungkin tidak mendukung sensor orientasi atau memerlukan izin khusus.
        </p>
      )}

      <button className="glass-button w-full flex items-center justify-center gap-2">
        <RefreshCw size={18} />
        <span>Kalibrasi Ulang</span>
      </button>
    </div>
  );
}
