import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Ism {
  index: string;
  latin: string;
  arabic: string;
  translation_id: string;
}

export default function AsmaulHusna() {
  const navigate = useNavigate();
  const [names, setNames] = useState<Ism[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('https://islamic-api-zhirrr.vercel.app/api/asmaulhusna')
      .then(res => res.json())
      .then(json => {
        setNames(json.data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback or handle error
        setLoading(false);
      });
  }, []);

  const filteredNames = names.filter(n => 
    n.latin.toLowerCase().includes(search.toLowerCase()) ||
    n.translation_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 glass-button rounded-full text-white">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Asmaul Husna</h2>
          <p className="text-islamic-soft text-sm">99 Nama Indah Allah SWT</p>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <input 
          type="text" 
          placeholder="Cari nama..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full glass-card !p-4 !pl-12 !rounded-2xl outline-none text-white"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-gold"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredNames.map((name, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.01 }}
              className="glass-card flex flex-col items-center text-center gap-3 p-6 group hover:bg-white/15 transition-all"
            >
              <div className="relative mb-2">
                <Star className="text-islamic-gold/20" size={48} fill="currentColor" />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-islamic-gold">
                  {name.index}
                </span>
              </div>
              <h3 className="font-arabic text-3xl text-white group-hover:text-islamic-gold transition-colors">{name.arabic}</h3>
              <div>
                <p className="font-bold text-sm text-islamic-accent">{name.latin}</p>
                <p className="text-[10px] text-white/50 leading-tight mt-1">{name.translation_id}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
