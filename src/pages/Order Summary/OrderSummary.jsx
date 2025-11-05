import './order-summary.css'
import EditLogo from '../../assets/edit.svg'
import SmallPantsLogo from '../../assets/pants-small.svg'
import GCashLogo from '../../assets/gcash.svg'
import { useNavigate } from 'react-router'
import OrderItem from '../../components/Order Item - Order Summary/OrderItem'

export default function OrderSummary() {
    const navigate = useNavigate();
    return(
        <div className='order-summary-container'>
            <div className="title-container">
                <p className='order-summary-title'>Order Summary</p>
                <p className='order-summary-subtitle'>Check all the details of your order and proceed to checkout</p>
            </div>
            <div className="order-details-container gray-border">
                <p className="order-details-title">Order Details</p>
                <div className="address-container">
                    <svg className='location-icon' width="27" height="30" viewBox="0 0 27 30" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.125 0C16.606 0 19.9444 1.38281 22.4058 3.84422C24.8672 6.30564 26.25 9.64403 26.25 13.125C26.25 17.6079 23.8058 21.2771 21.2304 23.9094C19.9437 25.2103 18.5397 26.3897 17.0363 27.4327L16.415 27.8556L16.1233 28.0496L15.5735 28.3996L15.0835 28.6985L14.4769 29.0515C14.0651 29.2865 13.5991 29.4101 13.125 29.4101C12.6509 29.4101 12.1849 29.2865 11.7731 29.0515L11.1665 28.6985L10.4081 28.2319L10.1281 28.0496L9.53021 27.6515C7.9083 26.5541 6.39757 25.3008 5.01958 23.9094C2.44417 21.2756 0 17.6079 0 13.125C0 9.64403 1.38281 6.30564 3.84422 3.84422C6.30564 1.38281 9.64403 0 13.125 0ZM13.125 2.91667C10.4176 2.91667 7.82105 3.99218 5.90662 5.90662C3.99218 7.82105 2.91667 10.4176 2.91667 13.125C2.91667 16.5112 4.77167 19.4833 7.10354 21.8692C8.10619 22.8842 9.18992 23.8157 10.344 24.6546L11.0119 25.13C11.2277 25.2807 11.4353 25.4207 11.6346 25.55L12.2033 25.9146L12.7035 26.2194L13.125 26.4658L13.7885 26.0735L14.3237 25.7381C14.6086 25.5573 14.9134 25.3546 15.2381 25.13L15.906 24.6546C17.0601 23.8157 18.1438 22.8842 19.1465 21.8692C21.4783 19.4848 23.3333 16.5112 23.3333 13.125C23.3333 10.4176 22.2578 7.82105 20.3434 5.90662C18.4289 3.99218 15.8324 2.91667 13.125 2.91667ZM13.125 7.29167C14.6721 7.29167 16.1558 7.90625 17.2498 9.00021C18.3438 10.0942 18.9583 11.5779 18.9583 13.125C18.9583 14.6721 18.3438 16.1558 17.2498 17.2498C16.1558 18.3438 14.6721 18.9583 13.125 18.9583C11.5779 18.9583 10.0942 18.3438 9.00021 17.2498C7.90625 16.1558 7.29167 14.6721 7.29167 13.125C7.29167 11.5779 7.90625 10.0942 9.00021 9.00021C10.0942 7.90625 11.5779 7.29167 13.125 7.29167ZM13.125 10.2083C12.3515 10.2083 11.6096 10.5156 11.0626 11.0626C10.5156 11.6096 10.2083 12.3515 10.2083 13.125C10.2083 13.8985 10.5156 14.6404 11.0626 15.1874C11.6096 15.7344 12.3515 16.0417 13.125 16.0417C13.8985 16.0417 14.6404 15.7344 15.1874 15.1874C15.7344 14.6404 16.0417 13.8985 16.0417 13.125C16.0417 12.3515 15.7344 11.6096 15.1874 11.0626C14.6404 10.5156 13.8985 10.2083 13.125 10.2083Z" />
                    </svg>
                    <p className='section-title'>Address</p>
                </div>
                <div className="address-input-container">
                    <input className='address-input gray-border' type="text" value={'454, Sitio Uli-Ulit, Pinalagdan, Paombong, Bulacan'}/>
                    <img className='address-edit' src={EditLogo} alt="" />
                </div>
                <div className="order-items-container">
                    <div className="order-summary-details-container">
                        <div className="orders-list-container gray-border">
                            <p className='section-title'>Your Order</p>
                            <div className="orders-list-headers-container">
                                <p className='subtext'>Item</p>
                                <p className='subtext'>Quantity</p>
                            </div>
                            <OrderItem imgUrl={SmallPantsLogo} itemName='Pants (Regular)' quantity='3'/>
                            <OrderItem imgUrl={SmallPantsLogo} itemName='Pants (Cotton)' quantity='3'/>
                            <OrderItem imgUrl={SmallPantsLogo} itemName='Skirt (Regular)' quantity='3'/>
                            <OrderItem imgUrl={SmallPantsLogo} itemName='Skirt (Cotton)' quantity='3'/>
                            <OrderItem imgUrl={SmallPantsLogo} itemName='Dress (Regular)' quantity='3'/>
                        </div>
                        <div className="order-summary-date-service-payment">
                            <div className="order-summary-date-container container gray-border">
                                <p className='section-title'>Laundry Transfer Date</p>
                                <input className='order-summary-date-input gray-border' type="datetime-local" name="" id="" disabled="true" />
                            </div>
                            <div className="order-summary-service-container container gray-border">
                                <p className='section-title'>Type of Service</p>
                                <p>Wash and Fold</p>
                            </div>
                            <div className="order-summary-payment-container container gray-border">
                                <p className='section-title'>Payment Method</p>
                                <label className='radio-label' htmlFor="gcash-payment">
                                    GCash <img src={GCashLogo}/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="transfer-details-container">
                    <div className="transfer-mode-container gray-border">
                        <p className='section-title'>Mode of Laundry Transfer</p>
                        <div className="radio-container">
                            <label className='radio-label' htmlFor="pick-up-transfer">
                                <input className='radio' type="radio" name="transfer-mode" id="pick-up-transfer" />
                                Pick-up
                            </label>
                        </div>
                    </div>
                    <div className="receive-mode-container section gray-border">
                        <p className='section-title'>How would you like to receive your clean laundry?</p>
                        <div className="radio-container">
                            <input className='radio' type="radio" name="receive-mode" id="drop-off-receive" />
                            <label className='radio-label' htmlFor="drop-off-receive">
                                Drop-off (Deliver to your front door)
                            </label>
                        </div>
                    </div>
                </div>
                <div className="additional-notes-container section gray-border">
                    <p className='section-title'>Notes</p>
                    <textarea className='additional-textarea gray-border' name="" id="" placeholder='Please make sure you clean all of my underwear.' ></textarea>
                </div>
                <p className='section-title'>Estimated Cost: Php 295.00</p>
                <div className="action-buttons">
                    <button className='action-button draft-button'>Back</button>
                    <button className='action-button summary-button' onClick={() => navigate('/order-summary')}>Checkout</button>
                </div>
            </div>
        </div>
    )
}

