import {
  isSpeedLimitRealistic,
  validateSpeedLimitRealism,
  VALIDATION_RULES,
} from '../services/validationService';

describe('validationService - Speed Limit Realism', () => {
  describe('VALIDATION_RULES', () => {
    test('should have correct speed limit boundaries', () => {
      expect(VALIDATION_RULES.MIN_REALISTIC_SPEED_LIMIT).toBe(10);
      expect(VALIDATION_RULES.MAX_REALISTIC_SPEED_LIMIT).toBe(200);
    });
  });

  describe('isSpeedLimitRealistic', () => {
    test('should accept valid speed limits (20 km/h)', () => {
      expect(isSpeedLimitRealistic(20)).toBe(true);
    });

    test('should accept valid speed limits (80 km/h)', () => {
      expect(isSpeedLimitRealistic(80)).toBe(true);
    });

    test('should accept maximum valid speed limit (200 km/h)', () => {
      expect(isSpeedLimitRealistic(200)).toBe(true);
    });

    test('should accept speed limit just above minimum (10 km/h)', () => {
      expect(isSpeedLimitRealistic(10)).toBe(true);
    });

    test('should reject single-digit speed limit (9 km/h)', () => {
      expect(isSpeedLimitRealistic(9)).toBe(false);
    });

    test('should reject single-digit speed limit (5 km/h)', () => {
      expect(isSpeedLimitRealistic(5)).toBe(false);
    });

    test('should reject single-digit speed limit (1 km/h)', () => {
      expect(isSpeedLimitRealistic(1)).toBe(false);
    });

    test('should reject negative speed limits (-50 km/h)', () => {
      expect(isSpeedLimitRealistic(-50)).toBe(false);
    });

    test('should reject unrealistic speed limits (201 km/h)', () => {
      expect(isSpeedLimitRealistic(201)).toBe(false);
    });

    test('should reject extremely unrealistic speed limits (1000 km/h)', () => {
      expect(isSpeedLimitRealistic(1000)).toBe(false);
    });

    test('should reject non-numeric speed limits (null)', () => {
      expect(isSpeedLimitRealistic(null)).toBe(false);
    });

    test('should reject non-numeric speed limits (undefined)', () => {
      expect(isSpeedLimitRealistic(undefined)).toBe(false);
    });

    test('should reject string speed limits', () => {
      expect(isSpeedLimitRealistic('120')).toBe(false);
    });
  });

  describe('validateSpeedLimitRealism', () => {
    test('should return realistic=true for valid speed limit (85 km/h)', () => {
      const result = validateSpeedLimitRealism({ speedLimit: 85 });
      expect(result.isRealistic).toBe(true);
      expect(result.message).toBeNull();
    });

    test('should return realistic=false for zero speed limit', () => {
      const result = validateSpeedLimitRealism({ speedLimit: 0 });
      expect(result.isRealistic).toBe(false);
      expect(result.message).toContain('unrealistic');
      expect(result.message).toContain('10-200');
    });

    test('should return realistic=false for negative speed limit', () => {
      const result = validateSpeedLimitRealism({ speedLimit: -50 });
      expect(result.isRealistic).toBe(false);
      expect(result.message).toContain('unrealistic');
    });

    test('should return realistic=false for speed limit > 200 km/h', () => {
      const result = validateSpeedLimitRealism({ speedLimit: 250 });
      expect(result.isRealistic).toBe(false);
      expect(result.message).toContain('unrealistic');
      expect(result.message).toContain('10-200');
    });

    test('should return realistic=false for extremely unrealistic speed limit (1000 km/h)', () => {
      const result = validateSpeedLimitRealism({ speedLimit: 1000 });
      expect(result.isRealistic).toBe(false);
      expect(result.message).toContain('Speed limit 1000 km/h is unrealistic');
    });

    test('should include speed limit value in error message', () => {
      const result = validateSpeedLimitRealism({ speedLimit: 300 });
      expect(result.message).toContain('300');
    });

    test('should reject single-digit speed limits (1 km/h)', () => {
      const result = validateSpeedLimitRealism({ speedLimit: 1 });
      expect(result.isRealistic).toBe(false);
      expect(result.message).toContain('single-digit');
    });

    test('should reject single-digit speed limits (9 km/h)', () => {
      const result = validateSpeedLimitRealism({ speedLimit: 9 });
      expect(result.isRealistic).toBe(false);
      expect(result.message).toContain('single-digit');
    });
  });

  describe('Edge cases', () => {
    test('should accept speed limit of exactly 200 km/h', () => {
      const result = validateSpeedLimitRealism({ speedLimit: 200 });
      expect(result.isRealistic).toBe(true);
    });

    test('should reject speed limit of 200.1 km/h', () => {
      const result = validateSpeedLimitRealism({ speedLimit: 200.1 });
      expect(result.isRealistic).toBe(false);
    });

    test('should accept decimal speed limits (95.5 km/h)', () => {
      expect(isSpeedLimitRealistic(95.5)).toBe(true);
    });

    test('should reject very small speed limits (0.001 km/h - single digit)', () => {
      expect(isSpeedLimitRealistic(0.001)).toBe(false);
    });

    test('should accept speed limit of exactly 10 km/h (minimum)', () => {
      expect(isSpeedLimitRealistic(10)).toBe(true);
    });
  });
});
