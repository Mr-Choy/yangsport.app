'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { useSession } from '@/lib/session';
import { useT } from '@/lib/useHydratedLang';
import { Avatar } from '../ui/Avatar';
import { KPI } from '../ui/KPI';
import { Icon } from '../icons';
import { YLogo } from '../brand';
import {
  formatPhone, getNextReward, getRedeemable, getRackets, getStringUsage,
  getTensionTrend, relTime, stringStatus,
} from '@/lib/utils';
import type { RacketAggregate } from '@/lib/utils';
import type { Lang, StringingService, Transaction } from '@/lib/types';
import type { Strings } from '@/lib/i18n';
import { TensionChart } from './ArsenalPanel';

type ActivityItem =
  | { kind: 'earn' | 'redeem'; key: string; daysAgo: number; change: number; note: string }
  | { kind: 'stringing'; key: string; daysAgo: number; racketBrand: string; racketModel: string; stringBrand: string; stringModel: string; tension: number };

export function CustomerDashboard() {
  const customers = useStore((s) => s.customers);
  const rewards = useStore((s) => s.rewards);
  const txMap = useStore((s) => s.txMap);
  const stringMap = useStore((s) => s.stringMap);
  const toggleLang = useStore((s) => s.toggleLang);
  const loadCustomerData = useStore((s) => s.loadCustomerData);
  const loadedCustomer = useStore((s) => s.loadedCustomer);
  const loadedAll = useStore((s) => s.loadedAll);
  const loadAll = useStore((s) => s.loadAll);
  const session = useSession((s) => s.session);
  const signOut = useSession((s) => s.signOut);
  const { t, lang } = useT();

  const customerId = session?.customerId;

  useEffect(() => {
    if (customerId && !loadedCustomer[customerId]) loadCustomerData(customerId);
  }, [customerId, loadedCustomer, loadCustomerData]);
  useEffect(() => {
    // rewards live in loadAll(); customer view needs them for next-reward calc
    if (!loadedAll) loadAll();
  }, [loadedAll, loadAll]);

  const customer = customers.find((c) => c.id === customerId);
  const idx = customer ? customers.findIndex((c) => c.id === customer.id) : -1;

  const transactions: Transaction[] = customer ? (txMap[customer.id] || []) : [];
  const services: StringingService[] = customer ? (stringMap[customer.id] || []) : [];

  const acts: ActivityItem[] = useMemo(() => {
    const out: ActivityItem[] = [];
    for (const tx of transactions) {
      out.push({
        kind: tx.type, key: `tx-${tx.id}`,
        daysAgo: tx.daysAgo, change: tx.change, note: tx.note,
      });
    }
    for (const s of services) {
      out.push({
        kind: 'stringing', key: `s-${s.id}`,
        daysAgo: s.daysAgo,
        racketBrand: s.racketBrand, racketModel: s.racketModel,
        stringBrand: s.stringBrand, stringModel: s.stringModel,
        tension: s.tension,
      });
    }
    return out.sort((a, b) => a.daysAgo - b.daysAgo);
  }, [transactions, services]);

  if (!customer) {
    return (
      <div className="ys-content ys-pad-top">
        <div className="empty" style={{ padding: 40, marginTop: 80 }}>
          <div className="empty-glyph"><YLogo size={56} color="#3a3a44" /></div>
          <div>Customer not found</div>
          <button className="ys-btn ys-btn-ghost" style={{ marginTop: 16 }} onClick={() => { signOut(); }}>
            {t.signOut}
          </button>
        </div>
      </div>
    );
  }

  const next = getNextReward(customer.stamps, rewards);
  const redeemables = getRedeemable(customer.stamps, rewards);
  const threshold = next ? next.threshold : (redeemables[0]?.threshold || 3);
  const pct = Math.min(100, (customer.stamps / threshold) * 100);
  const stampsToGo = next ? next.threshold - customer.stamps : 0;
  const rackets = getRackets(services);

  return (
    <>
      <CustomerTopBar t={t} lang={lang} customer={customer} idx={idx}
                      onSignOut={() => { signOut(); }}
                      onToggleLang={toggleLang} />
      <div className="ys-content ys-pad-top" style={{ paddingBottom: 56 }}>
        <div style={{ marginTop: 8, marginBottom: 16 }}>
          <div className="eyebrow">{t.welcomeBack}</div>
          <div className="display" style={{ fontSize: 32, marginTop: 6 }}>
            {customer.name || (lang === 'zh' ? '会员' : 'Member')}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
            {t.memberOf}: {t.storeName}
          </div>
        </div>

        <SectionLabel num="01" title={t.section1} />

        <div className="ys-card-hero" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow">{t.currentStamps}</div>
              <div className="display-num fire-text" style={{ fontSize: 84, marginTop: 6, lineHeight: 0.85 }}>
                {customer.stamps}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 6 }}>
                {next ? (
                  <>
                    <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{stampsToGo}</span>{' '}
                    {t.stampsToNext}
                  </>
                ) : (
                  <span style={{ color: 'var(--yellow)', fontWeight: 700 }}>{t.progressFull}</span>
                )}
              </div>
            </div>
            <div style={{ opacity: 0.5 }}>
              <YLogo size={56} gradient />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{
              height: 10, borderRadius: 5,
              background: 'var(--surface-3)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                background: 'var(--fire)',
                borderRadius: 5,
                boxShadow: '0 0 12px rgba(255,122,24,0.5)',
                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                {customer.stamps} / {threshold}
              </span>
              <span style={{ fontSize: 10, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                {t.nextRewardName}: {next ? (lang === 'zh' ? next.nameZh : next.name) : (lang === 'zh' ? redeemables[0]?.nameZh : redeemables[0]?.name)}
              </span>
            </div>
          </div>

          {redeemables.length > 0 && (
            <div style={{
              marginTop: 14, padding: '10px 12px',
              background: 'rgba(255,208,0,0.08)',
              border: '1px solid rgba(255,208,0,0.25)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Icon.gift width="18" height="18" color="var(--yellow)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--yellow)' }}>{t.redeemNow}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-muted)', marginTop: 1 }}>{t.talkToStaff}</div>
              </div>
            </div>
          )}
        </div>

        <div className="sect-row"><div className="sect-title">{t.lifetimeAssets}</div></div>
        <div className="kpi-grid">
          <KPI label={t.totalEarnedShort}    value={customer.total_earned} />
          <KPI label={t.totalRedeemedShort}  value={customer.total_redeemed} />
          <KPI label={t.visitsCount}         value={customer.total_earned} />
          <KPI label={t.racketsOwned}        value={rackets.length} accent />
        </div>

        <div className="ys-card" style={{ marginTop: 12, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--ink-muted)' }}>
              <Icon.phone width="16" height="16" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                {lang === 'zh' ? '手机' : 'Phone'}
              </div>
              <div className="mono" style={{ fontSize: 14, marginTop: 2 }}>
                {formatPhone(customer.phone)}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                {t.lastVisit}
              </div>
              <div style={{ fontSize: 14, marginTop: 2 }}>
                {relTime(customer.lastVisitDays, lang, t)}
              </div>
            </div>
          </div>
        </div>

        <SectionLabel num="02" title={t.section2} />
        <div className="ys-card" style={{ padding: 0 }}>
          {acts.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-muted)', fontSize: 13 }}>
              {lang === 'zh' ? '暂无记录' : 'No activity yet'}
            </div>
          ) : (
            <CustomerTimeline acts={acts} t={t} lang={lang} />
          )}
        </div>

        <SectionLabel num="03" title={t.section3} />
        {services.length === 0 ? (
          <div className="ys-card" style={{ padding: 28, textAlign: 'center', color: 'var(--ink-muted)', fontSize: 13 }}>
            <div style={{ opacity: 0.3, marginBottom: 12 }}>
              <Icon.racket width="40" height="40" />
            </div>
            {t.noArsenal}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rackets.map((r, i) => (
              <CustomerRacketCard key={`${r.brand}-${r.model}-${i}`} racket={r} t={t} lang={lang} />
            ))}
          </div>
        )}

        {services.length > 0 && <AnalyticsSection services={services} t={t} lang={lang} />}

        <div style={{ textAlign: 'center', marginTop: 36, opacity: 0.4 }}>
          <YLogo size={32} color="#3a3a44" />
          <div className="display" style={{ fontSize: 11, marginTop: 6, color: 'var(--ink-dim)' }}>
            YANG SPORT · {t.tagline.toUpperCase()}
          </div>
          <div style={{ fontSize: 9, color: 'var(--ink-dim)', marginTop: 4, letterSpacing: '0.06em', fontWeight: 600 }}>
            {t.readonly.toUpperCase()}
          </div>
        </div>
      </div>
    </>
  );
}

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 22, marginBottom: 10 }}>
      <span className="display-num fire-text" style={{ fontSize: 20 }}>{num}</span>
      <span style={{
        fontFamily: 'Saira Condensed, sans-serif', fontWeight: 800, fontStyle: 'italic',
        textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 14,
        color: 'var(--ink)',
      }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
    </div>
  );
}

function CustomerTopBar({ t, lang, customer, idx, onSignOut, onToggleLang }: {
  t: Strings; lang: Lang; customer: { name: string; phone: string }; idx: number;
  onSignOut: () => void; onToggleLang: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ys-topbar">
      <div className="ys-brand" style={{ gap: 10 }}>
        <YLogo size={26} gradient />
        <div>
          <div className="ys-brand-text" style={{ whiteSpace: 'nowrap', color: 'var(--orange)', fontSize: 14, lineHeight: 1 }}>
            YANG <span style={{ color: 'var(--yellow)' }}>SPORT</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--ink-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginTop: 2 }}>
            {t.readonly}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
        <button className="ys-iconbtn" onClick={onToggleLang}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>{lang === 'en' ? 'EN' : '中'}</span>
        </button>
        <button className="ys-iconbtn"
                onClick={() => setOpen(!open)}
                style={{ width: 'auto', padding: '0 6px', gap: 6, display: 'inline-flex' }}>
          <Avatar name={customer.name} idx={idx} size={28} />
        </button>
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 200 }} onClick={() => setOpen(false)} />
            <div style={{
              position: 'absolute', top: 44, right: 0,
              minWidth: 180, padding: 8,
              background: 'var(--bg-2)',
              border: '1px solid var(--line-2)',
              borderRadius: 14,
              boxShadow: '0 12px 40px -8px rgba(0,0,0,0.6)',
              zIndex: 201,
            }}>
              <div style={{ padding: '6px 10px 8px', borderBottom: '1px solid var(--line)' }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{customer.name}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-muted)', marginTop: 2 }}>
                  {formatPhone(customer.phone)}
                </div>
              </div>
              <button onClick={() => { setOpen(false); onSignOut(); }}
                      style={{
                        width: '100%', padding: '10px 10px',
                        background: 'transparent', border: 0,
                        color: 'var(--danger)',
                        fontSize: 13, fontWeight: 600,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8,
                        borderRadius: 8,
                      }}>
                <Icon.arrowL width="14" height="14" /> {t.signOut}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CustomerTimeline({ acts, t, lang }: { acts: ActivityItem[]; t: Strings; lang: Lang }) {
  return (
    <div style={{ padding: '6px 14px 6px 14px', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 28, top: 18, bottom: 18, width: 1, background: 'var(--line)' }} />
      {acts.map((a) => (
        <div key={a.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 0', position: 'relative' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            display: 'grid', placeItems: 'center',
            flex: 'none',
            background:
              a.kind === 'earn'   ? 'rgba(56,214,138,0.14)' :
              a.kind === 'redeem' ? 'rgba(255,208,0,0.14)' :
                                    'var(--fire-soft)',
            color:
              a.kind === 'earn'   ? 'var(--success)' :
              a.kind === 'redeem' ? 'var(--yellow)' :
                                    'var(--orange)',
            zIndex: 1,
            border: '2px solid var(--bg)',
          }}>
            {a.kind === 'earn' ? '📌' : a.kind === 'redeem' ? '🎁' : '🎾'}
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {a.kind === 'earn' ? t.earned : a.kind === 'redeem' ? t.redeemed : t.stringingService}
              </span>
              <span style={{ fontSize: 11, color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                {relTime(a.daysAgo, lang, t)}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
              {a.kind === 'stringing' ? (
                <>
                  {a.racketBrand} {a.racketModel} ·{' '}
                  <span style={{ color: 'var(--ink-2)' }}>{a.stringModel}</span>{' '}
                  @ <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{a.tension} {t.lbsUnit}</span>
                </>
              ) : a.kind === 'redeem' ? (
                <>{a.note || (lang === 'zh' ? '兑换奖励' : 'reward redeemed')}</>
              ) : (
                <>{lang === 'zh' ? '到店消费' : 'in-store visit'}</>
              )}
            </div>
          </div>
          {a.kind !== 'stringing' && (
            <div style={{
              fontFamily: 'Saira Condensed, sans-serif', fontWeight: 800, fontStyle: 'italic',
              fontSize: 18,
              color: a.kind === 'earn' ? 'var(--success)' : 'var(--yellow)',
              marginTop: 2,
            }}>
              {a.change > 0 ? '+' : ''}{a.change}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CustomerRacketCard({ racket, t, lang }: { racket: RacketAggregate; t: Strings; lang: Lang }) {
  const latest = racket.latest;
  const status = stringStatus(latest.daysAgo);
  const statusLabel =
    status === 'healthy' ? t.perfect :
    status === 'aging'   ? t.aging2  :
                           t.fatigue2;
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
            <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{latest.daysAgo}</span>{' '}
            {t.daysOld} · {racket.services.length}× {lang === 'zh' ? '服务' : 'services'}
          </div>
        </div>
        <span className={`status-pill ${status}`}>
          {status === 'healthy' && '🟢'}
          {status === 'aging'   && '🟡'}
          {status === 'fatigue' && '🔴'}{' '}
          {statusLabel}
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
          marginTop: 12, padding: '10px 12px',
          background: 'rgba(255,77,94,0.08)',
          border: '1px solid rgba(255,77,94,0.2)',
          borderRadius: 10,
          fontSize: 11,
          color: 'var(--danger)',
          fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ⚠️ {t.fatigueAlert}
        </div>
      )}
    </div>
  );
}

function AnalyticsSection({ services, t, lang }: { services: StringingService[]; t: Strings; lang: Lang }) {
  const usage = getStringUsage(services);
  const trend = getTensionTrend(services);

  return (
    <>
      <SectionLabel num="04" title={t.section4} />

      <div className="sect-row" style={{ marginTop: 8 }}>
        <div className="sect-title">{t.favStrings}</div>
      </div>
      <div className="ys-card">
        {usage.slice(0, 5).map((u, i) => {
          const max = usage[0].count;
          const pctBar = (u.count / max) * 100;
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
          return (
            <div className="string-pop-row" key={i}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {medal && <span style={{ fontSize: 16 }}>{medal}</span>}
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{u.model}</span>
                  <span style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    {u.brand}
                  </span>
                </div>
                <div className="string-pop-bar"><div style={{ width: `${pctBar}%` }} /></div>
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

      <div className="sect-row">
        <div className="sect-title">{t.tensionHistory}</div>
        <span className="badge fire">{trend.slice(-1)[0]?.tension ?? 0} {t.lbsUnit}</span>
      </div>
      <div className="ys-card">
        <TensionChart trend={trend} lang={lang} />
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-muted)', textAlign: 'center', fontStyle: 'italic' }}>
          {t.yourTrend}
        </div>
      </div>
    </>
  );
}
