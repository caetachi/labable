import NavBar from "./components/NavBar/NavBar"
import {BrowserRouter, Route, Routes} from 'react-router'
import Home from "./pages/Home/Home"
import AboutUs from "./pages/About Us/AboutUs"
import Footer from "./components/Footer/Footer"
import Login from "./pages/Login/Login"
import CreateOrder from "./pages/Create Order/CreateOrder"
import MyOrder from "./pages/My Orders/MyOrder"
import Profile from "./pages/Profile/Profile"
import Registration from "./pages/Registration/Registration"
import NotFound from "./pages/Not Found/NotFound"
import OrderSummary from "./pages/Order Summary/OrderSummary"
import Contact from './pages/Contact/Contact'
import Dashboard from "./pages/Dashboard/Dashboard"
import AdminSideBar from "./components/Admin SideBar/AdminSideBar"
import OrderManagementDetailsEdit from "./pages/Order Management Details Edit/OrderManagementDetailsEdit"
import ManagementView from "./pages/Management View/ManagementView"
export default function App() {

  const user = { name: "Jerson Valdez", role: "user" }

  return (  
    <>
      <BrowserRouter>
          {user.role === "admin" ? <AdminSideBar /> : <NavBar/>}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about-us" element={<AboutUs/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/create-order" element={<CreateOrder/>}/>
          <Route path="/order-summary" element={<OrderSummary/>}/>
          <Route path="/my-orders" element={<MyOrder/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/registration" element={<Registration/>}/>
          <Route path="/:role/dashboard" element={<Dashboard/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/admin/:viewCategory/:viewId" element={<ManagementView/>} />
          <Route path="/details-edit" element={<OrderManagementDetailsEdit/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}
