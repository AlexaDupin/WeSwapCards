import React from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './customButtonStyles.scss';

// Renders a Link for `to` (client-side), an anchor for `href`, a button otherwise.
function CustomButton({
  text,
  onClick = () => {},
  href,
  to,
  variant = 'primary',
  size = 'md',
  className = '',
}) {
  const classes = [
    'custom-button',
    `custom-button--${variant}`,
    `custom-button--${size}`,
    className,
  ].filter(Boolean).join(' ');

  if (to) {
    return (
      <Link to={to} className={classes}>
        {text}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {text}
      </a>
    );
  }

  return (
    <button
      className={classes}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  href: PropTypes.string,
  to: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default React.memo(CustomButton);
