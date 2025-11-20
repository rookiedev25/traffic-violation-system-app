// src/__tests__/speedCalculatorService.test.js

import { calculateSpeedFromTimestamps } from '../services/speedCalculatorService';

describe('speedCalculatorService', () => {
  
  describe('calculateSpeedFromTimestamps', () => {
    
    // ✅ HAPPY PATH TESTS
    test('should calculate speed correctly for valid timestamps', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:00:20Z'); // 20 seconds
      
      // Speed = (1000m / 20s) * 3.6 = 180 km/h
      const speed = calculateSpeedFromTimestamps(timeStamp1, timeStamp2);
      
      expect(speed).toBe(180);
    });

    test('should calculate slow speed correctly', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:01:40Z'); // 100 seconds
      
      // Speed = (1000m / 100s) * 3.6 = 36 km/h
      const speed = calculateSpeedFromTimestamps(timeStamp1, timeStamp2);
      
      expect(speed).toBe(36);
    });

    // ⚠️ BOUNDARY TESTS
    test('should handle reversed timestamps (uses Math.abs)', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:20Z');
      const timeStamp2 = new Date('2025-11-14T10:00:00Z'); // Reversed
      
      const speed = calculateSpeedFromTimestamps(timeStamp1, timeStamp2);
      
      expect(speed).toBe(180); // Should still work
    });

    test('should round to 2 decimal places', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:00:15Z'); // 15 seconds
      
      // Speed = (1000m / 15s) * 3.6 = 240 km/h
      const speed = calculateSpeedFromTimestamps(timeStamp1, timeStamp2);
      
      expect(speed).toBe(240);
    });

    test('should handle custom distance parameter', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:00:10Z'); // 10 seconds
      
      // Speed = (2000m / 10s) * 3.6 = 720 km/h (with custom 2000m distance)
      const speed = calculateSpeedFromTimestamps(timeStamp1, timeStamp2, 2000);
      
      expect(speed).toBe(720);
    });

    // ❌ NEGATIVE TESTS - NULL VALUES
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

    // ❌ NEGATIVE TESTS - INVALID TYPES
    test('should throw error for non-Date objects', () => {
      const invalidTimestamp = '2025-11-14T10:00:00Z'; // String, not Date
      const validTimestamp = new Date('2025-11-14T10:00:20Z');
      
      expect(() => {
        calculateSpeedFromTimestamps(invalidTimestamp, validTimestamp);
      }).toThrow('must be Date objects');
    });

    // ⚠️ BOUNDARY TEST - IDENTICAL TIMESTAMPS
    test('should throw error for identical timestamps', () => {
      const timeStamp = new Date('2025-11-14T10:00:00Z');
      
      expect(() => {
        calculateSpeedFromTimestamps(timeStamp, timeStamp);
      }).toThrow('timestamps cannot be identical');
    });

    // ❌ NEGATIVE TESTS - INVALID DISTANCE
    test('should throw error for zero distance', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:00:20Z');
      
      expect(() => {
        calculateSpeedFromTimestamps(timeStamp1, timeStamp2, 0);
      }).toThrow('Please enter proper input values: distance must be a positive number');
    });

    test('should throw error for negative distance', () => {
      const timeStamp1 = new Date('2025-11-14T10:00:00Z');
      const timeStamp2 = new Date('2025-11-14T10:00:20Z');
      
      expect(() => {
        calculateSpeedFromTimestamps(timeStamp1, timeStamp2, -500);
      }).toThrow('Please enter proper input values: distance must be a positive number');
    });

  });
});
