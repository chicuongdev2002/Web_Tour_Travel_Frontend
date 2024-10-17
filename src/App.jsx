import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import LoginRegister from "./components/login_register/LoginRegister.jsx";
import TourList from "./pages/TourList.jsx";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<TourList />} />
      <Route path="/login-register" element={<LoginRegister />} />
      {/* <Route path="/app" element={<App />} /> */}
        <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App