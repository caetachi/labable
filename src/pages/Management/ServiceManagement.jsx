import React from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';

const services = [
    { id: 'SRV-001', name: 'Superb Service', included: 'Wash, Dry, Fold, Iron', price: 'Php120.00' },
    { id: 'SRV-002', name: 'Good Service', included: 'Wash, Dry, Fold', price: 'Php100.00' },
    { id: 'SRV-003', name: 'Budget Service', included: 'Wash, Dry', price: 'Php80.00' },
    { id: 'SRV-004', name: 'Dry Cleaning Service', included: 'Chemical Solvent', price: 'Php150.00' },
    { id: 'SRV-005', name: 'Superb Thick Service', included: 'Wash, Dry, Fold, Iron', price: 'Php170.00' },
    { id: 'SRV-006', name: 'Student Pack Service', included: 'Wash, Dry, Fold, Iron', price: 'Php110.00' },
];

export default function ServiceManagement() {
    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Service Type Management</h1>
                    <p>Manage services types and pricing</p>
                </div>
                <div className="header-actions">
                    <button className="create-order">
                        <i className="ti ti-plus"></i> Add Service
                    </button>
                </div>
            </div>

            <div className="filter-controls">
                <div className="search-bar">
                    <i className="ti ti-search search-icon"></i>
                    <input type="text" placeholder="Search services..." />
                </div>
                <select className="filter-dropdown">
                    <option value="" disabled selected hidden>Date</option>
                </select>
                <select className="filter-dropdown">
                    <option value="" disabled selected hidden>Services</option>
                </select>
            </div>

            <div className="management-table-container">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>Service ID</th>
                            <th>Service Name</th>
                            <th>Services Included</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service.id}>
                                <td>{service.id}</td>
                                <td>{service.name}</td>
                                <td>{service.included}</td>
                                <td>{service.price}</td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/service/${service.id}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/service/${service.id}/edit`} className="action-icon">
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