import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';
import { onValue, ref } from 'firebase/database';
import { db } from '../../firebase';
import { getWashableItems } from '../../scripts/get';
import swal from 'sweetalert2';
import { deleteWashable } from '../../scripts/delete';


export default function WashableManagement() {

    const [washables, setWashables] = useState([]);

    useEffect(()=>{
        const washableRef = ref(db, 'washable_items');
        async function getWashableList() {
            const getDaWashables = await getWashableItems();
            let withoutCounter = [];
            for(let i = 0; i < getDaWashables.length; i++){
                if(getDaWashables[i][0] != 'washables_counter'){
                    withoutCounter.push(getDaWashables[i])
                }
            }
            console.log(withoutCounter);
            
            setWashables(withoutCounter)
        }
        onValue(washableRef, (snapshot)=>{
            if (snapshot.exists()) {
                const data = snapshot.val();
                getWashableList();
            } else {
                console.log("No data available");
            }
        });
    }, [])

    async function handleDelete(washableUid){
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
                await deleteWashable(washableUid);
                }
        });
    }

    return (
        <>
            <div className="management-header">
                <div className="header-title">
                    <h1>Washable Items Management</h1>
                    <p>Manage washable items, pricing and number of pieces per kg</p>
                </div>
                <div className="header-actions">
                    <NavLink to={'/admin/create-washable'} 
                    className="create-order">
                        <i className="ti ti-plus"></i> Add Items
                    </NavLink>
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
                            <th>Item/kg</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {washables.map(item => (
                            <tr key={item[1].washable_item_id}>
                                <td>{item[1].washable_item_id}</td>
                                <td>{item[1].washable_item_name}</td>
                                <td>{item[1].item_per_kilo}</td>
                                <td className="action-buttons">
                                    <NavLink to={`/admin/washable/${item[0]}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/washable/${item[0]}/edit`} className="action-icon">
                                        <i className="ti ti-pencil"></i>
                                    </NavLink>
                                    <button className="action-icon delete" onClick={()=>handleDelete(item[0])}  >
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