const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.weswapcards.app';
const APP_STORE_URL = 'https://apps.apple.com/app/id6810779158';

// 'android', 'ios' (iPhone and iPad) or 'other'.
export const detectPlatform = () => {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent || '';

  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  // iPadOS Safari requests the desktop site and reports itself as a Mac.
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return 'ios';
  return 'other';
};

// Which store badges to show: the visitor's own store, or both when unknown.
export const storesFor = (platform) =>
  platform === 'other' ? ['ios', 'android'] : [platform];

// `placement` names where the link sits, so installs can be attributed per placement.
export const storeUrl = (store, placement) => {
  if (store === 'ios') {
    // Apple campaign params (pt=<provider token>&ct=<placement>) go here once
    // an App Store Connect provider token is available.
    return APP_STORE_URL;
  }

  // Play Console breaks installs down by source and campaign, not medium,
  // so the placement rides in utm_campaign.
  const referrer = encodeURIComponent(
    `utm_source=weswapcards.com&utm_medium=web&utm_campaign=${placement}`
  );
  return `${PLAY_URL}&referrer=${referrer}`;
};
