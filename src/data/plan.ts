import type { PlanWeek } from '../types';

/**
 * 五周冲刺计划（2026-09-12 开始，2026-10-17/18 考试）。
 * 每周 days[0] 为周六，依次到周五；工作日 1.5~2.5 小时，周末 3~4 小时。
 * 课件编号：政治 pol-01~15、英语 eng-l01~13、高数 math-l01~16。
 */
export const PLAN_WEEKS: PlanWeek[] = [
  {
    n: 1,
    range: '9.12 – 9.18',
    focus: '摸清底子、搭好框架：政治啃下马哲，英语语法筑基，高数拿下函数与极限。',
    goals: [
      '政治学完马哲 7 讲（pol-01~07），建立唯物论/辩证法/认识论框架',
      '英语过完 eng-l01~05 语法课，会拆句子、认得 5 种常用时态',
      '高数学完函数与极限（math-l01~04），会算基本极限',
      '养成节奏：工作日 2 小时、周末 4 小时，任务当天清',
    ],
    days: [
      {
        label: '周六',
        tasks: [
          { subject: 'politics', text: '政治：学 pol-01~02 课件（哲学基本问题、物质与意识）+ 每讲配套刷 5 道选择题' },
          { subject: 'english', text: '英语：学 eng-l01（句子成分与五大基本句型），例句各抄 1 遍' },
          { subject: 'math', text: '高数：学 math-l01（函数）+ 默写一遍常用函数的定义域/值域要点' },
        ],
      },
      {
        label: '周日',
        tasks: [
          { subject: 'politics', text: '政治：学 pol-03~04（世界的运动规律、意识的能动作用）+ 专项练习-政治-马哲 10 道' },
          { subject: 'english', text: '英语：学 eng-l02~03（核心时态），每条语法规则配抄例句 5 句' },
          { subject: 'math', text: '高数：学 math-l02~03（极限概念与四则运算）+ 专项练习-高数-极限 8 道' },
        ],
      },
      {
        label: '周一',
        tasks: [
          { subject: 'politics', text: '政治：学 pol-05（唯物辩证法两大特征）+ 过一遍 pol-01~02 速记卡' },
          { subject: 'math', text: '高数：学 math-l04（两个重要极限与无穷小比较）+ 基础题 10 道' },
        ],
      },
      {
        label: '周二',
        tasks: [
          { subject: 'english', text: '英语：学 eng-l04（被动语态与情态动词）+ 语法词汇练习 10 道' },
          { subject: 'politics', text: '政治：学 pol-06（对立统一规律）+ 默写矛盾分析法要点' },
        ],
      },
      {
        label: '周三',
        tasks: [
          { subject: 'math', text: '高数：专项练习-高数-极限 15 道，错题全部记入错题本' },
          { subject: 'english', text: '英语：复习 eng-l01~04 例句，做时态选择 10 道' },
        ],
      },
      {
        label: '周四',
        tasks: [
          { subject: 'politics', text: '政治：学 pol-07（认识论与实践观）+ 专项练习-政治-马哲 10 道' },
          { subject: 'math', text: '高数：重做本周高数错题，总结极限 3 种常考套路' },
        ],
      },
      {
        label: '周五',
        tasks: [
          { subject: 'english', text: '英语：学 eng-l05（从句入门）+ 抄写并翻译例句 10 句' },
          { subject: 'politics', text: '政治：速记卡过一遍 pol-01~07，错题本回顾 15 分钟' },
        ],
      },
    ],
  },
  {
    n: 2,
    range: '9.19 – 9.25',
    focus: '三线推进：政治毛中特 pol-08~13，英语非谓语与三大从句 eng-l06~09，高数导数 math-l05~08。',
    goals: [
      '政治学完毛中特核心 6 讲（pol-08~13），选择题正确率过 60%',
      '英语攻克非谓语动词与三大从句，语法词汇题正确率过 60%',
      '高数熟到「肌肉记忆」：基本求导公式默写零错误',
    ],
    days: [
      {
        label: '周六',
        tasks: [
          { subject: 'politics', text: '政治：学 pol-08~09（毛泽东思想、新民主主义革命理论）+ 刷选择 10 道' },
          { subject: 'math', text: '高数：学 math-l05（导数定义与几何意义）+ 默写一遍基本求导公式表' },
          { subject: 'english', text: '英语：学 eng-l06（不定式与动名词）+ 例句抄写 10 句' },
        ],
      },
      {
        label: '周日',
        tasks: [
          { subject: 'english', text: '英语：学 eng-l07（分词）+ 专项练习-英语-非谓语 10 道' },
          { subject: 'math', text: '高数：学 math-l06~07（求导四则与复合函数求导）+ 练 10 道' },
          { subject: 'politics', text: '政治：学 pol-10（社会主义改造与建设初步探索）+ 过 pol-08~09 速记卡' },
        ],
      },
      {
        label: '周一',
        tasks: [
          { subject: 'politics', text: '政治：学 pol-11（邓小平理论与改革开放）+ 刷选择 10 道' },
          { subject: 'math', text: '高数：专项练习-高数-导数 10 道，错题入本' },
        ],
      },
      {
        label: '周二',
        tasks: [
          { subject: 'english', text: '英语：学 eng-l08（名词性从句）+ 语法词汇练习 10 道' },
          { subject: 'politics', text: '政治：学 pol-12（「三个代表」与科学发展观）+ 速记卡复习' },
        ],
      },
      {
        label: '周三',
        tasks: [
          { subject: 'math', text: '高数：学 math-l08（隐函数与高阶导数）+ 做 8 道' },
          { subject: 'english', text: '英语：复习 eng-l06~08 例句，非谓语+从句混合练 10 道' },
        ],
      },
      {
        label: '周四',
        tasks: [
          { subject: 'politics', text: '政治：学 pol-13（习近平新时代中国特色社会主义思想）+ 刷选择 10 道' },
          { subject: 'english', text: '英语：学 eng-l09（状语从句与倒装）+ 做 10 道' },
        ],
      },
      {
        label: '周五',
        tasks: [
          { subject: 'politics', text: '政治：速记卡过一遍 pol-08~13，本周错题回顾' },
          { subject: 'math', text: '高数：求导公式默写第 2 遍，错一个重背一个' },
          { subject: 'english', text: '英语：本周语法错题重做一遍' },
        ],
      },
    ],
  },
  {
    n: 3,
    range: '9.26 – 10.2',
    focus: '真题第一轮开动：高数做 2023~2025 真题选择，英语做 2021 真题，政治刷真题选择；同步学完积分。',
    goals: [
      '高数学完积分（math-l09~12），2023~2025 真题选择题各限时做一遍',
      '英语 2021 真题（除写作）全部做完并精读订正',
      '政治刷真题选择题 30 道，学会看简答题参考答案的分点结构',
    ],
    days: [
      {
        label: '周六',
        tasks: [
          { subject: 'math', text: '高数：学 math-l09~10（不定积分概念与换元法）+ 默写一遍积分公式表' },
          { subject: 'politics', text: '政治：学 pol-14 + 专项练习-政治-毛中特 10 道' },
          { subject: 'english', text: '英语：做 2021 真题阅读 2 篇并精读订正（长难句逐句弄懂）' },
        ],
      },
      {
        label: '周日',
        tasks: [
          { subject: 'math', text: '高数：2023 高数真题选择题限时 40 分钟 + 订正' },
          { subject: 'english', text: '英语：2021 真题完形填空 15 空 + 对答案逐题精读' },
          { subject: 'politics', text: '政治：政治真题选择题 15 道（马哲部分）+ 订正' },
        ],
      },
      {
        label: '周一',
        tasks: [
          { subject: 'math', text: '高数：学 math-l11（分部积分法）+ 练 8 道' },
          { subject: 'english', text: '英语：精读 2021 真题阅读错题 + 生词摘抄进速记本' },
        ],
      },
      {
        label: '周二',
        tasks: [
          { subject: 'math', text: '高数：2024 真题选择题限时做 + 订正' },
          { subject: 'politics', text: '政治：政治真题选择题 15 道（毛中特部分）+ 订正' },
        ],
      },
      {
        label: '周三',
        tasks: [
          { subject: 'math', text: '高数：学 math-l12（定积分与牛顿-莱布尼茨公式）+ 练 8 道' },
          { subject: 'english', text: '英语：2021 真题语音 + 语法词汇部分限时做 + 订正' },
        ],
      },
      {
        label: '周四',
        tasks: [
          { subject: 'math', text: '高数：2025 真题选择题限时做 + 订正' },
          { subject: 'politics', text: '政治：政治真题简答题看参考答案，学「分点作答」结构 + 抄写 1 道答案' },
        ],
      },
      {
        label: '周五',
        tasks: [
          { subject: 'math', text: '高数：积分公式默写 1 遍 + 重做本周积分错题' },
          { subject: 'english', text: '英语：2021 真题补全对话 5 题 + 回顾三周英语错题本' },
        ],
      },
    ],
  },
  {
    n: 4,
    range: '10.3 – 10.9',
    focus: '全真模考周：三科各 1 次整卷限时，错题清零；时政突击 pol-15，作文模板背诵 eng-l13。',
    goals: [
      '三科各完成 1 次全真模考并当天复盘，找到自己的答题节奏',
      '错题本清零：每道错题重做至全对为止',
      '背熟英语作文两套模板（eng-l13），政治时政（pol-15）过完',
      '高数扫尾 math-l13~16（了解层次，不深钻）',
    ],
    days: [
      {
        label: '周六',
        tasks: [
          { subject: 'politics', text: '模考-政治：整卷限时 150 分钟 + 对答案复盘' },
          { subject: 'politics', text: '政治：学 pol-15（时事政治）+ 时政选择题 10 道' },
          { subject: 'politics', text: '政治：模考选择题错题当页订正' },
        ],
      },
      {
        label: '周日',
        tasks: [
          { subject: 'english', text: '模考-英语：整卷限时 150 分钟 + 对答案复盘' },
          { subject: 'english', text: '英语：学 eng-l13（作文模板）+ 书信模板抄写 1 遍' },
          { subject: 'english', text: '英语：模考阅读错题精读订正' },
        ],
      },
      {
        label: '周一',
        tasks: [
          { subject: 'math', text: '高数：学 math-l13~14（向量代数与多元函数，了解层次）+ 例题过一遍' },
          { subject: 'politics', text: '政治：时政选择题再刷 10 道 + 主观题模板背 2 条' },
        ],
      },
      {
        label: '周二',
        tasks: [
          { subject: 'math', text: '模考-高数：整卷限时 120 分钟（先保选择+填空）+ 订正' },
          { subject: 'english', text: '英语：议论文模板背 1 遍 + 用模板写 1 段开头' },
        ],
      },
      {
        label: '周三',
        tasks: [
          { subject: 'politics', text: '政治：简答题模板「是什么→为什么→怎么样」抄写背诵 1 遍 + 模考主观题对照参考答案自评' },
          { subject: 'math', text: '高数：模考错题重做至全对' },
        ],
      },
      {
        label: '周四',
        tasks: [
          { subject: 'english', text: '英语：错题本清零 + 阅读三步法（先看题→定位→同义替换）复盘' },
          { subject: 'politics', text: '政治：选择题错题二刷 20 道' },
        ],
      },
      {
        label: '周五',
        tasks: [
          { subject: 'math', text: '高数：学 math-l15~16（常微分方程与级数，了解层次）+ 更新公式手册' },
          { subject: 'politics', text: '三科速记卡各过 15 分钟，清空本周遗留错题' },
        ],
      },
    ],
  },
  {
    n: 5,
    range: '10.10 – 10.16',
    focus: '考前一周回归基础：只碰公式、模板、速记卡和旧错题，不学新知识；10.16 打点收兵、休整备考。',
    goals: [
      '公式手册与作文模板每天过一遍，保持手感不手生',
      '政治 4 大主观题模板 + 时政要点滚瓜烂熟',
      '每天比上周早睡半小时，把状态调到 10.17 上午的考试节奏',
      '10.16 完成休整清单：准考证、物品、路线，晚上 11 点前睡',
    ],
    days: [
      {
        label: '周六',
        tasks: [
          { subject: 'politics', text: '模考-政治：1 套真题卷限时做，只订正选择题' },
          { subject: 'math', text: '高数：公式手册全文过 1 遍 + 抽 10 道旧题口算热手' },
          { subject: 'politics', text: '政治：pol-15 时政要点再读 1 遍' },
        ],
      },
      {
        label: '周日',
        tasks: [
          { subject: 'english', text: '模考-英语：1 套真题限时 + 只复盘阅读与作文' },
          { subject: 'politics', text: '政治：4 大主观题模板各默 1 遍框架' },
          { subject: 'english', text: '英语：作文万能句式朗读 10 分钟' },
        ],
      },
      {
        label: '周一',
        tasks: [
          { subject: 'math', text: '高数：默写求导 + 积分公式各 1 遍（错一个重背一个）' },
          { subject: 'english', text: '英语：书信模板默写 1 遍' },
        ],
      },
      {
        label: '周二',
        tasks: [
          { subject: 'politics', text: '政治：速记卡全部过 1 遍 + 时政要点再扫' },
          { subject: 'math', text: '高数：真题选择题错题口述思路（不动笔全套）' },
        ],
      },
      {
        label: '周三',
        tasks: [
          { subject: 'english', text: '英语：议论文模板默写 + 3 句万能句式各造 1 句' },
          { subject: 'politics', text: '政治：真题简答题答案结构抄读 2 道' },
        ],
      },
      {
        label: '周四',
        tasks: [
          { subject: 'math', text: '高数：公式手册 + 极限/导数/积分各抽 3 道旧题热手' },
          { subject: 'english', text: '英语：语音题规律 + 补全对话常用句式过一遍' },
        ],
      },
      {
        label: '周五',
        tasks: [
          { subject: 'politics', text: '考前休整：打印准考证 2 份，按考前物品清单装包（身份证、2B 铅笔、0.5 黑色签字笔、橡皮、直尺、非智能手表）' },
          { subject: 'politics', text: '核对考点路线与进场时间；晚上 11 点前睡，不熬夜刷题' },
          { subject: 'politics', text: '政治：只翻 pol-15 时政要点 15 分钟提神，然后收书' },
        ],
      },
    ],
  },
];

/** 计划锚点：第 1 周第 1 天 */
export const PLAN_START = '2026-09-12';

/** 根据日期返回今天在计划中的位置；考试临近/结束后给出对应提示 */
export function planPosition(today = new Date()): { week: number; day: number; before: boolean } {
  const start = new Date(PLAN_START + 'T00:00:00');
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.floor((t.getTime() - start.getTime()) / 86400000);
  if (diff < 0) return { week: 1, day: 0, before: true };
  const week = Math.min(5, Math.floor(diff / 7) + 1);
  const day = Math.min(6, diff % 7);
  return { week, day, before: false };
}
