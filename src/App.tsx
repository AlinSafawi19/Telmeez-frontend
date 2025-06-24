//import { useEffect , useState } from "react";
//import axios from "axios";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ComingSoon from "./components/ComingSoon";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Checkout from './components/Checkout';
import { LanguageProvider } from './contexts/LanguageContext';
import Landing from './components/Landing';
import Landing2 from './pages/Landing2';

const App: React.FC = () => {
  //const [apiMessage, setApiMessage] = useState("");

  /*useEffect(() => {
    axios.get("http://localhost:5000/health")
      .then((res) => setApiMessage(res.data))
      .catch((err) => console.error("API error:", err));
  }, []);*/

  return (
    <LanguageProvider>
      <Router>
        {/* <div className="text-xl font-medium text-green-600">
                        API says: {apiMessage}
                      </div> */}
        <Routes>
          <Route path="/" element={<Navigate to="/coming-soon" replace />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/landing2" element={<Landing2 />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
