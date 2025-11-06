import './order-item.css'
export default function OrderItem(item){
    return(
        <div className="create-order-card gray-border">
            <div className="order-logo-name-container">
                <img className='create-order-item-logo' src={item.imgUrl} alt="" />
                <p className='create-order-item-name'>{item.itemName}</p>
            </div>
            <div className="order-quantity-container">
                <p className='quantity-operation'>+</p>
                <p className='quantity-number'>{item.quantity}</p>
                <p className='quantity-operation'>-</p>
            </div>
            <div className="delete-container">
                <button className="delete-button section-title">Delete</button>
            </div>
        </div>
    )
}