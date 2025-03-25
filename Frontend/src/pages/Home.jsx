import { Link } from "react-router-dom";
import Scan from "./Scan";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <section className="text-center my-10">
        <h1 className="text-4xl font-bold text-green-700">
          AI-Powered Waste Sorting
        </h1>
        <p className="mt-4 text-gray-600 text-lg max-w-xl mb-6">
          Scan waste items using your camera, classify them, and learn how to
          dispose of them properly.
        </p>
        <Link
          to="/scan"
          className=" px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700"
        >
          Start Scanning
        </Link>
      </section>

      {/* How It Works */}
      <section className="my-10 text-center max-w-2xl ">
        <h2 className="text-3xl font-semibold text-green-700">How It Works</h2>
        <ul className="mt-4 text-gray-600 space-y-4">
          <li>📷 Open your camera and scan the waste item.</li>
          <li>🧠 AI detects the waste type and provides a disposal method.</li>
          <li>🔄 Earn points for disposing waste properly.</li>
        </ul>
      </section>
    </div>
  );
}
