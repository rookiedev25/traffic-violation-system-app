import { calculateFine } from '../services/fineCalculatorService';

describe('fineCalculatorService', () => {
  describe('calculateFine', () => {
    // ✅ HAPPY PATH TESTS - VIOLATIONS
    test('should return correct fine for 2wheeler violation', () => {
      const result = calculateFine('2wheeler', true);
      expect(result).toBe(200);
    });

    test('should return correct fine for 4wheeler violation', () => {
      const result = calculateFine('4wheeler', true);
      expect(result).toBe(400);
    });

    test('should return correct fine for bus violation', () => {
      const result = calculateFine('bus', true);
      expect(result).toBe(600);
    });

    test('should return correct fine for truck violation', () => {
      const result = calculateFine('truck', true);
      expect(result).toBe(800);
    });

    // ✅ NO VIOLATION - ZERO FINE
    test('should return 0 fine for 2wheeler with no violation', () => {
      const result = calculateFine('2wheeler', false);
      expect(result).toBe(0);
    });

    test('should return 0 fine for 4wheeler with no violation', () => {
      const result = calculateFine('4wheeler', false);
      expect(result).toBe(0);
    });

    test('should return 0 fine for bus with no violation', () => {
      const result = calculateFine('bus', false);
      expect(result).toBe(0);
    });

    // ✅ BOUNDARY TESTS - CASE INSENSITIVITY
    test('should handle case-insensitive vehicle type (uppercase)', () => {
      const result = calculateFine('2WHEELER', true);
      expect(result).toBe(200);
    });

    test('should handle case-insensitive vehicle type (mixed case)', () => {
      const result = calculateFine('TrUcK', true);
      expect(result).toBe(800);
    });

    // ❌ NEGATIVE TESTS - INVALID VEHICLE TYPE
    test('should throw error for invalid vehicle type', () => {
      expect(() => {
        calculateFine('bicycle', true);
      }).toThrow();
    });

  });
});
