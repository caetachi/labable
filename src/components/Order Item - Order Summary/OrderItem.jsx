import './order-item.css'
export default function OrderItem(item){
    return(
        <div className="summary-order-card">
            <div className="summary-order-logo-name-container">
                <img className='summary-order-item-logo' src={item.imgUrl} alt="" />
                <p className='summary-order-item-name'>{item.itemName}</p>
            </div>
            <div className="summary-order-quantity-container">
                <p className='summary-quantity-number'>{item.quantity}</p>
            </div>
        </div>
    )
}