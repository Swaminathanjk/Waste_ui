import { useState, useEffect } from "react";
import axios from "axios";

const DisposalHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);

  // Retrieve user ID and token from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const token = localStorage.getItem("token");

  console.log("User ID retrieved:", userId);
  console.log("Auth Token:", token);

  useEffect(() => {
    if (!userId || !token) {
      setError("User authentication failed. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `https://waste-ui.onrender.com/api/user/${userId}/disposal-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const disposalData = response.data;
        console.log("API Response:", disposalData);

        if (
          disposalData?.disposalHistory &&
          Array.isArray(disposalData.disposalHistory)
        ) {
          setHistory(disposalData.disposalHistory);
          setTotalPoints(disposalData.points || 0);
        } else {
          setHistory([]);
          setError("Invalid data format received.");
        }
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Unauthorized. Please log in again."
            : "Failed to fetch disposal history. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId, token]);

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold text-center">Disposal History</h1>

      {loading ? (
        <p className="text-center mt-4">Loading disposal history...</p>
      ) : error ? (
        <p className="text-center mt-4 text-red-500">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-center mt-4 text-gray-400">
          No disposal records found.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <h2 className="text-lg font-semibold text-green-400">
            Total Points Earned: {totalPoints}
          </h2>
          {history.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700"
            >
              <h2 className="text-lg font-semibold">{item.wasteName}</h2>
              <p className="text-gray-300">Category: {item.category}</p>
              <p className="text-gray-300">
                Disposal Method: {item.disposalMethod}
              </p>
              <p className="text-gray-400 text-sm">
                Disposed on: {new Date(item.disposedAt).toLocaleString()}
              </p>
              <p className="text-yellow-400 text-sm">
                Points Earned: {item.pointsEarned}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisposalHistory;
