// this service determines the fine calculated as per violation status

import { FINE_ASSOCIATION } from "../data/constants";
export const calculateFine = (vehicleType, isViolated) => {
  // validation for vehicle type
  if (!vehicleType || vehicleType === "" || vehicleType === undefined) {
    throw new Error(
      "Please enter proper input values: vehicle type cannot be empty"
    );
  }
  if (typeof isViolated != "boolean") {
    throw new Error(
      "Please enter proper input values: isViolated must be a boolean"
    );
  }

  // check if vehicle violated speedLimit
  if (!isViolated) {
    return 0;
  }

  // calculate the associated fine amount based on vehicle type
  const fine = FINE_ASSOCIATION[vehicleType.toLowerCase()];

  // check if fine exists
  if (fine === undefined) {
    throw new Error(
      `Please enter proper input values for vehicle. Fine not available for your vehicle: ${vehicleType}`
    );
  }

  return fine;
};
