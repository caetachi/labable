import './dashboard.css'
import DashboardCard from '../../components/Dashboard Card/DashboardCard';
import DashboardOrderHistoryCard from '../../components/Dashboard Order History Card/DashboardOrderHistoryCard';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db, auth } from '../../firebase.js';
import { getActiveOrderCount, getCompleteOrderCount, getTotalSpentAmount, getUserRecentOrders } from '../../scripts/get.js';
import { NavLink } from 'react-router';

function CustomerDashboard() {
    const [userData, setUserData] = useState({});
    const [userApiData, setUserApiData] = useState({
        activeOrdersCount: 0,
        completedOrdersCount: 0,
        totalSpentAmount: 0.00
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(()=>{
        onValue(ref(db, `users/${auth.currentUser.uid}`), (snapshot)=>{
            if(snapshot.exists()){
                setUserData(snapshot.val());
                getActiveOrderCount(auth.currentUser.uid).then(count => {
                    setUserApiData(prevData => ({
                        ...prevData,
                        activeOrdersCount: count
                    }));
                });
                getCompleteOrderCount(auth.currentUser.uid).then(count => {
                    setUserApiData(prevData => ({
                        ...prevData,
                        completedOrdersCount: count
                    }));
                });
                getTotalSpentAmount(auth.currentUser.uid).then(amount => {
                    setUserApiData(prevData => ({
                        ...prevData,
                        totalSpentAmount: amount.toFixed(2)
                    }));
                });
                getUserRecentOrders(auth.currentUser.uid).then(orders => {
                    setRecentOrders(orders);
                });
            }
        });
    }, [auth.currentUser.uid]);

    const userCardData = [
      {
        key: "activeOrdersCount", 
        iconClass: "fa-regular fa-clock",
        title: "Active Orders",
        subTitle: "Orders currently being processed",
      },
      {
        key: "completedOrdersCount",
        iconClass: "fa-regular fa-circle-check",
        title: "Completed Orders",
        subTitle: "Total completed orders",
      },
      {
        key: "totalSpentAmount",
        iconClass: "fa-solid fa-chart-line",
        title: "Total Spent",
        subTitle: "All-time spending on laundry",
      },
    ];

    return (<>
        {userData.role === "customer" && (
            <div className={"dashboard-container"}>
                <div className="page-header">
                    <div className="page-title">
                        <h1>My Dashboard</h1>
                        <p>Manage your laundry orders and track progress</p>
                    </div>
                    <NavLink to={'/create-order'} className="header-button">
                        <i className="ti ti-plus"></i>
                        New Order
                    </NavLink>
                </div>
                <div className='dashboard-card-container'>
                    {
                        userCardData.map((card) => {
                            return (
                                <DashboardCard
                                    key={card.key}
                                    iconClass={card.iconClass}
                                    title={card.title}
                                    value={card.key === "totalSpentAmount" ?
                                        `${new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(userApiData[card.key])}` :
                                        userApiData[card.key]}
                                    subTitle={card.subTitle}
                                />
                            );
                        })
                    }
                </div>
                <div className="order-history-container">
                    <div className="order-history-header">
                        <div className="order-history-title">
                            <h2>Recent Orders</h2>
                            <p>Track and manage your laundry orders</p>
                        </div>
                    </div>
                        {recentOrders.map(([orderId, order]) => {
                            return (
                                <DashboardOrderHistoryCard
                                    key={orderId}
                                    orderHashId={orderId}
                                    orderId={order.order_id ?? "N/A"}
                                    orderedDate={order.created_at ?? "N/A"}
                                    status={order.status ?? "Pending"}
                                    total={order.amount ?? 0}
                                    serviceType={order.service_name ?? "N/A"}
                                    items={order.order_items ?? {}}
                                    deliveryDate={0}
                                />
                            );
                        })}
                </div>
            </div>
        )}
        </>
    );
}

export default CustomerDashboard;