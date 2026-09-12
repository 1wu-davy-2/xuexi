import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ALL_LESSONS, lessonsOf } from '../data';
import { SUBJECTS, subjectMeta } from '../data/subjects';
import { Badge, Btn, Card, Empty, SectionTitle, Segmented } from '../components/ui';
import { Icon } from '../components/icons';
import type { Flashcard, SubjectId } from '../types';

type Tab = SubjectId | 'all';

interface CardItem extends Flashcard {
  key: string;
  lessonId: string;
  lessonTitle: string;
  subject: SubjectId;
}

export default function Cards() {
  const [tab, setTab] = useState<Tab>('english');
  const [onlyCore, setOnlyCore] = useState(false);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<string[]>([]);

  const cards = useMemo<CardItem[]>(() => {
    const lessons = tab === 'all' ? ALL_LESSONS : lessonsOf(tab);
    return lessons
      .filter((l) => (onlyCore ? l.importance === '核心' : true))
      .flatMap((l) => l.cards.map((c, i) => ({ ...c, key: `${l.id}-${i}`, lessonId: l.id, lessonTitle: l.title, subject: l.subject })));
  }, [tab, onlyCore]);

  const card = cards[idx % Math.max(1, cards.length)];
  const known = knownIds.includes(card?.key);

  function next(knownFlag?: boolean) {
    if (knownFlag && card) setKnownIds((p) => [...new Set([...p, card.key])]);
    setFlipped(false);
    setTimeout(() => setIdx((i) => (i + 1) % Math.max(1, cards.length)), 120);
  }

  function prev() {
    setFlipped(false);
    setIdx((i) => (i - 1 + Math.max(1, cards.length)) % Math.max(1, cards.length));
  }

  return (
    <div>
      <SectionTitle
        icon="grid"
        title="速记卡"
        desc={`${ALL_LESSONS.reduce((s, l) => s + l.cards.length, 0)} 张卡片，来自每讲速记要点。点卡片翻面自测，通勤路上也能刷。`}
        right={
          <Segmented
            value={tab}
            onChange={(v) => {
              setTab(v);
              setIdx(0);
              setFlipped(false);
            }}
            options={[{ value: 'all' as Tab, label: '全部' }, ...SUBJECTS.map((s) => ({ value: s.id as Tab, label: s.name }))]}
          />
        }
      />

      {cards.length === 0 ? (
        <Empty icon="grid" title="卡片生成中" desc="课件内容就绪后，速记卡会自动出现在这里。" />
      ) : (
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span>
              第 {idx + 1} / {cards.length} 张 · 已认识 {knownIds.length}
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={onlyCore} onChange={(e) => setOnlyCore(e.target.checked)} className="w-3.5 h-3.5 accent-indigo-600" />
              只看核心课
            </label>
          </div>

          {/* 翻卡 */}
          <div className="[perspective:1200px]" onClick={() => setFlipped(!flipped)}>
            <motion.div
              className="relative w-full cursor-pointer select-none"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 22 }}
            >
              {/* 正面 */}
              <div className="bg-white rounded-2xl shadow-card border border-slate-100 min-h-[260px] p-8 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: 'hidden' }}>
                <Badge className={`${subjectMeta(card.subject).chip} mb-4`}>{subjectMeta(card.subject).name} · {card.lessonTitle}</Badge>
                <p className="text-xl font-bold text-slate-900 leading-9">{card.front}</p>
                <p className="text-xs text-slate-400 mt-6 flex items-center justify-center gap-1">
                  <Icon name="refresh" className="w-3.5 h-3.5" /> 点击卡片看答案
                </p>
              </div>
              {/* 背面 */}
              <div
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-card border border-emerald-100 min-h-[260px] p-8 flex flex-col items-center justify-center text-center absolute inset-0"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <Badge className="bg-emerald-200 text-emerald-800 mb-4">答案</Badge>
                <p className="text-lg font-semibold text-slate-800 leading-9">{card.back}</p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <Btn variant="outline" onClick={prev}>
              <Icon name="chevronLeft" className="w-4 h-4" />
            </Btn>
            <Btn variant="danger" className="flex-1" onClick={() => next(false)}>
              还没记住
            </Btn>
            <Btn className={`flex-1 ${known ? '!bg-emerald-600' : ''}`} onClick={() => next(true)}>
              <Icon name="check" className="w-4 h-4" strokeWidth={3} /> 认识了
            </Btn>
            <Btn variant="outline" onClick={() => next()}>
              <Icon name="chevronRight" className="w-4 h-4" />
            </Btn>
          </div>
          <div className="mt-4 flex gap-2 justify-center">
            <Btn variant="ghost" size="sm" onClick={() => { setIdx(Math.floor(Math.random() * cards.length)); setFlipped(false); }}>
              <Icon name="refresh" className="w-4 h-4" /> 随机来一张
            </Btn>
            <Btn variant="ghost" size="sm" onClick={() => { setKnownIds([]); }}>
              清除「已认识」
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
