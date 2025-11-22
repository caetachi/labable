import React, { useState, useRef } from 'react';
import './gcash-pin.css';
import './gcash.css'

export default function GCashPin({ render }) {
  const [pin, setPin] = useState('');
  const inputRef = useRef(null);

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="gcash-payment-card">
        <h3>Enter your MPIN</h3>
        <div className="pin-input-container" onClick={handleContainerClick}>
            <div className="pin-input">
            {[0, 1, 2, 3].map((index) => (
                <span key={index} className={`pin-bullet ${pin.length > index ? 'filled' : ''}`}></span>
            ))}
            </div>
            <input
            ref={inputRef}
            type="tel"
            value={pin}
            onChange={handlePinChange}
            maxLength="4"
            className="hidden-input"
            />
        </div>
        <div className="gcash-actions">
            {
                pin.length === 4 ? (
                    <button className="nxt-btn" onClick={() => render('pay')}>Next</button>
                ) : (
                    <button className="nxt-btn disabled" disabled>Next</button>
                )
            }
        </div>
    </div>
  );
}
