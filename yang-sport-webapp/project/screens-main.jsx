/* Young Sport — Home (Dashboard) + Customers list screens */

// ─────────────────────────────────────────────────────────────
// Home / Dashboard
// ─────────────────────────────────────────────────────────────
function ScreenHome({ t, lang, customers, campaigns, visits, onTab, onOpenCustomer }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? t.greetingMorning : hour < 18 ? t.greetingAfternoon : t.greetingEvening;

  const todayStamps = visits[visits.length - 1].count;
  const yesterdayStamps = visits[visits.length - 2].count;
  const delta = Math.round(((todayStamps - yesterdayStamps) / yesterdayStamps) * 100);

  const newToday = customers.filter(c => c.lastVisitDays === 0 && c.joinDays <= 1).length;
  const totalStamps = customers.reduce((s, c) => s + c.total_earned, 0);
  const pendingRewards = customers.filter(c => c.stamps >= 3).length;
  const activeCampaigns = campaigns.filter(c => c.status === 'live').length;

  const counts = customers.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});
  const total = customers.length;
  const newPct = ((counts.new || 0) / total) * 100;
  const activePct = ((counts.active || 0) / total) * 100;
  const inactivePct = ((counts.inactive || 0) / total) * 100;

  const readyToRedeem = customers
    .filter(c => c.stamps >= 3)
    .sort((a, b) => b.stamps - a.stamps)
    .slice(0, 3);

  const maxVisit = Math.max(...visits.map(v => v.count));
  const peakIdx = visits.findIndex(v => v.count === maxVisit);
  const todayIdx = visits.length - 1;

  return (
    <div className="ys-content ys-pad-top ys-pad-btm">
      {/* Greeting */}
      <div style={{ marginTop: 12, marginBottom: 14 }}>
        <div className="eyebrow" style={{ color: 'var(--ink-muted)' }}>{greet.toUpperCase()}</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, color: 'var(--ink)' }}>{t.storeName}</div>
      </div>

      {/* Hero: today's stamps */}
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

      {/* KPI grid */}
      <div className="kpi-grid" style={{ marginTop: 12 }}>
        <KPI label={t.kpiNewToday} value={newToday} delta="+2" deltaDir="up" />
        <KPI label={t.kpiTotalStamps} value={totalStamps} />
        <KPI label={t.kpiRedeemPending} value={pendingRewards} accent />
        <KPI label={t.kpiCampaigns} value={activeCampaigns} />
      </div>

      {/* Visits 7d */}
      <div className="sect-row">
        <div className="sect-title">{t.visits7d}</div>
        <span className="badge fire">▲ +18%</span>
      </div>
      <div className="ys-card">
        <div className="spark">
          {visits.map((v, i) => {
            const h = (v.count / maxVisit) * 100;
            const isToday = i === todayIdx;
            const isPeak  = i === peakIdx && !isToday;
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

      {/* Customer mix */}
      <div className="sect-row">
        <div className="sect-title">{t.customerMix}</div>
        <span className="sect-link" onClick={() => onTab('customers')}>{t.viewAll}</span>
      </div>
      <div className="ys-card">
        <div style={{ display: 'flex', gap: 4, height: 12, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ width: `${activePct}%`, background: 'var(--fire)' }} />
          <div style={{ width: `${newPct}%`,    background: 'var(--success)' }} />
          <div style={{ width: `${inactivePct}%`, background: 'var(--surface-3)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, gap: 12 }}>
          <MixLegend dot="var(--fire)" label={t.returningCust} value={counts.active || 0} pct={Math.round(activePct)} />
          <MixLegend dot="var(--success)"  label={t.newCust}        value={counts.new || 0}    pct={Math.round(newPct)} />
          <MixLegend dot="var(--surface-3)" label={t.inactiveCust}  value={counts.inactive || 0} pct={Math.round(inactivePct)} />
        </div>
      </div>

      {/* Ready to redeem list */}
      <div className="sect-row">
        <div className="sect-title">{t.topReady}</div>
        <span className="sect-link" onClick={() => onTab('customers')}>{t.viewAll}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {readyToRedeem.map((c, i) => (
          <ReadyRow key={c.id} c={c} idx={customers.indexOf(c)} t={t} lang={lang}
                    onClick={() => onOpenCustomer(c.id)} />
        ))}
      </div>
    </div>
  );
}

function KPI({ label, value, delta, deltaDir = 'up', accent = false }) {
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

function MixLegend({ dot, label, value, pct }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: dot, flex: 'none' }} />
        <span style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: 'Saira Condensed, sans-serif', fontWeight: 800, fontStyle: 'italic', fontSize: 22, marginTop: 2 }}>
        {value}
        <span style={{ fontSize: 11, color: 'var(--ink-muted)', marginLeft: 4, fontStyle: 'normal' }}>{pct}%</span>
      </div>
    </div>
  );
}

function ReadyRow({ c, idx, t, lang, onClick }) {
  const reward = getRedeemable(c.stamps, REWARDS)[0];
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

// ─────────────────────────────────────────────────────────────
// Customers list
// ─────────────────────────────────────────────────────────────
function ScreenCustomers({ t, lang, customers, onOpenCustomer, onAddCustomer }) {
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const filtered = customers.filter(c => {
    if (filter === 'ready'    && c.stamps < 3)              return false;
    if (filter === 'new'      && c.status !== 'new')        return false;
    if (filter === 'active'   && c.status !== 'active')     return false;
    if (filter === 'inactive' && c.status !== 'inactive')   return false;
    if (!q) return true;
    return c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q);
  });

  return (
    <div className="ys-content ys-pad-top ys-pad-btm">
      <div style={{ marginTop: 14, marginBottom: 12 }}>
        <div className="display" style={{ fontSize: 34, marginBottom: 2 }}>{t.customersTitle}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
          {customers.length} {t.customers}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Icon.search width="18" height="18" style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)',
        }} />
        <input className="ys-search" placeholder={t.searchPlaceholder}
               value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {/* Filter chips */}
      <div className="ys-chips" style={{ marginBottom: 16 }}>
        {[
          { id: 'all',      label: t.filterAll },
          { id: 'ready',    label: t.filterReady,    fire: true },
          { id: 'new',      label: t.filterNew },
          { id: 'active',   label: t.filterActive },
          { id: 'inactive', label: t.filterInactive },
        ].map(f => (
          <button key={f.id}
                  className={`ys-chip ${f.fire ? 'ys-chip-fire' : ''} ${filter === f.id ? 'is-active' : ''}`}
                  onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((c) => (
          <CustomerRow key={c.id} c={c} idx={customers.indexOf(c)} t={t} lang={lang}
                       onClick={() => onOpenCustomer(c.id)} />
        ))}
        {filtered.length === 0 && (
          <div className="empty">
            <div className="empty-glyph"><YLogo size={56} color="#3a3a44" /></div>
            <div>No customers match</div>
          </div>
        )}
      </div>

      {/* Add customer button (floating-ish at end) */}
      <div style={{ marginTop: 20 }}>
        <button className="ys-btn ys-btn-ghost ys-btn-block" onClick={onAddCustomer}>
          <Icon.plus width="18" height="18" /> {t.addCustomer}
        </button>
      </div>
    </div>
  );
}

function CustomerRow({ c, idx, t, lang, onClick }) {
  const next = getNextReward(c.stamps, REWARDS);
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

Object.assign(window, { ScreenHome, ScreenCustomers });
