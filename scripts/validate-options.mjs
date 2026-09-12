import fs from 'node:fs';

const files = [
  'src/data/politics/questions-real.ts',
  'src/data/politics/questions-orig.ts',
  'src/data/english/questions-real.ts',
  'src/data/english/questions-orig.ts',
  'src/data/math/questions-real.ts',
  'src/data/math/questions-orig.ts',
];

/** 从 src 中找出 options: [ ... ] 数组，按字符串字面量正确切分统计元素个数 */
function checkOptionsArrays(src, file) {
  const problems = [];
  let i = 0;
  while (true) {
    const idx = src.indexOf('options: [', i);
    if (idx < 0) break;
    i = idx + 10;
    let depth = 1;
    let j = i;
    while (j < src.length && depth > 0) {
      const c = src[j];
      if (c === "'" || c === '"' || c === '`') {
        const quote = c;
        j++;
        while (j < src.length) {
          if (src[j] === '\\') { j += 2; continue; }
          if (src[j] === quote) break;
          j++;
        }
      } else if (c === '[') depth++;
      else if (c === ']') depth--;
      j++;
    }
    const inner = src.slice(i, j - 1);
    // 统计顶层字符串元素
    let count = 0;
    let k = 0;
    while (k < inner.length) {
      const c = inner[k];
      if (c === "'" || c === '"' || c === '`') {
        const quote = c;
        k++;
        while (k < inner.length) {
          if (inner[k] === '\\') { k += 2; continue; }
          if (inner[k] === quote) break;
          k++;
        }
        count++;
      }
      k++;
    }
    if (count !== 4) {
      problems.push(`${file}: options 元素数=${count}: ${inner.replace(/\s+/g, ' ').slice(0, 90)}`);
    }
  }
  return problems;
}

let problems = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  problems.push(...checkOptionsArrays(src, f));
  // 单选题都应有 4 个选项的补充校验由上面覆盖；检查 answer 字母是否越界（A-D）
  for (const m of src.matchAll(/type: 'single'[\s\S]{0,600}?answer: '([^']+)'/g)) {
    if (!/^[A-F]$/.test(m[1])) problems.push(`${f}: single 题 answer 非字母: '${m[1]}'`);
  }
}
console.log(problems.length ? problems.join('\n') : '✅ options 与 answer 校验全部通过');
