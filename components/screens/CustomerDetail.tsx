'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/useHydratedLang';
import { Avatar } from '../ui/Avatar';
import { KPI } from '../ui/KPI';
import { StampGrid } from '../ui/StampGrid';
import { Icon } from '../icons';
import { ArsenalPanel } from './ArsenalPanel';
import { formatPhone, getNextReward, getRedeemable, relTime } from '@/lib/utils';
import type { Customer, Lang, MergedHistory, Reward, StringingService } from '@/lib/types';
import type { Strings } from '@/lib/i18n';

interface Props {
  customer: Customer;
  idx: number;
}

export function CustomerDetail({ customer, idx }: Props) {
  const rewards = useStore((s) => s.rewards);
  const transactions = useStore((s) => s.txMap[customer.id]) || [];
  const stringingServices = useStore((s) => s.stringMap[customer.id]) || [];
  const addStamp = useStore((s) => s.addStamp);
  const openRedeem = useStore((s) => s.openRedeem);
  const openRecordStringing = useStore((s) => s.openRecordStringing);

  const { t, lang } = useT();

  const [newIndex, setNewIndex] = useState(-1);
  const [tab, setTab] = useState<'loyalty' | 'arsenal'>('loyalty');

  const c = customer;
  const next = getNextReward(c.stamps, rewards);
  const redeemables = getRedeemable(c.stamps, rewards);
  const threshold = next ? next.threshold : (redeemables[0]?.threshold ?? 3);
  const cols = threshold <= 5 ? threshold : threshold <= 6 ? 3 : 5;

  const handleAdd = () => {
    const before = c.stamps;
    addStamp(c.id);
    setNewIndex(before);
    setTimeout(() => setNewIndex(-1), 600);
  };

  const mergedHistory = useMemo<MergedHistory[]>(() => {
    const stringingTx: MergedHistory[] = stringingServices.map((s) => ({
      id: `tx-string-${s.id}`,
      type: 'stringing',
      daysAgo: s.daysAgo,
      racketBrand: s.racketBrand,
      racketModel: s.racketModel,
      stringBrand: s.stringBrand,
      stringModel: s.stringModel,
      tension: s.tension,
    }));
    const txMerged: MergedHistory[] = transactions.map((tx) => ({
      id: tx.id, type: tx.type, daysAgo: tx.daysAgo, change: tx.change, note: tx.note,
    }));
    return [...txMerged, ...stringingTx].sort((a, b) => a.daysAgo - b.daysAgo);
  }, [transactions, stringingServices]);

  return (
    <div className="ys-content ys-pad-top ys-pad-btm">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
        <Avatar name={c.name} idx={idx} size={64} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em' }}>{c.name}</span>
            {c.status === 'new'      && <span className="badge new">NEW</span>}
            {c.status === 'inactive' && <span className="badge">···</span>}
          </div>
          <div className="mono" style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 4 }}>
            {formatPhone(c.phone)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 2 }}>
            {t.lastVisit}: {relTime(c.lastVisitDays, lang, t)}
          </div>
        </div>
      </div>

      <div className="det-tabs">
        <button className={`det-tab ${tab === 'loyalty' ? 'is-active' : ''}`} onClick={() => setTab('loyalty')}>
          <Icon.award /> {t.loyalty}
        </button>
        <button className={`det-tab ${tab === 'arsenal' ? 'is-active' : ''}`} onClick={() => setTab('arsenal')}>
          <Icon.racket /> {t.arsenal}
          {stringingServices.length > 0 && (
            <span style={{
              marginLeft: 4, padding: '1px 6px',
              fontSize: 10, borderRadius: 999,
              background: 'var(--surface)', color: 'var(--ink-muted)',
              fontStyle: 'normal', letterSpacing: 0,
            }}>
              {stringingServices.length}
            </span>
          )}
        </button>
      </div>

      {tab === 'loyalty' ? (
        <LoyaltyTab c={c} t={t} lang={lang}
                    threshold={threshold} cols={cols} newIndex={newIndex}
                    next={next} redeemables={redeemables}
                    history={mergedHistory}
                    onAddStamp={handleAdd}
                    onRedeem={() => openRedeem(c.id)}
                    onRecordStringing={() => openRecordStringing(c.id)} />
      ) : (
        <ArsenalTab c={c} services={stringingServices} onRecord={() => openRecordStringing(c.id)} />
      )}
    </div>
  );
}

function LoyaltyTab({ c, t, lang, threshold, cols, newIndex, next, redeemables, history, onAddStamp, onRedeem, onRecordStringing }: {
  c: Customer; t: Strings; lang: Lang;
  threshold: number; cols: number; newIndex: number;
  next: Reward | null; redeemables: Reward[];
  history: MergedHistory[];
  onAddStamp: () => void; onRedeem: () => void; onRecordStringing: () => void;
}) {
  return (
    <>
      <div className="ys-card-hero" style={{ marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow">{next ? t.nextReward : t.rewardReady}</div>
            <div style={{
              marginTop: 6,
              fontFamily: 'var(--font-saira), Saira Condensed, sans-serif',
              fontWeight: 800, fontStyle: 'italic', fontSize: 18,
              lineHeight: 1.1,
            }}>
              {next ? (lang === 'zh' ? next.nameZh : next.name) : t.rewardReadySub}
            </div>
          </div>
          <div style={{ textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <span className="display-num fire-text" style={{ fontSize: 48 }}>{c.stamps}</span>
            <span style={{ color: 'var(--ink-muted)', fontSize: 18, fontWeight: 600 }}> / {threshold}</span>
          </div>
        </div>

        <StampGrid stamps={c.stamps} threshold={threshold} cols={cols} newIndex={newIndex} />

        {next && (
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--ink-muted)', textAlign: 'center' }}>
            <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{threshold - c.stamps}</span>{' '}
            {t.stampsToGo}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button className="ys-btn ys-btn-primary" style={{ flex: 2 }} onClick={onAddStamp}>
          <Icon.plus width="20" height="20" /> {t.addStamp}
        </button>
        <button className="ys-btn ys-btn-ghost" style={{ flex: 1 }}
                disabled={redeemables.length === 0}
                onClick={() => redeemables.length > 0 && onRedeem()}>
          <Icon.gift width="18" height="18" /> {t.redeem}
        </button>
      </div>

      <button className="ys-btn ys-btn-ghost ys-btn-block" style={{ marginTop: 10, height: 46 }}
              onClick={onRecordStringing}>
        <Icon.racket width="18" height="18" /> {t.recordStringing}
      </button>

      {redeemables.length > 0 && (
        <>
          <div className="sect-row">
            <div className="sect-title">{t.chooseReward}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {redeemables.map((r) => (
              <RewardCard key={r.id} reward={r} lang={lang} t={t} onTap={onRedeem} />
            ))}
          </div>
        </>
      )}

      <div className="kpi-grid" style={{ marginTop: 20 }}>
        <KPI label={t.memberSince} value={Math.floor(c.joinDays / 30) || '0'}
             delta={lang === 'zh' ? '月' : 'mo'} deltaDir="up" />
        <KPI label={t.totalVisits} value={c.total_earned} />
        <KPI label={t.rewardsEarned} value={Math.floor(c.total_redeemed / 3)} />
        <KPI label={lang === 'zh' ? '总章数' : 'All stamps'} value={c.total_earned + c.total_redeemed} />
      </div>

      <div className="sect-row">
        <div className="sect-title">{t.history}</div>
      </div>
      <div className="ys-card">
        {history.length === 0 ? (
          <div style={{ color: 'var(--ink-muted)', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
            {lang === 'zh' ? '暂无记录' : 'No history yet'}
          </div>
        ) : (
          history.map((tx) => <HistoryRow key={tx.id} tx={tx} t={t} lang={lang} />)
        )}
      </div>
    </>
  );
}

function ArsenalTab({ c, services, onRecord }: { c: Customer; services: StringingService[]; onRecord: () => void }) {
  const { t, lang } = useT();
  return (
    <>
      <div style={{ marginTop: 6 }}>
        <button className="ys-btn ys-btn-primary ys-btn-block" onClick={onRecord}>
          <Icon.plus width="18" height="18" /> {t.recordStringing}
        </button>
      </div>
      <div style={{ marginTop: 16 }}>
        <ArsenalPanel t={t} lang={lang} customer={c} services={services} onRecord={onRecord} />
      </div>
    </>
  );
}

function HistoryRow({ tx, t, lang }: { tx: MergedHistory; t: Strings; lang: Lang }) {
  if (tx.type === 'stringing') {
    return (
      <div className="tx-row">
        <div className="tx-icon" style={{ background: 'var(--fire-soft)', color: 'var(--orange)' }}>
          <Icon.racket width="18" height="18" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            {t.stringingService}
            <span style={{ color: 'var(--ink-muted)', fontSize: 12, marginLeft: 6 }}>
              · {tx.racketBrand} {tx.racketModel}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
            {relTime(tx.daysAgo, lang, t)} · {tx.stringModel}
          </div>
        </div>
        <div className="tx-amount" style={{ color: 'var(--orange)' }}>
          {tx.tension}<span style={{ fontSize: 10, marginLeft: 2 }}>{t.lbsUnit}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="tx-row">
      <div className={`tx-icon ${tx.type}`}>
        {tx.type === 'earn' ? <Icon.plus width="18" height="18" /> : <Icon.gift width="18" height="18" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>
          {tx.type === 'earn' ? t.earned : t.redeemed}
          {tx.note && <span style={{ color: 'var(--ink-muted)', fontSize: 12, marginLeft: 6 }}>· {tx.note}</span>}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
          {relTime(tx.daysAgo, lang, t)}
        </div>
      </div>
      <div className={`tx-amount ${tx.type}`}>
        {(tx.change ?? 0) > 0 ? '+' : ''}{tx.change}
      </div>
    </div>
  );
}

function RewardCard({ reward, lang, t, onTap }: { reward: Reward; lang: Lang; t: Strings; onTap: () => void }) {
  return (
    <div className="ys-card" style={{
      display: 'flex', alignItems: 'center', gap: 14,
      cursor: 'pointer',
      borderColor: 'rgba(255,208,0,0.3)',
    }} onClick={onTap}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: 'var(--fire-soft)',
        display: 'grid', placeItems: 'center',
        border: '1px solid rgba(255,122,24,0.3)',
      }}>
        <Icon.gift width="22" height="22" color="var(--orange)" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{lang === 'zh' ? reward.nameZh : reward.name}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
          {t.deductStamps} {reward.threshold} {t.stamps}
        </div>
      </div>
      <span className="badge gold">{lang === 'zh' ? '可兑换' : 'READY'}</span>
    </div>
  );
}
