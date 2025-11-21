import { NavLink } from 'react-router'
import labableLogo from '../../assets/labable-black.svg'
import { HashLink } from 'react-router-hash-link';
import './nav-bar.css'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { auth, db } from '../../firebase.js';
import { ref, onValue } from 'firebase/database';
import Notification from '../Notification/Notification';
import { formatTextualDate } from '../../scripts/dateformat.js';
import { deleteUserNotification, truncateUserNotification } from '../../scripts/delete.js';

export default function NavBar({userid, image_url, name, hasAddress}) {
    const [imageUrl, setImageUrl] = useState();
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
      if (image_url) {
        setImageUrl(image_url);
      } else if (name) {
        setImageUrl(`https://avatar.iran.liara.run/username?username=${name}&background=000000&color=FFFFFF&bold=true`);
      }
    }, [image_url, name]);

    function toggleFloatingNav(){
        const floatingNav = document.querySelector('.floating-nav-container');
        floatingNav.classList.toggle('open');
    }

    function toggleFloatingNotification(){
        const floatingNav = document.querySelector('.floating-notification-container');
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

    async function clearNotifications(id) {
        if (userid) {
            await deleteUserNotification(userid, id);
            let newNotifications = notifications.filter(notification => notification.id !== id);
            setNotifications(newNotifications);
        }
    }

    async function clearAllNotifications() {
        if (userid) {
            await truncateUserNotification(userid);
            setNotifications([]);
        }
    }

  useEffect(() => {
    if (!userid) return;

    const notificationsRef = ref(db, `users/${userid}/notifications`);

    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setNotifications([]);
        return;
      }

      const entries = Object.entries(data);
      const formattedNotifications = [];

      entries
        .sort((a, b) => new Date(b[1].created_at) - new Date(a[1].created_at))
        .forEach(([id, value]) => {
          const notif = {
            id,
            title: value.title,
            message: value.message,
            created_at: formatTextualDate(value.created_at),
          };

          formattedNotifications.push(notif);
        });

      setNotifications(formattedNotifications);


    });

    return () => unsubscribe();
  }, [userid]);

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
                    {name && hasAddress ? 
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
                
                <div className="profile">
                {
                    name ?
                    <div className="notification">
                        <button className="notification-btn" onClick={toggleFloatingNotification}>
                        <i className={notifications?.length > 0 ? "ti ti-bell-ringing" : "ti ti-bell"}></i>
                        </button>
                        <div className="floating-notification-container">
                            {
                                notifications?.length > 0 && (
                                <p className="clear-notification" onClick={clearAllNotifications}>Clear notification</p>
                                )
                            }

                            <div className="notification-container">
                                {
                                    notifications?.length > 0 ? (
                                        notifications.map((notification, idx) => (
                                        <>
                                            <Notification
                                                key={idx}
                                                title={notification.title}
                                                message={notification.message}
                                                createdAt={notification.created_at}
                                                clear={async () => await clearNotifications(notification.id)}
                                            />
                                            {
                                            idx !== notifications.length - 1 && (
                                                <hr />
                                            )
                                            }
                                        </>
                                        ))
                                    ) : (
                                        <p className="notification-message">All notifications are read</p>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                : null
                }
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
                </div>
            </nav>
        </>
    )
}