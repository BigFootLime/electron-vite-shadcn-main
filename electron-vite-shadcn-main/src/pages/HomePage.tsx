import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login/Login";
import Loading from "./loading/Loading";
import Sidebar from "./dashboard/Sidebar";
import PasswordResetRequest from "./login/PasswordResetRequest";
import PasswordReset from "./login/ResetPassword";
import { Greeting } from "./dashboard/Greeting";
import DevisLandingPage from "./devis/devisLandingPage";

const HomePage: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Loading />} />
                <Route path="/login" element={<Login />} />
                <Route path="/greeting" element={<Greeting />} />
                <Route path="/dashboard" element={<Sidebar />} />
                <Route path="/devis" element={<DevisLandingPage />} />
                <Route path="/request-password-reset" element={<PasswordResetRequest />} />
                <Route path="/reset-password" element={<PasswordReset />} />
            </Routes>
        </Router>
    );
};

export default HomePage;
