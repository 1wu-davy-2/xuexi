import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';

export function Card({ className = '', children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl shadow-card border border-slate-100 ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ icon, title, desc, right }: { icon?: string; title: string; desc?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          {icon && (
            <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Icon name={icon} className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            </span>
          )}
          {title}
        </h2>
        {desc && <p className="text-sm text-slate-500 mt-1 ml-0.5">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className || 'bg-slate-100 text-slate-600'}`}>{children}</span>;
}

export function Btn({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline' | 'danger' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  title?: string;
}) {
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-all active:scale-[.97] disabled:opacity-40 disabled:pointer-events-none';
  const sizes = { sm: 'text-xs px-2.5 py-1.5', md: 'text-sm px-4 py-2', lg: 'text-base px-6 py-3' };
  const variants = {
    primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700',
    soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700',
    ghost: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
  };
  return (
    <button title={title} disabled={disabled} onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function ProgressRing({ value, size = 64, stroke = 7, color = '#4f46e5', label }: { value: number; size?: number; stroke?: number; color?: string; label?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - clamped / 100) }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">{label ?? `${Math.round(clamped)}%`}</div>
    </div>
  );
}

export function Empty({ icon = 'check', title, desc, action }: { icon?: string; title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="py-14 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4 animate-floaty">
        <Icon name={icon} className="w-7 h-7" />
      </div>
      <p className="font-semibold text-slate-700">{title}</p>
      {desc && <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">{desc}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, sub, tone = 'text-brand-600' }: { label: string; value: React.ReactNode; sub?: string; tone?: string }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card px-4 py-3.5">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`text-2xl font-extrabold mt-0.5 ${tone}`}>{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex bg-slate-100 rounded-xl p-1 gap-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`relative px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${value === o.value ? 'text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {value === o.value && <motion.span layoutId={`seg-${options.map((x) => x.value).join()}`} className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          <span className="relative z-10">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
