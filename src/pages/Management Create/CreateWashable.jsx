import { useState } from 'react'
import './management-create.css'
import { newWashableItem } from '../../scripts/create';

export default function CreateWashable() {

    const [name, setName] = useState();
    const [itemPerKg, setItemPerKg] = useState();

    async function submit(){
        await newWashableItem(name, itemPerKg, null);
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

    function onItemPerKgChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('itemPerKgError');
        setItemPerKg(null)

        if (!temp.trim()) {
            error.innerHTML = 'Item/Kg is required';
        } else {
            error.innerHTML = '';
            setItemPerKg(temp);
        }
    }

    return(
        <div className="management-container">
            <div className="form">
                <div className="form-header">
                    <h2>Create Washable</h2>
                    <p>Create a new washable item by filling out the form below.</p>
                </div>
                <div className="input-field">
                    <label>Washable Name</label>
                    <input type="text" placeholder="Enter washable name" onChange={(e)=>onNameChange(e)}/>
                    <p className='error-message' id="nameError"></p>
                </div>
                <div className="input-field">
                    <label>Item/Kg</label>
                    <input type="number" step="0.01" placeholder="Enter how many items per kg" onChange={(e)=>onItemPerKgChange(e)}/>
                    <p className='error-message' id="itemPerKgError"></p>
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    {name && itemPerKg ? 
                    <button className="create-button" onClick={submit}>Create Washable</button> : 
                    <button className="create-button disabled" disabled>Create Washable</button>} 
                </div>
            </div>
        </div>
    )
}