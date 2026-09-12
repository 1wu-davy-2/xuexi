import { HashRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './store/store';
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
import { LearnHome, LearnSubject } from './pages/Learn';
import LessonView from './pages/LessonView';

export default function App() {
  return (
    <StoreProvider>
      <OutputProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
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
            </Route>
          </Routes>
        </HashRouter>
      </OutputProvider>
    </StoreProvider>
  );
}
