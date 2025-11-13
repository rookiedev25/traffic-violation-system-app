# Traffic Violation System — Roadmap

## Objective
Detect vehicles exceeding a speed limit (two cameras 1 km apart), calculate fines by vehicle type, and simulate SMS notification. Provide a prototype/POC using dummy data that demonstrates end-to-end flow.

## High-level Workflow
1. Input: capture vehicleId, vehicleType, timestampCameraA, timestampCameraB, speedLimit.
2. Processing:
   - Validate input.
   - Compute travel time and speed (km/h).
   - Compare speed to speedLimit.
   - If violating, determine fine using vehicle-type mapping.
   - Prepare notification payload (SMS simulation).
3. Output: store violation record and show notification/log.

## Recommended Tech Stack (POC)
- Frontend: React (UI + mock API integration)
- Backend: Node.js + Express (business logic + endpoints)
- Data: In-memory JSON array (dummy DB)
- Testing: Jest (unit + integration), React Testing Library (frontend)
- Tools: Postman or built-in mock server for API testing

## Modules & Responsibilities
- src/services/speedCalculator.js — compute speed, helper utilities
- src/services/fineCalculator.js — vehicle type → fine mapping
- src/services/notificationService.js — simulate SMS (console/log)
- src/controllers/violationController.js — API handlers
- src/models/violation.js — data structure/schema
- src/utils/validators.js — input validation, error messages
- frontend/ — simple React app to display violations and trigger checks

## SDLC Phases & Deliverables
1. Requirements & Design
   - JSON input/output contracts
   - Sequence/data flow diagram
2. Implementation (Core)
   - Implement services and controllers
   - Wire simple REST API (GET violations, POST check)
3. Frontend POC
   - Small React UI to submit test records and view results
4. Testing
   - Unit tests for each service
   - Integration tests for API endpoints
   - E2E (optional) to validate flow from UI to backend
5. Documentation & Demo
   - README, API examples, how to run tests

## Sample Data Model (POC)
- {
  vehicleId: "ABC123",
  vehicleType: "4wheeler",
  timestampA: "2025-11-13T10:00:00Z",
  timestampB: "2025-11-13T10:00:30Z",
  computedSpeed: 120,
  speedLimit: 60,
  fine: 400,
  notified: true,
  createdAt: "..."
  }

## Fine Mapping
- 2 wheeler: 200
- 4 wheeler: 400
- Bus: 600
- Truck: 800

## Testing Strategy
- Unit tests: speed calculations, fine mapping, validation
- Integration tests: POST /check → produces expected violation
- Edge cases: zero/negative time, missing timestamps, unknown vehicle types, boundary speeds

## Timeline (10-day POC)
- Days 1–2: Design, data contracts
- Days 3–4: Core services + unit tests
- Days 5–6: API layer + integration tests
- Days 7–8: React POC + connect to API
- Day 9: E2E & polish
- Day 10: Documentation & demo

## Next Actions
- Confirm persistence choice (in-memory vs DB) and SMS simulation method (console/log vs mock service).
- If confirmed, scaffold repository and implement first service with tests.

```// filepath: d:\myData\Gouranga\developer\projects\traffic-violation-system\roadmap.md
# Traffic Violation System — Roadmap

## Objective
Detect vehicles exceeding a speed limit (two cameras 1 km apart), calculate fines by vehicle type, and simulate SMS notification. Provide a prototype/POC using dummy data that demonstrates end-to-end flow.

## High-level Workflow
1. Input: capture vehicleId, vehicleType, timestampCameraA, timestampCameraB, speedLimit.
2. Processing:
   - Validate input.
   - Compute travel time and speed (km/h).
   - Compare speed to speedLimit.
   - If violating, determine fine using vehicle-type mapping.
   - Prepare notification payload (SMS simulation).
3. Output: store violation record and show notification/log.

## Recommended Tech Stack (POC)
- Frontend: React (UI + mock API integration)
- Backend: Node.js + Express (business logic + endpoints)
- Data: In-memory JSON array (dummy DB)
- Testing: Jest (unit + integration), React Testing Library (frontend)
- Tools: Postman or built-in mock server for API testing

## Modules & Responsibilities
- src/services/speedCalculator.js — compute speed, helper utilities
- src/services/fineCalculator.js — vehicle type → fine mapping
- src/services/notificationService.js — simulate SMS (console/log)
- src/controllers/violationController.js — API handlers
- src/models/violation.js — data structure/schema
- src/utils/validators.js — input validation, error messages
- frontend/ — simple React app to display violations and trigger checks

## SDLC Phases & Deliverables
1. Requirements & Design
   - JSON input/output contracts
   - Sequence/data flow diagram
2. Implementation (Core)
   - Implement services and controllers
   - Wire simple REST API (GET violations, POST check)
3. Frontend POC
   - Small React UI to submit test records and view results
4. Testing
   - Unit tests for each service
   - Integration tests for API endpoints
   - E2E (optional) to validate flow from UI to backend
5. Documentation & Demo
   - README, API examples, how to run tests

## Sample Data Model (POC)
- {
  vehicleId: "ABC123",
  vehicleType: "4wheeler",
  timestampA: "2025-11-13T10:00:00Z",
  timestampB: "2025-11-13T10:00:30Z",
  computedSpeed: 120,
  speedLimit: 60,
  fine: 400,
  notified: true,
  createdAt: "..."
  }

## Fine Mapping
- 2 wheeler: 200
- 4 wheeler: 400
- Bus: 600
- Truck: 800

## Testing Strategy
- Unit tests: speed calculations, fine mapping, validation
- Integration tests: POST /check → produces expected violation
- Edge cases: zero/negative time, missing timestamps, unknown vehicle types, boundary speeds

## Timeline (10-day POC)
- Days 1–2: Design, data contracts
- Days 3–4: Core services + unit tests
- Days 5–6: API layer + integration tests
- Days 7–8: React POC + connect to API
- Day 9: E2E & polish
- Day 10: Documentation & demo

## Next Actions
- Confirm persistence choice (in-memory vs DB) and SMS simulation method (console/log vs mock service).
- If confirmed, scaffold repository and implement first service with tests.
