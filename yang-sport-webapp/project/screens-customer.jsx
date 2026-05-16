/* Young Sport — Customer Detail + Add Stamp flow + Redeem sheet */

// ─────────────────────────────────────────────────────────────
// Customer Detail
// ─────────────────────────────────────────────────────────────
function ScreenCustomerDetail({ t, lang, customer, idx, transactions, onBack, onAddStamp, onRedeem, onToast }) {
  const [newIndex, setNewIndex] = React.useState(-1);
  const c = customer;
  const next = getNextReward(c.stamps, REWARDS);
  const redeemables = getRedeemable(c.stamps, REWARDS);

  // figure out threshold for stamp grid display
  const threshold = next ? next.threshold : (redeemables[0] ? redeemables[0].threshold : 3);
  const cols = threshold <= 5 ? threshold : threshold <= 6 ? 3 : 5;

  const handleAdd = () => {
    const before = c.stamps;
    onAddStamp(c.id);
    // animate the newly-added cell
    setNewIndex(before);
    setTimeout(() => setNewIndex(-1), 600);
  };

  return (
    <div className="ys-content ys-pad-top ys-pad-btm">
      {/* Customer header */}
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

      {/* Stamp progress hero */}
      <div className="ys-card-hero" style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div className="eyebrow">{next ? t.nextReward : t.rewardReady}</div>
            <div style={{ marginTop: 6, fontFamily: 'Saira Condensed, sans-serif', fontWeight: 800, fontStyle: 'italic', fontSize: 18 }}>
              {next ? (lang === 'zh' ? next.nameZh : next.name)
                    : t.rewardReadySub}
            </div>
          </div>
          <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
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

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button className="ys-btn ys-btn-primary" style={{ flex: 2 }} onClick={handleAdd}>
          <Icon.plus width="20" height="20" /> {t.addStamp}
        </button>
        <button className="ys-btn ys-btn-ghost" style={{ flex: 1 }}
                disabled={redeemables.length === 0}
                onClick={() => redeemables.length > 0 && onRedeem(c.id)}>
          <Icon.gift width="18" height="18" /> {t.redeem}
        </button>
      </div>

      {/* Available rewards (if any redeemable) */}
      {redeemables.length > 0 && (
        <>
          <div className="sect-row">
            <div className="sect-title">{t.chooseReward}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {redeemables.map(r => (
              <RewardCard key={r.id} reward={r} lang={lang} t={t}
                          available={true} onTap={() => onRedeem(c.id, r.id)} />
            ))}
          </div>
        </>
      )}

      {/* Lifetime stats */}
      <div className="kpi-grid" style={{ marginTop: 20 }}>
        <KPI label={t.memberSince} value={Math.floor(c.joinDays / 30) || '0'}
             delta={lang === 'zh' ? '月' : 'mo'} deltaDir="up" />
        <KPI label={t.totalVisits} value={c.total_earned} />
        <KPI label={t.rewardsEarned} value={Math.floor(c.total_redeemed / 3)} />
        <KPI label={lang === 'zh' ? '总章数' : 'All stamps'} value={c.total_earned + c.total_redeemed} />
      </div>

      {/* History */}
      <div className="sect-row">
        <div className="sect-title">{t.history}</div>
      </div>
      <div className="ys-card">
        {transactions.length === 0 ? (
          <div style={{ color: 'var(--ink-muted)', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
            {lang === 'zh' ? '暂无记录' : 'No history yet'}
          </div>
        ) : (
          transactions.map(tx => (
            <div className="tx-row" key={tx.id}>
              <div className={`tx-icon ${tx.type}`}>
                {tx.type === 'earn'
                  ? <Icon.plus width="18" height="18" />
                  : <Icon.gift width="18" height="18" />}
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
                {tx.change > 0 ? '+' : ''}{tx.change}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function RewardCard({ reward, lang, t, available, onTap }) {
  return (
    <div className="ys-card" style={{
      display: 'flex', alignItems: 'center', gap: 14,
      cursor: available ? 'pointer' : 'default',
      opacity: available ? 1 : 0.55,
      borderColor: available ? 'rgba(255,208,0,0.3)' : 'var(--line)',
    }} onClick={available ? onTap : null}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: available ? 'var(--fire-soft)' : 'var(--surface-2)',
        display: 'grid', placeItems: 'center',
        border: `1px solid ${available ? 'rgba(255,122,24,0.3)' : 'var(--line)'}`,
      }}>
        <Icon.gift width="22" height="22" color={available ? 'var(--orange)' : 'var(--ink-muted)'} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{lang === 'zh' ? reward.nameZh : reward.name}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
          {t.deductStamps} {reward.threshold} {t.stamps}
        </div>
      </div>
      {available && (
        <span className="badge gold">{lang === 'zh' ? '可兑换' : 'READY'}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Add Stamp flow (sheet)
// ─────────────────────────────────────────────────────────────
function AddStampSheet({ open, t, lang, customers, onClose, onStamp, onCreate }) {
  const [phone, setPhone] = React.useState('');
  const [step, setStep] = React.useState('input'); // input | found | not-found | create
  const [match, setMatch] = React.useState(null);
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    if (!open) {
      setPhone(''); setStep('input'); setMatch(null); setName('');
    }
  }, [open]);

  // auto-find when phone is long enough
  React.useEffect(() => {
    if (phone.length < 7) { setStep('input'); setMatch(null); return; }
    const m = customers.find(c => c.phone === phone);
    if (m) { setMatch(m); setStep('found'); }
    else if (phone.length >= 10) { setStep('not-found'); }
    else { setStep('input'); }
  }, [phone, customers]);

  const onPad = (digit) => {
    if (digit === 'del') setPhone(phone.slice(0, -1));
    else if (phone.length < 11) setPhone(phone + digit);
  };

  const confirmExisting = () => {
    onStamp(match.id);
    onClose();
  };

  const confirmCreate = () => {
    onCreate({ phone, name: name.trim() || (lang === 'zh' ? '新会员' : 'New member'), addStamp: true });
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={t.addStampTitle} fullHeight={true}>
      {/* Phone display */}
      <div style={{ textAlign: 'center', padding: '14px 0 20px' }}>
        <div className="eyebrow">{t.enterPhone}</div>
        <div className="mono" style={{
          fontSize: 32, marginTop: 6, fontWeight: 600, letterSpacing: '0.02em',
          color: phone ? 'var(--ink)' : 'var(--ink-dim)',
        }}>
          {phone ? formatPhone(phone) : '012-345 6789'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>{t.phoneHint}</div>
      </div>

      {/* Match state */}
      {step === 'found' && match && (
        <div className="ys-card" style={{
          marginBottom: 16,
          borderColor: 'rgba(56,214,138,0.3)',
          background: 'linear-gradient(96deg, rgba(56,214,138,0.08), transparent 60%), var(--surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={match.name} idx={customers.indexOf(match)} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{match.name}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
                {match.stamps} {t.stamps} · {match.total_earned} {lang === 'zh' ? '次到访' : 'visits'}
              </div>
            </div>
            <span className="badge new">{lang === 'zh' ? '找到了' : 'FOUND'}</span>
          </div>
        </div>
      )}

      {step === 'not-found' && (
        <div className="ys-card" style={{
          marginBottom: 16,
          borderColor: 'rgba(255,122,24,0.3)',
          background: 'linear-gradient(96deg, rgba(255,122,24,0.08), transparent 60%), var(--surface)',
        }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{t.notFound}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
            {t.createForNumber} <span className="mono" style={{ color: 'var(--ink)' }}>{formatPhone(phone)}</span>
          </div>
          <input
            className="ys-input"
            placeholder={t.optionalName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              marginTop: 12,
              fontFamily: 'Hanken Grotesk, sans-serif',
            }}
          />
        </div>
      )}

      {/* Keypad */}
      <div className="keypad">
        {['1','2','3','4','5','6','7','8','9'].map(d => (
          <button key={d} className="keypad-btn" onClick={() => onPad(d)}>{d}</button>
        ))}
        <button className="keypad-btn icon" onClick={() => setPhone('')}>{lang === 'zh' ? '清除' : 'C'}</button>
        <button className="keypad-btn" onClick={() => onPad('0')}>0</button>
        <button className="keypad-btn icon" onClick={() => onPad('del')}>⌫</button>
      </div>

      {/* CTA */}
      <div style={{ marginTop: 16 }}>
        {step === 'found' && (
          <button className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg" onClick={confirmExisting}>
            <Icon.plus width="22" height="22" /> {t.addStamp}
          </button>
        )}
        {step === 'not-found' && (
          <button className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg" onClick={confirmCreate}>
            <Icon.zap width="20" height="20" /> {t.createAndAdd}
          </button>
        )}
        {step === 'input' && (
          <button className="ys-btn ys-btn-ghost ys-btn-block ys-btn-lg" disabled style={{ opacity: 0.5 }}>
            {t.findCustomer}
          </button>
        )}
      </div>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────
// Redeem sheet
// ─────────────────────────────────────────────────────────────
function RedeemSheet({ open, t, lang, customer, idx, onClose, onConfirm }) {
  const [selected, setSelected] = React.useState(null);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (open && customer) {
      const redeemables = getRedeemable(customer.stamps, REWARDS);
      setSelected(redeemables[0] || null);
      setDone(false);
    }
  }, [open, customer]);

  if (!customer) return null;
  const redeemables = getRedeemable(customer.stamps, REWARDS);

  const handleConfirm = () => {
    if (!selected) return;
    setDone(true);
    setTimeout(() => {
      onConfirm(customer.id, selected.threshold, selected);
      onClose();
    }, 1200);
  };

  return (
    <Sheet open={open} onClose={onClose} title={t.redeemTitle}>
      {done ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            margin: '0 auto', display: 'grid', placeItems: 'center',
            background: 'var(--fire)',
            boxShadow: 'var(--shadow-glow)',
            animation: 'stamp-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <Icon.gift width="44" height="44" color="#fff" />
          </div>
          <div className="display" style={{ fontSize: 28, marginTop: 18, color: 'var(--ink)' }}>
            {t.redeemSuccess}
          </div>
          <div style={{ marginTop: 6, color: 'var(--ink-muted)', fontSize: 13 }}>
            {t.giveCustomer}
          </div>
          <div className="fire-text display" style={{ fontSize: 22, marginTop: 8 }}>
            {selected && (lang === 'zh' ? selected.nameZh : selected.name)}
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={customer.name} idx={idx} />
              <div>
                <div style={{ fontWeight: 700 }}>{customer.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                  {customer.stamps} {t.stamps}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {redeemables.map(r => (
              <div key={r.id}
                   onClick={() => setSelected(r)}
                   style={{
                     padding: 14,
                     borderRadius: 14,
                     background: 'var(--surface)',
                     border: `2px solid ${selected?.id === r.id ? 'var(--orange)' : 'var(--line)'}`,
                     cursor: 'pointer',
                     display: 'flex', alignItems: 'center', gap: 14,
                     transition: 'border-color 0.15s',
                   }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'var(--fire-soft)',
                  display: 'grid', placeItems: 'center',
                  border: '1px solid rgba(255,122,24,0.3)',
                }}>
                  <Icon.gift width="22" height="22" color="var(--orange)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{lang === 'zh' ? r.nameZh : r.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
                    {t.deductStamps} <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{r.threshold}</span> {t.stamps}
                  </div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: `2px solid ${selected?.id === r.id ? 'var(--orange)' : 'var(--line-2)'}`,
                  background: selected?.id === r.id ? 'var(--orange)' : 'transparent',
                  display: 'grid', placeItems: 'center',
                }}>
                  {selected?.id === r.id && <Icon.check width="12" height="12" color="#fff" />}
                </div>
              </div>
            ))}
          </div>

          <button className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg"
                  disabled={!selected}
                  onClick={handleConfirm}>
            <Icon.gift width="20" height="20" /> {t.confirm}
          </button>
        </>
      )}
    </Sheet>
  );
}

Object.assign(window, { ScreenCustomerDetail, AddStampSheet, RedeemSheet });
