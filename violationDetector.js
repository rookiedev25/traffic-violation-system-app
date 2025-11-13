/**
 * Check if vehicle has violated speed limit
 * @param {array} speedLimitArray - Array of location speed limits
 * @param {number} vehicleSpeed - Calculated speed of vehicle in km/h
 * @param {string} vehicleLocation - Location name where violation occurred
 * @returns {object} { isViolated: boolean, speedLimit: number }
 */
export const checkViolation = (
  speedLimitArray,
  vehicleSpeed,
  vehicleLocation
) => {
  const speedLimitObj = speedLimitArray.find(
    (item) => vehicleLocation === item.locationName
  );

  if (!speedLimitObj) {
    throw new Error(`Speed limit not found for location: ${vehicleLocation}`);
  }

  return {
    isViolated: vehicleSpeed > speedLimitObj.limit,
    speedLimit: speedLimitObj.limit,
  };
};
