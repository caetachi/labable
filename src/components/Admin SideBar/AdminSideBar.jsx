import './admin-side-bar.css'
import logo from '../../assets/labable-black.svg'
import { NavLink } from 'react-router'
import { useState } from 'react';

function AdminSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  function sidebarFunc() {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }
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
          <button>
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
          <img src={logo} alt="Labable" />
          <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
        </div>
        <div className="admin-profile">
          <i className="fa-regular fa-bell"></i>
          <div className="admin-profile-info">
            <img src={logo} alt="" />
            <h3>Jerson valdez</h3>
            <i className="ti ti-caret-down"></i>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminSideBar;