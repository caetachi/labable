import './admin-side-bar.css'
import logo from '../../assets/labable-black.svg'
import { NavLink, useNavigate } from 'react-router'
import { useState, useEffect } from 'react';
import { auth } from '../../firebase.js';
import Swal from 'sweetalert2';
import { getAdminNotifications } from '../../scripts/get.js';
import Notification from '../Notification/Notification';
import { formatTextualDate } from '../../scripts/dateformat.js';
import { deleteAdminNotification, truncateAdminNotification } from '../../scripts/delete.js';

function AdminSideBar({image_url, name}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  function sidebarFunc() {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }

  const [imageUrl, setImageUrl] = useState();
  
      useEffect(() => {
        if (image_url) {
          setImageUrl(image_url);
        } else if (name) {
          setImageUrl(`https://avatar.iran.liara.run/username?username=${name}&background=random`);
        }
      }, [image_url, name]);

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
          await deleteAdminNotification(id);
          let newNotifications = notifications.filter(notification => notification.id !== id);
          setNotifications(newNotifications);
      }

      async function clearAllNotifications() {
          await truncateAdminNotification();
          setNotifications([]);
      }

  useEffect(() => {
    async function getNotifications() {
      const notifications = await getAdminNotifications();
      const unreadNotifications = [];
      notifications
        .sort((a, b) => new Date(b[1].created_at) - new Date(a[1].created_at))
        .forEach(notification => {
          const notif = {
            id: notification[0],
            title: notification[1].title,
            message: notification[1].message,
            created_at: formatTextualDate(notification[1].created_at),
            status: notification[1].status
          }

          unreadNotifications.push(notif);
        });

      setNotifications(unreadNotifications);
    }
    getNotifications();
  }, []);

  return (
    <>
      <nav className={`admin-sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-links">
          <div className="admin-sidebar-navigation-links">
            <NavLink className="admin-sidebar-link" 
              to={"/admin/dashboard"}>
              <i className="hgi hgi-stroke hgi-dashboard-square-02"></i>
              <p>Dashboard</p>
            </NavLink>
            <NavLink className="admin-sidebar-link"
              to={"/admin/order"}>
              <i className="hgi hgi-stroke hgi-check-list"></i>
              <p>Orders</p>
            </NavLink>
            <NavLink className="admin-sidebar-link"
              to={"/admin/schedule"}>
              <i className="hgi hgi-stroke hgi-calendar-03"></i>
              <p>Schedules</p>
            </NavLink>
            <NavLink className="admin-sidebar-link"
              to={"/admin/customer"}>
              <i className="hgi hgi-stroke hgi-user-multiple-02"></i>
              <p>Customers</p>
            </NavLink>
            <NavLink className="admin-sidebar-link"
              to={"/admin/inventory"}>
              <i className="hgi hgi-stroke hgi-package"></i>
              <p>Inventory</p>
            </NavLink>
            <NavLink className="admin-sidebar-link"
              to={"/admin/service"}>
              <i className="hgi hgi-stroke hgi-service"></i>
              <p>Services</p>
            </NavLink>
            <NavLink className="admin-sidebar-link"
              to={"/admin/washable"}>
              <i className="hgi hgi-stroke hgi-t-shirt"></i>
              <p>Washable</p>
            </NavLink>
          </div>
        </div>
        <div className="admin-sidebar-logout">
          <button onClick={logout}>
            <i className="hgi hgi-stroke hgi-logout-01"></i>
            <p>Logout</p>
          </button>
        </div>
      </nav>

      <div className="admin-sidebar-header">
        <div className="admin-sidebar-logo-menu">
          <button onClick={sidebarFunc} className="admin-sidebar-menu-open-button">
            <i className="fa-solid fa-bars"></i>
          </button>
          <div className="logo" onClick={() => navigate('/  ')}>
            <img src={logo} alt="Labable" />
            <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
          </div>
        </div>
        <div className="admin-profile">
          <div className="notification">
            <button className="notification-btn" onClick={toggleFloatingNotification}>
              <i className={notifications?.length > 0 ? "ti ti-bell-ringing-filled" : "ti ti-bell"}></i>
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
                            notifications.length > 1 && idx !== notifications.length - 1 && (
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

          {name && imageUrl &&
            <div className="admin-profile-info">
              <img src={imageUrl} alt="" />
              <h3>{name}</h3>
            </div>}
        </div>
      </div>
    </>
  );
}

export default AdminSideBar;