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
import UpdateTour from "./pages/UpdateTour.jsx";
import NotifyPage from "./pages/NotifyPage.jsx";
import { useSelector, useDispatch } from "react-redux";
import { changeConnectSocket } from "../src/redux/slice";
import { initSocket, handleDoWithSocket } from "../src/functions/initSocket";
import AdminDashboard from "./components/admin/AdminDashboard";
import TourProviderDetail from "./components/provider/TourProviderDetail.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import FavoriteTourPage from "./pages/FavoriteTourPage.jsx";
import CheckInAppPage from "./pages/CheckInAppPage.jsx";
import { savePayment } from "../src/redux/slice";
import Payment from "./pages/Payment.jsx";
import ScheduleTourPage from "./pages/ScheduleTourPage.jsx";
import BookingDetailUser from "./components/booking/BookingDetailUser.jsx";
import TopTours from "./components/tour/TopTours.jsx";
import ScheduleTourGuidePage from "./pages/ScheduleTourGuidePage.jsx";
import TourGuideAssignmentPage from "./pages/TourGuideAssignmentPage.jsx";
import UserInfoPage from "./pages/UserInfoPage.jsx";
import ProtectedRoute from "./route/ProtectedRoute.jsx"
import TourProviderManagerPage from "./pages/TourProviderManagerPage.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CookieConsentBanner from "./components/cookie/CookieConsentBanner.jsx";
function App() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const dispatch = useDispatch();
  // handle do with socket
  const socket = useSelector((state) => state.socket);
  // check socket connected
  const connectSocket = useSelector((state) => state.initSocket);

  useEffect(() => {
    if (initSocket(connectSocket, handlePayment))
      dispatch(changeConnectSocket(true));
  }, [user, connectSocket]);

  useEffect(() => {
    handleDoWithSocket(socket);
  }, [socket]);

  const handlePayment = (message) => {
    dispatch(savePayment(message));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tour-details/:id" element={<TourDetails />} />
        <Route path="/login-register" element={<Login />} />
        <Route path="/tour-list" element={<TourList />} />
        <Route path="/booking" element={<Booking />} />
        <Route
          path="/add-tour"
          element={
            <ProtectedRoute allowedRoles={["TOURPROVIDER","ADMIN"]}>
              <AddTour />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-tour/:id"
          element={
            <ProtectedRoute allowedRoles={["TOURPROVIDER","ADMIN"]}>
              <UpdateTour />
            </ProtectedRoute>
          }
        />
        <Route path="/booking-list" element={<BookingList />} />
        <Route path="/test" element={<PageTestComponent />} />
         <Route
          path="/user-detail"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "TOURGUIDE", "TOURPROVIDER","CUSTOMER","CUSTOMERVIP"]}>
              <UserInfoPage />
            </ProtectedRoute>
          }
        />
          <Route
          path="/provider-detail"
          element={
            <ProtectedRoute allowedRoles={["TOURPROVIDER",]}>
              <TourProviderDetail />
            </ProtectedRoute>
          }
        />
           <Route
          path="/provider-manager"
          element={
            <ProtectedRoute allowedRoles={["TOURPROVIDER",]}>
              <TourProviderManagerPage />
            </ProtectedRoute>
          }
        />
             <Route
          path="/tour-guide-assiment"
          element={
            <ProtectedRoute allowedRoles={["TOURGUIDE"]}>
              <TourGuideAssignmentPage />
            </ProtectedRoute>
          }
        />
        <Route path="/search-page" element={<SearchPage />} />
        <Route
          path="/favorite-tour"
          element={
         <ProtectedRoute allowedRoles={["ADMIN", "TOURGUIDE", "TOURPROVIDER","CUSTOMER","CUSTOMERVIP"]}>
              <FavoriteTourPage />
            </ProtectedRoute>
          }
        />
        <Route 
        path="/checkin" 
        element={
        <ProtectedRoute allowedRoles={["TOURGUIDE"]}>
        <CheckInAppPage />
       </ProtectedRoute>
        } />
        <Route path="/schedule-tour-booking" element={<ScheduleTourPage />} /> 
        <Route 
        path="/booking-detail-user" 
        element={
 <ProtectedRoute allowedRoles={["ADMIN", "TOURGUIDE", "TOURPROVIDER","CUSTOMER","CUSTOMERVIP"]}>
        <BookingDetailUser/>
</ProtectedRoute>
        } 
        />
      
         <Route
          path="/schedule-tour-guide"
          element={
            <ProtectedRoute allowedRoles={["TOURGUIDE"]}>
              <ScheduleTourGuidePage />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/add-destination" element={<AddDestination />} />
        <Route path="/tour-guide-manager" element={<TourGuideManagerPage />} />
        <Route path="/account-list" element={<AccountPage />} />
        <Route path="/discount-list" element={<DiscountPage />} />
        <Route path="/customer-list" element={<CustomerPage />} />
        <Route path="/list-assignment" element={<AssignmentPage />} /> */}
        {/* <Route path="/admin" element={<AdminPage />} /> */}
          <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/notify" element={<NotifyPage />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
      <ToastContainer />
      <CookieConsentBanner />
    </BrowserRouter>
  );
}

export default App;
