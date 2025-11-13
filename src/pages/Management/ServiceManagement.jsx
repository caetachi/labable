import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';
import { db } from '../../firebase';
import { onValue, ref } from 'firebase/database';
import { getServices } from '../../scripts/get';
import swal from 'sweetalert2';
import { deleteService } from '../../scripts/delete';
import BigNumber from 'bignumber.js';

export default function ServiceManagement() {

    const [services, setServices] = useState([]);

    const getServicesIncluded = (serviceIncluded) => {
        let servicesIncluded = [];
        for(let i = 0; i < serviceIncluded.length; i++){
            servicesIncluded.push(serviceIncluded[i]);
        }
        return servicesIncluded.join(', ');
    };

    useEffect(()=>{
        const servicesRef = ref(db, 'service_types');
        async function getServiceList() {
            const get_services = await getServices();
            let withoutCounter = [];
            for(let i = 0; i < get_services.length; i++){
                if(get_services[i][0] != 'service_counter'){
                    withoutCounter.push(get_services[i])
                }
            }
            setServices(withoutCounter)
        }
        onValue(servicesRef, (snapshot)=>{
            if (snapshot.exists()) {
                getServiceList();
            } else {
                console.log("No data available");
            }
        });
    }, [])

     async function handleDelete(serviceUid){
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
                    await deleteService(serviceUid);
                }
            });
        }

    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Service Type Management</h1>
                    <p>Manage services types and pricing</p>
                </div>
                <div className="header-actions">
                    <NavLink to="/admin/create-service" className="create-order">
                        <i className="ti ti-plus"></i> Add Service
                    </NavLink>
                </div>
            </div>

            <div className="filter-controls">
                <div className="search-bar">
                    <i className="ti ti-search search-icon"></i>
                    <input type="text" placeholder="Search services..." />
                </div>
                <select defaultValue="Date" className="filter-dropdown">
                    <option value="Date" disabled hidden>Date</option>
                </select>
                <select defaultValue="Services" className="filter-dropdown">
                    <option value="Services" disabled hidden>Services</option>
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
                            <tr key={service[1].service_type_id}>
                                <td>{service[1].service_type_id}</td>
                                <td>{service[1].service_name}</td>
                                <td>{getServicesIncluded(service[1].services)}</td>
                                <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(new BigNumber(service[1].service_price).toFixed(2))}</td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/service/${service[0]}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/service/${service[0]}/edit`} className="action-icon">
                                        <i className="ti ti-pencil"></i>
                                    </NavLink>
                                    <button className="action-icon delete" onClick={()=>handleDelete(service[0])}>
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