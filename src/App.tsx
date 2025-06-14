//import { useEffect , useState } from "react";
//import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from "./components/Landing";
import SignIn from "./pages/SignIn";

function App() {
  //const [apiMessage, setApiMessage] = useState("");

  /*useEffect(() => {
    axios.get("http://localhost:5000/health")
      .then((res) => setApiMessage(res.data))
      .catch((err) => console.error("API error:", err));
  }, []);*/

  return (
    <Router>
       {/* <div className="text-xl font-medium text-green-600">
        API says: {apiMessage}
      </div> */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
