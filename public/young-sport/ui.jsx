/* Young Sport — shared UI components and icons */

// ─────────────────────────────────────────────────────────────
// Brand mark: actual Young Sport Y logo (from real SVG paths)
// ─────────────────────────────────────────────────────────────
const YOUNG_SPORT_LOGO_PATHS = [
  "M62.5678 47.7615C95.8244 66.6794 129.737 87.2822 162.779 106.746L360.579 223.266L659.797 48.5567L687.267 67.059L661.388 82.1071L360.462 257.654L149.742 133.511C111.697 111.1 73.3915 88.0876 35.1328 66.1538C42.1438 60.7552 54.8342 52.8984 62.5678 47.7615Z",
  "M10.7449 115.36C22.157 120.99 36.7068 129.68 48.0185 136.002L117.177 174.627L332.859 295.072L332.848 571.966L332.864 638.148C332.879 643.725 333.296 664.701 332.465 668.761L331.256 668.966L303.026 655.305C303.02 541.469 302.072 426.263 303.37 312.538C269.441 294.173 235.188 274.632 201.431 255.842L8.13867 148.206C8.72793 137.574 9.89324 126.062 10.7449 115.36Z",
  "M710.456 115.774L711.453 116.399C712.875 124.319 713.688 139.586 714.392 148.104C704.27 154.266 691.4 160.977 680.788 166.884L616.343 202.762L419.329 312.399L419.381 655.195C410.681 659.725 400.948 664.232 392.073 668.563L390.702 668.893C389.068 666.299 389.859 654.374 389.866 650.849C389.896 609.161 389.888 567.458 389.888 525.763L389.485 295.245C399.621 288.929 413.693 281.579 424.335 275.642L492.21 237.782L710.456 115.774Z",
  "M587.913 0C590.676 0.00073291 612.033 15.2211 616.086 17.9922L361.012 171.482C336.938 156.166 310.351 140.713 285.837 125.841L137.066 35.6311L109.122 18.5807L136.466 0.29609L361.063 136.746C436.318 92.5138 513.266 45.4536 587.913 0Z",
  "M719.053 200.801C720.46 206.425 721.926 226.515 722.571 233.351C697.953 247.203 671.333 260.876 646.253 274.333L494.064 356.036L495.464 491.94C495.816 533.29 495.772 576.466 496.864 617.722L469.505 630.885L468.112 631.5C466.844 630.027 466.925 629.177 466.925 626.854C466.991 593.594 466.522 560.137 466.214 526.863L464.242 338.439C489.513 323.612 521.431 307.487 547.574 293.384L719.053 200.801Z",
  "M3.03717 200.794C11.6335 204.891 23.7316 211.836 32.248 216.433L87.903 246.489L258.083 338.256L256.206 532.374L255.437 597.061C255.354 608.179 255.744 620.148 255.119 631.178L254.128 631.552L225.438 617.648C226.235 611.448 225.935 595.91 226.004 588.794L226.555 533.092L228.261 355.992C218.003 350.231 207.392 344.867 197.054 339.216C131.679 303.494 65.1938 269.372 0 233.356C0.88902 222.491 1.90189 211.637 3.03717 200.794Z",
];

function YLogo({ size = 28, gradient = false, color = '#6B6B6B' }) {
  const gid = React.useId().replace(/:/g, '');
  const fill = gradient ? `url(#fire-${gid})` : color;
  return (
    <svg viewBox="0 0 723 669" width={size} height={size * (669/723)} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`fire-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ff2d2d" />
          <stop offset="50%"  stopColor="#ff7a18" />
          <stop offset="100%" stopColor="#ffd000" />
        </linearGradient>
      </defs>
      {YOUNG_SPORT_LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} fill={fill} />
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

// Small monochrome Y for badges/icons — uses the real logo paths
function YMini({ size = 18, color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 723 669" width={size} height={size * (669/723)} fill="none">
      {YOUNG_SPORT_LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} fill={color} />
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
  racket:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="9.5" cy="9.5" rx="5.5" ry="6.5" transform="rotate(-30 9.5 9.5)"/><path d="M6 6.5 L13 11"/><path d="M5 11 L11.5 14"/><path d="M6 5 L9.5 13"/><path d="M11 5 L13 12"/><path d="M14.5 14 L20 19.5 M19 21 L21 19 L19.5 17.5"/></svg>,
  string:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M3 6 L21 6 M3 10 L21 10 M3 14 L21 14 M3 18 L21 18"/></svg>,
  chart:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 18 L9 12 L13 14 L21 6"/><path d="M21 12 V6 H15"/></svg>,
  award:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="9" r="6"/><path d="M8 14 L6 22 L12 18 L18 22 L16 14"/></svg>,
  history:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l4 2"/></svg>,
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
