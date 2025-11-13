import { processAllVehicles } from "./trafficViolationProcessor.js";
import { CAMERA_DISTANCE_METERS, FINE_MAPPING, LOCATION_SPEED_LIMITS } from "./constants.js";

// Test data with MORE realistic timings to trigger violations
const vehicles = [
  {
    type: "4wheeler",
    time: 20,  // 1000m in 20s = 180 km/h (exceeds 120 limit) ✓ VIOLATION
    location: "Baner",
  },
  {
    type: "2wheeler",
    time: 25,  // 1000m in 25s = 144 km/h (exceeds 95 limit) ✓ VIOLATION
    location: "Wakad",
  },
  {
    type: "truck",
    time: 50,  // 1000m in 50s = 72 km/h (within 95 limit) ✓ COMPLIANT
    location: "Wakad",
  },
  {
    type: "bus",
    time: 60,  // 1000m in 60s = 60 km/h (exceeds 50 limit) ✓ VIOLATION
    location: "Kothrud",
  },
];

// Process all vehicles
const violationReports = processAllVehicles(
  vehicles,
  CAMERA_DISTANCE_METERS,
  LOCATION_SPEED_LIMITS,
  FINE_MAPPING
);

// Display summary
console.log("\n========== TRAFFIC VIOLATION REPORT ==========\n");
violationReports.forEach((report, index) => {
  if (report) {
    console.log(`Vehicle ${index + 1}:`);
    console.log(`  Type: ${report.vehicleType}`);
    console.log(`  Location: ${report.location}`);
    console.log(`  Detected Speed: ${report.detectedSpeed} km/h`);
    console.log(`  Speed Limit: ${report.speedLimit} km/h`);
    console.log(`  Status: ${report.status}`);
    console.log(`  Fine: ₹${report.fineAmount}`);
    console.log("---");
  }
});
