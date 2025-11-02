import './admin-side-bar.css'
import logo from '../../assets/labable-black.svg'
import { NavLink } from 'react-router'

function AdminSideBar() {
  return (
    <nav className='admin-sidebar-container'>
      <div className="admin-sidebar-logo-links">
        <img src={logo} alt="Labable" />
        <div className="admin-sidebar-navigation-links">
          <NavLink className="admin-sidebar-link">
            <i class="hgi hgi-stroke hgi-dashboard-square-02"></i>
            <p>Dashboard</p>
          </NavLink>
          <NavLink className="admin-sidebar-link">
            <i class="hgi hgi-stroke hgi-check-list"></i>
            <p>Orders</p>
          </NavLink>
          <NavLink className="admin-sidebar-link">
            <i class="hgi hgi-stroke hgi-calendar-03"></i>
            <p>Schedules</p>
          </NavLink>
          <NavLink className="admin-sidebar-link">
            <i class="hgi hgi-stroke hgi-user-multiple-02"></i>
            <p>Customers</p>
          </NavLink>
          <NavLink className="admin-sidebar-link">
            <i class="hgi hgi-stroke hgi-package"></i>
            <p>Inventory</p>
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
  );
}
export default AdminSideBar;