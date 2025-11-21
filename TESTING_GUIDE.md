# Testing Strategy for Traffic Violation System

## Overview
Since you don't have real API calls or database, you can test:
1. **Unit Tests** - Individual service functions
2. **Integration Tests** - Services working together
3. **Edge Cases** - Invalid inputs, boundary conditions
4. **Mock/Stub Tests** - Simulate API responses

---

## What Can Be Tested

### ✅ Testable Without Real API/Database:

1. **Speed Calculator Service**
   - Correct speed calculation
   - Validation errors
   - Edge cases (reversed timestamps, zero time)
   - Boundary values

2. **Speed Limit Service**
   - Location lookup in constants
   - Case-insensitive matching
   - Missing location handling
   - Valid location retrieval

3. **Violation Detector Service**
   - Violation detection logic
   - Speed difference calculation
   - Boolean accuracy
   - Edge cases (equal speeds, negative differences)

4. **Fine Calculator Service**
   - Correct fine for vehicle type
   - Zero fine for non-violations
   - Invalid vehicle type handling
   - Case-insensitive vehicle matching

5. **Traffic Processor Service**
   - Single vehicle processing flow
   - Report generation
   - Error handling
   - Database storage (pushing to array)

---

## Setup Jest Testing Framework

### Step 1: Install Dependencies

```bash
npm install --save-dev jest @babel/preset-env babel-jest
```

### Step 2: Create jest.config.js

Create this file in root of `my-solution/`:

```javascript
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/index.css',
  ],
};
```

### Step 3: Create babel.config.js

```javascript
export default {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
```

### Step 4: Update package.json

Add to scripts section:
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

---

## Test Files Structure

```
my-solution/
├── src/
│   ├── services/
│   │   ├── speedCalculatorService.js
│   │   ├── speedLimitService.js
│   │   ├── ...
│   └── __tests__/
│       ├── speedCalculatorService.test.js
│       ├── speedLimitService.test.js
│       ├── violationDetectorService.test.js
│       ├── fineCalculatorService.test.js
│       └── trafficProcessorService.test.js
```

---

## Test Cases for Each Service

### 1. Speed Calculator Service Tests

```javascript
// src/__tests__/speedCalculatorService.test.js

import { calculateSpeedFromTimestamps } from '../services/speedCalculatorService';

describe('speedCalculatorService', () => {
  
  describe('calculateSpeedFromTimestamps', () => {
    
    test('should calculate speed correctly for valid timestamps', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:00:20Z'); // 20 seconds
      
      // Speed = (1000m / 20s) * 3.6 = 180 km/h
      const speed = calculateSpeedFromTimestamps(timeStamp1, timeStamp2);
      
      expect(speed).toBe(180);
    });

    test('should handle reversed timestamps (uses Math.abs)', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:20Z');
      const timeStamp2 = new Date('2025-11-14T10:00:00Z'); // Reversed
      
      const speed = calculateSpeedFromTimestamps(timeStamp1, timeStamp2);
      
      expect(speed).toBe(180); // Should still work
    });

    test('should round to 2 decimal places', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:00:15Z'); // 15 seconds
      
      // Speed = (1000m / 15s) * 3.6 = 240 km/h (exact)
      const speed = calculateSpeedFromTimestamps(timeStamp1, timeStamp2);
      
      expect(speed).toBe(240);
    });

    test('should throw error for null timeStamp1', () => {
      const timeStamp2 = new Date('2025-11-14T10:00:20Z');
      
      expect(() => {
        calculateSpeedFromTimestamps(null, timeStamp2);
      }).toThrow('timestamps cannot be null');
    });

    test('should throw error for null timeStamp2', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      
      expect(() => {
        calculateSpeedFromTimestamps(timeStamp1, null);
      }).toThrow('timestamps cannot be null');
    });

    test('should throw error for non-Date objects', () => {
      const invalidTimestamp = '2025-11-14T10:00:00Z'; // String, not Date
      const validTimestamp = new Date('2025-11-14T10:00:20Z');
      
      expect(() => {
        calculateSpeedFromTimestamps(invalidTimestamp, validTimestamp);
      }).toThrow('must be Date objects');
    });

    test('should throw error for identical timestamps', () => {
      const timeStamp = new Date('2025-11-14T10:00:00Z');
      
      expect(() => {
        calculateSpeedFromTimestamps(timeStamp, timeStamp);
      }).toThrow('timestamps cannot be identical');
    });

    test('should throw error for invalid distance', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:00:20Z');
      
      expect(() => {
        calculateSpeedFromTimestamps(timeStamp1, timeStamp2, 0); // Invalid distance
      }).toThrow('distance must be greater than 0');
    });

    test('should throw error for negative distance', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:00:20Z');
      
      expect(() => {
        calculateSpeedFromTimestamps(timeStamp1, timeStamp2, -500);
      }).toThrow('distance must be greater than 0');
    });

    test('should handle custom distance parameter', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:00:10Z'); // 10 seconds
      
      // Speed = (2000m / 10s) * 3.6 = 720 km/h (with custom 2000m distance)
      const speed = calculateSpeedFromTimestamps(timeStamp1, timeStamp2, 2000);
      
      expect(speed).toBe(720);
    });

    test('should calculate slow speed correctly', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:01:40Z'); // 100 seconds
      
      // Speed = (1000m / 100s) * 3.6 = 36 km/h
      const speed = calculateSpeedFromTimestamps(timeStamp1, timeStamp2);
      
      expect(speed).toBe(36);
    });

  });
});
```

---

### 2. Speed Limit Service Tests

```javascript
// src/__tests__/speedLimitService.test.js

import { getSpeedLimit } from '../services/speedLimitService';

describe('speedLimitService', () => {
  
  describe('getSpeedLimit', () => {
    
    test('should return correct speed limit for valid location', () => {
      const limit = getSpeedLimit('Baner');
      
      expect(limit).toBe(120);
    });

    test('should handle case-insensitive location matching', () => {
      const limit1 = getSpeedLimit('baner');
      const limit2 = getSpeedLimit('BANER');
      const limit3 = getSpeedLimit('Baner');
      
      expect(limit1).toBe(120);
      expect(limit2).toBe(120);
      expect(limit3).toBe(120);
    });

    test('should return speed limit for Wakad', () => {
      const limit = getSpeedLimit('Wakad');
      
      expect(limit).toBe(95);
    });

    test('should return speed limit for Kothrud', () => {
      const limit = getSpeedLimit('Kothrud');
      
      expect(limit).toBe(50);
    });

    test('should throw error for null location', () => {
      expect(() => {
        getSpeedLimit(null);
      }).toThrow('Invalid Location Details');
    });

    test('should throw error for undefined location', () => {
      expect(() => {
        getSpeedLimit(undefined);
      }).toThrow('Invalid Location Details');
    });

    test('should throw error for empty string location', () => {
      expect(() => {
        getSpeedLimit('');
      }).toThrow('Invalid Location Details');
    });

    test('should throw error for non-existent location', () => {
      expect(() => {
        getSpeedLimit('Unknown City');
      }).toThrow('Speed limit not found for location: Unknown City');
    });

    test('should throw error for location with typo', () => {
      expect(() => {
        getSpeedLimit('Baneer'); // Typo: extra 'e'
      }).toThrow('Speed limit not found for location: Baneer');
    });

  });
});
```

---

### 3. Violation Detector Service Tests

```javascript
// src/__tests__/violationDetectorService.test.js

import { checkViolation } from '../services/violationDetectorService';

describe('violationDetectorService', () => {
  
  describe('checkViolation', () => {
    
    test('should detect violation when speed exceeds limit', () => {
      const result = checkViolation(120, 100); // 120 > 100
      
      expect(result.isViolated).toBe(true);
      expect(result.speedDifference).toBe(20);
    });

    test('should not detect violation when speed equals limit', () => {
      const result = checkViolation(100, 100); // 100 = 100
      
      expect(result.isViolated).toBe(false);
      expect(result.speedDifference).toBe(0);
    });

    test('should not detect violation when speed is below limit', () => {
      const result = checkViolation(80, 100); // 80 < 100
      
      expect(result.isViolated).toBe(false);
      expect(result.speedDifference).toBe(-20);
    });

    test('should calculate correct speed difference', () => {
      const result = checkViolation(125.5, 100); // Difference = 25.5
      
      expect(result.speedDifference).toBe(25.5);
    });

    test('should round speed difference to 2 decimals', () => {
      const result = checkViolation(100.555, 50); // Difference = 50.555
      
      expect(result.speedDifference).toBe(50.56);
    });

    test('should throw error for null vehicle speed', () => {
      expect(() => {
        checkViolation(null, 100);
      }).toThrow('Invalid vehicle speed');
    });

    test('should throw error for null speed limit', () => {
      expect(() => {
        checkViolation(100, null);
      }).toThrow('Invalid Speed Limit');
    });

    test('should throw error for negative vehicle speed', () => {
      expect(() => {
        checkViolation(-50, 100);
      }).toThrow('Invalid vehicle speed');
    });

    test('should throw error for negative speed limit', () => {
      expect(() => {
        checkViolation(100, -50);
      }).toThrow('Invalid Speed Limit');
    });

    test('should throw error for zero speed limit', () => {
      expect(() => {
        checkViolation(100, 0);
      }).toThrow('Invalid Speed Limit');
    });

  });
});
```

---

### 4. Fine Calculator Service Tests

```javascript
// src/__tests__/fineCalculatorService.test.js

import { calculateFine } from '../services/fineCalculatorService';

describe('fineCalculatorService', () => {
  
  describe('calculateFine', () => {
    
    test('should return 0 fine when not violated', () => {
      const fine = calculateFine('4wheeler', false);
      
      expect(fine).toBe(0);
    });

    test('should return correct fine for 2wheeler violation', () => {
      const fine = calculateFine('2wheeler', true);
      
      expect(fine).toBe(200);
    });

    test('should return correct fine for 4wheeler violation', () => {
      const fine = calculateFine('4wheeler', true);
      
      expect(fine).toBe(400);
    });

    test('should return correct fine for bus violation', () => {
      const fine = calculateFine('bus', true);
      
      expect(fine).toBe(600);
    });

    test('should return correct fine for truck violation', () => {
      const fine = calculateFine('truck', true);
      
      expect(fine).toBe(800);
    });

    test('should handle case-insensitive vehicle types', () => {
      const fine1 = calculateFine('4wheeler', true);
      const fine2 = calculateFine('4WHEELER', true);
      const fine3 = calculateFine('4Wheeler', true);
      
      expect(fine1).toBe(400);
      expect(fine2).toBe(400);
      expect(fine3).toBe(400);
    });

    test('should throw error for invalid vehicle type', () => {
      expect(() => {
        calculateFine('auto', true);
      }).toThrow('vehicle type auto not found in fine mapping');
    });

    test('should throw error for null vehicle type', () => {
      expect(() => {
        calculateFine(null, true);
      }).toThrow();
    });

    test('should throw error for empty vehicle type', () => {
      expect(() => {
        calculateFine('', true);
      }).toThrow();
    });

    test('should return 0 even for invalid type if not violated', () => {
      // This tests if we handle the isViolated check first
      const fine = calculateFine('4wheeler', false);
      
      expect(fine).toBe(0);
    });

  });
});
```

---

### 5. Traffic Processor Service Tests

```javascript
// src/__tests__/trafficProcessorService.test.js

import { processSingleVehicle } from '../services/trafficProcessorService';
import { reportViolationDatabase, clearViolatonRecord } from '../data/reportViolationDatabase';

describe('trafficProcessorService', () => {
  
  beforeEach(() => {
    // Clear database before each test
    clearViolatonRecord();
  });
  
  describe('processSingleVehicle', () => {
    
    test('should process vehicle and return valid report', () => {
      const vehicle = {
        vehicleID: 'TEST-001',
        vehicleType: '4wheeler',
        ownerPhone: '9999999999',
        location: 'Baner',
        cameraCapture: {
          timeStamp1: new Date('2025-11-14T10:00:00Z'),
          timeStamp2: new Date('2025-11-14T10:00:20Z') // 180 km/h speed
        }
      };
      
      const report = processSingleVehicle(vehicle);
      
      expect(report).not.toBeNull();
      expect(report.vehicleID).toBe('TEST-001');
      expect(report.calculatedSpeed).toBe(180);
      expect(report.speedLimit).toBe(120);
      expect(report.isViolated).toBe(true);
      expect(report.fineAmount).toBe(400);
    });

    test('should detect compliant vehicle (no violation)', () => {
      const vehicle = {
        vehicleID: 'TEST-002',
        vehicleType: '2wheeler',
        ownerPhone: '8888888888',
        location: 'Kothrud',
        cameraCapture: {
          timeStamp1: new Date('2025-11-14T10:00:00Z'),
          timeStamp2: new Date('2025-11-14T10:01:40Z') // 36 km/h speed, limit 50
        }
      };
      
      const report = processSingleVehicle(vehicle);
      
      expect(report.isViolated).toBe(false);
      expect(report.fineAmount).toBe(0);
      expect(report.status).toBe('COMPLIANT');
    });

    test('should save report to databaseB', () => {
      clearViolatonRecord();
      
      const vehicle = {
        vehicleID: 'TEST-003',
        vehicleType: 'bus',
        ownerPhone: '7777777777',
        location: 'Wakad',
        cameraCapture: {
          timeStamp1: new Date('2025-11-14T10:00:00Z'),
          timeStamp2: new Date('2025-11-14T10:00:30Z') // 120 km/h, limit 95
        }
      };
      
      processSingleVehicle(vehicle);
      
      expect(reportViolationDatabase.length).toBe(1);
      expect(reportViolationDatabase[0].vehicleID).toBe('TEST-003');
    });

    test('should return null on error', () => {
      const invalidVehicle = {
        vehicleID: 'TEST-004',
        vehicleType: 'invalid-type',
        ownerPhone: '6666666666',
        location: 'Baner',
        cameraCapture: {
          timeStamp1: new Date('2025-11-14T10:00:00Z'),
          timeStamp2: new Date('2025-11-14T10:00:20Z')
        }
      };
      
      const report = processSingleVehicle(invalidVehicle);
      
      expect(report).toBeNull();
    });

    test('should handle missing location gracefully', () => {
      const vehicle = {
        vehicleID: 'TEST-005',
        vehicleType: '4wheeler',
        ownerPhone: '5555555555',
        location: 'NonExistentCity',
        cameraCapture: {
          timeStamp1: new Date('2025-11-14T10:00:00Z'),
          timeStamp2: new Date('2025-11-14T10:00:20Z')
        }
      };
      
      const report = processSingleVehicle(vehicle);
      
      expect(report).toBeNull();
    });

    test('should include processedAt timestamp', () => {
      const vehicle = {
        vehicleID: 'TEST-006',
        vehicleType: '4wheeler',
        ownerPhone: '4444444444',
        location: 'Baner',
        cameraCapture: {
          timeStamp1: new Date('2025-11-14T10:00:00Z'),
          timeStamp2: new Date('2025-11-14T10:00:20Z')
        }
      };
      
      const report = processSingleVehicle(vehicle);
      
      expect(report.processedAt).toBeDefined();
      expect(new Date(report.processedAt)).toBeInstanceOf(Date);
    });

  });
});
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- speedCalculatorService.test.js
```

---

## Expected Test Coverage

After writing all tests, you should achieve:

```
Statements   : 85%+ 
Branches     : 80%+ 
Functions    : 90%+ 
Lines        : 85%+
```

---

## Key Testing Concepts Used

1. **Arrange-Act-Assert (AAA)**
   ```javascript
   // Arrange - Set up test data
   const timeStamp1 = new Date('2025-11-14T10:00:00Z');
   
   // Act - Execute function
   const speed = calculateSpeedFromTimestamps(timeStamp1, timeStamp2);
   
   // Assert - Verify results
   expect(speed).toBe(180);
   ```

2. **Error Testing**
   ```javascript
   expect(() => {
     // Code that should throw
   }).toThrow('Error message');
   ```

3. **Boundary Testing**
   - Null values
   - Empty strings
   - Zero values
   - Negative values
   - Edge cases

4. **State Testing with beforeEach**
   ```javascript
   beforeEach(() => {
     clearViolatonRecord();  // Reset state before each test
   });
   ```

---

## Next Steps

1. Create `src/__tests__/` directory
2. Create test files for each service
3. Run `npm test` to verify
4. Aim for 80%+ coverage
5. Add more edge cases as you think of them

This approach tests everything **without needing real APIs or databases**!
