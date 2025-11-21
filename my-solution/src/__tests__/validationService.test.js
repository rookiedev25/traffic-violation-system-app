import {
  validateLocation,
  validateSpeedLimit,
  validateVehicleSpeed,
  validateVehicleType,
  validateViolationReport,
  VALIDATION_RULES,
} from '../services/validationService';

describe('validationService', () => {
  describe('validateLocation', () => {
    test('should accept valid location (Hinjewadi)', () => {
      expect(() => validateLocation('Hinjewadi')).not.toThrow();
    });

    test('should accept valid location (case-insensitive)', () => {
      expect(() => validateLocation('HINJEWADI')).not.toThrow();
    });

    test('should reject invalid location', () => {
      expect(() => validateLocation('RandomCity')).toThrow(
        /Invalid location: "RandomCity"/
      );
    });

    test('should reject null location', () => {
      expect(() => validateLocation(null)).toThrow(
        /Location must be a non-empty string/
      );
    });

    test('should reject undefined location', () => {
      expect(() => validateLocation(undefined)).toThrow(
        /Location must be a non-empty string/
      );
    });
  });

  describe('validateSpeedLimit', () => {
    test('should accept realistic speed limit (120)', () => {
      expect(() => validateSpeedLimit(120)).not.toThrow();
    });

    test('should accept minimum speed limit (20)', () => {
      expect(() => validateSpeedLimit(20)).not.toThrow();
    });

    test('should accept maximum speed limit (150)', () => {
      expect(() => validateSpeedLimit(150)).not.toThrow();
    });

    test('should reject speed limit too low (10)', () => {
      expect(() => validateSpeedLimit(10)).toThrow(
        /Speed limit 10 km\/h is too low/
      );
    });

    test('should reject unrealistic speed limit (1000)', () => {
      expect(() => validateSpeedLimit(1000)).toThrow(
        /Speed limit 1000 km\/h is unrealistic/
      );
    });

    test('should reject negative speed limit', () => {
      expect(() => validateSpeedLimit(-50)).toThrow(
        /Speed limit must be a positive number/
      );
    });

    test('should reject non-numeric speed limit', () => {
      expect(() => validateSpeedLimit('120')).toThrow(
        /Speed limit must be a positive number/
      );
    });
  });

  describe('validateVehicleSpeed', () => {
    test('should accept realistic vehicle speed (100)', () => {
      expect(() => validateVehicleSpeed(100)).not.toThrow();
    });

    test('should accept high but realistic speed (250)', () => {
      expect(() => validateVehicleSpeed(250)).not.toThrow();
    });

    test('should accept maximum realistic speed (300)', () => {
      expect(() => validateVehicleSpeed(300)).not.toThrow();
    });

    test('should reject unrealistic vehicle speed (500)', () => {
      expect(() => validateVehicleSpeed(500)).toThrow(
        /Vehicle speed 500 km\/h is unrealistic/
      );
    });

    test('should reject negative vehicle speed', () => {
      expect(() => validateVehicleSpeed(-50)).toThrow(
        /Vehicle speed must be a positive number/
      );
    });

    test('should reject non-numeric vehicle speed', () => {
      expect(() => validateVehicleSpeed('100')).toThrow(
        /Vehicle speed must be a positive number/
      );
    });
  });

  describe('validateVehicleType', () => {
    test('should accept 2wheeler', () => {
      expect(() => validateVehicleType('2wheeler')).not.toThrow();
    });

    test('should accept 4wheeler', () => {
      expect(() => validateVehicleType('4wheeler')).not.toThrow();
    });

    test('should accept bus', () => {
      expect(() => validateVehicleType('bus')).not.toThrow();
    });

    test('should accept truck', () => {
      expect(() => validateVehicleType('truck')).not.toThrow();
    });

    test('should accept vehicle type (case-insensitive)', () => {
      expect(() => validateVehicleType('TRUCK')).not.toThrow();
    });

    test('should reject invalid vehicle type', () => {
      expect(() => validateVehicleType('bicycle')).toThrow(
        /Invalid vehicle type: "bicycle"/
      );
    });

    test('should reject null vehicle type', () => {
      expect(() => validateVehicleType(null)).toThrow(
        /Vehicle type must be a non-empty string/
      );
    });
  });

  describe('validateViolationReport', () => {
    test('should pass validation for valid report', () => {
      const validReport = {
        vehicleID: 'MH-01-AB-1234',
        vehicleType: '4wheeler',
        location: 'Hinjewadi',
        speedLimit: 120,
        calculatedSpeed: 130,
        isViolated: true,
        speedDifference: 10,
        fineAmount: 400,
        status: 'VIOLATION',
      };

      const result = validateViolationReport(validReport);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should fail validation for unrealistic speed limit', () => {
      const invalidReport = {
        vehicleID: 'MH-01-AB-1234',
        vehicleType: '4wheeler',
        location: 'Wakad',
        speedLimit: 1000, // Invalid!
        calculatedSpeed: 130,
        isViolated: true,
        speedDifference: 10,
        fineAmount: 400,
        status: 'VIOLATION',
      };

      const result = validateViolationReport(invalidReport);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('unrealistic');
    });

    test('should fail validation for unrealistic vehicle speed', () => {
      const invalidReport = {
        vehicleID: 'MH-01-AB-1234',
        vehicleType: '4wheeler',
        location: 'Hinjewadi',
        speedLimit: 120,
        calculatedSpeed: 500, // Invalid!
        isViolated: true,
        speedDifference: 380,
        fineAmount: 400,
        status: 'VIOLATION',
      };

      const result = validateViolationReport(invalidReport);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('unrealistic');
    });

    test('should fail validation for invalid vehicle type', () => {
      const invalidReport = {
        vehicleID: 'MH-01-AB-1234',
        vehicleType: 'bicycle', // Invalid!
        location: 'Hinjewadi',
        speedLimit: 120,
        calculatedSpeed: 130,
        isViolated: true,
        speedDifference: 10,
        fineAmount: 400,
        status: 'VIOLATION',
      };

      const result = validateViolationReport(invalidReport);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should fail validation for invalid location', () => {
      const invalidReport = {
        vehicleID: 'MH-01-AB-1234',
        vehicleType: '4wheeler',
        location: 'RandomCity', // Invalid!
        speedLimit: 120,
        calculatedSpeed: 130,
        isViolated: true,
        speedDifference: 10,
        fineAmount: 400,
        status: 'VIOLATION',
      };

      const result = validateViolationReport(invalidReport);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should generate warning for extremely high speed difference', () => {
      const reportWithWarning = {
        vehicleID: 'MH-01-AB-1234',
        vehicleType: '4wheeler',
        location: 'Hinjewadi',
        speedLimit: 120,
        calculatedSpeed: 230, // Speed difference = 110 (> 100)
        isViolated: true,
        speedDifference: 110, // Warning threshold
        fineAmount: 400,
        status: 'VIOLATION',
      };

      const result = validateViolationReport(reportWithWarning);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Extremely high speed difference');
    });

    test('should detect logic error when speed < limit but violation = true', () => {
      const logicErrorReport = {
        vehicleID: 'MH-01-AB-1234',
        vehicleType: '4wheeler',
        location: 'Hinjewadi',
        speedLimit: 120,
        calculatedSpeed: 100, // Below limit
        isViolated: true, // But marked as violation - logic error!
        speedDifference: -20,
        fineAmount: 400,
        status: 'VIOLATION',
      };

      const result = validateViolationReport(logicErrorReport);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Logic error');
    });

    test('should pass validation for compliant vehicle (speed < limit, isViolated = false)', () => {
      const compliantReport = {
        vehicleID: 'MH-01-AB-1234',
        vehicleType: '4wheeler',
        location: 'Hinjewadi',
        speedLimit: 120,
        calculatedSpeed: 100,
        isViolated: false,
        speedDifference: -20,
        fineAmount: 0,
        status: 'COMPLIANT',
      };

      const result = validateViolationReport(compliantReport);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('VALIDATION_RULES', () => {
    test('should have MIN_SPEED_LIMIT of 20', () => {
      expect(VALIDATION_RULES.MIN_SPEED_LIMIT).toBe(20);
    });

    test('should have MAX_SPEED_LIMIT of 150', () => {
      expect(VALIDATION_RULES.MAX_SPEED_LIMIT).toBe(150);
    });

    test('should have MAX_REALISTIC_VEHICLE_SPEED of 300', () => {
      expect(VALIDATION_RULES.MAX_REALISTIC_VEHICLE_SPEED).toBe(300);
    });

    test('should have valid vehicle types', () => {
      expect(VALIDATION_RULES.VALID_VEHICLE_TYPES).toContain('2wheeler');
      expect(VALIDATION_RULES.VALID_VEHICLE_TYPES).toContain('4wheeler');
      expect(VALIDATION_RULES.VALID_VEHICLE_TYPES).toContain('bus');
      expect(VALIDATION_RULES.VALID_VEHICLE_TYPES).toContain('truck');
    });
  });
});
