import React, {useState} from 'react';

// import PropTypes from 'prop-types';

import './customButtonStyles.scss';

function CustomButton() {
  const [text, setText] = useState('Login');

  return (
    <button 
        className="custom-button">
      {text}
    </button>     
  );
}

CustomButton.propTypes = {

};

export default React.memo(CustomButton);
