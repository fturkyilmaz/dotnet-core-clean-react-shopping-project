import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { BiometricLoginScreen } from '../screens/BiometricLoginScreen';
import { useNavigation } from '@react-navigation/native';

/**
 * Biometric Authentication Implementation Examples
 *
 * This file contains various examples of how to use biometric authentication
 * in different scenarios throughout the app.
 */

// Example 1: Simple Biometric Login Button
export const SimpleBiometricLoginButton = () => {
  const { authenticate, isLoading, isAvailable, getBiometryTypeName } = useBiometricAuth();
  const navigation = useNavigation();

  const handlePress = async () => {
    const result = await authenticate();
    if (result.success) {
      // Authentication successful - proceed with login
      console.log('Biometric authentication successful');
      alert('Login successful!');
    }
  };

  return (
    <TouchableOpacity
      style={styles.biometricButton}
      onPress={handlePress}
      disabled={!isAvailable || isLoading}
    >
      <Text style={styles.buttonText}>
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
      style={[styles.biometricButton, styles.paymentButton]}
      onPress={handlePaymentAuth}
      disabled={!isAvailable || isLoading}
    >
      <Text style={styles.buttonText}>
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
    <View style={styles.settingsContainer}>
      <Text style={styles.settingsTitle}>Biometric Authentication</Text>
      <Text style={styles.settingsDescription}>
        {isAvailable
          ? `Use ${getBiometryTypeName()} for quick login`
          : 'Biometric authentication not available'}
      </Text>
      <TouchableOpacity
        style={[styles.toggleButton, isEnabled && styles.toggleEnabled]}
        onPress={handleToggle}
        disabled={!isAvailable}
      >
        <Text style={styles.toggleText}>
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
    return <Text style={styles.loadingText}>Checking device capabilities...</Text>;
  }

  if (!availability.hasHardware) {
    return <Text style={styles.errorText}>This device doesn't support biometric authentication</Text>;
  }

  if (!availability.isEnrolled) {
    return (
      <Text style={styles.infoText}>
        No biometric data enrolled. Please enroll {getBiometryTypeName()} in device settings.
      </Text>
    );
  }

  return (
    <Text style={styles.successText}>
      ✓ Biometric authentication ({getBiometryTypeName()}) is available and ready to use.
    </Text>
  );
};

// Example 5: Biometric Authentication Demo Screen
export const BiometricDemoScreen = () => {
  const navigation = useNavigation();

  const handleAuthSuccess = () => {
    console.log('Authentication successful');
    alert('Login successful!');
  };

  const handleAuthFailure = (error: string) => {
    console.error('Biometric authentication failed:', error);
  };

  return (
    <ScrollView style={styles.demoContainer}>
      <Text style={styles.demoTitle}>Biometric Authentication Demo</Text>

      <View style={styles.demoSection}>
        <Text style={styles.sectionTitle}>Full Biometric Login</Text>
        <Text style={styles.sectionDescription}>
          Complete biometric login screen with all features
        </Text>
        <View style={styles.demoComponent}>
          <BiometricLoginScreen
            onAuthSuccess={handleAuthSuccess}
            onAuthFailure={handleAuthFailure}
          />
        </View>
      </View>

      <View style={styles.demoSection}>
        <Text style={styles.sectionTitle}>Simple Button</Text>
        <Text style={styles.sectionDescription}>
          Minimal biometric login button
        </Text>
        <View style={styles.demoComponent}>
          <SimpleBiometricLoginButton />
        </View>
      </View>

      <View style={styles.demoSection}>
        <Text style={styles.sectionTitle}>Payment Authorization</Text>
        <Text style={styles.sectionDescription}>
          Custom prompt for payment authorization
        </Text>
        <View style={styles.demoComponent}>
          <PaymentAuthorizationButton onPaymentSuccess={() => alert('Payment authorized!')} />
        </View>
      </View>

      <View style={styles.demoSection}>
        <Text style={styles.sectionTitle}>Settings Toggle</Text>
        <Text style={styles.sectionDescription}>
          Enable/disable biometric authentication
        </Text>
        <View style={styles.demoComponent}>
          <BiometricSettingsToggle
            isEnabled={true}
            onToggle={(enabled) => console.log('Biometric enabled:', enabled)}
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
    return <View style={styles.statusIndicator} />;
  }

  return (
    <View style={[styles.statusIndicator, isAvailable && styles.statusAvailable]}>
      <Text style={styles.statusText}>
        {isAvailable
          ? `🔒 ${getBiometryTypeName()} Ready`
          : '🔓 Biometric Unavailable'}
      </Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  biometricButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  paymentButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  toggleButton: {
    backgroundColor: '#E5E5EA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleEnabled: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    color: 'white',
    fontWeight: '600',
  },
  loadingText: {
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    color: '#FF3B30',
  },
  infoText: {
    color: '#FFA500',
  },
  successText: {
    color: '#34C759',
  },
  demoContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  demoTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  demoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  demoComponent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusIndicator: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  statusAvailable: {
    backgroundColor: '#34C759',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});