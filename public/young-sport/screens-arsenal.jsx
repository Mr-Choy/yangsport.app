/* Young Sport — Arsenal (badminton stringing CRM addon) */

// ─────────────────────────────────────────────────────────────
// ARSENAL panel — fits inside the customer detail screen
// Shows: rackets owned, string popularity, tension trend, KPIs
// ─────────────────────────────────────────────────────────────
function ArsenalPanel({ t, lang, customer, services, onRecord }) {
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
  const usage   = getStringUsage(services);
  const trend   = getTensionTrend(services);
  const avgTension = Math.round(services.reduce((s, x) => s + x.tension, 0) / services.length);

  return (
    <div>
      {/* KPI row */}
      <div className="kpi-grid" style={{ marginBottom: 14 }}>
        <KPI label={t.racketCount}    value={rackets.length} />
        <KPI label={t.totalServices}  value={services.length} />
        <KPI label={t.avgTension}     value={avgTension} delta={t.lbsUnit} deltaDir="up" accent />
        <KPI label={t.lastStrung}     value={trend[trend.length-1]?.daysAgo ?? 0}
             delta={lang === 'zh' ? '天前' : 'd ago'} deltaDir="up" />
      </div>

      {/* Tension trend chart */}
      <div className="sect-row">
        <div className="sect-title">{t.tensionTrend}</div>
        <span className="badge fire">{trend[trend.length-1]?.tension ?? 0} {t.lbsUnit}</span>
      </div>
      <div className="ys-card">
        <TensionChart trend={trend} t={t} lang={lang} />
      </div>

      {/* Equipment library: rackets */}
      <div className="sect-row">
        <div className="sect-title">{t.rackets}</div>
        <span className="sect-link">{rackets.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rackets.map((r, i) => (
          <RacketCard key={`${r.brand}-${r.model}-${i}`} racket={r} t={t} lang={lang} />
        ))}
      </div>

      {/* String popularity */}
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

// ─────────────────────────────────────────────────────────────
// Racket card with current strung status
// ─────────────────────────────────────────────────────────────
function RacketCard({ racket, t, lang }) {
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

// ─────────────────────────────────────────────────────────────
// Tension trend chart (mini SVG line chart)
// ─────────────────────────────────────────────────────────────
function TensionChart({ trend, t, lang }) {
  if (trend.length === 0) return null;

  const W = 320, H = 120, padL = 36, padR = 12, padT = 14, padB = 24;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const tensions = trend.map(s => s.tension);
  const minT = Math.min(...tensions) - 1;
  const maxT = Math.max(...tensions) + 1;
  const rangeT = Math.max(maxT - minT, 4);

  const xFor = (i) => padL + (i / Math.max(trend.length - 1, 1)) * innerW;
  const yFor = (v) => padT + (1 - (v - minT) / rangeT) * innerH;

  // path
  const path = trend.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(s.tension)}`).join(' ');
  const areaPath = `${path} L ${xFor(trend.length - 1)} ${padT + innerH} L ${xFor(0)} ${padT + innerH} Z`;

  // grid lines for y at min, mid, max
  const yTicks = [minT + 1, Math.round((minT + maxT) / 2), maxT - 1];

  return (
    <div className="tension-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="tension-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#ff2d2d" />
            <stop offset="50%"  stopColor="#ff7a18" />
            <stop offset="100%" stopColor="#ffd000" />
          </linearGradient>
          <linearGradient id="tension-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#ff7a18" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff7a18" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* y grid + labels */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={yFor(v)} y2={yFor(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={padL - 6} y={yFor(v) + 3} textAnchor="end"
                  fontSize="9" fill="rgba(255,255,255,0.45)"
                  fontFamily="JetBrains Mono, monospace">
              {v}
            </text>
          </g>
        ))}

        {/* area fill */}
        <path d={areaPath} fill="url(#tension-area)" />
        {/* line */}
        <path d={path} fill="none" stroke="url(#tension-line)" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />

        {/* points */}
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
                      fontFamily="Saira Condensed, sans-serif" fontStyle="italic">
                  {s.tension}
                </text>
              )}
            </g>
          );
        })}

        {/* x labels (first, last) */}
        <text x={xFor(0)} y={H - 4} textAnchor="start"
              fontSize="9" fill="rgba(255,255,255,0.4)"
              fontFamily="JetBrains Mono, monospace">
          −{trend[0].daysAgo}d
        </text>
        <text x={xFor(trend.length - 1)} y={H - 4} textAnchor="end"
              fontSize="9" fill="rgba(255,255,255,0.4)"
              fontFamily="JetBrains Mono, monospace">
          {lang === 'zh' ? '今天' : 'now'}
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Record stringing service sheet (admin flow)
// ─────────────────────────────────────────────────────────────
function RecordStringingSheet({ open, t, lang, customer, idx, onClose, onSave }) {
  const [racketBrand, setRacketBrand] = React.useState(null);
  const [racketModel, setRacketModel] = React.useState('');
  const [stringBrand, setStringBrand] = React.useState(null);
  const [stringModel, setStringModel] = React.useState('');
  const [tension, setTension]         = React.useState(26);
  const [customTension, setCustomTension] = React.useState(false);
  const [serviceDate, setServiceDate] = React.useState('today');
  const [note, setNote] = React.useState('');
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setRacketBrand(null); setRacketModel('');
      setStringBrand(null); setStringModel('');
      setTension(26); setCustomTension(false);
      setServiceDate('today'); setNote(''); setDone(false);
    }
  }, [open]);

  const racketBrands = EQUIPMENT_PRESETS.racket_brand;
  const stringBrands = EQUIPMENT_PRESETS.string_brand;
  const racketModels = racketBrand
    ? racketBrands.find(b => b.name === racketBrand)?.models || []
    : [];
  const stringModels = stringBrand
    ? stringBrands.find(b => b.name === stringBrand)?.models || []
    : [];

  const canSave = racketBrand && racketModel && stringBrand && stringModel && tension;

  const handleSave = () => {
    if (!canSave) return;
    setDone(true);
    setTimeout(() => {
      onSave({
        racketBrand, racketModel,
        stringBrand, stringModel,
        tension, note,
        daysAgo: serviceDate === 'today' ? 0 : 1,
      });
      onClose();
    }, 1100);
  };

  if (!customer) return null;

  return (
    <Sheet open={open} onClose={onClose} title={t.stringingService} fullHeight>
      {done ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            margin: '0 auto', display: 'grid', placeItems: 'center',
            background: 'var(--fire)',
            boxShadow: 'var(--shadow-glow)',
            animation: 'stamp-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            color: '#fff',
          }}>
            <Icon.racket width="44" height="44" />
          </div>
          <div className="display" style={{ fontSize: 28, marginTop: 18, color: 'var(--ink)' }}>
            {t.stringingSaved}
          </div>
          <div style={{ marginTop: 8, color: 'var(--ink-muted)', fontSize: 13 }}>
            {racketBrand} {racketModel} · {stringModel} @ <span className="fire-text" style={{ fontWeight: 700 }}>{tension} {t.lbsUnit}</span>
          </div>
        </div>
      ) : (
        <>
          {/* customer header strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Avatar name={customer.name} idx={idx} size={40} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{customer.name}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                {formatPhone(customer.phone)}
              </div>
            </div>
          </div>

          {/* date */}
          <div style={{ marginBottom: 16 }}>
            <Label>{t.serviceDate}</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setServiceDate('today')}
                className="ys-btn ys-btn-sm"
                style={{
                  flex: 1, background: serviceDate === 'today' ? 'var(--fire)' : 'var(--surface)',
                  color: serviceDate === 'today' ? '#fff' : 'var(--ink-2)',
                  border: serviceDate === 'today' ? '0' : '1px solid var(--line)',
                  height: 44,
                }}>
                {t.today2}
              </button>
              <button
                onClick={() => setServiceDate('yesterday')}
                className="ys-btn ys-btn-sm"
                style={{
                  flex: 1, background: serviceDate === 'yesterday' ? 'var(--fire)' : 'var(--surface)',
                  color: serviceDate === 'yesterday' ? '#fff' : 'var(--ink-2)',
                  border: serviceDate === 'yesterday' ? '0' : '1px solid var(--line)',
                  height: 44,
                }}>
                {t.yesterday}
              </button>
              <button
                className="ys-btn ys-btn-sm ys-btn-ghost"
                style={{ flex: 1, height: 44 }}>
                <Icon.edit width="14" height="14" /> {t.custom}
              </button>
            </div>
          </div>

          {/* racket brand */}
          <div style={{ marginBottom: 12 }}>
            <Label>{t.racketBrand}</Label>
            <div className="ys-chips" style={{ gap: 8 }}>
              {racketBrands.map(b => (
                <button key={b.name} onClick={() => { setRacketBrand(b.name); setRacketModel(''); }}
                        className={`eq-card ${racketBrand === b.name ? 'is-active' : ''}`}
                        style={{ minWidth: 76 }}>
                  <Icon.racket width="20" height="20" />
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* racket model */}
          {racketBrand && (
            <div style={{ marginBottom: 16 }}>
              <Label>{t.racketModel}</Label>
              <div className="ys-chips" style={{ gap: 8 }}>
                {racketModels.map(m => (
                  <button key={m} onClick={() => setRacketModel(m)}
                          className={`ys-chip ${racketModel === m ? 'is-active' : ''}`}
                          style={{ fontWeight: 600 }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* string brand */}
          <div style={{ marginBottom: 12 }}>
            <Label>{t.stringBrand}</Label>
            <div className="ys-chips" style={{ gap: 8 }}>
              {stringBrands.map(b => (
                <button key={b.name} onClick={() => { setStringBrand(b.name); setStringModel(''); }}
                        className={`eq-card ${stringBrand === b.name ? 'is-active' : ''}`}
                        style={{ minWidth: 76 }}>
                  <Icon.string width="20" height="20" />
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* string model */}
          {stringBrand && (
            <div style={{ marginBottom: 16 }}>
              <Label>{t.stringModel}</Label>
              <div className="ys-chips" style={{ gap: 8 }}>
                {stringModels.map(m => (
                  <button key={m} onClick={() => setStringModel(m)}
                          className={`ys-chip ${stringModel === m ? 'is-active' : ''}`}
                          style={{ fontWeight: 600 }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* tension */}
          <div style={{ marginBottom: 18 }}>
            <Label>{t.tension}</Label>
            <div className="tens-grid">
              {TENSION_PRESETS.map(v => (
                <button key={v} onClick={() => { setTension(v); setCustomTension(false); }}
                        className={`tens-chip ${tension === v && !customTension ? 'is-active' : ''}`}>
                  {v}
                  <span className="tens-chip-unit">{t.lbsUnit}</span>
                </button>
              ))}
              <button onClick={() => setCustomTension(true)}
                      className={`tens-chip ${customTension ? 'is-active' : ''}`}
                      style={{ padding: 4 }}>
                {customTension ? (
                  <input
                    type="number"
                    autoFocus
                    value={tension}
                    onChange={(e) => setTension(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 0,
                      color: 'inherit',
                      textAlign: 'center',
                      fontFamily: 'inherit',
                      fontWeight: 'inherit',
                      fontStyle: 'inherit',
                      fontSize: 20,
                      outline: 'none',
                    }}
                  />
                ) : (
                  <>
                    <Icon.edit width="16" height="16" />
                    <span className="tens-chip-unit" style={{ marginTop: 4 }}>{t.custom}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* note */}
          <div style={{ marginBottom: 18 }}>
            <Label>{t.note}</Label>
            <input className="ys-input"
                   placeholder={t.optionalNote}
                   value={note} onChange={(e) => setNote(e.target.value)}
                   style={{ fontFamily: 'Hanken Grotesk, sans-serif' }} />
          </div>

          {/* save */}
          <button className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg"
                  disabled={!canSave}
                  onClick={handleSave}>
            <Icon.check width="22" height="22" /> {t.saveStringing}
          </button>
        </>
      )}
    </Sheet>
  );
}

Object.assign(window, { ArsenalPanel, RacketCard, TensionChart, RecordStringingSheet });
