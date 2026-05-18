'use client';

import { useEffect, useState } from 'react';
import { useStore } from './store';
import { getStrings, type Strings } from './i18n';
import type { Lang } from './types';

/**
 * Returns lang/theme once the persist middleware has rehydrated from localStorage,
 * to avoid hydration mismatches. Before hydration we render with defaults (en / fire).
 */
export function useT(): { lang: Lang; t: Strings; hydrated: boolean } {
  const lang = useStore((s) => s.lang);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  const effectiveLang: Lang = hydrated ? lang : 'en';
  return { lang: effectiveLang, t: getStrings(effectiveLang), hydrated };
}
