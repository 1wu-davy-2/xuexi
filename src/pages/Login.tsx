import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/store';
import { Icon } from '../components/icons';

export default function Login() {
  const { login, enterLocal } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!username.trim() || !password || loading) return;
    setLoading(true);
    setError('');
    const r = await login(username.trim(), password);
    setLoading(false);
    if (!r.ok) {
      setError(r.error || '登录失败');
      setShake((s) => s + 1);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 px-4">
      <motion.div
        key={shake}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={shake ? { opacity: 1, y: 0, scale: 1, x: [0, -8, 8, -5, 5, 0] } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shake ? 0.45 : 0.4 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8"
      >
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ rotate: -8, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-brand-200"
          >
            考
          </motion.div>
          <h1 className="text-xl font-black text-slate-900 mt-4">成考冲刺</h1>
          <p className="text-xs text-slate-400 mt-1">江苏 · 专升本理工类 · 冲刺复习系统</p>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">用户名</label>
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="用户名"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400"
            />
          </div>
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
              {error}
            </motion.p>
          )}
          <button
            type="submit"
            disabled={!username.trim() || !password || loading}
            className="w-full rounded-xl bg-brand-600 text-white py-2.5 text-sm font-semibold hover:bg-brand-700 active:scale-[.99] transition disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }} className="inline-block">
                  <Icon name="refresh" className="w-4 h-4" />
                </motion.span>
                登录中…
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>

        <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5 text-[11.5px] leading-5 text-slate-400">
          默认账号 <b className="text-slate-600">admin / admin@123</b>，登录后学习进度自动云端同步。
          <br />
          部署后建议通过环境变量修改密码或另行建号。
        </div>
        <button onClick={enterLocal} className="mt-3 w-full text-xs text-slate-400 hover:text-brand-600 transition-colors">
          暂不登录，以本地模式进入（进度仅存本机）
        </button>
      </motion.div>
    </div>
  );
}
