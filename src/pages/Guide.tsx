import { jiangsuBlocks } from '../data/jiangsu';
import { SectionTitle, Badge } from '../components/ui';
import { InfoBlocks } from '../components/InfoBlocks';
import { useOutput, DocHeader } from '../utils/output';
import { Btn } from '../components/ui';
import { Icon } from '../components/icons';

export default function Guide() {
  const { print, exportPdf, busy } = useOutput();
  return (
    <div>
      <SectionTitle
        icon="flag"
        title="江苏考情一本通"
        desc="考什么、怎么考、什么时候考、怎么加分、带什么进考场——这一页全知道。"
        right={
          <div className="flex gap-2">
            <Btn variant="outline" size="sm" disabled={!jiangsuBlocks.length} onClick={() => print(<GuideDoc />)}>
              <Icon name="printer" className="w-4 h-4" /> 打印
            </Btn>
            <Btn variant="outline" size="sm" disabled={!jiangsuBlocks.length || busy} onClick={() => exportPdf(<GuideDoc />, '江苏成考考情一本通.pdf')}>
              <Icon name="download" className="w-4 h-4" /> 导出 PDF
            </Btn>
          </div>
        }
      />
      <div className="flex flex-wrap gap-2 mb-5">
        <Badge className="bg-brand-50 text-brand-600">2026.10.17–18 考试</Badge>
        <Badge className="bg-amber-50 text-amber-700">年满 25 周岁 +20 分</Badge>
        <Badge className="bg-emerald-50 text-emerald-700">目标 150~180 / 450</Badge>
        <Badge className="bg-slate-100 text-slate-600">官网 jseea.cn</Badge>
      </div>
      <InfoBlocks blocks={jiangsuBlocks} />
    </div>
  );
}

function GuideDoc() {
  return (
    <div className="print-doc">
      <DocHeader title="江苏成考（专升本·理工类）考情一本通" sub="信息据公开资料整理，以江苏省教育考试院公布为准" />
      {jiangsuBlocks.map((b, i) => (
        <div key={b.id}>
          <h2>
            {i + 1}. {b.title}
          </h2>
          {b.type === 'table' && b.head && b.rows && (
            <table>
              <thead>
                <tr>{b.head.map((h, hi) => <th key={hi}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {b.rows.map((r, ri) => (
                  <tr key={ri}>{r.map((c, ci) => <td key={ci}>{c}</td>)}</tr>
                ))}
              </tbody>
            </table>
          )}
          {b.type === 'list' && (b.items ?? []).map((it, ii) => <div key={ii}>· {it}</div>)}
          {(b.type === 'text' || b.type === 'note') && <p>{b.text}</p>}
        </div>
      ))}
    </div>
  );
}
