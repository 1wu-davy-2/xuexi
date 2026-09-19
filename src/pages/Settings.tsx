import { useState } from 'react';
import { useStore } from '../store/store';
import { ALL_QUESTIONS } from '../data';
import { Btn, Card, SectionTitle } from '../components/ui';
import { Icon } from '../components/icons';

const SYNC_LABEL: Record<string, { text: string; cls: string }> = {
  idle: { text: '空闲', cls: 'text-slate-400' },
  saving: { text: '同步中…', cls: 'text-brand-600' },
  saved: { text: '已同步', cls: 'text-emerald-600' },
  error: { text: '同步失败，稍后重试', cls: 'text-rose-500' },
};

export default function Settings() {
  const { settings, setSettings, resetAll, readLessons, attempts, exams, planDone, phase, username, syncState, logout, syncNow } = useStore();
  const [name, setName] = useState(settings.name);
  const [examDate, setExamDate] = useState(settings.examDate);
  const [confirmReset, setConfirmReset] = useState(false);

  function exportData() {
    const data = { settings, readLessons, attempts, exams, planDone, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `成考复习进度备份-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-2xl">
      <SectionTitle icon="settings" title="设置" desc="姓名用于打印页眉；考试日期驱动首页倒计时与计划定位。" />

      {/* 账号与云同步 */}
      <Card className="p-5 mb-5">
        <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <Icon name="check" className="w-4 h-4 text-brand-500" />
          账号与数据同步
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold">
            {username ? username.slice(0, 1).toUpperCase() : '?'}
          </span>
          <div className="flex-1 min-w-[160px]">
            <div className="font-semibold text-slate-800">{username || '未登录'}</div>
            <div className={`text-xs mt-0.5 ${phase === 'authed' ? SYNC_LABEL[syncState].cls : 'text-amber-600'}`}>
              {phase === 'authed'
                ? `云端同步：${SYNC_LABEL[syncState].text}（改动后自动保存到服务器）`
                : phase === 'local'
                  ? '本地模式：未连接服务器，进度仅保存在本浏览器'
                  : '本地模式'}
            </div>
          </div>
          <div className="flex gap-2">
            <Btn variant="outline" size="sm" onClick={() => void syncNow()}>
              <Icon name="refresh" className="w-4 h-4" />
              {phase === 'authed' ? '立即同步' : '重试连接'}
            </Btn>
            <Btn variant="ghost" size="sm" onClick={logout}>
              退出登录
            </Btn>
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-5">
        <div>
          <label className="text-sm font-semibold text-slate-700">考生姓名（可选）</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="填写后会出现在打印/PDF 页眉上"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">考试日期</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400"
          />
          <p className="text-xs text-slate-400 mt-1.5">2026 年江苏成考全国统考为 10 月 17–18 日，如准考证信息不同，请以此处手动修正。</p>
        </div>
        <Btn
          onClick={() => {
            setSettings({ name, examDate });
            alert('已保存');
          }}
        >
          <Icon name="check" className="w-4 h-4" /> 保存设置
        </Btn>
      </Card>

      <Card className="p-5 mt-5">
        <h3 className="font-bold text-slate-800 text-sm mb-3">数据管理</h3>
        <p className="text-xs text-slate-500 leading-6 mb-3">
          已学 {readLessons.length} 讲、作答 {Object.keys(attempts).length} 题、模考 {exams.length} 次。登录状态下数据自动同步到服务器（SQLite 存储）；本地缓存同时保留，可导出 JSON 备份。题库共 {ALL_QUESTIONS.length} 题。
        </p>
        <div className="flex flex-wrap gap-2">
          <Btn variant="outline" onClick={exportData}>
            <Icon name="download" className="w-4 h-4" /> 导出进度备份
          </Btn>
          {!confirmReset ? (
            <Btn variant="ghost" onClick={() => setConfirmReset(true)}>
              <Icon name="trash" className="w-4 h-4" /> 清空全部记录
            </Btn>
          ) : (
            <>
              <Btn
                variant="danger"
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                  alert('已清空全部学习记录');
                }}
              >
                确认清空（不可恢复）
              </Btn>
              <Btn variant="ghost" onClick={() => setConfirmReset(false)}>
                取消
              </Btn>
            </>
          )}
        </div>
      </Card>

      <Card className="p-5 mt-5">
        <h3 className="font-bold text-slate-800 text-sm mb-2">关于本系统</h3>
        <p className="text-xs text-slate-500 leading-7">
          成考冲刺 · 江苏专升本理工类复习系统（政治 / 英语 / 高等数学（一））。内容依据《全国各类成人高等学校招生考试大纲（2024 年版）》整理，题库含 2019–2025 年历年真题（转写自公开资料）与原创配套题，仅供个人复习参考，一切以官方大纲、真题与江苏省教育考试院公布为准。
        </p>
      </Card>
    </div>
  );
}
