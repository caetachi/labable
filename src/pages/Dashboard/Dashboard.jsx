import { useParams } from 'react-router';
import './dashboard.css'
import DashboardCard from '../../components/Dashboard Card/DashboardCard';
import DashboardOrderHistoryCard from '../../components/Dashboard Order History Card/DashboardOrderHistoryCard';

function Dashboard() {
    const { role } = useParams()
    const user = { name: "John Doe", role: "user" }
    return (
        <div className="dashboard-container">
            {role === user.role && role === "user" && (
              <>
                <div className="page-header">
                    <div className="page-title">
                        <h1>My Dashboard</h1>
                        <p>Manage your laundry orders and track progress</p>
                    </div>
                    <button className="header-button">
                        <i className="fa-solid fa-plus"></i>
                        New Order
                    </button>
                </div>
                <div className='dashboard-card-container'>
                    <DashboardCard
                        iconClass="fa-regular fa-clock"
                        title="Active Orders"
                        value="2"
                        subTitle="Order currently being processed"
                    />
                    <DashboardCard
                        iconClass="fa-regular fa-circle-check"
                        title="Completed Orders"
                        value="5"
                        subTitle="Total completed orders"
                    />
                    <DashboardCard
                        iconClass="fa-solid fa-chart-line"
                        title="Total Spent"
                        value="289"
                        subTitle="All-time spending on laundry"
                    />
                </div>
                <div className="order-history-container">
                    <div className="order-history-header">
                        <h2>Recent Orders</h2>
                        <p>Track and manage your laundry orders</p>
                    </div>
                    <DashboardOrderHistoryCard
                        orderId="001"
                        orderedDate="2024-06-01"
                        status="Completed"
                        total="150.00"
                        serviceType="Superb Service"
                        items={10}
                        deliveryDate="2024-06-03"
                    />
                    <DashboardOrderHistoryCard
                        orderId="001"
                        orderedDate="2024-06-01"
                        status="Rejected"
                        total="150.00"
                        serviceType="Superb Service"
                        items={10}
                        deliveryDate="2024-06-03"
                    />
                    <DashboardOrderHistoryCard
                        orderId="001"
                        orderedDate="2024-06-01"
                        status="Pending"
                        total="150.00"
                        serviceType="Superb Service"
                        items={10}
                        deliveryDate="2024-06-03"
                    />
                    <DashboardOrderHistoryCard
                        orderId="001"
                        orderedDate="2024-06-01"
                        status="In Progress"
                        total="150.00"
                        serviceType="Superb Service"
                        items={10}
                        deliveryDate="2024-06-03"
                    />
                </div>
              </>
            )}

            {role === user.role && role === "admin" && (
              <h1>Welcome to the admin Dashboard, {user.name}!</h1>
            )}
        </div>
    );
}

export default Dashboard;