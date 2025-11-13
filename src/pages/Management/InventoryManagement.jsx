import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';
import { onValue, ref } from 'firebase/database';
import { db } from '../../firebase';
import { getInventory } from '../../scripts/get';


const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, '');
}

export default function InventoryManagement() {

    const [inventory, setInventory] = useState([]);
    
    useEffect(()=>{
        console.log('load');
        const inventoryRef = ref(db, 'inventory_items');
        async function getInventoryList() {
            const getDaInventory = await getInventory();
            let withoutCounter = [];
            for(let i = 0; i < getDaInventory.length; i++){
                if(getDaInventory[i][0] != 'inventory_counter'){
                    withoutCounter.push(getDaInventory[i])
                }
            }
            console.log(withoutCounter);
            setInventory(withoutCounter)
        }
        onValue(inventoryRef, (snapshot)=>{
            if (snapshot.exists()) {
                const data = snapshot.val();
                getInventoryList();
            } else {
                console.log("No data available");
            }
        });
    }, [])

    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Inventory Management</h1>
                    <p>Manage inventory of the shop</p>
                </div>
                <div className="header-actions">
                    <NavLink to={'/admin/create-inventory'}>
                        <button className="create-order">
                            <i className="ti ti-plus"></i> Add Items
                        </button>
                    </NavLink>
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
                            <tr key={item[1].inventory_item_id}>
                                <td>{item[1].inventory_item_id}</td>
                                <td>{item[1].inventory_item_name}</td>
                                <td>{item[1].quantity_in_stock}</td>
                                <td>{item[1].unit_name}</td>
                                <td>{item[1].last_restocked}</td>
                                <td>
                                    <span className={`status ${getStatusClass(item[1].status)}`}>
                                        {item[1].status}
                                    </span>
                                </td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/inventory/${item[1].inventory_item_id}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/inventory/${item[1].inventory_item_id}/edit`} className="action-icon">
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