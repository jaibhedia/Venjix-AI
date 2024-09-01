import React from 'react';
import './Orb.css';

const Orb = ({ isRaging }) => {
  return (
    <div className="orb-container">
      <div className={`orb ${isRaging ? 'rage' : ''}`}>
        <div className="glow"></div>
        <div className="core"></div>
        <div className="inner-glow"></div>
        <div className="white-flare"></div> {/* Added white flare */}
        <div className="lens-flare"></div>
      </div>
    </div>
  );
};

export default Orb;
