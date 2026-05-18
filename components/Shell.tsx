'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useSession } from '@/lib/session';
import { TabBar } from './ui/TabBar';
import { Toast } from './ui/Toast';
import { AddStampSheet } from './sheets/AddStampSheet';
import { RedeemSheet } from './sheets/RedeemSheet';
import { NewCampaignSheet } from './sheets/NewCampaignSheet';
import { RewardRulesSheet } from './sheets/RewardRulesSheet';
import { RecordStringingSheet } from './sheets/RecordStringingSheet';

const PUBLIC_ROUTES = ['/login', '/login/admin', '/login/customer'];

export function Shell({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.theme);
  const session = useSession((s) => s.session);
  const hydrated = useSession((s) => s.hydrated);
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // route guard
  useEffect(() => {
    if (!hydrated) return;
    const onPublic = PUBLIC_ROUTES.includes(pathname);

    if (!session && !onPublic) {
      router.replace('/login');
      return;
    }
    if (session?.kind === 'admin' && onPublic) {
      router.replace('/');
      return;
    }
    if (session?.kind === 'customer') {
      if (!onPublic && pathname !== '/me') {
        router.replace('/me');
      }
    }
  }, [hydrated, session, pathname, router]);

  const isLoginRoute = PUBLIC_ROUTES.includes(pathname);
  const isCustomerRoute = pathname === '/me';
  const showChrome = mounted && session?.kind === 'admin' && !isLoginRoute;

  return (
    <div className="ys-viewport">
      <div className="ys-viewport-inner">
        <div className="ys-app" data-theme={mounted ? theme : 'fire'}>
          {children}
          {showChrome && (
            <>
              <TabBar />
              <AddStampSheet />
              <RedeemSheet />
              <NewCampaignSheet />
              <RewardRulesSheet />
              <RecordStringingSheet />
            </>
          )}
          {mounted && !isLoginRoute && <Toast />}
          {/* customer dashboard route has its own top bar; admin routes use ones in pages */}
          {isCustomerRoute && null}
        </div>
      </div>
    </div>
  );
}
