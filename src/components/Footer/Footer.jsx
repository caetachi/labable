import './footer.css'
import WhiteLogo from '../../assets/logo-white.png'
import InstaLogo from '../../assets/insta.png'
import TeamsLogo from '../../assets/teams.png'
import FbLogo from '../../assets/facebook.png'

export default function Footer(){
    return(
        <>
            <div className="footer-container">
                <div className="summary">
                    <div className="business">
                        <img src={WhiteLogo} alt="" />
                        <p>Smart Laundry Management System for modern living</p>
                    </div>
                    <div className="quick-links">
                        <p className='footer-title'>Quick Links</p>
                        <p>Home</p>
                        <p>About</p>
                        <p>Services</p>
                        <p>Contact</p>
                        <p>Create Order</p>
                    </div>
                    <div className="services">
                        <p className='footer-title'>Services</p>
                        <p>Washing</p>
                        <p>Dry Cleaning</p>
                        <p>Iron & Press</p>
                        <p>Wash & Fold</p>
                        <p>Pickup & Delivery</p>
                    </div>
                    <div className="find-us-at">
                        <p className='footer-title'>Find Us At</p>
                        <div className="socials">
                            <img src={InstaLogo} alt="" />
                            <img src={TeamsLogo} alt="" />
                            <img src={FbLogo} alt="" />
                        </div>
                    </div>
                </div>
                <p className='copyright'>@2025 Labable. All right reserved. BSIT 3G - G1 Group 4</p>
            </div>
        </>
    )
}