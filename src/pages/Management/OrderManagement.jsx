import React from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';

const orders = [
    { id: 'ORD-001', customer: 'Jerson Valdez', service: 'Wash & Fold', items: 15, status: 'Washing', amount: 'Php 206.00' },
    { id: 'ORD-002', customer: 'Janver Flores', service: 'Wash & Dry', items: 28, status: 'Delivered', amount: 'Php 206.00' },
    { id: 'ORD-003', customer: 'Jan Santiago', service: 'All Package', items: 17, status: 'Drying', amount: 'Php 306.00' },
    { id: 'ORD-004', customer: 'John Bacang', service: 'Wash & Fold', items: 28, status: 'Folding', amount: 'Php 206.00' },
    { id: 'ORD-005', customer: 'Marc Pavia', service: 'Wash', items: 14, status: 'Ironing', amount: 'Php 306.00' }
];


const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, '');
}

export default function OrderManagement() {
   
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
                <select className="filter-dropdown">
                    <option value="" disabled selected hidden>Date</option>
                </select>
                <select className="filter-dropdown">
                    <option value="" disabled selected hidden>Status</option>
                </select>
                <select className="filter-dropdown">
                    <option value="" disabled selected hidden>Service</option>
                </select>
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
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer}</td>
                                <td>{order.service}</td>
                                <td>{order.items}</td>
                                <td>
                                    <span className={`status ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>{order.amount}</td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/order/${order.id}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/order/${order.id}/edit`} className="action-icon">
                                        <i className="ti ti-pencil"></i>
                                    </NavLink>
                                    <button className='delete'>
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