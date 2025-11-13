import { calculateSpeed } from "./speedCalculator.js";
import { checkViolation } from "./violationDetector.js";
import { calculateFine } from "./fineCalculator.js";
import { sendNotification } from "./smsNotifier.js";

/**
 * Process traffic violation for a single vehicle
 * This is the MAIN BUSINESS LOGIC orchestrator
 * 
 * @param {object} vehicle - Vehicle data { type, time, location }
 * @param {number} cameraDistance - Distance between cameras in meters
 * @param {array} speedLimits - Array of speed limit objects
 * @param {object} fineMapping - Mapping of vehicle types to fines
 * @returns {object} Violation report
 */
export const processVehicleViolation = (
  vehicle,
  cameraDistance,
  speedLimits,
  fineMapping
) => {
  try {
    // Step 1: Calculate speed
    const speed = calculateSpeed(cameraDistance, vehicle.time);

    // Step 2: Check violation
    const { isViolated, speedLimit } = checkViolation(
      speedLimits,
      speed,
      vehicle.location
    );

    // Step 3: Calculate fine
    const fine = calculateFine(vehicle.type, isViolated, fineMapping);

    // Step 4: Prepare report
    const report = {
      vehicleType: vehicle.type,
      location: vehicle.location,
      detectedSpeed: parseFloat(speed.toFixed(2)),
      speedLimit: speedLimit,
      isViolated: isViolated,
      fineAmount: fine,
      status: isViolated ? "VIOLATION" : "COMPLIANT",
    };

    // Step 5: Send notification if violated
    if (isViolated) {
      const message = `Dear user, your ${vehicle.type} was found passing our speed cameras at ${vehicle.location} with a speed of ${report.detectedSpeed} km/h (limit: ${speedLimit} km/h). Please pay the fine amount: Rs ${fine}`;
      sendNotification(message, "console");
    } else {
      sendNotification(
        `Vehicle ${vehicle.type} at ${vehicle.location}: Speed ${report.detectedSpeed} km/h is within limit. Thanks for safe driving!`,
        "console"
      );
    }

    return report;
  } catch (error) {
    console.error(`Error processing vehicle: ${error.message}`);
    return null;
  }
};

/**
 * Process multiple vehicles
 * @param {array} vehicles - Array of vehicle data
 * @param {number} cameraDistance - Distance between cameras
 * @param {array} speedLimits - Speed limit data
 * @param {object} fineMapping - Fine mapping data
 * @returns {array} Array of violation reports
 */
export const processAllVehicles = (
  vehicles,
  cameraDistance,
  speedLimits,
  fineMapping
) => {
  return vehicles.map((vehicle) =>
    processVehicleViolation(vehicle, cameraDistance, speedLimits, fineMapping)
  );
};
