import { useState, useCallback } from 'react';
import { biometricAuthService, BiometricAuthResult, BiometricAvailability } from '@/infrastructure/services/BiometricAuthService';

export const useBiometricAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<BiometricAvailability | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check biometric availability on component mount
   */
  const checkAvailability = useCallback(async () => {
    try {
      setError(null);
      const result = await biometricAuthService.checkAvailability();
      setAvailability(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check biometric availability';
      setError(message);
      return null;
    }
  }, []);

  /**
   * Authenticate user with biometric
   */
  const authenticate = useCallback(async (): Promise<BiometricAuthResult> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!availability?.hasHardware || !availability?.isEnrolled) {
        const result: BiometricAuthResult = {
          success: false,
          error: 'Biometric authentication not available on this device',
        };
        setError(result.error ?? null);
        return result;
      }

      const result = await biometricAuthService.authenticate();
      
      if (!result.success && result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
      return {
        success: false,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  }, [availability]);

  /**
   * Authenticate with custom options
   */
  const authenticateWithOptions = useCallback(
    async (options: {
      promptMessage?: string;
      fallbackLabel?: string;
      disableDeviceFallback?: boolean;
    }): Promise<BiometricAuthResult> => {
      try {
        setIsLoading(true);
        setError(null);

        if (!availability?.hasHardware || !availability?.isEnrolled) {
          const result: BiometricAuthResult = {
            success: false,
            error: 'Biometric authentication not available on this device',
          };
          setError(result.error ?? null);
          return result;
        }

        const result = await biometricAuthService.authenticateWithOptions(options);
        
        if (!result.success && result.error) {
          setError(result.error);
        }

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Authentication failed';
        setError(message);
        return {
          success: false,
          error: message,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [availability]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get biometry type name
   */
  const getBiometryTypeName = useCallback(() => {
    if (!availability?.biometryType) return 'Unknown';
    return biometricAuthService.getBiometryTypeName(availability.biometryType);
  }, [availability]);

  return {
    // State
    isLoading,
    error,
    availability,
    
    // Methods
    checkAvailability,
    authenticate,
    authenticateWithOptions,
    clearError,
    getBiometryTypeName,
    
    // Helpers
    isAvailable: availability?.hasHardware && availability?.isEnrolled,
    hasHardware: availability?.hasHardware ?? false,
    isEnrolled: availability?.isEnrolled ?? false,
  };
};
