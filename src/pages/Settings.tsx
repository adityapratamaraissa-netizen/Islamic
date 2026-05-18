import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Bell, Volume2, Globe, Shield, ChevronLeft, Moon, Sun, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { notificationService } from '@/src/services/notificationService';

export default function Settings() {
  const navigate = useNavigate();
  const [adhanSound, setAdhanSound] = useState('Makkah');
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('notifications_enabled') === 'true';
  });

  const handleNotificationToggle = async () => {
    if (!notifications) {
      const granted = await notificationService.requestPermission();
      if (granted) {
        setNotifications(true);
        localStorage.setItem('notifications_enabled', 'true');
      } else {
        alert('Izin notifikasi ditolak oleh browser.');
      }
    } else {
      setNotifications(false);
      localStorage.setItem('notifications_enabled', 'false');
    }
  };

  const adhanOptions = ['Makkah', 'Madinah', 'Indonesia', 'Egypt', 'Turkey'];

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 glass-button rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Pengaturan</h2>
          <p className="text-islamic-soft text-sm">Sesuaikan kenyamanan Anda</p>
        </div>
      </header>

      <div className="space-y-4">
        {/* Adhan Sound */}
        <div className="glass-card space-y-4">
          <div className="flex items-center gap-3 text-islamic-gold">
            <Volume2 size={20} />
            <h3 className="font-semibold text-white">Suara Adzan</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {adhanOptions.map(option => (
              <button 
                key={option}
                onClick={() => setAdhanSound(option)}
                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                  adhanSound === option 
                    ? 'bg-islamic-accent text-white' 
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="text-islamic-gold" size={20} />
            <div>
              <h3 className="font-semibold text-white">Notifikasi Sholat</h3>
              <p className="text-[10px] text-white/40">Ingatkan saya sebelum waktu sholat</p>
            </div>
          </div>
          <button 
            onClick={handleNotificationToggle}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-emerald-500' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Other settings */}
        <div className="glass-card space-y-3">
           <SettingItem icon={<Globe size={18} />} label="Bahasa" value="Indonesia" />
           <SettingItem icon={<Moon size={18} />} label="Mode Malam" value="Otomatis" />
           <SettingItem icon={<Shield size={18} />} label="Privasi & Keamanan" />
        </div>

        <div className="text-center py-6">
           <p className="text-xs text-white/20">Barakah Islami v1.0.0</p>
           <p className="text-[10px] text-white/10 mt-1">Made with love for the Ummah</p>
        </div>
      </div>
    </div>
  );
}

function SettingItem({ icon, label, value }: { icon: any, label: string, value?: string }) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
      <div className="flex items-center gap-3 text-white/60 group-hover:text-white">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-islamic-soft text-xs">
        {value && <span>{value}</span>}
        <ChevronRight size={14} />
      </div>
    </div>
  );
}
