import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WastePopup = ({ wasteItem, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Prevent scrolling when open
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!wasteItem) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md z-50"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl w-96 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-bold text-center">{wasteItem.name}</h2>
        <p className="text-gray-600 text-center mb-4">
          Category: {wasteItem.category}
        </p>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Close
          </button>
          <button
            onClick={() => navigate(`/waste-details/${wasteItem.name}`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            How to Dispose?
          </button>
        </div>
      </div>
    </div>
  );
};

export default WastePopup;
