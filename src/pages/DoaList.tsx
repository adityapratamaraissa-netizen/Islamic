import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doaService, type Doa } from '@/src/services/api';

export default function DoaList() {
  const navigate = useNavigate();
  const [doas, setDoas] = useState<Doa[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDoa, setSelectedDoa] = useState<Doa | null>(null);

  useEffect(() => {
    doaService.getDoas().then(data => {
      setDoas(data);
      setLoading(false);
    });
  }, []);

  const filteredDoas = doas.filter(d => 
    d.doa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 glass-button rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Doa Harian</h2>
          <p className="text-islamic-soft text-sm">Amalan doa sehari-hari</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <input 
          type="text" 
          placeholder="Cari doa..." 
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
        <div className="grid gap-3">
          {filteredDoas.map((doa, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedDoa(doa)}
            >
              <div className="glass-card flex items-center justify-between hover:bg-white/15 transition-all group cursor-pointer">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                    <Heart size={18} />
                  </div>
                  <h3 className="font-medium text-white/90 group-hover:text-islamic-gold transition-colors">
                    {doa.doa}
                  </h3>
                </div>
                <ChevronRight size={18} className="text-white/20" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Doa Modal/Detail Overlay */}
      <AnimatePresence>
        {selectedDoa && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedDoa(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-lg w-full !bg-islamic-primary/90 space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-islamic-gold">{selectedDoa.doa}</h3>
                <button onClick={() => setSelectedDoa(null)} className="text-white/40 hover:text-white">
                   &times;
                </button>
              </div>
              
              <p className="font-arabic text-3xl text-right leading-relaxed text-white">
                {selectedDoa.ayat}
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-islamic-soft italic">{selectedDoa.latin}</p>
                <div className="h-px w-full bg-white/5" />
                <p className="text-sm text-white/80 leading-relaxed font-light">
                  <span className="font-bold text-white">Artinya: </span>
                  {selectedDoa.artinya}
                </p>
              </div>

              <button 
                onClick={() => setSelectedDoa(null)}
                className="w-full glass-button mt-4 bg-islamic-accent/20 border-islamic-accent/30 text-islamic-gold"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
