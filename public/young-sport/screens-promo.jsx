/* Young Sport — Promotions + Rewards rules + More/Settings screens */

// ─────────────────────────────────────────────────────────────
// Promotions screen
// ─────────────────────────────────────────────────────────────
function ScreenPromo({ t, lang, campaigns, customers, onNewCampaign, onOpenCampaign }) {
  const active = campaigns.filter(c => c.status === 'live');
  const past   = campaigns.filter(c => c.status === 'finished');

  return (
    <div className="ys-content ys-pad-top ys-pad-btm">
      <div style={{ marginTop: 14, marginBottom: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="display" style={{ fontSize: 34 }}>{t.promoTitle}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 2 }}>
            {campaigns.length} {lang === 'zh' ? '个活动' : 'campaigns'}
          </div>
        </div>
        <button className="ys-btn ys-btn-primary ys-btn-sm" onClick={onNewCampaign}>
          <Icon.plus width="16" height="16" /> {t.newCampaign}
        </button>
      </div>

      {/* Active */}
      {active.length > 0 && (
        <>
          <div className="sect-row">
            <div className="sect-title">{t.activeCampaigns}</div>
            <span className="badge fire">●  LIVE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {active.map(c => (
              <CampaignCard key={c.id} c={c} t={t} lang={lang}
                            onClick={() => onOpenCampaign(c.id)} />
            ))}
          </div>
        </>
      )}

      {/* Past */}
      {past.length > 0 && (
        <>
          <div className="sect-row">
            <div className="sect-title">{t.pastCampaigns}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {past.map(c => (
              <CampaignCard key={c.id} c={c} t={t} lang={lang} muted
                            onClick={() => onOpenCampaign(c.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CampaignCard({ c, t, lang, muted = false, onClick }) {
  const openRate = c.recipients ? Math.round((c.opened / c.recipients) * 100) : 0;
  const isLive = c.status === 'live';
  return (
    <div className="ys-card" style={{
      cursor: 'pointer',
      opacity: muted ? 0.85 : 1,
      borderColor: isLive ? 'rgba(255,122,24,0.25)' : 'var(--line)',
    }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isLive && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', boxShadow: '0 0 8px var(--orange)' }} />}
            <span style={{ fontWeight: 700, fontSize: 15 }}>
              {lang === 'zh' ? c.titleZh : c.title}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 6, lineHeight: 1.45,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {lang === 'zh' ? c.messageZh : c.message}
          </div>
        </div>
        {c.channel === 'whatsapp' && (
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(56,214,138,0.12)',
                        color: '#38d68a', display: 'grid', placeItems: 'center', flex: 'none' }}>
            <Icon.whatsapp width="18" height="18" />
          </div>
        )}
        {c.channel === 'sms' && (
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--surface-2)',
                        color: 'var(--ink-muted)', display: 'grid', placeItems: 'center', flex: 'none', fontSize: 10, fontWeight: 700 }}>
            SMS
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
        <CampStat label={t.recipients} value={c.recipients} />
        <CampStat label={t.opened} value={`${openRate}%`} sub={`${c.opened}`} />
        <CampStat label={lang === 'zh' ? '兑换' : 'Redeems'} value={c.redeemed} accent />
      </div>
    </div>
  );
}

function CampStat({ label, value, sub, accent = false }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
        {label}
      </div>
      <div className={`display-num ${accent ? 'fire-text' : ''}`} style={{ fontSize: 22, marginTop: 2 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 10, color: 'var(--ink-dim)' }}>/{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// New campaign sheet
// ─────────────────────────────────────────────────────────────
function NewCampaignSheet({ open, t, lang, customers, onClose, onSend }) {
  const [title, setTitle] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [audience, setAudience] = React.useState('all');
  const [channel, setChannel] = React.useState('whatsapp');
  const [step, setStep] = React.useState('compose'); // compose | sending | sent

  React.useEffect(() => {
    if (!open) {
      setTitle(''); setMsg(''); setAudience('all'); setChannel('whatsapp'); setStep('compose');
    }
  }, [open]);

  const audienceCounts = {
    all:      customers.length,
    active:   customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    ready:    customers.filter(c => c.stamps >= 3).length,
  };

  const recipients = audienceCounts[audience];
  const audienceOpts = [
    { id: 'all',      label: t.audienceAll },
    { id: 'active',   label: t.audienceActive },
    { id: 'inactive', label: t.audienceInactive },
    { id: 'ready',    label: t.audienceReady },
  ];

  const handleSend = () => {
    setStep('sending');
    setTimeout(() => setStep('sent'), 900);
    setTimeout(() => {
      onSend({
        title: title || (lang === 'zh' ? '新活动' : 'New campaign'),
        titleZh: title || '新活动',
        message: msg,
        messageZh: msg,
        audience, channel, recipients,
      });
      onClose();
    }, 2200);
  };

  return (
    <Sheet open={open} onClose={onClose} title={t.newCampaign} fullHeight>
      {step === 'sent' ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            margin: '0 auto', display: 'grid', placeItems: 'center',
            background: 'var(--fire)',
            boxShadow: 'var(--shadow-glow)',
            animation: 'stamp-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <Icon.send width="40" height="40" color="#fff" />
          </div>
          <div className="display" style={{ fontSize: 28, marginTop: 18, color: 'var(--ink)' }}>
            {lang === 'zh' ? '已送达！' : 'SENT!'}
          </div>
          <div style={{ marginTop: 6, color: 'var(--ink-muted)', fontSize: 13 }}>
            {recipients} {t.recipients}
          </div>
        </div>
      ) : step === 'sending' ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="display fire-text" style={{ fontSize: 22 }}>
            {lang === 'zh' ? '发送中…' : 'BROADCASTING…'}
          </div>
          <div style={{ marginTop: 12, color: 'var(--ink-muted)', fontSize: 12 }}>
            {recipients} {t.recipients}
          </div>
        </div>
      ) : (
        <>
          {/* title */}
          <div style={{ marginBottom: 14 }}>
            <Label>{t.campaignTitle}</Label>
            <input className="ys-input" placeholder={lang === 'zh' ? '例如：周末加倍' : 'e.g. Weekend bonus'}
                   value={title} onChange={(e) => setTitle(e.target.value)}
                   style={{ fontFamily: 'Hanken Grotesk, sans-serif' }} />
          </div>

          {/* message */}
          <div style={{ marginBottom: 14 }}>
            <Label>{t.campaignMessage}</Label>
            <textarea className="ys-textarea" rows="3"
                      placeholder={lang === 'zh' ? '写一条让客户回来的消息…' : 'Write a message that brings them back…'}
                      value={msg} onChange={(e) => setMsg(e.target.value)} />
            <div style={{ fontSize: 11, color: 'var(--ink-dim)', marginTop: 4, textAlign: 'right' }}>
              {msg.length} / 160
            </div>
          </div>

          {/* audience */}
          <div style={{ marginBottom: 14 }}>
            <Label>{t.audience}</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {audienceOpts.map(o => (
                <button key={o.id}
                        className="ys-card-tight"
                        style={{
                          textAlign: 'left',
                          border: `2px solid ${audience === o.id ? 'var(--orange)' : 'var(--line)'}`,
                          background: 'var(--surface)',
                          cursor: 'pointer',
                          color: 'inherit',
                        }}
                        onClick={() => setAudience(o.id)}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{o.label}</div>
                  <div className="display-num" style={{ fontSize: 22, marginTop: 4, color: audience === o.id ? 'var(--orange)' : 'var(--ink)' }}>
                    {audienceCounts[o.id]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* channel */}
          <div style={{ marginBottom: 18 }}>
            <Label>{t.channel}</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              <ChannelBtn icon={<Icon.whatsapp width="18" height="18" />}
                          label="WhatsApp"
                          active={channel === 'whatsapp'}
                          onClick={() => setChannel('whatsapp')} />
              <ChannelBtn label="SMS"
                          active={channel === 'sms'}
                          onClick={() => setChannel('sms')} />
              <ChannelBtn icon={<Icon.bell width="18" height="18" />}
                          label="Push"
                          active={channel === 'push'}
                          onClick={() => setChannel('push')} />
            </div>
          </div>

          <button className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg"
                  onClick={handleSend}
                  disabled={!msg.trim()}>
            <Icon.send width="20" height="20" /> {t.sendNow}
            <span style={{ opacity: 0.8, fontWeight: 600, fontStyle: 'normal', fontSize: 13 }}>· {recipients}</span>
          </button>
        </>
      )}
    </Sheet>
  );
}

function Label({ children }) {
  return (
    <div className="eyebrow" style={{ marginBottom: 8 }}>{children}</div>
  );
}

function ChannelBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick}
            className="ys-card-tight"
            style={{
              flex: 1,
              border: `2px solid ${active ? 'var(--orange)' : 'var(--line)'}`,
              background: 'var(--surface)',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '10px 6px',
            }}>
      {icon && <div style={{ color: active ? 'var(--orange)' : 'var(--ink-2)' }}>{icon}</div>}
      <div style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--orange)' : 'var(--ink)' }}>{label}</div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Reward rules sheet
// ─────────────────────────────────────────────────────────────
function RewardRulesSheet({ open, t, lang, rewards, onClose, onUpdate }) {
  const [editing, setEditing] = React.useState(rewards);

  React.useEffect(() => { if (open) setEditing(rewards); }, [open, rewards]);

  const toggle = (id) => setEditing(editing.map(r => r.id === id ? { ...r, active: !r.active } : r));

  return (
    <Sheet open={open} onClose={onClose} title={t.rewardRules} fullHeight>
      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 16 }}>
        {t.rewardRulesSub}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {editing.map(r => (
          <div key={r.id} className="ys-card" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            opacity: r.active ? 1 : 0.55,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: r.active ? 'var(--fire-soft)' : 'var(--surface-2)',
              display: 'grid', placeItems: 'center',
              border: `1px solid ${r.active ? 'rgba(255,122,24,0.3)' : 'var(--line)'}`,
            }}>
              <span className="display-num fire-text" style={{ fontSize: 22 }}>{r.threshold}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {lang === 'zh' ? r.nameZh : r.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
                {t.deductStamps} {r.threshold} {t.stamps}
              </div>
            </div>
            <button onClick={() => toggle(r.id)}
                    className="ys-iconbtn" style={{
                      width: 'auto', padding: '6px 10px',
                      background: r.active ? 'var(--fire)' : 'var(--surface-2)',
                      color: r.active ? '#fff' : 'var(--ink-muted)',
                      border: 0,
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}>
              {r.active ? t.active : t.paused}
            </button>
          </div>
        ))}
      </div>

      <button className="ys-btn ys-btn-ghost ys-btn-block" style={{ marginTop: 16 }}>
        <Icon.plus width="18" height="18" /> {t.addRule}
      </button>

      <button className="ys-btn ys-btn-primary ys-btn-block" style={{ marginTop: 12 }}
              onClick={() => { onUpdate(editing); onClose(); }}>
        {t.save}
      </button>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────
// More screen
// ─────────────────────────────────────────────────────────────
function ScreenMore({ t, lang, onToggleLang, onOpenRules, customers, campaigns }) {
  const items = [
    { id: 'rules',   icon: <Icon.gift width="20" height="20" />,     label: t.rewardRulesLabel, sub: `${REWARDS.filter(r=>r.active).length} ${lang === 'zh' ? '条规则' : 'rules'}`, onClick: onOpenRules },
    { id: 'store',   icon: <YMini size={20} />,                       label: t.storeInfo,        sub: t.storeName },
    { id: 'notif',   icon: <Icon.bell width="20" height="20" />,      label: t.notifications,    sub: lang === 'zh' ? '开启' : 'On' },
    { id: 'team',    icon: <Icon.users width="20" height="20" />,     label: t.teamMembers,      sub: `2 ${lang === 'zh' ? '人' : 'members'}` },
    { id: 'export',  icon: <Icon.copy width="20" height="20" />,      label: t.exportData,       sub: 'CSV / Excel' },
    { id: 'lang',    icon: <Icon.globe width="20" height="20" />,     label: t.language,         sub: lang === 'en' ? 'English' : '中文', onClick: onToggleLang },
    { id: 'help',    icon: <Icon.spark width="20" height="20" />,     label: t.help,             sub: '' },
  ];

  return (
    <div className="ys-content ys-pad-top ys-pad-btm">
      <div style={{ marginTop: 14, marginBottom: 14 }}>
        <div className="display" style={{ fontSize: 34 }}>{t.moreTitle}</div>
      </div>

      {/* Store hero card */}
      <div className="ys-card-hero" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(255,255,255,0.04)',
            display: 'grid', placeItems: 'center',
          }}>
            <YLogo size={36} gradient />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              {t.storeInfo}
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, marginTop: 4 }}>{t.storeName}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2, fontStyle: 'italic' }}>
              {t.tagline}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              {lang === 'zh' ? '客户' : 'Members'}
            </div>
            <div className="display-num" style={{ fontSize: 24, marginTop: 2 }}>{customers.length}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              {lang === 'zh' ? '活动' : 'Campaigns'}
            </div>
            <div className="display-num" style={{ fontSize: 24, marginTop: 2 }}>{campaigns.length}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              {lang === 'zh' ? '奖励' : 'Rewards'}
            </div>
            <div className="display-num" style={{ fontSize: 24, marginTop: 2 }}>{REWARDS.length}</div>
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div className="ys-card" style={{ padding: 0 }}>
        {items.map((it, i) => (
          <div key={it.id}
               onClick={it.onClick}
               style={{
                 display: 'flex', alignItems: 'center', gap: 14,
                 padding: '14px 16px',
                 borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 'none',
                 cursor: it.onClick ? 'pointer' : 'default',
               }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--surface-2)',
              display: 'grid', placeItems: 'center',
              color: 'var(--ink-2)',
              flex: 'none',
            }}>{it.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{it.label}</div>
              {it.sub && <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 1 }}>{it.sub}</div>}
            </div>
            {it.onClick && <Icon.chev width="14" height="14" color="var(--ink-muted)" />}
          </div>
        ))}
      </div>

      <button className="ys-btn ys-btn-ghost ys-btn-block" style={{ marginTop: 16, color: 'var(--danger)' }}>
        {t.signOut}
      </button>

      {/* Brand footer */}
      <div style={{ textAlign: 'center', marginTop: 28, opacity: 0.4 }}>
        <YLogo size={36} color="#3a3a44" />
        <div className="display" style={{ fontSize: 12, marginTop: 6, color: 'var(--ink-dim)' }}>
          YOUNG SPORT · {t.tagline.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenPromo, NewCampaignSheet, RewardRulesSheet, ScreenMore });
