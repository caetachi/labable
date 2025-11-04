import { NavLink } from 'react-router'
import labableLogo from '../../assets/labable-black.svg'
import './nav-bar.css'
export default  function NavBar(){
    return(
        <>
            <div className="phone-nav-bar-logo-container">
                <div className="logo">
                    <img src={labableLogo} alt="Labable" className='logo'/>
                    <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
                </div>
            </div>
            <nav className="nav-bar-container">
                <div className="logo">
                    <img src={labableLogo} alt="Labable" className='logo'/>
                    <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
                </div>
                <div className="links">
                    <NavLink to='/' className='nav-link'>
                        <i className="ti ti-home"></i>
                        <p>Home</p>
                    </NavLink>
                    <NavLink to='/about-us' className='nav-link'>
                        <i className="ti ti-info-circle"></i>
                        <p>About</p>
                    </NavLink>
                    <NavLink to='/contact' className='nav-link'>
                        <i className="ti ti-address-book"></i>
                        <p>Contact</p>
                    </NavLink>
                    <NavLink to='/create-order' className='nav-link'>
                        <i className="ti ti-circle-plus"></i>
                        <p>Order</p>
                    </NavLink>
                    <NavLink to='/login' className='nav-link-phone'>
                        <i className="ti ti-login"></i>
                        <p>Login</p>
                    </NavLink>
                    <NavLink to='/registration' className='nav-link-phone'>
                        <i className="ti ti-user-plus"></i>
                        <p>Signup</p>
                    </NavLink>
                </div>
                <div className="login-signup">
                    <NavLink to='/login' className='login'>Login</NavLink>
                    <NavLink to='/registration' className='signup'>Signup</NavLink>
                </div>
            </nav>
        </>
    )
}