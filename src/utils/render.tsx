import katex from 'katex';
import React from 'react';

/** 渲染行内/块级 LaTeX：$..$ 行内、$$..$$ 块级 */
export function renderTexSegments(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] != null) {
      nodes.push(
        <span
          key={`${keyBase}-b${i++}`}
          className="block my-2 text-center overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: katex.renderToString(m[1], { throwOnError: false, displayMode: true }) }}
        />,
      );
    } else {
      nodes.push(
        <span
          key={`${keyBase}-i${i++}`}
          dangerouslySetInnerHTML={{ __html: katex.renderToString(m[2], { throwOnError: false }) }}
        />,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** 行内格式：**加粗**、`代码` */
export function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={`${keyBase}-s${i}`}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={`${keyBase}-c${i}`}>{p.slice(1, -1)}</code>;
    return <React.Fragment key={`${keyBase}-t${i}`}>{p}</React.Fragment>;
  });
}

/** 行内/块级公式 + 加粗/代码 的完整行渲染（markdown 各块级元素共用）。
 *  先按 **粗体** 切分（粗体可包含公式），各片段内再渲染 $..$ 公式与 `代码`。 */
function renderLine(text: string, keyBase: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    const kb = `${keyBase}-${i}`;
    if (p.length > 4 && p.startsWith('**') && p.endsWith('**')) {
      return <strong key={kb}>{renderTexSegments(p.slice(2, -2), `${kb}b`)}</strong>;
    }
    return (
      <React.Fragment key={kb}>
        {renderTexSegments(p, `${kb}t`).map((n, j) =>
          typeof n === 'string' ? (
            <React.Fragment key={`${kb}t-f${j}`}>{renderInline(n, `${kb}t-g${j}`)}</React.Fragment>
          ) : (
            n
          ),
        )}
      </React.Fragment>
    );
  });
}

/** 轻量 markdown 块级渲染（行级解析） */
export function renderMarkdown(src: string, keyBase = 'md'): React.ReactNode[] {
  const lines = src.split('\n');
  const out: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  const kk = () => `${keyBase}-${k++}`;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    // 标题
    const h = /^(#{2,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const content = renderLine(h[2], kk());
      out.push(level === 2 ? <h2 key={kk()}>{content}</h2> : <h3 key={kk()}>{content}</h3>);
      i++;
      continue;
    }
    // 引用
    if (line.startsWith('> ')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        buf.push(lines[i].slice(2));
        i++;
      }
      out.push(
        <blockquote key={kk()}>
          {buf.map((b, bi) => (
            <div key={bi}>{renderLine(b, `${kk()}-${bi}`)}</div>
          ))}
        </blockquote>,
      );
      continue;
    }
    // 表格
    if (line.trim().startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
        if (!cells.every((c) => /^:?-{3,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      if (rows.length) {
        out.push(
          <table key={kk()}>
            <thead>
              <tr>{rows[0].map((c, ci) => <th key={ci}>{renderLine(c, `${kk()}h${ci}`)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.slice(1).map((r, ri) => (
                <tr key={ri}>{r.map((c, ci) => <td key={ci}>{renderLine(c, `${kk()}b${ri}${ci}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>,
        );
      }
      continue;
    }
    // 无序列表
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      out.push(
        <ul key={kk()}>
          {items.map((it, ii) => (
            <li key={ii}>{renderLine(it, `${kk()}u${ii}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    // 有序列表
    if (/^\s*\d+[.、]\s*/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.、]\s*/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.、]\s*/, ''));
        i++;
      }
      out.push(
        <ol key={kk()}>
          {items.map((it, ii) => (
            <li key={ii}>{renderLine(it, `${kk()}o${ii}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    // 段落
    out.push(<p key={kk()}>{renderLine(line, kk())}</p>);
    i++;
  }
  return out;
}

/** 纯文本行内渲染（题干、选项等）：支持 $..$ 与 **加粗**，不产生块级标签 */
export function renderRich(text: string, keyBase = 'r'): React.ReactNode[] {
  return renderLine(text, keyBase);
}

/** 填空题答案归一化比较：可含 | 分隔多个可接受答案 */
export function checkBlank(userAnswer: string, answer: string): boolean {
  const norm = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/（/g, '(')
      .replace(/）/g, ')')
      .replace(/，/g, ',');
  const user = norm(userAnswer);
  if (!user) return false;
  return answer.split('|').some((a) => norm(a) === user);
}
