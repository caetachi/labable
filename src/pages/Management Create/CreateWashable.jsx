import { useState } from 'react'
import './management-create.css'
import { newWashableItem } from '../../scripts/create';

export default function CreateWashable() {

    const [name, setName] = useState();
    const [itemPerKg, setItemPerKg] = useState();

    async function submit(){
        await newWashableItem(name, itemPerKg, null);
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
                    <input type="text" placeholder="Enter washable name" onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div className="input-field">
                    <label>Item/Kg</label>
                    <input type="number" placeholder="Enter how many items per kg" onChange={(e)=>setItemPerKg(e.target.value)}/>
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    {name && itemPerKg ? 
                    <button className="create-button" onClick={submit}>Create Washable</button> : 
                    <button className="create-button">Create Washable</button>} 
                </div>
            </div>
        </div>
    )
}