import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import LoginRegister from "./components/login_register/LoginRegister.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
const YOUR_GOOGLE_CLIENT_ID =
  "555967163291-m30k2gvanulcs3k5l13bc73i1k58tbmb.apps.googleusercontent.com";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={YOUR_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login-register" element={<LoginRegister />} />
          <Route path="/app" element={<App />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);
