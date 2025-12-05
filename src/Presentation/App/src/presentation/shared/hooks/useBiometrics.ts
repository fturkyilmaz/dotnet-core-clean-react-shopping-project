import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';

export const useBiometrics = () => {
  const [isCompatible, setIsCompatible] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [biometricType, setBiometricType] =
    useState<LocalAuthentication.AuthenticationType | null>(null);

  /**
   * Resolve biometric type with priority (FaceID > others)
   */
  const resolveBiometricType = (types: LocalAuthentication.AuthenticationType[]) => {
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION;
    }
    return types[0] ?? null;
  };

  /**
   * Check device compatibility
   */
  const checkDeviceCompatibility = useCallback(async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsCompatible(compatible);

      if (!compatible) return;

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsEnrolled(enrolled);

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.length > 0) {
        setBiometricType(resolveBiometricType(types));
      }
    } catch (error) {
      console.error('[Biometrics] Compatibility check failed:', error);
    }
  }, []);

  useEffect(() => {
    checkDeviceCompatibility();
  }, [checkDeviceCompatibility]);

  /**
   * Authenticate user with biometrics
   */
  const authenticate = useCallback(async (): Promise<boolean> => {
    try {
      if (!isCompatible || !isEnrolled) {
        Alert.alert(
          'Biometrics Unavailable',
          'Your device does not support biometrics or none are enrolled.'
        );
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with Biometrics',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return true;
      }

      if (result.error !== 'user_cancel') {
        Alert.alert('Authentication Failed', 'Please try again.');
      }

      return false;
    } catch (error) {
      console.error('[Biometrics] Authentication error:', error);
      Alert.alert('Error', 'An error occurred during authentication.');
      return false;
    }
  }, [isCompatible, isEnrolled]);

  /**
   * Get biometric name for UI
   */
  const biometricName =
    biometricType === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      ? Platform.OS === 'ios'
        ? 'Face ID'
        : 'Face Unlock'
      : Platform.OS === 'ios'
      ? 'Touch ID'
      : 'Fingerprint';

  return {
    // State
    isCompatible,
    isEnrolled,
    biometricType,

    // Methods
    checkDeviceCompatibility,
    authenticate,

    // Helpers
    biometricName,
    isAvailable: isCompatible && isEnrolled,
  };
};
