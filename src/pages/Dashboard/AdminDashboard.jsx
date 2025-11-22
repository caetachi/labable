import { NavLink } from 'react-router';
import './dashboard.css'
import DashboardCard from '../../components/Dashboard Card/DashboardCard';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { onValue, ref } from 'firebase/database';
import { db, auth } from '../../firebase.js';
import { getOrders, getUsers } from '../../scripts/get.js';
import BigNumber from 'bignumber.js';

function AdminDashboard() {
    const [userData, setUserData] = useState({});
    const [adminApiData, setAdminApiData] = useState({
        totalOrdersCount: 0,
        totalRevenueAmount: 0.00,
        totalCustomersCount: 0,
        totalDayOrdersCount: 0,
        totalDayRevenueAmount: 0.00,
        totalDayOrdersCompletedCount: 0
    });
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [monthlyChartData, setMonthlyChartData] = useState([]);
    const [array, setArray] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(()=>{
        onValue(ref(db, `users/${auth.currentUser.uid}`), (snapshot)=>{
            if(snapshot.exists()){
                setUserData(snapshot.val());
                getOrders().then(count => {
                    setAdminApiData(prevData => ({
                        ...prevData,
                        totalOrdersCount: new Intl.NumberFormat("en-PH").format(count.length-1)
                    }));
                    let totalRevenue = 0;
                    count.forEach((order) => {
                        const orderObject = order[1]; 
                        {
                            orderObject.payment?.status.toLowerCase() === "paid" && (
                                totalRevenue += parseFloat(orderObject?.amount) || 0
                            )
                        }
                    });
                
                    setAdminApiData(prevData => ({
                        ...prevData,
                        totalRevenueAmount: new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(new BigNumber(totalRevenue).toFixed(2))
                    }));
                    setArray(count);
                    {array && setMonthlyChartData(calculateMonthlyRevenue(array, year));}
                    const newChartData = calculateMonthlyRevenue(count, year);
                    setMonthlyChartData(newChartData);
                })};
                getUsers().then(users => {
                    const customerCount = new Intl.NumberFormat("en-PH").format(users.filter(user => user[1].role === "customer").length);
                    setAdminApiData(prevData => ({
                        ...prevData,
                        totalCustomersCount: customerCount
                    }));
                });
                setDataForDate(selectedDate);
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

function calculateMonthlyRevenue(ordersArray, year = new Date().getFullYear()) {
    const monthlyRevenueData = [
        { name: "January", revenue: 0 },
        { name: "February", revenue: 0 },
        { name: "March", revenue: 0 },
        { name: "April", revenue: 0 },
        { name: "May", revenue: 0 },
        { name: "June", revenue: 0 },
        { name: "July", revenue: 0 },
        { name: "August", revenue: 0 },
        { name: "September", revenue: 0 },
        { name: "October", revenue: 0 },
        { name: "November", revenue: 0 },
        { name: "December", revenue: 0 },
    ];


    ordersArray.forEach(order => {
        const orderObject = order[1];
        const rawTimestamp = orderObject?.created_at;

        if (rawTimestamp) {
            
            const dateObject = new Date(rawTimestamp);
            
            const orderYear = dateObject.getFullYear();
            const orderMonthIndex = dateObject.getMonth();
            
            if (orderYear === year) {
                {
                    orderObject.payment?.status.toLowerCase() === "paid" && (   
                        monthlyRevenueData[orderMonthIndex].revenue += parseFloat(orderObject?.amount) || 0
                    )
                }
            }
        }
    });

    return monthlyRevenueData;
}

const handleYearChange = (e) => {
    const newYearStr = e.target.value; 
    const newYearInt = parseInt(newYearStr); 
    setYear(newYearInt);
    const newChartData = calculateMonthlyRevenue(array, newYearInt);
    setMonthlyChartData(newChartData);
};

function setDataForDate(date) { 
    setSelectedDate(date); 
    getOrders().then(orders => {
        let dayOrdersCount = 0;
        let dayRevenueAmount = 0;
        let dayOrdersCompletedCount = 0;
        
        orders.forEach((order) => {
            const orderObject = order[1];

            const rawOrderDate = orderObject?.created_at; 
            
            let orderDateString;
            if (rawOrderDate) {
                const dateObject = new Date(rawOrderDate);
                const year = dateObject.getFullYear();
                
                const month = String(dateObject.getMonth() + 1).padStart(2, '0');
                const day = String(dateObject.getDate()).padStart(2, '0');
                
                orderDateString = `${year}-${month}-${day}`;
            }

            if (orderDateString === date) { 
                dayOrdersCount++;
                {
                    orderObject.payment?.status.toLowerCase() === "paid" && (
                        dayRevenueAmount += parseFloat(orderObject?.amount) || 0
                    )
                }
                if (orderObject?.status === "Completed") {
                    dayOrdersCompletedCount++;
                }
            }
        });
        
        setAdminApiData(prevData => ({
            ...prevData,
            totalDayOrdersCount: new Intl.NumberFormat("en-PH").format(dayOrdersCount),
            totalDayRevenueAmount: new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(dayRevenueAmount.toFixed(2)),
            totalDayOrdersCompletedCount: new Intl.NumberFormat("en-PH").format(dayOrdersCompletedCount)
        }));
    });
}

    
const MyAreaChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={monthlyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--hl-purple)" stopOpacity={0.4}/>
              <stop offset="100%" stopColor="var(--hl-purple)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="name" tick={{ fill: 'var(--sf-dark)', fontSize: 12, fontFamily: "var(--primary-font)" }}/>
          <YAxis tick={{ fill: 'var(--sf-dark)', fontSize: 12, fontFamily: "var(--primary-font)" }}/>
          <Tooltip
            formatter={(value) => {
              const num = Number(value) || 0;
              const formatted = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(num);
              return [formatted, 'Revenue'];
            }}
          />

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
                        <input id='dayDate' type="date" value={selectedDate} onChange={(e) => setDataForDate(e.target.value)} />
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
                        <select className="order-history-filter"
                            value={year} onChange={(e) => {handleYearChange(e)}}>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                            <option value="2031">2031</option>
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