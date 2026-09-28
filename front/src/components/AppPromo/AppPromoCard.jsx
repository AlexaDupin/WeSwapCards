import React from 'react';

import StoreBadges from './StoreBadges';

import './appPromoStyles.scss';

function AppPromoCard() {
  return (
    <aside className="app-promo-card" aria-label="WeSwapCards mobile app">
      <h2 className="app-promo-card__title">
        WeSwapCards is now available on iOS and Android 📱
      </h2>
      <p className="app-promo-card__text">
        Get notified when other users reply, and manage your cards and swaps wherever you are. Sign in with the same account. Everything is already there.
      </p>
      <StoreBadges placement="menu" />
    </aside>
  );
}

export default React.memo(AppPromoCard);
