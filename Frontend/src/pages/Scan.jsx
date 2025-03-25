import { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import WastePopup from "../components/WastePopup";

const Scan = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [detections, setDetections] = useState([]);
  const [selectedWasteItem, setSelectedWasteItem] = useState(null);
  const [wasteCategories, setWasteCategories] = useState({}); // Store waste categories

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
    fetchWasteCategories(); // Fetch categories on mount
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
        "https://waste-ui.onrender.com/api/waste/waste-items"
      );

      console.log("API Response:", response.data); // Debugging line

      const wasteItems = Array.isArray(response.data)
        ? response.data
        : response.data.items; // Handle object response

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

      // Draw bounding box
      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      ctx.fillRect(x, y, width, height);

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = "red";
      ctx.font = "16px Arial";
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
          const detectedWasteName = prediction.class.toLowerCase().trim(); // Normalize detected name
          setSelectedWasteItem({
            name: prediction.class,
            category: wasteCategories[detectedWasteName] || "Unknown",
          });
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
    console.log(`Disposing of: ${wasteItem.name}`);
    closePopup();
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="absolute w-full h-full" />

      {selectedWasteItem && (
        <WastePopup
          wasteItem={selectedWasteItem}
          onClose={closePopup}
          onDispose={handleDispose}
        />
      )}
    </div>
  );
};

export default Scan;
