# Biometric Authentication Integration Guide

## Overview

This guide covers implementing biometric authentication (fingerprint, face recognition) in the Shopping App using `expo-local-authentication`.

## Table of Contents

1. [Installation](#installation)
2. [Service Architecture](#service-architecture)
3. [Hook Usage](#hook-usage)
4. [UI Components](#ui-components)
5. [Implementation Examples](#implementation-examples)
6. [Best Practices](#best-practices)
7. [Error Handling](#error-handling)
8. [Testing](#testing)

---

## Installation

### Prerequisites

- Expo SDK 50+
- React Native
- expo-local-authentication already added to project

### Verify Installation

```bash
cd src/Presentation/App
npm list expo-local-authentication
# or
yarn list expo-local-authentication
```

### Platform-Specific Setup

#### iOS Configuration

Add to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID"
        }
      ]
    ]
  }
}
```

#### Android Configuration

Add to `app.json`:

```json
{
  "expo": {
    "permissions": [
      "android.permission.USE_FINGERPRINT",
      "android.permission.USE_BIOMETRIC"
    ]
  }
}
```

---

## Service Architecture

### BiometricAuthService (`services/biometricAuth.ts`)

Core service providing biometric authentication functionality.

#### Methods

```typescript
// Check device capabilities
checkAvailability(): Promise<BiometricAvailability>

// Default authentication
authenticate(): Promise<BiometricAuthResult>

// Custom authentication options
authenticateWithOptions(options: AuthOptions): Promise<BiometricAuthResult>

// Get readable biometry type name
getBiometryTypeName(type?: AuthenticationType): string
```

#### Types

```typescript
interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometryType?: AuthenticationType;
}

interface BiometricAvailability {
  hasHardware: boolean;
  isEnrolled: boolean;
  biometryType?: AuthenticationType;
}
```

#### Usage

```typescript
import { biometricAuthService } from '../services/biometricAuth';

// Check availability
const availability = await biometricAuthService.checkAvailability();

if (availability.hasHardware && availability.isEnrolled) {
  // Authenticate
  const result = await biometricAuthService.authenticate();
  
  if (result.success) {
    console.log('Authentication successful');
  } else {
    console.error('Authentication failed:', result.error);
  }
}
```

---

## Hook Usage

### useBiometricAuth Hook

React Hook for managing biometric authentication state and operations.

#### Returns

```typescript
{
  // State
  isLoading: boolean;
  error: string | null;
  availability: BiometricAvailability | null;
  
  // Methods
  checkAvailability(): Promise<BiometricAvailability | null>;
  authenticate(): Promise<BiometricAuthResult>;
  authenticateWithOptions(options): Promise<BiometricAuthResult>;
  clearError(): void;
  getBiometryTypeName(): string;
  
  // Helpers
  isAvailable: boolean;
  hasHardware: boolean;
  isEnrolled: boolean;
}
```

#### Example

```typescript
import { useBiometricAuth } from '../hooks/useBiometricAuth';

export const LoginComponent = () => {
  const {
    isLoading,
    error,
    authenticate,
    isAvailable,
    getBiometryTypeName,
  } = useBiometricAuth();

  const handleLogin = async () => {
    const result = await authenticate();
    
    if (result.success) {
      // Proceed to app
    }
  };

  return (
    <View>
      <Text>
        {isAvailable 
          ? `Login with ${getBiometryTypeName()}`
          : 'Biometric not available'}
      </Text>
      <TouchableOpacity 
        onPress={handleLogin}
        disabled={isLoading || !isAvailable}
      >
        <Text>Authenticate</Text>
      </TouchableOpacity>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
};
```

---

## UI Components

### BiometricLoginScreen

Full-featured login screen with biometric authentication.

#### Features

- ✅ Biometric availability checking
- ✅ Fingerprint and Face ID support
- ✅ Attempt limiting (5 attempts max)
- ✅ Error handling and retry logic
- ✅ Fallback to password authentication
- ✅ Status information display
- ✅ Loading states

#### Props

```typescript
interface BiometricLoginScreenProps {
  onAuthSuccess?: () => void;
  onAuthFailure?: (error: string) => void;
}
```

#### Usage

```typescript
import { BiometricLoginScreen } from '../screens/BiometricLoginScreen';

export const LoginNavigator = () => {
  const handleAuthSuccess = () => {
    // Navigate to app home
    navigation.navigate('Home');
  };

  const handleAuthFailure = (error: string) => {
    console.error('Auth failed:', error);
  };

  return (
    <BiometricLoginScreen
      onAuthSuccess={handleAuthSuccess}
      onAuthFailure={handleAuthFailure}
    />
  );
};
```

---

## Implementation Examples

### Example 1: Simple Biometric Login

```typescript
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

export const SimpleLoginButton = () => {
  const { authenticate, isLoading, isAvailable } = useBiometricAuth();

  const handlePress = async () => {
    const result = await authenticate();
    if (result.success) {
      console.log('User authenticated');
    }
  };

  return (
    <View>
      <TouchableOpacity 
        onPress={handlePress}
        disabled={!isAvailable || isLoading}
      >
        <Text>{isLoading ? 'Authenticating...' : 'Login with Biometric'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Example 2: Custom Authentication Prompt

```typescript
import { useBiometricAuth } from '../hooks/useBiometricAuth';

export const CustomPromptLogin = () => {
  const { authenticateWithOptions, isLoading } = useBiometricAuth();

  const handleCustomAuth = async () => {
    const result = await authenticateWithOptions({
      promptMessage: 'Verify your identity to complete purchase',
      fallbackLabel: 'Use PIN code',
      disableDeviceFallback: false,
    });

    if (result.success) {
      console.log('Purchase authorized');
    }
  };

  return (
    <TouchableOpacity onPress={handleCustomAuth} disabled={isLoading}>
      <Text>Authorize Payment</Text>
    </TouchableOpacity>
  );
};
```

### Example 3: Biometric Check on App Launch

```typescript
import { useEffect } from 'react';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export const useAutoLogin = () => {
  const { authenticate, checkAvailability, isAvailable } = useBiometricAuth();
  const { getItem } = useAsyncStorage('biometric_enabled');

  useEffect(() => {
    const attemptAutoLogin = async () => {
      const isBiometricEnabled = await getItem();
      
      if (isBiometricEnabled === 'true' && isAvailable) {
        const result = await authenticate();
        
        if (result.success) {
          // Auto-login successful
          return true;
        }
      }
      
      return false;
    };

    attemptAutoLogin();
  }, []);
};
```

### Example 4: Conditional Display Based on Availability

```typescript
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

export const ConditionalBiometricUI = () => {
  const { availability, checkAvailability, getBiometryTypeName } = useBiometricAuth();

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  if (!availability) {
    return <Text>Checking device capabilities...</Text>;
  }

  if (!availability.hasHardware) {
    return <Text>This device doesn't support biometric authentication</Text>;
  }

  if (!availability.isEnrolled) {
    return (
      <Text>
        No biometric data enrolled. Please enroll {getBiometryTypeName()} in device settings.
      </Text>
    );
  }

  return (
    <Text>
      Biometric authentication ({getBiometryTypeName()}) is available and ready to use.
    </Text>
  );
};
```

---

## Best Practices

### 1. Always Check Availability First

```typescript
const { checkAvailability, authenticate } = useBiometricAuth();

// Check first
const availability = await checkAvailability();

if (!availability.isAvailable) {
  // Fallback to password
  showPasswordLogin();
  return;
}

// Then authenticate
const result = await authenticate();
```

### 2. Handle Errors Gracefully

```typescript
const { authenticate, error, clearError } = useBiometricAuth();

const handleAuth = async () => {
  const result = await authenticate();
  
  if (!result.success) {
    // Show user-friendly error
    showAlert('Authentication failed. Try again or use password.');
    
    // Allow retry
    setTimeout(() => clearError(), 3000);
  }
};
```

### 3. Implement Attempt Limiting

```typescript
const [attempts, setAttempts] = useState(0);
const MAX_ATTEMPTS = 5;

const handleBiometricAuth = async () => {
  if (attempts >= MAX_ATTEMPTS) {
    showAlert('Too many attempts. Try password login.');
    return;
  }

  const result = await authenticate();
  
  if (!result.success) {
    setAttempts(prev => prev + 1);
  } else {
    setAttempts(0); // Reset on success
  }
};
```

### 4. Store Biometric Preference

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveBiometricPreference = async (enabled: boolean) => {
  await AsyncStorage.setItem('biometric_enabled', String(enabled));
};

const getBiometricPreference = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem('biometric_enabled');
  return value === 'true';
};
```

### 5. Use Meaningful Prompts

```typescript
// Good: Clear, action-oriented
authenticateWithOptions({
  promptMessage: 'Authenticate to complete your purchase',
  fallbackLabel: 'Use your PIN',
});

// Avoid: Generic, confusing
authenticateWithOptions({
  promptMessage: 'Authenticate',
  fallbackLabel: 'Authenticate',
});
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Biometric hardware not available" | Device doesn't support biometrics | Provide password fallback |
| "No biometric enrolled" | User hasn't set up biometric | Guide user to device settings |
| "Authentication failed" | Wrong biometric/timeout | Allow retry with attempt limit |
| "User canceled" | User pressed cancel button | Allow fallback method |
| "Authentication timeout" | Took too long | Retry with fresh attempt |

### Error Handling Pattern

```typescript
const { authenticate, error } = useBiometricAuth();

const handleAuth = async () => {
  const result = await authenticate();
  
  if (result.success) {
    // Success path
    proceedToApp();
  } else {
    // Handle specific errors
    switch (result.error) {
      case 'Biometric hardware not available':
        showPasswordLogin();
        break;
      case 'No biometric enrolled':
        openDeviceSettings();
        break;
      case 'Authentication failed':
        showRetry();
        break;
      default:
        showGenericError(result.error);
    }
  }
};
```

---

## Testing

### Unit Tests

```typescript
// biometricAuth.test.ts
import { biometricAuthService } from '../services/biometricAuth';

describe('BiometricAuthService', () => {
  it('should check availability', async () => {
    const availability = await biometricAuthService.checkAvailability();
    
    expect(availability).toHaveProperty('hasHardware');
    expect(availability).toHaveProperty('isEnrolled');
  });

  it('should return success on valid biometric', async () => {
    const result = await biometricAuthService.authenticate();
    
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('biometryType');
  });

  it('should handle authentication failure', async () => {
    const result = await biometricAuthService.authenticate();
    
    if (!result.success) {
      expect(result).toHaveProperty('error');
    }
  });
});
```

### Integration Tests

```typescript
// useBiometricAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

describe('useBiometricAuth Hook', () => {
  it('should initialize with null availability', () => {
    const { result } = renderHook(() => useBiometricAuth());
    
    expect(result.current.availability).toBeNull();
  });

  it('should check availability on demand', async () => {
    const { result } = renderHook(() => useBiometricAuth());
    
    await act(async () => {
      await result.current.checkAvailability();
    });
    
    expect(result.current.availability).not.toBeNull();
  });

  it('should handle authentication flow', async () => {
    const { result } = renderHook(() => useBiometricAuth());
    
    await act(async () => {
      await result.current.checkAvailability();
    });
    
    await act(async () => {
      await result.current.authenticate();
    });
    
    // Verify loading state was set
    expect(result.current.isLoading).toBe(false);
  });
});
```

### E2E Testing

```typescript
// BiometricLoginScreen.e2e.ts
import detox from 'detox';

describe('Biometric Login Screen', () => {
  beforeAll(async () => {
    await detox.init();
  });

  it('should display biometric login button when available', async () => {
    await expect(element(by.text('Authenticate with Fingerprint'))).toBeVisible();
  });

  it('should show fallback button', async () => {
    await expect(element(by.text('Use Password Instead'))).toBeVisible();
  });

  it('should handle biometric authentication', async () => {
    await element(by.id('biometric-button')).multiTap();
    // Verify success/failure state
  });
});
```

---

## Security Considerations

### 1. Never Store Raw Biometric Data

✅ **DO**: Device stores biometric data securely
```typescript
// Biometric authentication handled by OS
const result = await authenticate();
```

❌ **DON'T**: Try to store/access raw biometric data
```typescript
// NEVER do this
const biometricData = await getBiometricData();
await saveToAsyncStorage(biometricData);
```

### 2. Use HTTPS for Auth Tokens

```typescript
// After successful biometric auth, use secure token exchange
const result = await authenticate();

if (result.success) {
  // Exchange with backend over HTTPS
  const token = await exchangeForAuthToken();
  
  // Store token securely
  await saveSecureToken(token);
}
```

### 3. Implement Session Timeout

```typescript
useEffect(() => {
  const sessionTimeout = setTimeout(() => {
    // Force re-authentication
    clearAuthToken();
    navigateToLogin();
  }, 15 * 60 * 1000); // 15 minutes

  return () => clearTimeout(sessionTimeout);
}, []);
```

### 4. Handle Sensitive Operations

```typescript
// For sensitive operations (payment, password change),
// always require fresh authentication
const handlePayment = async () => {
  const result = await authenticateWithOptions({
    promptMessage: 'Verify your identity to complete payment',
    disableDeviceFallback: false,
  });

  if (result.success) {
    processPayment();
  }
};
```

---

## Troubleshooting

### Biometric Not Showing

1. Check device has biometric hardware
2. Verify biometric is enrolled in device settings
3. Test with `checkAvailability()` method
4. Check app has proper permissions

### "Cannot Find Module" Error

```bash
# Ensure expo-local-authentication is installed
npm install expo-local-authentication
# or
yarn add expo-local-authentication

# Then rebuild app
npm start -- --clean
```

### Authentication Always Fails

1. Ensure device is unlocked
2. Check device supports the operation
3. Try with custom options including fallback
4. Test with device-native biometric app first

### Permission Denied

**iOS**: Check `Info.plist` has FaceID permission
**Android**: Ensure permissions in `AndroidManifest.xml`

---

## Resources

- [expo-local-authentication Documentation](https://docs.expo.dev/modules/local-authentication/)
- [React Native BiometricPrompt](https://reactnativebiometric.github.io/)
- [Apple Local Authentication Framework](https://developer.apple.com/documentation/localauthentication)
- [Android BiometricPrompt](https://developer.android.com/reference/androidx/biometric/BiometricPrompt)

---

## Version History

- **v1.0.0** (Nov 2025): Initial biometric authentication implementation
  - BiometricAuthService with device capability checking
  - useBiometricAuth React Hook
  - BiometricLoginScreen full-featured component
  - Comprehensive documentation and examples
