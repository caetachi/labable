import './gcash.css'

export default function GCashPay({amount, handleClose, onPaymentSuccess}) {

    function handlePay() {
        // Simulate payment processing
        document.getElementById('payId').disabled = true;
        document.getElementById('payId').textContent = 'Processing...';
        setTimeout(() => {
            onPaymentSuccess();
            handleClose();
        }, 2000);
    }
    return (
        <div className="gcash-payment-card">
            <h4>Labable Laundry Services</h4>
            <div className="amount-container">
                <h3>GCash</h3>
                <div className="available-balance">
                    <h3>PHP 52, 340.00</h3>
                    <p>Available Balance</p>
                </div>
            </div>
            <h3>YOU ARE ABOUT TO PAY</h3>
            <div className="amount-container">
                <p>Amount to Pay:</p>
                <h3>PHP {amount.toFixed(2)}</h3>
            </div>
            <div className="total-container">
                <p>Total</p>
                <h3>PHP {amount.toFixed(2)}</h3>
            </div>
            <p>Please review that the details are correct before proceeding with the payment.</p>
            <div className="gcash-actions">
                <button className='nxt-btn' id='payId' onClick={handlePay}>Pay PHP {amount.toFixed(2)}</button>
            </div>
        </div>
    )
}