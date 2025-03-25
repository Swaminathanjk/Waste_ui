import { useEffect, useState } from "react";
import axios from "axios";
import WastePopup from "../components/WastePopup";
import { useNavigate } from "react-router-dom";

const WasteDetection = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/waste-items");
        setWasteItems(response.data);
      } catch (error) {
        console.error("Error fetching waste data:", error);
      }
    };

    fetchWasteData();
  }, []);

  const handleDispose = (wasteItem) => {
    navigate(`/waste-details/${wasteItem.name.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Detected Waste Items</h1>
      <div className="grid grid-cols-2 gap-4">
        {wasteItems.map((waste) => (
          <button
            key={waste._id}
            className="p-4 border rounded shadow-md bg-white hover:bg-gray-100"
            onClick={() => setSelectedWaste(waste)}
          >
            {waste.name}
          </button>
        ))}
      </div>

      {selectedWaste && (
        <WastePopup
          wasteItem={selectedWaste}
          onClose={() => setSelectedWaste(null)}
          onDispose={handleDispose}
        />
      )}
    </div>
  );
};

export default WasteDetection;
