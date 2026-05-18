'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SessionKind = 'admin' | 'customer';

export interface Session {
  kind: SessionKind;
  username?: string;     // for admin
  customerId?: string;   // for customer
}

interface SessionState {
  session: Session | null;
  hydrated: boolean;
  signIn: (s: Session) => void;
  signOut: () => void;
  _markHydrated: () => void;
}

export const ADMIN_USER = { username: 'admin', password: '1234' };
export const CUSTOMER_DEFAULT_PASSCODE = '1234';

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      hydrated: false,
      signIn: (s) => set({ session: s }),
      signOut: () => set({ session: null }),
      _markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'yang_sport_session',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ session: s.session }),
      onRehydrateStorage: () => (state) => { state?._markHydrated(); },
    },
  ),
);
