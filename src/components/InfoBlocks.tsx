import type { InfoBlock } from '../types';
import { motion } from 'framer-motion';

const toneCls: Record<string, string> = {
  warn: 'bg-rose-50 border-rose-200 text-rose-700',
  info: 'bg-sky-50 border-sky-200 text-sky-700',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

export function InfoBlocks({ blocks }: { blocks: InfoBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-50 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-brand-500 to-brand-300" />
              <h3 className="font-bold text-slate-800">{b.title}</h3>
            </div>
            <div className="px-5 py-4">
              {b.type === 'table' && b.head && b.rows && (
                <div className="overflow-x-auto -mx-1 px-1">
                  <table className="w-full text-[13.5px] border-collapse">
                    <thead>
                      <tr>
                        {b.head.map((h, hi) => (
                          <th key={hi} className="border border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((r, ri) => (
                        <tr key={ri} className="hover:bg-slate-50/60">
                          {r.map((c, ci) => (
                            <td key={ci} className="border border-slate-200 px-3 py-2 text-slate-600 leading-6 align-top">
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {b.type === 'list' && (
                <ul className="space-y-2">
                  {(b.items ?? []).map((it, ii) => (
                    <li key={ii} className="flex gap-2.5 text-[14px] leading-7 text-slate-600">
                      <span className="text-brand-500 mt-0.5 flex-shrink-0">
                        <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
                          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.2 5.9-4 5a.8.8 0 0 1-1.2.06L4.3 9.2a.8.8 0 1 1 1.14-1.12l1.1 1.15 3.46-4.32A.8.8 0 1 1 11.2 5.9z" />
                        </svg>
                      </span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              )}
              {b.type === 'text' && <p className="text-[14.5px] leading-8 text-slate-600 whitespace-pre-wrap">{b.text}</p>}
              {b.type === 'note' && (
                <div className={`rounded-xl border px-4 py-3 text-[13.5px] leading-7 ${toneCls[b.tone ?? 'info']}`}>{b.text}</div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
