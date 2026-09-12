import { useState } from 'react';
import { strategyBlocks } from '../data/strategy';
import { SUBJECTS, subjectMeta } from '../data/subjects';
import { SectionTitle, Segmented } from '../components/ui';
import { InfoBlocks } from '../components/InfoBlocks';
import type { SubjectId } from '../types';

export default function Strategy() {
  const [tab, setTab] = useState<SubjectId>('politics');
  const meta = subjectMeta(tab);
  const blocks = strategyBlocks[tab] ?? [];

  return (
    <div>
      <SectionTitle icon="bulb" title="三科抢分策略" desc="零基础时间紧，就要把钱花在刀刃上：每科怎么拿分、先学什么、考场时间怎么分。" />
      <div className="mb-5">
        <Segmented value={tab} onChange={setTab} options={SUBJECTS.map((s) => ({ value: s.id, label: s.name }))} />
      </div>
      <div className={`rounded-2xl px-5 py-4 mb-5 bg-gradient-to-r ${meta.gradient} text-white shadow-md`}>
        <p className="font-bold">{meta.name} · 满分 150 · {meta.minutes} 分钟</p>
        <p className="text-sm text-white/85 mt-1">{meta.paper}</p>
      </div>
      {blocks.length ? <InfoBlocks blocks={blocks} /> : <p className="text-sm text-slate-400">策略内容生成中…</p>}
    </div>
  );
}
