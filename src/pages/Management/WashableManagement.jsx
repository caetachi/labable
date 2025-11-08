import React from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';

const washables = [
    { id: 'WITEM-001', name: 'Pants(Regular)', price: 'Php8.00', perKg: '4/kg' },
    { id: 'WITEM-002', name: 'Dress(Regular)', price: 'Php10.00', perKg: '6/kg' },
    { id: 'WITEM-003', name: 'Underwear', price: 'Php5.00', perKg: '15/kg' },
];

export default function WashableManagement() {
    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Washable Items Management</h1>
                    <p>Manage washable items, pricing and number of pieces per kg</p>
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
                    <input type="text" placeholder="Search washable items..." />
                </div>
                <select className="filter-dropdown">
                    <option value="" disabled selected hidden>Date</option>
                </select>
                <select className="filter-dropdown">
                    <option value="asc">Sort Asc</option>
                    <option value="desc">Sort Desc</option>
                </select>
            </div>

            <div className="management-table-container">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Item Name</th>
                            <th>Price/piece</th>
                            <th>Item/kg</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {washables.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.perKg}</td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/washable/${item.id}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/washable/${item.id}/edit`} className="action-icon">
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