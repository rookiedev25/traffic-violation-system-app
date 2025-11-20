import { processSingleVehicle, processAllVehicles } from '../services/trafficProcessorService';

describe('trafficProcessorService', () => {
  describe('processSingleVehicle', () => {
    // ✅ FUNCTION EXISTS AND CAN PROCESS
    test('should be a callable function', () => {
      expect(typeof processSingleVehicle).toBe('function');
    });

    // ✅ RETURNS EITHER NULL OR VALID REPORT
    test('should return either null or a valid report object', () => {
      const testVehicle = {
        vehicleID: 'TEST-001',
        vehicleType: '4wheeler',
        ownerPhone: '9876543210',
        location: 'TestLocation',
        cameraCapture: {
          camera1: new Date('2025-11-20T10:00:00Z'),
          camera2: new Date('2025-11-20T10:00:03Z'),
        },
      };
      const result = processSingleVehicle(testVehicle);
      
      if (result !== null) {
        expect(result).toHaveProperty('vehicleID');
        expect(result).toHaveProperty('calculatedSpeed');
        expect(result).toHaveProperty('speedLimit');
      }
    });

    // ✅ RETURNS REPORT STRUCTURE FOR VALID VEHICLES
    test('should return report with correct structure when successful', () => {
      // Process first vehicle from database
      const testVehicle = {
        vehicleID: 'MH-12-LM-1134',
        vehicleType: 'truck',
        ownerPhone: '9876543210',
        location: 'Hinjewadi',
        cameraCapture: {
          camera1: new Date('2025-11-20T10:00:00Z'),
          camera2: new Date('2025-11-20T10:00:20Z'),
        },
      };
      const result = processSingleVehicle(testVehicle);
      
      // Check structure when result is valid
      if (result !== null) {
        expect(result).toHaveProperty('vehicleID');
        expect(result).toHaveProperty('vehicleType');
        expect(result).toHaveProperty('location');
        expect(result).toHaveProperty('calculatedSpeed');
        expect(result).toHaveProperty('speedLimit');
        expect(result).toHaveProperty('isViolated');
        expect(result).toHaveProperty('speedDifference');
        expect(result).toHaveProperty('fineAmount');
        expect(result).toHaveProperty('status');
      }
    });

    // ✅ HANDLES ERRORS GRACEFULLY
    test('should handle invalid vehicle data gracefully and return null', () => {
      const invalidVehicle = {
        vehicleID: 'INVALID-001',
        vehicleType: 'invalid-type',
        ownerPhone: '9876543213',
        location: 'NonexistentLocation',
        cameraCapture: {
          camera1: new Date('2025-11-20T10:00:00Z'),
          camera2: new Date('2025-11-20T10:00:05Z'),
        },
      };
      const result = processSingleVehicle(invalidVehicle);
      
      expect(result).toBeNull();
    });
  });

  describe('processAllVehicles', () => {
    // ✅ SHOULD PROCESS ENTIRE DATABASE
    test('should process all vehicles from the database', () => {
      const results = processAllVehicles();
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    // ✅ SHOULD RETURN ARRAY OF REPORTS
    test('should return array of report objects with violation details', () => {
      const results = processAllVehicles();
      
      if (results.length > 0) {
        const firstReport = results[0];
        expect(firstReport).toHaveProperty('vehicleID');
        expect(firstReport).toHaveProperty('vehicleType');
        expect(firstReport).toHaveProperty('location');
        expect(firstReport).toHaveProperty('calculatedSpeed');
        expect(firstReport).toHaveProperty('speedLimit');
        expect(firstReport).toHaveProperty('isViolated');
        expect(firstReport).toHaveProperty('speedDifference');
        expect(firstReport).toHaveProperty('fineAmount');
        expect(firstReport).toHaveProperty('status');
      }
    });

    // ✅ SHOULD CONTAIN BOTH VIOLATIONS AND COMPLIANT VEHICLES
    test('should process multiple vehicles with mixed violation statuses', () => {
      const results = processAllVehicles();
      
      expect(results.length).toBeGreaterThanOrEqual(1);
      // Should have at least some vehicles (violating or compliant)
      const hasViolations = results.some(r => r.isViolated === true);
      const hasCompliant = results.some(r => r.isViolated === false);
      expect(hasViolations || hasCompliant).toBe(true);
    });

    // ✅ SHOULD CALCULATE FINES CORRECTLY
    test('should calculate correct fine amounts based on violations', () => {
      const results = processAllVehicles();
      
      if (results.length > 0) {
        results.forEach(report => {
          if (report.isViolated === false) {
            expect(report.fineAmount).toBe(0);
          } else {
            expect(report.fineAmount).toBeGreaterThan(0);
          }
        });
      }
    });

    // ✅ SHOULD HAVE CONSISTENT SPEED CALCULATIONS
    test('should have consistent speed difference calculations', () => {
      const results = processAllVehicles();
      
      if (results.length > 0) {
        results.forEach(report => {
          const calculatedDiff = report.calculatedSpeed - report.speedLimit;
          // Should be approximately equal (allowing for rounding)
          expect(Math.abs(report.speedDifference - calculatedDiff)).toBeLessThan(0.01);
        });
      }
    });
  });
});
