import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { BiometricLoginScreen } from '../screens/BiometricLoginScreen';

/**
 * Biometric Authentication Implementation Examples
 *
 * This file contains various examples of how to use biometric authentication
 * in different scenarios throughout the app.
 */

// Example 1: Simple Biometric Login Button
export const SimpleBiometricLoginButton = () => {
  const { authenticate, isLoading, isAvailable, getBiometryTypeName } = useBiometricAuth();

  const handlePress = async () => {
    const result = await authenticate();
    if (result.success) {
      // Authentication successful - proceed with login
      if (__DEV__) {
        console.log('Biometric authentication successful');
      }
      alert('Login successful!');
    }
  };

  return (
    <TouchableOpacity
      accessibilityLabel={`Login with ${getBiometryTypeName()}`}
      accessibilityRole="button"
      className="bg-blue-500 py-3 px-6 rounded-lg items-center justify-center min-h-12"
      onPress={handlePress}
      disabled={!isAvailable || isLoading}
    >
      <Text className="text-white text-base font-semibold">
        {isLoading ? 'Authenticating...' : `Login with ${getBiometryTypeName()}`}
      </Text>
    </TouchableOpacity>
  );
};

// Example 2: Payment Authorization with Custom Prompt
export const PaymentAuthorizationButton = ({ onPaymentSuccess }: { onPaymentSuccess: () => void }) => {
  const { authenticateWithOptions, isLoading, isAvailable } = useBiometricAuth();

  const handlePaymentAuth = async () => {
    const result = await authenticateWithOptions({
      promptMessage: 'Verify your identity to complete purchase',
      fallbackLabel: 'Use PIN code',
      disableDeviceFallback: false,
    });

    if (result.success) {
      onPaymentSuccess();
    }
  };

  return (
    <TouchableOpacity
      accessibilityLabel="Authorize payment with biometric"
      accessibilityRole="button"
      className="bg-green-500 py-3 px-6 rounded-lg items-center justify-center min-h-12"
      onPress={handlePaymentAuth}
      disabled={!isAvailable || isLoading}
    >
      <Text className="text-white text-base font-semibold">
        {isLoading ? 'Verifying...' : 'Authorize Payment'}
      </Text>
    </TouchableOpacity>
  );
};

// Example 3: Settings Toggle for Biometric Authentication
export const BiometricSettingsToggle = ({ isEnabled, onToggle }: { isEnabled: boolean, onToggle: (enabled: boolean) => void }) => {
  const { isAvailable, getBiometryTypeName } = useBiometricAuth();

  const handleToggle = () => {
    if (!isAvailable) {
      alert('Biometric authentication is not available on this device');
      return;
    }
    onToggle(!isEnabled);
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-4">
      <Text className="text-base font-semibold mb-1">Biometric Authentication</Text>
      <Text className="text-sm text-gray-500 mb-3">
        {isAvailable
          ? `Use ${getBiometryTypeName()} for quick login`
          : 'Biometric authentication not available'}
      </Text>
      <TouchableOpacity
        accessibilityLabel={`Biometric authentication is ${isEnabled ? 'enabled' : 'disabled'}. Tap to toggle.`}
        accessibilityRole="button"
        className={`py-3 px-4 rounded-lg items-center ${isEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
        onPress={handleToggle}
        disabled={!isAvailable}
      >
        <Text className="text-white font-semibold">
          {isEnabled ? 'Enabled' : 'Disabled'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 4: Conditional Biometric UI Component
export const ConditionalBiometricUI = () => {
  const { availability, checkAvailability, getBiometryTypeName } = useBiometricAuth();

  React.useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  if (!availability) {
    return <Text className="text-gray-500 italic">Checking device capabilities...</Text>;
  }

  if (!availability.hasHardware) {
    return <Text className="text-red-500">This device doesn't support biometric authentication</Text>;
  }

  if (!availability.isEnrolled) {
    return (
      <Text className="text-orange-500">
        No biometric data enrolled. Please enroll {getBiometryTypeName()} in device settings.
      </Text>
    );
  }

  return (
    <Text className="text-green-500">
      ✓ Biometric authentication ({getBiometryTypeName()}) is available and ready to use.
    </Text>
  );
};

// Example 5: Biometric Authentication Demo Screen
export const BiometricDemoScreen = () => {

  const handleAuthSuccess = () => {
    if (__DEV__) {
      console.log('Authentication successful');
    }
    alert('Login successful!');
  };

  const handleAuthFailure = (error: string) => {
    if (__DEV__) {
      console.error('Biometric authentication failed:', error);
    }
  };

  return (
    <ScrollView className="flex-1 p-5 bg-gray-100">
      <Text className="text-2xl font-bold mb-5 text-center">Biometric Authentication Demo</Text>

      <View className="mb-8">
        <Text className="text-lg font-semibold mb-2">Full Biometric Login</Text>
        <Text className="text-sm text-gray-500 mb-3">
          Complete biometric login screen with all features
        </Text>
        <View className="bg-white rounded-xl p-4 border border-gray-200">
          <BiometricLoginScreen
            onAuthSuccess={handleAuthSuccess}
            onAuthFailure={handleAuthFailure}
          />
        </View>
      </View>

      <View className="mb-8">
        <Text className="text-lg font-semibold mb-2">Simple Button</Text>
        <Text className="text-sm text-gray-500 mb-3">
          Minimal biometric login button
        </Text>
        <View className="bg-white rounded-xl p-4 border border-gray-200">
          <SimpleBiometricLoginButton />
        </View>
      </View>

      <View className="mb-8">
        <Text className="text-lg font-semibold mb-2">Payment Authorization</Text>
        <Text className="text-sm text-gray-500 mb-3">
          Custom prompt for payment authorization
        </Text>
        <View className="bg-white rounded-xl p-4 border border-gray-200">
          <PaymentAuthorizationButton onPaymentSuccess={() => alert('Payment authorized!')} />
        </View>
      </View>

      <View className="mb-8">
        <Text className="text-lg font-semibold mb-2">Settings Toggle</Text>
        <Text className="text-sm text-gray-500 mb-3">
          Enable/disable biometric authentication
        </Text>
        <View className="bg-white rounded-xl p-4 border border-gray-200">
          <BiometricSettingsToggle
            isEnabled={true}
            onToggle={(enabled) => {
              if (__DEV__) {
                console.log('Biometric enabled:', enabled);
              }
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

// Example 6: Biometric Status Indicator
export const BiometricStatusIndicator = () => {
  const { isAvailable, getBiometryTypeName, availability } = useBiometricAuth();

  if (!availability) {
    return <View className="p-2 rounded-2xl bg-gray-300 self-start" />;
  }

  return (
    <View className={`p-2 rounded-2xl self-start ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}>
      <Text className="text-white text-xs font-semibold">
        {isAvailable
          ? `🔒 ${getBiometryTypeName()} Ready`
          : '🔓 Biometric Unavailable'}
      </Text>
    </View>
  );
};
