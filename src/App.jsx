import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import TourList from "./pages/TourList.jsx";
import Login from './pages/Login.jsx';
import TourDetails from './pages/TourDetails.jsx';
import Booking from './pages/Booking.jsx';

function App() {
  const images = [
    "https://tourxuyenviet.s3.amazonaws.com/610-Vi-the-du-lich-Viet-Nam-da-thuc-su-thay-doi.jpg",
    "https://tourxuyenviet.s3.amazonaws.com/anhdepphuyen29-4137.jpg",
    "https://tourxuyenviet.s3.amazonaws.com/cu-lao-thoi-son-du-lich-viet.jpg",
    "https://tourxuyenviet.s3.amazonaws.com/phu-yen-02-min-8918.jpg",
    "https://tourxuyenviet.s3.amazonaws.com/tf_240925031851_167685_Bana+Hill+(2).jpg",
  ]
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tour-details/:id" element={<TourDetails/>} />
      <Route path="/login-register" element={<Login />} />
      <Route path="/tour-list" element={<TourList />} />
      <Route path="/booking" element={<Booking />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App