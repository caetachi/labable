import { NavLink } from 'react-router';
import './dashboard-order-history-card.css';
import { formatTextualDateTime } from '../../scripts/dateformat';
import BigNumber from 'bignumber.js';

function DashboardOrderHistoryCard({ orderHashId, orderId, orderedDate, status, total, serviceType, items, deliveryDate }) {
    let itemCount = Object.values(items).map(item => item.quantity || 1).reduce((a, b) => a + b, 0);

    return (
        <div className="order-history-card">
            <div className="order-history-details">
                <i className="hgi hgi-stroke hgi-package"></i>
                <div className="infos">
                    <div className="first-row">
                        <h4>{orderId}</h4>
                        <span className={`status ${status?.toLowerCase().replace(/\s+/g, "")}`}>{status}</span>
                    </div>

                    <p>{serviceType} • {new Intl.NumberFormat('en-PH').format(itemCount)} items</p>
                    <p>Ordered: {formatTextualDateTime(orderedDate)}</p>
                    <p>{deliveryDate ? `• Delivered: ${formatTextualDateTime(deliveryDate)}` : ''}</p>
                </div>
            </div>
            <div className="order-history-amount">
                <h3>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(new BigNumber(total).toFixed(2))}</h3>
                <NavLink 
                    to={`/order/${orderHashId}`}
                    className='view-details'>
                    <i className="ti ti-eye"></i>
                    View Details
                </NavLink>
            </div>  
        </div>
    )
}
export default DashboardOrderHistoryCard;