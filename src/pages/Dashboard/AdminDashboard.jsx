import { NavLink, useParams } from 'react-router';
import './dashboard.css'
import DashboardCard from '../../components/Dashboard Card/DashboardCard';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { onValue, ref } from 'firebase/database';
import { db, auth } from '../../firebase.js';

function AdminDashboard() {
    const [userData, setUserData] = useState({});

    useEffect(()=>{
        onValue(ref(db, `users/${auth.currentUser.uid}`), (snapshot)=>{
            if(snapshot.exists()){
                setUserData(snapshot.val());
            }
        });
    }, [auth.currentUser.uid]);

    const adminCardData = [
        {
            key: "totalOrdersCount",
            iconClass: "ti ti-list-check",
            title: "Total Orders",
            subTitle: "All time orders in the system",
        },
        {
            key: "totalRevenueAmount",
            iconClass: "ti ti-cash-banknote",
            title: "Total Revenue",
            subTitle: "All time revenue generated",
        },
        {
            key: "totalCustomersCount",
            iconClass: "ti ti-users",
            title: "Total Customers",
            subTitle: "All registered customers",
        }
    ]

    const adminCardDailyData = [
        {
            key: "totalDayOrdersCount",
            iconClass: "ti ti-basket",
            title: "Total Day Orders",
            subTitle: "All orders for the selected date",
        },
        {
            key: "totalDayRevenueAmount",
            iconClass: "ti ti-calendar-dollar",
            title: "Total Day Revenue",
            subTitle: "All revenue for the selected date",
        },
        {
            key: "totalDayOrdersCompletedCount",
            iconClass: "ti ti-progress-check",
            title: "Total Day Orders Completed",
            subTitle: "All orders completed for the selected date",
        }
    ]

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const adminApiData = {
        totalOrdersCount: 100,
        totalRevenueAmount: 5000.00,
        totalCustomersCount: 50,
        totalDayOrdersCount: 10,
        totalDayRevenueAmount: 300.00,
        totalDayOrdersCompletedCount: 7
    }

    const chartData = [
        { name: "January", revenue: 20000 },
        { name: "February", revenue: 30000 },
        { name: "March", revenue: 16000 },
        { name: "April", revenue: 18000 },
        { name: "May", revenue: 15000 },
        { name: "June", revenue: 72000 },
        { name: "July", revenue: 68000 },
        { name: "August", revenue: 16000 },
        { name: "September", revenue: 19000 },
        { name: "October", revenue: 22000 },
        { name: "November", revenue: 5000 },
        { name: "December", revenue: 7000 },
    ];

    
const MyAreaChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--hl-purple)" stopOpacity={0.4}/>
              <stop offset="100%" stopColor="var(--hl-purple)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="name" tick={{ fill: 'var(--sf-dark)', fontSize: 12, fontFamily: "var(--primary-font)" }}/>
          <YAxis tick={{ fill: 'var(--sf-dark)', fontSize: 12, fontFamily: "var(--primary-font)" }}/>
          <Tooltip />

          <Area
            type="monotone" 
            dataKey="revenue"
            stroke="var(--hl-purple)"
            fillOpacity={1}
            strokeWidth={2}
            animationDuration={1000}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
    </ResponsiveContainer>
  );
};


    return (<>
        {userData.role === "admin" && (
            <div className={`dashboard-container admin-dashboard`}>
                <div className="page-header">
                    <div className="page-title">
                        <h1>Dashboard</h1>
                        <p>Manage your laundry orders and track progress</p>
                    </div>
        
                    <button className="header-button">
                        <i className="ti ti-report-analytics"></i>
                        Generate Report
                    </button>
                </div>
                <div className='dashboard-card-container'>
                    {adminCardData.map((card) => {
                            return (
                                <DashboardCard
                                    key={card.key}
                                    iconClass={card.iconClass}
                                    title={card.title}
                                    value={adminApiData[card.key]}
                                    subTitle={card.subTitle}
                                />
                            )
                        })
                    }
                </div>
                    <div className="dashboard-day-summary-data">
                        <label htmlFor="dayDate">Date:</label>
                        <input id='dayDate' type="date" defaultValue={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                    </div>
                    <div className="dashboard-card-container">
                        {
                            adminCardDailyData.map((card)=>{
                                return (
                                    <DashboardCard
                                        key={card.key}
                                        iconClass={card.iconClass}
                                        title={card.title}
                                        value={adminApiData[card.key]}
                                        subTitle={card.subTitle}
                                    />
                                )
                            })
                        }
                    </div>
                <div className="order-history-container">
                    <div className="order-history-header">
                        <div className="order-history-title">
                            <h2>Revenue Summary</h2>
                            <p>Track the revenue within the year</p>
                        </div>
                        <select className="order-history-filter">
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                    </div>
                        <MyAreaChart />
                </div>
                <div className="dashboard-button-link">
                    <NavLink to="/admin/order" className="dashboard-link-button">
                        <p>Orders</p>
                    </NavLink>
                    <NavLink to="/admin/schedule" className="dashboard-link-button">
                        <p>Schedules</p>
                    </NavLink>
                    <NavLink to="/admin/customer" className="dashboard-link-button">
                        <p>Customers</p>
                    </NavLink>
                    <NavLink to="/admin/inventory" className="dashboard-link-button">
                        <p>Inventory</p>
                    </NavLink>
                    <NavLink to="/admin/service" className="dashboard-link-button">
                        <p>Services</p>
                    </NavLink>
                    <NavLink to="/admin/washable" className="dashboard-link-button">
                        <p>Washables</p>
                    </NavLink>
                </div>
            </div>
        )}
        </>
    );
}

export default AdminDashboard;