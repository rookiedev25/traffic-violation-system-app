import { getSpeedLimit } from '../services/speedLimitService';

describe('speedLimitService', () => {
  describe('getSpeedLimit', () => {
    // ✅ HAPPY PATH TESTS
    test('should return correct speed limit for valid location (Hinjewadi)', () => {
      const result = getSpeedLimit('Hinjewadi');
      expect(result).toBe(120);
    });

    test('should return correct speed limit for valid location (Aundh)', () => {
      const result = getSpeedLimit('Aundh');
      expect(result).toBe(70);
    });

    test('should return correct speed limit for valid location (Viman Nagar)', () => {
      const result = getSpeedLimit('Viman Nagar');
      expect(result).toBe(85);
    });

    test('should return correct speed limit for valid location (Bibwewadi)', () => {
      const result = getSpeedLimit('Bibwewadi');
      expect(result).toBe(40);
    });

    // ✅ BOUNDARY TESTS - CASE INSENSITIVITY
    test('should handle case-insensitive location names (uppercase)', () => {
      const result = getSpeedLimit('HINJEWADI');
      expect(result).toBe(120);
    });

    test('should handle case-insensitive location names (mixed case)', () => {
      const result = getSpeedLimit('AuNdH');
      expect(result).toBe(70);
    });

    test('should handle case-insensitive location names (with spaces)', () => {
      const result = getSpeedLimit('viman nagar');
      expect(result).toBe(85);
    });

    // ❌ NEGATIVE TESTS - INVALID INPUTS
    test('should throw error for non-existent location', () => {
      expect(() => {
        getSpeedLimit('invalid_location');
      }).toThrow('Please enter proper input values: Speed limit not found for the location invalid_location');
    });

    test('should throw error for null location', () => {
      expect(() => {
        getSpeedLimit(null);
      }).toThrow();
    });

    test('should throw error for undefined location', () => {
      expect(() => {
        getSpeedLimit(undefined);
      }).toThrow();
    });

  });
});
