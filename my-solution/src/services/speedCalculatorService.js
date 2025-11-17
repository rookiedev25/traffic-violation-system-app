// this service basically provides the calculated vehicle speed for further processing

import { DIST_BETWEEN_CAMERAS } from "../data/constants";

export const calculateSpeedFromTimestamps = (
  timeStamp1,
  timeStamp2,
  distanceInMeters = DIST_BETWEEN_CAMERAS
) => {
  // Validation: Check for null/undefined values
  if (!timeStamp1 || !timeStamp2) {
    throw new Error("Please enter proper input values: timestamps cannot be null or undefined");
  }

  // Validation: Check if timestamps are valid Date objects
  if (!(timeStamp1 instanceof Date) || !(timeStamp2 instanceof Date)) {
    throw new Error("Please enter proper input values: timestamps must be Date objects");
  }

  // Validation: Check distance is valid
  if (!distanceInMeters || distanceInMeters <= 0) {
    throw new Error("Please enter proper input values: distance must be a positive number");
  }

  // time calculation in seconds
  const diffInSeconds = Math.abs((timeStamp2 - timeStamp1) / 1000);

  // Validation: Check if time difference is zero (both cameras captured at same time)
  if (diffInSeconds === 0) {
    throw new Error("Please enter proper input values: timestamps cannot be identical (time difference must be > 0)");
  }

  // speed calculation in mt/seconds
  const speed = distanceInMeters / diffInSeconds;

  // converting calculated speed in km/hr
  const speedInKmPerHour = speed * 3.6;

  return Math.round(speedInKmPerHour * 100) / 100;
};
