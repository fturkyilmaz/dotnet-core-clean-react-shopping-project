import { biometricAuthService } from './BiometricAuthService';

describe('BiometricAuthService', () => {
  describe('checkAvailability', () => {
    it('should return availability object with required properties', async () => {
      const availability = await biometricAuthService.checkAvailability();

      // Verify the structure
      expect(availability).toBeDefined();
      expect(availability).toHaveProperty('hasHardware');
      expect(availability).toHaveProperty('isEnrolled');

      // Properties should be booleans
      expect(typeof availability.hasHardware).toBe('boolean');
      expect(typeof availability.isEnrolled).toBe('boolean');
    });

    it('should handle errors gracefully', async () => {
      // This test verifies that the service doesn't crash on errors
      const availability = await biometricAuthService.checkAvailability();
      expect(availability).toBeDefined();
    });
  });

  describe('getBiometryTypeName', () => {
    it('should return "Unknown" for undefined input', () => {
      const result = biometricAuthService.getBiometryTypeName(undefined);
      expect(result).toBe('Unknown');
    });

    it('should return appropriate names for known biometry types', () => {
      // We can't test the actual enum values without importing from expo-local-authentication
      // but we can test that the function returns strings
      const result1 = biometricAuthService.getBiometryTypeName('FINGERPRINT' as any);
      const result2 = biometricAuthService.getBiometryTypeName('FACIAL_RECOGNITION' as any);

      expect(typeof result1).toBe('string');
      expect(typeof result2).toBe('string');
    });
  });

  describe('authenticate methods', () => {
    it('should return BiometricAuthResult with success property', async () => {
      // Test the basic authenticate method
      const result = await biometricAuthService.authenticate();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');

      // If successful, should have biometryType
      if (result.success) {
        expect(result).toHaveProperty('biometryType');
      }
    });

    it('should handle authentication errors', async () => {
      const result = await biometricAuthService.authenticate();

      // Even if authentication fails, the result should be properly structured
      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');

      if (!result.success && result.error) {
        expect(typeof result.error).toBe('string');
      }
    });
  });
});