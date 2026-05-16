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
  const [customers, setCustomers] = React.useState([]);
  const [campaigns, setCampaigns] = React.useState([]);
  const [rewards,   setRewards]   = React.useState(REWARDS);
  const [txMap,     setTxMap]     = React.useState({});
  const [stringMap, setStringMap] = React.useState({});
  const [loading,   setLoading]   = React.useState(true);

  // ─── load from DB on mount ────────────────────────────────
  React.useEffect(() => {
    Promise.all([
      window.DB.getCustomers(),
      window.DB.getCampaigns(),
    ]).then(([custs, camps]) => {
      setCustomers(custs);
      setCampaigns(camps);
      setLoading(false);
    }).catch(() => {
      setCustomers(SEED_CUSTOMERS);
      setCampaigns(SEED_CAMPAIGNS);
      setLoading(false);
    });
  }, []);

  // navigation
  const [tab, setTab]             = React.useState('home');
  const [openCustomerId, setOpenCustomerId] = React.useState(null);
  const [openCampaignId, setOpenCampaignId] = React.useState(null);
  const [sheet, setSheet] = React.useState(null);    // 'addStamp' | 'redeem' | 'newCampaign' | 'rules' | 'stringing'
  const [redeemFor, setRedeemFor] = React.useState(null);
  const [stringingFor, setStringingFor] = React.useState(null);

  // toast
  const [toast, setToast] = React.useState(null);
  const toastTimer = React.useRef(null);
  const showToast = React.useCallback((toast) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ ...toast, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  // ─── actions ──────────────────────────────────────────────
  const refreshCustomers = () => window.DB.getCustomers().then(setCustomers).catch(() => {});

  const handleAddStamp = (customerId) => {
    window.DB.addStamp(customerId).then(({ customer }) => {
      const newStamps = customer.stamps;
      const r = rewards.find(r => r.active && r.threshold === newStamps);
      if (r) {
        showToast({ type: 'reward', title: strings.rewardEarned, sub: lang === 'zh' ? r.nameZh : r.name });
      } else {
        showToast({ type: 'earn', title: strings.stampAdded, sub: `+1 ${strings.stamps}` });
      }
      refreshCustomers();
    }).catch(() => showToast({ type: 'earn', title: 'Error', sub: 'Could not add stamp' }));
  };

  const handleRedeem = (customerId, threshold, reward) => {
    const note = reward ? (lang === 'zh' ? reward.nameZh : reward.name) : '';
    window.DB.redeem(customerId, threshold, note).then(() => {
      showToast({ type: 'redeem', title: strings.redeemSuccess, sub: note });
      refreshCustomers();
    }).catch(() => showToast({ type: 'redeem', title: 'Error', sub: 'Could not redeem' }));
  };

  const openRedeem = (customerId) => {
    setRedeemFor(customerId);
    setSheet('redeem');
  };

  const openRecordStringing = (customerId) => {
    setStringingFor(customerId);
    setSheet('stringing');
  };

  const handleRecordStringing = (customerId, data) => {
    window.DB.recordStringing({ customerId, ...data }).then(() => {
      showToast({ type: 'redeem', title: strings.stringingSaved, sub: `${data.racketModel} · ${data.tension} ${strings.lbsUnit}` });
      // refresh stringing for this customer
      window.DB.getStringing(customerId).then(ss => {
        setStringMap(prev => ({ ...prev, [customerId]: ss }));
      });
      refreshCustomers();
    }).catch(() => showToast({ type: 'redeem', title: 'Error', sub: 'Could not save' }));
  };

  const handleCreateCustomer = ({ phone, name, addStamp = false }) => {
    window.DB.createCustomer(phone, name).then(newC => {
      if (addStamp) {
        window.DB.addStamp(newC.id).then(() => {
          showToast({ type: 'earn', title: lang === 'zh' ? '已创建并加章' : 'Created · stamped', sub: name });
          refreshCustomers();
        });
      } else {
        showToast({ type: 'earn', title: lang === 'zh' ? '已创建客户' : 'Customer created', sub: name });
        refreshCustomers();
      }
    }).catch(() => showToast({ type: 'earn', title: 'Error', sub: 'Could not create customer' }));
  };

  const handleSendCampaign = (data) => {
    window.DB.createCampaign(data).then(camp => {
      setCampaigns(prev => [camp, ...prev]);
      showToast({ type: 'earn', title: lang === 'zh' ? '已发送' : 'Sent', sub: `${data.recipients} ${strings.recipients}` });
    }).catch(() => showToast({ type: 'earn', title: 'Error', sub: 'Could not send campaign' }));
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
          stringingServices={stringMap[openCustomerId] || []}
          onBack={closeCustomer}
          onAddStamp={handleAddStamp}
          onRedeem={openRedeem}
          onRecordStringing={openRecordStringing}
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
      <RecordStringingSheet open={sheet === 'stringing'} t={strings} lang={lang}
                            customer={customers.find(c => c.id === stringingFor)}
                            idx={customers.findIndex(c => c.id === stringingFor)}
                            onClose={() => setSheet(null)}
                            onSave={(data) => handleRecordStringing(stringingFor, data)} />

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
