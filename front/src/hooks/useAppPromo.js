import { useState, useCallback } from 'react';
import { APP_PROMO_KEY, readAppPromoDismissedAt } from '../helpers/appPromoStorage';

const SNOOZE_MS = 7 * 24 * 3600 * 1000;

// Dismissal state for the Android header banner, snoozed for 7 days.
export default function useAppPromo() {
  const [dismissedAt, setDismissedAt] = useState(readAppPromoDismissedAt);

  const dismiss = useCallback(() => {
    const now = Date.now();
    try {
      localStorage.setItem(APP_PROMO_KEY, String(now));
    } catch {}
    setDismissedAt(now);
  }, []);

  return { dismissed: Date.now() - dismissedAt < SNOOZE_MS, dismiss };
}
