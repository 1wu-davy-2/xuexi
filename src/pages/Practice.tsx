import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { questionsOf, topicsOf } from '../data';
import { stratifiedPick } from '../utils/exam';
import { SUBJECTS, subjectMeta } from '../data/subjects';
import { useStore } from '../store/store';
import { QuestionCard } from '../components/QuestionCard';
import { Badge, Btn, Card, SectionTitle, Segmented } from '../components/ui';
import { Icon } from '../components/icons';
import type { Question, SubjectId } from '../types';

type Phase = 'config' | 'run' | 'done';

export default function Practice() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { attempts, recordAttempt } = useStore();

  if (!subject) return <SubjectPicker />;
  const sid = subject as SubjectId;
  return <PracticeSession key={sid} sid={sid} attempts={attempts} recordAttempt={recordAttempt} navigate={navigate} />;
}

function SubjectPicker() {
  return (
    <div>
      <SectionTitle icon="edit" title="专项练习" desc="选一科开始：按考点、题型、难度筛选，即时判分给解析，答错自动进错题本。" />
      <div className="grid md:grid-cols-3 gap-4">
        {SUBJECTS.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.gradient} text-white flex items-center justify-center font-bold text-lg`}>{m.short}</div>
              <div className="font-bold text-slate-900">{m.name}</div>
            </div>
            <p className="text-sm text-slate-500 mt-3 leading-7">{m.tagline}</p>
            <Link to={`/practice/${m.id}`}>
              <Btn className="w-full mt-4">开始练习</Btn>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PracticeSession({
  sid,
  attempts,
  recordAttempt,
  navigate,
}: {
  sid: SubjectId;
  attempts: Record<string, { correct: boolean; mastered?: boolean }>;
  recordAttempt: (qid: string, correct: boolean, selfRatio?: number) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const meta = subjectMeta(sid);
  const topics = useMemo(() => topicsOf(sid), [sid]);
  const allQs = useMemo(() => questionsOf(sid), [sid]);

  const [selTopics, setSelTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'all' | '1' | '2' | '3'>('all');
  const [onlyReal, setOnlyReal] = useState(false);
  const [onlyWrong, setOnlyWrong] = useState(false);
  const [order, setOrder] = useState<'random' | 'seq'>('random');
  const [count, setCount] = useState<'10' | '20' | 'all'>('20');
  const [phase, setPhase] = useState<Phase>('config');
  const [queue, setQueue] = useState<Question[]>([]);
  const [pos, setPos] = useState(0);
  const [results, setResults] = useState<{ correct: boolean }[]>([]);

  const pool = useMemo(() => {
    return allQs.filter((q) => {
      if (selTopics.length && !selTopics.includes(q.topic)) return false;
      if (difficulty !== 'all' && q.difficulty !== Number(difficulty)) return false;
      if (onlyReal && !q.source?.includes('真题')) return false;
      if (onlyWrong) {
        const a = attempts[q.id];
        if (!a || a.correct || a.mastered) return false;
      }
      return true;
    });
  }, [allQs, selTopics, difficulty, onlyReal, onlyWrong, attempts]);

  function start() {
    let list: Question[];
    if (count === 'all') {
      list = order === 'random' ? shuffle(pool) : pool;
    } else if (order === 'random') {
      list = stratifiedPick(pool, Number(count));
    } else {
      list = pool.slice(0, Number(count));
    }
    if (!list.length) return;
    setQueue(list);
    setPos(0);
    setResults([]);
    setPhase('run');
  }

  function onAnswered(r: { correct: boolean; selfRatio?: number }) {
    const q = queue[pos];
    recordAttempt(q.id, r.correct, r.selfRatio);
    setResults((prev) => [...prev, { correct: r.correct }]);
  }

  const doneCount = results.length;
  const acc = doneCount ? Math.round((results.filter((r) => r.correct).length / doneCount) * 100) : 0;

  if (phase === 'run') {
    const q = queue[pos];
    return (
      <div className="max-w-3xl mx-auto">
        <div className="sticky top-0 lg:top-0 z-20 -mx-2 px-2 pt-2 pb-3 bg-slate-100/90 backdrop-blur rounded-b-2xl">
          <div className="flex items-center gap-3">
            <Btn variant="ghost" size="sm" onClick={() => setPhase('config')}>
              <Icon name="chevronLeft" className="w-4 h-4" /> 退出
            </Btn>
            <div className="flex-1 h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <motion.div className={`h-full bg-gradient-to-r ${meta.gradient}`} animate={{ width: `${((pos + 1) / queue.length) * 100}%` }} transition={{ duration: 0.35 }} />
            </div>
            <span className="text-sm font-bold text-slate-600 whitespace-nowrap">
              {pos + 1} / {queue.length}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
            <span>本轮已答 {doneCount} · 正确率 {acc}%</span>
            <Badge className={meta.chip}>{meta.name}</Badge>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
            <QuestionCard q={q} index={pos + 1} onAnswered={onAnswered} />
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex justify-between">
          <Btn variant="outline" disabled={pos === 0} onClick={() => setPos(pos - 1)}>
            <Icon name="chevronLeft" className="w-4 h-4" /> 上一题
          </Btn>
          {pos < queue.length - 1 ? (
            <Btn onClick={() => setPos(pos + 1)}>下一题 <Icon name="chevronRight" className="w-4 h-4" /></Btn>
          ) : (
            <Btn onClick={() => setPhase('done')}>完成本轮 <Icon name="check" className="w-4 h-4" /></Btn>
          )}
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">提示：主观题点「查看参考答案并自评」，自评 80% 以上算对。</p>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="max-w-lg mx-auto text-center py-10">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
          <div className={`mx-auto w-28 h-28 rounded-full bg-gradient-to-br ${meta.gradient} text-white flex flex-col items-center justify-center shadow-xl`}>
            <span className="text-3xl font-black">{acc}%</span>
            <span className="text-xs opacity-80">正确率</span>
          </div>
        </motion.div>
        <h2 className="text-xl font-bold text-slate-900 mt-5">本轮完成！</h2>
        <p className="text-sm text-slate-500 mt-1">
          共 {doneCount} 题 · 答对 {results.filter((r) => r.correct).length} 题 · 答错的 {results.filter((r) => !r.correct).length} 题已进错题本
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Btn variant="outline" onClick={() => { setOnlyWrong(true); setPhase('config'); }}>只刷错题再来一轮</Btn>
          <Btn onClick={() => { setPhase('config'); setResults([]); setPos(0); }}>继续出新题</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Btn variant="ghost" size="sm" onClick={() => navigate('/practice')}>
          <Icon name="chevronLeft" className="w-4 h-4" /> 换科目
        </Btn>
      </div>
      <SectionTitle icon="edit" title={`${meta.name} · 练习设置`} desc={`题库共 ${allQs.length} 题，当前筛选出 ${pool.length} 题`} />

      <Card className="p-5 space-y-5">
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">考点筛选（不选=全部）</p>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => {
              const on = selTopics.includes(t.topic);
              return (
                <button
                  key={t.topic}
                  onClick={() => setSelTopics(on ? selTopics.filter((x) => x !== t.topic) : [...selTopics, t.topic])}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${on ? 'bg-brand-600 border-brand-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300'}`}
                >
                  {t.topic} <span className={on ? 'text-white/70' : 'text-slate-400'}>{t.count}</span>
                </button>
              );
            })}
            {topics.length === 0 && <span className="text-sm text-slate-400">题库生成中…</span>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">难度</p>
            <Segmented value={difficulty} onChange={setDifficulty} options={[{ value: 'all', label: '全部' }, { value: '1', label: '易' }, { value: '2', label: '中' }, { value: '3', label: '难' }]} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">顺序</p>
            <Segmented value={order} onChange={setOrder} options={[{ value: 'random', label: '随机' }, { value: 'seq', label: '顺序' }]} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">本轮题量</p>
            <Segmented value={count} onChange={setCount} options={[{ value: '10', label: '10 题' }, { value: '20', label: '20 题' }, { value: 'all', label: '全部' }]} />
          </div>
          <div className="flex flex-col gap-2 justify-end">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={onlyReal} onChange={(e) => setOnlyReal(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              只刷真题
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={onlyWrong} onChange={(e) => setOnlyWrong(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              只刷我的错题
            </label>
          </div>
        </div>

        <Btn size="lg" className="w-full" disabled={!pool.length} onClick={start}>
          <Icon name="check" className="w-4 h-4" /> 开始练习（{Math.min(pool.length, count === 'all' ? pool.length : Number(count))} 题）
        </Btn>
        {!pool.length && <p className="text-xs text-rose-500 text-center">当前筛选没有题目，放宽条件试试。</p>}
      </Card>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
