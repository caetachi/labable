import { useState } from 'react'
import './management-create.css'
import { newInventory } from '../../scripts/create';

export default function CreateInventory() {

    const [name, setName] = useState();
    const [quantity, setQuantity] = useState();
    const [status, setStatus] = useState();
    const [unit, setUnit] = useState();

    async function submit(){
        await newInventory(name, quantity, unit, status);
    }

    return(
        <div className="management-container">
            <div className="form">
                <div className="form-header">
                    <h2>Create Inventory</h2>
                    <p>Create a new inventory item by filling out the form below.</p>
                </div>
                <div className="input-field">
                    <label>Item Name</label>
                    <input type="text" placeholder="Enter item name" onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div className="input-field">
                    <label>Quantity</label>
                    <input type="number" placeholder="Enter quantity" onChange={(e)=>setQuantity(e.target.value)}/>
                </div>
                <div className="input-field">
                    <label>Status</label>
                    <select name="status" id="status" onChange={(e)=>setStatus(e.target.value)}>
                        <option value="" disabled selected hidden>Select status</option>
                        <option value="available">Available</option>
                        <option value="low stock">Low Stock</option>
                        <option value="out of stock">Out of Stock</option>
                    </select>
                </div>
                <div className="input-field">
                    <label>Unit</label>
                    <input type="text" placeholder="Enter unit" onChange={(e)=>setUnit(e.target.value)}/>
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    {name && quantity && status && unit ?
                    <button className="create-button" onClick={submit}>Create Inventory</button>
                    :
                    <button className="create-button" disabled>Create Inventory</button>
                    }
                </div>
            </div>
        </div>
    )
}