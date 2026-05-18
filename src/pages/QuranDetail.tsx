import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Play, Pause, Bookmark, Maximize2, Minimize2, Settings2 } from 'lucide-react';
import { quranService, type SurahDetail, type Ayat } from '@/src/services/api';
import { cn } from '@/src/lib/utils';

export default function QuranDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (id) {
      quranService.getSurah(parseInt(id)).then(data => {
        setSurah(data);
        setLoading(false);
        // Save to last read
        localStorage.setItem('last_read', JSON.stringify({
          nomor: data.nomor,
          nama: data.namaLatin,
          ayat: 1 // Default to start
        }));
      });
    }
  }, [id]);

  const toggleAudio = (ayat: Ayat) => {
    if (playingId === ayat.nomorAyat) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audioUrl = Object.values(ayat.audio)[0];
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setPlayingId(ayat.nomorAyat);
      audioRef.current.onended = () => setPlayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-gold"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 pb-20", focusMode && "fixed inset-0 z-[100] bg-islamic-primary p-6 overflow-y-auto pb-32")}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 glass-button rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{surah?.namaLatin}</h2>
          <p className="text-xs text-islamic-soft">{surah?.arti}</p>
        </div>
        <button 
          onClick={() => setFocusMode(!focusMode)} 
          className={cn("p-2 glass-button rounded-full", focusMode && "bg-islamic-accent text-white")}
        >
          {focusMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      {/* Surah Banner */}
      {!focusMode && surah && (
        <div className="glass-card bg-gradient-to-br from-islamic-secondary to-islamic-primary text-center relative overflow-hidden">
          <div className="relative z-10 py-4">
             <h3 className="font-arabic text-4xl text-islamic-gold mb-2">{surah.nama}</h3>
             <div className="w-24 h-px bg-islamic-gold/30 mx-auto mb-4" />
             <p className="text-sm font-medium">{surah.tempatTurun} • {surah.jumlahAyat} AYAT</p>
             {surah.nomor !== 1 && surah.nomor !== 9 && (
               <p className="font-arabic text-2xl mt-8 opacity-80">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
             )}
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
        </div>
      )}

      {/* Ayat List */}
      <div className="space-y-8 mt-8">
        {surah?.ayat.map((ayat, idx) => (
          <motion.div 
            key={ayat.nomorAyat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group"
          >
            <div className="glass-card !bg-white/5 !border-white/5 space-y-6">
              {/* Ayat Actions */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="h-8 w-8 rounded-full bg-islamic-accent/20 flex items-center justify-center text-xs font-bold text-islamic-gold">
                  {ayat.nomorAyat}
                </div>
                <div className="flex gap-2">
                  <button className="p-2 transition-colors hover:text-islamic-gold">
                    <Bookmark size={18} />
                  </button>
                  <button 
                    onClick={() => toggleAudio(ayat)}
                    className="p-2 transition-colors hover:text-islamic-gold"
                  >
                    {playingId === ayat.nomorAyat ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <p className="font-arabic text-3xl text-right leading-[2.5] text-white">
                {ayat.teksArab}
              </p>

              {/* Translation */}
              <div className="space-y-2">
                <p className="text-sm text-islamic-soft italic leading-relaxed">{ayat.teksLatin}</p>
                <div className="h-px w-10 bg-white/10" />
                <p className="text-sm text-white/80 leading-relaxed font-light">{ayat.teksIndonesia}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
