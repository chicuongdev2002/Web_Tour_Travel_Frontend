import "./App.css";
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
import UpdateTour from './pages/UpdateTour.jsx';
import UserInfo from "./pages/UserInfo.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import DiscountPage from "./pages/DiscountPage.jsx";
import CustomerPage from "./pages/CustomerPage.jsx";
import TourGuidePage from "./pages/TourGuidePage.jsx";
import TourGuideManagerPage from "./pages/TourGuideManagerPage.jsx";
import AssignmentPage from "./pages/AssignmentPage.jsx";
import AdminDashboard from './components/admin/AdminDashboard.jsx';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tour-details/:id" element={<TourDetails/>} />
      <Route path="/login-register" element={<Login />} />
      <Route path="/tour-list" element={<TourList />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/user-detail" element={<UserInfo />} />
      <Route path="/tour-guide-details" element={<TourGuidePage />} />
      {/* <Route element={<AdminDashboard />}> */}
      {/* <Route path="/add-tour" element={<AddTour />} />
      <Route path="/update-tour/:id" element={<UpdateTour />} />
      <Route path="/booking-list" element={<BookingList />} />
      <Route path="/test" element={<PageTestComponent />} />
      <Route path="/add-destination" element={<AddDestination />}/>
        <Route path="/account-list" element={<AccountPage />} />
        <Route path="/discount-list" element={<DiscountPage />} />
        <Route path="/customer-list" element={<CustomerPage />} />
       
        <Route path="/tour-guide-manager" element={<TourGuideManagerPage />} />
        <Route path="/list-assignment" element={<AssignmentPage />} /> */}
         <Route path="/admin/*" element={<AdminDashboard />} />
        {/* </Route> */}
    </Routes>
  </BrowserRouter>
  )
}

export default App;
