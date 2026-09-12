export type SubjectId = 'politics' | 'english' | 'math';

/** 课程（知识点讲义） */
export interface Flashcard {
  front: string;
  back: string;
}

export interface Lesson {
  /** 全局唯一，如 'pol-01' */
  id: string;
  subject: SubjectId;
  /** 所属章节，如 '马克思主义哲学原理' */
  chapter: string;
  title: string;
  /** 预计学习分钟数 */
  minutes: number;
  importance: '核心' | '重要' | '了解';
  /** 讲义正文，支持轻量 markdown（## 标题 / - 列表 / > 提示 / | 表格 | / **加粗**）与 $..$、$$..$$ LaTeX */
  content: string;
  /** 速记要点 */
  keyPoints: string[];
  /** 速记卡 */
  cards: Flashcard[];
}

/** 题目 */
export interface Question {
  id: string;
  subject: SubjectId;
  /** 题型 / 试卷部分：'选择题' '简答题' '论述题' '语音' '语法与词汇' '完形填空' '阅读理解' '补全对话' '短文写作' '填空题' '解答题' */
  section: string;
  /** 考点，如 '对立统一规律'、'非谓语动词'、'洛必达法则' */
  topic: string;
  type: 'single' | 'blank' | 'subjective';
  /** 1 易 2 中 3 难 */
  difficulty: 1 | 2 | 3;
  /** 考试分值 */
  score: number;
  stem: string;
  /** 单选题选项，4 项对应 A B C D */
  options?: string[];
  /** 正确答案：选择题为字母；填空题为文本（可含 | 分隔多个可接受答案）；主观题为参考答案要点 */
  answer: string;
  /** 解析 / 评分参考 */
  analysis: string;
  /** 零基础提示 */
  tip?: string;
  /** 完形/阅读共用一篇材料时的组 id */
  passageId?: string;
  passage?: string;
  /** 来源，如 '2021 真题' / '2025 真题' / '原创' */
  source?: string;
}

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  short: string;
  tagline: string;
  /** 试卷结构描述 */
  paper: string;
  minutes: number;
  total: number;
  objectivePoints: number;
  subjectivePoints: number;
  /** 尾色类名（tailwind 字面量，保证被扫描到） */
  bg: string;
  text: string;
  ring: string;
  chip: string;
  bar: string;
  gradient: string;
}

/** 复习计划 */
export interface PlanTask {
  subject?: SubjectId;
  text: string;
}
export interface PlanDay {
  /** 显示用，如 '周六' */
  label: string;
  tasks: PlanTask[];
}
export interface PlanWeek {
  n: number;
  range: string;
  focus: string;
  goals: string[];
  days: PlanDay[];
}

/** 考情 / 策略页用的结构化内容块 */
export interface InfoBlock {
  id: string;
  title: string;
  type: 'table' | 'list' | 'note' | 'text';
  head?: string[];
  rows?: string[][];
  items?: string[];
  text?: string;
  tone?: 'warn' | 'info' | 'success';
}

export interface AttemptRecord {
  qid: string;
  correct: boolean;
  lastAt: number;
  wrongCount: number;
  correctCount: number;
  /** 最近一次主观题自评得分率 0~1 */
  lastSelfRatio?: number;
  /** 错题本中手动标记已掌握 */
  mastered?: boolean;
}
