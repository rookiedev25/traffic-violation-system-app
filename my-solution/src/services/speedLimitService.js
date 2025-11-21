// this service basically provides the speed limit API service
// this service has 2 responsibilities:
// 1. Fetching speed limit from constants.js - fallback for API not working scenarios
// 2. Fetch from API - for real data from JSON object fetch()

import { ALLOWED_SPEED_LIMIT } from "../data/constants";

export const getSpeedLimit = (location) => {
  // check for valid location details
  if (!location || location === null || location == undefined) {
    throw new Error("Invalid Location Details");
  }

  // compare and store the array-element matching with location value as input parameter for getSpeedLimit(loc) with the location value from configured constants/API
  const speedLimitForLocation = ALLOWED_SPEED_LIMIT.find((item) => {
    return item.location.toLowerCase() === location.toLowerCase();
  });

  // throw error of limit is not found
  if (!speedLimitForLocation) {
    throw new Error(
      `Please enter proper input values: Speed limit not found for the location ${location}`
    );
  }
  return speedLimitForLocation.limit;
};
