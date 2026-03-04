import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

interface BiometricLoginScreenProps {
  onAuthSuccess?: () => void;
  onAuthFailure?: (error: string) => void;
}

export const BiometricLoginScreen: React.FC<BiometricLoginScreenProps> = ({
  onAuthSuccess,
  onAuthFailure,
}) => {
  const {
    isLoading,
    error,
    availability,
    checkAvailability,
    authenticate,
    clearError,
    getBiometryTypeName,
    isAvailable,
  } = useBiometricAuth();

  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Check biometric availability on mount
    checkAvailability();
  }, [checkAvailability]);

  useEffect(() => {
    // Lock after 5 failed attempts
    if (attemptCount >= 5) {
      setIsLocked(true);
      Alert.alert(
        'Too Many Attempts',
        'Please try again later or use another authentication method.',
        [{ text: 'OK' }]
      );
    }
  }, [attemptCount]);

  const handleBiometricAuth = async () => {
    if (isLocked) {
      Alert.alert('Locked', 'Too many failed attempts. Please try again later.');
      return;
    }

    const result = await authenticate();

    if (result.success) {
      setAttemptCount(0);
      onAuthSuccess?.();
    } else {
      setAttemptCount(prev => prev + 1);
      onAuthFailure?.(result.error || 'Authentication failed');

      if (result.error) {
        Alert.alert('Authentication Failed', result.error, [
          {
            text: 'Retry',
            onPress: () => clearError(),
          },
        ]);
      }
    }
  };

  const handleFallback = () => {
    // Navigate to password login or other auth method
    if (__DEV__) {
      console.log('Fallback to password login');
    }
    onAuthFailure?.('Switched to password authentication');
  };

  if (!availability) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-3 text-gray-500">Checking biometric availability...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5 pb-10">
        {/* Header */}
        <View className="mb-8 items-center">
          <Text className="text-2xl font-bold text-black mb-2">Biometric Login</Text>
          <Text className="text-base text-gray-500 text-center">
            {isAvailable
              ? `Use ${getBiometryTypeName()} to log in`
              : 'Biometric authentication not available'}
          </Text>
        </View>

        {/* Status Information */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center py-2.5 border-b border-gray-100">
            <Text className="text-sm text-gray-500 font-medium">Biometric Hardware:</Text>
            <Text className={`text-sm font-semibold ${availability.hasHardware ? 'text-green-500' : 'text-gray-400'}`}>
              {availability.hasHardware ? '✓ Available' : '✗ Not Available'}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-2.5 border-b border-gray-100">
            <Text className="text-sm text-gray-500 font-medium">Enrolled Biometric:</Text>
            <Text className={`text-sm font-semibold ${availability.isEnrolled ? 'text-green-500' : 'text-gray-400'}`}>
              {availability.isEnrolled ? '✓ Yes' : '✗ No'}
            </Text>
          </View>

          {availability.biometryType && (
            <View className="flex-row justify-between items-center py-2.5">
              <Text className="text-sm text-gray-500 font-medium">Type:</Text>
              <Text className="text-sm font-semibold text-gray-400">{getBiometryTypeName()}</Text>
            </View>
          )}
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-50 rounded-xl p-4 mb-4">
            <Text className="text-red-500 mb-2">{error}</Text>
            <TouchableOpacity
              accessibilityLabel="Dismiss error message"
              accessibilityRole="button"
              onPress={clearError}
            >
              <Text className="text-blue-500 font-medium">Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Attempt Counter */}
        {attemptCount > 0 && (
          <View className="bg-orange-50 rounded-xl p-4 mb-4">
            <Text className="text-orange-600">
              Failed attempts: {attemptCount}/5
            </Text>
          </View>
        )}

        {/* Main Action Buttons */}
        <View className="gap-y-3">
          {isAvailable && !isLocked && (
            <TouchableOpacity
              accessibilityLabel={`Authenticate with ${getBiometryTypeName()}`}
              accessibilityRole="button"
              className="bg-blue-500 py-4 px-5 rounded-xl items-center"
              onPress={handleBiometricAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text className="text-white font-semibold text-base">Authenticate with {getBiometryTypeName()}</Text>
                  <Text className="text-white/80 text-sm mt-1">
                    {availability.hasHardware ? 'Place your finger or face' : 'Biometric unavailable'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Fallback Button */}
          <TouchableOpacity
            accessibilityLabel="Use password authentication instead"
            accessibilityRole="button"
            className="bg-gray-200 py-4 px-5 rounded-xl items-center"
            onPress={handleFallback}
            disabled={isLoading}
          >
            <Text className="text-gray-700 font-medium text-base">Use Password Instead</Text>
          </TouchableOpacity>

          {/* Retry Button */}
          {isLocked && (
            <TouchableOpacity
              accessibilityLabel="Unlock after too many failed attempts"
              accessibilityRole="button"
              className="bg-blue-500 py-4 px-5 rounded-xl items-center"
              onPress={() => {
                setAttemptCount(0);
                setIsLocked(false);
              }}
            >
              <Text className="text-white font-semibold text-base">Unlock</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Section */}
        <View className="mt-8">
          <Text className="text-base font-semibold mb-3">Why use biometric authentication?</Text>
          <View className="flex-row mb-2">
            <Text className="mr-2">•</Text>
            <Text className="text-gray-600">Faster and more convenient login</Text>
          </View>
          <View className="flex-row mb-2">
            <Text className="mr-2">•</Text>
            <Text className="text-gray-600">More secure than password-based login</Text>
          </View>
          <View className="flex-row">
            <Text className="mr-2">•</Text>
            <Text className="text-gray-600">Your biometric data stays on your device</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default BiometricLoginScreen;
