import React, { useEffect, useState, useMemo } from 'react'; 
import { NavLink } from 'react-router-dom';
import './management.css';
import { getOrders } from '../../scripts/get';
import { deleteOrder } from '../../scripts/delete.js';
import { onValue, ref } from 'firebase/database';
import { db } from '../../firebase';
import swal from 'sweetalert2';
import BigNumber from 'bignumber.js';

export default function OrderManagement() {
    const getStatusClass = (status) => {
        return status.toLowerCase().replace(/\s+/g, '');
    }
    const getNumberOfItems = (orderItems) => {
        let numberOfItems = 0;
        for(let i = 0; i < orderItems.length; i++){
            numberOfItems += orderItems[i].quantity;
        }
        return Number(numberOfItems);
    }
    
    const [orders, setOrders] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [sortKey, setSortKey] = useState('id'); 
    const [sortDirection, setSortDirection] = useState('desc');


    useEffect(()=>{
        const ordersRef = ref(db, 'orders');
        async function getOrdersList() {
            const getOrder = await getOrders();
            let withoutCounter = [];
            for(let i = 0; i < getOrder.length; i++){
                if(getOrder[i][0] !== 'orders_counter'){
                    withoutCounter.push(getOrder[i])
                }
            }
            setOrders(withoutCounter)
        }
        const unsubscribe = onValue(ordersRef, (snapshot)=>{
            if (snapshot.exists()) {
                getOrdersList();
            } else {
                console.log("No data available");
            }
        });
        return () => unsubscribe();
    }, [])

    const uniqueServices = useMemo(() => {
        const services = new Set();
        orders.forEach(order => {
            services.add(order[1].service_name);
        });
        return Array.from(services).sort(); 
    }, [orders]);


    async function handleDelete(orderUid){
        swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--bg-dark)',
            cancelButtonColor: 'var(--error)',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteOrder(orderUid);
                }
        });
    }

    const displayOrders = [...orders]
        .filter(order => {
            
            const search = searchTerm.toLowerCase();
            const orderID = (order[1].order_id || "").toLowerCase();
            const customerName = (order[1].customer_name || "").toLowerCase();
            const passesSearch = orderID.includes(search) || customerName.includes(search);

       
            const passesStatus = (statusFilter === 'all') || (order[1].status.toLowerCase() === statusFilter.toLowerCase());

          
            const passesService = (serviceFilter === 'all') || (order[1].service_name === serviceFilter);
            
            return passesSearch && passesStatus && passesService;
        })
        .sort((a, b) => {
         
            let valA, valB;

            switch (sortKey) {
                case 'id':
                    valA = (a[1].order_id || "").toLowerCase();
                    valB = (b[1].order_id || "").toLowerCase();
                    break;
                case 'customer':
                    valA = (a[1].customer_name || "").toLowerCase();
                    valB = (b[1].customer_name || "").toLowerCase();
                    break;
                case 'service':
                    valA = (a[1].service_name || "").toLowerCase();
                    valB = (b[1].service_name || "").toLowerCase();
                    break;
                case 'items':
                    valA = getNumberOfItems(a[1].order_items);
                    valB = getNumberOfItems(b[1].order_items);
                    break;
                case 'amount':
                    valA = parseFloat(a[1].amount);
                    valB = parseFloat(b[1].amount);
                    break;
                default:
                    return 0;
            }

            if (sortDirection === 'asc') {
                if (typeof valA === 'string') return valA.localeCompare(valB);
                return valA - valB;
            } else { 
                if (typeof valA === 'string') return valB.localeCompare(valA);
                return valB - valA;
            }
        });

    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Order Management</h1>
                    <p>Manage customers laundry orders</p>
                </div>
                <div className="header-actions">
                    <NavLink to="/create-order" className="create-order">
                        <i className="ti ti-plus"></i> Create Order
                    </NavLink>
                </div>
            </div>

            <div className="filter-controls">
              
                <div className="search-bar">
                    <i className="ti ti-search search-icon"></i>
                    <input 
                        type="text" 
                        placeholder="Search by Order ID or Customer..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-dropdown-container">
                    <i className="far fa-calendar" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}></i>
                    <select 
                        className="filter-dropdown"
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                    >
                        <option value="id">Sort by Order ID</option>
                        <option value="customer">Sort by Customer</option>
                        <option value="amount">Sort by Amount</option>
                    </select>
                </div>

                <div className="filter-dropdown-container">
                    <i className="far fa-check-circle" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}></i>
                    <select 
                        className="filter-dropdown"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Transferred">Transferred</option>
                        <option value="Washing">Washing</option>
                        <option value="Drying">Drying</option>
                        <option value="Ironing">Ironing</option>
                        <option value="Folding">Folding</option>
                        <option value="Ready to Claim">Ready to Claim</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div className="filter-dropdown-container">
                    <i className="ti ti-wash-machine" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}></i>
                    <select 
                        className="filter-dropdown"
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                    >
                        <option value="all">All Services</option>
                        {uniqueServices.map(service => (
                            <option key={service} value={service}>{service}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-dropdown-container">
                    <i className="ti ti-sort-ascending" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}></i>
                    <select 
                        className="filter-dropdown"
                        value={sortDirection}
                        onChange={(e) => setSortDirection(e.target.value)}
                    >
                        <option value="desc">Sort Desc</option>
                        <option value="asc">Sort Asc</option>
                    </select>
                </div>
                
            </div>

            <div className="management-table-container">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Items</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayOrders.length > 0 && displayOrders.map((order, index) => (
                            <tr key={order[1].order_id + index}>
                                <td>{order[1].order_id}</td>
                                <td>{order[1].customer_name}</td>
                                <td>{order[1].service_name}</td>
                                <td>{getNumberOfItems(order[1].order_items)}</td>
                                <td>
                                    <span className={`status ${getStatusClass(order[1].status)}`}>
                                        {order[1].status}
                                    </span>
                                </td>
                                <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(new BigNumber(order[1].amount))}</td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/order/${order[0]}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/order/${order[0]}/edit`} className="action-icon">
                                        <i className="ti ti-pencil"></i>
                                    </NavLink>
                                    <button className='action-icon delete' onClick={()=>handleDelete(order[0])}>
                                        <i className="ti ti-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}