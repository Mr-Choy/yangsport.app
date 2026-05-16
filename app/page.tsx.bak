/* Young Sport — Root App: state, navigation, tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "en",
  "theme": "fire",
  "stampStyle": "chevron",
  "density": "regular"
}/*EDITMODE-END*/;

function App({ tweaks, setTweak }) {
  const t = tweaks;
  const lang = t.lang === 'zh' ? 'zh' : 'en';
  const strings = I18N[lang];

  // ─── app state ───────────────────────────────────────────
  const [customers, setCustomers] = React.useState(SEED_CUSTOMERS);
  const [campaigns, setCampaigns] = React.useState(SEED_CAMPAIGNS);
  const [rewards,   setRewards]   = React.useState(REWARDS);
  const [txMap,     setTxMap]     = React.useState(TX_HISTORY);

  // navigation
  const [tab, setTab]             = React.useState('home');
  const [openCustomerId, setOpenCustomerId] = React.useState(null);
  const [openCampaignId, setOpenCampaignId] = React.useState(null);
  const [sheet, setSheet] = React.useState(null);    // 'addStamp' | 'redeem' | 'newCampaign' | 'rules'
  const [redeemFor, setRedeemFor] = React.useState(null);

  // toast
  const [toast, setToast] = React.useState(null);
  const toastTimer = React.useRef(null);
  const showToast = React.useCallback((toast) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ ...toast, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  // ─── actions ──────────────────────────────────────────────
  const handleAddStamp = (customerId) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      const newStamps = c.stamps + 1;
      // check if just crossed a reward threshold
      const r = rewards.find(r => r.active && r.threshold === newStamps);
      if (r) {
        setTimeout(() => showToast({
          type: 'reward',
          title: strings.rewardEarned,
          sub: lang === 'zh' ? r.nameZh : r.name,
        }), 250);
      } else {
        showToast({ type: 'earn', title: strings.stampAdded, sub: `+1 ${strings.stamps}` });
      }
      return { ...c, stamps: newStamps, total_earned: c.total_earned + 1, lastVisitDays: 0 };
    }));
    // append a tx
    setTxMap(prev => {
      const newTx = { id: `t-${Date.now()}`, type: 'earn', change: 1, daysAgo: 0, note: '' };
      const arr = prev[customerId] || [];
      return { ...prev, [customerId]: [newTx, ...arr] };
    });
  };

  const handleRedeem = (customerId, threshold, reward) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      return { ...c, stamps: c.stamps - threshold, total_redeemed: c.total_redeemed + threshold };
    }));
    setTxMap(prev => {
      const note = reward ? (lang === 'zh' ? reward.nameZh : reward.name) : '';
      const newTx = { id: `t-${Date.now()}`, type: 'redeem', change: -threshold, daysAgo: 0, note };
      const arr = prev[customerId] || [];
      return { ...prev, [customerId]: [newTx, ...arr] };
    });
    showToast({
      type: 'redeem',
      title: strings.redeemSuccess,
      sub: reward ? (lang === 'zh' ? reward.nameZh : reward.name) : '',
    });
  };

  const openRedeem = (customerId) => {
    setRedeemFor(customerId);
    setSheet('redeem');
  };

  const handleCreateCustomer = ({ phone, name, addStamp = false }) => {
    const newC = {
      id: `c-${Date.now()}`,
      name, phone,
      stamps: addStamp ? 1 : 0,
      total_earned: addStamp ? 1 : 0,
      total_redeemed: 0,
      lastVisitDays: 0,
      joinDays: 0,
      status: 'new',
    };
    setCustomers(prev => [newC, ...prev]);
    if (addStamp) {
      setTxMap(prev => ({
        ...prev,
        [newC.id]: [{ id: `t-${Date.now()}`, type: 'earn', change: 1, daysAgo: 0, note: '' }],
      }));
      showToast({ type: 'earn', title: lang === 'zh' ? '已创建并加章' : 'Created · stamped', sub: name });
    } else {
      showToast({ type: 'earn', title: lang === 'zh' ? '已创建客户' : 'Customer created', sub: name });
    }
  };

  const handleSendCampaign = (data) => {
    const newCamp = {
      id: `k-${Date.now()}`,
      ...data,
      status: 'live',
      sentAt: new Date().toISOString().slice(0,10),
      opened: 0,
      redeemed: 0,
    };
    setCampaigns(prev => [newCamp, ...prev]);
    showToast({ type: 'earn', title: lang === 'zh' ? '已发送' : 'Sent', sub: `${data.recipients} ${strings.recipients}` });
  };

  const openCustomer = (id) => { setOpenCustomerId(id); };
  const closeCustomer = () => { setOpenCustomerId(null); };

  const customer = customers.find(c => c.id === openCustomerId);
  const customerIdx = customers.findIndex(c => c.id === openCustomerId);

  // ─── render ──────────────────────────────────────────────
  let content;
  if (openCustomerId && customer) {
    content = (
      <>
        <TopBar title={lang === 'zh' ? '客户' : 'Customer'} onBack={closeCustomer}
                lang={lang} onToggleLang={() => setTweak('lang', lang === 'en' ? 'zh' : 'en')} />
        <ScreenCustomerDetail
          t={strings} lang={lang}
          customer={customer} idx={customerIdx}
          transactions={txMap[openCustomerId] || []}
          onBack={closeCustomer}
          onAddStamp={handleAddStamp}
          onRedeem={openRedeem}
        />
      </>
    );
  } else if (tab === 'home') {
    content = (
      <>
        <TopBar showBrand
                right={<button className="ys-iconbtn"><Icon.bell width="18" height="18" /><div className="ys-dot" /></button>}
                lang={lang} onToggleLang={() => setTweak('lang', lang === 'en' ? 'zh' : 'en')} />
        <ScreenHome t={strings} lang={lang}
                    customers={customers} campaigns={campaigns} visits={VISITS_7D}
                    onTab={setTab}
                    onOpenCustomer={openCustomer} />
      </>
    );
  } else if (tab === 'customers') {
    content = (
      <>
        <TopBar title={strings.customersTitle}
                right={<button className="ys-iconbtn" onClick={() => setSheet('addStamp')}><Icon.plus width="18" height="18" /></button>}
                lang={lang} onToggleLang={() => setTweak('lang', lang === 'en' ? 'zh' : 'en')} />
        <ScreenCustomers t={strings} lang={lang}
                         customers={customers}
                         onOpenCustomer={openCustomer}
                         onAddCustomer={() => setSheet('addStamp')} />
      </>
    );
  } else if (tab === 'promo') {
    content = (
      <>
        <TopBar title={strings.promoTitle}
                lang={lang} onToggleLang={() => setTweak('lang', lang === 'en' ? 'zh' : 'en')} />
        <ScreenPromo t={strings} lang={lang}
                     campaigns={campaigns} customers={customers}
                     onNewCampaign={() => setSheet('newCampaign')}
                     onOpenCampaign={(id) => {}} />
      </>
    );
  } else {
    content = (
      <>
        <TopBar title={strings.moreTitle}
                lang={lang} onToggleLang={() => setTweak('lang', lang === 'en' ? 'zh' : 'en')} />
        <ScreenMore t={strings} lang={lang}
                    onToggleLang={() => setTweak('lang', lang === 'en' ? 'zh' : 'en')}
                    onOpenRules={() => setSheet('rules')}
                    customers={customers} campaigns={campaigns} />
      </>
    );
  }

  return (
    <div className="ys-app" data-theme={t.theme}>
      {content}

      {/* sheets */}
      <AddStampSheet open={sheet === 'addStamp'} t={strings} lang={lang}
                     customers={customers}
                     onClose={() => setSheet(null)}
                     onStamp={handleAddStamp}
                     onCreate={handleCreateCustomer} />
      <RedeemSheet open={sheet === 'redeem'} t={strings} lang={lang}
                   customer={customers.find(c => c.id === redeemFor)}
                   idx={customers.findIndex(c => c.id === redeemFor)}
                   onClose={() => setSheet(null)}
                   onConfirm={handleRedeem} />
      <NewCampaignSheet open={sheet === 'newCampaign'} t={strings} lang={lang}
                        customers={customers}
                        onClose={() => setSheet(null)}
                        onSend={handleSendCampaign} />
      <RewardRulesSheet open={sheet === 'rules'} t={strings} lang={lang}
                        rewards={rewards}
                        onClose={() => setSheet(null)}
                        onUpdate={setRewards} />

      {/* toast */}
      <Toast toast={toast} />

      {/* bottom tabs (hidden when viewing customer detail to feel focused? — keep visible for nav) */}
      <TabBar tab={tab} onTab={(x) => { setOpenCustomerId(null); setTab(x); }}
              onStamp={() => setSheet('addStamp')} t={strings} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Root + iPhone frame + Tweaks
// ─────────────────────────────────────────────────────────────
function Root() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // responsive scale to viewport
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const W = 402, H = 874;
    const fit = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const s = Math.min(1, Math.min((vw - 32) / W, (vh - 32) / H));
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background:
        'radial-gradient(60% 50% at 30% 0%, rgba(255,122,24,0.06), transparent 70%),' +
        'radial-gradient(50% 40% at 80% 100%, rgba(46,125,210,0.06), transparent 70%),' +
        '#050507',
      padding: 16,
      overflow: 'hidden',
    }}>
      <div style={{ width: 402 * scale, height: 874 * scale, position: 'relative' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 402, height: 874 }}>
          <IOSDevice width={402} height={874} dark={true}>
            <App tweaks={t} setTweak={setTweak} />
          </IOSDevice>
        </div>
      </div>

      {/* Tweaks panel */}
      <TweaksPanel title="Young Sport · Tweaks">
        <TweakSection label="Language" />
        <TweakRadio label="UI" value={t.lang}
                    options={[{ key: 'en', value: 'en', label: 'EN' }, { key: 'zh', value: 'zh', label: '中文' }]}
                    onChange={(v) => setTweak('lang', v)} />

        <TweakSection label="Accent theme" />
        <TweakRadio label="Style" value={t.theme}
                    options={[
                      { key: 'fire',   value: 'fire',   label: 'Fire' },
                      { key: 'red',    value: 'red',    label: 'Red' },
                      { key: 'yellow', value: 'yellow', label: 'Yellow' },
                      { key: 'blue',   value: 'blue',   label: 'Blue' },
                    ]}
                    onChange={(v) => setTweak('theme', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
