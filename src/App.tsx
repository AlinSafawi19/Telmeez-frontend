//import { useEffect , useState } from "react";
//import axios from "axios";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComingSoon from "./components/ComingSoon";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import SuperAdminDashboard from "./pages/demo-dashboard/SuperAdminDashboard";
import SchoolAdminDashboard from "./pages/demo-dashboard/SchoolAdminDashboard";
import TeacherDashboard from "./pages/demo-dashboard/TeacherDashboard";
import StudentDashboard from "./pages/demo-dashboard/StudentDashboard";
import ParentDashboard from "./pages/demo-dashboard/ParentDashboard";
import Checkout from './components/Checkout';
import { LanguageProvider } from './contexts/LanguageContext';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import Landing from './components/Landing';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { MessagesProvider } from './contexts/MessagesContext';

const App: React.FC = () => {
  //const [apiMessage, setApiMessage] = useState("");

  /*useEffect(() => {
    axios.get("http://localhost:5000/health")
      .then((res) => setApiMessage(res.data))
      .catch((err) => console.error("API error:", err));
  }, []);*/

  return (
    <CookieConsentProvider>
      <LanguageProvider>
        <NotificationsProvider>
          <MessagesProvider>
            <Router>
              {/* <div className="text-xl font-medium text-green-600">
                API says: {apiMessage}
              </div> */}
              <Routes>
                <Route path="/" element={<ComingSoon />} />
                <Route path="/home" element={<Landing />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/demo-dashboard/super-admin" element={<SuperAdminDashboard />} />
                <Route path="/demo-dashboard/admin" element={<SchoolAdminDashboard />} />
                <Route path="/demo-dashboard/teacher" element={<TeacherDashboard />} />
                <Route path="/demo-dashboard/student" element={<StudentDashboard />} />
                <Route path="/demo-dashboard/parent" element={<ParentDashboard />} />
              </Routes>
            </Router>
          </MessagesProvider>
        </NotificationsProvider>
      </LanguageProvider>
    </CookieConsentProvider>
  );
};

export default App;
