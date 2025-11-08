import { NavLink } from 'react-router'
import Mascot from '../../assets/Mascot.png'
import labableLogo from '../../assets/labable-white.svg'
import './registration.css'
import AltAccountButton from '../../components/AltAuth/AltAccountButton'
import { useState } from 'react'
import { registerViaEmailPass } from '../../scripts/register'
import { toast } from 'react-toastify'
import { set } from 'firebase/database'

export default function Registration() {

    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [consent, setConsent] = useState(false);

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
        setPhoneNumber(null)

        if (!temp.trim()) {
            error.innerHTML = 'Phone number is required';
        } else if (!temp.match(/^(?:\+63|0)9\d{9}$/)) {
            error.innerHTML = 'Phone number is invalid';
        } else {
            error.innerHTML = '';
            setPhoneNumber(temp);
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

    function onConsentChange(e) {
        setConsent(e.target.checked);
    }

    function handleRegister() {
        registerViaEmailPass(email, firstName, lastName, phoneNumber, password);
        document.getElementById('registerBtn').disabled = true;
        document.getElementById('registerBtn').classList.add('disabled');
        document.getElementById('registerBtn').innerText = "Registering...";
        setTimeout(() => {
            document.getElementById('registerBtn').innerText = "Register";
            document.getElementById('registerBtn').disabled = false;
            document.getElementById('registerBtn').classList.remove('disabled');
            window.location.reload();
        }, 3000);
    }

    return (
        <>
            <section className="registration-container">
                <div className="content">
                    <div className="col splash">
                            <div className="logo">
                                <img src={labableLogo} alt="Labable" className='logo'/>
                                <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
                            </div>
                            
                            <div className="splash-container">
                                <img src={Mascot} alt="Labable mascot image" />
                            </div>

                            <p className="label">
                                Let's Create your Account!
                            </p>
                    </div>

                    <div className="col form">
                        <div className="form-row">
                            <div className="field">
                                <p className="label-field">
                                    First name
                                </p>

                                <div className="input-field">
                                    <input type="text" name="firstName" id="registration-firstName" placeholder='e.g Juan' 
                                        onChange={onFirstNameChange} />
                                </div>
                                <p className='error-message' id='firstnameError'></p>
                            </div>

                            <div className="field">
                                <p className="label-field">
                                    Last name
                                </p>
                                
                                <div className="input-field">
                                    <input type="text" name="lastName" id="registration-lastName" placeholder='e.g Dela Cruz' 
                                        onChange={onLastNameChange} />
                                </div>
                                <p className='error-message' id='lastnameError'></p>
                            </div>
                        </div>

                        <div className="field">
                            <p className="label-field">
                                Email address
                            </p>
                            <div className="input-field">
                                <i className="fa-regular fa-envelope"></i>
                                <input type="email" name="email" id="registration-email" placeholder='name@example.com' 
                                    onChange={onEmailChange} />
                            </div>
                            <p className='error-message' id='emailError'></p>
                        </div>

                        <div className="field">
                            <p className="label-field">
                                Phone number
                            </p>
                            <div className="input-field">
                                <i className="ti ti-phone"></i>
                                <input type="tel" name="phoneNumber" id="registration-phoneNumber" placeholder='09123456789' 
                                    onChange={onPhoneNumberChange} />
                            </div>
                            <p className='error-message' id='phoneError'></p>
                        </div>

                        <div className="field">
                            <p className="label-field">
                                Password
                            </p>
                            <div className="input-field">
                                <i className="ti ti-lock"></i>
                                <input type="password" name="password" id="registration-password" placeholder='••••••••••' 
                                    onChange={onPasswordChange} />
                            </div>
                            <p className='error-message' id='passwordError'></p>
                        </div>

                        <div className="field">
                            <p className="label-field">
                                Confirm password
                            </p>
                            <div className="input-field">
                                <i className="ti ti-lock"></i>
                                <input type="password" name="password" id="registration-confirmPassword" placeholder='••••••••••' 
                                    onChange={onConfirmPasswordChange} />
                            </div>
                            <p className='error-message' id='confirmPasswordError'></p>
                        </div>

                        <span className="consent">
                            <input type="checkbox" name="consent" id="registration-consent" 
                            onChange={onConsentChange} />
                            I agree to the Terms and Conditions
                        </span>
                        
                        {firstName && lastName && email && phoneNumber && password && confirmPassword && consent?
                            <button className="registration-btn" id='registerBtn'
                                onClick={handleRegister}>
                                Register
                            </button>
                            :
                            <button className="registration-btn disabled" disabled>
                                Register
                            </button>
                        }

                        <div className="alt-registration-label">
                            <hr />
                            <p>or register with</p>
                            <hr />
                        </div>
   
                        <AltAccountButton/>

                        <span className="signup-redirect">
                            Already have an account?
                            <NavLink to={'/login'}>Login</NavLink>
                        </span>
                    </div>
                </div>
            </section>
        </>
    )
}

