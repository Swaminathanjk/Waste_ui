import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const WasteDetails = () => {
  const { wasteName } = useParams();
  const navigate = useNavigate();
  const [wasteDetails, setWasteDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWasteDetails = async () => {
      try {
        const formattedWasteName = encodeURIComponent(wasteName.toLowerCase()); // Convert to lowercase and encode
        const response = await axios.get(
          `https://waste-ui.onrender.com/api/wasteInfo/waste-items/${formattedWasteName}`
        );
        setWasteDetails(response.data);
      } catch (error) {
        console.error("Error fetching waste details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWasteDetails();
  }, [wasteName]);

  const handleDispose = async () => {
    if (!wasteDetails) {
      console.error("Error: No waste details found for disposal.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to dispose of waste.");
        return;
      }

      const response = await axios.post(
        "https://waste-ui.onrender.com/api/waste/dispose",
        { wasteName: wasteDetails.name.toLowerCase() }, // Ensure case insensitivity
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Disposal Response:", response.data);
      alert(`Successfully disposed of ${wasteDetails.name}!`);

      navigate("/home"); // Redirect after disposal
    } catch (error) {
      console.error("Disposal Error:", error.response?.data || error.message);
      alert("Failed to dispose of waste. Please try again.");
    }
  };

  if (loading) return <p>Loading waste details...</p>;
  if (!wasteDetails) return <p>Waste item not found.</p>;

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold">{wasteDetails.name}</h1>
      <p className="mt-2 text-gray-300">Category: {wasteDetails.category}</p>
      <p className="mt-2 text-gray-300">
        Disposal Method: {wasteDetails.disposal}
      </p>

      <button
        onClick={handleDispose}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Dispose
      </button>
    </div>
  );
};

export default WasteDetails;
