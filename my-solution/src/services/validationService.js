/**
 * Validation Service
 * Handles speed limit realism validation
 * If speed limit is unrealistic, no fine should be calculated
 */

// Speed limit validation rules
export const VALIDATION_RULES = {
  MIN_REALISTIC_SPEED_LIMIT: 10, // Must be at least 10 km/h (not single-digit)
  MAX_REALISTIC_SPEED_LIMIT: 200, // Must not exceed 200 km/h
  EXACT_PHONE_DIGITS: 10, // Phone number must have exactly 10 digits
};

export const isSpeedLimitRealistic = (speedLimit) => {
  // Must be a number
  if (typeof speedLimit !== "number") {
    return false;
  }

  // Must not be single-digit (must be >= 10)
  if (speedLimit < VALIDATION_RULES.MIN_REALISTIC_SPEED_LIMIT) {
    return false;
  }

  // Must not exceed maximum realistic value
  if (speedLimit > VALIDATION_RULES.MAX_REALISTIC_SPEED_LIMIT) {
    return false;
  }

  return true;
};

export const validateSpeedLimitRealism = (report) => {
  const isRealistic = isSpeedLimitRealistic(report.speedLimit);

  if (!isRealistic) {
    return {
      isRealistic: false,
      message: `Speed limit ${report.speedLimit} km/h is unrealistic (must be 10-200 km/h, not single-digit). Fine calculation disabled.`,
    };
  }

  return {
    isRealistic: true,
    message: null,
  };
};


export const isValidOwnerPhone = (phone) => {
  // Must be a string
  if (typeof phone !== "string") {
    return false;
  }

  // Extract only digits from phone number
  const digitsOnly = phone.replace(/\D/g, "");

  // Must have exactly 10 digits
  if (digitsOnly.length !== VALIDATION_RULES.EXACT_PHONE_DIGITS) {
    return false;
  }

  return true;
};


export const validateOwnerPhone = (phone) => {
  const isValid = isValidOwnerPhone(phone);

  if (!isValid) {
    const digitsOnly =
      typeof phone === "string" ? phone.replace(/\D/g, "").length : 0;
    return {
      isValid: false,
      message: `Phone number must have exactly ${VALIDATION_RULES.EXACT_PHONE_DIGITS} digits. Found: ${digitsOnly} digits.`,
    };
  }

  return {
    isValid: true,
    message: null,
  };
};
