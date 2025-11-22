import './gcash.css';
import gcash from '../../assets/gcash.svg';
import { useState } from 'react';
import { set } from 'firebase/database';
import GCashLoginCard from './GCashLoginCard';
import GCashPin from './GCashPin';
import GCashPay from './GCashPay';

export default function GCash({ amount, handleClose, onPaymentSuccess }) {
    const [comp, setComp] = useState('login');

    function onCompChange(newComp) {
        setComp(newComp);
    }

    return (
        <div className='gcash-payment-container' id='GCashContainer'>
            <i className='fa-solid fa-x' onClick={handleClose}></i>
            <div className="gcash-payment-header">
                <img src={gcash} alt="GCash Logo" />
                <h2>GCash</h2>
            </div>
            {comp === 'login' && <GCashLoginCard amount={amount} render={onCompChange} />}
            {comp === 'pin' && <GCashPin render={onCompChange} />}
            {comp === 'pay' && <GCashPay amount={amount} handleClose={handleClose} onPaymentSuccess={onPaymentSuccess} />}
        </div>
    );
}