import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { Moon, Star, Bell, Settings as SettingsIcon, Home as HomeIcon, BookOpen, Clock, Compass } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="relative min-h-screen bg-islamic-primary overflow-hidden flex flex-col">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-islamic-primary via-islamic-secondary to-islamic-primary opacity-50" />
        
        {/* Animated Moon */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-10 right-10 text-islamic-gold/40"
        >
          <Moon size={120} strokeWidth={1} fill="currentColor" className="animate-float" />
        </motion.div>

        {/* Floating Stars */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.4, 0.1], 
              scale: [0.5, 1, 0.5],
              x: Math.random() * 20 - 10,
              y: Math.random() * 20 - 10
            }}
            transition={{ 
              duration: 3 + Math.random() * 4, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{ 
              top: `${Math.random() * 80}%`, 
              left: `${Math.random() * 100}%` 
            }}
            className="absolute text-islamic-gold/30"
          >
            <Star size={Math.random() * 10 + 5} fill="currentColor" />
          </motion.div>
        ))}

        {/* Mosque Silhouette at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-64 pointer-events-none opacity-30">
           <div className="mosque-dome" />
           <div className="mosque-minaret left-[15%]" />
           <div className="mosque-minaret right-[15%] h-32" />
           <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-islamic-primary via-transparent to-transparent" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Barakah Islami</h1>
          <p className="text-xs text-islamic-soft">Assalamu'alaikum, Akhi/Ukhti</p>
        </div>
        <div className="flex gap-3">
          <button className="glass-button !p-2 rounded-full text-white/80 hover:text-white">
            <Bell size={20} />
          </button>
          <Link to="/settings" className="glass-button !p-2 rounded-full text-white/80 hover:text-white">
            <SettingsIcon size={20} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-6 pb-24 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Navigation (Bottom Bar for Mobile Feel) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="glass-card !p-2 flex justify-around items-center rounded-full !shadow-2xl">
          <NavLink to="/" icon={<HomeIcon size={20} />} label="Home" active={location.pathname === '/'} />
          <NavLink to="/quran" icon={<BookOpen size={20} />} label="Quran" active={location.pathname.startsWith('/quran')} />
          <NavLink to="/prayer" icon={<Clock size={20} />} label="Sholat" active={location.pathname === '/prayer'} />
          <NavLink to="/qibla" icon={<Compass size={20} />} label="Kiblat" active={location.pathname === '/qibla'} />
        </div>
      </nav>
    </div>
  );
}

function NavLink({ to, icon, label, active }: { to: string, icon: any, label: string, active: boolean }) {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center gap-1 p-2 transition-all duration-300 rounded-full",
        active ? "text-islamic-gold bg-white/10 px-4" : "text-white/60 hover:text-white"
      )}
    >
      {icon}
      <span className={cn("text-[10px] font-medium", !active && "hidden")}>{label}</span>
    </Link>
  );
}
