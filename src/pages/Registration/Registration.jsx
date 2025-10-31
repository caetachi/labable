import { NavLink } from 'react-router'
import Mascot from '../../assets/Mascot.png'
import labableLogo from '../../assets/labable-white.svg'
import './registration.css'

export default function Registration() {
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
                                    <input type="text" name="firstName" id="registration-firstName" placeholder='e.g Juan' />
                                </div>
                            </div>

                            <div className="field">
                                <p className="label-field">
                                    Last name
                                </p>
                                
                                <div className="input-field">
                                    <input type="text" name="lastName" id="registration-lastName" placeholder='e.g Dela Cruz' />
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <p className="label-field">
                                Email address
                            </p>
                            <div className="input-field">
                                <i className="fa-regular fa-envelope"></i>
                                <input type="email" name="email" id="registration-email" placeholder='name@example.com' />
                            </div>
                        </div>

                        <div className="field">
                            <p className="label-field">
                                Phone number
                            </p>
                            <div className="input-field">
                                <i className="ti ti-phone"></i>
                                <input type="tel" name="phoneNumber" id="registration-phoneNumber" placeholder='09123456789' />
                            </div>
                        </div>

                        <div className="field">
                            <p className="label-field">
                                Password
                            </p>
                            <div className="input-field">
                                <i className="ti ti-lock"></i>
                                <input type="password" name="password" id="registration-password" placeholder='••••••••••' />
                            </div>
                        </div>

                        <div className="field">
                            <p className="label-field">
                                Confirm password
                            </p>
                            <div className="input-field">
                                <i className="ti ti-lock"></i>
                                <input type="password" name="password" id="registration-confirmPassword" placeholder='••••••••••' />
                            </div>
                        </div>

                        <span className="consent">
                            <input type="radio" name="consent" id="registration-consent" />
                            I agree to the Terms and Conditions
                        </span>
                       
                        <button className="registration-btn">
                            Register
                        </button>

                        <div className="alt-registration-label">
                            <hr />
                            <p>or register with</p>
                            <hr />
                        </div>

                        <button className="alt-registration-btn google">
                            <i className="ti ti-brand-google"></i>
                            Google
                        </button>

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

