import './footer.css'
import WhiteLogo from '../../assets/labable-white.svg'
import InstaLogo from '../../assets/insta.png'
import TeamsLogo from '../../assets/teams.png'
import FbLogo from '../../assets/facebook.png'

export default function Footer(){
    return(
        <>
            <footer className="footer-container">
                <div className="summary">
                    <div className="business">
                        <div className="white-logo">
                            <img src={WhiteLogo} alt="Labable" className='logo-white'/>
                            <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
                        </div>
                        <p>Smart Laundry Management System for modern living</p>
                    </div>
                    <div className="quick-links">
                        <h2 className='footer-title'>Quick Links</h2>
                        <p>Home</p>
                        <p>About</p>
                        <p>Services</p>
                        <p>Contact</p>
                        <p>Create Order</p>
                    </div>
                    <div className="services">
                        <h2 className='footer-title'>Services</h2>
                        <p>Washing</p>
                        <p>Dry Cleaning</p>
                        <p>Iron & Press</p>
                        <p>Wash & Fold</p>
                        <p>Pickup & Delivery</p>
                    </div>
                    <div className="find-us-at">
                        <h2 className='footer-title'>Find Us At</h2>
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