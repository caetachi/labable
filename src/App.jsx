import { BrowserRouter } from 'react-router'
import './App.css'
import Navbar from './components/Navbar/Navbar'


export default function App() {
  return (  
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  )
}
