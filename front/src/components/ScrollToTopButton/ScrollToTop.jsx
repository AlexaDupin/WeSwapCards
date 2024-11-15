import React, { useState, useEffect } from 'react';
import {ArrowUp} from "react-bootstrap-icons";

import './scrollToTopStyles.scss';

function ScrollToTop() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="top-to-btn">
      {showTopBtn && (
        <ArrowUp
          className="top-icon"
          onClick={goToTop}
        />
      )}
    </div>
  );
}
ScrollToTop.propTypes = {};

export default React.memo(ScrollToTop);
