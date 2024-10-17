import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import LoginRegister from "./components/login_register/LoginRegister.jsx";
import TourList from "./pages/TourList.jsx";
import Login from './pages/Login.jsx';
import TourDetails from './pages/TourDetails.jsx';
import Booking from './pages/Booking.jsx';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login-register" element={<Login />} />
      {/* <Route path="/app" element={<App />} /> */}
      <Route path="/tour-list" element={<TourList />} />
      <Route path="/booking" element={<Booking />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App