import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { detectPlatform } from '../../helpers/appStores';
import homepageQr from '../../images/qr/app-qr-homepage.svg';
import menuQr from '../../images/qr/app-qr-menu.svg';

import './appPromoStyles.scss';

// Each code points to https://weswapcards.com/app/index.html?from=<placement>,
// which redirects the scanning phone to its store (public/app/index.html).
// The file name is explicit because .htaccess only serves real files: a bare
// /app/ is rewritten to the React app. Regenerate the SVGs if a placement is
// added or the URL changes.
const QR_CODES = {
  homepage: homepageQr,
  menu: menuQr,
};

// Desktop only: a phone or tablet can't scan its own screen and gets its badge instead.
function AppQrCode({ placement }) {
  const isDesktop = useMemo(() => detectPlatform() === 'other', []);
  if (!isDesktop) return null;

  return (
    <figure className="app-qr">
      <img
        className="app-qr__code"
        src={QR_CODES[placement]}
        width="128"
        height="128"
        alt="QR code to download the WeSwapCards app on your phone"
      />
      <figcaption className="app-qr__caption">Scan to download</figcaption>
    </figure>
  );
}

AppQrCode.propTypes = {
  placement: PropTypes.oneOf(['homepage', 'menu']).isRequired,
};

export default React.memo(AppQrCode);
