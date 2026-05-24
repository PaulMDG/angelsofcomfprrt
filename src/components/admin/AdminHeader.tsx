export function AdminHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <div className="text-[10px] tracking-[0.28em] uppercase text-[var(--gold-muted)]">{eyebrow}</div>
        <h1 className="font-serif text-4xl text-[var(--navy-deep)] mt-2">{title}</h1>
        {subtitle && <p className="text-[14px] text-[var(--warm-gray)] mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[var(--gold)]/20 rounded-[4px] ${className}`}>{children}</div>
  );
}

export function StatusPill({ on, onClick, onLabel = "Published", offLabel = "Draft" }: { on: boolean; onClick?: () => void; onLabel?: string; offLabel?: string }) {
  const cls = `text-[11px] px-2.5 py-1 rounded-full tracking-[0.12em] uppercase ${
    on ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
  }`;
  if (!onClick) return <span className={cls}>{on ? onLabel : offLabel}</span>;
  return <button onClick={onClick} className={cls}>{on ? onLabel : offLabel}</button>;
}

export const inputCls =
  "w-full border border-[var(--gold)]/30 bg-white rounded-[3px] px-3 py-2 text-[14px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--gold)]";

export const labelCls = "text-[10px] tracking-[0.22em] uppercase text-[var(--gold-muted)] font-medium";