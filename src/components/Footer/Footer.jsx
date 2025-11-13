import './footer.css'
import WhiteLogo from '../../assets/labable-white.svg'
import { NavLink } from 'react-router'
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase';

export default function Footer(){
    const [userRole, setUserRole] = useState(null);

    useEffect(()=>{
        onAuthStateChanged(auth, (currentUser)=>{
        if(currentUser){
            get(ref(db, `users/${currentUser.uid}`)).then((snapshot)=>{
            if(snapshot.exists()){
                setUserRole(snapshot.val().role);
            }
            })
        }else{
            setUserRole(null);
        }
        })
    },[userRole])

    return(
        <>
            <footer className="footer-container">
                <div className="summary" style={{paddingLeft: userRole === 'admin' ? '160px' : '0px'}}>
                    <div className="footer-section footer-logo">
                        <div className="white-logo">
                            <img src={WhiteLogo} alt="Labable" className='logo-white'/>
                            <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
                        </div>
                        <p>Smart Laundry Management System for modern living</p>
                    </div>
                    <div className="footer-section quick-links">
                        <h2 className='footer-title'>Quick Links</h2>
                        <NavLink to={'/'}>Home</NavLink>
                        <NavLink to={'/about-us'}>About Us</NavLink>
                        <NavLink to={'/#services'}>Services</NavLink>
                        <NavLink to={'/contact'}>Contact</NavLink>
                    </div>
                    <div className="footer-section services">
                        <h2 className='footer-title'>Services</h2>
                        <p>Washing</p>
                        <p>Dry Cleaning</p>
                        <p>Iron & Press</p>
                        <p>Wash & Fold</p>
                        <p>Pickup & Delivery</p>
                    </div>
                    <div className="footer-section find-us">
                        <h2 className='footer-title'>Find us at</h2>
                        <div className="socials">
                            <i className='fa-brands fa-square-instagram'></i>
                            <i className='fa-brands fa-square-twitter'></i>
                            <i className='fa-brands fa-square-facebook'></i>
                        </div>
                    </div>
                </div>
                <p className='copyright'>@2025 Labable. All right reserved. BSIT 3G - G1 Group 4</p>
            </footer>
        </>
    )
}