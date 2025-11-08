import React from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';

const customers = [
    { id: 'CUS-001', name: 'Jerson Valdez', email: 'valdezjerson@gmai...', phone: '09091805447', address: 'Sitio Uli-Uli, Pinalagd...', status: 'Active' },
    { id: 'CUS-002', name: 'Janver Flores', email: 'valdezjerson@gmai...', phone: '09091805447', address: 'Sitio Uli-Uli, Pinalagd...', status: 'Inactive' },
    { id: 'CUS-003', name: 'Jan Saints', email: 'valdezjerson@gmai...', phone: '09091805447', address: 'Sitio Uli-Uli, Pinalagd...', status: 'Deleted' },
];

const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, '');
}

export default function CustomerManagement() {
    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Customer Management</h1>
                    <p>Manage customers Informations</p>
                </div>
                <div className="header-actions">
                    <button className="create-order">
                        <i className="ti ti-plus"></i> Create Customer
                    </button>
                </div>
            </div>

            <div className="filter-controls">
                <div className="search-bar">
                    <i className="ti ti-search search-icon"></i>
                    <input type="text" placeholder="Search customer..." />
                </div>
                <select className="filter-dropdown">
                    <option value="" disabled selected hidden>Date</option>
                </select>
                <select className="filter-dropdown">
                    <option value="" disabled selected hidden>Status</option>
                </select>
                <select className="filter-dropdown">
                    <option value="asc">Sort Name Asc</option>
                    <option value="desc">Sort Name Desc</option>
                </select>
            </div>

            <div className="management-table-container">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.address}</td>
                                <td>
                                    <span className={`status ${getStatusClass(customer.status)}`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/customer/${customer.id}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/customer/${customer.id}/edit`} className="action-icon">
                                        <i className="ti ti-pencil"></i>
                                    </NavLink>
                                    <button className="action-icon delete">
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