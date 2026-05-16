/* Young Sport — shared UI components and icons */

// ─────────────────────────────────────────────────────────────
// Brand mark: the Young Sport Y, recreated as inline SVG
// 3-fold rotational symmetry, each arm = 3 nested chevrons
// ─────────────────────────────────────────────────────────────
function YLogo({ size = 28, gradient = false, color = '#2e7dd2', stroke = 4 }) {
  const gid = React.useId().replace(/:/g, '');
  const strokeColor = gradient ? `url(#fire-${gid})` : color;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`fire-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ff2d2d" />
          <stop offset="50%"  stopColor="#ff7a18" />
          <stop offset="100%" stopColor="#ffd000" />
        </linearGradient>
      </defs>
      {[0, 120, 240].map(deg => (
        <g key={deg} transform={`rotate(${deg} 50 50)`}>
          {/* Each arm: 3 parallel chevrons. Apex points down toward center, opening up. */}
          {/* Outer (largest, apex closest to center) */}
          <path d="M 20 12 L 50 46 L 80 12"
                stroke={strokeColor} strokeWidth={stroke}
                strokeLinejoin="miter" strokeLinecap="square" />
          {/* Middle */}
          <path d="M 27 10 L 50 34 L 73 10"
                stroke={strokeColor} strokeWidth={stroke}
                strokeLinejoin="miter" strokeLinecap="square" />
          {/* Inner */}
          <path d="M 34 8 L 50 22 L 66 8"
                stroke={strokeColor} strokeWidth={stroke}
                strokeLinejoin="miter" strokeLinecap="square" />
        </g>
      ))}
    </svg>
  );
}

// Single chevron — used as the stamp glyph (echoes one arm of the Y)
function ChevronStamp({ size = 20, filled = false }) {
  const gid = React.useId().replace(/:/g, '');
  if (filled) {
    return (
      <svg viewBox="0 0 40 40" width={size} height={size} fill="none">
        <defs>
          <linearGradient id={`s-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#ff2d2d" />
            <stop offset="50%"  stopColor="#ff7a18" />
            <stop offset="100%" stopColor="#ffd000" />
          </linearGradient>
        </defs>
        {/* nested chevrons */}
        <path d="M 8 14 L 20 25 L 32 14" stroke={`url(#s-${gid})`} strokeWidth="3.5" strokeLinejoin="miter" />
        <path d="M 12 9 L 20 17 L 28 9" stroke={`url(#s-${gid})`} strokeWidth="3.5" strokeLinejoin="miter" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none">
      <path d="M 8 14 L 20 25 L 32 14" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinejoin="miter" />
      <path d="M 12 9 L 20 17 L 28 9" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeLinejoin="miter" />
    </svg>
  );
}

// Small monochrome Y for badges/icons
function YMini({ size = 18, color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none">
      {[0, 120, 240].map(deg => (
        <g key={deg} transform={`rotate(${deg} 50 50)`}>
          <path d="M 28 12 L 50 36 L 72 12" stroke={color} strokeWidth="6" strokeLinejoin="miter" />
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Icons (line, monoweight)
// ─────────────────────────────────────────────────────────────
const Icon = {
  home:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12L12 4l9 8" /><path d="M5 11v9h14v-9" /></svg>,
  users:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.8" /><path d="M21 20c0-2.5-1.6-4.6-3.8-5.4" /></svg>,
  plus:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  megaphone:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 11v2a2 2 0 0 0 2 2h2l8 5V4l-8 5H5a2 2 0 0 0-2 2z" /><path d="M18 8c1.3 1 2 2.5 2 4s-.7 3-2 4" /></svg>,
  grid:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>,
  search:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></svg>,
  bell:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>,
  arrowL:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M11 18l-6-6 6-6"/></svg>,
  arrowR:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  arrowUp:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M12 19V5M6 11l6-6 6 6"/></svg>,
  check:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 12l5 5L20 6"/></svg>,
  x:        (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>,
  trash:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>,
  copy:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>,
  phone:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2z"/></svg>,
  spark:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/></svg>,
  gift:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-2 0-4-1-4-3s2-2 3-1 1 3 1 4zM12 8c2 0 4-1 4-3s-2-2-3-1-1 3-1 4z"/></svg>,
  whatsapp: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M17.5 14.4c-.3-.2-1.7-.8-2-1-.3-.1-.4-.1-.6.1l-.9 1c-.2.2-.3.2-.6.1-.7-.3-1.6-1-2.2-1.6-.4-.4-.8-.9-1-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5l-.7-1.6c-.2-.4-.4-.3-.5-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.2.2 2 3 5 4.2.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.1-1.4 0-.1-.2-.2-.5-.3zM12 2A10 10 0 0 0 2 12c0 1.8.5 3.5 1.3 5L2 22l5.3-1.4A10 10 0 0 0 22 12 10 10 0 0 0 12 2z"/></svg>,
  send:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  edit:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>,
  settings: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>,
  chev:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 6l6 6-6 6"/></svg>,
  filter:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18M6 12h12M10 18h4"/></svg>,
  flame:    (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2s5 4 5 9a5 5 0 1 1-10 0c0-2 1-3.5 2-4.5C8 9 12 8 12 2z"/></svg>,
  zap:      (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>,
  globe:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>,
};

// ─────────────────────────────────────────────────────────────
// Top bar
// ─────────────────────────────────────────────────────────────
function TopBar({ title, onBack, right, lang, onToggleLang, showBrand = false }) {
  return (
    <div className="ys-topbar">
      {onBack ? (
        <button className="ys-iconbtn" onClick={onBack} aria-label="Back">
          <Icon.arrowL width="20" height="20" />
        </button>
      ) : showBrand ? (
        <div className="ys-brand">
          <YLogo size={26} gradient />
          <span className="ys-brand-text" style={{ whiteSpace: 'nowrap', color: 'var(--orange)' }}>
            YOUNG <span style={{ color: 'var(--yellow)' }}>SPORT</span>
          </span>
        </div>
      ) : (
        <div className="ys-brand">
          <span className="ys-brand-text" style={{ whiteSpace: 'nowrap' }}>{title}</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        {right}
        <button className="ys-iconbtn" onClick={onToggleLang} aria-label="Toggle language">
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
            {lang === 'en' ? 'EN' : '中'}
          </span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom tab bar
// ─────────────────────────────────────────────────────────────
function TabBar({ tab, onTab, onStamp, t }) {
  return (
    <div className="ys-tabs">
      <button className={`ys-tab ${tab === 'home' ? 'is-active' : ''}`} onClick={() => onTab('home')}>
        <Icon.home />
        <span className="ys-tab-label">{t.tabHome}</span>
      </button>
      <button className={`ys-tab ${tab === 'customers' ? 'is-active' : ''}`} onClick={() => onTab('customers')}>
        <Icon.users />
        <span className="ys-tab-label">{t.tabCustomers}</span>
      </button>
      <button className="ys-tab-fab" onClick={onStamp} aria-label={t.tabStamp}>
        <Icon.plus width="28" height="28" />
      </button>
      <button className={`ys-tab ${tab === 'promo' ? 'is-active' : ''}`} onClick={() => onTab('promo')}>
        <Icon.megaphone />
        <span className="ys-tab-label">{t.tabPromo}</span>
      </button>
      <button className={`ys-tab ${tab === 'more' ? 'is-active' : ''}`} onClick={() => onTab('more')}>
        <Icon.grid />
        <span className="ys-tab-label">{t.tabMore}</span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stamp grid — chevron-Y collectibles with optional pop-in animation
// ─────────────────────────────────────────────────────────────
function StampGrid({ stamps, threshold, cols = 5, newIndex = -1 }) {
  const cells = [];
  // capped at threshold for display; overflow indicated separately
  const max = threshold;
  for (let i = 0; i < max; i++) {
    const filled = i < stamps;
    const isRedeem = stamps >= threshold && i === threshold - 1;
    const isNew = i === newIndex;
    cells.push(
      <div key={i}
           className={`stamp-cell ${filled ? 'is-filled' : ''} ${isRedeem ? 'is-redeem-target' : ''} ${isNew ? 'is-new' : ''}`}>
        <ChevronStamp size={26} filled={filled} />
      </div>
    );
  }
  return (
    <div className="stamp-grid" style={{ '--cols': cols }}>
      {cells}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sheet (modal from bottom)
// ─────────────────────────────────────────────────────────────
function Sheet({ open, onClose, title, children, fullHeight = false }) {
  if (!open) return null;
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" style={fullHeight ? { height: '92%' } : null}>
        <div className="sheet-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="sheet-title">{title}</div>
          <button className="ys-iconbtn" onClick={onClose} aria-label="Close" style={{ width: 32, height: 32 }}>
            <Icon.x width="16" height="16" />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const isReward = toast.type === 'reward';
  const isRedeem = toast.type === 'redeem';
  return (
    <div className="toast" key={toast.id}>
      <div className="toast-icon" style={{
        background: isReward ? 'var(--fire)' : isRedeem ? 'rgba(255,208,0,0.15)' : 'rgba(56,214,138,0.15)',
        color: isReward ? '#fff' : isRedeem ? 'var(--yellow)' : 'var(--success)',
      }}>
        {isReward ? <Icon.flame width="18" height="18" /> :
         isRedeem ? <Icon.gift width="18" height="18" /> :
                    <Icon.check width="18" height="18" />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{toast.title}</div>
        {toast.sub && <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>{toast.sub}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────────────────────
function Avatar({ name, idx, size = 44 }) {
  const cls = getAvatarClass(idx);
  return (
    <div className={`avatar ${cls}`} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {getInitials(name)}
    </div>
  );
}

Object.assign(window, {
  YLogo, ChevronStamp, YMini, Icon,
  TopBar, TabBar, StampGrid, Sheet, Toast, Avatar,
});
