'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/useHydratedLang';
import { VISITS_7D } from '@/lib/seed';
import { TopBar } from '@/components/ui/TopBar';
import { KPI } from '@/components/ui/KPI';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/icons';
import { YLogo } from '@/components/brand';
import { getRedeemable } from '@/lib/utils';
import type { Customer } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const customers = useStore((s) => s.customers);
  const campaigns = useStore((s) => s.campaigns);
  const rewards = useStore((s) => s.rewards);
  const loadAll = useStore((s) => s.loadAll);
  const loadedAll = useStore((s) => s.loadedAll);
  const { t, lang } = useT();
  const visits = VISITS_7D;

  useEffect(() => { if (!loadedAll) loadAll(); }, [loadedAll, loadAll]);

  const hour = new Date().getHours();
  const greet = hour < 12 ? t.greetingMorning : hour < 18 ? t.greetingAfternoon : t.greetingEvening;

  const todayStamps = visits[visits.length - 1].count;
  const yesterdayStamps = visits[visits.length - 2].count;
  const delta = Math.round(((todayStamps - yesterdayStamps) / yesterdayStamps) * 100);

  const newToday = customers.filter((c) => c.lastVisitDays === 0 && c.joinDays <= 1).length;
  const totalStamps = customers.reduce((s, c) => s + c.total_earned, 0);
  const pendingRewards = customers.filter((c) => c.stamps >= 3).length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'live').length;

  const counts = customers.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});
  const total = customers.length;
  const newPct = ((counts.new || 0) / total) * 100;
  const activePct = ((counts.active || 0) / total) * 100;
  const inactivePct = ((counts.inactive || 0) / total) * 100;

  const readyToRedeem = customers
    .filter((c) => c.stamps >= 3)
    .sort((a, b) => b.stamps - a.stamps)
    .slice(0, 3);

  const maxVisit = Math.max(...visits.map((v) => v.count));
  const peakIdx = visits.findIndex((v) => v.count === maxVisit);
  const todayIdx = visits.length - 1;

  return (
    <>
      <TopBar showBrand right={<button className="ys-iconbtn"><Icon.bell width="18" height="18" /><div className="ys-dot" /></button>} />
      <div className="ys-content ys-pad-top ys-pad-btm">
        <div style={{ marginTop: 12, marginBottom: 14 }}>
          <div className="eyebrow" style={{ color: 'var(--ink-muted)' }}>{greet.toUpperCase()}</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, color: 'var(--ink)' }}>{t.storeName}</div>
        </div>

        <div className="ys-card-hero">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="eyebrow">{t.todayHero}</div>
              <div className="display-num fire-text" style={{ fontSize: 76, marginTop: 6 }}>
                {todayStamps}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, whiteSpace: 'nowrap' }}>
                <span className={`kpi-delta ${delta >= 0 ? 'up' : 'down'}`}>
                  {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
                </span>
                <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{t.vsYesterday}</span>
              </div>
            </div>
            <div style={{ opacity: 0.5 }}>
              <YLogo size={56} gradient />
            </div>
          </div>
        </div>

        <div className="kpi-grid" style={{ marginTop: 12 }}>
          <KPI label={t.kpiNewToday} value={newToday} delta="+2" deltaDir="up" />
          <KPI label={t.kpiTotalStamps} value={totalStamps} />
          <KPI label={t.kpiRedeemPending} value={pendingRewards} accent />
          <KPI label={t.kpiCampaigns} value={activeCampaigns} />
        </div>

        <div className="sect-row">
          <div className="sect-title">{t.visits7d}</div>
          <span className="badge fire">▲ +18%</span>
        </div>
        <div className="ys-card">
          <div className="spark">
            {visits.map((v, i) => {
              const h = (v.count / maxVisit) * 100;
              const isToday = i === todayIdx;
              const isPeak = i === peakIdx && !isToday;
              return (
                <div key={i} style={{ flex: 1 }}>
                  <div className={`spark-bar ${isToday ? 'is-today' : ''} ${isPeak ? 'is-peak' : ''}`}
                       style={{ height: `${h}%` }} />
                  <div className="spark-label" style={{ color: isToday ? 'var(--orange)' : 'var(--ink-dim)' }}>
                    {lang === 'zh' ? v.dayZh : v.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sect-row">
          <div className="sect-title">{t.customerMix}</div>
          <span className="sect-link" onClick={() => router.push('/customers')}>{t.viewAll}</span>
        </div>
        <div className="ys-card">
          <div style={{ display: 'flex', gap: 4, height: 12, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: `${activePct}%`, background: 'var(--fire)' }} />
            <div style={{ width: `${newPct}%`, background: 'var(--success)' }} />
            <div style={{ width: `${inactivePct}%`, background: 'var(--surface-3)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, gap: 12 }}>
            <MixLegend dot="var(--fire)" label={t.returningCust} value={counts.active || 0} pct={Math.round(activePct)} />
            <MixLegend dot="var(--success)" label={t.newCust} value={counts.new || 0} pct={Math.round(newPct)} />
            <MixLegend dot="var(--surface-3)" label={t.inactiveCust} value={counts.inactive || 0} pct={Math.round(inactivePct)} />
          </div>
        </div>

        <div className="sect-row">
          <div className="sect-title">{t.topReady}</div>
          <span className="sect-link" onClick={() => router.push('/customers')}>{t.viewAll}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {readyToRedeem.map((c) => (
            <ReadyRow key={c.id} c={c} idx={customers.indexOf(c)} lang={lang}
                      rewards={rewards}
                      onClick={() => router.push(`/customers/${c.id}`)} />
          ))}
        </div>
      </div>
    </>
  );
}

function MixLegend({ dot, label, value, pct }: { dot: string; label: string; value: number; pct: number }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: dot, flex: 'none' }} />
        <span style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-saira), Saira Condensed, sans-serif', fontWeight: 800, fontStyle: 'italic', fontSize: 22, marginTop: 2 }}>
        {value}
        <span style={{ fontSize: 11, color: 'var(--ink-muted)', marginLeft: 4, fontStyle: 'normal' }}>{pct}%</span>
      </div>
    </div>
  );
}

function ReadyRow({ c, idx, lang, rewards, onClick }: {
  c: Customer; idx: number; lang: 'en' | 'zh'; rewards: ReturnType<typeof useStore.getState>['rewards']; onClick: () => void;
}) {
  const reward = getRedeemable(c.stamps, rewards)[0];
  return (
    <div className="customer-row" onClick={onClick}>
      <Avatar name={c.name} idx={idx} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</span>
          <span className="badge gold">{c.stamps} ★</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>
          {reward ? (lang === 'zh' ? reward.nameZh : reward.name) : ''}
        </div>
      </div>
      <Icon.chev width="16" height="16" color="var(--ink-muted)" />
    </div>
  );
}
