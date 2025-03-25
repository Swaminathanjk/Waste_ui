import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "https://waste-ui.onrender.com/api/user/alluser",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token]);

  if (!token) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
        <p className="text-gray-600 mt-4">Login to participate!</p>
        <Link
          to="/auth"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Leaderboard
      </h1>
      {users.length > 0 ? (
        <ul className="mt-4">
          {users.map((user, index) => (
            <li key={index} className="flex justify-between py-2 border-b">
              <span className="font-semibold">
                {index + 1}. {user.name}
              </span>
              <span className="text-blue-600 font-bold">{user.points} pts</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-4">No users found.</p>
      )}
    </div>
  );
};

export default Leaderboard;
