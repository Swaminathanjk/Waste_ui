import { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import WastePopup from "../components/WastePopup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Scan = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [detections, setDetections] = useState([]);
  const [selectedWasteItem, setSelectedWasteItem] = useState(null);
  const [wasteCategories, setWasteCategories] = useState({});

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend("webgl");
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log("COCO-SSD model loaded successfully.");
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    loadModel();
    fetchWasteCategories();
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const fetchWasteCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/wasteInfo/waste-items"
      );
      const wasteItems = response.data;

      if (!Array.isArray(wasteItems)) {
        throw new Error("Unexpected API response format");
      }

      const categoryData = {};
      wasteItems.forEach((item) => {
        categoryData[item.name.toLowerCase().trim()] = item.category;
      });

      setWasteCategories(categoryData);
    } catch (error) {
      console.error("Error fetching waste categories:", error);
    }
  };

  const detectObjects = async () => {
    if (!model || !videoRef.current || videoRef.current.readyState < 2) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const predictions = await model.detect(video);
    setDetections(predictions);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;

      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      ctx.fillRect(x, y, width, height);

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText(
        `${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`,
        x,
        y > 20 ? y - 5 : y + 15
      );
    });

    // Handle clicks on bounding boxes
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      for (const prediction of predictions) {
        const [x, y, width, height] = prediction.bbox;
        if (
          clickX >= x &&
          clickX <= x + width &&
          clickY >= y &&
          clickY <= y + height
        ) {
          const detectedWasteName = prediction.class.toLowerCase().trim();
          const wasteCategory = wasteCategories[detectedWasteName] || "Unknown";

          const wasteItem = {
            name: prediction.class,
            category: wasteCategory,
          };

          console.log("Selected Waste Item:", wasteItem);
          setSelectedWasteItem(wasteItem);
          break;
        }
      }
    };
  };

  useEffect(() => {
    if (model) {
      const interval = setInterval(detectObjects, 500);
      return () => clearInterval(interval);
    }
  }, [model, wasteCategories]);

  const closePopup = () => {
    setSelectedWasteItem(null);
  };

  const handleDispose = (wasteItem) => {
    if (!wasteItem || !wasteItem.name) {
      console.error("handleDispose: Invalid waste item", wasteItem);
      return;
    }
    console.log("Navigating to waste-details with:", wasteItem.name);
    navigate(`/waste-details/${wasteItem.name}`);
    closePopup();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Scan Waste Item</h1>

      <div className="relative w-full max-w-[400px] h-[300px] rounded-lg overflow-hidden border border-gray-700 shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute w-full h-full object-cover rounded-lg"
        />
        <canvas ref={canvasRef} className="absolute w-full h-full rounded-lg" />
      </div>

      {selectedWasteItem && (
        <WastePopup
          wasteItem={selectedWasteItem}
          onClose={closePopup}
          onDispose={handleDispose}
        />
      )}

      <p className="text-sm text-gray-400 mt-3">
        Click on detected waste to view details.
      </p>
    </div>
  );
};

export default Scan;
