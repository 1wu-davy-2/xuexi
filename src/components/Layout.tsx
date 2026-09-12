import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './icons';
import { useStore } from '../store/store';

const NAV = [
  { to: '/', label: '总览', icon: 'home' },
  { to: '/plan', label: '冲刺计划', icon: 'calendar' },
  { to: '/learn', label: '课程学习', icon: 'book' },
  { to: '/practice', label: '专项练习', icon: 'edit' },
  { to: '/exam', label: '模拟考试', icon: 'clock' },
  { to: '/wrong', label: '错题本', icon: 'layers' },
  { to: '/cards', label: '速记卡', icon: 'grid' },
  { to: '/guide', label: '江苏考情', icon: 'flag' },
  { to: '/strategy', label: '抢分策略', icon: 'bulb' },
  { to: '/settings', label: '设置', icon: 'settings' },
];

function useCountdown() {
  const { settings } = useStore();
  return useMemo(() => {
    const exam = new Date(settings.examDate + 'T09:00:00');
    const now = new Date();
    const days = Math.ceil((exam.getTime() - now.getTime()) / 86400000);
    return { days, exam };
  }, [settings.examDate]);
}

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { days } = useCountdown();

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === '/'}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${isActive ? 'text-brand-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 bg-brand-50 rounded-xl" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <Icon name={n.icon} className="relative z-10 w-[18px] h-[18px]" />
              <span className="relative z-10">{n.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-2.5 px-6 pt-6 pb-5">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-black text-lg shadow-md shadow-brand-200">考</div>
      <div>
        <div className="font-bold text-slate-900 leading-tight">成考冲刺</div>
        <div className="text-[11px] text-slate-400">江苏 · 专升本理工类</div>
      </div>
    </div>
  );

  return (
    <div id="app-root" className="min-h-screen flex">
      {/* 桌面侧栏 */}
      <aside className="hidden lg:flex w-60 flex-col border-r border-slate-200 bg-white/80 backdrop-blur sticky top-0 h-screen">
        {brand}
        {nav}
        <div className="mt-auto p-4">
          <div className={`rounded-2xl p-4 text-white bg-gradient-to-br ${days <= 14 ? 'from-rose-500 to-orange-400' : 'from-brand-500 to-brand-700'} shadow-lg`}>
            <div className="text-xs opacity-80">距离考试还剩</div>
            <div className="text-3xl font-black mt-0.5">
              {days}
              <span className="text-sm font-semibold ml-1">天</span>
            </div>
            <div className="text-[11px] opacity-75 mt-1">{settings_text()}</div>
          </div>
        </div>
      </aside>

      {/* 移动端抽屉 */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden" />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 flex flex-col overflow-y-auto lg:hidden"
            >
              {brand}
              {nav}
              <div className="p-4 mt-auto">
                <div className="rounded-2xl p-4 text-white bg-gradient-to-br from-brand-500 to-brand-700">
                  <div className="text-xs opacity-80">距离考试还剩 {days} 天</div>
                  <div className="text-[11px] opacity-75 mt-1">{settings_text()}</div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 主区 */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 lg:hidden bg-white/85 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 -m-1.5 text-slate-600">
            <Icon name="menu" className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-900">成考冲刺</span>
          <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${days <= 14 ? 'bg-rose-100 text-rose-600' : 'bg-brand-100 text-brand-700'}`}>倒计时 {days} 天</span>
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-6xl w-full mx-auto"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <footer className="text-center text-xs text-slate-400 pb-8">
          成考冲刺 · 江苏专升本理工类复习系统 · 数据保存在本机浏览器 · 免责声明：内容供复习参考，以官方大纲与真题为准
        </footer>
      </div>
    </div>
  );
}

function settings_text() {
  return '2026.10.17 开考 · 加油！';
}
