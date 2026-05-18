interface KPIProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaDir?: 'up' | 'down';
  accent?: boolean;
}

export function KPI({ label, value, delta, deltaDir = 'up', accent = false }: KPIProps) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${accent ? 'fire-text' : ''}`}>{value}</div>
      {delta && (
        <div className={`kpi-delta ${deltaDir}`}>
          {deltaDir === 'up' ? '↑' : '↓'} {delta}
        </div>
      )}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow" style={{ marginBottom: 8 }}>{children}</div>;
}
