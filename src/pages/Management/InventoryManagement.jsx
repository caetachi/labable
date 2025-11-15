import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './management.css';
import { onValue, ref } from 'firebase/database';
import { db } from '../../firebase';
import { getInventory } from '../../scripts/get';
import swal from 'sweetalert2';
import { deleteInventory } from '../../scripts/delete';


const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, '');
}

export default function InventoryManagement() {
    const [inventory, setInventory] = useState([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortKey, setSortKey] = useState('name'); 
    const [sortDirection, setSortDirection] = useState('asc');

    
    useEffect(()=>{
        console.log('load');
        const inventoryRef = ref(db, 'inventory_items');
        async function getInventoryList() {
            const getDaInventory = await getInventory();
            let withoutCounter = [];
            for(let i = 0; i < getDaInventory.length; i++){
                if(getDaInventory[i][0] !== 'inventory_counter'){
                    withoutCounter.push(getDaInventory[i])
                }
            }
            console.log(withoutCounter);
            setInventory(withoutCounter)
        }
        const unsubscribe = onValue(inventoryRef, (snapshot)=>{
            if (snapshot.exists()) {
                getInventoryList();
            } else {
                console.log("No data available");
            }
        });
        return () => unsubscribe();
    }, [])

    async function handleDelete(inventoryUid){
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
                    await deleteInventory(inventoryUid);
                    }
            });
    }

    const displayInventory = [...inventory]
        .filter(item => {
            
            const passesSearch = item[1].inventory_item_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

           
            const passesStatus = (statusFilter === 'all') || (item[1].status.toLowerCase() === statusFilter.toLowerCase());

            return passesSearch && passesStatus;
        })
        .sort((a, b) => {
            
            let valA, valB;

            switch (sortKey) {
                case 'name':
                    valA = a[1].inventory_item_name.toLowerCase();
                    valB = b[1].inventory_item_name.toLowerCase();
                    break;
                case 'quantity':
                    valA = a[1].quantity_in_stock; 
                    valB = b[1].quantity_in_stock;
                    break;
                case 'date':
                    valA = new Date(a[1].last_restocked); 
                    valB = new Date(b[1].last_restocked);
                    break;
                default:
                    return 0; 
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
                    <h1>Inventory Management</h1>
                    <p>Manage inventory of the shop</p>
                </div>
                <div className="header-actions">
                    <NavLink to={'/admin/create-inventory'} 
                    className="create-order">
                        <i className="ti ti-plus"></i> Add Items
                    </NavLink>
                </div>
            </div>

            <div className="filter-controls">
                
                <div className="search-bar">
                    <i className="ti ti-search search-icon"></i>
                    <input 
                        type="text" 
                        placeholder="Search Items..." 
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
                    <option value="quantity">Sort by Quantity</option>
                    <option value="date">Sort by Last Restocked</option>
                </select>

                <select 
                    className="filter-dropdown"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="low stock">Low Stock</option>
                    <option value="out of stock">Out of Stock</option>
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
                        {displayInventory.map(item => (
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
                                    <NavLink to={`/admin/inventory/${item[0]}`} className="action-icon">
                                        <i className="ti ti-eye"></i>
                                    </NavLink>
                                    <NavLink to={`/admin/inventory/${item[0]}/edit`} className="action-icon">
                                        <i className="ti ti-pencil"></i>
                                    </NavLink>
                                    <button className="action-icon delete" onClick={()=>handleDelete(item[0])}>
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