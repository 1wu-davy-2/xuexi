import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Question } from '../types';
import { Badge } from './ui';
import { Icon } from './icons';
import { checkBlank, renderRich } from '../utils/render';
import { subjectMeta } from '../data/subjects';

export interface AnswerResult {
  correct: boolean;
  selfRatio?: number;
  userAnswer: string;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
export const SELF_OPTIONS = [
  { ratio: 0, label: '没答上', cls: 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' },
  { ratio: 0.4, label: '只答对一部分', cls: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' },
  { ratio: 0.8, label: '基本答对', cls: 'bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100' },
  { ratio: 1, label: '完整答对', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
];

export function QuestionCard({
  q,
  index,
  onAnswered,
  revealInitially = false,
  mode = 'practice',
  initialAnswer,
  onSelect,
}: {
  q: Question;
  index?: number;
  /** 练习模式：提交后回调 */
  onAnswered?: (r: AnswerResult) => void;
  revealInitially?: boolean;
  /** exam 模式：只收集作答，不判分不反馈 */
  mode?: 'practice' | 'exam' | 'review';
  initialAnswer?: string;
  /** exam 模式：作答变化回调 */
  onSelect?: (val: string) => void;
}) {
  const meta = subjectMeta(q.subject);
  const [chosen, setChosen] = useState<string | null>(initialAnswer ?? null);
  const [text, setText] = useState(initialAnswer ?? '');
  const [revealed, setRevealed] = useState(revealInitially || mode === 'review');
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [selfRatio, setSelfRatio] = useState<number | null>(null);
  const [passageOpen, setPassageOpen] = useState(true);

  useEffect(() => {
    setChosen(initialAnswer ?? null);
    setText(initialAnswer ?? '');
    setRevealed(revealInitially || mode === 'review');
    setResult(null);
    setSelfRatio(null);
    setPassageOpen(true);
  }, [q.id, mode, revealInitially, initialAnswer]);

  const correctIdx = useMemo(() => (q.options ? q.answer.trim().toUpperCase().charCodeAt(0) - 65 : -1), [q]);

  function submitSingle() {
    if (chosen == null || result) return;
    const correct = chosen === q.answer.trim().toUpperCase();
    const r: AnswerResult = { correct, userAnswer: chosen };
    setResult(r);
    onAnswered?.(r);
  }

  function submitBlank() {
    if (result) return;
    const correct = checkBlank(text, q.answer);
    const r: AnswerResult = { correct, userAnswer: text };
    setResult(r);
    onAnswered?.(r);
  }

  function submitSelf(ratio: number) {
    if (result) return;
    setSelfRatio(ratio);
    const r: AnswerResult = { correct: ratio >= 0.8, selfRatio: ratio, userAnswer: text };
    setResult(r);
    onAnswered?.(r);
  }

  const isExam = mode === 'exam';
  const isReview = mode === 'review';
  const diffLabel = ['', '易', '中', '难'][q.difficulty];
  const diffCls = ['bg-slate-100 text-slate-500', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700'][q.difficulty];

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
      {/* 头部 */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-50 flex flex-wrap items-center gap-2">
        {index != null && (
          <span className={`w-7 h-7 rounded-lg text-xs font-bold text-white flex items-center justify-center bg-gradient-to-br ${meta.gradient}`}>{index}</span>
        )}
        <Badge className={meta.chip}>{q.section}</Badge>
        <Badge>{q.topic}</Badge>
        <Badge className={diffCls}>{diffLabel}</Badge>
        <Badge className="bg-slate-100 text-slate-500">{q.score} 分</Badge>
        {q.source && <Badge className="bg-indigo-50 text-indigo-500">{q.source}</Badge>}
      </div>

      <div className="p-5">
        {/* 共享材料 */}
        {q.passage && (
          <div className="mb-4">
            <button onClick={() => setPassageOpen(!passageOpen)} className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:underline">
              <Icon name="chevronRight" className={`w-3.5 h-3.5 transition-transform ${passageOpen ? 'rotate-90' : ''}`} />
              {q.section === '完形填空' ? '完形原文' : '阅读原文'}（点击展开/收起）
            </button>
            <AnimatePresence initial={false}>
              {passageOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <div className="mt-2 bg-slate-50 rounded-xl p-4 text-[14px] leading-7 text-slate-600 whitespace-pre-wrap">{q.passage}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 题干 */}
        <div className="text-[15.5px] leading-8 text-slate-800 font-medium">
          {renderRich(q.stem, `q${q.id}`)}
        </div>

        {/* 单选 */}
        {q.type === 'single' && q.options && (
          <div className="mt-4 space-y-2.5">
            {q.options.map((opt, i) => {
              const letter = LETTERS[i];
              const isChosen = chosen === letter;
              const isCorrect = letter === LETTERS[correctIdx];
              let cls = 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/50';
              if (isReview) {
                if (isCorrect) cls = 'border-emerald-400 bg-emerald-50';
                else if (isChosen) cls = 'border-rose-300 bg-rose-50';
                else cls = 'border-slate-100 opacity-60';
              } else if (!isExam && result) {
                if (isCorrect) cls = 'border-emerald-400 bg-emerald-50';
                else if (isChosen) cls = 'border-rose-300 bg-rose-50';
                else cls = 'border-slate-100 opacity-60';
              } else if (isChosen) cls = 'border-brand-500 bg-brand-50 ring-2 ring-brand-200';
              return (
                <motion.button
                  key={i}
                  whileTap={mode === 'practice' && !result ? { scale: 0.985 } : undefined}
                  disabled={(!isExam && !!result) || isReview}
                  onClick={() => {
                    if (isExam) {
                      setChosen(letter);
                      onSelect?.(letter);
                    } else if (!result) {
                      setChosen(letter);
                    }
                  }}
                  className={`w-full text-left flex items-start gap-3 rounded-xl border px-4 py-3 transition-all ${cls}`}
                >
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex-shrink-0 flex items-center justify-center ${result && isCorrect && !isExam ? 'bg-emerald-500 text-white' : result && isChosen && !isExam ? 'bg-rose-500 text-white' : isChosen ? 'bg-brand-600 text-white' : isReview && isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {result && isCorrect && !isExam ? <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} /> : result && isChosen && !isExam ? <Icon name="x" className="w-3.5 h-3.5" strokeWidth={3} /> : letter}
                  </span>
                  <span className="text-[14.5px] leading-7 text-slate-700">{renderRich(opt, `o${q.id}${i}`)}</span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* 填空 */}
        {q.type === 'blank' && (
          <div className="mt-4 flex gap-2">
            <input
              value={text}
              disabled={(!isExam && !!result) || isReview}
              onChange={(e) => {
                setText(e.target.value);
                if (isExam) onSelect?.(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && !isExam && submitBlank()}
              placeholder="输入答案（大小写不限，公式可用 x^2、1/2、pi 等简写）"
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 disabled:bg-slate-50"
            />
            {!isExam && !result && !isReview && (
              <button onClick={submitBlank} className="rounded-xl bg-brand-600 text-white px-5 text-sm font-medium hover:bg-brand-700 active:scale-95 transition">
                提交
              </button>
            )}
          </div>
        )}

        {/* 主观题 */}
        {q.type === 'subjective' && (
          <div className="mt-4">
            {!isExam && !isReview && (
              <p className="text-xs text-slate-400 mb-2">考试中本题写在答题纸上。先把要点列出来，再对照参考答案自评。</p>
            )}
            {isExam && <p className="text-xs text-slate-400 mb-2">先把你的答题要点写在下面（交卷后对照参考答案自评得分）。</p>}
            <textarea
              value={text}
              disabled={(!isExam && !!result) || isReview}
              onChange={(e) => {
                setText(e.target.value);
                if (isExam) onSelect?.(e.target.value);
              }}
              rows={isExam ? 4 : 5}
              placeholder="写下你的答案要点…"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 disabled:bg-slate-50"
            />
            {!isExam && !isReview && !result && (
              <button
                onClick={() => setRevealed(true)}
                className="mt-2 rounded-xl bg-brand-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-brand-700 active:scale-95 transition"
              >
                做完了，查看参考答案并自评
              </button>
            )}
            {revealed && !result && !isExam && !isReview && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  <p className="text-xs font-bold text-slate-500 mb-1.5">参考答案（满分 {q.score} 分）</p>
                  <div className="text-[14px] leading-7 text-slate-600 whitespace-pre-wrap">{q.answer}</div>
                </div>
                <p className="text-xs text-slate-400 mt-3 mb-2">对照解析，给自己打个分（答对 80% 以上记为正确）：</p>
                <div className="flex flex-wrap gap-2">
                  {SELF_OPTIONS.map((s) => (
                    <button key={s.ratio} onClick={() => submitSelf(s.ratio)} className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${s.cls}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {isReview && (
              <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                <p className="text-xs font-bold text-slate-500 mb-1.5">参考答案（满分 {q.score} 分）</p>
                <div className="text-[14px] leading-7 text-slate-600 whitespace-pre-wrap">{q.answer}</div>
              </div>
            )}
          </div>
        )}

        {/* 提交按钮（单选·练习模式） */}
        {q.type === 'single' && mode === 'practice' && !result && (
          <button
            onClick={submitSingle}
            disabled={chosen == null}
            className="mt-4 w-full rounded-xl bg-brand-600 text-white py-2.5 text-sm font-medium hover:bg-brand-700 active:scale-[.99] transition disabled:opacity-40"
          >
            {chosen == null ? '选择一个答案' : '提交答案'}
          </button>
        )}

        {/* 结果反馈（练习模式） */}
        <AnimatePresence>
          {mode === 'practice' && result && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="mt-4 space-y-3">
                <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${result.correct ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${result.correct ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    <Icon name={result.correct ? 'check' : 'x'} className="w-3.5 h-3.5" strokeWidth={3} />
                  </motion.span>
                  {q.type === 'subjective'
                    ? `自评：${SELF_OPTIONS.find((s) => s.ratio === selfRatio)?.label ?? ''}（得 ${Math.round((selfRatio ?? 0) * q.score)} / ${q.score} 分）`
                    : result.correct
                      ? `回答正确，得 ${q.score} 分`
                      : `回答错误 · 正确答案：${q.type === 'single' ? q.answer.trim().toUpperCase() : q.answer}`}
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  <p className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                    <Icon name="bulb" className="w-3.5 h-3.5 text-amber-500" />
                    解析
                  </p>
                  <div className="text-[14px] leading-7 text-slate-600">{renderRich(q.analysis, `a${q.id}`)}</div>
                </div>

                {q.tip && (
                  <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                    <p className="text-xs font-bold text-amber-600 mb-1">零基础提示</p>
                    <div className="text-[13.5px] leading-7 text-amber-800">{renderRich(q.tip, `t${q.id}`)}</div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 复核模式解析 */}
        {isReview && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
              <p className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                <Icon name="bulb" className="w-3.5 h-3.5 text-amber-500" /> 解析
              </p>
              <div className="text-[14px] leading-7 text-slate-600">{renderRich(q.analysis, `ra${q.id}`)}</div>
            </div>
            {q.tip && (
              <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                <p className="text-xs font-bold text-amber-600 mb-1">零基础提示</p>
                <div className="text-[13.5px] leading-7 text-amber-800">{renderRich(q.tip, `rt${q.id}`)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
