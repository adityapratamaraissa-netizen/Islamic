import { motion } from 'motion/react';
import { Book, Clock, Compass, Heart, Settings, ScrollText, ChevronRight, Hash, PlayCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { prayerService } from '@/src/services/api';
import { notificationService } from '@/src/services/notificationService';

export default function Dashboard() {
  const [timings, setTimings] = useState<any>(null);
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string} | null>(null);
  const [lastRead, setLastRead] = useState<any>(null);

  useEffect(() => {
    // Default to Jakarta
    prayerService.getTimings('Jakarta').then(data => {
      setTimings(data.timings);
      calculateNextPrayer(data.timings);
    });

    const savedLastRead = localStorage.getItem('last_read');
    if (savedLastRead) {
      setLastRead(JSON.parse(savedLastRead));
    }
  }, []);

  useEffect(() => {
    if (!timings) return;

    const interval = setInterval(() => {
      const isEnabled = localStorage.getItem('notifications_enabled') === 'true';
      if (isEnabled) {
        notificationService.checkPrayerTimes(timings);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [timings]);

  const calculateNextPrayer = (times: any) => {
    const now = new Date();
    const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    for (const name of prayerNames) {
      const [h, m] = times[name].split(':');
      const pTime = new Date();
      pTime.setHours(parseInt(h), parseInt(m), 0);
      
      if (pTime > now) {
        setNextPrayer({ name, time: times[name] });
        return;
      }
    }
    // If all passed, next is Fajr tomorrow
    setNextPrayer({ name: 'Fajr', time: times['Fajr'] });
  };

  const menuItems = [
    { title: 'Al-Qur’an', icon: <Book className="text-blue-400" />, path: '/quran', color: 'bg-blue-500/20' },
    { title: 'Jadwal Sholat', icon: <Clock className="text-emerald-400" />, path: '/prayer', color: 'bg-emerald-500/20' },
    { title: 'Arah Kiblat', icon: <Compass className="text-amber-400" />, path: '/qibla', color: 'bg-amber-500/20' },
    { title: 'Tasbih', icon: <PlayCircle className="text-teal-400" />, path: '/tasbih', color: 'bg-teal-500/20' },
    { title: 'Asmaul Husna', icon: <Star className="text-yellow-400" />, path: '/asmaul-husna', color: 'bg-yellow-500/20' },
    { title: 'Doa Harian', icon: <Heart className="text-rose-400" />, path: '/doa', color: 'bg-rose-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Prayer Hero Card */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="glass-card bg-gradient-to-br from-islamic-secondary/80 to-islamic-primary/80 border-islamic-accent/30 overflow-hidden relative"
      >
        <div className="relative z-10">
          <p className="text-islamic-soft font-medium text-sm">Waktu Sholat Berikutnya</p>
          <h2 className="text-4xl font-bold mt-1 text-islamic-gold">
            {nextPrayer ? nextPrayer.name : 'Loading...'}
          </h2>
          <p className="text-xl text-white/90 font-semibold mt-1">
            {nextPrayer ? nextPrayer.time : '--:--'}
          </p>
          <div className="mt-4 flex items-center text-xs text-white/60">
            <Clock size={12} className="mr-1" />
            <span>Jakarta, Indonesia</span>
          </div>
        </div>
        
        {/* Geometric patterns in background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-islamic-accent/10 rounded-full -mr-10 -mt-10 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-islamic-gold/10 rounded-full -ml-10 -mb-10 blur-2xl" />
      </motion.div>

      {/* Main Grid Menu */}
      <div className="grid grid-cols-3 gap-4">
        {menuItems.map((item, idx) => (
          <Link key={idx} to={item.path}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-16 h-16 rounded-2xl glass-card flex items-center justify-center !p-0 ${item.color}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-semibold text-white/70 text-center">{item.title}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Last Read Section */}
      {lastRead && (
        <Link to={`/quran/${lastRead.nomor}`}>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass-card bg-white/5 border-white/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-islamic-accent/20 rounded-xl text-islamic-gold">
                <Book size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Terakhir Dibaca</p>
                <h4 className="font-bold text-white">{lastRead.nama}</h4>
                <p className="text-[10px] text-islamic-soft">Ayat {lastRead.ayat}</p>
              </div>
            </div>
            <ChevronRight className="text-white/20" size={20} />
          </motion.div>
        </Link>
      )}

      {/* Featured Ayat/Quote */}
      <div className="glass-card bg-white/5 border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-islamic-gold">Ayat Hari Ini</h3>
          <ChevronRight size={16} className="text-white/40" />
        </div>
        <p className="font-arabic text-2xl text-center leading-relaxed mb-4 text-white">
          فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ
        </p>
        <p className="text-xs text-white/70 italic text-center">
          "Ingatlah kepada-Ku, Aku pun akan ingat kepadamu. Bersyukurlah kepada-Ku, dan janganlah kamu ingkar kepada-Ku." (QS. Al-Baqarah: 152)
        </p>
      </div>
    </div>
  );
}
