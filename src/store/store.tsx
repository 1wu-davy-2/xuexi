import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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

/** 认证阶段：boot 启动检查中 / anon 未登录 / authed 已登录(云同步) / local 本地模式(连不上服务器) */
export type AuthPhase = 'boot' | 'anon' | 'authed' | 'local';
export type SyncState = 'idle' | 'saving' | 'saved' | 'error';

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

interface ProgressBlob {
  settings: Settings;
  readLessons: string[];
  attempts: Record<string, AttemptRecord>;
  exams: ExamRecord[];
  planDone: Record<string, boolean>;
}

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

  // 认证与云同步
  phase: AuthPhase;
  username: string;
  syncState: SyncState;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  /** 不连服务器，直接以本地模式使用 */
  enterLocal: () => void;
  /** authed：立即推送；local：重试连接服务器 */
  syncNow: () => Promise<void>;
}

const StoreCtx = createContext<StoreValue | null>(null);

async function api<T>(path: string, token: string | null, init?: RequestInit): Promise<{ status: number; data: T | null; networkError: boolean }> {
  try {
    const res = await fetch(path, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
    });
    let data: T | null = null;
    try {
      data = (await res.json()) as T;
    } catch {
      /* 空响应 */
    }
    return { status: res.status, data, networkError: false };
  } catch {
    return { status: 0, data: null, networkError: true };
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(() => load('settings', DEFAULT_SETTINGS));
  const [readLessons, setReadLessons] = useState<string[]>(() => load('readLessons', [] as string[]));
  const [attempts, setAttempts] = useState<Record<string, AttemptRecord>>(() => load('attempts', {}));
  const [exams, setExams] = useState<ExamRecord[]>(() => load('exams', [] as ExamRecord[]));
  const [planDone, setPlanDone] = useState<Record<string, boolean>>(() => load('planDone', {}));

  const [phase, setPhase] = useState<AuthPhase>('boot');
  const [username, setUsername] = useState('');
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const tokenRef = useRef<string | null>(localStorage.getItem(PREFIX + 'token'));
  const suppressPushRef = useRef(false);
  const bootRef = useRef(false);
  const pushTimer = useRef<number | null>(null);

  useEffect(() => save('settings', settings), [settings]);
  useEffect(() => save('readLessons', readLessons), [readLessons]);
  useEffect(() => save('attempts', attempts), [attempts]);
  useEffect(() => save('exams', exams), [exams]);
  useEffect(() => save('planDone', planDone), [planDone]);

  /** 用服务器数据替换本地状态（本地缓存随之更新） */
  const adoptProgress = useCallback((blob: ProgressBlob | null) => {
    if (!blob) return;
    suppressPushRef.current = true;
    setSettingsState({ ...DEFAULT_SETTINGS, ...(blob.settings || {}) });
    setReadLessons(Array.isArray(blob.readLessons) ? blob.readLessons : []);
    setAttempts(blob.attempts && typeof blob.attempts === 'object' ? blob.attempts : {});
    setExams(Array.isArray(blob.exams) ? blob.exams : []);
    setPlanDone(blob.planDone && typeof blob.planDone === 'object' ? blob.planDone : {});
  }, []);

  const collectProgress = useCallback(
    (): ProgressBlob => ({ settings, readLessons, attempts, exams, planDone }),
    [settings, readLessons, attempts, exams, planDone],
  );

  /** 拉取并采纳服务器进度；成功返回 true */
  const pullProgress = useCallback(
    async (token: string) => {
      const { data } = await api<{ progress: ProgressBlob | null }>('/api/progress', token);
      if (data && data.progress) {
        adoptProgress(data.progress);
        return true;
      }
      return false;
    },
    [adoptProgress],
  );

  /** 推送本地进度到服务器 */
  const pushProgress = useCallback(async () => {
    const token = tokenRef.current;
    if (!token) return;
    setSyncState('saving');
    const { status } = await api('/api/progress', token, {
      method: 'PUT',
      body: JSON.stringify({ progress: collectProgress() }),
    });
    if (status === 200) {
      setSyncState('saved');
    } else if (status === 401) {
      // 会话过期 → 回登录页
      localStorage.removeItem(PREFIX + 'token');
      tokenRef.current = null;
      setPhase('anon');
      setSyncState('idle');
    } else {
      setSyncState('error');
    }
  }, [collectProgress]);

  // 启动：检查会话
  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;
    (async () => {
      const token = tokenRef.current;
      if (!token) {
        // 无 token：探活即可——可达则显示登录页，不可达则本地模式
        const { status } = await api('/api/ping', null);
        setPhase(status === 200 ? 'anon' : 'local');
        return;
      }
      const { status, data } = await api<{ username: string }>('/api/session', token);
      if (status === 200 && data) {
        setUsername(data.username);
        await pullProgress(token);
        setPhase('authed');
        return;
      }
      if (status === 401) {
        localStorage.removeItem(PREFIX + 'token');
        tokenRef.current = null;
        setPhase('anon');
        return;
      }
      // 会话探测失败：代理 500/502、静态部署无后端（404）或网络不可达 → 本地模式
      setPhase('local');
    })();
  }, [pullProgress]);

  // 云同步：authed 状态下，进度变化防抖推送（跳过采纳服务器数据触发的那次）
  useEffect(() => {
    if (phase !== 'authed') return;
    if (suppressPushRef.current) {
      suppressPushRef.current = false;
      return;
    }
    if (pushTimer.current) window.clearTimeout(pushTimer.current);
    pushTimer.current = window.setTimeout(() => {
      void pushProgress();
    }, 800);
    return () => {
      if (pushTimer.current) window.clearTimeout(pushTimer.current);
    };
  }, [settings, readLessons, attempts, exams, planDone, phase, pushProgress]);

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
    suppressPushRef.current = true;
    setSettingsState(DEFAULT_SETTINGS);
    setReadLessons([]);
    setAttempts({});
    setExams([]);
    setPlanDone({});
  }, []);

  const login = useCallback(
    async (u: string, p: string): Promise<{ ok: boolean; error?: string }> => {
      const { status, data, networkError } = await api<{ token: string; username: string; error?: string }>('/api/login', null, {
        method: 'POST',
        body: JSON.stringify({ username: u, password: p }),
      });
      if (networkError || status === 0 || status >= 500 || status === 404) return { ok: false, error: '无法连接服务器。若暂不使用云同步，可点击下方「本地模式」进入。' };
      if (status !== 200 || !data) return { ok: false, error: data?.error || '登录失败' };
      tokenRef.current = data.token;
      localStorage.setItem(PREFIX + 'token', data.token);
      setUsername(data.username);
      await pullProgress(data.token); // 服务器有数据则采纳
      suppressPushRef.current = true;
      setPhase('authed');
      return { ok: true };
    },
    [pullProgress],
  );

  const logout = useCallback(() => {
    const token = tokenRef.current;
    if (token) void api('/api/logout', token, { method: 'POST' });
    localStorage.removeItem(PREFIX + 'token');
    tokenRef.current = null;
    setUsername('');
    setSyncState('idle');
    setPhase('anon');
  }, []);

  const enterLocal = useCallback(() => setPhase('local'), []);

  const syncNow = useCallback(async () => {
    if (phase === 'authed') {
      await pushProgress();
    } else if (phase === 'local') {
      // 重试连接：有 token 就恢复会话，否则回到登录页
      const token = tokenRef.current;
      if (token) {
        const { status, data } = await api<{ username: string }>('/api/session', token);
        if (status === 200 && data) {
          setUsername(data.username);
          await pullProgress(token);
          setPhase('authed');
          return;
        }
      }
      setPhase('anon');
    }
  }, [phase, pushProgress, pullProgress]);

  const value = useMemo<StoreValue>(
    () => ({
      settings, setSettings,
      readLessons, markRead,
      attempts, recordAttempt, toggleMastered,
      exams, saveExam,
      planDone, togglePlanItem,
      resetAll,
      phase, username, syncState, login, logout, enterLocal, syncNow,
    }),
    [settings, setSettings, readLessons, markRead, attempts, recordAttempt, toggleMastered, exams, saveExam, planDone, togglePlanItem, resetAll, phase, username, syncState, login, logout, enterLocal, syncNow],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreValue {
  const v = useContext(StoreCtx);
  if (!v) throw new Error('useStore 必须在 StoreProvider 内使用');
  return v;
}
