// Only the Android header banner is dismissible.
export const APP_PROMO_KEY = 'wsc_app_banner_dismissed_at';

export const readAppPromoDismissedAt = () => {
  try {
    return Number(localStorage.getItem(APP_PROMO_KEY)) || 0;
  } catch {
    return 0;
  }
};

// Same reset as before, except a dismissed banner stays dismissed.
export const clearStoragePreservingAppPromo = () => {
  let dismissedAt = null;
  try {
    dismissedAt = localStorage.getItem(APP_PROMO_KEY);
  } catch {}

  localStorage.clear();

  if (dismissedAt !== null) {
    try {
      localStorage.setItem(APP_PROMO_KEY, dismissedAt);
    } catch {}
  }
};
