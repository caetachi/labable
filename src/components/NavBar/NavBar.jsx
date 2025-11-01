import { NavLink } from 'react-router'
import labableLogo from '../../assets/labable-black.svg'
import './nav-bar.css'
export default  function NavBar(){
    return(
        <>
            <nav className="nav-bar-container">
                <div className="logo">
                    <img src={labableLogo} alt="Labable" className='logo'/>
                    <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
                </div>
                <div className="links">
                    <NavLink to='/' className='nav-link'>Home</NavLink>
                    <NavLink to='/about-us' className='nav-link'>About us</NavLink>
                    <NavLink to='/' className='nav-link'>Contact</NavLink>
                    <NavLink to='/' className='nav-link'>Create order</NavLink>
                </div>
                <div className="login-signup">
                    <NavLink to='/login' className='login'>Login</NavLink>
                    <NavLink to='/registration' className='signup'>Signup</NavLink>
                </div>
            </nav>
        </>
    )
}