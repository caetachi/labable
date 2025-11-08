import React from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';

const inventory = [
    { id: 'ITEM-001', name: 'Bleach', quantity: 45, unit: 'Liters', lastRestocked: '10/29/2025', status: 'Low Stock' },
    { id: 'ITEM-002', name: 'Dry Cleaning Solution', quantity: 25, unit: 'Liters', lastRestocked: '10/29/2025', status: 'Good' },
    { id: 'ITEM-003', name: 'Baskets', quantity: 12, unit: 'Pieces', lastRestocked: '10/29/2025', status: 'Good' },
    { id: 'ITEM-004', name: 'Detergent', quantity: 80, unit: 'Liters', lastRestocked: '10/29/2025', status: 'Good' },
    { id: 'ITEM-005', name: 'Stain Remover', quantity: 35, unit: 'bottles', lastRestocked: '10/29/2025', status: 'Out of Stock' },
];

const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, '');
}

export default function InventoryManagement() {
    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Inventory Management</h1>
                    <p>Manage inventory of the shop</p>
                </div>
                <div className="header-actions">
                    <button className="create-order">
                        <i className="ti ti-plus"></i> Add Items
                    </button>
                </div>
            </div>

            <div className="filter-controls">
                <div className="search-bar">
                    <i className="ti ti-search search-icon"></i>
                    <input type="text" placeholder="Search Items..." />
                </div>
                <select className="filter-dropdown">
                    <option value="" disabled selected hidden>Date</option>
                </select>
                <select className="filter-dropdown">
                    <option value="" disabled selected hidden>Status</option>
                </select>
            </div>

            <div className="management-table-container">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Last Restocked</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit}</td>
                                <td>{item.lastRestocked}</td>
                                <td>
                                    <span className={`status ${getStatusClass(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/inventory/${item.id}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/inventory/${item.id}/edit`} className="action-icon">
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