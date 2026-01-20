import React, { useEffect, useReducer } from 'react';

import './progressBarStyles.scss';

function ProgressBar({
    value = 0,
    max = 100,
    barClass = "progress-bar",
  }) {
    const percentage = (value / max) * 100;
  
    if (value === max) barClass = "progress-bar-full";
  
    const label = `${value}/${max}`;
  
    return (
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="progress w-25 mb-0">
          <div
            className={barClass}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={value}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="progress-bar-label">{label}</div>
      </div>
    );
  }
  
  export default ProgressBar;
