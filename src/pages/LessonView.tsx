import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lessonById, lessonsOf, questionsOf } from '../data';
import { subjectMeta } from '../data/subjects';
import { useStore } from '../store/store';
import { Badge, Btn, Card } from '../components/ui';
import { Icon } from '../components/icons';
import { renderMarkdown } from '../utils/render';
import { useOutput, DocHeader } from '../utils/output';
import type { SubjectId } from '../types';

export default function LessonView() {
  const { subject = 'politics', lessonId = '' } = useParams();
  const navigate = useNavigate();
  const { readLessons, markRead } = useStore();
  const { print } = useOutput();
  const meta = subjectMeta(subject as SubjectId);
  const lesson = lessonById(lessonId);
  const [read, setRead] = useState(readLessons.includes(lessonId));

  const list = useMemo(() => lessonsOf(subject as SubjectId), [subject]);
  const idx = list.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? list[idx - 1] : undefined;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : undefined;
  const related = useMemo(() => questionsOf(subject as SubjectId).filter((q) => lesson && q.topic === lesson.chapter.slice(0, 6)).length, [subject, lesson]);

  if (!lesson) {
    return (
      <Card className="p-10 text-center">
        <p className="text-slate-500">没有找到这节课。</p>
        <Btn className="mt-4" onClick={() => navigate(`/learn/${subject}`)}>返回目录</Btn>
      </Card>
    );
  }

  function toggleRead() {
    const v = !read;
    setRead(v);
    markRead(lesson!.id, v);
    if (v && next) {
      setTimeout(() => navigate(`/lesson/${subject}/${next.id}`), 650);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-sm flex-wrap">
        <Btn variant="ghost" size="sm" onClick={() => navigate(`/learn/${subject}`)}>
          <Icon name="chevronLeft" className="w-4 h-4" /> {meta.name}目录
        </Btn>
        <span className="text-slate-300">/</span>
        <span className="text-slate-400">{lesson.chapter}</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 font-medium">第 {idx + 1} 讲</span>
        <div className="ml-auto flex gap-2">
          <Btn variant="outline" size="sm" onClick={() => print(<PrintableLesson lesson={lesson} meta={meta.name} />)}>
            <Icon name="printer" className="w-4 h-4" /> 打印讲义
          </Btn>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <motion.div key={lesson.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge className={meta.chip}>{lesson.chapter}</Badge>
              <Badge className={lesson.importance === '核心' ? 'bg-rose-100 text-rose-600' : lesson.importance === '重要' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}>{lesson.importance}</Badge>
              <Badge className="bg-slate-100 text-slate-500">{lesson.minutes} 分钟</Badge>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-2 mb-5">{lesson.title}</h1>
            <div className="lesson-body">{renderMarkdown(lesson.content, lesson.id)}</div>
          </Card>

          {/* 底部操作 */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Btn variant={read ? 'soft' : 'primary'} size="lg" onClick={toggleRead}>
              <Icon name="check" className="w-4 h-4" /> {read ? '已学完（点此取消）' : '学完了，标记并下一课'}
            </Btn>
            {prev && <Btn variant="outline" onClick={() => navigate(`/lesson/${subject}/${prev.id}`)}><Icon name="chevronLeft" className="w-4 h-4" /> {prev.title}</Btn>}
            {next && <Btn variant="outline" className="ml-auto" onClick={() => navigate(`/lesson/${subject}/${next.id}`)}>{next.title} <Icon name="chevronRight" className="w-4 h-4" /></Btn>}
          </div>
        </motion.div>

        {/* 侧栏：速记卡 + 配套练习 */}
        <div className="space-y-4 lg:sticky lg:top-6">
          <Card className="p-4">
            <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
              <Icon name="grid" className="w-4 h-4 text-brand-500" /> 速记要点
            </h3>
            <ul className="space-y-1.5">
              {lesson.keyPoints.map((k, i) => (
                <li key={i} className="text-[13px] leading-6 text-slate-600 flex gap-1.5">
                  <span className="text-brand-500 font-bold">·</span>
                  {k}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-400 mt-2.5">以上要点已同步到「速记卡」页面，可翻卡自测。</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
              <Icon name="edit" className="w-4 h-4 text-brand-500" /> 趁热打铁
            </h3>
            <p className="text-xs text-slate-400 leading-6">学完立刻做题记得最牢。去专项练习刷本科目题目，答错的题会自动进错题本。</p>
            <Btn className="w-full mt-3" size="sm" onClick={() => navigate(`/practice/${subject}`)}>
              去刷题{related > 0 ? `（本科目 ${related}+ 题）` : ''}
            </Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}

/** 打印用讲义 */
export function PrintableLesson({ lesson, meta }: { lesson: NonNullable<ReturnType<typeof lessonById>>; meta: string }) {
  return (
    <div className="print-doc">
      <DocHeader title={lesson.title} sub={`${meta} · ${lesson.chapter} · ${lesson.importance}`} />
      {renderMarkdown(lesson.content, `print-${lesson.id}`)}
      <h2>速记要点</h2>
      <ul className="q-opt">
        {lesson.keyPoints.map((k, i) => (
          <li key={i}>{i + 1}. {k}</li>
        ))}
      </ul>
    </div>
  );
}

/** 动画进度条小装饰 */
export function ReadProgress() {
  const { readLessons } = useStore();
  const pct = readLessons.length ? Math.min(100, readLessons.length) : 0;
  return (
    <AnimatePresence>
      <motion.div animate={{ width: `${pct}%` }} className="h-1 bg-brand-500 rounded-full" />
    </AnimatePresence>
  );
}
