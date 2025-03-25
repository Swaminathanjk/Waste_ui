import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WastePopup = ({ wasteItem, onClose, onDispose }) => {
  if (!wasteItem) return null; // Prevent rendering without data

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-bold text-gray-900">
          {wasteItem.name || "Unknown Item"}
        </h2>
        <p className="text-sm text-gray-600">Category: {wasteItem.category}</p>

        <div className="flex justify-between mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Close
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => onDispose(wasteItem)}
          >
            Dispose
          </button>
        </div>
      </div>
    </div>
  );
};

export default WastePopup;
