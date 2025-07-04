//import { useEffect , useState } from "react";
//import axios from "axios";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ComingSoon from "./pages/ComingSoon";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Checkout from './pages/Checkout';
import Overview from './pages/Overview';
import Subscription from './pages/Subscription';
import Unsubscribe from './pages/Unsubscribe';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/Landing';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/coming-soon" replace />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
