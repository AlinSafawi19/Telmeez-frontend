//import { useEffect , useState } from "react";
//import axios from "axios";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ComingSoon from "./pages/ComingSoon";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import { LanguageProvider } from './contexts/LanguageContext';
import Landing from './pages/Landing';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/coming-soon" replace />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
