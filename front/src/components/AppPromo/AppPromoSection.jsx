import React from 'react';
import PropTypes from 'prop-types';
import { BellFill, Phone, PersonCheck } from 'react-bootstrap-icons';

import StoreBadges from './StoreBadges';
import AppQrCode from './AppQrCode';

import './appPromoStyles.scss';

const BENEFITS = [
  { Icon: BellFill, text: 'Get notified when other users reply' },
  { Icon: Phone, text: 'Manage your cards and swaps wherever you are' },
  { Icon: PersonCheck, text: 'Already a member? Your account and cards are already there' },
];

function AppPromoSection({ className = '' }) {
  return (
    <div className={`app-promo-section ${className}`}>
      <div className="app-promo-section__head">
        <p className="app-promo-section__eyebrow">Mobile app</p>
        <h2 className="app-promo-section__title">Your swaps, now in your pocket</h2>
        <p className="app-promo-section__lede">
          WeSwapCards is now available on iOS and Android.
        </p>
      </div>

      <ul className="app-promo-section__benefits">
        {BENEFITS.map(({ Icon, text }) => (
          <li key={text} className="app-promo-section__benefit">
            <span className="app-promo-section__icon" aria-hidden="true"><Icon /></span>
            {text}
          </li>
        ))}
      </ul>

      <div className="app-download app-promo-section__get">
        <AppQrCode placement="homepage" />
        <StoreBadges placement="homepage" className="app-promo-section__badges" />
      </div>
    </div>
  );
}

AppPromoSection.propTypes = {
  className: PropTypes.string,
};

export default React.memo(AppPromoSection);
