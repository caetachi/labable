import { NavLink } from 'react-router'
import Mascot from '../../assets/Mascot.png'
import labableLogo from '../../assets/labable-white.svg'
import './login.css'

export default function Login() {
    return (
        <>
            <section className="login-container">
                <div className="content">
                    <div className="col form">
                        <div className="field">
                            <p className="label-field">
                                Email address
                            </p>
                            <div className="input-field">
                                <i className="fa-regular fa-envelope"></i>
                                <input type="email" name="email" id="login-email" placeholder='name@example.com' />
                            </div>
                        </div>

                        <div className="field">
                            <p className="label-field">
                                Password
                            </p>
                            <div className="input-field">
                                <i className="ti ti-lock"></i>
                                <input type="password" name="password" id="login-password" placeholder='••••••••••' />
                            </div>
                        </div>

                        <div className="utils">
                            <div className="remember">
                                <input type="radio" name="remember" id="login-remember" />
                                <p>Remember me</p>
                            </div>

                            <NavLink to={'/'}>Forgot password?</NavLink>
                        </div>

                        <button className="login-btn">
                            Login
                        </button>

                        <div className="alt-login-label">
                            <hr />
                            <p>or continue with</p>
                            <hr />
                        </div>

                        <button className="alt-login-btn google">
                            <i className="ti ti-brand-google"></i>
                            Google
                        </button>

                        <span className="signup-redirect">
                            Don't have an account?
                            <NavLink to={'/registration'}>Sign up</NavLink>
                        </span>
                    </div>
                    <div className="col splash">
                        <div className="logo">
                            <img src={labableLogo} alt="Labable" className='logo'/>
                            <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
                        </div>
                        
                        <div className="splash-container">
                            <img src={Mascot} alt="Labable mascot image" />
                        </div>

                        <p className="label">
                            Welcome Back!
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

