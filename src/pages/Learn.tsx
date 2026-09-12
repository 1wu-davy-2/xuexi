import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ALL_LESSONS, chaptersOf, lessonsOf, bankStats } from '../data';
import { SUBJECTS, subjectMeta } from '../data/subjects';
import { useStore } from '../store/store';
import { Card, SectionTitle, Badge, Btn, ProgressRing, Segmented } from '../components/ui';
import { Icon } from '../components/icons';
import type { SubjectId } from '../types';

export function LearnHome() {
  const navigate = useNavigate();
  const { readLessons } = useStore();
  return (
    <div>
      <SectionTitle icon="book" title="课程学习" desc="零基础从第一课学起：概念人话讲解 → 例题 → 口诀 → 速记卡。学完一课点「已学完」记录进度。" />
      <div className="grid md:grid-cols-3 gap-4">
        {SUBJECTS.map((m, i) => {
          const lessons = lessonsOf(m.id);
          const read = lessons.filter((l) => readLessons.includes(l.id)).length;
          const stat = bankStats(m.id);
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="p-5 h-full flex flex-col" onClick={() => navigate(`/learn/${m.id}`)}>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.gradient} text-white flex items-center justify-center font-bold text-lg`}>{m.short}</div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{m.name}</div>
                    <div className="text-xs text-slate-400">{m.paper}</div>
                  </div>
                  <ProgressRing value={lessons.length ? (read / lessons.length) * 100 : 0} color={m.ring} size={52} stroke={6} label={`${read}/${lessons.length}`} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge className={m.chip}>{lessons.length} 讲课件</Badge>
                  <Badge>{stat.total} 道题</Badge>
                  {stat.real > 0 && <Badge className="bg-indigo-50 text-indigo-500">{stat.real} 道真题</Badge>}
                </div>
                <div className="mt-3 text-sm text-slate-500 flex items-center gap-1 text-brand-600 font-medium">
                  进入学习 <Icon name="chevronRight" className="w-4 h-4" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function LearnSubject() {
  const { subject = 'politics' } = useParams();
  const navigate = useNavigate();
  const { readLessons } = useStore();
  const meta = subjectMeta(subject as SubjectId);
  const lessons = lessonsOf(subject as SubjectId);
  const chapters = chaptersOf(subject as SubjectId);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const read = lessons.filter((l) => readLessons.includes(l.id)).length;

  const grouped = useMemo(
    () => chapters.map((ch) => ({ chapter: ch, list: lessons.filter((l) => l.chapter === ch && (filter === 'all' || !readLessons.includes(l.id))) })),
    [lessons, chapters, filter, readLessons],
  );

  const nextLesson = lessons.find((l) => !readLessons.includes(l.id)) ?? lessons[0];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Btn variant="ghost" size="sm" onClick={() => navigate('/learn')}>
          <Icon name="chevronLeft" className="w-4 h-4" /> 全部科目
        </Btn>
      </div>
      <div className={`rounded-3xl p-6 mb-6 bg-gradient-to-br ${meta.gradient} text-white shadow-lg`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[220px]">
            <h1 className="text-2xl font-black">{meta.name} · 讲义目录</h1>
            <p className="text-white/80 text-sm mt-1">{meta.paper}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">{lessons.length ? Math.round((read / lessons.length) * 100) : 0}%</div>
            <div className="text-xs text-white/75">已完成 {read}/{lessons.length} 讲</div>
          </div>
        </div>
        {nextLesson && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Btn className="!bg-white !text-slate-900 hover:!bg-white/90" onClick={() => navigate(`/lesson/${subject}/${nextLesson.id}`)}>
              <Icon name="check" className="w-4 h-4" /> {read ? '继续学习' : '开始学习'}：{nextLesson.title}
            </Btn>
            <Btn variant="soft" className="!bg-white/15 !text-white" onClick={() => navigate(`/practice/${subject}`)}>配套刷题</Btn>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <Segmented value={filter} onChange={setFilter} options={[{ value: 'all', label: '全部课件' }, { value: 'unread', label: '只看未学' }]} />
        <span className="text-xs text-slate-400">点「已学完」会记录进度并解锁下一课</span>
      </div>

      <div className="space-y-6">
        {grouped.map((g) =>
          g.list.length ? (
            <div key={g.chapter}>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2.5 px-1">{g.chapter}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {g.list.map((l, i) => {
                  const isRead = readLessons.includes(l.id);
                  return (
                    <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                      <Card className="p-4 h-full" onClick={() => navigate(`/lesson/${subject}/${l.id}`)}>
                        <div className="flex items-start gap-3">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${isRead ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {isRead ? <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} /> : l.id.slice(-2)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 text-[15px] leading-6">{l.title}</div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              <Badge className={l.importance === '核心' ? 'bg-rose-100 text-rose-600' : l.importance === '重要' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}>{l.importance}</Badge>
                              <Badge className="bg-slate-100 text-slate-500">{l.minutes} 分钟</Badge>
                              <Badge className="bg-brand-50 text-brand-600">{l.cards.length} 张速记卡</Badge>
                            </div>
                          </div>
                          <Icon name="chevronRight" className="w-4 h-4 text-slate-300 mt-1" />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : null,
        )}
        {lessons.length === 0 && (
          <Card className="p-10 text-center text-slate-400">
            课件内容生成中，请稍等片刻后刷新本页。
            <div className="mt-3"><Link to={`/practice/${subject}`}><Btn variant="soft" size="sm">先去刷题</Btn></Link></div>
          </Card>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-6 text-center">共 {ALL_LESSONS.length} 讲课件 · 每讲含速记卡，可在「速记卡」页集中记忆</p>
    </div>
  );
}
