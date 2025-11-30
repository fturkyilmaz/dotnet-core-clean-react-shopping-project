import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
    console.log('Fallback to password login');
    onAuthFailure?.('Switched to password authentication');
  };

  if (!availability) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Checking biometric availability...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Biometric Login</Text>
          <Text style={styles.subtitle}>
            {isAvailable
              ? `Use ${getBiometryTypeName()} to log in`
              : 'Biometric authentication not available'}
          </Text>
        </View>

        {/* Status Information */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Biometric Hardware:</Text>
            <Text style={[styles.statusValue, availability.hasHardware && styles.statusSuccess]}>
              {availability.hasHardware ? '✓ Available' : '✗ Not Available'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Enrolled Biometric:</Text>
            <Text style={[styles.statusValue, availability.isEnrolled && styles.statusSuccess]}>
              {availability.isEnrolled ? '✓ Yes' : '✗ No'}
            </Text>
          </View>

          {availability.biometryType && (
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Type:</Text>
              <Text style={styles.statusValue}>{getBiometryTypeName()}</Text>
            </View>
          )}
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={styles.dismissButton}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Attempt Counter */}
        {attemptCount > 0 && (
          <View style={styles.attemptsCard}>
            <Text style={styles.attemptsText}>
              Failed attempts: {attemptCount}/5
            </Text>
          </View>
        )}

        {/* Main Action Buttons */}
        <View style={styles.buttonContainer}>
          {isAvailable && !isLocked && (
            <TouchableOpacity
              style={[styles.button, styles.biometricButton]}
              onPress={handleBiometricAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Authenticate with {getBiometryTypeName()}</Text>
                  <Text style={styles.buttonSubtext}>
                    {availability.hasHardware ? 'Place your finger or face' : 'Biometric unavailable'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Fallback Button */}
          <TouchableOpacity
            style={[styles.button, styles.fallbackButton]}
            onPress={handleFallback}
            disabled={isLoading}
          >
            <Text style={styles.fallbackButtonText}>Use Password Instead</Text>
          </TouchableOpacity>

          {/* Retry Button */}
          {isLocked && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => {
                setAttemptCount(0);
                setIsLocked(false);
              }}
            >
              <Text style={styles.buttonText}>Unlock</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why use biometric authentication?</Text>
          <View style={styles.infoBullet}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.infoText}>Faster and more convenient login</Text>
          </View>
          <View style={styles.infoBullet}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.infoText}>More secure than password-based login</Text>
          </View>
          <View style={styles.infoBullet}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.infoText}>Your biometric data stays on your device</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  statusSuccess: {
    color: '#34C759',
  },
  errorCard: {
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorText: {
    fontSize: 14,
    color: '#C41E3A',
    marginBottom: 8,
    fontWeight: '500',
  },
  dismissButton: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  attemptsCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  attemptsText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  biometricButton: {
    backgroundColor: '#007AFF',
  },
  fallbackButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  primaryButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#B3D9FF',
    marginTop: 4,
  },
  fallbackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  infoBullet: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 10,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
});
