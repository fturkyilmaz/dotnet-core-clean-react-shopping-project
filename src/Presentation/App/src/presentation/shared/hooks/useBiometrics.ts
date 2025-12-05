import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';

export const useBiometrics = () => {
    const [isCompatible, setIsCompatible] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType | null>(null);

    useEffect(() => {
        checkDeviceCompatibility();
    }, []);

    const checkDeviceCompatibility = async () => {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsCompatible(compatible);

            if (compatible) {
                const enrolled = await LocalAuthentication.isEnrolledAsync();
                setIsEnrolled(enrolled);

                const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
                if (types.length > 0) {
                    // Prioritize FaceID if available, otherwise TouchID/Fingerprint
                    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                        setBiometricType(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
                    } else {
                        setBiometricType(types[0]);
                    }
                }
            }
        } catch (error) {
            console.error('Biometrics check failed:', error);
        }
    };

    const authenticate = async (onSuccess: () => void) => {
        try {
            if (!isCompatible || !isEnrolled) {
                Alert.alert(
                    'Biometrics Unavailable',
                    'Your device does not support biometrics or none are enrolled.'
                );
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login with Biometrics',
                fallbackLabel: 'Use Passcode',
                cancelLabel: 'Cancel',
                disableDeviceFallback: false,
            });

            if (result.success) {
                onSuccess();
            } else if (result.error !== 'user_cancel') {
                // Don't show alert for user cancellation
                Alert.alert('Authentication Failed', 'Please try again.');
            }
        } catch (error) {
            console.error('Biometric authentication error:', error);
            Alert.alert('Error', 'An error occurred during authentication.');
        }
    };

    return {
        isCompatible,
        isEnrolled,
        biometricType,
        authenticate,
        biometricName: biometricType === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION 
            ? (Platform.OS === 'ios' ? 'Face ID' : 'Face Unlock')
            : (Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint'),
    };
};
