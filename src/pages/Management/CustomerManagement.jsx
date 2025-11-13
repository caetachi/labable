import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';
import { getUsers } from '../../scripts/get';
import { onValue, ref } from 'firebase/database';
import { db } from '../../firebase';

export default function CustomerManagement() {

    const [users, setUsers] = useState([]);

    const getStatusClass = (status) => {
        return status.toLowerCase().replace(/\s+/g, '');
    }

    useEffect(()=>{
        const usersRef = ref(db, 'users');
        async function getUsersList() {
            const getDaUsers = await getUsers();
            let withoutCounter = [];
            for(let i = 0; i < getDaUsers.length; i++){
                if(getDaUsers[i][0] != 'user_counter' && getDaUsers[i][1].role == 'customer'){
                    withoutCounter.push(getDaUsers[i])
                }
            }
            console.log(withoutCounter);
            
            setUsers(withoutCounter)
        }
        onValue(usersRef, (snapshot)=>{
            if (snapshot.exists()) {
                const data = snapshot.val();
                getUsersList();
            } else {
                console.log("No data available");
            }
        });
    }, [])

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
                        {users.map(customer => (
                            <tr key={customer[1].user_id}>
                                <td>{customer[1].user_id}</td>
                                <td>{customer[1].fullname ? customer[1].fullname : "No name"}</td>
                                <td>{customer[1].email ? customer[1].email : "No email"}</td>
                                <td>{customer[1].phone ? customer[1].phone : "No phone number"}</td>
                                <td>{customer[1].address ? customer[1].user_id : "No address"}</td>
                                <td>
                                    <span className={`status ${getStatusClass(customer[1].status)}`}>
                                        {customer[1].status}
                                    </span>
                                </td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/customer/${customer[1].user_id}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/customer/${customer[1].user_id}/edit`} className="action-icon">
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
    )
}