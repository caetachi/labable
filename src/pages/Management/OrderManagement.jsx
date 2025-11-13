import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';
import { getOrders } from '../../scripts/get';
import deleteOrder from '../../scripts/delete';
import { onValue, ref } from 'firebase/database';
import { db } from '../../firebase';

// const orders = [
//     { id: 'ORD-001', customer: 'Jerson Valdez', service: 'Wash & Fold', items: 15, status: 'Washing', amount: 'Php 206.00' },
//     { id: 'ORD-002', customer: 'Janver Flores', service: 'Wash & Dry', items: 28, status: 'Delivered', amount: 'Php 206.00' },
//     { id: 'ORD-003', customer: 'Jan Santiago', service: 'All Package', items: 17, status: 'Drying', amount: 'Php 306.00' },
//     { id: 'ORD-004', customer: 'John Bacang', service: 'Wash & Fold', items: 28, status: 'Folding', amount: 'Php 206.00' },
//     { id: 'ORD-005', customer: 'Marc Pavia', service: 'Wash', items: 14, status: 'Ironing', amount: 'Php 306.00' }
// ];




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
        onValue(ordersRef, (snapshot)=>{
            if (snapshot.exists()) {
                const data = snapshot.val();
                getOrdersList();
            } else {
                console.log("No data available");
            }
        });
    }, [])

    useEffect(()=>{
        
    }, [orders])

    async function handleDelete(orderUid){
        console.log('click');
        
        await deleteOrder(orderUid);
    }
   
    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Order Management</h1>
                    <p>Manage customers laundry orders</p>
                </div>
                <div className="header-actions">
                    <button className="create-order">
                        <i className="ti ti-plus"></i> Create Order
                    </button>
                </div>
            </div>

            <div className="filter-controls">
                <div className="search-bar">
                    <i className="ti ti-search search-icon"></i>
                    <input type="text" placeholder="Search laundry orders by ID..." />
                </div>
                <div className="filter-dropdown-container">
                    <i className="far fa-calendar" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}></i>
                    <select className="filter-dropdown"> 
                        <option value="" disabled selected hidden><i class="far fa-calendar"></i>Date</option>
                    </select>
                </div>
                <div className="filter-dropdown-container">
                    <i className="far fa-check-circle" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}></i>
                    <select className="filter-dropdown">
                        <option value="" disabled selected hidden>Status</option>
                    </select>
                </div>
                <div className="filter-dropdown-container">
                    <i className="ti ti-wash-machine" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}></i>
                    <select className="filter-dropdown">
                        <option value="" disabled selected hidden>Service</option>
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
                        {orders.length > 0 && orders.map(order => (
                            <tr key={order[1].order_id}>
                                <td>{order[1].order_id}</td>
                                <td>{order[1].customer_name}</td>
                                <td>{order[1].service_name}</td>
                                <td>{getNumberOfItems(order[1].order_items)}</td>
                                <td>
                                    <span className={`status ${getStatusClass(order[1].status)}`}>
                                        {order[1].status}
                                    </span>
                                </td>
                                <td>{Number(order[1].amount).toFixed(2)}</td>
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