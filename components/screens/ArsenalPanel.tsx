'use client';

import { KPI } from '../ui/KPI';
import { Icon } from '../icons';
import { getRackets, getStringUsage, getTensionTrend, stringStatus } from '@/lib/utils';
import type { RacketAggregate } from '@/lib/utils';
import type { Customer, Lang, StringingService } from '@/lib/types';
import type { Strings } from '@/lib/i18n';

interface ArsenalPanelProps {
  t: Strings;
  lang: Lang;
  customer: Customer;
  services: StringingService[];
  onRecord: () => void;
}

export function ArsenalPanel({ t, lang, services, onRecord }: ArsenalPanelProps) {
  if (!services || services.length === 0) {
    return (
      <div className="ys-card" style={{ padding: 28, textAlign: 'center' }}>
        <div style={{ opacity: 0.3, marginBottom: 12 }}>
          <Icon.racket width="48" height="48" />
        </div>
        <div style={{ color: 'var(--ink-muted)', fontSize: 14, marginBottom: 16 }}>
          {t.noArsenal}
        </div>
        <button className="ys-btn ys-btn-primary" onClick={onRecord}>
          <Icon.plus width="18" height="18" /> {t.logFirstService}
        </button>
      </div>
    );
  }

  const rackets = getRackets(services);
  const usage = getStringUsage(services);
  const trend = getTensionTrend(services);
  const avgTension = Math.round(services.reduce((s, x) => s + x.tension, 0) / services.length);
  const latest = trend[trend.length - 1];

  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom: 14 }}>
        <KPI label={t.racketCount} value={rackets.length} />
        <KPI label={t.totalServices} value={services.length} />
        <KPI label={t.avgTension} value={avgTension} delta={t.lbsUnit} deltaDir="up" accent />
        <KPI label={t.lastStrung} value={latest?.daysAgo ?? 0}
             delta={lang === 'zh' ? '天前' : 'd ago'} deltaDir="up" />
      </div>

      <div className="sect-row">
        <div className="sect-title">{t.tensionTrend}</div>
        <span className="badge fire">{latest?.tension ?? 0} {t.lbsUnit}</span>
      </div>
      <div className="ys-card">
        <TensionChart trend={trend} lang={lang} />
      </div>

      <div className="sect-row">
        <div className="sect-title">{t.rackets}</div>
        <span className="sect-link">{rackets.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rackets.map((r, i) => (
          <RacketCard key={`${r.brand}-${r.model}-${i}`} racket={r} t={t} lang={lang} />
        ))}
      </div>

      <div className="sect-row">
        <div className="sect-title">{t.stringPopularity}</div>
        <span className="sect-link">{usage.length}</span>
      </div>
      <div className="ys-card">
        {usage.map((u, i) => {
          const max = usage[0].count;
          const pct = (u.count / max) * 100;
          return (
            <div className="string-pop-row" key={i}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{u.model}</span>
                  <span style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    {u.brand}
                  </span>
                </div>
                <div className="string-pop-bar"><div style={{ width: `${pct}%` }} /></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="string-pop-count">{u.count}</div>
                <div style={{ fontSize: 9, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  {t.times}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RacketCard({ racket, t, lang }: { racket: RacketAggregate; t: Strings; lang: Lang }) {
  const latest = racket.latest;
  const status = stringStatus(latest.daysAgo);
  const statusLabel = status === 'healthy' ? t.statusHealthy
                    : status === 'aging'   ? t.statusAging
                    : t.statusFatigue;

  return (
    <div className={`racket-card is-${status}`}>
      <div className="racket-head">
        <div className="racket-icon">
          <Icon.racket width="22" height="22" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{racket.model}</span>
            <span style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              {racket.brand}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>
            {t.strungOn} <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{latest.daysAgo}</span>{' '}
            {lang === 'zh' ? '天前' : 'days ago'} · {racket.services.length}× {lang === 'zh' ? '服务' : 'services'}
          </div>
        </div>
        <span className={`status-pill ${status}`}>
          {status === 'fatigue' && '●'} {statusLabel}
        </span>
      </div>

      <div style={{
        marginTop: 12, paddingTop: 12,
        borderTop: '1px solid var(--line)',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
      }}>
        <div>
          <div className="spec-label">{lang === 'zh' ? '当前线' : 'Current string'}</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>{latest.stringModel}</div>
          <div style={{ fontSize: 10, color: 'var(--ink-muted)' }}>{latest.stringBrand}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="spec-label">{t.tension}</div>
          <div className="display-num fire-text" style={{ fontSize: 28, lineHeight: 1, marginTop: 2 }}>
            {latest.tension}
            <span style={{ fontSize: 11, color: 'var(--ink-muted)', fontStyle: 'normal', marginLeft: 4 }}>{t.lbsUnit}</span>
          </div>
        </div>
      </div>

      {status === 'fatigue' && (
        <div style={{
          marginTop: 12, padding: '8px 12px',
          background: 'rgba(255,77,94,0.08)',
          border: '1px solid rgba(255,77,94,0.2)',
          borderRadius: 10,
          fontSize: 11,
          color: 'var(--danger)',
          fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon.flame width="14" height="14" />
          {t.fatigueAlert}
        </div>
      )}
    </div>
  );
}

export function TensionChart({ trend, lang }: { trend: StringingService[]; lang: Lang }) {
  if (trend.length === 0) return null;

  const W = 320, H = 120, padL = 36, padR = 12, padT = 14, padB = 24;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const tensions = trend.map((s) => s.tension);
  const minT = Math.min(...tensions) - 1;
  const maxT = Math.max(...tensions) + 1;
  const rangeT = Math.max(maxT - minT, 4);

  const xFor = (i: number) => padL + (i / Math.max(trend.length - 1, 1)) * innerW;
  const yFor = (v: number) => padT + (1 - (v - minT) / rangeT) * innerH;

  const path = trend.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(s.tension)}`).join(' ');
  const areaPath = `${path} L ${xFor(trend.length - 1)} ${padT + innerH} L ${xFor(0)} ${padT + innerH} Z`;

  const yTicks = [minT + 1, Math.round((minT + maxT) / 2), maxT - 1];

  return (
    <div className="tension-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="tension-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff2d2d" />
            <stop offset="50%" stopColor="#ff7a18" />
            <stop offset="100%" stopColor="#ffd000" />
          </linearGradient>
          <linearGradient id="tension-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff7a18" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff7a18" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={yFor(v)} y2={yFor(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={padL - 6} y={yFor(v) + 3} textAnchor="end"
                  fontSize="9" fill="rgba(255,255,255,0.45)"
                  fontFamily="var(--font-mono), JetBrains Mono, monospace">
              {v}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#tension-area)" />
        <path d={path} fill="none" stroke="url(#tension-line)" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />

        {trend.map((s, i) => {
          const cx = xFor(i), cy = yFor(s.tension);
          const isLast = i === trend.length - 1;
          return (
            <g key={s.id}>
              <circle cx={cx} cy={cy} r={isLast ? 5 : 3.5}
                      fill={isLast ? '#ff7a18' : '#0a0a0d'}
                      stroke={isLast ? '#fff' : '#ff7a18'}
                      strokeWidth={isLast ? 2 : 1.5} />
              {isLast && (
                <text x={cx} y={cy - 10} textAnchor="middle"
                      fontSize="10" fontWeight="700" fill="#ff7a18"
                      fontFamily="var(--font-saira), Saira Condensed, sans-serif" fontStyle="italic">
                  {s.tension}
                </text>
              )}
            </g>
          );
        })}

        <text x={xFor(0)} y={H - 4} textAnchor="start"
              fontSize="9" fill="rgba(255,255,255,0.4)"
              fontFamily="var(--font-mono), JetBrains Mono, monospace">
          −{trend[0].daysAgo}d
        </text>
        <text x={xFor(trend.length - 1)} y={H - 4} textAnchor="end"
              fontSize="9" fill="rgba(255,255,255,0.4)"
              fontFamily="var(--font-mono), JetBrains Mono, monospace">
          {lang === 'zh' ? '今天' : 'now'}
        </text>
      </svg>
    </div>
  );
}
