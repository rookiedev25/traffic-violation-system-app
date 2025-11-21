import { useState } from "react";
import ShowViolation from "./components/ShowViolation";

const App = () => {
  const [showViolations, setShowViolations] = useState(false);

  // const resultsRef = useState(null)[1];

  const handleViewClick = () => {
    setShowViolations(true);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <>
      <section className="w-full bg-black text-white py-20 px-5 min-h-screen flex items-center">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-light mb-4 tracking-wide">Traffic Violations</h1>
          <p className="text-sm text-gray-500 mb-8">Manage violations with ease</p>
          <button
            onClick={handleViewClick}
            className="px-6 py-2 bg-white text-black text-sm font-light rounded hover:bg-gray-200 transition cursor-pointer">
            View
          </button>
        </div>
      </section>
      {showViolations && (
        <div id="results" className="w-full bg-white py-12 px-5">
          <div className="max-w-2xl mx-auto">
            <ShowViolation />
          </div>
        </div>
      )}
      <footer className="w-full bg-black text-gray-600 py-6 px-5 text-center text-xs">
        &copy; 2024 Traffic Violation System
      </footer>
    </>
  );
};

export default App;
