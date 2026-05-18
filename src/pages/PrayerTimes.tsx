import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, MapPinOff, Bell, BellOff, ChevronLeft } from 'lucide-react';
import { prayerService } from '@/src/services/api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function PrayerTimes() {
  const navigate = useNavigate();
  const [timings, setTimings] = useState<any>(null);
  const [location, setLocation] = useState<string>('Jakarta, Indonesia');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          prayerService.getTimingsByLatLng(pos.coords.latitude, pos.coords.longitude)
            .then(data => {
              setTimings(data.timings);
              setLocation('Lokasi Anda Saat Ini');
              setLoading(false);
            })
            .catch(() => fallbackToDefault());
        },
        () => fallbackToDefault()
      );
    } else {
      fallbackToDefault();
    }
  }, []);

  const fallbackToDefault = () => {
    prayerService.getTimings('Jakarta').then(data => {
      setTimings(data.timings);
      setLoading(false);
    }).catch(err => {
      setError('Gagal memuat jadwal sholat');
      setLoading(false);
    });
  };

  const prayers = [
    { name: 'Imsak', key: 'Imsak' },
    { name: 'Subuh', key: 'Fajr' },
    { name: 'Terbit', key: 'Sunrise' },
    { name: 'Dzuhur', key: 'Dhuhr' },
    { name: 'Ashar', key: 'Asr' },
    { name: 'Maghrib', key: 'Maghrib' },
    { name: 'Isya', key: 'Isha' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 glass-button rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Jadwal Sholat</h2>
          <p className="text-islamic-soft text-sm flex items-center gap-1">
            <MapPin size={12} /> {location}
          </p>
        </div>
      </header>

      {/* Date Header */}
      <div className="glass-card text-center bg-gradient-to-r from-islamic-secondary/50 to-islamic-primary/50">
        <p className="text-islamic-gold font-medium mb-1">{format(new Date(), 'EEEE, dd MMMM yyyy')}</p>
        <p className="text-xs text-white/50 tracking-widest uppercase">10 Dzulqa'dah 1445 H</p>
      </div>

      {/* Prayer List */}
      <div className="grid gap-3">
        {prayers.map((prayer, idx) => {
          const isNext = false; // Simple logic could be added here
          return (
            <motion.div
              key={prayer.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card flex items-center justify-between p-4 ${isNext ? 'ring-2 ring-islamic-accent bg-white/20' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isNext ? 'bg-islamic-accent' : 'bg-white/10'}`}>
                  <Clock size={20} className={isNext ? 'text-white' : 'text-islamic-soft'} />
                </div>
                <span className={`font-semibold ${isNext ? 'text-white' : 'text-white/80'}`}>{prayer.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-islamic-gold">{timings[prayer.key]}</span>
                <button className="text-white/30 hover:text-islamic-gold transition-colors">
                  <BellOff size={18} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-6 text-center text-xs text-white/30 italic">
        * Jadwal menggunakan metode Kemenag Indonesia
      </div>
    </div>
  );
}
