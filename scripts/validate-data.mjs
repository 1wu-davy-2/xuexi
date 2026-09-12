import fs from 'node:fs';

const files = [
  'src/data/politics/questions-real.ts',
  'src/data/politics/questions-orig.ts',
  'src/data/english/questions-real.ts',
  'src/data/english/questions-orig.ts',
  'src/data/math/questions-real.ts',
  'src/data/math/questions-orig.ts',
];

let allIds = [];
let problems = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const ids = [...src.matchAll(/id: '([^']+)'/g)].map((m) => m[1]);
  allIds.push(...ids);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) problems.push(`${f}: 重复 id ${[...new Set(dup)].join(',')}`);
  // 空字段检查
  const objs = src.split(/\{\s*\n/).slice(1);
  let obj = '';
  for (const chunk of objs) {
    // 粗查：answer 为空字符串
    if (/answer: ''/.test(chunk)) problems.push(`${f}: 存在空 answer`);
    if (/analysis: ''/.test(chunk)) problems.push(`${f}: 存在空 analysis`);
    if (/stem: ''/.test(chunk)) problems.push(`${f}: 存在空 stem`);
  }
  // 单选题选项数检查（该文件内 options 数组元素个数不是 4 的题）
  const optBlocks = [...src.matchAll(/options: \[([^\]]*)\]/g)];
  for (const m of optBlocks) {
    const n = (m[1].match(/',\s*'|",\s*"|^\s*'/g) || []).length;
    const parts = m[1].split("',").length;
    if (parts !== 4) problems.push(`${f}: 选项数=${parts}（应为4）: ${m[1].slice(0, 60)}...`);
  }
}

const dupAll = allIds.filter((id, i) => allIds.indexOf(id) !== i);
if (dupAll.length) problems.push('全局重复 id: ' + [...new Set(dupAll)].join(','));

// 课件检查
const lessonFiles = [
  'src/data/politics/lessons.ts',
  'src/data/english/lessons.ts',
  'src/data/math/lessons.ts',
];
let lessonIds = [];
for (const f of lessonFiles) {
  const src = fs.readFileSync(f, 'utf8');
  const ids = [...src.matchAll(/id: '([^']+)'/g)].map((m) => m[1]);
  lessonIds.push(...ids);
  const cards = (src.match(/cards: \[/g) || []).length;
  const emptyCards = (src.match(/cards: \[\],/g) || []).length + (src.match(/cards: \[\s*\]/g) || []).length;
  console.log(`${f}: ${ids.length} 课, cards 字段 ${cards} 处${emptyCards ? `, 空 cards ${emptyCards}` : ''}`);
}
const dupL = lessonIds.filter((id, i) => lessonIds.indexOf(id) !== i);
if (dupL.length) problems.push('课件重复 id: ' + [...new Set(dupL)].join(','));

console.log('\n题目总数:', allIds.length);
console.log(problems.length ? '\n发现问题:\n' + problems.join('\n') : '\n✅ 校验全部通过');
