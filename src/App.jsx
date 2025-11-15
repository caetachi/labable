import NavBar from "./components/NavBar/NavBar"
import {BrowserRouter, Route, Routes, useLocation} from 'react-router'
import Home from "./pages/Home/Home"
import AboutUs from "./pages/About Us/AboutUs"
import Footer from "./components/Footer/Footer"
import Login from "./pages/Login/Login"
import CreateOrder from "./pages/Order Create/OrderCreate"
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
import Example from "./scripts/Example"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { get, ref } from "firebase/database"
import { auth, db } from "./firebase"
import { toast } from "react-toastify"
import ToastWrapper from "./components/Toast/ToastWrapper"
import AdminDashboard from "./pages/Dashboard/AdminDashboard"
import CustomerDashboard from "./pages/Dashboard/CustomerDashboard"
import OrderView from "./pages/Order View/OrderView"
import CreateCustomer from "./pages/Management Create/CreateCustomer"
import CreateInventory from "./pages/Management Create/CreateInventory"
import CreateService from "./pages/Management Create/CreateService"
import CreateWashable from "./pages/Management Create/CreateWashable"
import CreateSchedule from "./pages/Management Create/CreateSchedule"
import ForgotPassword from "./pages/Login/ForgotPassword"
import TermsConditions from "./pages/Terms and Conditions/TermsConditions"

export default function App() {
  const [user, setUser] = useState();
  const [userData, setUserData] = useState({});
  const [hasAddress, setHasAddress] = useState(false);

  useEffect(()=>{
    onAuthStateChanged(auth, (currentUser)=>{
      setUser(currentUser);
      if(currentUser){
          get(ref(db, `users/${currentUser.uid}`)).then((snapshot)=>{
          if(snapshot.exists()){
            setUserData(snapshot.val());
          }
        })
      }else{
        setUserData({});
      }
    })
  },[user])

  useEffect(()=>{
    const message = localStorage.getItem("toastMessage");
    const type = localStorage.getItem("toastType");
    if(message){
      console.log("Showing toast:", type, message);
      setTimeout(() => {
        toast[type] ? toast[type](message) : toast(message);
      }, 100);
      localStorage.removeItem("toastMessage");
      localStorage.removeItem("toastType");
    }
  },[])

  useEffect(()=>{
    if(userData && user){
      async function checkAddress() {
        const hasAddressBool = await get(ref(db, `users/${user.uid}/address`));
        setHasAddress(hasAddressBool.exists());
      }
      checkAddress();
    }
  }, [userData])

  return (  
    <>
      <ToastWrapper />
      <BrowserRouter>
        <Layout user={user} userData={userData} />
      </BrowserRouter>
    </>
  )
}

function Layout({ user, userData }) {
  const location = useLocation();
  const noNavPaths = ['/login', '/registration', '/forgot-password'];
  const hideLayout = noNavPaths.includes(location.pathname);

  return (
    <>
      {!hideLayout && (
        userData?.role === "admin"
          ? <AdminSideBar name={userData.fullname} image_url={userData.image_url}/>
          : <NavBar name={userData.fullname} image_url={userData.image_url} hasAddress={userData.address}/>
      )}

      <Routes>
          {user? 
            <>
            {/*private  routes*/}
              <Route path="/create-order" element={<CreateOrder />} />
              <Route path="/order-summary" element={<OrderSummary />} />
              <Route path="/my-orders" element={<MyOrder />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/order/:viewId" element={<OrderView />} />
              <Route path="/:toEdit/edit/:id" element={<OrderManagementDetailsEdit />} />
              
              {userData?.role === "admin" &&(
                <>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/:viewCategory" element={<Management />} />
                  <Route path="/admin/:viewCategory/:viewId" element={<ManagementView />} />
                  <Route path="/admin/:toEdit/:id/edit" element={<OrderManagementDetailsEdit />} />
                  <Route path="admin/create-customer" element={<CreateCustomer />} />
                  <Route path="/admin/create-inventory" element={<CreateInventory />} />
                  <Route path="/admin/create-service" element={<CreateService />} />
                  <Route path="/admin/create-washable" element={<CreateWashable />} />
                  <Route path="/admin/create-schedule" element={<CreateSchedule />} />
                </>
              )}
            </>
            :
            <>
            {/*public routes*/}
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
            </>
          }
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/example" element={<Example />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}
