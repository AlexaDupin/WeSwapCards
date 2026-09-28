import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { CloseButton } from 'react-bootstrap';

import useAppPromo from '../../hooks/useAppPromo';
import { detectPlatform, storeUrl } from '../../helpers/appStores';

import './appPromoStyles.scss';

// /menu already carries the permanent app card.
const HIDDEN_ON = new Set(['/menu']);

function AppPromoBanner() {
  const { pathname } = useLocation();
  const { dismissed, dismiss } = useAppPromo();
  const isAndroid = useMemo(() => detectPlatform() === 'android', []);

  if (!isAndroid || dismissed || HIDDEN_ON.has(pathname)) return null;

  return (
    <div className="app-promo-banner" role="region" aria-label="WeSwapCards Android app">
      <p className="app-promo-banner__text">
        <strong>Get notified when other users reply.</strong>
        <span>Same account, everything already there.</span>
      </p>
      <a
        className="app-promo-banner__link"
        href={storeUrl('android', 'android_banner')}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get the app
      </a>
      <CloseButton
        variant="white"
        className="app-promo-banner__close"
        aria-label="Dismiss"
        onClick={dismiss}
      />
    </div>
  );
}

export default React.memo(AppPromoBanner);
