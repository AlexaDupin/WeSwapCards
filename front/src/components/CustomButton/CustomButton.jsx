import React from 'react';

import PropTypes from 'prop-types';

import './customButtonStyles.scss';

function CustomButton({
  text, 
  onClick = () => {}, 
  href
}) {

  if (href) {
    return (
      <a href={href} className="custom-button">
        {text}
      </a>
    );
  }

  return (
    <button 
      className="custom-button" 
      onClick={onClick}
    >
      {text}
    </button>
  );
}

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default React.memo(CustomButton);
