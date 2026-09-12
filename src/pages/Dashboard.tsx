import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/store';
import { ALL_LESSONS, ALL_QUESTIONS } from '../data';
import { SUBJECTS, TARGET_SPLIT, subjectMeta } from '../data/subjects';
import { PLAN_WEEKS, planPosition } from '../data/plan';
import { Card, SectionTitle, ProgressRing, Badge, Btn, Stat } from '../components/ui';
import { Icon } from '../components/icons';
import type { SubjectId } from '../types';

const DEFAULT_SELF_RATIO: Record<SubjectId, number> = { politics: 0.5, english: 0.45, math: 0.3 };

export default function Dashboard() {
  const { settings, readLessons, attempts, exams, planDone, togglePlanItem } = useStore();

  const daysLeft = useMemo(() => {
    const exam = new Date(settings.examDate + 'T09:00:00');
    return Math.ceil((exam.getTime() - Date.now()) / 86400000);
  }, [settings.examDate]);

  const perSubject = useMemo(
    () =>
      SUBJECTS.map((meta) => {
        const lessons = ALL_LESSONS.filter((l) => l.subject === meta.id);
        const qs = ALL_QUESTIONS.filter((q) => q.subject === meta.id);
        const qIds = new Set(qs.map((q) => q.id));
        const recs = Object.values(attempts).filter((a) => qIds.has(a.qid));
        const attempted = recs.filter((a) => a.lastAt > 0);
        const objIds = new Set(qs.filter((q) => q.type !== 'subjective').map((q) => q.id));
        const objRecs = attempted.filter((a) => objIds.has(a.qid));
        const objAcc = objRecs.length ? objRecs.filter((r) => r.correct).length / objRecs.length : 0;
        const subjRecs = attempted.filter((a) => !objIds.has(a.qid));
        const subjRatio = subjRecs.length ? subjRecs.reduce((s, r) => s + (r.lastSelfRatio ?? 0), 0) / subjRecs.length : DEFAULT_SELF_RATIO[meta.id];
        const estimate = Math.round(meta.objectivePoints * objAcc + meta.subjectivePoints * subjRatio);
        const wrong = recs.filter((r) => !r.correct && !r.mastered).length;
        return {
          meta,
          lessonTotal: lessons.length,
          lessonRead: lessons.filter((l) => readLessons.includes(l.id)).length,
          attempted: attempted.length,
          objAcc,
          estimate,
          wrong,
        };
      }),
    [attempts, readLessons],
  );

  const totalEstimate = perSubject.reduce((s, p) => s + p.estimate, 0);
  const totalQ = perSubject.reduce((s, p) => s + p.attempted, 0);
  const wrongTotal = perSubject.reduce((s, p) => s + p.wrong, 0);

  const pos = planPosition();
  const week = PLAN_WEEKS.find((w) => w.n === pos.week);
  const todayTasks = week?.days[pos.day]?.tasks ?? [];
  const taskKey = (i: number) => `w${pos.week}d${pos.day}t${i}`;
  const doneCount = todayTasks.filter((_, i) => planDone[taskKey(i)]).length;

  const hour = new Date().getHours();
  const greet = hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

  return (
    <div className="space-y-7">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 text-white px-6 sm:px-9 py-8 shadow-xl shadow-brand-200">
        <div className="absolute -right-10 -top-14 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-24 top-24 w-24 h-24 rounded-full bg-fuchsia-400/20 blur-xl" />
        <div className="relative flex flex-wrap items-center gap-8">
          <div className="flex-1 min-w-[240px]">
            <p className="text-white/70 text-sm">{greet}{settings.name ? `，${settings.name}` : ''}！冲刺已经开始</p>
            <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-wide">
              距离江苏成考还有{' '}
              <motion.span key={daysLeft} initial={{ scale: 1.4, color: '#fde047' }} animate={{ scale: 1, color: '#ffffff' }} className="inline-block text-4xl">
                {daysLeft > 0 ? daysLeft : 0}
              </motion.span>{' '}
              天
            </h1>
            <p className="text-white/70 text-sm mt-2">
              考试时间：{settings.examDate} 前后两日 · 政治、英语、高等数学（一）· 总分 450（以准考证为准）
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-amber-400/90 text-amber-950 font-semibold">目标 150~180 分稳妥过线</Badge>
              <Badge className="bg-white/15 text-white">年满 25 周岁投档加 20 分</Badge>
              <Badge className="bg-white/15 text-white">不看单科线，看总分</Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/plan">
              <Btn variant="soft" className="!bg-white/15 !text-white backdrop-blur hover:!bg-white/25">
                <Icon name="calendar" className="w-4 h-4" /> 今日任务
              </Btn>
            </Link>
            <Link to="/exam">
              <Btn className="!bg-white !text-brand-700 hover:!bg-white/90 shadow-lg">
                <Icon name="clock" className="w-4 h-4" /> 来一场模考
              </Btn>
            </Link>
          </div>
        </div>
      </div>

      {/* 关键数字 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Stat label="三科预估总分" value={totalEstimate} sub={`目标 150~180 · 达成率 ${Math.min(999, Math.round((totalEstimate / 165) * 100))}%`} tone={totalEstimate >= 150 ? 'text-emerald-600' : 'text-brand-600'} />
        <Stat label="已学课件" value={`${perSubject.reduce((s, p) => s + p.lessonRead, 0)} / ${ALL_LESSONS.length}`} sub="按课程学习逐节打勾" tone="text-slate-800" />
        <Stat label="累计刷题" value={totalQ} sub="练习 + 模考自动记录" tone="text-slate-800" />
        <Stat label="待攻克错题" value={wrongTotal} sub="答对两次自动移出错题本" tone={wrongTotal > 0 ? 'text-rose-500' : 'text-emerald-600'} />
      </div>

      {/* 今日任务 */}
      <Card className="p-5">
        <SectionTitle
          icon="calendar"
          title={`今日任务 · 第 ${pos.week} 周第 ${pos.day + 1} 天`}
          desc={week ? week.focus : '冲刺计划生成中'}
          right={
            <Link to="/plan" className="text-sm text-brand-600 hover:underline flex items-center gap-0.5">
              完整计划 <Icon name="chevronRight" className="w-4 h-4" />
            </Link>
          }
        />
        {todayTasks.length ? (
          <div className="space-y-2">
            {todayTasks.map((t, i) => {
              const done = !!planDone[taskKey(i)];
              return (
                <button
                  key={i}
                  onClick={() => togglePlanItem(taskKey(i))}
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${done ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-100 bg-slate-50/60 hover:border-brand-200'}`}
                >
                  <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {done && <Icon name="check" className="w-3 h-3 text-white" strokeWidth={3.5} />}
                  </span>
                  {t.subject && <Badge className={subjectMeta(t.subject).chip}>{subjectMeta(t.subject).name}</Badge>}
                  <span className={`text-sm ${done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{t.text}</span>
                </button>
              );
            })}
            <p className="text-xs text-slate-400 pt-1">已完成 {doneCount}/{todayTasks.length} · 勾选状态自动保存</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">冲刺计划尚未生成，请稍后再来查看。</p>
        )}
      </Card>

      {/* 三科进度 */}
      <div>
        <SectionTitle icon="chart" title="三科备考进度" desc="预估分 = 客观题正确率 × 客观分值 + 主观题自评得分率 × 主观分值（未作答按模板保底估算）" />
        <div className="grid md:grid-cols-3 gap-4">
          {perSubject.map((p, idx) => (
            <motion.div key={p.meta.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card className="p-5 h-full">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.meta.gradient} text-white flex items-center justify-center font-bold`}>{p.meta.short}</div>
                  <div>
                    <div className="font-bold text-slate-900">{p.meta.name}</div>
                    <div className="text-xs text-slate-400">{p.meta.tagline}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <ProgressRing value={p.lessonTotal ? (p.lessonRead / p.lessonTotal) * 100 : 0} color={p.meta.ring} label={`${p.lessonRead}/${p.lessonTotal}`} />
                  <div className="text-sm space-y-1.5 flex-1">
                    <div className="flex justify-between text-slate-500">
                      <span>客观题正确率</span>
                      <span className="font-semibold text-slate-700">{p.objAcc ? Math.round(p.objAcc * 100) : '—'}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div className={`h-full ${p.meta.bar}`} initial={{ width: 0 }} animate={{ width: `${p.objAcc * 100}%` }} transition={{ duration: 0.8 }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>刷题 {p.attempted}</span>
                      <span>错题 {p.wrong}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5">
                  <span className="text-xs text-slate-500">当前预估</span>
                  <span className={`font-extrabold ${p.estimate >= p.meta.total * 0.45 ? 'text-emerald-600' : 'text-brand-600'}`}>
                    {p.estimate} <span className="text-xs font-medium text-slate-400">/ {p.meta.total}</span>
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link to={`/learn/${p.meta.id}`} className="flex-1"><Btn variant="outline" size="sm" className="w-full">学课件</Btn></Link>
                  <Link to={`/practice/${p.meta.id}`} className="flex-1"><Btn variant="soft" size="sm" className="w-full">去刷题</Btn></Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 目标拆解 + 模考历史 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionTitle icon="target" title="目标分数拆解" desc="总分 450，按“抓大放小”分配 150~180 分目标" />
          <div className="space-y-3">
            {TARGET_SPLIT.map((t) => {
              const m = subjectMeta(t.subject);
              return (
                <div key={t.subject} className="flex items-center gap-3">
                  <Badge className={m.chip}>{m.name}</Badge>
                  <div className="text-sm flex-1">
                    <span className="text-slate-700 font-medium">保底 {t.safe}</span>
                    <span className="text-slate-400"> · 冲 </span>
                    <span className="text-brand-600 font-bold">{t.aim}</span>
                    <div className="text-xs text-slate-400">{t.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle icon="clock" title="模考记录" desc="最近 5 次模拟考试成绩" />
          {exams.length ? (
            <div className="space-y-2">
              {exams.slice(0, 5).map((e) => {
                const m = subjectMeta(e.subject);
                return (
                  <div key={e.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
                    <Badge className={m.chip}>{m.name}</Badge>
                    <span className="text-xs text-slate-400">
                      {new Date(e.date).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`ml-auto font-bold ${e.scored >= e.full * 0.4 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {e.scored} / {e.full}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400">还没有模考记录。模考是最接近实战的练习，建议每周每科至少一次。</p>
          )}
        </Card>
      </div>
    </div>
  );
}
