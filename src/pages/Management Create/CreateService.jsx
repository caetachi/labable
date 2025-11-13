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

    return(
        <div className="management-container">
            <div className="form">
                <div className="form-header">
                    <h2>Create Service</h2>
                    <p>Create a new service by filling out the form below.</p>
                </div>
                <div className="input-field">
                    <label>Service Name</label>
                    <input type="text" placeholder="Enter service name" onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div className="input-field">
                    <label>Services Included</label>
                    <input type="text" placeholder="Enter services included (e.g, Wash, Dry, Fold, Iron)" onChange={(e)=>setServices(getDaService(e.target.value))}/>
                </div>
                <div className="input-field">
                    <label>Price</label>
                    <input type="number" placeholder="Enter price" onChange={(e)=>setPrice(e.target.value)}/>
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