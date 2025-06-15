//import { useEffect , useState } from "react";
//import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from "./components/Landing";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import SuperAdminDashboard from "./pages/demo-dashboard/SuperAdminDashboard";
import SchoolAdminDashboard from "./pages/demo-dashboard/SchoolAdminDashboard";
import TeacherDashboard from "./pages/demo-dashboard/TeacherDashboard";
import StudentDashboard from "./pages/demo-dashboard/StudentDashboard";
import ParentDashboard from "./pages/demo-dashboard/ParentDashboard";
import { LanguageProvider } from './contexts/LanguageContext';
import { CookieConsentProvider } from './contexts/CookieConsentContext';

function App() {
  //const [apiMessage, setApiMessage] = useState("");

  /*useEffect(() => {
    axios.get("http://localhost:5000/health")
      .then((res) => setApiMessage(res.data))
      .catch((err) => console.error("API error:", err));
  }, []);*/

  return (
    <CookieConsentProvider>
      <LanguageProvider>
        <Router>
          {/* <div className="text-xl font-medium text-green-600">
            API says: {apiMessage}
          </div> */}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/demo-dashboard/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/demo-dashboard/admin" element={<SchoolAdminDashboard />} />
            <Route path="/demo-dashboard/teacher" element={<TeacherDashboard />} />
            <Route path="/demo-dashboard/student" element={<StudentDashboard />} />
            <Route path="/demo-dashboard/parent" element={<ParentDashboard />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </CookieConsentProvider>
  );
}

export default App;
