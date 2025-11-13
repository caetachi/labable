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

    function onFirstNameChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('firstnameError');
        setFirstName(null)

        if (!temp.trim()) {
            error.innerHTML = 'First name is required';
        } else {
            error.innerHTML = '';
            setFirstName(temp);
        }
    }

    function onLastNameChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('lastnameError');
        setLastName(null)

        if (!temp.trim()) {
            error.innerHTML = 'Last name is required';
        } else {
            error.innerHTML = '';
            setLastName(temp);
        }
    }

    function onEmailChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('emailError');
        setEmail(null)

        if (!temp.trim()) {
            error.innerHTML = 'Email is required';
        }else if (!temp.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            error.innerHTML = 'Email is invalid';
        } else {
            error.innerHTML = '';
            setEmail(temp);
        }
    }

    function onPhoneNumberChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('phoneError');
        setPhone(null)

        if (!temp.trim()) {
            error.innerHTML = 'Phone number is required';
        } else if (!temp.match(/^(?:\+63|0)9\d{9}$/)) {
            error.innerHTML = 'Phone number is invalid';
        } else {
            error.innerHTML = '';
            setPhone(temp);
        }
    }

    function onPasswordChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('passwordError');
        setPassword(null)

        if (!temp.trim()) {
            error.innerHTML = 'Password is required';
        } else if (temp.length < 6) {
            error.innerHTML = 'Password must be at least 6 characters';
        } else {
            error.innerHTML = '';
            setPassword(temp);
        }
    }

    function onConfirmPasswordChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('confirmPasswordError');
        setConfirmPassword(null)

        if (!temp.trim()) {
            error.innerHTML = 'Confirm password is required';
        } else if (temp !== password) {
            error.innerHTML = 'Passwords do not match';
        } else {
            error.innerHTML = '';
            setConfirmPassword(temp);
        }
    }

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
                        <input type="text" placeholder="Enter first name" onChange={(e)=>{onFirstNameChange(e)}}/>
                        <p className='error-message' id="firstnameError"></p>
                    </div>
                    <div className="input-field">
                        <label>Last Name</label>
                        <input type="text" placeholder="Enter last name" onChange={(e)=>{onLastNameChange(e)}}/>
                        <p className='error-message' id="lastnameError"></p>
                    </div>
                </div>
                <div className="input-field">
                    <label>Email Address</label>
                    <input type="email" placeholder="Enter email address" onChange={(e)=>{onEmailChange(e)}}/>
                    <p className='error-message' id='emailError'></p>
                </div>
                <div className="input-field">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="Enter phone number" onChange={(e)=>{onPhoneNumberChange(e)}}/>
                    <p className='error-message' id='phoneError'></p>
                </div>
                <div className="input-field">
                    <label>Password</label>
                    <input type="password" placeholder="Enter password" onChange={(e)=>{onPasswordChange(e)}}/>
                    <p className='error-message' id='passwordError'></p>
                </div>
                <div className="input-field">
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Confirm password" onChange={(e)=>{onConfirmPasswordChange(e)}}/>
                    <p className='error-message' id='confirmPasswordError'></p>
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