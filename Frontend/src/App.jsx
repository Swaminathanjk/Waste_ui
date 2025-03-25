import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import WasteDetails from "./pages/WasteDetails";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Scan from "./pages/Scan";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="flex flex-col pt-16 pb-12 min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/waste-details/:wasteName"
              element={<WasteDetails />}
            />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/scan" element={<Scan />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
