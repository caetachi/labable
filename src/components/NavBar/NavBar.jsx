import { NavLink } from "react-router"
import './navbar.css'

export default function Navbar() {

    return(
        <nav className="navbar">
            <div className="navbar-logo">
                <img className="labable-logo" src="/src/assets/labable-black.svg" alt="Labable Logo"></img>
                <div className="title">
                    <h1 className="title title-primary">
                        Laba
                    </h1>
                    <h1 className="title title-secondary">
                        ble
                    </h1>
                </div>
            </div>  

            <div className="links">
                <NavLink className="link" to={'/'}>Home</NavLink>
                <NavLink className="link" to={'/about'}>About Us</NavLink>
                <NavLink className="link" to={'/contact'}>Contact</NavLink>
                <NavLink className="link" to={'/order'}>Create Order</NavLink>
            </div>

            <div className="actions">
                <button className="login-btn">
                    Login
                </button>
                <button className="signup-btn">
                    Signup
                </button>
            </div>
        </nav>
    )
}