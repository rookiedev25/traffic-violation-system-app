const distance = 1000;
// set a database or a JSON data for Vehicles
const vehicles = [
  {
    type: "4wheeler",
    time: 36,
    location: "Baner",
  },
  {
    type: "2wheeler",
    time: 40,
    location: "Wakad",
  },
  {
    type: "truck",
    time: 50,
    location: "Wakad",
  },
];

const locationSpeedLimit = [
  {
    locationName: "Baner",
    limit: 120,
  },
  {
    locationName: "Wakad",
    limit: 95,
  },
  {
    locationName: "Kothrud",
    limit: 50,
  },
];

// fine-mapping:
const FINE_MAPPING = {
  "2wheeler": 200,
  "4wheeler": 200,
  bus: 200,
  truck: 800,
};

// speed calculation
const calculatedSpeed = (dist, time) => {
  return (dist / time) * 3.6;
};

// violation calculated -
const hasViolated = (
  speedLimitArray,
  calculatedSpeedOfVehicle,
  vehicleLocation
) => {
  const speedLimitObj = speedLimitArray.find(
    (item) => vehicleLocation === item.locationName
  );
  return speedLimitObj ? calculatedSpeedOfVehicle > speedLimitObj.limit : false;
};
// fine calculation
const calculateFine = (vehicleType, isViolated) => {
  return isViolated ? FINE_MAPPING[vehicleType] : 0;
};

const userMessage = (distance, vehicles, locationSpeedLimit) => {
  vehicles.forEach((item) => {
    const speed = calculatedSpeed(distance, item.time);
    const violationStatus = hasViolated(
      locationSpeedLimit,
      speed,
      item.location
    );
    const fine = calculateFine(item.type, violationStatus);
    if (fine) {
      console.log(
        `Dear user, your ${item.type} was found passing our speed cameras at ${
          item.location
        } with a speed of ${speed.toFixed(
          2
        )}. Please pay the fine amount: ${fine}`
      );
    } else {
      console.log("Thanks for visiting!");
    }
  });
};

userMessage(distance, vehicles, locationSpeedLimit);
