import NavBar from "./components/NavBar/NavBar"
import {BrowserRouter, Route, Routes} from 'react-router'
import Home from "./pages/Home/Home"
import Footer from "./components/Footer/Footer"
function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}
