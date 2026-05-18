import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import QuranList from './pages/QuranList';
import QuranDetail from './pages/QuranDetail';
import PrayerTimes from './pages/PrayerTimes';
import Qibla from './pages/Qibla';
import DoaList from './pages/DoaList';
import Settings from './pages/Settings';
import Tasbih from './pages/Tasbih';
import AsmaulHusna from './pages/AsmaulHusna';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quran" element={<QuranList />} />
            <Route path="/quran/:id" element={<QuranDetail />} />
            <Route path="/prayer" element={<PrayerTimes />} />
            <Route path="/qibla" element={<Qibla />} />
            <Route path="/doa" element={<DoaList />} />
            <Route path="/tasbih" element={<Tasbih />} />
            <Route path="/asmaul-husna" element={<AsmaulHusna />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback to dashboard */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
