'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/useHydratedLang';
import { TopBar } from '@/components/ui/TopBar';
import { CustomerDetail } from '@/components/screens/CustomerDetail';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const customers = useStore((s) => s.customers);
  const loadCustomerData = useStore((s) => s.loadCustomerData);
  const loadedCustomer = useStore((s) => s.loadedCustomer[id]);
  const { lang } = useT();

  useEffect(() => {
    if (!loadedCustomer) loadCustomerData(id);
  }, [id, loadedCustomer, loadCustomerData]);

  const customer = customers.find((c) => c.id === id);
  const idx = customers.findIndex((c) => c.id === id);

  if (!customer) {
    return (
      <>
        <TopBar onBack={() => router.push('/customers')} title={lang === 'zh' ? '客户' : 'Customer'} />
        <div className="ys-content ys-pad-top ys-pad-btm">
          <div className="empty" style={{ marginTop: 40 }}>
            {lang === 'zh' ? '加载中…' : 'Loading…'}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title={lang === 'zh' ? '客户' : 'Customer'} onBack={() => router.push('/customers')} />
      <CustomerDetail customer={customer} idx={idx} />
    </>
  );
}
