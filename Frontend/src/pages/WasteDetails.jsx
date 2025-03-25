import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Toast notification

const WasteDetails = () => {
  const { wasteName } = useParams();
  const [waste, setWaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWasteDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/waste/waste-items/${wasteName}`
        );
        setWaste(response.data);
      } catch (error) {
        console.error("Error fetching waste details:", error);
        toast.error("Failed to load waste details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWasteDetails();
  }, [wasteName]);

  const handleDispose = async () => {
    if (!waste) return;

    try {
      await axios.post(
        "http://localhost:5000/api/disposal",
        { userId: localStorage.getItem("userId"), wasteName: waste.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Waste disposed successfully!");
    } catch (error) {
      console.error("Error disposing waste:", error);
      toast.error("Failed to dispose waste.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!waste)
    return <p className="text-center text-red-500">Waste item not found!</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">{waste.name}</h1>
      <p className="text-gray-600">
        Category: <span className="font-semibold">{waste.category}</span>
      </p>
      <h3 className="mt-4 font-bold text-gray-700">Disposal Method:</h3>
      <p className="text-gray-700">{waste.disposal}</p>
      <p className="text-gray-700">{waste.points}</p>
      <button
        onClick={handleDispose}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg shadow-md"
      >
        Dispose
      </button>
    </div>
  );
};

export default WasteDetails;
