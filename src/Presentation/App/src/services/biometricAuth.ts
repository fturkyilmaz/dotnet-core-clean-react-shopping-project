import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometryType?: LocalAuthentication.AuthenticationType;
}

export interface BiometricAvailability {
  hasHardware: boolean;
  isEnrolled: boolean;
  biometryType?: LocalAuthentication.AuthenticationType;
}

class BiometricAuthService {
  /**
   * Check if device supports biometric authentication
   */
  async checkAvailability(): Promise<BiometricAvailability> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      let biometryType;
      if (hasHardware && isEnrolled) {
        const compatible = await LocalAuthentication.compatibleAuthenticationTypesAsync();
        biometryType = compatible?.[0];
      }

      return {
        hasHardware,
        isEnrolled,
        biometryType,
      };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return {
        hasHardware: false,
        isEnrolled: false,
      };
    }
  }

  /**
   * Authenticate user using biometric
   */
  async authenticate(): Promise<BiometricAuthResult> {
    try {
      const availability = await this.checkAvailability();
      
      if (!availability.hasHardware || !availability.isEnrolled) {
        return {
          success: false,
          error: 'Biometric authentication not available on this device',
          biometryType: availability.biometryType,
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue shopping',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      return {
        success: result.success,
        biometryType: availability.biometryType,
        error: result.success ? undefined : 'Authentication failed',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
      console.error('Biometric authentication error:', error);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Authenticate with custom options
   */
  async authenticateWithOptions(options: {
    promptMessage?: string;
    fallbackLabel?: string;
    disableDeviceFallback?: boolean;
  }): Promise<BiometricAuthResult> {
    try {
      const availability = await this.checkAvailability();
      
      if (!availability.hasHardware || !availability.isEnrolled) {
        return {
          success: false,
          error: 'Biometric authentication not available',
          biometryType: availability.biometryType,
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: options.promptMessage || 'Authenticate to continue',
        fallbackLabel: options.fallbackLabel || 'Use passcode',
        disableDeviceFallback: options.disableDeviceFallback ?? false,
      });

      return {
        success: result.success,
        biometryType: availability.biometryType,
        error: result.success ? undefined : 'Authentication failed',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get human-readable biometry type name
   */
  getBiometryTypeName(type?: LocalAuthentication.AuthenticationType): string {
    if (!type) return 'Unknown';
    
    switch (type) {
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return 'Fingerprint';
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return 'Face Recognition';
      case LocalAuthentication.AuthenticationType.IRIS:
        return 'Iris Recognition';
      default:
        return 'Biometric';
    }
  }
}

export const biometricAuthService = new BiometricAuthService();
