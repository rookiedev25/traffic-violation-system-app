// this is the orchestrator

// all basic services working at individual logics imported
import { calculateSpeedFromTimestamps } from "./speedCalculatorService";
import { getSpeedLimit } from "./speedLimitService";
import { checkViolation } from "./violationDetectorService";
import { calculateFine } from "./fineCalculatorService";
import { validateSpeedLimitRealism } from "./validationService";

// output to be pushed here
import { addViolationRecord } from "../data/reportViolationDatabase";

// imported vehicle database and reportviolationdatabase
import { vehicleDatabase } from "../data/vehicleDatabase";

export const processSingleVehicle = (vehicleRecord) => {
  try {
    // calculate speed
    const actualSpeed = calculateSpeedFromTimestamps(
      vehicleRecord.cameraCapture.timeStamp1,
      vehicleRecord.cameraCapture.timeStamp2
    );

    // get speed limit
    const speedLimit = getSpeedLimit(vehicleRecord.location);

    // check for any violation
    const violationStatus = checkViolation(actualSpeed, speedLimit);

    // Check if speed limit is realistic
    const speedLimitValidation = validateSpeedLimitRealism({ speedLimit });

    // Calculate fine only if speed limit is realistic
    let calculatedFineAmount = 0;
    let hasUnrealisticSpeedLimit = false;

    if (speedLimitValidation.isRealistic) {
      calculatedFineAmount = calculateFine(
        vehicleRecord.vehicleType,
        violationStatus.isViolated
      );
    } else {
      hasUnrealisticSpeedLimit = true;
    }

    // Build report object
    const report = {
      vehicleID: vehicleRecord.vehicleID,
      ownerPhone: vehicleRecord.ownerPhone,
      vehicleType: vehicleRecord.vehicleType,
      location: vehicleRecord.location,
      calculatedSpeed: actualSpeed,
      speedLimit: speedLimit,
      isViolated: violationStatus.isViolated,
      speedDifference: violationStatus.speedDifference,
      fineAmount: calculatedFineAmount,
      status: violationStatus.isViolated ? "VIOLATION" : "COMPLIANT",
      processedAt: new Date().toISOString(),
      hasUnrealisticSpeedLimit: hasUnrealisticSpeedLimit,
      unrealisticSpeedLimitMessage: speedLimitValidation.message,
    };

    // push into output DB
    addViolationRecord(report);

    return report;
  } catch (error) {
    console.error("Error processing vehicle: ", error.message);
    return null;
  }
};

export const processAllVehicles = () => {
  try {
    console.log("Started traffic violation processing...");

    // initialized empty report
    const reports = [];

    // iterate through each vehicle in vehicleDatabase
    vehicleDatabase.forEach((vehicle) => {
      // create report for each vehicle
      const report = processSingleVehicle(vehicle);
      // if valid reports
      if (report) {
        reports.push(report);
      }
    });

    // calculate number of violation for single vehicle
    // if the reports, a single vehicleID is repeated more than once, then we can add that into count of nunber of violations
    const numberOfViolations = reports.filter((reportItem) => {
      return reportItem.isViolated;
    });
    const totalFine = reports.reduce((acc, index) => {
      acc = acc + index.fineAmount;
      return acc;
    }, 0);

    console.log("\n" + "═".repeat(60));
    console.log("📊 SUMMARY REPORT");
    console.log("═".repeat(60));
    console.log(`Total Vehicles Processed: ${reports.length}`);
    console.log(`Total Violations: ${numberOfViolations.length}`);
    console.log(
      `Compliant Vehicles: ${reports.length - numberOfViolations.length}`
    );
    console.log(`Total Fine Amount: ₹${totalFine}`);
    console.log("═".repeat(60));

    return reports;
  } catch (error) {
    console.error("Error processing all vehicles", error.message);
    return [];
  }
};
