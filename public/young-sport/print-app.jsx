/* Young Sport — Print layout: every key screen on its own page */

function PrintFrame({ index, total, caption, sub, children }) {
  return (
    <section className="print-page">
      <div className="print-header">
        <div className="print-counter">
          <span className="print-num">{String(index).padStart(2, '0')}</span>
          <span className="print-of">/ {String(total).padStart(2, '0')}</span>
        </div>
        <div className="print-title-block">
          <div className="print-title">{caption}</div>
          {sub && <div className="print-sub">{sub}</div>}
        </div>
        <div className="print-brand">
          <YLogo size={22} gradient />
          <span className="print-brand-text">YOUNG SPORT · MERCHANT</span>
        </div>
      </div>
      <div className="print-phone-wrap">
        <IOSDevice width={402} height={874} dark={true}>
          {children}
        </IOSDevice>
      </div>
    </section>
  );
}

function ScreenShell({ children, theme = 'fire' }) {
  return <div className="ys-app" data-theme={theme}>{children}</div>;
}

function PrintApp() {
  const lang = 'en';
  const strings = I18N.en;
  const customers = SEED_CUSTOMERS;
  const campaigns = SEED_CAMPAIGNS;
  const rewards = REWARDS;
  const noop = () => {};

  const aaron = customers.find(c => c.id === 'c1');         // 8 stamps, ready
  const aaronIdx = customers.findIndex(c => c.id === 'c1');
  const aaronTx = TX_HISTORY.c1 || [];

  const total = 9;

  return (
    <div className="print-doc">
      {/* ─── 01 Dashboard ────────────────────────── */}
      <PrintFrame index={1} total={total}
                  caption="Dashboard"
                  sub="Daily overview · stamps issued · visit trend · customer mix">
        <ScreenShell>
          <TopBar showBrand lang={lang} onToggleLang={noop}
                  right={<button className="ys-iconbtn"><Icon.bell width="18" height="18" /><div className="ys-dot" /></button>} />
          <ScreenHome t={strings} lang={lang}
                      customers={customers} campaigns={campaigns} visits={VISITS_7D}
                      onTab={noop} onOpenCustomer={noop} />
          <TabBar tab="home" onTab={noop} onStamp={noop} t={strings} />
        </ScreenShell>
      </PrintFrame>

      {/* ─── 02 Customers ────────────────────────── */}
      <PrintFrame index={2} total={total}
                  caption="Customers (CRM)"
                  sub="Search by phone or name · filter by status · live stamp progress">
        <ScreenShell>
          <TopBar title={strings.customersTitle}
                  right={<button className="ys-iconbtn"><Icon.plus width="18" height="18" /></button>}
                  lang={lang} onToggleLang={noop} />
          <ScreenCustomers t={strings} lang={lang}
                           customers={customers}
                           onOpenCustomer={noop}
                           onAddCustomer={noop} />
          <TabBar tab="customers" onTab={noop} onStamp={noop} t={strings} />
        </ScreenShell>
      </PrintFrame>

      {/* ─── 03 Customer Detail ──────────────────── */}
      <PrintFrame index={3} total={total}
                  caption="Customer detail"
                  sub="Stamp progress · next reward · add / redeem · transaction history">
        <ScreenShell>
          <TopBar title="Customer" onBack={noop}
                  lang={lang} onToggleLang={noop} />
          <ScreenCustomerDetail
            t={strings} lang={lang}
            customer={aaron} idx={aaronIdx}
            transactions={aaronTx}
            onBack={noop} onAddStamp={noop} onRedeem={noop} />
          <TabBar tab="customers" onTab={noop} onStamp={noop} t={strings} />
        </ScreenShell>
      </PrintFrame>

      {/* ─── 04 Add Stamp flow ───────────────────── */}
      <PrintFrame index={4} total={total}
                  caption="Add stamp · phone keypad"
                  sub="Auto-find existing customer or create new — one tap to stamp">
        <ScreenShell>
          <TopBar title={strings.customersTitle}
                  right={<button className="ys-iconbtn"><Icon.plus width="18" height="18" /></button>}
                  lang={lang} onToggleLang={noop} />
          <ScreenCustomers t={strings} lang={lang}
                           customers={customers}
                           onOpenCustomer={noop}
                           onAddCustomer={noop} />
          <TabBar tab="customers" onTab={noop} onStamp={noop} t={strings} />
          <AddStampSheet open={true} t={strings} lang={lang}
                         customers={customers}
                         initialPhone="0123450011"
                         onClose={noop} onStamp={noop} onCreate={noop} />
        </ScreenShell>
      </PrintFrame>

      {/* ─── 05 Redeem ───────────────────────────── */}
      <PrintFrame index={5} total={total}
                  caption="Redeem reward"
                  sub="Picker — choose which reward to redeem with available stamps">
        <ScreenShell>
          <TopBar title="Customer" onBack={noop} lang={lang} onToggleLang={noop} />
          <ScreenCustomerDetail
            t={strings} lang={lang}
            customer={aaron} idx={aaronIdx}
            transactions={aaronTx}
            onBack={noop} onAddStamp={noop} onRedeem={noop} />
          <TabBar tab="customers" onTab={noop} onStamp={noop} t={strings} />
          <RedeemSheet open={true} t={strings} lang={lang}
                       customer={aaron} idx={aaronIdx}
                       onClose={noop} onConfirm={noop} />
        </ScreenShell>
      </PrintFrame>

      {/* ─── 06 Promotions ───────────────────────── */}
      <PrintFrame index={6} total={total}
                  caption="Promotions"
                  sub="Live + past campaigns · open rate · redeem rate">
        <ScreenShell>
          <TopBar title={strings.promoTitle} lang={lang} onToggleLang={noop} />
          <ScreenPromo t={strings} lang={lang}
                       campaigns={campaigns} customers={customers}
                       onNewCampaign={noop} onOpenCampaign={noop} />
          <TabBar tab="promo" onTab={noop} onStamp={noop} t={strings} />
        </ScreenShell>
      </PrintFrame>

      {/* ─── 07 New Campaign ─────────────────────── */}
      <PrintFrame index={7} total={total}
                  caption="New campaign · broadcast composer"
                  sub="Title · message · audience selector · channel — WhatsApp / SMS / Push">
        <ScreenShell>
          <TopBar title={strings.promoTitle} lang={lang} onToggleLang={noop} />
          <ScreenPromo t={strings} lang={lang}
                       campaigns={campaigns} customers={customers}
                       onNewCampaign={noop} onOpenCampaign={noop} />
          <TabBar tab="promo" onTab={noop} onStamp={noop} t={strings} />
          <NewCampaignSheet open={true} t={strings} lang={lang}
                            customers={customers}
                            onClose={noop} onSend={noop} />
        </ScreenShell>
      </PrintFrame>

      {/* ─── 08 More / Settings ──────────────────── */}
      <PrintFrame index={8} total={total}
                  caption="Settings · store profile"
                  sub="Reward rules · store info · notifications · language · team">
        <ScreenShell>
          <TopBar title={strings.moreTitle} lang={lang} onToggleLang={noop} />
          <ScreenMore t={strings} lang={lang}
                      onToggleLang={noop} onOpenRules={noop}
                      customers={customers} campaigns={campaigns} />
          <TabBar tab="more" onTab={noop} onStamp={noop} t={strings} />
        </ScreenShell>
      </PrintFrame>

      {/* ─── 09 Reward rules ─────────────────────── */}
      <PrintFrame index={9} total={total}
                  caption="Reward rules"
                  sub="Edit thresholds · reward names · toggle active / paused">
        <ScreenShell>
          <TopBar title={strings.moreTitle} lang={lang} onToggleLang={noop} />
          <ScreenMore t={strings} lang={lang}
                      onToggleLang={noop} onOpenRules={noop}
                      customers={customers} campaigns={campaigns} />
          <TabBar tab="more" onTab={noop} onStamp={noop} t={strings} />
          <RewardRulesSheet open={true} t={strings} lang={lang}
                            rewards={rewards}
                            onClose={noop} onUpdate={noop} />
        </ScreenShell>
      </PrintFrame>
    </div>
  );
}

// mount + auto-print
function mountPrint() {
  ReactDOM.createRoot(document.getElementById('root')).render(<PrintApp />);
  if (window.__YS_NOPRINT) return;
  const fire = () => setTimeout(() => { try { window.print(); } catch (e) {} }, 800);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fire);
  } else {
    setTimeout(fire, 1200);
  }
}

mountPrint();
