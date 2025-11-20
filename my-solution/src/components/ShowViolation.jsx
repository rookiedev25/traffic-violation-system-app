import React from 'react'
import { useEffect } from 'react';
import { processAllVehicles } from '../services/trafficProcessorService';
import { useState } from 'react';

const ShowViolation = () => {


  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const reports = processAllVehicles();
      setResults(reports);
    } catch (error) {
      console.error("Error: ", error);
      ``;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-amber-50 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text bg-gradient-to-r text-black">
            Traffic Violation System
          </h1>
          <div className="text-sm text-gray-500">Realtime report</div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-12 h-12 text-indigo-500 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p className="mt-4 text-indigo-700 font-medium">
              Processing Vehicles ...
            </p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition transform hover:-translate-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Total Vehicles
                </p>
                <p className="text-2xl font-semibold mt-1">{results.length}</p>
              </div>

              <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition transform hover:-translate-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Violations
                </p>
                <p className="text-2xl font-semibold mt-1">
                  {
                    results.filter((item) => {
                      return item.isViolated;
                    }).length
                  }
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition transform hover:-translate-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Total Fine
                </p>
                <p className="text-2xl font-semibold mt-1 text-amber-600">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(
                    results.reduce((acc, ind) => {
                      return (acc += ind.fineAmount);
                    }, 0)
                  )}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Details</h3>
              <div className="space-y-3">
                {results.map((reportItem) => {
                  const violated = reportItem.isViolated;
                  return (
                    <div
                      key={reportItem.vehicleID}
                      className={`flex flex-col p-4 rounded-lg bg-white shadow-sm border-l-4 ${
                        violated ? "border-red-400" : "border-emerald-300"
                      } hover:shadow-md transition transform hover:-translate-y-1`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Vehicle</p>
                          <p className="text-lg font-medium">
                            <strong>{reportItem.vehicleID}</strong>
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                            violated
                              ? "bg-red-50 text-red-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {reportItem.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <p className="text-sm text-gray-600">
                          Speed:{" "}
                          <span className="font-medium">
                            {reportItem.calculatedSpeed} km/hr
                          </span>{" "}
                          <span className="text-xs text-gray-400">
                            (Limit: {reportItem.speedLimit})
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Fine:{" "}
                          <span className="font-medium text-amber-600">
                            Rs {reportItem.fineAmount}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Location: {reportItem.location}
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <button
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-100 transition"
                          aria-label={`View ${reportItem.vehicleID}`}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
  
}

export default ShowViolation
