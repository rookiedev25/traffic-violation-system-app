import React from 'react'
import { useEffect } from 'react';
import { processAllVehicles } from '../services/trafficProcessorService';
import { smsService } from "../services/SMSService";
import { useState } from "react";
import {
  validateViolationReport,
  getValidationMessage,
} from "../services/validationService";

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

  // Validate report
  const getReportValidation = (report) => {
    return validateViolationReport(report);
  };

  // handle SMS alert on screen
  const handleSendMessage = (reportItem) => {
    // Validate before sending
    const validation = getReportValidation(reportItem);

    if (!validation.isValid) {
      alert(
        `Cannot send SMS - Data validation failed:\n\n${validation.errors.join(
          "\n"
        )}`
      );
      return;
    }

    const result = smsService(
      reportItem.vehicleID,
      reportItem.ownerPhone,
      reportItem.isViolated
    );

    if (result.success) {
      console.log("SMS sent successfully:", result.details);
    } else {
      console.error("SMS failed:", result.message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text bg-linear-to-r text-black">
            Realtime Report
          </h1>
          {/* <div className="text-sm text-gray-500">Realtime report</div> */}
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
                  const validation = getReportValidation(reportItem);
                  const isValidData = validation.isValid;

                  return (
                    <div
                      key={reportItem.vehicleID}
                      className={`flex flex-col p-4 rounded-lg bg-white shadow-sm border-l-4 ${
                        !isValidData
                          ? "border-orange-400"
                          : violated
                          ? "border-red-400"
                          : "border-emerald-300"
                      } hover:shadow-md transition transform hover:-translate-y-1`}
                    >
                      {/* Show validation errors if any */}
                      {!isValidData && (
                        <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded">
                          <p className="text-xs font-semibold text-orange-800 mb-1">
                            ⚠️ Data Validation Errors:
                          </p>
                          {validation.errors.map((error, idx) => (
                            <p
                              key={idx}
                              className="text-xs text-orange-700 mb-1"
                            >
                              • {error}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Show warnings if any */}
                      {validation.warnings.length > 0 && (
                        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-xs font-semibold text-yellow-800 mb-1">
                            ⚠️ Warnings:
                          </p>
                          {validation.warnings.map((warning, idx) => (
                            <p
                              key={idx}
                              className="text-xs text-yellow-700 mb-1"
                            >
                              {warning}
                            </p>
                          ))}
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Vehicle</p>
                          <p className="text-lg font-medium">
                            <strong>{reportItem.vehicleID}</strong>
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                            !isValidData
                              ? "bg-orange-50 text-orange-700"
                              : violated
                              ? "bg-red-50 text-red-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {!isValidData ? "⚠️ INVALID DATA" : reportItem.status}
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
                      {reportItem.isViolated ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSendMessage(reportItem)}
                            disabled={!isValidData}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition cursor-pointer ${
                              isValidData
                                ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                            aria-label={`Send message to ${reportItem.vehicleID}`}
                            title={
                              !isValidData
                                ? "Cannot send SMS - Data validation failed"
                                : "Send SMS alert"
                            }
                          >
                            📨 Send Message
                          </button>
                        </div>
                      ) : (
                        <div></div>
                      )}
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
};

export default ShowViolation
