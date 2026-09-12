import type { Question, SubjectId } from '../types';
import { questionsOf } from '../data';

export interface PaperSection {
  name: string;
  questions: Question[];
}

export interface Paper {
  subject: SubjectId;
  sections: PaperSection[];
  total: number;
  fullScore: number;
}

interface BPItem {
  section: string;
  count: number;
  /** 是否按共享材料整组抽取（完形/阅读） */
  passageGroup?: boolean;
}

/** 依据现行试卷结构的组卷蓝图 */
export const BLUEPRINTS: Record<SubjectId, BPItem[]> = {
  politics: [
    { section: '选择题', count: 35 },
    { section: '简答题', count: 4 },
    { section: '论述题', count: 2 },
  ],
  english: [
    { section: '语音', count: 5 },
    { section: '语法与词汇', count: 15 },
    { section: '完形填空', count: 15, passageGroup: true },
    { section: '阅读理解', count: 20, passageGroup: true },
    { section: '补全对话', count: 5 },
    { section: '短文写作', count: 1 },
  ],
  math: [
    { section: '选择题', count: 12 },
    { section: '填空题', count: 3 },
    { section: '解答题', count: 3 },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 按考点分层抽样，保证覆盖面 */
export function stratifiedPick(pool: Question[], n: number): Question[] {
  if (pool.length <= n) return shuffle(pool);
  const byTopic = new Map<string, Question[]>();
  for (const q of shuffle(pool)) {
    const k = q.topic || '其他';
    if (!byTopic.has(k)) byTopic.set(k, []);
    byTopic.get(k)!.push(q);
  }
  const topics = [...byTopic.keys()];
  const picked: Question[] = [];
  let round = 0;
  while (picked.length < n) {
    let addedThisRound = 0;
    for (const t of topics) {
      const list = byTopic.get(t)!;
      if (round < list.length) {
        picked.push(list[round]);
        addedThisRound++;
        if (picked.length >= n) break;
      }
    }
    if (addedThisRound === 0) break;
    round++;
  }
  return picked;
}

/** 组一份模拟卷：题库不足的部分有多少取多少 */
export function buildPaper(subject: SubjectId): Paper {
  const all = questionsOf(subject);
  const sections: PaperSection[] = [];
  let fullScore = 0;
  let total = 0;

  for (const bp of BLUEPRINTS[subject]) {
    if (bp.passageGroup) {
      const groups = new Map<string, Question[]>();
      for (const q of all.filter((q) => q.section === bp.section && q.passageId)) {
        if (!groups.has(q.passageId!)) groups.set(q.passageId!, []);
        groups.get(q.passageId!)!.push(q);
      }
      const shuffledGroups = shuffle([...groups.values()]);
      const picked: Question[] = [];
      for (const g of shuffledGroups) {
        picked.push(...g);
        if (picked.length >= bp.count) break;
      }
      const final = picked.slice(0, bp.count);
      if (final.length) sections.push({ name: bp.section, questions: final });
      total += final.length;
      fullScore += final.reduce((s, q) => s + q.score, 0);
    } else {
      const pool = all.filter((q) => q.section === bp.section);
      const picked = stratifiedPick(pool, bp.count);
      if (picked.length) sections.push({ name: bp.section, questions: picked });
      total += picked.length;
      fullScore += picked.reduce((s, q) => s + q.score, 0);
    }
  }
  return { subject, sections, total, fullScore };
}

/** 生成整卷 id 序列（按 sections 展平） */
export function flattenPaper(paper: Paper): Question[] {
  return paper.sections.flatMap((s) => s.questions);
}
