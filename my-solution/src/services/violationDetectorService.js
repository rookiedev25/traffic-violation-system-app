// this service returns an object with boolean value - isViolated and speedDifference


export const checkViolation = (vehicleSpeed, speedLimit) => {
  // check for valid input values
  if (!speedLimit || speedLimit <= 0) {
    throw new Error("Invalid Speed Limit");
  }

  if (!vehicleSpeed || vehicleSpeed <= 0) {
    throw new Error("Invalid vehicle speed");
  }

  // comparison of speed values - calculated vs limit
  const isViolated = vehicleSpeed > speedLimit;
  const speedDifference = Math.round((vehicleSpeed - speedLimit) * 100) / 100;

  return {
    isViolated,
    speedDifference,
  };
};
