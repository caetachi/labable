import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';
import { onValue, ref } from 'firebase/database';
import { getOrders } from '../../scripts/get';
import { db } from '../../firebase';
import {deleteSchedulePickup, deleteScheduleDelivery} from '../../scripts/delete';
import Swal from 'sweetalert2';
import { formatLocaleDate } from '../../scripts/dateformat';

const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, '');
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
                    if(Object.prototype.hasOwnProperty.call(getOrder[i][1], 'schedule')){
                        if(Object.prototype.hasOwnProperty.call(getOrder[i][1].schedule, 'pickup') || Object.prototype.hasOwnProperty.call(getOrder[i][1].schedule, 'delivery')){
                            getOrder[i].push(getOrder[i][1].schedule);
                            withoutCounter.push(getOrder[i])
                        }
                    }
                }
            }
            setSchedules(withoutCounter)
        }
        onValue(ordersRef, (snapshot)=>{
            if (snapshot.exists()) {
                getOrdersList();
            } else {
                console.log("No data available");
            }
        });
    }, [ordersRef])

    async function handleDeleteSchedule(orderID){
        const hasPickup = Object.prototype.hasOwnProperty.call(schedules.find(schedule => schedule[1].order_id === orderID)[2], 'pickup');
        const hasDelivery = Object.prototype.hasOwnProperty.call(schedules.find(schedule => schedule[1].order_id === orderID)[2], 'delivery');
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true, 
            showDenyButton: (hasPickup && hasDelivery), 
            confirmButtonText: (hasPickup && hasDelivery) || hasPickup ? "Delete Pickup" : "Delete Delivery",
            denyButtonText: "Delete Delivery", 
            confirmButtonColor: 'var(--bg-dark)',
            denyButtonColor: 'var(--error)', 
        }).then(async (result) => {
            if(((hasPickup && hasDelivery) || hasPickup) && result.isConfirmed) {
                deleteSchedulePickup(orderID);
                return;
            }
            if((hasPickup && hasDelivery) && result.isDenied) {
                console.log("deny");
                
                deleteScheduleDelivery(orderID)
                return;
            }
            if(((!hasPickup && hasDelivery)) && result.isConfirmed) {
                deleteScheduleDelivery(orderID)
                return;
            }

        });
            
    }

    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Schedule Management</h1>
                    <p>Manage schedules of delivery and pickups</p>
                </div>
                <div className="header-actions">
                    <NavLink to="/admin/create-schedule" className="create-order">
                        <i className="ti ti-plus"></i> Create Schedule
                    </NavLink>
                </div>
            </div>

            <div className="filter-controls">
                <div className="search-bar">
                    <i className="ti ti-search search-icon"></i>
                    <input type="text" placeholder="Search laundry orders by ID..." />
                </div>
                <select defaultValue="Date" className="filter-dropdown">
                    <option value="Date" hidden>Date</option>
                </select>
                <select defaultValue="Status" className="filter-dropdown">
                    <option value="Status" hidden>Status</option>
                </select>
                <select defaultValue="Type" className="filter-dropdown">
                    <option value="Type" hidden>Type</option>
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
                        {schedules.map((schedule, index) => (
                            <tr key={schedule[1].order_id + index}>
                                <td>{schedule[1].order_id}</td>
                                <td>{schedule[1].customer_name}</td>
                                <td>{schedule[2].pickup && schedule[2].delivery ? "Pickup & Delivery" : schedule[2].pickup ? "Pickup" : schedule[2].delivery ? "Delivery" : "error"}</td>
                                <td>{schedule[2].pickup && schedule[2].delivery ?
                                `${formatLocaleDate(schedule[2].pickup.scheduled_date)} : ${formatLocaleDate(schedule[2].delivery.scheduled_date)}` : 
                                schedule[2].pickup ? formatLocaleDate(schedule[2].pickup.scheduled_date) :
                                schedule[2].delivery ? formatLocaleDate(schedule[2].delivery.scheduled_date) :
                                "No date"
                            }</td>
                                <td>
                                    <span className={`status ${getStatusClass(schedule[1].status)}`}>
                                        {schedule[1].status}
                                    </span>
                                </td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/schedule/${schedule[0]}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/schedule/${schedule[0]}/edit`} className="action-icon">
                                        <i className="ti ti-pencil"></i>
                                    </NavLink>
                                    <button className="action-icon delete" onClick={() => handleDeleteSchedule(schedule[0].order_id)}>
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