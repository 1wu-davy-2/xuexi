import type { Lesson, Question, SubjectId } from '../types';
import { politicsLessons } from './politics/lessons';
import { politicsQuestionsReal } from './politics/questions-real';
import { politicsQuestionsOrig } from './politics/questions-orig';
import { englishLessons } from './english/lessons';
import { englishQuestionsReal } from './english/questions-real';
import { englishQuestionsOrig } from './english/questions-orig';
import { mathLessons } from './math/lessons';
import { mathQuestionsReal } from './math/questions-real';
import { mathQuestionsOrig } from './math/questions-orig';

export const ALL_LESSONS: Lesson[] = [...politicsLessons, ...englishLessons, ...mathLessons];
export const ALL_QUESTIONS: Question[] = [
  ...politicsQuestionsReal,
  ...politicsQuestionsOrig,
  ...englishQuestionsReal,
  ...englishQuestionsOrig,
  ...mathQuestionsReal,
  ...mathQuestionsOrig,
];

// 归一化：共享材料（完形/阅读/对话）只需写在组内任一题上，这里补齐到同组每一题
{
  const passageMap = new Map<string, string>();
  for (const q of ALL_QUESTIONS) {
    if (q.passageId && q.passage && !passageMap.has(q.passageId)) passageMap.set(q.passageId, q.passage);
  }
  for (const q of ALL_QUESTIONS) {
    if (q.passageId && !q.passage) {
      const p = passageMap.get(q.passageId);
      if (p) q.passage = p;
    }
  }
}

export function lessonsOf(subject: SubjectId): Lesson[] {
  return ALL_LESSONS.filter((l) => l.subject === subject);
}

export function questionsOf(subject: SubjectId): Question[] {
  return ALL_QUESTIONS.filter((q) => q.subject === subject);
}

export function lessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function questionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

/** 某科目的考点列表（按出现题量排序） */
export function topicsOf(subject: SubjectId): { topic: string; count: number }[] {
  const m = new Map<string, number>();
  for (const q of questionsOf(subject)) m.set(q.topic, (m.get(q.topic) ?? 0) + 1);
  return [...m.entries()].map(([topic, count]) => ({ topic, count })).sort((a, b) => b.count - a.count);
}

/** 章节列表（按讲义出现顺序去重） */
export function chaptersOf(subject: SubjectId): string[] {
  const seen: string[] = [];
  for (const l of lessonsOf(subject)) if (!seen.includes(l.chapter)) seen.push(l.chapter);
  return seen;
}

/** 完形/阅读等共享材料的题组 */
export function passageGroupsOf(subject: SubjectId): { passageId: string; passage: string; section: string; questions: Question[] }[] {
  const map = new Map<string, { passage: string; section: string; questions: Question[] }>();
  for (const q of questionsOf(subject)) {
    if (!q.passageId) continue;
    let g = map.get(q.passageId);
    if (!g) {
      g = { passage: q.passage ?? '', section: q.section, questions: [] };
      map.set(q.passageId, g);
    }
    g.questions.push(q);
  }
  return [...map.entries()]
    .map(([passageId, g]) => ({
      passageId,
      passage: g.passage,
      section: g.section,
      questions: g.questions.sort((a, b) => a.id.localeCompare(b.id)),
    }))
    .sort((a, b) => a.passageId.localeCompare(b.passageId));
}

/** 题库统计 */
export function bankStats(subject: SubjectId): { total: number; single: number; blank: number; subjective: number; real: number } {
  const qs = questionsOf(subject);
  return {
    total: qs.length,
    single: qs.filter((q) => q.type === 'single').length,
    blank: qs.filter((q) => q.type === 'blank').length,
    subjective: qs.filter((q) => q.type === 'subjective').length,
    real: qs.filter((q) => q.source?.includes('真题')).length,
  };
}
