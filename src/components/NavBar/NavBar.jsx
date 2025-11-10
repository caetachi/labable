import { NavLink } from 'react-router'
import labableLogo from '../../assets/labable-black.svg'
import { HashLink } from 'react-router-hash-link';
import './nav-bar.css'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase.js';


export default  function NavBar({image_url, name}){
    const [imageUrl, setImageUrl] = useState();

    useEffect(() => {
      if (image_url) {
        setImageUrl(image_url);
      } else if (name) {
        setImageUrl(`https://avatar.iran.liara.run/username?username=${name}&background=random`);
      }
    }, [image_url, name]);

    function toggleFloatingNav(){
        const floatingNav = document.querySelector('.floating-nav-container');
        floatingNav.classList.toggle('open');
    }

    function logout() {
        Swal.fire({
            title: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--error)',
            cancelButtonColor: 'var(--bg-dark)',
            confirmButtonText: 'Yes, logout!',
            background: 'var(--bg-light)',
            color: 'var(--fg-dark)'
        }).then((result) => {
            if (result.isConfirmed) {
                auth.signOut()
                    .then(() => {
                        localStorage.setItem("toastMessage", "Successfully logged out.");
                        localStorage.setItem("toastType", "success");
                        window.location.href = '/';
                    })
                    .catch((error) => {
                        console.error("Logout error:", error);
                    });
            }
        });
    }

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
                    <img src={labableLogo} alt="Labable"/>
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
                    <HashLink smooth to="/#contact" className="nav-link">
                      <i className="ti ti-address-book"></i>
                      <p>Contact</p>
                    </HashLink>
                    {name? 
                        <NavLink to='/create-order' className='nav-link'>
                            <i className="ti ti-circle-plus"></i>
                            <p>Order</p>
                        </NavLink>
                        
                        :
                        <>
                            <NavLink to='/login' className='nav-link-phone'>
                                <i className="ti ti-login"></i>
                                <p>Login</p>
                            </NavLink>
                            <NavLink to='/registration' className='nav-link-phone'>
                                <i className="ti ti-user-plus"></i>
                                <p>Signup</p>
                            </NavLink>
                        </>
                    }
                </div>
                {name && imageUrl ?
                    <div className="profile-picture" onClick={toggleFloatingNav}>
                        <img src={imageUrl} alt="Profile" />
                        <h5>{name}</h5>
                        <i className="ti ti-caret-down"></i>
                        <div className="floating-nav-container">
                            <NavLink to='/profile' className='floating-nav-link'>
                                <i className="ti ti-user"></i>
                                <p>Profile</p>
                            </NavLink>
                            <NavLink to='/customer/dashboard' className='floating-nav-link'>
                                <i className="ti ti-layout-dashboard"></i>
                                <p>Dashboard</p>
                            </NavLink>
                            <NavLink to='/setting' className='floating-nav-link'>
                                <i className="ti ti-settings"></i>
                                <p>Settings</p>
                            </NavLink>
                            <button className='floating-nav-link' onClick={logout}>
                                <i className="ti ti-logout"></i>
                                <p>Logout</p>
                            </button>
                        </div>
                    </div>
                    :
                    <div className="login-signup">
                        <NavLink to='/login' className='login'>Login</NavLink>
                        <NavLink to='/registration' className='signup'>Signup</NavLink>
                    </div>    
                }
            </nav>
        </>
    )
}