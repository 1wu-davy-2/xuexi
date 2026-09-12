import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SUBJECTS, subjectMeta } from '../data/subjects';
import { buildPaper, flattenPaper, type Paper } from '../utils/exam';
import { useStore } from '../store/store';
import { QuestionCard, SELF_OPTIONS } from '../components/QuestionCard';
import { Badge, Btn, Card, ProgressRing, SectionTitle } from '../components/ui';
import { Icon } from '../components/icons';
import { checkBlank } from '../utils/render';
import { useOutput, DocHeader } from '../utils/output';
import type { Question, SubjectId } from '../types';

type Phase = 'setup' | 'run' | 'selfgrade' | 'result';

const DURATION_SEC = 150 * 60;

export default function Exam() {
  const navigate = useNavigate();
  const { saveExam, recordAttempt, settings, exams } = useStore();
  const { print, exportPdf, busy } = useOutput();

  const [phase, setPhase] = useState<Phase>('setup');
  const [paper, setPaper] = useState<Paper | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selfScores, setSelfScores] = useState<Record<string, number>>({});
  const [cur, setCur] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_SEC);
  const [sheetOpen, setSheetOpen] = useState(false);
  const submittedRef = useRef(false);

  const questions = useMemo(() => (paper ? flattenPaper(paper) : []), [paper]);
  const subjectiveQs = useMemo(() => (paper ? flattenPaper(paper).filter((q) => q.type === 'subjective') : []), [paper]);

  // 计时
  useEffect(() => {
    if (phase !== 'run') return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          doSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  const timeWarn = timeLeft < 10 * 60;

  function start(subject: SubjectId) {
    const p = buildPaper(subject);
    if (!flattenPaper(p).length) {
      alert('本科目题库还在生成中，请稍后再试。');
      return;
    }
    setPaper(p);
    setAnswers({});
    setSelfScores({});
    setCur(0);
    setTimeLeft(DURATION_SEC);
    submittedRef.current = false;
    setPhase('run');
    window.scrollTo({ top: 0 });
  }

  function doSubmit() {
    if (submittedRef.current || !paper) return;
    submittedRef.current = true;
    if (subjectiveQs.length) setPhase('selfgrade');
    else finalize();
  }

  /** 自评全部完成后结算 */
  function finalize() {
    if (!paper) return;
    const qs = flattenPaper(paper);
    let scored = 0;
    const wrongIds: string[] = [];
    for (const q of qs) {
      if (q.type === 'subjective') {
        const ratio = selfScores[q.id] ?? 0;
        const got = Math.round(ratio * q.score);
        scored += got;
        const correct = ratio >= 0.8;
        recordAttempt(q.id, correct, ratio);
        if (!correct) wrongIds.push(q.id);
      } else if (q.type === 'single') {
        const correct = answers[q.id] === q.answer.trim().toUpperCase();
        if (correct) scored += q.score;
        recordAttempt(q.id, correct);
        if (!correct) wrongIds.push(q.id);
      } else {
        const correct = checkBlank(answers[q.id] ?? '', q.answer);
        if (correct) scored += q.score;
        recordAttempt(q.id, correct);
        if (!correct) wrongIds.push(q.id);
      }
    }
    const full = qs.reduce((s, q) => s + q.score, 0);
    saveExam({
      id: `${paper.subject}-${Date.now()}`,
      subject: paper.subject,
      date: Date.now(),
      full,
      scored,
      durationSec: DURATION_SEC - timeLeft,
      wrongIds,
    });
    setPhase('result');
    window.scrollTo({ top: 0 });
  }

  const answeredCount = questions.filter((q) => (answers[q.id] ?? '').trim() !== '').length;
  const meta = paper ? subjectMeta(paper.subject) : SUBJECTS[0];

  /* ---------- 组卷设置 ---------- */
  if (phase === 'setup') {
    return (
      <div>
        <SectionTitle icon="clock" title="模拟考试" desc="按现行真实试卷结构智能组卷（历年真题 + 配套题），150 分钟计时，交卷后主观题对照参考答案自评。" />
        <div className="grid md:grid-cols-3 gap-4">
          {SUBJECTS.map((m) => (
            <Card key={m.id} className="p-5">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.gradient} text-white flex items-center justify-center font-bold text-lg`}>{m.short}</div>
                <div>
                  <div className="font-bold text-slate-900">{m.name}</div>
                  <div className="text-xs text-slate-400">{m.minutes} 分钟 · 满分 {m.total}</div>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-3 leading-7">{m.paper}</p>
              <Btn className="w-full mt-4" onClick={() => start(m.id)}>
                <Icon name="check" className="w-4 h-4" /> 开始 {m.name} 模考
              </Btn>
            </Card>
          ))}
        </div>
        <Card className="p-5 mt-6">
          <p className="text-sm text-slate-600 leading-7">
            <b>模考须知：</b>① 组卷来自题库（含 2019–2025 年真题），结构对照真实试卷，题库不足的部分按实际题量组卷；② 考试中请勿刷新页面；③ 主观题先作答，交卷后系统带你逐题对照参考答案自评；④ 成绩自动记录到首页，错题自动进错题本。
          </p>
        </Card>
      </div>
    );
  }

  /* ---------- 考试进行 ---------- */
  if (phase === 'run' && paper) {
    const q = questions[cur];
    return (
      <div className="max-w-3xl mx-auto">
        <div className="sticky top-0 z-20 -mx-2 px-3 pt-2 pb-3 bg-slate-100/95 backdrop-blur rounded-b-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <Badge className={`${meta.chip} font-bold`}>{meta.name} 模考</Badge>
            <span className={`font-mono font-bold text-lg tabular-nums ${timeWarn ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`}>
              {mm}:{ss}
            </span>
            <span className="text-xs text-slate-400">已答 {answeredCount}/{questions.length}</span>
            <Btn size="sm" variant="ghost" className="ml-auto" onClick={() => setSheetOpen(!sheetOpen)}>
              <Icon name="grid" className="w-4 h-4" /> 答题卡
            </Btn>
            <Btn size="sm" onClick={doSubmit}>交卷</Btn>
          </div>
          <AnimatePresence>
            {sheetOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {questions.map((qq, i) => {
                    const done = (answers[qq.id] ?? '').trim() !== '';
                    return (
                      <button
                        key={qq.id}
                        onClick={() => {
                          setCur(i);
                          setSheetOpen(false);
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition ${i === cur ? 'ring-2 ring-brand-500' : ''} ${done ? 'bg-brand-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.18 }}>
            <QuestionCard
              q={q}
              index={cur + 1}
              mode="exam"
              initialAnswer={answers[q.id]}
              onSelect={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
            />
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex justify-between">
          <Btn variant="outline" disabled={cur === 0} onClick={() => setCur(cur - 1)}>
            <Icon name="chevronLeft" className="w-4 h-4" /> 上一题
          </Btn>
          {cur < questions.length - 1 ? (
            <Btn onClick={() => setCur(cur + 1)}>下一题 <Icon name="chevronRight" className="w-4 h-4" /></Btn>
          ) : (
            <Btn onClick={doSubmit}>交卷 <Icon name="check" className="w-4 h-4" /></Btn>
          )}
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">考试期间请勿刷新页面 · 到时自动交卷</p>
      </div>
    );
  }

  /* ---------- 主观题自评 ---------- */
  if (phase === 'selfgrade' && paper) {
    return <SelfGrade questions={subjectiveQs} userTexts={answers} selfScores={selfScores} onScore={(qid, ratio) => setSelfScores((p) => ({ ...p, [qid]: ratio }))} onDone={finalize} />;
  }

  /* ---------- 成绩 ---------- */
  if (phase === 'result' && paper) {
    const qs = flattenPaper(paper);
    const lastExam = exams.find((e) => e.subject === paper.subject);
    const scored = lastExam?.scored ?? 0;
    const full = lastExam?.full ?? qs.reduce((s, q) => s + q.score, 0);
    const pct = Math.round((scored / full) * 100);
    const passLine = Math.round(165 / 3);
    return (
      <div>
        <div className="text-center py-6">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}>
            <ProgressRing value={pct} size={140} stroke={12} color={scored >= passLine ? '#10b981' : '#e11d48'} label={<span className="text-lg">{scored} 分</span>} />
          </motion.div>
          <h2 className="text-2xl font-black text-slate-900 mt-4">
            {meta.name} · {scored >= full * 0.4 ? '成绩不错，保持！' : '找到弱点就是收获'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            满分 {full} · 单科过线参考 {passLine} 分 · 用时 {Math.round((DURATION_SEC - timeLeft) / 60)} 分钟
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            <Btn variant="outline" onClick={() => print(<ExamResultDoc paper={paper} answers={answers} selfScores={selfScores} scored={scored} full={full} name={settings.name} />)}>
              <Icon name="printer" className="w-4 h-4" /> 打印
            </Btn>
            <Btn variant="outline" disabled={busy} onClick={() => exportPdf(<ExamResultDoc paper={paper} answers={answers} selfScores={selfScores} scored={scored} full={full} name={settings.name} />, `${meta.name}-模考成绩单.pdf`)}>
              <Icon name="download" className="w-4 h-4" /> 导出 PDF
            </Btn>
            <Btn variant="soft" onClick={() => start(paper.subject)}>再来一套</Btn>
            <Btn variant="ghost" onClick={() => navigate('/wrong')}>去错题本 <Icon name="chevronRight" className="w-4 h-4" /></Btn>
          </div>
        </div>

        {/* 分块得分 */}
        <Card className="p-5 mb-5">
          <h3 className="font-bold text-slate-800 mb-3">各部分情况</h3>
          <div className="space-y-2.5">
            {paper.sections.map((sec) => {
              const got = sec.questions.reduce((s, q) => {
                if (q.type === 'subjective') return s + Math.round((selfScores[q.id] ?? 0) * q.score);
                if (q.type === 'single') return s + (answers[q.id] === q.answer.trim().toUpperCase() ? q.score : 0);
                return s + (checkBlank(answers[q.id] ?? '', q.answer) ? q.score : 0);
              }, 0);
              const fullS = sec.questions.reduce((s, q) => s + q.score, 0);
              return (
                <div key={sec.name} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-24">{sec.name}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div className={`h-full bg-gradient-to-r ${meta.gradient}`} initial={{ width: 0 }} animate={{ width: `${(got / fullS) * 100}%` }} transition={{ duration: 0.7 }} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 tabular-nums">{got}/{fullS}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 逐题回顾 */}
        <h3 className="font-bold text-slate-800 mb-3">逐题回顾（答错的已自动进错题本）</h3>
        <div className="space-y-4">
          {qs.map((q, i) => {
            const correct = q.type === 'subjective' ? (selfScores[q.id] ?? 0) >= 0.8 : q.type === 'single' ? answers[q.id] === q.answer.trim().toUpperCase() : checkBlank(answers[q.id] ?? '', q.answer);
            return <QuestionCard key={q.id} q={q} index={i + 1} mode="review" initialAnswer={answers[q.id]} />;
          })}
        </div>
      </div>
    );
  }

  return null;
}

/* ---------- 主观题自评流程 ---------- */
function SelfGrade({
  questions,
  userTexts,
  selfScores,
  onScore,
  onDone,
}: {
  questions: Question[];
  userTexts: Record<string, string>;
  selfScores: Record<string, number>;
  onScore: (qid: string, ratio: number) => void;
  onDone: () => void;
}) {
  const [i, setI] = useState(0);
  const q = questions[i];
  const scored = questions.filter((qq) => selfScores[qq.id] != null).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-5">
        <h2 className="text-xl font-black text-slate-900">主观题自评</h2>
        <p className="text-sm text-slate-500 mt-1">对照参考答案，诚实地给自己打分——自评越准，预估分越准（{scored}/{questions.length}）</p>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          <Card className="p-6">
            <Badge className="bg-violet-100 text-violet-700">{q.section} · {q.score} 分</Badge>
            <div className="mt-3 text-[15px] leading-8 text-slate-800 font-medium whitespace-pre-wrap">{q.stem}</div>
            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
              <p className="text-xs font-bold text-slate-400 mb-1.5">你的作答</p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-7">{userTexts[q.id] || '（未作答）'}</p>
            </div>
            <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
              <p className="text-xs font-bold text-emerald-600 mb-1.5">参考答案 / 评分要点</p>
              <p className="text-sm text-emerald-900 whitespace-pre-wrap leading-7">{q.answer}</p>
              {q.analysis && <p className="text-xs text-emerald-700 mt-2 leading-6">{q.analysis}</p>}
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-400 mb-2">我拿到了这题的分值的：</p>
              <div className="flex flex-wrap gap-2">
                {SELF_OPTIONS.map((s) => (
                  <button
                    key={s.ratio}
                    onClick={() => {
                      onScore(q.id, s.ratio);
                      if (i < questions.length - 1) setI(i + 1);
                    }}
                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${s.cls} ${selfScores[q.id] === s.ratio ? 'ring-2 ring-offset-1 ring-brand-400' : ''}`}
                  >
                    {s.label}（{Math.round(s.ratio * q.score)} 分）
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 flex justify-between">
        <Btn variant="outline" disabled={i === 0} onClick={() => setI(i - 1)}>
          <Icon name="chevronLeft" className="w-4 h-4" /> 上一题
        </Btn>
        <Btn disabled={scored < questions.length} onClick={onDone}>
          完成自评，出成绩 <Icon name="check" className="w-4 h-4" />
        </Btn>
      </div>
    </div>
  );
}

/* ---------- 成绩单打印文档 ---------- */
function ExamResultDoc({ paper, answers, selfScores, scored, full, name }: { paper: Paper; answers: Record<string, string>; selfScores: Record<string, number>; scored: number; full: number; name: string }) {
  const meta = subjectMeta(paper.subject);
  return (
    <div className="print-doc">
      <DocHeader title={`${meta.name} 模拟考试成绩单`} sub={`${name || '考生'} · 满分 ${full} · 得分 ${scored}`} />
      <table>
        <tbody>
          <tr>
            <th style={{ width: '25%' }}>考试科目</th>
            <td>{meta.name}（{meta.paper}）</td>
          </tr>
          <tr>
            <th>成绩</th>
            <td>{scored} / {full}（{Math.round((scored / full) * 100)}%）· 目标线 {Math.round(165 / 3)} 分</td>
          </tr>
          <tr>
            <th>考试时间</th>
            <td>{new Date().toLocaleString('zh-CN')}</td>
          </tr>
        </tbody>
      </table>
      {paper.sections.map((sec, si) => (
        <div key={sec.name}>
          <h2>{'一二三四五六'[si] || si + 1}、{sec.name}</h2>
          {sec.questions.map((q, qi) => {
            const userAns = answers[q.id] ?? '';
            const correct =
              q.type === 'subjective'
                ? null
                : q.type === 'single'
                  ? userAns === q.answer.trim().toUpperCase()
                  : checkBlank(userAns, q.answer);
            return (
              <div className="q-item" key={q.id}>
                <div className="q-stem">
                  {qi + 1}. {q.stem} <span style={{ color: '#888' }}>[{q.score}分]</span>
                </div>
                {q.options?.map((o, oi) => (
                  <div className="q-opt" key={oi}>
                    {'ABCDEF'[oi]}. {o}
                  </div>
                ))}
                {q.type !== 'subjective' && (
                  <div className="q-ans">
                    你的答案：{userAns || '未作答'} · 正确答案：{q.answer} · {correct ? '√' : '×'}
                  </div>
                )}
                {q.type === 'subjective' && (
                  <div className="q-ans">
                    你的作答：{userAns || '未作答'}（自评 {Math.round((selfScores[q.id] ?? 0) * q.score)} / {q.score} 分）
                  </div>
                )}
                {q.type === 'subjective' && <div className="q-ana">参考答案：{q.answer}</div>}
                <div className="q-ana">解析：{q.analysis}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
