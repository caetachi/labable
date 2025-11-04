import './dashboard-order-history-card.css';

function DashboardOrderHistoryCard({ orderId, orderedDate, status, total, serviceType, items, deliveryDate }) {
    return (
        <div className="order-history-card">
            <div className="order-history-details">
                
                <i className="hgi hgi-stroke hgi-package"></i>

                {/* ... informations ... */}
                <div className="infos">

                    {/* ... first row ... */}
                    <div className="first-row">
                        <h4>ORD-{orderId}</h4>
                        <span className={`status ${status.toLowerCase().replace(/\s+/g, "")}`}>{status}</span>
                    </div>

                    <p>{serviceType} • {items} items</p>
                    <p>Ordered: {orderedDate} {deliveryDate ? `• Delivered: ${deliveryDate}` : ''}</p>
                </div>
            </div>
            <div className="order-history-amount">
                <h3>Php {total}</h3>
                <button><i className="ti ti-eye"></i>View Details</button>
            </div>
        </div>
    )
}
export default DashboardOrderHistoryCard;