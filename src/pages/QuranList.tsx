import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { quranService, type Surah } from '@/src/services/api';

export default function QuranList() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quranService.getSurahs().then(data => {
      setSurahs(data);
      setLoading(false);
    });
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
    s.arti.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-white">Al-Qur’an</h2>
        <p className="text-islamic-soft text-sm">Baca dan resapi kalam Ilahi</p>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <input 
          type="text" 
          placeholder="Cari surah..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full glass-card !p-4 !pl-12 !rounded-2xl outline-none focus:ring-2 ring-islamic-accent/50 transition-all text-white placeholder:text-white/30"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-gold"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredSurahs.map((surah) => (
              <motion.div
                key={surah.nomor}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/quran/${surah.nomor}`}>
                  <div className="glass-card flex items-center justify-between hover:bg-white/15 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <Hash className="text-islamic-gold/20" size={40} />
                        <span className="absolute text-xs font-bold text-islamic-gold">{surah.nomor}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-islamic-gold transition-colors">
                          {surah.namaLatin}
                        </h3>
                        <p className="text-xs text-white/50">{surah.arti} • {surah.jumlahAyat} Ayat</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-arabic text-xl text-islamic-gold">{surah.nama}</span>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">{surah.tempatTurun}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
