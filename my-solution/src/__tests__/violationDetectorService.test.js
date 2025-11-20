import { checkViolation } from '../services/violationDetectorService';

describe('violationDetectorService', () => {
  describe('checkViolation', () => {
    // ✅ HAPPY PATH TESTS - VIOLATION DETECTED
    test('should detect violation when speed exceeds limit', () => {
      const result = checkViolation(120, 100);
      expect(result.isViolated).toBe(true);
      expect(result.speedDifference).toBe(20);
    });

    test('should calculate correct speed difference for high violation', () => {
      const result = checkViolation(150, 80);
      expect(result.isViolated).toBe(true);
      expect(result.speedDifference).toBe(70);
    });

    // ✅ BOUNDARY TESTS - NO VIOLATION
    test('should not detect violation when speed equals limit', () => {
      const result = checkViolation(100, 100);
      expect(result.isViolated).toBe(false);
      expect(result.speedDifference).toBe(0);
    });

    test('should not detect violation when speed is below limit', () => {
      const result = checkViolation(80, 100);
      expect(result.isViolated).toBe(false);
      expect(result.speedDifference).toBe(-20);
    });

    test('should round speed difference to 2 decimal places', () => {
      const result = checkViolation(85.456, 80);
      expect(result.isViolated).toBe(true);
      expect(result.speedDifference).toBe(5.46);
    });

    // ✅ EDGE CASES
    test('should round very small speed differences to 2 decimals', () => {
      const result = checkViolation(100.123, 100);
      expect(result.speedDifference).toBe(0.12);
    });

    test('should handle large decimal speed values correctly', () => {
      const result = checkViolation(125.789, 100.123);
      expect(result.isViolated).toBe(true);
      expect(result.speedDifference).toBe(25.67);
    });

    test('should handle decimal speed values correctly', () => {
      const result = checkViolation(95.75, 90.25);
      expect(result.isViolated).toBe(true);
      expect(result.speedDifference).toBe(5.5);
    });

  });
});
