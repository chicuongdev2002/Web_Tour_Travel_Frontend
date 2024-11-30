import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import TourList from "./pages/TourList.jsx";
import Login from "./pages/Login.jsx";
import TourDetails from "./pages/TourDetails.jsx";
import Booking from "./pages/Booking.jsx";
import AddTour from "./pages/AddTour.jsx";
import PageTestComponent from "./pages/PageTestComponent.jsx";
import BookingList from "./pages/BookingList.jsx";
import AddDestination from "./pages/AddDestination.jsx";
import UpdateTour from "./pages/UpdateTour.jsx";
import UserInfo from "./pages/UserInfo.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import DiscountPage from "./pages/DiscountPage.jsx";
import CustomerPage from "./pages/CustomerPage.jsx";
import TourGuidePage from "./pages/TourGuidePage.jsx";
import TourGuideManagerPage from "./pages/TourGuideManagerPage.jsx";
import AssignmentPage from "./pages/AssignmentPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import NotifyPage from "./pages/NotifyPage.jsx";
import { useSelector, useDispatch } from "react-redux";
import { changeConnectSocket } from "../src/redux/slice";
import { initSocket, handleDoWithSocket } from "../src/functions/initSocket";
import AdminDashboard from "./components/admin/AdminDashboard";
import TourProviderDetail from "./components/provider/TourProviderDetail.jsx";
import TourGuideAssignments from "./components/tourguide/TourGuideAssignments.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import FavoriteTourPage from "./pages/FavoriteTourPage.jsx";
import CheckInApp from "./components/checkin/CheckInApp.jsx";
import CheckInAppPage from "./pages/CheckInAppPage.jsx";
import ScheduleTourBooking from "./components/customer/schedule/ScheduleTourBooking.jsx";
import { savePayment } from "../src/redux/slice";
import Payment from './pages/Payment.jsx';
import ScheduleTourPage from "./pages/ScheduleTourPage.jsx";
import BookingDetailUser from "./components/booking/BookingDetailUser.jsx";

function App() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const dispatch = useDispatch();
  // handle do with socket
  const socket = useSelector((state) => state.socket);
  // check socket connected
  const connectSocket = useSelector((state) => state.initSocket);

  useEffect(() => {
    if(initSocket(connectSocket, handlePayment))
      dispatch(changeConnectSocket(true));
  }, [user, connectSocket]);

  useEffect(() => {
    handleDoWithSocket(socket);
  }, [socket]);

  const handlePayment = (message) => {
    dispatch(savePayment(message));
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tour-details/:id" element={<TourDetails />} />
        <Route path="/login-register" element={<Login />} />
        <Route path="/tour-list" element={<TourList />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/add-tour" element={<AddTour />} />
        <Route path="/update-tour/:id" element={<UpdateTour />} />
        <Route path="/booking-list" element={<BookingList />} />
        <Route path="/test" element={<PageTestComponent />} />
         <Route path="/user-detail" element={<UserInfo />} />
        <Route path="/provider-detail" element={<TourProviderDetail />} />
        <Route path="/tour-guide-assiment" element={<TourGuideAssignments />} />
        <Route path="/search-page" element={<SearchPage />} />
         <Route path="/favorite-tour" element={<FavoriteTourPage />} />
          <Route path="/checkin" element={<CheckInAppPage />} />
          <Route path="/schedule-tour-booking" element={<ScheduleTourPage />} />
             <Route path="/booking-detail-user" element={<BookingDetailUser />} />
        {/* <Route path="/add-destination" element={<AddDestination />} />
        <Route path="/tour-guide-manager" element={<TourGuideManagerPage />} />
        <Route path="/account-list" element={<AccountPage />} />
        <Route path="/discount-list" element={<DiscountPage />} />
        <Route path="/customer-list" element={<CustomerPage />} />
        <Route path="/list-assignment" element={<AssignmentPage />} /> */}
        {/* <Route path="/admin" element={<AdminPage />} /> */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/notify" element={<NotifyPage />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
