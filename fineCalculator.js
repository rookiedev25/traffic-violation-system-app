/**
 * Calculate fine amount based on violation status
 * @param {string} vehicleType - Type of vehicle (2wheeler, 4wheeler, bus, truck)
 * @param {boolean} isViolated - Whether vehicle violated speed limit
 * @param {object} fineMapping - Mapping of vehicle types to fine amounts
 * @returns {number} Fine amount in currency units
 */
export const calculateFine = (vehicleType, isViolated, fineMapping) => {
  if (!isViolated) {
    return 0;
  }

  const fine = fineMapping[vehicleType];
  if (fine === undefined) {
    throw new Error(`Fine amount not defined for vehicle type: ${vehicleType}`);
  }

  return fine;
};
