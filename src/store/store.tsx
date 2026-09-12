import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AttemptRecord, SubjectId } from '../types';

export interface ExamRecord {
  id: string;
  subject: SubjectId;
  date: number;
  /** 卷面满分（实际组到的题） */
  full: number;
  scored: number;
  durationSec: number;
  wrongIds: string[];
}

export interface Settings {
  name: string;
  examDate: string; // YYYY-MM-DD
}

const PREFIX = 'ckxuexi.v1.';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* 存储满时静默 */
  }
}

export const DEFAULT_SETTINGS: Settings = {
  name: '',
  examDate: '2026-10-17',
};

interface StoreValue {
  settings: Settings;
  setSettings: (s: Partial<Settings>) => void;
  readLessons: string[];
  markRead: (lessonId: string, read: boolean) => void;
  attempts: Record<string, AttemptRecord>;
  /** 记录一次作答；主观题用 selfRatio 自评得分率 */
  recordAttempt: (qid: string, correct: boolean, selfRatio?: number) => void;
  toggleMastered: (qid: string) => void;
  exams: ExamRecord[];
  saveExam: (r: ExamRecord) => void;
  planDone: Record<string, boolean>;
  togglePlanItem: (key: string) => void;
  resetAll: () => void;
}

const StoreCtx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(() => load('settings', DEFAULT_SETTINGS));
  const [readLessons, setReadLessons] = useState<string[]>(() => load('readLessons', [] as string[]));
  const [attempts, setAttempts] = useState<Record<string, AttemptRecord>>(() => load('attempts', {}));
  const [exams, setExams] = useState<ExamRecord[]>(() => load('exams', [] as ExamRecord[]));
  const [planDone, setPlanDone] = useState<Record<string, boolean>>(() => load('planDone', {}));

  useEffect(() => save('settings', settings), [settings]);
  useEffect(() => save('readLessons', readLessons), [readLessons]);
  useEffect(() => save('attempts', attempts), [attempts]);
  useEffect(() => save('exams', exams), [exams]);
  useEffect(() => save('planDone', planDone), [planDone]);

  const setSettings = useCallback((s: Partial<Settings>) => {
    setSettingsState((prev) => ({ ...DEFAULT_SETTINGS, ...prev, ...s }));
  }, []);

  const markRead = useCallback((lessonId: string, read: boolean) => {
    setReadLessons((prev) => (read ? [...new Set([...prev, lessonId])] : prev.filter((id) => id !== lessonId)));
  }, []);

  const recordAttempt = useCallback((qid: string, correct: boolean, selfRatio?: number) => {
    setAttempts((prev) => {
      const old = prev[qid];
      return {
        ...prev,
        [qid]: {
          qid,
          correct,
          lastAt: Date.now(),
          wrongCount: (old?.wrongCount ?? 0) + (correct ? 0 : 1),
          correctCount: (old?.correctCount ?? 0) + (correct ? 1 : 0),
          lastSelfRatio: selfRatio,
          mastered: correct && (old?.correctCount ?? 0) + 1 >= 2 ? true : old?.mastered,
        },
      };
    });
  }, []);

  const toggleMastered = useCallback((qid: string) => {
    setAttempts((prev) => {
      const old = prev[qid];
      const base: AttemptRecord = old ?? { qid, correct: false, lastAt: 0, wrongCount: 1, correctCount: 0 };
      return { ...prev, [qid]: { ...base, mastered: !base.mastered } };
    });
  }, []);

  const saveExam = useCallback((r: ExamRecord) => {
    setExams((prev) => [r, ...prev].slice(0, 50));
  }, []);

  const togglePlanItem = useCallback((key: string) => {
    setPlanDone((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetAll = useCallback(() => {
    ['settings', 'readLessons', 'attempts', 'exams', 'planDone'].forEach((k) => localStorage.removeItem(PREFIX + k));
    setSettingsState(DEFAULT_SETTINGS);
    setReadLessons([]);
    setAttempts({});
    setExams([]);
    setPlanDone({});
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      settings, setSettings,
      readLessons, markRead,
      attempts, recordAttempt, toggleMastered,
      exams, saveExam,
      planDone, togglePlanItem,
      resetAll,
    }),
    [settings, setSettings, readLessons, markRead, attempts, recordAttempt, toggleMastered, exams, saveExam, planDone, togglePlanItem, resetAll],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreValue {
  const v = useContext(StoreCtx);
  if (!v) throw new Error('useStore 必须在 StoreProvider 内使用');
  return v;
}
