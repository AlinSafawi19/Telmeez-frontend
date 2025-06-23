//import { useEffect , useState } from "react";
//import axios from "axios";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ComingSoon from "./components/ComingSoon";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Overview from "./pages/demo-dashboard/subscriber/Overview";
import IncidentReports from "./pages/demo-dashboard/subscriber/IncidentReports";
import Messages from './pages/demo-dashboard/subscriber/Messages';
import Announcements from './pages/demo-dashboard/subscriber/Announcements';
import Admins from "./pages/demo-dashboard/subscriber/Admins";
import Notifications from "./pages/demo-dashboard/subscriber/Notifications";
import Events from "./pages/demo-dashboard/subscriber/Events";
import Analytics from "./pages/demo-dashboard/subscriber/Analytics";
import Settings from "./pages/demo-dashboard/subscriber/Settings";
import Billings from "./pages/demo-dashboard/subscriber/Billings";
import Account from "./pages/demo-dashboard/subscriber/Account";
import Documents from "./pages/demo-dashboard/subscriber/Documents";
import AuditLogs from "./pages/demo-dashboard/subscriber/AuditLogs";
import About from './pages/demo-dashboard/subscriber/About';
import SchoolAdminDashboard from "./pages/demo-dashboard/SchoolAdminDashboard";
import TeacherDashboard from "./pages/demo-dashboard/TeacherDashboard";
import StudentDashboard from "./pages/demo-dashboard/StudentDashboard";
import ParentDashboard from "./pages/demo-dashboard/ParentDashboard";
import Checkout from './components/Checkout';
import { LanguageProvider } from './contexts/LanguageContext';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import { UserProvider } from './contexts/UserContext';
import Landing from './components/Landing';

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
        <UserProvider>
          <Router>
            {/* <div className="text-xl font-medium text-green-600">
                        API says: {apiMessage}
                      </div> */}
            <Routes>
              <Route path="/" element={<Navigate to="/coming-soon" replace />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/demo-dashboard/subscriber/overview" element={<Overview />} />
              <Route path="/demo-dashboard/subscriber/admins" element={<Admins />} />
              <Route path="/demo-dashboard/subscriber/incident-reports" element={<IncidentReports />} />
              <Route path="/demo-dashboard/subscriber/messages" element={<Messages />} />
              <Route path="/demo-dashboard/subscriber/announcements" element={<Announcements />} />
              <Route path="/demo-dashboard/subscriber/notifications" element={<Notifications />} />
              <Route path="/demo-dashboard/subscriber/events" element={<Events />} />
              <Route path="/demo-dashboard/subscriber/analytics" element={<Analytics />} />
              <Route path="/demo-dashboard/subscriber/settings" element={<Settings />} />
              <Route path="/demo-dashboard/subscriber/billing" element={<Billings />} />
              <Route path="/demo-dashboard/subscriber/account" element={<Account />} />
              <Route path="/demo-dashboard/subscriber/documents" element={<Documents />} />
              <Route path="/demo-dashboard/subscriber/audit-logs" element={<AuditLogs />} />
              <Route path="/demo-dashboard/subscriber/about" element={<About />} />
              <Route path="/demo-dashboard/admin" element={<SchoolAdminDashboard />} />
              <Route path="/demo-dashboard/teacher" element={<TeacherDashboard />} />
              <Route path="/demo-dashboard/student" element={<StudentDashboard />} />
              <Route path="/demo-dashboard/parent" element={<ParentDashboard />} />
            </Routes>
          </Router>
        </UserProvider>
      </LanguageProvider>
    </CookieConsentProvider>
  );
};

export default App;
