import NavBar from "./components/NavBar/NavBar"
import {BrowserRouter, Route, Routes} from 'react-router'
import Home from "./pages/Home/Home"
import AboutUs from "./pages/About Us/AboutUs"
import Footer from "./components/Footer/Footer"
import AdminDashboard from "./pages/Admin Dashboard/AdminDashboard"
import Login from "./pages/Login/Login"
import CreateOrder from "./pages/Create Order/CreateOrder"
import MyOrder from "./pages/My Orders/MyOrder"
import Profile from "./pages/Profile/Profile"
import Registration from "./pages/Registration/Registration"
import UserDashboard from "./pages/User Dashboard/UserDashboard"
import NotFound from "./pages/Not Found/NotFound"
export default function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about-us" element={<AboutUs/>}/>
          <Route path="/create-order" element={<CreateOrder/>}/>
          <Route path="/my-orders" element={<MyOrder/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/registration" element={<Registration/>}/>
          <Route path="/user-dashboard" element={<UserDashboard/>}/>
          <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}
