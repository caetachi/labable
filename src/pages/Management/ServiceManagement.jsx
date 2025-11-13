import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';
import { db } from '../../firebase';
import { onValue, ref } from 'firebase/database';
import { getServices } from '../../scripts/get';


export default function ServiceManagement() {

    const [services, setServices] = useState([]);

    const getServicesIncluded = (serviceIncluded) => {
        return serviceIncluded.join(', ');
    };

    useEffect(()=>{
        const servicesRef = ref(db, 'service_types');
        async function getServiceList() {
            const getDaServices = await getServices();
            let withoutCounter = [];
            for(let i = 0; i < getDaServices.length; i++){
                if(getDaServices[i][0] != 'service_counter'){
                    withoutCounter.push(getDaServices[i])
                }
            }
            console.log(withoutCounter);
            
            setServices(withoutCounter)
        }
        onValue(servicesRef, (snapshot)=>{
            if (snapshot.exists()) {
                const data = snapshot.val();
                getServiceList();
            } else {
                console.log("No data available");
            }
        });
    }, [])

    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Service Type Management</h1>
                    <p>Manage services types and pricing</p>
                </div>
                <div className="header-actions">
                    <NavLink to={'/admin/create-service'}>
                        <button className="create-order">
                            <i className="ti ti-plus"></i> Add Service
                        </button>
                    </NavLink>
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
                            <tr key={service[1].service_type_id}>
                                <td>{service[1].service_type_id}</td>
                                <td>{service[1].service_name}</td>
                                <td>{getServicesIncluded(service[1].services)}</td>
                                <td>{service[1].service_price}</td>
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