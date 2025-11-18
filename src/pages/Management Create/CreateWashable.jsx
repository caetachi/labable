import { useState } from 'react'
import './management-create.css'
import { newWashableItem } from '../../scripts/create';
import { useNavigate } from 'react-router';

export default function CreateWashable() {

    const [name, setName] = useState();
    const [itemPerKg, setItemPerKg] = useState();
    const navigate = useNavigate();
    async function submit(){
        await newWashableItem(name, itemPerKg, null);
        navigate('/admin/washable');
    }

    function onNameChange(e) {
        const temp = e.target.value;
        const nameRegex = /^[A-Za-z]+(?:[ -'][A-Za-z]+)*$/;
        const error = document.getElementById('nameError');
        setName(null)
        if (!temp.trim()) {
            error.innerHTML = 'Item name is required';
        } else if (!nameRegex.test(temp)) {
            error.innerHTML = 'Item name can only contain letters, spaces, hyphens, and apostrophes';
        }else {
            error.innerHTML = '';
            setWashableName(temp);
        }
    }

    function onItemPerKgChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('itemPerKgError');
        setItemPerKg(null)

        if (!temp.trim()) {
            error.innerHTML = 'Item/Kg is required';
        } else if (isNaN(temp)) {
            error.innerHTML = 'Item/Kg must be a number';
        } else if(temp <= 0) {
            error.innerHTML = 'Item/Kg must be greater than 0';
        }else {
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