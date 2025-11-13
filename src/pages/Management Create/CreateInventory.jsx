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

    function onNameChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('nameError');
        setName(null)

        if (!temp.trim()) {
            error.innerHTML = 'Name is required';
        } else {
            error.innerHTML = '';
            setName(temp);
        }
    }

    function onQuantityChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('quantityError');
        setQuantity(null)

        if (!temp.trim()) {
            error.innerHTML = 'Quantity is required';
        } else {
            error.innerHTML = '';
            setQuantity(temp);
        }
    }

    function onUnitChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('unitError');
        setUnit(null)
        if (!temp.trim()) {
            error.innerHTML = 'Unit is required';
        } else {
            error.innerHTML = '';
            setUnit(temp);
        }
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
                    <input type="text" placeholder="Enter item name" onChange={(e)=>onNameChange(e)}/>
                    <p className='error-message' id="nameError"></p>
                </div>
                <div className="input-field">
                    <label>Quantity</label>
                    <input type="number" placeholder="Enter quantity" onChange={(e)=>onQuantityChange(e)}/>
                    <p className='error-message' id="quantityError"></p>
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
                    <input type="text" placeholder="Enter unit" onChange={(e)=>onUnitChange(e)}/>
                    <p className='error-message' id="unitError"></p>
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    {name && quantity && status && unit ?
                    <button className="create-button" onClick={submit}>Create Inventory</button>
                    :
                    <button className="create-button disabled" disabled>Create Inventory</button>
                    }
                </div>
            </div>
        </div>
    )
}