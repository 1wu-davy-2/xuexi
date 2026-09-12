import type { SubjectMeta, SubjectId } from '../types';

export const SUBJECTS: SubjectMeta[] = [
  {
    id: 'politics',
    name: '政治',
    short: '政',
    tagline: '马哲 · 毛中特与中特理论 · 时事政治',
    paper: '选择题 35×2 分 + 简答题 4×10 分 + 论述题 2×20 分，共 41 题',
    minutes: 150,
    total: 150,
    objectivePoints: 70,
    subjectivePoints: 80,
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    ring: '#e11d48',
    chip: 'bg-rose-100 text-rose-700',
    bar: 'bg-rose-500',
    gradient: 'from-rose-500 to-orange-400',
  },
  {
    id: 'english',
    name: '英语',
    short: '英',
    tagline: '语音 · 语法词汇 · 完形 · 阅读 · 对话 · 写作',
    paper: '61 题：语音 5 + 语法词汇 15 + 完形 15 + 阅读 20 + 补全对话 5 + 写作 1 篇',
    minutes: 150,
    total: 150,
    objectivePoints: 125,
    subjectivePoints: 25,
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    ring: '#0284c7',
    chip: 'bg-sky-100 text-sky-700',
    bar: 'bg-sky-500',
    gradient: 'from-sky-500 to-cyan-400',
  },
  {
    id: 'math',
    name: '高等数学（一）',
    short: '数',
    tagline: '极限 · 导数 · 积分 · 多元 · 级数 · 微分方程',
    paper: '选择题 12×7 分 + 填空题 3×7 分 + 解答题 3×15 分，共 18 题',
    minutes: 150,
    total: 150,
    objectivePoints: 105,
    subjectivePoints: 45,
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    ring: '#7c3aed',
    chip: 'bg-violet-100 text-violet-700',
    bar: 'bg-violet-500',
    gradient: 'from-violet-500 to-fuchsia-400',
  },
];

export function subjectMeta(id: SubjectId): SubjectMeta {
  const m = SUBJECTS.find((s) => s.id === id);
  if (!m) throw new Error('未知科目 ' + id);
  return m;
}

/** 江苏省控线参考（历年大致区间，以省教育考试院公布为准） */
export const JIANGSU_LINE_NOTE = '江苏省近年专升本（理工类）省控线大致在 100~120 分区间，具体以江苏省教育考试院当年公布为准。年满 25 周岁可加 20 分投档。';

/** 目标分数拆解：总分 150~180 时三科的推荐保底/冲刺目标 */
export const TARGET_SPLIT: { subject: SubjectId; safe: string; aim: string; note: string }[] = [
  { subject: 'politics', safe: '55~65', aim: '70+', note: '选择题背概念拿 50+，主观题背模板分点写不空题' },
  { subject: 'english', safe: '45~55', aim: '60+', note: '阅读 60 分是大头，作文背万能模板保 15+' },
  { subject: 'math', safe: '25~40', aim: '50+', note: '选择题 84 分！会做的公式题+选项代入，目标拿一半' },
];
