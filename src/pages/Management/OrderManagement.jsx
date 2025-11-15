import React, { useEffect, useState } from 'react';
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

    useEffect(()=>{
        const ordersRef = ref(db, 'orders');
        async function getOrdersList() {
            const getOrder = await getOrders();
            let withoutCounter = [];
            for(let i = 0; i < getOrder.length; i++){
                if(getOrder[i][0] != 'orders_counter'){
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

    useEffect(()=>{
        
    }, [orders])

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
                    <input type="text" placeholder="Search laundry orders by ID..." />
                </div>
                <div className="filter-dropdown-container">
                    <i className="far fa-calendar" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}></i>
                    <select defaultValue="Date" className="filter-dropdown"> 
                        <option value="Date" hidden>Date</option>
                    </select>
                </div>
                <div className="filter-dropdown-container">
                    <i className="far fa-check-circle" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}></i>
                    <select defaultValue="Status" className="filter-dropdown">
                        <option value="Status" hidden>Status</option>
                    </select>
                </div>
                <div className="filter-dropdown-container">
                    <i className="ti ti-wash-machine" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}></i>
                    <select defaultValue="Service" className="filter-dropdown">
                        <option value="Service" hidden>Service</option>
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
                        {orders.length > 0 && orders.map((order, index) => (
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
                                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(new BigNumber(order[1].amount))}</td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/order/${order[0]}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/order/${order[0]}/edit`} className="action-icon">
                                        <i className="ti ti-pencil"></i>
                                    </NavLink>
                                    <button className='delete' onClick={()=>handleDelete(order[0])}>
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