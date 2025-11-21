// this is the configured file containing data that are mostly static and should be part of configured items. 

// distance between 2 speed cameras in meters
export const DIST_BETWEEN_CAMERAS = 1000

// fine associates with vehicle type
export const FINE_ASSOCIATION = {
  "2wheeler": 200,
  "4wheeler": 400,
  "bus": 600,
  "truck": 800,
};

// SpeedLimit mockAPI 
export const ALLOWED_SPEED_LIMIT = [
  { location: "Wakad", limit: 80 },
  {location: "Pune", limit: 22},
  { location: "Hinjewadi", limit: 120 },
  { location: "Aundh", limit: 70 },
  { location: "Viman Nagar", limit: 85 },
  { location: "Kharadi", limit: 110 },
  { location: "Magarpatta", limit: 65 },
  { location: "Hadapsar", limit: 90 },
  { location: "Yerwada", limit: 55 },
  { location: "Bibwewadi", limit: 40 },
  { location: "Swargate", limit: 45 },
  { location: "Bavdhan", limit: 75 },
];

// API configuration -- if integrated via swaggerAPI
// export const API_CONFIG = {
//     USE_API_FOR_SPEED_LIMIT : false,
//     API_BASE_URL : "url"
// }