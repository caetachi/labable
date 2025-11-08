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
import Dashboard from "./pages/Dashboard/Dashboard"
import AdminSideBar from "./components/Admin SideBar/AdminSideBar"
import OrderManagementDetailsEdit from "./pages/Order Management Details Edit/OrderManagementDetailsEdit"
import Management from "./pages/Management/Management"
import ManagementView from "./pages/Management View/ManagementView"
import Toast from "./components/Toast/Toast"
import Example from "./scripts/Example"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { get, ref } from "firebase/database"
import { auth, db } from "./firebase"

export default function App() {

  const [user, setUser] = useState();
  const [userData, setUserData] = useState({});

  useEffect(()=>{
    onAuthStateChanged(auth, (currentUser)=>{
      setUser(currentUser);
      get(ref(db, `users/${currentUser.uid}`)).then((snapshot)=>{
        if(snapshot.exists()){
          setUserData(snapshot.val());
        }
      })
    })
  },[])

  return (  
    <>
      <Toast />
      <BrowserRouter>
          {userData?.role === "admin" ? 
            <AdminSideBar /> 
            : 
            <NavBar name={userData.fullname} image_url={userData.image_url}/>
          }
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about-us" element={<AboutUs/>}/>
          <Route path="/create-order" element={<CreateOrder/>}/>
          <Route path="/order-summary" element={<OrderSummary/>}/>
          <Route path="/my-orders" element={<MyOrder/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/registration" element={<Registration/>}/>
          <Route path="/:role/dashboard" element={<Dashboard/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/admin/:viewCategory" element={<Management/>} />
          <Route path="/admin/:viewCategory/:viewId" element={<ManagementView/>} />
          <Route path="/details-edit" element={<OrderManagementDetailsEdit/>}/>
          <Route path="*" element={<NotFound/>}/>
          <Route path="/example" element={<Example/>}/>
          
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}
