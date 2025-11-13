import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';
import { get, onValue, ref } from 'firebase/database';
import { getOrders } from '../../scripts/get';
import { db } from '../../firebase';

const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, '');
}

const getNormalTime = (datetime) =>{
    return new Date(datetime).toLocaleDateString();
}


export default function ScheduleManagement() {

    const [schedules, setSchedules] = useState([]);

    const ordersRef = ref(db, 'orders');
    useEffect(()=>{
        async function getOrdersList() {
            const getOrder = await getOrders();
            let withoutCounter = [];
            for(let i = 0; i < getOrder.length; i++){
                if(getOrder[i][0] != 'orders_counter'){
                    getOrder[i].push(getOrder[i][1].schedule);
                    withoutCounter.push(getOrder[i])
                    console.log(getOrder[i]);
                }
            }
            setSchedules(withoutCounter)
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

    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Schedule Management</h1>
                    <p>Manage schedules of delivery and pickups</p>
                </div>
                <div className="header-actions">
                    <NavLink to={'/admin/create-schedule'}>
                        <button className="create-order">
                            <i className="ti ti-plus"></i> Create Schedule
                        </button>
                    </NavLink>
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
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map(schedule => (
                            <tr key={schedule[1].order_id}>
                                <td>{schedule[1].order_id}</td>
                                <td>{schedule[1].customer_name}</td>
                                <td>{schedule[2].pickup && schedule[2].delivery ? "pickup & delivery" : schedule[2].pickup ? "pickup" : schedule[2].delivery ? "delivery" : "error"}</td>
                                <td>{schedule[2].pickup && schedule[2].delivery ?
                                `${getNormalTime(schedule[2].pickup.scheduled_date)} : ${getNormalTime(schedule[2].delivery.scheduled_date)}` : 
                                schedule[2].pickup ? getNormalTime(schedule[2].pickup.scheduled_date) :
                                schedule[2].delivery ? getNormalTime(schedule[2].delivery.scheduled_date) :
                                "No date"
                            }</td>
                                <td>
                                    <span className={`status ${getStatusClass(schedule[1].status)}`}>
                                        {schedule[1].status}
                                    </span>
                                </td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/schedule/${schedule[1].order_id}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/schedule/${schedule[1].order_id}/edit`} className="action-icon">
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