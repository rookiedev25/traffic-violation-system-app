/**
 * Calculate speed of vehicle in km/h
 * Formula: Speed (km/h) = (Distance in meters / Time in seconds) * 3.6
 * 
 * Why 3.6? To convert m/s to km/h
 * 1 m/s = 3.6 km/h
 * 
 * @param {number} distanceMeters - Distance between cameras in meters
 * @param {number} timeSeconds - Time taken to travel between cameras in seconds
 * @returns {number} Speed in km/h
 */
export const calculateSpeed = (distanceMeters, timeSeconds) => {
  if (timeSeconds <= 0) {
    throw new Error("Time must be greater than 0");
  }
  const speedMeterPerSecond = distanceMeters / timeSeconds;
  const speedKmPerHour = speedMeterPerSecond * 3.6;
  return speedKmPerHour;
};
