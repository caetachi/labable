import { useState } from 'react';
import './management-create.css'
import { registerViaEmailPass } from '../../scripts/register';

export default function CreateCustomer() {

    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    async function submit(){
        if(password != confirmPassword){
            console.log('iba');
            return; // show nyo error
        }
        await registerViaEmailPass(email, firstName, lastName, phone, password);
    }

    return(
        <div className="management-container">
            <div className="form">
                <div className="form-header">
                    <h2>Create Customer</h2>
                    <p>Create a new customer by filling out the form below.</p>
                </div>
                <div className="input-group">
                    <div className="input-field">
                        <label>First Name</label>
                        <input type="text" placeholder="Enter first name" onChange={(e)=>setFirstName(e.target.value)}/>
                    </div>
                    <div className="input-field">
                        <label>Last Name</label>
                        <input type="text" placeholder="Enter last name" onChange={(e)=>setLastName(e.target.value)}/>
                    </div>
                </div>
                <div className="input-field">
                    <label>Email Address</label>
                    <input type="email" placeholder="Enter email address" onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div className="input-field">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="Enter phone number" onChange={(e)=>setPhone(e.target.value)}/>
                </div>
                <div className="input-field">
                    <label>Password</label>
                    <input type="password" placeholder="Enter password" onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <div className="input-field">
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Confirm password" onChange={(e)=>setConfirmPassword(e.target.value)}/>
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    {firstName && lastName && email && phone && password && confirmPassword && password == confirmPassword ?
                        <button className="create-button" onClick={submit}>Create Customer</button>
                        :
                        <button className="create-button disabled" disabled>Create Customer</button>
                    }
                </div>
            </div>
        </div>
    )
}