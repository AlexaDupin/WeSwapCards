import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { detectPlatform, storesFor, storeUrl } from '../../helpers/appStores';
import appStoreBadge from '../../images/badges/app-store-badge.svg';
import googlePlayBadge from '../../images/badges/google-play-badge.png';

import './appPromoStyles.scss';

// Official artwork, unmodified. Alt text is each store's own badge wording.
const BADGES = {
  ios: { src: appStoreBadge, alt: 'Download on the App Store' },
  android: { src: googlePlayBadge, alt: 'Get it on Google Play' },
};

function StoreBadges({ placement, className = '' }) {
  const stores = useMemo(() => storesFor(detectPlatform()), []);

  return (
    <div className={`store-badges ${className}`}>
      {stores.map((store) => (
        <a
          key={store}
          href={storeUrl(store, placement)}
          target="_blank"
          rel="noopener noreferrer"
          className={`store-badge store-badge--${store}`}
        >
          <img src={BADGES[store].src} alt={BADGES[store].alt} />
        </a>
      ))}
    </div>
  );
}

StoreBadges.propTypes = {
  placement: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default React.memo(StoreBadges);
