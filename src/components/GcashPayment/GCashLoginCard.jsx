import './gcash.css'
import { useState } from 'react';

function GCashLoginCard({amount, render}) {
    const [phoneNumber, setPhoneNumber] = useState('');

    function onPhoneNumberChange(e) {
        let temp = e.target.value;
        setPhoneNumber(null);
        const phoneError = document.getElementById('phoneError');

        if(!temp.match(/^\d{10}$/)) {
            phoneError.textContent = "Please enter a valid 10-digit mobile number.";
        } else {
            phoneError.textContent = "";
            setPhoneNumber(temp);
        }
    }

    return (
        <div className="gcash-payment-card">
            <div className="merchant-container">
                <p>Merchant:</p>
                <h4>Labable Laundry Services</h4>
            </div>
            <div className="amount-container">
                <p>Amount to Pay:</p>
                <h3>PHP {amount.toFixed(2)}</h3>
            </div>
            <h3>Login to pay with GCash</h3>
            <div className="input-group">
                <p>+63</p>
                <input type="text" placeholder="Enter your GCash mobile number" maxLength={10} onChange={(e) => onPhoneNumberChange(e)}/>
            </div>
            <p className='error-message' id='phoneError'></p>
            <div className="gcash-actions">
                {
                    phoneNumber ? (
                        <button className="nxt-btn" onClick={() => render('pin')}>Next</button>
                    ) : (
                        <button className="nxt-btn disabled" disabled>Next</button>
                    )
                }
            </div>
        </div>
    )
}

export default GCashLoginCard;