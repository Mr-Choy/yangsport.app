'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/useHydratedLang';
import { TopBar } from '@/components/ui/TopBar';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/icons';
import { YLogo } from '@/components/brand';
import { formatPhone, getNextReward, relTime } from '@/lib/utils';
import type { Customer, Lang, Reward } from '@/lib/types';
import type { Strings } from '@/lib/i18n';

type Filter = 'all' | 'ready' | 'new' | 'active' | 'inactive';

export default function CustomersPage() {
  const router = useRouter();
  const customers = useStore((s) => s.customers);
  const rewards = useStore((s) => s.rewards);
  const openSheet = useStore((s) => s.openSheet);
  const loadAll = useStore((s) => s.loadAll);
  const loadedAll = useStore((s) => s.loadedAll);
  const { t, lang } = useT();

  useEffect(() => { if (!loadedAll) loadAll(); }, [loadedAll, loadAll]);

  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = customers.filter((c) => {
    if (filter === 'ready'    && c.stamps < 3)            return false;
    if (filter === 'new'      && c.status !== 'new')      return false;
    if (filter === 'active'   && c.status !== 'active')   return false;
    if (filter === 'inactive' && c.status !== 'inactive') return false;
    if (!q) return true;
    return c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q);
  });

  return (
    <>
      <TopBar title={t.customersTitle}
              right={<button className="ys-iconbtn" onClick={() => openSheet('addStamp')}><Icon.plus width="18" height="18" /></button>} />
      <div className="ys-content ys-pad-top ys-pad-btm">
        <div style={{ marginTop: 14, marginBottom: 12 }}>
          <div className="display" style={{ fontSize: 34, marginBottom: 2 }}>{t.customersTitle}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
            {customers.length} {t.customers}
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Icon.search width="18" height="18" style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)',
          }} />
          <input className="ys-search" placeholder={t.searchPlaceholder}
                 value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="ys-chips" style={{ marginBottom: 16 }}>
          {([
            { id: 'all',      label: t.filterAll },
            { id: 'ready',    label: t.filterReady,    fire: true },
            { id: 'new',      label: t.filterNew },
            { id: 'active',   label: t.filterActive },
            { id: 'inactive', label: t.filterInactive },
          ] as { id: Filter; label: string; fire?: boolean }[]).map((f) => (
            <button key={f.id}
                    className={`ys-chip ${f.fire ? 'ys-chip-fire' : ''} ${filter === f.id ? 'is-active' : ''}`}
                    onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((c) => (
            <CustomerRow key={c.id} c={c} idx={customers.indexOf(c)} t={t} lang={lang} rewards={rewards}
                         onClick={() => router.push(`/customers/${c.id}`)} />
          ))}
          {filtered.length === 0 && (
            <div className="empty">
              <div className="empty-glyph"><YLogo size={56} color="#3a3a44" /></div>
              <div>No customers match</div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="ys-btn ys-btn-ghost ys-btn-block" onClick={() => openSheet('addStamp')}>
            <Icon.plus width="18" height="18" /> {t.addCustomer}
          </button>
        </div>
      </div>
    </>
  );
}

function CustomerRow({ c, idx, t, lang, rewards, onClick }: {
  c: Customer; idx: number; t: Strings; lang: Lang; rewards: Reward[]; onClick: () => void;
}) {
  const next = getNextReward(c.stamps, rewards);
  const denom = next ? next.threshold : c.stamps;
  const pct = denom > 0 ? Math.min(100, (c.stamps / denom) * 100) : 100;
  const isReady = c.stamps >= 3;

  return (
    <div className="customer-row" onClick={onClick}>
      <Avatar name={c.name} idx={idx} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {c.name}
          </span>
          {c.status === 'new'      && <span className="badge new">NEW</span>}
          {isReady                 && <span className="badge gold">✦</span>}
          {c.status === 'inactive' && <span className="badge">···</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
            {formatPhone(c.phone)}
          </span>
          <span style={{ fontSize: 11, color: 'var(--ink-dim)' }}>·</span>
          <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
            {relTime(c.lastVisitDays, lang, t)}
          </span>
        </div>
        <div className="minibar" style={{ marginTop: 6 }}>
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="display-num" style={{ fontSize: 22 }}>{c.stamps}</div>
        <div style={{ fontSize: 9, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginTop: 2 }}>
          /{denom}
        </div>
      </div>
    </div>
  );
}
