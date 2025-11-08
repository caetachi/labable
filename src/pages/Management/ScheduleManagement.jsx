import React from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';

const schedules = [
    { id: 'ORD-001', customer: 'Jerson Valdez', type: 'Pick up', date: '10/29/2025', time: '7:00 AM', status: 'Out for pickup' },
    { id: 'ORD-002', customer: 'Janver Flores', type: 'Pick up', date: '10/29/2025', time: '7:00 AM', status: 'Picked' },
    { id: 'ORD-003', customer: 'Jan Santiago', type: 'Deliver', date: '10/29/2025', time: '7:00 AM', status: 'Out for delivery' },
    { id: 'ORD-004', customer: 'John Bacang', type: 'Deliver', date: '10/29/2025', time: '7:00 AM', status: 'Delivered' },
    { id: 'ORD-005', customer: 'Marc Pavia', type: 'Pick up', date: '10/29/2025', time: '7:00 AM', status: 'Canceled' },
    { id: 'ORD-006', customer: 'Marc Pavia', type: 'Pick up', date: '10/29/2025', time: '7:00 AM', status: 'Preparing' },
];

const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, '');
}

export default function ScheduleManagement() {
    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Schedule Management</h1>
                    <p>Manage schedules of delivery and pickups</p>
                </div>
                <div className="header-actions">
                    <button className="create-order">
                        <i className="ti ti-plus"></i> Create Schedule
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
                    <option value="" disabled selected hidden>Type</option>
                </select>
            </div>

            <div className="management-table-container">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map(schedule => (
                            <tr key={schedule.id}>
                                <td>{schedule.id}</td>
                                <td>{schedule.customer}</td>
                                <td>{schedule.type}</td>
                                <td>{schedule.date}</td>
                                <td>{schedule.time}</td>
                                <td>
                                    <span className={`status ${getStatusClass(schedule.status)}`}>
                                        {schedule.status}
                                    </span>
                                </td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/schedule/${schedule.id}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/schedule/${schedule.id}/edit`} className="action-icon">
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