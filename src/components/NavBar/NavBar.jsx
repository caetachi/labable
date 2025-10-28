import { NavLink } from 'react-router'
import labableLogo from '../../assets/logo.png'
import './nav-bar.css'
export default  function NavBar(){
    return(
        <>
            <div className="nav-bar-container">
                <img src={labableLogo} alt="" className='logo'/>
                <div className="links">
                    <NavLink to='/' className='nav-link'>Home</NavLink>
                    <NavLink to='/' className='nav-link'>About us</NavLink>
                    <NavLink to='/' className='nav-link'>Contact</NavLink>
                    <NavLink to='/' className='nav-link'>Create order</NavLink>
                </div>
                <div className="login-signup">
                    <button className='login'>Login</button>
                    <button className='signup'>Signup</button>
                </div>
            </div>
        </>
    )
}