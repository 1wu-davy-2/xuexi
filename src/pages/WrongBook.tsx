import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ALL_QUESTIONS, questionById } from '../data';
import { SUBJECTS, subjectMeta } from '../data/subjects';
import { useStore } from '../store/store';
import { QuestionCard } from '../components/QuestionCard';
import { Badge, Btn, Card, Empty, SectionTitle, Segmented } from '../components/ui';
import { Icon } from '../components/icons';
import { useOutput, DocHeader } from '../utils/output';
import type { Question, SubjectId } from '../types';

type Tab = 'all' | SubjectId;
type Filter = 'todo' | 'done' | 'all';

export default function WrongBook() {
  const { attempts, toggleMastered } = useStore();
  const { print, exportPdf, busy } = useOutput();
  const [tab, setTab] = useState<Tab>('all');
  const [filter, setFilter] = useState<Filter>('todo');
  const [redoMode, setRedoMode] = useState(false);
  const [redoIds, setRedoIds] = useState<string[]>([]);
  const [redoPos, setRedoPos] = useState(0);

  const wrongQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter((q) => {
      const a = attempts[q.id];
      if (!a || a.correct) return false;
      if (tab !== 'all' && q.subject !== tab) return false;
      if (filter === 'todo' && a.mastered) return false;
      if (filter === 'done' && !a.mastered) return false;
      return true;
    });
  }, [attempts, tab, filter]);

  const allWrong = useMemo(() => Object.values(attempts).filter((a) => !a.correct).length, [attempts]);
  const mastered = useMemo(() => Object.values(attempts).filter((a) => !a.correct && a.mastered).length, [attempts]);

  const byTopic = useMemo(() => {
    const m = new Map<string, number>();
    for (const q of wrongQuestions) m.set(q.topic, (m.get(q.topic) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [wrongQuestions]);

  function startRedo() {
    setRedoIds(wrongQuestions.map((q) => q.id));
    setRedoPos(0);
    setRedoMode(true);
  }

  if (redoMode) {
    const q = questionById(redoIds[redoPos]);
    if (!q) {
      setRedoMode(false);
      return null;
    }
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <Btn variant="ghost" size="sm" onClick={() => setRedoMode(false)}>
            <Icon name="chevronLeft" className="w-4 h-4" /> 退出重做
          </Btn>
          <div className="flex-1 h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-rose-500 to-orange-400" animate={{ width: `${((redoPos + 1) / redoIds.length) * 100}%` }} />
          </div>
          <span className="text-sm font-bold text-slate-600">{redoPos + 1}/{redoIds.length}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
            <QuestionCard
              q={q}
              index={redoPos + 1}
              onAnswered={(r) => {
                if (r.correct && redoPos < redoIds.length - 1) setTimeout(() => setRedoPos(redoPos + 1), 900);
              }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 flex justify-between">
          <Btn variant="outline" disabled={redoPos === 0} onClick={() => setRedoPos(redoPos - 1)}>
            <Icon name="chevronLeft" className="w-4 h-4" /> 上一题
          </Btn>
          {redoPos < redoIds.length - 1 ? (
            <Btn onClick={() => setRedoPos(redoPos + 1)}>下一题 <Icon name="chevronRight" className="w-4 h-4" /></Btn>
          ) : (
            <Btn onClick={() => setRedoMode(false)}>完成重做 <Icon name="check" className="w-4 h-4" /></Btn>
          )}
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">答对两次的题会自动从错题本「毕业」</p>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle
        icon="layers"
        title="错题本"
        desc="练习、模考答错的题都在这里。重做答对两次自动毕业；支持打印和导出 PDF 随时翻看。"
        right={
          <div className="flex gap-2">
            <Btn variant="outline" size="sm" disabled={!wrongQuestions.length} onClick={() => print(<WrongBookDoc questions={wrongQuestions} tab={tab} />)}>
              <Icon name="printer" className="w-4 h-4" /> 打印
            </Btn>
            <Btn variant="outline" size="sm" disabled={!wrongQuestions.length || busy} onClick={() => exportPdf(<WrongBookDoc questions={wrongQuestions} tab={tab} />, `错题本-${tab === 'all' ? '全部' : subjectMeta(tab).name}.pdf`)}>
              <Icon name="download" className="w-4 h-4" /> 导出 PDF
            </Btn>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <Card className="p-4 text-center">
          <div className="text-2xl font-black text-rose-500">{allWrong}</div>
          <div className="text-xs text-slate-400 mt-1">累计错题</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-black text-brand-600">{wrongQuestions.length}</div>
          <div className="text-xs text-slate-400 mt-1">当前列表</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-black text-emerald-500">{mastered}</div>
          <div className="text-xs text-slate-400 mt-1">已掌握毕业</div>
        </Card>
      </div>

      {byTopic.length > 0 && (
        <Card className="p-4 mb-5">
          <p className="text-xs font-bold text-slate-500 mb-2">错题集中营（薄弱考点 TOP8）</p>
          <div className="flex flex-wrap gap-1.5">
            {byTopic.map(([t, c]) => (
              <Badge key={t} className="bg-rose-50 text-rose-600 border border-rose-100">
                {t} ×{c}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Segmented value={tab} onChange={setTab} options={[{ value: 'all', label: '全部' }, ...SUBJECTS.map((s) => ({ value: s.id as Tab, label: s.name }))]} />
        <Segmented value={filter} onChange={setFilter} options={[{ value: 'todo', label: '待攻克' }, { value: 'done', label: '已掌握' }, { value: 'all', label: '全部' }]} />
        <Btn className="ml-auto" disabled={!wrongQuestions.length} onClick={startRedo}>
          <Icon name="refresh" className="w-4 h-4" /> 重做本轮（{wrongQuestions.length} 题）
        </Btn>
      </div>

      {wrongQuestions.length ? (
        <div className="space-y-4 max-w-3xl">
          {wrongQuestions.map((q) => {
            const a = attempts[q.id];
            return (
              <motion.div key={q.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="relative">
                  <QuestionCard q={q} revealInitially />
                  <div className="flex items-center justify-between mt-1.5 px-1">
                    <span className="text-xs text-slate-400">
                      错了 {a?.wrongCount ?? 1} 次 · {a?.lastAt ? new Date(a.lastAt).toLocaleDateString('zh-CN') : ''}
                    </span>
                    <button
                      onClick={() => toggleMastered(q.id)}
                      className={`text-xs font-medium rounded-full px-3 py-1.5 transition ${a?.mastered ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                    >
                      <Icon name="check" className="w-3 h-3 inline mr-1" strokeWidth={3} />
                      {a?.mastered ? '已掌握（点此退回）' : '标记为已掌握'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Empty
          icon={filter === 'todo' ? 'check' : 'layers'}
          title={filter === 'done' ? '还没有毕业的错题' : '错题本是空的，太棒了！'}
          desc={filter === 'done' ? '去攻克待攻克的错题，答对两次就会出现在这里。' : '去练习或模考里刷题，答错的题会自动出现在这里。'}
        />
      )}
    </div>
  );
}

function WrongBookDoc({ questions, tab }: { questions: Question[]; tab: Tab }) {
  const title = tab === 'all' ? '错题本（全部科目）' : `${subjectMeta(tab).name}错题本`;
  let n = 0;
  return (
    <div className="print-doc">
      <DocHeader title={title} sub={`共 ${questions.length} 题 · 重做答对两次自动毕业`} />
      {questions.map((q) => {
        n++;
        const meta = subjectMeta(q.subject);
        return (
          <div className="q-item" key={q.id}>
            <div className="q-stem">
              {n}. [{meta.name}·{q.section}·{q.topic}] {q.stem}
            </div>
            {q.options?.map((o, oi) => (
              <div className="q-opt" key={oi}>
                {'ABCDEF'[oi]}. {o}
              </div>
            ))}
            <div className="q-ans">正确答案：{q.type === 'single' ? q.answer : q.answer}</div>
            <div className="q-ana">解析：{q.analysis}</div>
            {q.tip && <div className="q-ana">提示：{q.tip}</div>}
          </div>
        );
      })}
    </div>
  );
}
