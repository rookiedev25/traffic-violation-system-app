/**
 * Validation Service
 * Handles speed limit realism validation
 * If speed limit is unrealistic, no fine should be calculated
 */

// Speed limit validation rules
export const VALIDATION_RULES = {
  MIN_REALISTIC_SPEED_LIMIT: 0,      // Must be greater than 0
  MAX_REALISTIC_SPEED_LIMIT: 200,    // Must not exceed 200 km/h
};

/**
 * Checks if a speed limit is realistic
 * Speed limit should not be: 0, negative, or > 200 km/h
 * @param {number} speedLimit - Speed limit in km/h
 * @returns {boolean} - True if speed limit is realistic
 */
export const isSpeedLimitRealistic = (speedLimit) => {
  // Must be a positive number
  if (typeof speedLimit !== 'number' || speedLimit <= VALIDATION_RULES.MIN_REALISTIC_SPEED_LIMIT) {
    return false;
  }

  // Must not exceed maximum realistic value
  if (speedLimit > VALIDATION_RULES.MAX_REALISTIC_SPEED_LIMIT) {
    return false;
  }

  return true;
};

/**
 * Gets validation status for a violation report
 * @param {object} report - Violation report object
 * @returns {object} - { isRealistic: boolean, message: string }
 */
export const validateSpeedLimitRealism = (report) => {
  const isRealistic = isSpeedLimitRealistic(report.speedLimit);

  if (!isRealistic) {
    return {
      isRealistic: false,
      message: `Speed limit ${report.speedLimit} km/h is unrealistic (must be between 0-200 km/h). Fine calculation disabled.`,
    };
  }

  return {
    isRealistic: true,
    message: null,
  };
};
