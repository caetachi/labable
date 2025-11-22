import './forgot-password.css'
import { Navigate, NavLink } from 'react-router'
import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase'
import { toast } from 'react-toastify'
import AIAssistant from '../../components/AI Assistant/AIAssistant'

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        try {
          await sendPasswordResetEmail(auth, email);
          
          setMessage('If your email is in our system, a password reset link has been sent.');
          toast.success('If your email is in our system, a password reset link has been sent.');
          
        } catch (err) {
          console.error(err);
          setMessage('If your email is in our system, a password reset link has been sent.');
          toast.success('If your email is in our system, a password reset link has been sent.');
        }
      }


    return (
        <div className="forgot-password-container">
            <i className="fa-solid fa-xmark" onClick={()=>{window.history.back()}}></i>
            <form action="" className='form' onSubmit={handleSubmit}>
                <h3>Forgot Password</h3>
                <p>Please enter your email address you’d like your password reset information sent to</p>

                <div className="input-group">
                    <label>Email Address</label>
                    <div className="icon-input">
                        <i className="fa-regular fa-envelope"></i>
                        <input type="email" placeholder="Enter email address" onChange={(e)=>{handleEmailChange(e)}}/>
                    </div>
                    <p className='error-message' id="emailError"></p>
                </div>

                {email ? 
                <button type='submit' className="reset-button">Send Reset Link</button> 
                :
                <button className="reset-button disabled" disabled>Send Reset Link</button>
                }
                <NavLink className={'back-btn'} to={'/login'}>Back to Login</NavLink>
            </form>
            <AIAssistant pageContext="Forgot Password page – user can enter their email address and click the button to send a password reset link, then follow that email to change their password, and use the 'Back to Login' link to return to the login page." />
        </div>
    )
}