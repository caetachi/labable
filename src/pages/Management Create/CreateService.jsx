import { useState } from 'react'
import './management-create.css'
import { newServiceType } from '../../scripts/create';

export default function CreateService() {

    const [name, setName] = useState();
    const [services, setServices] = useState();
    const [price, setPrice] = useState();

    async function submit(){
        await newServiceType(name, services, null, price, null);
    }

    function getDaService(servicesIncluded){
        return servicesIncluded.trim().split(', ');
    }

    function onNameChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('nameError');
        setName(null)
        if (!temp.trim()) {
            error.innerHTML = 'Service Name is required';
        } else {
            error.innerHTML = '';
            setName(temp);
        }
    }

    function onServicesChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('servicesError');
        setServices(null)
        if (!temp.trim()) {
            error.innerHTML = 'Services Included is required';
        } else if(!temp.match(/^[A-Za-z]+(?:\s*,\s*[A-Za-z]+)*$/)){
            error.innerHTML = 'Please enter valid services';
        } else {
            error.innerHTML = '';
            setServices(temp);
        }
    }

    function onPriceChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('priceError');
        setPrice(null)
        if (!temp.trim()) {
            error.innerHTML = 'Price is required';
        } else {
            error.innerHTML = '';
            setPrice(temp);
        }
    }

    return(
        <div className="management-container">
            <div className="form">
                <div className="form-header">
                    <h2>Create Service</h2>
                    <p>Create a new service by filling out the form below.</p>
                </div>
                <div className="input-field">
                    <label>Service Name</label>
                    <input type="text" placeholder="Enter service name" onChange={(e)=>onNameChange(e)}/>
                    <p className='error-message' id="nameError"></p>
                </div>
                <div className="input-field">
                    <label>Services Included</label>
                    <input type="text" placeholder="Enter services included (e.g, Wash, Dry, Fold, Iron)" onChange={(e)=>onServicesChange(e)}/>
                    <p className='error-message' id="servicesError"></p>
                </div>
                <div className="input-field">
                    <label>Price</label>
                    <input type="number" step="0.01" placeholder="Enter price" onChange={(e)=>onPriceChange(e)}/>
                    <p className='error-message' id="priceError"></p>
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    {name && services && price ? 
                    <button className="create-button" onClick={submit}>Create Service</button> :
                    <button className="create-button">Create Service</button>  }
                </div>
            </div>
        </div>
    )
}