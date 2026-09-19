import { HashRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider, useStore } from './store/store';
import { OutputProvider } from './utils/output';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Plan from './pages/Plan';
import Practice from './pages/Practice';
import Exam from './pages/Exam';
import WrongBook from './pages/WrongBook';
import Cards from './pages/Cards';
import Guide from './pages/Guide';
import Strategy from './pages/Strategy';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { LearnHome, LearnSubject } from './pages/Learn';

function Splash() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-100">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-brand-200 animate-floaty">考</div>
      <div className="w-6 h-6 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" style={{ borderWidth: 3 }} />
    </div>
  );
}

function Gate() {
  const { phase } = useStore();
  if (phase === 'boot') return <Splash />;
  if (phase === 'anon') return <Login />;
  return (
    <Layout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/learn" element={<LearnHome />} />
        <Route path="/learn/:subject" element={<LearnSubject />} />
        <Route path="/lesson/:subject/:lessonId" element={<LessonView />} />
        <Route path="/practice/:subject?" element={<Practice />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/wrong" element={<WrongBook />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/strategy" element={<Strategy />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
}

import LessonView from './pages/LessonView';

export default function App() {
  return (
    <StoreProvider>
      <OutputProvider>
        <HashRouter>
          <Gate />
        </HashRouter>
      </OutputProvider>
    </StoreProvider>
  );
}
