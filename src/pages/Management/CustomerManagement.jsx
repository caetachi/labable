import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';
import { getUsers } from '../../scripts/get';
import {deleteUser} from '../../scripts/delete';
import { onValue, ref } from 'firebase/database';
import { db } from '../../firebase';
import swal from 'sweetalert2';

export default function CustomerManagement() {

    const [users, setUsers] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); 
    const [sortKey, setSortKey] = useState('name'); 
    const [sortDirection, setSortDirection] = useState('asc'); 

    const getStatusClass = (status) => {
        return status.toLowerCase().replace(/\s+/g, '');
    }

    async function handleDelete(userUid){
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
                await deleteUser(userUid);
                }
        });
    }

    useEffect(()=>{
        const usersRef = ref(db, 'users');
        async function getUsersList() {
            const getDaUsers = await getUsers();
            let withoutCounter = [];
            for(let i = 0; i < getDaUsers.length; i++){
                if(getDaUsers[i][0] !== 'user_counter' && getDaUsers[i][1].role === 'customer'){
                    withoutCounter.push(getDaUsers[i])
                }
            }
            console.log(withoutCounter);
            
            setUsers(withoutCounter)
        }
        const unsubscribe = onValue(usersRef, (snapshot)=>{
            if (snapshot.exists()) {
                const data = snapshot.val();
                getUsersList();
            } else {
                console.log("No data available");
            }
        });
        return () => unsubscribe();
    }, [])

    const displayCustomers = [...users]
        .filter(customer => {
            
            const search = searchTerm.toLowerCase();
            const name = (customer[1].fullname || "").toLowerCase();
            const email = (customer[1].email || "").toLowerCase();
            const phone = (customer[1].phone || "").toLowerCase();

            const passesSearch = name.includes(search) || 
                                 email.includes(search) || 
                                 phone.includes(search);

          
            const passesStatus = (statusFilter === 'all') || (customer[1].status.toLowerCase() === statusFilter.toLowerCase());

            return passesSearch && passesStatus;
        })
        .sort((a, b) => {
          
            let valA, valB;

            if (sortKey === 'name') {
                valA = (a[1].fullname || "no name").toLowerCase();
                valB = (b[1].fullname || "no name").toLowerCase();
            } else { 
                valA = (a[1].user_id || "").toLowerCase();
                valB = (b[1].user_id || "").toLowerCase();
            }

            if (sortDirection === 'asc') {
                return valA.localeCompare(valB);
            } else {
                return valB.localeCompare(valA);
            }
        });

    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Customer Management</h1>
                    <p>Manage customers Informations</p>
                </div>
                <div className="header-actions">
                    <NavLink to={'/admin/create-customer'} 
                    className="create-order">
                        <i className="ti ti-plus"></i> Create Customer
                    </NavLink>
                </div>
            </div>

            <div className="filter-controls">
                
                <div className="search-bar">
                    <i className="ti ti-search search-icon"></i>
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or phone..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select 
                    className="filter-dropdown"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                >
                    <option value="name">Sort by Name</option>
                    <option value="id">Sort by ID</option>
                </select>

                <select 
                    className="filter-dropdown"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

                <select 
                    className="filter-dropdown"
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value)}
                >
                    <option value="asc">Sort Asc</option>
                    <option value="desc">Sort Desc</option>
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
                        {displayCustomers.map(customer => (
                            <tr key={customer[1].user_id}>
                                <td>{customer[1].user_id}</td>
                                <td>{customer[1].fullname ? customer[1].fullname : "No name"}</td>
                                <td>{customer[1].email ? customer[1].email : "No email"}</td>
                                <td>{customer[1].phone ? customer[1].phone : "No phone number"}</td>
                                <td>{customer[1].address ? customer[1].address : "No address"}</td>
                                <td>
                                    <span className={`status ${getStatusClass(customer[1].status)}`}>
                                        {customer[1].status}
                                    </span>
                                </td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/customer/${customer[0]}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/customer/${customer[0]}/edit`} className="action-icon">
                                        <i className="ti ti-pencil"></i>
                                    </NavLink>
                                    <button className="action-icon delete" onClick={()=>handleDelete(customer[0])}>
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