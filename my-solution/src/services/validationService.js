/**
 * Validation Service
 * Handles all data validation with business rules
 */

import { ALLOWED_SPEED_LIMIT } from '../data/constants.js';

// Validation constraints
export const VALIDATION_RULES = {
  MIN_SPEED_LIMIT: 20,              // Minimum realistic speed (residential)
  MAX_SPEED_LIMIT: 150,             // Maximum realistic speed (highway)
  MAX_REALISTIC_VEHICLE_SPEED: 300, // No vehicle should exceed this
  VALID_VEHICLE_TYPES: ['2wheeler', '4wheeler', 'bus', 'truck'],
};

/**
 * Validates a location against database
 * @param {string} location - Location name
 * @returns {boolean} - True if valid
 * @throws {Error} - If location is invalid
 */
export const validateLocation = (location) => {
  if (!location || typeof location !== 'string') {
    throw new Error('Location must be a non-empty string');
  }

  const validLocations = ALLOWED_SPEED_LIMIT.map(item => item.location);
  const isValid = validLocations.some(
    loc => loc.toLowerCase() === location.toLowerCase()
  );

  if (!isValid) {
    throw new Error(
      `Invalid location: "${location}". Valid locations are: ${validLocations.join(', ')}`
    );
  }

  return true;
};

/**
 * Validates speed limit value
 * @param {number} speedLimit - Speed limit in km/h
 * @returns {boolean} - True if valid
 * @throws {Error} - If speed limit is invalid
 */
export const validateSpeedLimit = (speedLimit) => {
  if (typeof speedLimit !== 'number' || speedLimit < 0) {
    throw new Error('Speed limit must be a positive number');
  }

  if (speedLimit < VALIDATION_RULES.MIN_SPEED_LIMIT) {
    throw new Error(
      `Speed limit ${speedLimit} km/h is too low. Minimum realistic: ${VALIDATION_RULES.MIN_SPEED_LIMIT} km/h`
    );
  }

  if (speedLimit > VALIDATION_RULES.MAX_SPEED_LIMIT) {
    throw new Error(
      `Speed limit ${speedLimit} km/h is unrealistic. Maximum: ${VALIDATION_RULES.MAX_SPEED_LIMIT} km/h`
    );
  }

  return true;
};

/**
 * Validates vehicle speed
 * @param {number} vehicleSpeed - Actual vehicle speed in km/h
 * @returns {boolean} - True if valid
 * @throws {Error} - If vehicle speed is invalid
 */
export const validateVehicleSpeed = (vehicleSpeed) => {
  if (typeof vehicleSpeed !== 'number' || vehicleSpeed < 0) {
    throw new Error('Vehicle speed must be a positive number');
  }

  if (vehicleSpeed > VALIDATION_RULES.MAX_REALISTIC_VEHICLE_SPEED) {
    throw new Error(
      `Vehicle speed ${vehicleSpeed} km/h is unrealistic. Maximum realistic: ${VALIDATION_RULES.MAX_REALISTIC_VEHICLE_SPEED} km/h`
    );
  }

  return true;
};

/**
 * Validates vehicle type
 * @param {string} vehicleType - Type of vehicle
 * @returns {boolean} - True if valid
 * @throws {Error} - If vehicle type is invalid
 */
export const validateVehicleType = (vehicleType) => {
  if (!vehicleType || typeof vehicleType !== 'string') {
    throw new Error('Vehicle type must be a non-empty string');
  }

  const isValid = VALIDATION_RULES.VALID_VEHICLE_TYPES.some(
    type => type.toLowerCase() === vehicleType.toLowerCase()
  );

  if (!isValid) {
    throw new Error(
      `Invalid vehicle type: "${vehicleType}". Valid types: ${VALIDATION_RULES.VALID_VEHICLE_TYPES.join(', ')}`
    );
  }

  return true;
};

/**
 * Validates complete violation report
 * @param {object} report - Violation report object
 * @returns {object} - Validation result { isValid: boolean, errors: [] }
 */
export const validateViolationReport = (report) => {
  const errors = [];

  try {
    validateLocation(report.location);
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validateSpeedLimit(report.speedLimit);
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validateVehicleSpeed(report.calculatedSpeed);
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validateVehicleType(report.vehicleType);
  } catch (error) {
    errors.push(error.message);
  }

  // Additional logical validations
  if (report.calculatedSpeed < report.speedLimit && report.isViolated === true) {
    errors.push(
      `Logic error: Vehicle speed (${report.calculatedSpeed}) is less than limit (${report.speedLimit}), but violation is marked as true`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: generateWarnings(report),
  };
};

/**
 * Generates warnings for potentially problematic but valid data
 * @param {object} report - Violation report object
 * @returns {array} - Array of warning messages
 */
const generateWarnings = (report) => {
  const warnings = [];

  // Speed difference is too high (indicates potential data entry error)
  if (report.speedDifference > 100) {
    warnings.push(
      `⚠️ Extremely high speed difference (${report.speedDifference} km/h). Verify data entry.`
    );
  }

  // Speed very close to limit (could be calibration issue)
  if (Math.abs(report.speedDifference) < 1 && report.isViolated === true) {
    warnings.push(
      `⚠️ Speed very close to limit (${report.speedDifference} km/h difference). Consider calibration check.`
    );
  }

  return warnings;
};

/**
 * Gets a human-readable validation message
 * @param {object} validationResult - Result from validateViolationReport
 * @returns {string} - Message for UI display
 */
export const getValidationMessage = (validationResult) => {
  if (validationResult.isValid && validationResult.warnings.length === 0) {
    return 'All validations passed ✅';
  }

  let message = '';

  if (validationResult.errors.length > 0) {
    message += '❌ Errors:\n';
    message += validationResult.errors.map(e => `• ${e}`).join('\n');
  }

  if (validationResult.warnings.length > 0) {
    if (message) message += '\n\n';
    message += '⚠️ Warnings:\n';
    message += validationResult.warnings.map(w => `• ${w}`).join('\n');
  }

  return message;
};
