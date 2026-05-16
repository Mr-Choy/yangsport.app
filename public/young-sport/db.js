// Young Sport — DB bridge (window.DB)
// Called by app.jsx to talk to Next.js API routes → Supabase
(function () {
  async function api(path, opts) {
    const r = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  window.DB = {
    getCustomers:       ()           => api('/api/customers'),
    createCustomer:     (phone, name) => api('/api/customers', { method: 'POST', body: JSON.stringify({ phone, name }) }),
    addStamp:           (customerId)  => api('/api/stamp',     { method: 'POST', body: JSON.stringify({ customerId }) }),
    redeem:             (customerId, amount, note) => api('/api/redeem', { method: 'POST', body: JSON.stringify({ customerId, amount, note }) }),
    getStringing:       (customerId)  => api(`/api/stringing?customerId=${customerId}`),
    recordStringing:    (data)        => api('/api/stringing',  { method: 'POST', body: JSON.stringify(data) }),
    getCampaigns:       ()            => api('/api/campaigns'),
    createCampaign:     (data)        => api('/api/campaigns',  { method: 'POST', body: JSON.stringify(data) }),
  };
})();
