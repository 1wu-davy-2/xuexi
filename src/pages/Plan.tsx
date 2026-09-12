import { PLAN_WEEKS, planPosition } from '../data/plan';
import { subjectMeta } from '../data/subjects';
import { useStore } from '../store/store';
import { Badge, Btn, Card, Empty, SectionTitle } from '../components/ui';
import { Icon } from '../components/icons';
import { useOutput, DocHeader } from '../utils/output';
import { motion } from 'framer-motion';
import type { PlanWeek } from '../types';

export default function Plan() {
  const { planDone, togglePlanItem, settings } = useStore();
  const { print, exportPdf, busy } = useOutput();
  const pos = planPosition();

  const totalTasks = PLAN_WEEKS.reduce((s, w) => s + w.days.reduce((x, d) => x + d.tasks.length, 0), 0);
  const doneTasks = PLAN_WEEKS.reduce(
    (s, w) => s + w.days.reduce((x, d, di) => x + d.tasks.filter((_, ti) => planDone[`w${w.n}d${di}t${ti}`]).length, 0),
    0,
  );
  const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div>
      <SectionTitle
        icon="calendar"
        title="五周冲刺计划"
        desc={`2026-09-12 开始，10.17–18 考试。当前进度：${doneTasks}/${totalTasks}（${pct}%）· 今天是第 ${pos.week} 周第 ${pos.day + 1} 天`}
        right={
          <div className="flex gap-2">
            <Btn variant="outline" size="sm" disabled={!PLAN_WEEKS.length} onClick={() => print(<PlanDoc weeks={PLAN_WEEKS} name={settings.name} />)}>
              <Icon name="printer" className="w-4 h-4" /> 打印
            </Btn>
            <Btn variant="outline" size="sm" disabled={!PLAN_WEEKS.length || busy} onClick={() => exportPdf(<PlanDoc weeks={PLAN_WEEKS} name={settings.name} />, '五周冲刺计划表.pdf')}>
              <Icon name="download" className="w-4 h-4" /> 导出 PDF
            </Btn>
          </div>
        }
      />

      {PLAN_WEEKS.length === 0 ? (
        <Empty icon="calendar" title="计划内容生成中" desc="五周冲刺计划稍后就会就绪，先从首页今日任务开始。" />
      ) : (
        <div className="space-y-5">
          {PLAN_WEEKS.map((w, wi) => {
            const weekDone = w.days.reduce((x, d, di) => x + d.tasks.filter((_, ti) => planDone[`w${w.n}d${di}t${ti}`]).length, 0);
            const weekTotal = w.days.reduce((x, d) => x + d.tasks.length, 0);
            const isCurrent = w.n === pos.week;
            const isPast = w.n < pos.week;
            return (
              <motion.div key={w.n} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: wi * 0.05 }}>
                <Card className={`overflow-hidden ${isCurrent ? 'ring-2 ring-brand-400 shadow-lg' : ''}`}>
                  <div className={`px-5 py-4 flex flex-wrap items-center gap-3 ${isCurrent ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white' : isPast ? 'bg-slate-50' : 'bg-white border-b border-slate-100'}`}>
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${isCurrent ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700'}`}>W{w.n}</span>
                    <div className="flex-1 min-w-[200px]">
                      <div className={`font-bold ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                        第 {w.n} 周 <span className="text-xs font-normal opacity-70">{w.range}</span>
                        {isCurrent && <Badge className="ml-2 bg-amber-400 text-amber-950 font-bold">本周</Badge>}
                      </div>
                      <div className={`text-xs mt-0.5 ${isCurrent ? 'text-white/80' : 'text-slate-500'}`}>{w.focus}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-black ${isCurrent ? 'text-white' : 'text-slate-700'}`}>
                        {weekTotal ? Math.round((weekDone / weekTotal) * 100) : 0}%
                      </div>
                      <div className={`text-[11px] ${isCurrent ? 'text-white/70' : 'text-slate-400'}`}>{weekDone}/{weekTotal} 项</div>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    {w.goals.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {w.goals.map((g, gi) => (
                          <Badge key={gi} className="bg-brand-50 text-brand-600 border border-brand-100">目标 {gi + 1}：{g}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {w.days.map((d, di) => (
                        <div key={di} className={`rounded-xl border p-3.5 ${isCurrent && di === pos.day ? 'border-brand-300 bg-brand-50/40' : 'border-slate-100 bg-slate-50/60'}`}>
                          <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                            <Icon name="calendar" className="w-3.5 h-3.5" /> {d.label}
                            {isCurrent && di === pos.day && <span className="text-brand-600">· 今天</span>}
                          </div>
                          <div className="space-y-1.5">
                            {d.tasks.map((t, ti) => {
                              const key = `w${w.n}d${di}t${ti}`;
                              const done = !!planDone[key];
                              return (
                                <button key={ti} onClick={() => togglePlanItem(key)} className="w-full flex items-start gap-2 text-left group">
                                  <span className={`w-4 h-4 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition ${done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-brand-400'}`}>
                                    {done && <Icon name="check" className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                                  </span>
                                  <span className={`text-xs leading-6 ${done ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                                    {t.subject && <span className={`font-bold mr-1 ${subjectMeta(t.subject).text}`}>【{subjectMeta(t.subject).name}】</span>}
                                    {t.text}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PlanDoc({ weeks, name }: { weeks: PlanWeek[]; name: string }) {
  return (
    <div className="print-doc">
      <DocHeader title="五周冲刺计划表（江苏成考专升本·理工类）" sub={`${name || '考生'} · 2026.9.12 – 10.17 · 勾选完成情况`} />
      {weeks.map((w) => (
        <div key={w.n}>
          <h2>
            第 {w.n} 周（{w.range}）· {w.focus}
          </h2>
          {w.goals.map((g, i) => (
            <p key={i} style={{ marginLeft: '1em' }}>
              □ 周目标{i + 1}：{g}
            </p>
          ))}
          <table>
            <thead>
              <tr>
                <th style={{ width: '12%' }}>星期</th>
                <th>任务（完成后打勾）</th>
              </tr>
            </thead>
            <tbody>
              {w.days.map((d, di) => (
                <tr key={di}>
                  <td>{d.label}</td>
                  <td>
                    {d.tasks.map((t, ti) => (
                      <div key={ti}>
                        □ {t.subject ? `【${subjectMeta(t.subject).name}】` : ''}
                        {t.text}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
