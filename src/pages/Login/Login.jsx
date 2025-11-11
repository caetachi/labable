import { NavLink } from 'react-router'
import Mascot from '../../assets/Mascot.png'
import labableLogo from '../../assets/labable-white.svg'
import bubble from '../../assets/bubble.svg'
import heartBubble from '../../assets/heart-bubble.svg'
import './login.css'
import { useState } from 'react'
import AltAccountButton from '../../components/AltAuth/AltAccountButton'
import { loginViaEmailAndPassword } from '../../scripts/login.js'
import { registerViaGoogle } from '../../scripts/register.js'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    
    function handleEmailChange(e){
        const temp = e.target.value
        const error = document.getElementById('emailError');
        setEmail(null)

        if(!temp.trim()){
            error.textContent = "Email address is required.";
        }else if(!temp.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
            error.textContent = "Please enter a valid email address.";
        }else{
            error.textContent = "";
            setEmail(temp);
        }
    }

    function handlePasswordChange(e){
        const temp = e.target.value
        const error = document.getElementById('passwordError');
        setPassword(null)
    
        if(!temp.trim()){
            error.textContent = "Password is required.";
        }else{
            error.textContent = "";
            setPassword(temp);
        }
    }

    function handleLogin() {
        loginViaEmailAndPassword(email, password);
        document.getElementById('loginBtn').disabled = true;
        document.getElementById('loginBtn').classList.add('disabled');
        document.getElementById('loginBtn').innerText = "Logging in...";
        setTimeout(() => {
            document.getElementById('loginBtn').innerText = "Login";
            document.getElementById('loginBtn').disabled = false;
            document.getElementById('loginBtn').classList.remove('disabled');
            window.location.reload();
        }, 1000);
    }

    return (
        
        <section className="login-container">
            <i className="fa-solid fa-xmark" onClick={()=>{window.history.back()}}></i>
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
                                <input type="email" name="email" id="login-email" placeholder='name@example.com' 
                                onChange={(e)=>handleEmailChange(e)} />
                            </div>
                            <p className='error-message' id='emailError'></p>
                        </div>

                        <div className="field">
                            <p className="label-field">
                                Password
                            </p>
                            <div className="input-field">
                                <i className="ti ti-lock"></i>
                                <input type="password" name="password" id="login-password" placeholder='••••••••••' 
                                onChange={(e)=>handlePasswordChange(e)} />
                            </div>
                            <p className='error-message' id='passwordError'></p>
                        </div>

                        <div className="utils">
                            <div className="remember">
                                <input type="checkbox" name="remember" id="login-remember" />
                                <p>Remember me</p>
                            </div>

                            <NavLink to={'/'}>Forgot password?</NavLink>
                        </div>

                        {email && password ?
                            <button className="login-btn" id="loginBtn" onClick={handleLogin}>
                                Login
                            </button>
                            :
                            <button className="login-btn disabled" id="loginBtn" disabled>
                                Login
                            </button>
                        }

                        <div className="alt-login-label">
                            <hr />
                            <p>or continue with</p>
                            <hr />
                        </div>

                        <AltAccountButton register={registerViaGoogle}/>

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

