import { NavLink } from 'react-router'
import Mascot from '../../assets/Mascot.png'
import labableLogo from '../../assets/labable-white.svg'
import bubble from '../../assets/bubble.svg'
import heartBubble from '../../assets/heart-bubble.svg'
import './login.css'

export default function Login() {
    return (
        
        <section className="login-container">
            <div className="content">

                    <img src={bubble} className="bubble" style={{top: '-3%', left: '-2%'}}/>
                    <img src={bubble} className="bubble" style={{top: '10%', left: '15%'}}/>
                    <img src={bubble} className="bubble" style={{top: '85%', left: '10%'}}/>
                    <img src={bubble} className="bubble" style={{top: '80%', left: '-5%'}}/>
                    <img src={bubble} className="bubble" style={{top: '60%', left: '-1%'}}/>
                
                    <img src={heartBubble} className="heart-bubble" style={{top: '1%', right: '2%'}}/>
                    <img src={heartBubble} className="heart-bubble" style={{top: '4%', right: '1%'}}/>
                    <img src={heartBubble} className="heart-bubble" style={{top: '80%', right: '-1%'}}/>
                    <img src={heartBubble} className="heart-bubble" style={{top: '90%', right: '3%'}}/>
                    <img src={heartBubble} className="heart-bubble" style={{top: '70%', right: '8%'}}/>

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
    )
}

