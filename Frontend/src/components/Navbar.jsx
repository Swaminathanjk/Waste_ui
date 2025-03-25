import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    console.log(userData);
    

    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // navigate("/auth"); // Redirect to login page
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload(); // Ensure navbar updates immediately
  };

  return (
    <nav className="bg-green-600 text-white p-4 shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Waste Sorter
        </Link>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
          <Menu size={28} />
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex space-x-6">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/leaderboard" className="hover:text-gray-300">
            Leaderboard
          </Link>
          {user ? (
            <>
              <Link to="/history" className="hover:text-gray-300">
                History
              </Link>
              <Link to="/profile" className="hover:text-gray-300">
                Hi, {user.name}
              </Link>
              <button onClick={handleLogout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/auth" className="hover:text-gray-300">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="lg:hidden flex flex-col bg-green-700 p-4 absolute w-full left-0 top-16">
          <Link to="/" className="py-2" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link
            to="/leaderboard"
            className="py-2"
            onClick={() => setIsOpen(false)}
          >
            Leaderboard
          </Link>
          {user ? (
            <>
              <Link
                to="/history"
                className="py-2"
                onClick={() => setIsOpen(false)}
              >
                History
              </Link>
              <Link
                to="/profile"
                className="py-2"
                onClick={() => setIsOpen(false)}
              >
                Hi, {user.name}
              </Link>
              <button onClick={handleLogout} className="py-2 text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="py-2"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="py-2"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
