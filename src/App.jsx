import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import TourList from "./pages/TourList.jsx";
import Login from './pages/Login.jsx';
import TourDetails from './pages/TourDetails.jsx';
import Booking from './pages/Booking.jsx';
import AddTour from './pages/AddTour.jsx';
import PageTestComponent from './pages/PageTestComponent.jsx';
import BookingList from './pages/BookingList.jsx';
import AddDestination from './pages/AddDestination.jsx';
import UserInfo from './pages/UserInfo.jsx';
import AccountPage from './pages/AccountPage.jsx';
import DiscountPage from './pages/DiscountPage.jsx';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tour-details/:id" element={<TourDetails/>} />
      <Route path="/login-register" element={<Login />} />
      <Route path="/tour-list" element={<TourList />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/add-tour" element={<AddTour />} />
      <Route path="/booking-list" element={<BookingList />} />
      <Route path="/test" element={<PageTestComponent />} />
      <Route path="/add-destination" element={<AddDestination />}/>
      <Route path="/user-detail" element={<UserInfo />}/>
       <Route path="/account-list" element={<AccountPage />}/>
        <Route path="/discount-list" element={<DiscountPage />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App