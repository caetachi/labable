import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';
import { onValue, ref } from 'firebase/database';
import { getOrders, hasDelivery, hasPickup } from '../../scripts/get';
import { db } from '../../firebase';
import {deleteSchedulePickup, deleteScheduleDelivery} from '../../scripts/delete';
import Swal from 'sweetalert2';
import { formatLocaleDate, formatMe } from '../../scripts/dateformat';
import { fixCancelled } from '../../scripts/fix';

const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, '');
}

const checkDateNan = (date) => {
    const parsedDate = Date.parse(date);
    return isNaN(parsedDate);
}

const getSortDate = (schedule) => {
    const pDate = schedule[2].pickup ? schedule[2].pickup.scheduled_date : null;
    const dDate = schedule[2].delivery ? schedule[2].delivery.scheduled_date : null;

  
    if (pDate && !checkDateNan(pDate)) return new Date(pDate);
 
    if (dDate && !checkDateNan(dDate)) return new Date(dDate);
  
    return new Date(0); 
}


export default function ScheduleManagement() {

    const [schedules, setSchedules] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all'); 
    const [sortKey, setSortKey] = useState('date'); 
    const [sortDirection, setSortDirection] = useState('asc'); 


    const ordersRef = ref(db, 'orders');
    useEffect(()=>{
        async function getOrdersList() {
            const getOrder = await getOrders();
            let withoutCounter = [];
            for(let i = 0; i < getOrder.length; i++){
                if(getOrder[i][0] !== 'orders_counter'){
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
        const unsubscribe = onValue(ordersRef, (snapshot)=>{
            if (snapshot.exists()) {
                getOrdersList();
            } else {
                console.log("No data available");
            }
        });
        return () => unsubscribe()
    }, [ordersRef])

    useEffect(()=>{
    }, [])


    async function handleDeleteSchedule(orderID){
        const hasPickupBool = await hasPickup(orderID);
        const hasDeliveryBool = await hasDelivery(orderID);
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true, 
            showDenyButton: (hasPickupBool && hasDeliveryBool), 
            confirmButtonText: (hasPickupBool && hasDeliveryBool) || hasPickupBool ? "Delete Pickup" : "Delete Delivery",
            denyButtonText: "Delete Delivery", 
            confirmButtonColor: 'var(--bg-dark)',
            denyButtonColor: 'var(--error)', 
        }).then(async (result) => {
            if(((hasPickupBool && hasDeliveryBool) || hasPickupBool) && result.isConfirmed) {
                deleteSchedulePickup(orderID);
                return;
            }
            if((hasPickupBool && hasDeliveryBool) && result.isDenied) {
                deleteScheduleDelivery(orderID)
                return;
            }
            if(((!hasPickupBool && hasDeliveryBool)) && result.isConfirmed) {
                deleteScheduleDelivery(orderID)
                return;
            }

        });
            
    }

    const displaySchedules = [...schedules]
        .filter(schedule => {
            
            const search = searchTerm.toLowerCase();
            const orderID = (schedule[1].order_id || "").toLowerCase();
            const customerName = (schedule[1].customer_name || "").toLowerCase();
            const passesSearch = orderID.includes(search) || customerName.includes(search);

            const passesStatus = (statusFilter === 'all') || (schedule[1].status === statusFilter);

            const hasPickup = !!schedule[2].pickup;
            const hasDelivery = !!schedule[2].delivery;
            let passesType;
            switch (typeFilter) {
                case 'pickup':
                    passesType = hasPickup && !hasDelivery;
                    break;
                case 'delivery':
                    passesType = !hasPickup && hasDelivery;
                    break;
                case 'pickup_delivery':
                    passesType = hasPickup && hasDelivery;
                    break;
                case 'all':
                default:
                    passesType = true;
            }

            return passesSearch && passesStatus && passesType;
        })
        .sort((a, b) => {
            
            let valA, valB;

            switch (sortKey) {
                case 'date':
                    valA = getSortDate(a); 
                    valB = getSortDate(b);
                    break;
                case 'name':
                    valA = (a[1].customer_name || "").toLowerCase();
                    valB = (b[1].customer_name || "").toLowerCase();
                    break;
                case 'id':
                default:
                    valA = (a[1].order_id || "").toLowerCase();
                    valB = (b[1].order_id || "").toLowerCase();
                    break;
            }

            if (sortDirection === 'asc') {
                if (typeof valA === 'string') return valA.localeCompare(valB);
                return valA - valB; 
            } else { 
                if (typeof valA === 'string') return valB.localeCompare(valA);
                return valB - valA;
            }
        });


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
                    <input 
                        type="text" 
                        placeholder="Search by Order ID or Customer..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select 
                    className="filter-dropdown"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Customer</option>
                    <option value="id">Sort by Order ID</option>
                </select>

                <select 
                    className="filter-dropdown"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ready for Delivery">Ready for Delivery</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <select 
                    className="filter-dropdown"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value="all">All Types</option>
                    <option value="pickup">Pickup Only</option>
                    <option value="delivery">Delivery Only</option>
                    <option value="pickup_delivery">Pickup & Delivery</option>
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
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displaySchedules.map((schedule, index) => (
                            <tr key={schedule[1].order_id + index}>
                                <td>{schedule[1].order_id}</td>
                                <td>{schedule[1].customer_name}</td>
                                <td>{schedule[2].pickup && schedule[2].delivery ? "Pickup & Delivery" : schedule[2].pickup ? "Pickup" : schedule[2].delivery ? "Delivery" : "error"}</td>
                                <td>{schedule[2].pickup && schedule[2].delivery && checkDateNan(schedule[2].delivery.scheduled_date) ?
                                `${formatLocaleDate(formatMe(schedule[2].pickup.scheduled_date))} : ${schedule[2].delivery.scheduled_date}` : 
                                schedule[2].pickup && schedule[2].delivery && !checkDateNan(schedule[2].delivery.scheduled_date) ?
                                `${formatLocaleDate(formatMe(schedule[2].pickup.scheduled_date))} : ${formatLocaleDate(formatMe(schedule[2].delivery.scheduled_date))}` :
                                schedule[2].pickup ? formatLocaleDate(formatMe(schedule[2].pickup.scheduled_date)) :
                                schedule[2].delivery && !checkDateNan(schedule[2].delivery.scheduled_date) ? formatLocaleDate(formatMe(schedule[2].delivery.scheduled_date)) :
                                schedule[2].delivery ? schedule[2].delivery.scheduled_date : "No date"
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
                                    <button className="action-icon delete" onClick={() => handleDeleteSchedule(schedule[0])}>
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