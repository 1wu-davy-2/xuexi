import type { Lesson } from '../../types';

/**
 * 英语课件数据 —— 语音与词汇 / 核心语法 / 题型技巧，共 13 课。
 * 面向成考专升本（理工类）零基础考生：先说人话，再讲规律，配例句与口诀。
 */
export const englishLessons: Lesson[] = [
  {
    id: 'eng-l01',
    subject: 'english',
    chapter: '语音与词汇',
    title: '语音题解题规律：-ed、-s、th、ea、oo、ough、ch 一网打尽',
    minutes: 25,
    importance: '重要',
    content: `## 语音题是什么
成考英语第一题就是 5 道语音题，每题 1 分。它不考词义、不考拼写，只考一件事：**四个单词的同一个字母（组合）里，哪一个读音与众不同**。四个词中保证"3 同 1 异"。零基础同学不用背整张音标表，抓住下面几条规律就能稳定拿分。

## 规律一：-ed 的三种读音
动词过去式词尾 ed 读什么，只看 ed 前面那个**音**（不是字母）：
| ed 前的音 | 读法 | 词例 |
| --- | --- | --- |
| 清辅音 k, p, f, s, ʃ, tʃ 等 | /t/ | hel**ped**、wash**ed**、watch**ed**、stop**ped**、look**ed** |
| 浊辅音和元音 | /d/ | play**ed**、liv**ed**、open**ed**、call**ed**、stay**ed** |
| /t/ 和 /d/ | /ɪd/ | want**ed**、need**ed**、visit**ed**、decid**ed** |
> 口诀：**清读 /t/，浊读 /d/，t、d 后面加 /ɪd/**。

## 规律二：名词复数 / 动词三单 -s、-es 的读音
| 词尾前的音 | 读法 | 词例 |
| --- | --- | --- |
| 清辅音 | /s/ | book**s**、map**s**、cat**s**、month**s** |
| 浊辅音、元音 | /z/ | dog**s**、pen**s**、play**s** |
| s, x, z, sh, ch, ge 等咝音 | /ɪz/ | bu**s**es、box**es**、wish**es**、watch**es**、pag**es** |

## 规律三：th 的两种读音
- /θ/（清音，咬舌尖送气）：**th**ink、**th**ree、mon**th**、bir**th**day、heal**th**y；
- /ð/（浊音，声带振动）：**th**is、**th**at、**th**ose、**th**ere、mo**th**er、wea**th**er、wi**th**。
> 记忆点：**指代词家族（this/that/these/those/there/they）、家人（mother/father/brother）、weather** 多读 /ð/，其余多数读 /θ/。

## 规律四：ea、oo、ough、ch 四大字母组合
- **ea**：大多读 /iː/（t**ea**ch、m**ea**t、sp**ea**k、pl**ea**se），但 br**ea**d、h**ea**d、r**ea**dy、h**ea**lth 读 /e/，gr**ea**t、br**ea**k 读 /eɪ/，**ea** 记住这几个例外就够用；
- **oo**：f**oo**d、m**oo**n、sch**oo**l、s**oo**n 读 /uː/，但 b**oo**k、g**oo**d、l**oo**k、f**oo**t、c**oo**k 读短音 /ʊ/；
- **ough**：br**ough**t、th**ough**t、b**ough**t 读 /ɔː/；en**ough**、t**ough** 读 /ʌf/；c**ough** 读 /ɒf/；thr**ough** 读 /uː/；
- **ch**：大多读 /tʃ/（**ch**air、mu**ch**、tea**ch**），但 s**ch**ool、**Ch**ristmas、heada**ch**e 读 /k/。

## 规律五：c / g 的软硬音
- **c** 在 e、i、y 前读 /s/（**c**ity、fa**c**e、bi**c**ycle），其余读 /k/（**c**at、**c**old、pi**c**ture）；
- **g** 在 e、i、y 前常读 /dʒ/（**g**entle、**g**iant、pa**g**e），但 **g**et、**g**ive、**g**irl 例外仍读 /ɡ/。

## 解题三步
1. 把四个词的划线部分**在心里默读出声**；
2. 先把读音相同的两个划掉（题目保证 3 同 1 异）；
3. 剩下的那个就是答案，填它的字母。

## 补充：再记三组高频组合
- **air / are**：air、hair、chair、care、prepare、share 中的 air/are 都读 /eə/；
- **ere**：there、where 读 /eə/，但 here、mere 读 /ɪə/（一词一记）；
- **元音字母的"开闭音节"规律**：重读闭音节（元音后接辅音结尾）读短音：c**a**t /æ/、b**e**d /e/、s**i**t /ɪ/、h**o**t /ɒ/、b**u**s /ʌ/；重读开音节（辅音 + 不发音的 e 结尾）读字母本音：n**a**me /eɪ/、th**e**se /iː/、b**i**ke /aɪ/、n**o**se /əʊ/、c**u**te /juː/。
> 口诀：**闭音节读短音，开音节读字母名。** 遇到没背过的词，先看它是不是"辅音 + e"结尾，再判断长短音。`,
    keyPoints: [
      '语音题只考"读音辨异"，保证 3 同 1 异，先排除读音相同的两项',
      '-ed：清辅音后 /t/，浊辅音和元音后 /d/，t、d 后 /ɪd/（wanted、needed、visited）',
      '-s/-es：清辅音后 /s/，浊辅音和元音后 /z/，s/x/ch/sh/ge 后 /ɪz/（buses、boxes、watches）',
      'th：this/that/there/mother/weather 等读 /ð/，think/three/month 等读 /θ/',
      'ea 例外：bread/head/ready/health 读 /e/，great/break 读 /eɪ/；oo 例外：book/good/look/foot/cook 读 /ʊ/',
      'ough：bought/thought/brought 读 /ɔː/，enough/tough 读 /ʌf/；ch 在 school/Christmas/headache 中读 /k/',
      'c 在 e/i/y 前读 /s/（city、face）；g 在 e/i/y 前常读 /dʒ/，但 get/give/girl 例外读 /ɡ/',
    ],
    cards: [
      {
        front: '-ed 什么时候读 /ɪd/？',
        back: '动词以 t 或 d 结尾时：want**ed** /ˈwɒntɪd/、need**ed** /ˈniːdɪd/。口诀：清读 /t/，浊读 /d/，t、d 后面加 /ɪd/。',
      },
      {
        front: 'books、dogs、buses 的 s 分别读什么？',
        back: 'books /s/（清辅音后）、dogs /z/（浊辅音后）、buses /ɪz/（s/x/ch/sh 等咝音后）。',
      },
      {
        front: '哪些 th 读浊音 /ð/？',
        back: 'this、that、these、those、there、they、mother、father、brother、weather、with——指代词、家人、天气多读 /ð/；think/three/month 读 /θ/。',
      },
      {
        front: 'bread、great、break 中的 ea 读什么？',
        back: 'bread 读 /e/（同组 head、ready、health、weather）；great、break 读 /eɪ/；其余多数读 /iː/（teach、meat、please）。',
      },
      {
        front: '哪些 oo 读短音 /ʊ/？',
        back: 'book、good、look、foot、cook 读 /ʊ/；food、moon、school、soon 读长音 /uː/。口诀：好书的脚 cook 得不错——book、good、foot、cook 读短音。',
      },
      {
        front: 'school 的 ch 读什么？',
        back: '读 /k/：s**ch**ool、**Ch**ristmas、heada**ch**e。其余多数 ch 读 /tʃ/，如 chair、much、teach。',
      },
    ],
  },
  {
    id: 'eng-l02',
    subject: 'english',
    chapter: '语音与词汇',
    title: '核心词汇与短语动词：高频词、介词搭配、词根词缀',
    minutes: 35,
    importance: '重要',
    content: `## 单词背多少、怎么背
大纲词汇约 3800 个，但成考英语约 80% 的分数来自其中 **2000 个高频词**。零基础不必追求全背，策略是：
1. **先背高频**：动词、形容词、高频名词优先，生僻学术词直接放弃；
2. **词根词缀拆着记**：un-（不）→ un**happy** 不开心、un**able** 不能；re-（再）→ **re**tell 复述、**re**build 重建；dis-（相反）→ **dis**like 不喜欢、**dis**appear 消失；-tion（名词后缀）→ educate → educa**tion** 教育；-able（可……的）→ comfort**able** 舒适的；-less（没有）→ care**less** 粗心的；-ful（充满）→ care**ful** 仔细的；
3. **在真题句子里重复**：一个词见 5~7 遍才算记住，孤立抄单词效率最低。

## 六大常考动词构成的短语
| 动词 | 常考短语（务必成对记意思） |
| --- | --- |
| take | take **off** 脱下/起飞；take **place** 发生；take **part in** 参加；take **care of** 照顾；take **up** 占据、开始从事 |
| put | put **on** 穿上；put **off** 推迟；put **up** 张贴、搭建；put **out** 扑灭；put **up with** 忍受 |
| look | look **for** 寻找；look **after** 照顾；look **up** 查阅；look **forward to** 盼望（后接 doing）；look **out** 当心 |
| turn | turn **on/off** 打开/关上；turn **up** 出现、调大；turn **down** 拒绝、调小；turn **out** 结果是 |
| come | come **up with** 想出（主意）；come **across** 偶然遇见；come **true** 实现；come **from** 来自 |
| go / get | go **over** 复习；go **on** 继续；get **up** 起床；get **on/along with** 与……相处；get **rid of** 摆脱；get **over** 克服 |

## 介词 in / on / at / by / with / for 怎么区分
- **in**：年、月、季节、泛指早中晚 → in 2026、in May、in summer、in the morning；
- **on**：具体某一天及某天的早中晚 → on Monday、on May 1st、**on Sunday morning**；
- **at**：具体时刻 → at six o'clock、at noon、at night；
- **by**：不迟于、通过某种方式 → by ten o'clock、by bus、by working hard；
- **with**：用工具、带着 → with a knife、with a smile；
- **for**：接一段时间、为了 → for two hours、Thank you **for** your help。
> 口诀：**at 点、in 段、on 天；with 工具，by 期限。**（某天的早中晚仍用 on）

## 形近词与词义辨析三技巧
1. **先看词性**：-tion/-ment/-ness 是名词，-ful/-ous/-ive 是形容词，-ly 多是副词，词性不对先排除；
2. **抓固定搭配**：listen **to**、arrive **at/in**、depend **on**、be interested **in**、be good **at**、pay attention **to**；
3. **用词缀猜褒贬**：un-/dis- 开头多为否定，-less 表"没有"，可用来排除感情色彩不符的选项。

> 提醒：look forward **to**、be used **to** 的 to 是介词，后面接 **doing**；而 used to + do 表示"过去常常做"。这是语法和词汇题的双高频考点。

## 补充：四组高频动词搭配
- **say / tell / speak / talk**：say + 说的内容（say goodbye）；tell sb sth 告诉某人某事（tell me the truth）；speak + 语言、speak to sb；talk to/with sb about sth 与某人谈论某事；
- **make / do**：make a mistake、make friends、make progress、make a decision；do one's homework、do the shopping、do sports、do sb a favour 帮某人一个忙；
- **arrive / get / reach**：arrive **at**（小地点）/ **in**（大地点）、get **to** + 地点、reach 直接接宾语（reach Beijing）；
- **borrow / lend / keep**：borrow sth **from** sb 借入；lend sth **to** sb 借出；借多久用 keep：You can **keep** it for two days.（for + 时间段 → 用延续动词）`,
    keyPoints: [
      '高频 2000 词覆盖约 80% 分数，优先背动词、形容词、高频名词',
      'un-/re-/dis-/-tion/-able/-less/-ful 词缀可猜词义、猜褒贬',
      'take off 脱下/起飞；put off 推迟；turn down 拒绝/调小；come up with 想出',
      'look forward to + doing；be used to + doing；used to + do（过去常常）',
      'in + 年月季节，on + 具体某天（on Sunday morning），at + 时刻',
      'by + 时间点表"不迟于"，by bus 表方式；with + 工具；for + 时间段',
      'listen to / depend on / be interested in / be good at 高频固定搭配',
    ],
    cards: [
      {
        front: 'put off 和 put up with 分别什么意思？',
        back: 'put **off** 推迟：The meeting was put off. 会议被推迟了；put **up with** 忍受：I cannot put up with the noise.',
      },
      {
        front: 'look forward to 后面接什么形式？',
        back: '接 doing（to 是介词）：I look forward to **hearing** from you. 盼望收到你的来信。',
      },
      {
        front: 'in / on / at 的时间用法口诀？',
        back: 'at 点、in 段、on 天：at 7:00、in May、in winter、on Monday。某天的早中晚仍用 on：**on** Sunday morning。',
      },
      {
        front: 'un- 和 dis- 开头的词是什么色彩？',
        back: '否定：unhappy 不开心、unfair 不公平；dislike 不喜欢、disagree 不同意。可用来排除褒义选项。',
      },
      {
        front: 'turn up 和 turn down 各两个意思？',
        back: 'turn up 调大/出现；turn down 调小/拒绝：He turned down my invitation. 他拒绝了我的邀请。',
      },
      {
        front: 'take part in 与 join 的区别？',
        back: 'take part in + 活动（参加会议、比赛）；join + 组织或人群：join the Party 入党、join us 加入我们。',
      },
    ],
  },
  {
    id: 'eng-l03',
    subject: 'english',
    chapter: '核心语法',
    title: '动词时态与被动语态：八大时态、标志词表、be + done',
    minutes: 45,
    importance: '核心',
    content: `## 先说人话
时态就是回答两个问题：**什么时候发生**（过去/现在/将来）和**进行到什么程度**（一般/进行/完成）。中文靠"了、正在、已经"，英文靠**动词变形**。所以零基础做题只需要盯两样东西：**句中的时间标志词**和**上下文其他动词的时态**。

## 八种常考时态总表
| 时态 | 结构 | 标志词 | 例句 |
| --- | --- | --- | --- |
| 一般现在 | do / does | every day, usually, often, always, sometimes | He **goes** to school by bus every day. |
| 一般过去 | did | yesterday, last week, ...ago, in 2010 | I **visited** Beijing last year. |
| 一般将来 | will do / be going to | tomorrow, next week, in + 一段时间 | We **will meet** at seven tomorrow. |
| 现在进行 | am/is/are doing | now, at the moment, Look! Listen! | Listen! Someone **is singing**. |
| 过去进行 | was/were doing | at that time, at eight yesterday | I **was reading** when he called. |
| 现在完成 | have/has done | already, just, yet, ever, never, since, for, so far | She **has lived** here since 2010. |
| 过去完成 | had done | by the end of last..., by then | They **had built** two schools by the end of last year. |
| 过去将来 | would do | said / told 之后的从句 | He said he **would come** the next day. |

## 三条高频规则
1. **主将从现**：if、when、before、after、as soon as 引导的条件/时间从句用一般现在时表将来 → If it **rains** tomorrow, we **will stay** at home.
2. **since + 时间点，for + 时间段**：He has been away **since 2010** / **for ten years**。leave、come、buy 等短暂动词不能与时间段连用（说 has **been** away，不说 has left for ten years）；
3. **过去完成 = 过去的过去**：两个过去的动作，先发生的用 had done → When I got there, the train **had left**.

## 被动语态：be + 过去分词（done）
主语是动作的承受者时用被动。**"be"按上面的时态变形，后面永远是 done**：
| 时态 | 被动结构 | 例句 |
| --- | --- | --- |
| 一般现在 | am/is/are done | English **is spoken** here. |
| 一般过去 | was/were done | The bridge **was built** in 1990. |
| 一般将来 | will be done | A new park **will be built** next year. |
| 现在完成 | have/has been done | The work **has been finished**. |
| 情态动词 | can/must be done | The word **can be found** in the dictionary. |
> 判断口诀：**主语自己不会发出这个动作，就选被动**——英语不会自己"说"，桥不会自己"建"。

## 易错点
- have **gone to** 去了（人还没回来）vs have **been to** 去过（已经回来）；
- 时间、条件从句里不用将来时（主将从现）；
- 被动里别漏 be：will **be built** 才对，will built 是错的。

## 补充：现在完成时 vs 一般过去时
- 一般过去时只陈述"过去做了什么"，常与明确的过去时间连用：I **visited** Beijing **last year**.；
- 现在完成时强调"对现在的影响"，**不能**与 yesterday、last week、in 2010 等明确过去时间连用：I **have visited** Beijing twice.（去过两次）；
- 问"多久了"用 How long **have** you...?（答 for/since）；问"什么时候"用 When **did** you...?（答过去时间）。

## 补充：宾语从句的时态呼应
主句是过去时（said / asked / thought / knew），从句要用相应的过去时态：He said he **was** busy. / She told me she **would come** the next day. / He asked where I **had put** the key. 若从句内容是客观真理，仍用一般现在时：The teacher said light **travels** faster than sound.`,
    keyPoints: [
      '标志词直接定时态：ago/last→过去；now/Look!→现在进行；since/for/already→现在完成',
      'by the end of last... / by then → 过去完成 had done（过去的过去）',
      '主将从现：if/when/as soon as 从句用一般现在时表将来',
      '现在完成时要用延续性动词：has been away for ten years，不说 has left for ten years',
      '被动 = be 的新时态 + done：is spoken / was built / will be built / has been finished / can be found',
      '主语是动作承受者（英语被说、桥被建）优先考虑被动',
      'have gone to 去了没回；have been to 去过已回',
    ],
    cards: [
      {
        front: 'since 和 for 怎么区分？',
        back: 'since + 过去时间点（since 2010），for + 时间段（for ten years），两者都配现在完成时 have/has done。',
      },
      {
        front: '什么时候用过去完成时？',
        back: '过去的过去：两个过去动作，先发生的用 had done。When I arrived, the meeting **had begun**.',
      },
      {
        front: '"这座桥明年建成"怎么说？',
        back: 'A new bridge **will be built** next year. 将来时被动 = will be + 过去分词。',
      },
      {
        front: '主将从现指什么？',
        back: 'if/when/before/as soon as 从句中用一般现在时表将来：If it **rains**, I **will stay** at home.',
      },
      {
        front: 'Look! 和 Listen! 开头的句子用什么时态？',
        back: '现在进行时 am/is/are doing：Listen! The baby **is crying**.',
      },
      {
        front: 'have gone to 与 have been to 的区别？',
        back: 'have **gone to** 去了还没回来（人不在此地）；have **been to** 去过已回来：I have been to Beijing twice.',
      },
    ],
  },
  {
    id: 'eng-l04',
    subject: 'english',
    chapter: '核心语法',
    title: '非谓语动词：to do / doing / done 作主宾定状',
    minutes: 45,
    importance: '核心',
    content: `## 先说人话
一个英文句子只允许一个"正式"的谓语动词，其余动作必须"换装"：**to do（不定式）、doing（动名词/现在分词）、done（过去分词）**，统称非谓语动词。语法词汇 15 题里几乎每年考 4~5 题，是最大的得分点，务必吃透。

## 一、三种形式各自的"性格"
| 形式 | 含义色彩 | 常见身份 |
| --- | --- | --- |
| to do | 将要做、目的 | 宾语（want to do）、后置定语、目的状语 |
| doing | 主动、正在进行 | 宾语（enjoy doing）、定语、状语 |
| done | 被动、完成 | 定语、状语 |

## 二、作宾语：背熟三组搭配
1. **enjoy、finish、mind、keep、practise、avoid、miss、suggest、give up、can't help** + doing → He enjoys **playing** basketball. / Would you mind **opening** the window?
2. **want、decide、hope、wish、plan、agree、refuse、learn、promise** + to do → I hope **to see** you again.
3. 一词两义四组：remember **to do** 记得要做 vs remember **doing** 记得做过；forget 同理；stop **to do** 停下来去做另一件事 vs stop **doing** 停止正在做的事；try **to do** 努力做 vs try **doing** 试着做。
> 口诀：**enjoy/mind/finish 三兄弟全带 ing；want/decide/hope 三兄弟全带 to。**

## 三、作定语（放在名词后面）
- doing 后置（主动）：the boy **standing** there 站在那儿的男孩；
- done 后置（被动）：the film **shown** last night 昨晚放映的电影；
- to do 后置：I have a lot of work **to do**. / He has something important **to tell** you.

## 四、分词作状语（重点难点）
句首 Doing/Done 的逻辑主语必须等于主句主语：
- 主语**主动**发出动作 → **Doing**：**Walking** along the street, I met an old friend.（是"我"在走）；
- 主语**被动**承受动作 → **Done**：**Seen** from the hill, the city looks beautiful.（城市"被看"）；
- 否定式把 Not 放最前：**Not knowing** his address, I couldn't write to him.；
- 表目的用不定式：He got up early **to catch** the train.

## 五、固定句式与高频陷阱
- see/hear/watch sb **do** 看到全过程 vs sb **doing** 看到正在做；
- make/let/have sb **do**（省略 to）：Let me **help** you；
- be worth **doing**、be busy **doing**、spend time **doing**、It takes sb time **to do**、Why not **do**...?、had better **do**、would rather **do** than **do**；
- 大陷阱：look forward **to**、be used **to** 的 to 是介词 → I'm used to **getting** up early.（习惯于）；而 used to **do** = 过去常常做。

## 补充：动名词高频短语（整体背下来）
- be busy **doing** 忙于；have fun / have a good time **doing**；have difficulty / trouble **doing** 做某事有困难；
- spend + 时间/金钱 **doing**；pay attention to **doing**；be worth **doing** 值得做；
- thank sb for **doing**；what about / how about **doing**?……怎么样；instead of **doing** 而不是做某事；
- prevent / stop sb **(from) doing** 阻止某人做某事；can't help **doing** 忍不住做某事。

## 补充：三个可以互相转换的句型
1. too...to do 太……而不能：He is **too** young **to go** to school.；
2. 形容词 + enough to do 足够……能够：He is old **enough to go** to school.；
3. so...that / such...that 如此……以至于：He is **so** young **that** he can't go to school.
> 这三句表达同一意思，是选择题里经典的"同义句转换"考点，记住一个就能推出另外两个。`,
    keyPoints: [
      '一句一谓语，多余动作变 to do / doing / done',
      'enjoy/finish/mind/keep/practise/avoid/suggest + doing；want/decide/hope/agree/refuse + to do',
      'remember to do 记得要做 ≠ remember doing 记得做过；stop to do 停去另一事 ≠ stop doing 停止',
      '分词作状语：主句主语主动用 Doing，被动用 Done，否定式 Not 放最前（Not knowing）',
      'something/anything/nothing 后用 to do 作定语：something to eat',
      'make/let/have + sb + 动词原形（省 to）；see sb do 全过程 vs see sb doing 正在做',
      'look forward to / be used to + doing；used to + do 过去常常',
    ],
    cards: [
      {
        front: 'enjoy 后面接什么？',
        back: '接 doing：I enjoy **reading**. 同组：finish、mind、keep、practise、avoid、give up、can\'t help。',
      },
      {
        front: 'Would you mind ______ (close) the window?',
        back: '填 **closing**。mind + doing：Would you mind closing the window? 回答 Not at all 表不介意。',
      },
      {
        front: '句首用 Done 开头说明什么？',
        back: '逻辑主语（主句主语）与该动作是被动关系：**Seen** from the hill, the park looks small. 公园是被看的。',
      },
      {
        front: 'He stopped ______ (have) a rest.',
        back: '填 **to have**。stop to do 停下来去做（另一件事）；stop doing 停止正在做的事。',
      },
      {
        front: 'I\'m looking forward to ______ (hear) from you.',
        back: '填 **hearing**。look forward to 的 to 是介词，后接 doing。be used to + doing 同理。',
      },
      {
        front: 'Let me ______ (help) you.',
        back: '填 **help**。make/let/have + sb + 动词原形，省略 to。',
      },
    ],
  },
  {
    id: 'eng-l05',
    subject: 'english',
    chapter: '核心语法',
    title: '定语从句：who / which / that / where / when 选用',
    minutes: 35,
    importance: '重要',
    content: `## 先说人话
定语从句就是一个**跟在名词后面当形容词用的句子**。被修饰的名词叫**先行词**，起连接作用的词叫**关系词**。做题只需回答两个问题：**先行词是人、物、时间、地点中的哪一个？从句里缺不缺主语或宾语？**

## 关系代词：从句缺主语或宾语时用
| 关系词 | 指代 | 例句 |
| --- | --- | --- |
| who | 人，作主语 | The man **who** is standing there is my teacher. |
| whom | 人，作宾语（可省） | The girl (whom) I met yesterday is my cousin. |
| whose | 人/物，表所属 | Do you know the boy **whose** father is a doctor? |
| which | 物 | The book **which** I bought is interesting. |
| that | 人或物 | This is the best film **that** I have ever seen. |

## 关系副词：从句不缺主宾、缺"状语"时用
- **where**（地点）：This is the house **where** I lived ten years ago.（= in which）；
- **when**（时间）：I still remember the day **when** we first met.（= on which）；
- **why**（原因）：Nobody knows the reason **why** he was late.

## 只能用 that 的三种情况
1. 先行词是 all、everything、nothing、anything、little、much：All **that** glitters is not gold.；
2. 先行词被序数词、最高级、the only、the very 修饰：It is the first book **that** tells the story.；
3. 先行词"人 + 物"并列：the people and things **that** I remember。

## 介词 + which / whom
介词后面不能用 that，只能 which（物）或 whom（人）：the house **in which** I lived；the friend **with whom** I worked。判断方法：找从句动词的固定搭配 → lived **in** the house → in which。

## 三步解题法
1. 找**先行词**：人？物？时间？地点？
2. 看从句缺什么：**缺主语或宾语 → which/who/that；不缺主宾 → where/when/why**；
3. 有逗号（非限制性）不能用 that；介词后只能 which/whom。

> 易错点对比：the days **when** we lived there（live 不及物，缺状语）vs the days **which/that** we spent together（spend 及物，缺宾语）。差别全在从句动词后面有没有宾语。

## 例题带解析
The woman ______ is selling vegetables by the road is my aunt.
A. which　B. who　C. whom　D. whose
> 解析：先行词 the woman 是人，从句缺主语（______ is selling...）→ 选 who（B）。whom 只作宾语；whose 后面必须接名词；which 指物。

## 补充：定语从句中的主谓一致
关系代词在从句中作主语时，从句谓语动词与**先行词**保持一致：
- He is the only one of the students who **knows** the answer.（唯一知道答案的那个学生 → 单数）；
- He is one of the students who **know** the answer.（知道答案的学生之一 → 复数）。
这是成考中难度较高的经典陷阱：看到 the only one / one of 先判断先行词到底是"一个"还是"那些学生"。

## 补充：that 与 which 的选择倾向
- 优先 that：先行词被 all, any, every, no, little, much 修饰，或被序数词、最高级修饰时；
- 必须用 which：非限制性从句（逗号之后）、介词之后；
- 关系代词作从句**宾语**时可以省略：The book (which/that) I bought yesterday is good.；作**主语**时不能省略。`,
    keyPoints: [
      '先行词是人用 who/whom/whose，是物用 which，人和物都可用 that',
      '从句缺主语或宾语 → 关系代词；不缺 → where/when/why',
      'whose + 名词表所属：the boy whose father is a doctor',
      '先行词为 all/everything/nothing 或被最高级、the only、the very 修饰时用 that',
      '介词后只能用 which/whom：in which = where，on which = when',
      'spent together 缺宾语用 which；lived there 缺状语用 where',
      '非限制性定语从句（有逗号）不能用 that',
    ],
    cards: [
      {
        front: '什么时候用 where 引导定语从句？',
        back: '先行词是地点且从句不缺主宾：This is the school **where** I studied. = in which。',
      },
      {
        front: 'the days ______ we spent together 填什么？',
        back: '填 **which/that**。spend 是及物动词，从句缺宾语；若从句完整（we lived there）才用 when。',
      },
      {
        front: '只用 that 的三种情况？',
        back: '先行词是 all/everything/nothing 等；被序数词/最高级/the only/the very 修饰；先行词人和物并列。',
      },
      {
        front: 'whose 怎么用？',
        back: '表"谁的"，后接名词：Do you know the girl **whose** mother is a nurse?',
      },
      {
        front: '介词后能用 that 吗？',
        back: '不能。介词 + which（物）/ whom（人）：the pen **with which** I write。',
      },
      {
        front: '有逗号的定语从句注意什么？',
        back: '不能用 that：Beijing, **which** is the capital of China, is beautiful.（非限制性）',
      },
    ],
  },
  {
    id: 'eng-l06',
    subject: 'english',
    chapter: '核心语法',
    title: '名词性从句与状语从句：what 的用法、九类连词',
    minutes: 35,
    importance: '重要',
    content: `## 先说人话
**名词性从句** = 把一个整句当作**名词**用（当主语、宾语、表语），考"选什么引导词"；**状语从句** = 用连词把两个句子按时间、条件、原因等关系连起来，考"选什么连词"。

## 一、名词性从句引导词
| 引导词 | 用法 | 例句 |
| --- | --- | --- |
| that | 从句完整，无实义 | I know **that** he is right. |
| what | 从句缺主语或宾语（= ...的东西） | I don't know **what** he said. / **What** he needs is time. |
| whether / if | 表"是否" | I wonder **whether** he will come. |
| who/when/where/why/how | 保留疑问意义 | Do you know **where** he lives? |
> 判断口诀：**从句缺主语或宾语就选 what；句子完整、只缺"是否"就选 whether/if；完整且无疑问用 that。**

## 二、whether 与 if 的分工
以下情况用 **whether**：介词之后（It depends on **whether** he agrees.）、句首主语从句（**Whether** he will come is unknown.）、不定式前（whether to go）、与 or not 连用（I don't know **whether or not** he is at home.）。

## 三、it 作形式主语 / 形式宾语
**It** is important that we learn English.（真正主语后移）/ I find **it** hard to get up early.（真正宾语后移）

## 四、状语从句九类连词
| 类别 | 连词 | 例句 |
| --- | --- | --- |
| 时间 | when, while, as, before, after, until, as soon as, since | I'll call you **as soon as** I arrive. |
| 条件 | if, unless, as long as | **Unless** it rains, we'll go out. |
| 原因 | because, since, as, now that | He didn't come **because** he was ill. |
| 让步 | although, though, even if, however, no matter what | **Although** he is rich, he lives simply. |
| 目的 | so that, in order that | She spoke slowly **so that** we could follow her. |
| 结果 | so...that, such...that | It was **so** cold **that** the river froze. |
| 比较 | than, as...as | He is taller **than** I. |
| 方式 | as, as if | Do it **as** I told you. |
| 地点 | where, wherever | Sit **where** you like. |

## 五、易混辨析
- **although/though 不与 but 连用，because 不与 so 连用**：中文"虽然……但是"是两个词，英文只能留一个；
- **so + 形容词/副词，such + 名词**：so beautiful / such a beautiful day；
- **not...until** 直到……才：He didn't go to bed **until** his mother came back.；
- **unless** = if...not 除非：**Unless** you hurry, you'll miss the bus.

## 补充：宾语从句三要素（成考最爱考）
1. **连接词**：陈述句用 that（可省）；一般疑问句用 if / whether；特殊疑问句保留原来的疑问词；
2. **语序**：从句一律用**陈述语序**：Do you know **where he lives**?（绝不说 where does he live）；
3. **时态**：主句过去时 → 从句用相应的过去时态；从句内容是客观真理 → 仍用一般现在时。

## 例题带解析
Do you know ______?
A. where does he live　B. where he lives　C. he lives where　D. where he live
> 解析：宾语从句必须用陈述语序，排除 A；从句主语 he 是第三人称单数，谓语用 lives → 选 B（where he lives）。译文：你知道他住在哪里吗？

## 补充：until 的两种句型
- 肯定句 + until：动作一直持续到某时刻：Wait **until** he comes back.（等到他回来）；
- not...until：直到……才：He **didn't** leave **until** the rain stopped.（雨停了他才离开）。`,
    keyPoints: [
      '从句缺主语或宾语用 what（= ...的东西），句子完整用 that，"是否"用 whether/if',
      'whether 用于：介词后、句首主语从句、不定式前、与 or not 连用',
      'although 不与 but 连用，because 不与 so 连用',
      'so + 形容词/副词；such + 名词（so beautiful / such a beautiful day）',
      'so that 表目的，后常接 can/could；unless = if...not',
      'not...until 直到……才；as soon as 一……就……',
      'it 作形式主语/宾语：I find it hard to get up early.',
    ],
    cards: [
      {
        front: 'I don\'t know ______ he said just now. 填什么？',
        back: '填 **what**。said 缺宾语。what he said = 他说的话。从句缺主语/宾语就用 what。',
      },
      {
        front: '什么时候必须用 whether 不用 if？',
        back: '介词后（It depends on whether...）、句首主语从句、不定式前、与 or not 连用时。',
      },
      {
        front: 'so...that 与 such...that 怎么选？',
        back: 'so + 形容词/副词：**so** tired that...；such + 名词：**such** a good film that...。',
      },
      {
        front: '"他努力学习是为了通过考试"用哪个连词？',
        back: 'so that：He studies hard **so that** he can pass the exam. 目的状语从句，后面常有 can/could。',
      },
      {
        front: 'although 和 but 能一起用吗？',
        back: '不能。二选一：**Although** he is old, he works hard. 或 He is old, **but** he works hard.',
      },
      {
        front: 'unless 什么意思？',
        back: '除非 = if...not：**Unless** you hurry, you\'ll miss the bus. = If you don\'t hurry, ...',
      },
    ],
  },
  {
    id: 'eng-l07',
    subject: 'english',
    chapter: '核心语法',
    title: '虚拟语气：if 三种条件句、wish、suggest 后的虚拟',
    minutes: 30,
    importance: '重要',
    content: `## 先说人话
虚拟语气说的是"**与事实相反的话**"：如果我是你（我不是你）、要是我当时知道了（当时并不知道）。英语的办法是让动词"降级"——**越不真实，动词形式越往前退一步**：说现在的事用过去式，说过去的事用 had done。

## 一、if 三种条件句公式表（必背）
| 假设类型 | if 从句 | 主句 | 例句 |
| --- | --- | --- | --- |
| 与现在事实相反 | 过去式（be 一律用 were） | would/could/might + do | If I **were** you, I **would accept** the offer. |
| 与过去事实相反 | had done | would/could/might + have done | If he **had come** earlier, he **would have caught** the train. |
| 与将来事实相反 | should/were to + do（或过去式） | would + do | If it **should rain**, we **would stay** at home. |
> 零基础先死记前两行：**现在反 → 过去式 + would do；过去反 → had done + would have done**。

## 二、省略 if 的倒装
从句里有 were、had、should 时可以省略 if 并把它们提到句首：**Were** I you... / **Had** he known... / **Should** it rain...。见到句首 Were/Had/Should 开头，直接判定为虚拟语气。

## 三、wish 后的从句（愿望与现实相反）
- 现在：I wish I **were** a bird.（可惜不是）；
- 过去：I wish I **had gone** to the party.（可惜没去）；
- 将来：I wish I **could fly** tomorrow.

## 四、suggest / demand 等词后接 (should) + 动词原形
| 触发词 | 例句 |
| --- | --- |
| 建议：suggest, advise, propose | The doctor suggested that he (should) **stop** smoking. |
| 要求/命令：demand, require, request, insist, order | They demanded that the work (should) **be done** at once. |
| It is important/necessary/strange that... | It is important that we (should) **learn** English well. |
> 口诀：**一坚持（insist）、二命令（order, demand）、三建议（suggest, advise, propose）、四要求（require, request, ask, demand）**——后面的从句用 (should) + 动词原形，should 可省略。

## 五、其他固定虚拟
- would rather + 过去式：I would rather you **came** tomorrow.；
- It is (high) time that + 过去式：It is time we **went** home.；
- if only 要是……就好了：If only I **knew** the answer.

## 易错点
- suggest 表"表明、说明"时不用虚拟：The smile suggested that he **was** pleased.；insist 表"坚持认为（事实）"同样不用虚拟；
- 主句 would 后面忘接动词原形（would accepts 是错的，要 would accept）。

## 例题带解析
If he ______ harder last term, he would have passed the exam.
A. studied　B. had studied　C. studies　D. would study
> 解析：主句 would have passed 是"与过去事实相反"的标志 → 从句用 had studied（B）。公式：If + had done, ... would have done。译文：如果他上学期学习更努力些，考试就通过了。

## 补充：as if / as though 后的虚拟
He talks as if he **knew** everything.（说话好像什么都知道——实际并不知道）/ She looked as if she **had seen** a ghost.（好像见了鬼似的——过去的过去用 had done）。

## 补充：without / but for 引起的含蓄虚拟
没有 if 也能表虚拟：**Without** your help, I couldn't have finished the work on time.（= **But for** your help, ... 没有你的帮助，我不可能按时完成工作。）句式特征：主句出现 would have done / couldn't have done 时，往前找"假设的条件"。`,
    keyPoints: [
      '与现在相反：if + 过去式（be 用 were），主句 would/could/might + do',
      '与过去相反：if + had done，主句 would have done',
      'wish + 过去式（现在）/ had done（过去）/ could do（将来）',
      'suggest/demand/order/insist/require + that + (should) + 动词原形',
      'It is important/necessary/strange that + (should) + 动词原形',
      '句首 Were/Had/Should = 省略 if 的虚拟倒装',
      'would rather + did；It is (high) time that + did',
    ],
    cards: [
      {
        front: 'If I ______ (be) you, I would go.',
        back: '填 **were**。与现在事实相反，be 一律用 were，不管主语是 I、he 还是 she。',
      },
      {
        front: '与过去事实相反的公式？',
        back: 'If + had done, ... would have done：If you **had come**, you **would have seen** him.',
      },
      {
        front: 'I wish I ______ (can) fly.',
        back: '填 **could**。wish 表现在/将来愿望用过去式或 could；表过去愿望用 had done。',
      },
      {
        front: 'The teacher suggested that we ______ (preview) the text.',
        back: '填 **(should) preview** 动词原形。建议/命令/要求类词后从句用 should + 原形，should 可省。',
      },
      {
        front: 'It is necessary that he ______ (return) at once.',
        back: '填 **(should) return**。It is important/necessary/strange that... 后接虚拟（should + 原形）。',
      },
      {
        front: '"Had he known" 开头说明什么？',
        back: '省略了 if 的虚拟倒装，= **If he had known**...，与过去事实相反。',
      },
    ],
  },
  {
    id: 'eng-l08',
    subject: 'english',
    chapter: '核心语法',
    title: '倒装、强调与主谓一致',
    minutes: 30,
    importance: '重要',
    content: `## 先说人话
正常英语语序是"主语 + 谓语"。但有些情况下必须把（助）动词提到主语前面，这就是**倒装**。成考倒装考点很集中：几个"哨兵词"一出现就该倒装。**强调句**和**主谓一致**也是每年必考的送分点。

## 一、必倒装的五种情况
1. **only + 状语**放句首：**Only then did I** realize my mistake. / **Only in this way can we** learn English well.；
2. **so / neither / nor** 表"也（不）"：I like tea, and **so does** he. / He can't swim, and **neither can** I.。注意区分：**So he did.**（他确实如此，指同一人，不倒装）vs **So did he.**（他也一样，指另一人，倒装）；
3. **否定副词**句首：never, seldom, hardly, little, not only, not until → **Never have I seen** such a thing.；
4. **hardly...when / no sooner...than**（一……就……）：**Hardly had** he arrived **when** it began to rain. / **No sooner had** he left **than** the phone rang.（前 hard 后 when，前 sooner 后 than，搭配别记反）；
5. **so/such...that** 中 so/such 提前：**So fast did** he run **that** nobody could catch him.

## 二、强调句 It is/was...that
公式：**It is/was + 被强调部分 + that/who + 其余部分**。
判别法（考得最多）：**去掉 It is...that，剩余部分能还原成完整句子 → 强调句**。
- It was **in Beijing** that I met her.（去掉后 = I met her in Beijing，完整 → 强调句）；
- 强调人时可用 who：It was I **who** broke the window.；
- 即使强调的是地点或时间也用 **that**：It was in 2010 **that** I left home.（此处不用 when）。

## 三、主谓一致三原则
1. **语法一致**：The number of students **is** growing.（……的数量）；
2. **意义一致**：family, team, class 看整体用单数、看成员用复数；police, people, cattle 恒用复数；news, maths, physics, the United States 看似复数实为单数；twenty years、five miles 作为整体时间段/距离用单数；
3. **就近原则**：there be、either...or、neither...nor、not only...but also 谓语与最近的主语一致 → **Neither** he nor I **am** wrong. / **There is** a pen and two books on the desk.

## 四、高频易错
- with / together with / as well as / along with + 名词：谓语**跟前面的主语** → The teacher as well as the students **is** here.；
- **a number of** + 复数名词（许多）→ 谓语复数；**the number of** + 复数名词（……的数量）→ 谓语单数；
- each, every, either, neither + 单数名词 + 单数谓语。

## 例题带解析
Not until he came back ______ the truth.
A. I knew　B. did I know　C. I did know　D. do I know
> 解析：not until 置于句首，主句要部分倒装（助动词提前），且 came back 是过去时 → did I know（B）。译文：直到他回来，我才知道真相。

## 补充：倒装里 so 的两种用法再辨
- **So he did.** 他确实如此（主语不变，不倒装，so = indeed）；
- **So did he.** 他也一样（换主语，倒装，so = also）；
- **So + 形容词/副词**放句首倒装：So loudly **did he speak** that everyone heard him.；**Such + 名词短语**放句首倒装：Such a noise **was there** that we couldn't hear each other.

## 补充：主谓一致再补两条
- 分数 / 百分数 + of + 名词：谓语与 of 后面的名词一致：Two thirds of the water **is** polluted. / Two thirds of the students **are** from the south.；
- a lot of / plenty of + 名词同理：A lot of work **has** been done. / A lot of people **were** there.`,
    keyPoints: [
      'Only + 状语句首 → 部分倒装：Only then did I realize... / Only in this way can we...',
      'so/neither + 助动词 + 主语表"也（不）"；So he did 表"确实如此"不倒装',
      '否定词 never/seldom/hardly/little/not only/not until 句首倒装',
      'Hardly...when / No sooner...than：Hardly had he arrived when...（搭配别记反）',
      '强调句判别：去掉 It is...that 后句子仍完整；强调地点时间也用 that',
      'with/as well as + 名词谓语跟就前主语；the number of 单数、a number of 复数',
      'there be / either...or / neither...nor 遵循就近原则',
    ],
    cards: [
      {
        front: 'Only in this way ______ we succeed. 填什么？',
        back: '填 **can**（Only in this way **can we** succeed.）。Only + 状语放句首，助动词提到主语前。',
      },
      {
        front: 'So did he 和 So he did 的区别？',
        back: 'So did he. 他也一样（另一人，倒装）；So he did. 他确实如此（同一人，不倒装）。',
      },
      {
        front: 'Hardly ______ he arrived when it rained.',
        back: '填 **had**：Hardly **had** he arrived when... "一……就……"，hardly 后接 had done。',
      },
      {
        front: '怎么判断强调句？',
        back: '去掉 It is/was 和 that，剩下的能组成完整句子就是强调句：It was in 2010 that I met him.',
      },
      {
        front: 'The number of students ______ (be) large.',
        back: '填 **is**。the number of（……的数量）谓语用单数；a number of（许多）谓语用复数。',
      },
      {
        front: 'Neither he nor I ______ (be) wrong.',
        back: '填 **am**。neither...nor 遵循就近原则，谓语与最近的主语 I 一致。',
      },
    ],
  },
  {
    id: 'eng-l09',
    subject: 'english',
    chapter: '核心语法',
    title: '名词、冠词、代词、数词、比较级与情态动词推测',
    minutes: 35,
    importance: '重要',
    content: `## 一、可数与不可数：量词搭配
| 修饰对象 | 常用词 |
| --- | --- |
| 只修饰可数名词 | many, few, a few, several, a number of |
| 只修饰不可数名词 | much, little, a little, a great deal of |
| 两者皆可 | some, any, a lot of, lots of, plenty of |
- **few（几乎没有，否定）vs a few（有几个，肯定）**：He has few friends.（没什么朋友）/ He has a few friends.（还有几个朋友）；little / a little 同理，只接不可数名词。
- 常考**不可数名词**（永远不加 s）：information, advice, news, weather, furniture, progress, homework, equipment。计量用 a piece of advice / two pieces of information。

## 二、冠词 a / an / the 与零冠词
- **a 还是 an 看发音不看拼写**：**an** hour、**an** honest man（h 不发音）；**a** university、**a** European（u 读 /juː/）；
- **the**：特指；序数词、最高级前；乐器前（play **the** piano）；the + 形容词表一类人（the rich 富人）；
- **零冠词**：球类运动（play basketball）、三餐（have breakfast）、学科（study English）、by + 交通工具（by bus）、泛指复数名词。
> 口诀：**球类三餐零冠词，乐器要 the 记心间。**

## 三、other 家族代词
- **one...the other**（两者）：One is red, **the other** is blue.；
- **some...others**（无范围）：Some like tea, **others** like coffee.；
- **the others**（剩下的全部）：Two students are here; **the others** are on the playground.；
- **another**（三者以上"另一个/再一个"）：Would you like **another** cup of tea?

## 四、数词
- hundred / thousand / million 前有具体数字**不加 s 不加 of**：two hundred students；表模糊数量则加 s + of：**hundreds of** 成百上千；
- 分数：分子用基数词、分母用序数词、分子超过 1 分母加 s：1/3 one third，2/3 two thirds。

## 五、比较级与最高级
- **the more..., the more...**（越……越……）：**The more** you practise, **the better** you will write.；
- **as + 原级 + as**：He is as tall as his father. / not so...as 不如……；
- **倍数**：three times as large as = three times larger than；
- 比较级前加 much, even, far, a little（much better，不能说 very better）；两者中较……的用 **the + 比较级 + of the two**：He is the taller of the two.

## 六、情态动词表推测与责备（+ have done）
| 结构 | 含义 | 例句 |
| --- | --- | --- |
| must have done | 过去肯定做了（把握大） | The ground is wet. It **must have rained** last night. |
| can't have done | 过去不可能做了（must 的否定用 can't） | He **can't have finished** it so soon. |
| may/might have done | 过去也许做了 | She **may have missed** the bus. |
| should have done | 本应该做而没做（责备） | You **should have come** earlier. |
| needn't have done | 本不必做却做了 | You **needn't have worried**. |

## 例题带解析
1. ______ people took part in the activity.
A. Two hundreds　B. Hundred of　C. Hundreds of　D. Two hundred of
> 解析：表模糊数量用 hundreds of（成百上千），选 C；具体数字 two hundred 不加 s 也不加 of。译文：成百上千的人参加了这项活动。
2. This room is twice ______ that one.
A. as big as　B. so big as　C. bigger as　D. as bigger as
> 解析：倍数 + as + 原级 + as：twice as big as（是……的两倍大），选 A。否定比较才用 not so...as。译文：这个房间是那个房间的两倍大。`,
    keyPoints: [
      'few/a few + 可数，little/a little + 不可数；带 a 表肯定，不带 a 表否定',
      'information/advice/news/furniture/weather 等不可数，用 a piece of 计量',
      'an hour（h 不发音）、a university（u 读 /juː/）；球类、三餐、by bus 零冠词',
      'another 三者以上另一个；one...the other 两者；some...others 无范围',
      'hundred 前有具体数字不加 s：two hundred；模糊数量 hundreds of',
      'much/even/far + 比较级；the more..., the more...；as...as 用原级',
      'must have done 过去一定做了（否定 can\'t have done）；should have done 本该做而没做',
    ],
    cards: [
      {
        front: 'There is ______ water in the bottle.（little 还是 a little？）',
        back: '表"还有一点"用 **a little**（肯定）；little 表"几乎没有"（否定）。little/a little 只接不可数名词。',
      },
      {
        front: 'an hour 还是 a hour？',
        back: '**an** hour。a/an 看发音不看字母：hour 的 h 不发音；university 读 /juː/ 开头，用 a university。',
      },
      {
        front: 'two ______ (hundred) people 填什么？',
        back: '填 **hundred**。具体数字后不加 s 也不加 of；表模糊数量用 hundreds of。',
      },
      {
        front: '"你本该早点来"怎么说？',
        back: 'You **should have come** earlier. should have done 表"本该做而没做"，含责备。',
      },
      {
        front: '"地面湿了，昨晚肯定下雨了"怎么说？',
        back: 'It **must have rained** last night. must have done 表对过去的肯定推测，否定推测用 can\'t have done。',
      },
      {
        front: 'The more you read, ______?',
        back: '**the more you know.** 越……越……：The more..., the more... 两边都用比较级。',
      },
    ],
  },
  {
    id: 'eng-l10',
    subject: 'english',
    chapter: '题型技巧',
    title: '完形填空解题技巧：三步法与逻辑信号词',
    minutes: 30,
    importance: '重要',
    content: `## 题型概况
完形填空一篇短文挖 15 个空，每空 2 分共 30 分。短文是**连续的故事或说明文**，一半考词汇辨析、一半考上下文逻辑，另有一些固定搭配。它考的不是孤立的词，而是"放进原文还通不通"。

## 第一招：吃透首句（全文唯一不设空的句子）
首句是命题人故意留给你的"窗户"，交代**人物、时间、事件基调**。动笔前先读懂首句：如果是故事，就按记叙文思路预判（谁 → 出了什么事 → 结果/感悟）；是励志故事，结尾多半是积极向上的。

## 第二招：三步法
1. **跳读定调**（约 2 分钟）：跳过空格快速通读，只抓"这是谁的事、整体是好事还是坏事"；
2. **逐空填选**（约 10 分钟）：先做有把握的空，卡住的地方先标记，用后文线索回头再补；
3. **代入复读**（约 3 分钟）：把选好的词放进原文连读，检查**逻辑通不通、搭配对不对、时态一致不一致**。

## 第三招：盯住逻辑信号词
空格前后的连词就是"路标"，选词必须服从它：
- **but, however, yet** → 前后**转折**；
- **so, therefore, thus** → 前因**后果**；
- **because, since** → 解释**原因**；
- **and** → 并列延续；**or** → 选择或"否则"；**instead** → 反其道而行。
> 例：He was tired, ______ he kept working. tired 与 kept working 语义相反 → 选 but。

## 第四招：词汇复现与同义呼应
同一个重要信息会在文中**反复出现**（原词或同义词）：前文出现过 money，后面空格选 cash 的概率极大；前文说 the old man，后面空格选 he/him。**复现词常常就是正确答案**，做题时顺手把关键词圈出来。

## 第五招：同义辨析三优先
四个选项词义相近时依次看：1. **词性优先**——需要名词就先排除动词；2. **搭配优先**——空格前有固定介词的（look ___ → at/for/up/after），先对搭配；3. **语境优先**——励志文就别选消极词。

## 生词怎么办
- 选项里的生词：靠词性和搭配也能排掉一半；
- 原文里的生词：**不纠缠**，完形考框架不考细节，跳过不影响大局；
- 长难句：只找主语和谓语，其余都是修饰成分。

> 时间预算：15 空约 15 分钟，平均一空不到 1 分钟，绝不在一个空上恋战。

## 例题示范
It was a cold winter evening. An old man was selling fruit on the street corner. A young man walked by and ______ one apple, paying with a large note.
A. ate　B. bought　C. grew　D. sold
> 解析：空格后面 paying（付钱）就是"买"的直接依据 → bought（B）。这就是"从上下文找依据"：依据常常出现在空格后不远处（本空依据是 paying 与 selling 的呼应）。A、C、D 都没有"付钱"这一环。`,
    keyPoints: [
      '首句不设空，交代人物时间与基调，先读懂首句再动笔',
      '三步法：跳读定调（2 分钟）→ 逐空填选（10 分钟）→ 代入复读（3 分钟）',
      'but/however 表转折、so/therefore 表因果，空格选词必须服从逻辑信号词',
      '词汇复现：前文出现过的词或其同义词常是后文答案，边读边圈关键词',
      '同义辨析三优先：词性 → 搭配 → 语境',
      '原文生词不纠缠，每空不超过 1 分钟，先易后难',
    ],
    cards: [
      {
        front: '完形填空的首句有什么用？',
        back: '全文唯一不设空，交代人物、时间与基调，是判断全文走向的关键线索。',
      },
      {
        front: '空格前出现 but 时怎么选？',
        back: '选与空前语义**相反**方向的词：He was tired, **but** he kept working. 转折信号决定选词方向。',
      },
      {
        front: '什么是词汇复现？',
        back: '同一信息在文中重复出现（原词或同义词），如前文 money、后文 cash。复现词常为答案。',
      },
      {
        front: '四个选项都认识但拿不准怎么办？',
        back: '三优先：先看词性，再看固定搭配，最后看语境。励志故事别选消极词。',
      },
      {
        front: '完形填空时间怎么分配？',
        back: '15 空约 15 分钟：跳读 2 分钟 + 逐空 10 分钟 + 复读 3 分钟，先易后难，不恋战。',
      },
    ],
  },
  {
    id: 'eng-l11',
    subject: 'english',
    chapter: '题型技巧',
    title: '阅读理解解题技巧：六大题型与干扰项识别（全卷最重要）',
    minutes: 45,
    importance: '核心',
    content: `## 题型概况（60 分，全卷最大项）
5 篇短文、20 题、每题 3 分。**得阅读者得英语**。零基础的目标不是读懂每个词，而是**每题找对那一句**——阅读本质上是"查找信息"的考试。

## 第一原则：先读题干，再回原文定位
不要先把文章精读一遍。正确顺序：**读题干 → 圈关键词（数字、大写、人名、名词）→ 回原文找这个词 → 精读定位句 → 比对选项**。且题目顺序与行文顺序基本一致：第 2 题的答案通常在第 1 题答案之后。

## 六大题型识别与套路
1. **细节题**（According to the passage... / Which of the following is true?）：定位句找**同义替换**——原文说 big，选项说 large，**换说法的往往正确**；照抄原词堆在一起反而要警惕；
2. **主旨题**（main idea / best title / mainly about）：重点看**首段首句、末段**和各段第一句；标题不能太宽也不能太窄，别选只概括某一段的选项；
3. **推理题**（infer / imply / suggest / learn from）：答案是原文的**合理引申**；**照抄原文的选项常是陷阱**，但也别推过头——原文没说"全都"就不能选"全都"；
4. **词义猜测题**（closest in meaning to）：答案不在词典里而在上下文里——看同位语解释、看 but/however 前后反推、看举的例子；
5. **态度题**（attitude / tone）：找感情色彩词（unfortunately、luckily、sadly）；常见选项 positive 积极的 / negative 消极的 / neutral 中立的；
6. **数字计算题**：把原文相关数字都找齐再算，小心"百分比"与"倍数"陷阱。

## 正确选项与干扰项特征对照
| 正确项特征 | 干扰项特征 |
| --- | --- |
| 同义替换原文定位句 | 无中生有（原文根本没提） |
| 概括、语气留有余地 | 绝对化（all, never, only, must 开头） |
| 按文章顺序分布 | 张冠李戴（把 A 的特点安到 B 头上） |
| 符合全文基调与常识 | 原词堆砌但意思拧了 / 与原文相反 |
> 口诀：**同义替换往往对，绝对化说法多半坑，无中生有直接删。**

## 时间分配与兜底策略
- 每篇 7~8 分钟，20 题共约 35~40 分钟；每题先**排除两个明显错的**选项再二选一；
- 生词多的段落**先跳过**：题目不问就不读；
- 实在不会的题：选与全文基调一致、语气最不绝对的那个选项，绝不要空题。

## 例题示范（细节题）
原文：The library opens at 8:30 a.m. on weekdays and at 9:00 a.m. on weekends.
题干：When does the library open on Saturdays?
A. At 8:30.　B. At 9:00.　C. At 8:00.　D. It never opens.
> 解析：Saturday 属于 weekends → 定位到 9:00 a.m.，选 B。A 项是 weekdays 的时间，典型的"张冠李戴"干扰项——数字题最爱用"另一个时间"来冒充答案。`,
    keyPoints: [
      '先读题干圈关键词，再回原文定位；题目顺序约等于行文顺序',
      '细节题：答案 = 定位句的同义替换，原词堆砌的选项要警惕',
      '主旨题：首段首句 + 末段 + 各段首句；标题忌太宽太窄',
      '推理题：照抄原文常是陷阱，答案是只多走半步的合理引申',
      '词义猜测看上下文：同位语解释、but 转折反推、举例',
      '干扰项三大坑：无中生有、绝对化（all/never/only/must）、张冠李戴',
      '每篇 7~8 分钟，先排除两项再二选一；不会也要按全文基调蒙一个',
    ],
    cards: [
      {
        front: '阅读理解正确的做题顺序？',
        back: '读题干圈关键词 → 回原文定位 → 精读定位句 → 比对选项。不是先通读全文。',
      },
      {
        front: '细节题的正确答案长什么样？',
        back: '定位句的**同义替换**：原文 big、选项 large。原词照搬堆砌的选项反而要警惕。',
      },
      {
        front: '推理题（infer）哪种选项是陷阱？',
        back: '照抄原文原句的常是陷阱；正确答案应是原文的合理引申，但不能推出原文没有的绝对结论。',
      },
      {
        front: '词义猜测题怎么猜？',
        back: '看上下文：同位语解释、but/however 转折反推、所举的例子。不要凭词典第一义硬选。',
      },
      {
        front: '见到 all / never / only / must 的选项？',
        back: '高度警惕：绝对化说法多半是干扰项；正确项语气常留有余地（may, some, usually）。',
      },
      {
        front: '每篇阅读用多久？',
        back: '7~8 分钟。先读题再定位，生词段落跳过；不会就排除两项后按全文基调选，绝不停留太久。',
      },
    ],
  },
  {
    id: 'eng-l12',
    subject: 'english',
    chapter: '题型技巧',
    title: '补全对话解题技巧：问答对应关系与六大情景句式',
    minutes: 25,
    importance: '重要',
    content: `## 题型概况
一段对话挖 5 个空，每空 3 分共 15 分，从备选句中选答案。它考的不是语法，而是**"你说上句，我接下句"的英语生活常识**——套路固定，是全卷最容易速成的部分。

## 五种"问答对应"关系（核心中的核心）
| 上句是什么 | 下句怎么接 |
| --- | --- |
| 特殊疑问句（what/when/where/how） | 具体信息：At seven. / By bus. / It's 20 yuan. |
| 一般疑问句（Do you...? / Can you...?） | Yes/No 开头，或 Of course. / Sure. |
| 请求（Would you mind...? / Could you...?） | 乐意：Not at all. / With pleasure. / No problem. |
| 道歉（I'm sorry...） | 没关系：It doesn't matter. / Never mind. / That's all right. |
| 感谢（Thank you...） | 不用谢：You're welcome. / My pleasure. / Not at all. |
> 解题第一步永远是：**看空格的前一句在问什么**，再从选项里找"回答这个问题的那一句"。

## 六大常考情景高频句式
- **购物**：Can I help you? / What can I do for you? / I'm looking for a shirt. / How much is it? / What size do you want? / I'll take it.
- **看病**：What's the matter with you? / I've got a headache. / How long have you been like this? / Take this medicine three times a day. / Nothing serious.
- **问路**：Excuse me, how can I get to the station? / Go straight ahead and turn left at the first crossing. / How far is it? / It's about ten minutes' walk.
- **打电话**：Hello, may I speak to Tom? / **This is** Mary **speaking**. / Who's **that**? / Hold on, please. / Can I take a message?
- **约会**：What time shall we meet? / How about seven o'clock? / Where shall we meet? / See you then.
- **就餐**：A table for two, please. / May I take your order? / Anything to drink? / The bill, please.

## 三个易错点
1. **打电话不说 I am... / Who are you**：介绍自己用 **This is...（speaking）**，问对方用 **Who's that?**；
2. **Would you mind...?** 的"同意"回答是否定形式：**Not at all. / Of course not.**（不介意才答应）；
3. 填入时注意**大小写**（句首要大写）以及问号、句号与标点的匹配。

## 解题四步
1. 通读对话，判断情景（购物？看病？打电话？）；2. 看空格前后句，确定该空是问句还是答句；3. 用"问答对应关系"把候选句分类排除；4. 代入全文连读检查逻辑。

## 例题示范
A: Thank you for helping me with my English.
B: ______
A. It doesn't matter.　B. My pleasure.　C. That's right.　D. All right.
> 解析：回应"感谢"用 My pleasure（B，很荣幸/不客气）；A 项 It doesn't matter 是回应"道歉"的，是本题型最经典的混淆项；C 项"说得对"、D 项"好吧"均不合语境。

## 补充：寒暄与日常高频问答
- 问候：How are you doing? — Fine, thank you. And you?
- 天气：Lovely day, isn't it? — Yes, it is. / What's the weather like today? — It's sunny.
- 建议：Why not go for a walk? — Good idea. / Shall we...? — That sounds great.
- 征求看法：What do you think of the film? — It's wonderful / boring.
- 祝愿：Have a nice weekend! — You too. / Good luck! — Thank you. The same to you.

## 补充：购物与就餐补充句
- Would you like something to drink? — A cup of tea, please.
- Can I help you? — I'm just looking, thanks.（我只是随便看看）
- What's the price of the shoes? = How much are the shoes? — 200 yuan. / It's too expensive.`,
    keyPoints: [
      '先看空格前一句：特殊疑问句接具体信息，一般疑问句接 Yes/No',
      '请求接 With pleasure / No problem；道歉接 It doesn\'t matter；感谢接 My pleasure',
      '打电话：This is... speaking 介绍自己，Who\'s that? 问对方',
      'Would you mind...? 的同意回答是否定形式：Not at all / Of course not',
      '看病必问：What\'s the matter? / How long have you been like this?',
      '问路答句套路：Go straight ahead / Turn left at... / It\'s about ten minutes\' walk',
    ],
    cards: [
      {
        front: '"没关系"有哪几种说法？',
        back: 'It doesn\'t matter. / Never mind. / That\'s all right. / Forget it.（回应道歉时用）',
      },
      {
        front: '电话里"我是李华"怎么说？',
        back: '**This is Li Hua speaking.** 不能说 I am Li Hua；问"你是谁"用 **Who\'s that?**',
      },
      {
        front: 'Would you mind my smoking here? 表允许怎么答？',
        back: '**Not at all. / Of course not.**（不介意）。mind 的肯定回答用否定形式，这是经典陷阱。',
      },
      {
        front: '"多谢！——不客气"的英文回句？',
        back: 'Thank you! — **You\'re welcome. / My pleasure. / Not at all. / That\'s all right.**',
      },
      {
        front: 'How long have you been like this? 出现在什么情景？',
        back: '看病。医生问"这样多久了"，回答 For three days. / Since last night.',
      },
      {
        front: '"一直往前走，第一个路口左转"怎么说？',
        back: '**Go straight ahead and turn left at the first crossing.** 问路情景的万能答句。',
      },
    ],
  },
  {
    id: 'eng-l13',
    subject: 'english',
    chapter: '题型技巧',
    title: '短文写作模板课：书信模板、议论文三段式与保分策略',
    minutes: 40,
    importance: '核心',
    content: `## 题型概况
一篇 100~120 词作文，25 分。评分看三样：**格式对、要点全、错句少**。零基础策略：**背模板 + 套句式**，先稳稳拿住 15 分保底分。

## 一、书信四件套（必背格式）
称呼 **Dear Mr. Smith, / Dear Tom,** → 正文 2~3 段 → 结尾 **Yours sincerely,** → 署名 **Li Hua**。

## 二、邀请信模板（方括号为替换空格）
> Dear Mr. Smith,
> I am writing to invite you to **[活动]**, which will be held **[地点]** at **[时间]**. The party will begin at **[钟点]** and last about **[时长]**. There will be **[内容 1]**, **[内容 2]** and so on.
> We would feel greatly honored if you could come. It would be even better if you could **[额外请求]**.
> Please let me know whether you can come. We are looking forward to your coming.
> Yours sincerely, Li Hua

## 三、感谢信模板
> Thank you very much for **[对方帮的事]** during my stay in **[地点]**. I really appreciate your kindness.
> **But for** your help, I couldn't have made such great progress. What impressed me most was **[具体细节]**.
> Again, I would like to express my sincere thanks. I hope to see you soon.

## 四、申请信模板
> I have learned from the newspaper that **[单位]** is looking for a **[职位]**. I am writing to apply for it.
> I am **[年龄]** years old and major in **[专业]**. I am good at **[特长 1]** and **[特长 2]**. Besides, I have some experience in **[相关经历]**.
> I believe I am fit for the job. I would appreciate it if you could give me the chance.

## 五、建议信模板
> I am sorry to hear that **[对方的问题]**. Don't worry too much about it.
> In my opinion, you'd better **[建议 1]**. First, **[做法 1]**. Second, **[做法 2]**. Third, it is also a good idea to **[做法 3]**.
> I hope you will find these suggestions helpful. Looking forward to your good news.

## 六、议论文三段式模板
1. **开头亮观点**：Nowadays, **[话题]** is becoming more and more popular. Different people have different opinions about it.
2. **中间摆理由**：On the one hand, **[理由 1]**. For example, **[例子]**. On the other hand, **[理由 2]**.
3. **结尾下结论**：In a word, **[重申观点]**. As far as I am concerned, we should **[做法]**.

## 七、万能句式库
- **开头 5 句**：With the development of... 随着……的发展；As we all know,... 众所周知；Nowadays, ... plays an important part in our life.；I am writing to... 我写信是为了……；Thank you for your letter asking about...
- **过渡 5 句**：First... Second... Third...；On the one hand... On the other hand...；What's more / Besides, ...；For example / For instance, ...；However, ...
- **结尾 5 句**：In a word, ...；I believe that...；I am looking forward to...；If you have any questions, please feel free to ask me.；Wish you good luck!

## 八、保分策略
1. **多写简单句**：一主一谓，宁可短不可错，没把握的从句直接放弃；
2. **保住三样**：时态一致、主谓一致、第三人称单数加 s；
3. **字数凑够法**：用 First/Second/Third 列理由、For example 举例、结尾加展望句（I believe everything will be better.），100 词很容易达到；
4. **要点全覆盖**：题目给的三四个提示点一个都不能漏，漏一个扣一大块；
5. 卷面工整：写错单词轻轻划一道线，不要涂黑团。
6. **时间预算**：审题列提纲 5 分钟、正文 15~20 分钟、通读检查 3~5 分钟；检查只盯三样——动词时态、名词单复数、大小写。`,
    keyPoints: [
      '书信四件套：Dear... / 正文 / Yours sincerely, / Li Hua',
      '邀请信骨架：I am writing to invite you to... / We are looking forward to your coming',
      '建议信骨架：In my opinion, you\'d better... / I hope you will find these suggestions helpful',
      '议论文三段式：亮观点 → On the one hand / On the other hand 摆理由 → In a word 总结',
      '万能过渡：First... Second... / For example / What\'s more / However',
      '保分三板斧：多写简单句、时态主谓一致、要点全覆盖',
      '字数不够：列理由 + 举例 + 结尾展望句',
    ],
    cards: [
      {
        front: '邀请信第一句怎么开头？',
        back: '**I am writing to invite you to the English Evening next Saturday.** 开门见山说明目的。',
      },
      {
        front: '"盼望你的到来"怎么收尾？',
        back: '**We are looking forward to your coming.** 注意 to 是介词，后接 doing。',
      },
      {
        front: '议论文第二段用哪组过渡词？',
        back: '**On the one hand... On the other hand...** 或 **First... Second... Third...**',
      },
      {
        front: '"随着……的发展"怎么说？',
        back: '**With the development of** science and technology, ... 万能开头第一句。',
      },
      {
        front: '字数凑不够怎么办？',
        back: 'First/Second/Third 列理由 + For example 举例 + 结尾展望句 I believe everything will be better.',
      },
      {
        front: '作文最不能犯的三个错误？',
        back: '时态不一致、主谓不一致（第三人称单数忘加 s）、要点遗漏。多写有把握的简单句。',
      },
    ],
  },
];
