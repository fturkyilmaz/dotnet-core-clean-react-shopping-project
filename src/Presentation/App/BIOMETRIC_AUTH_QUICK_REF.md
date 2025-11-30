# Biometric Authentication - Quick Reference

## Files Created

```
src/
  services/
    biometricAuth.ts          # Core biometric service
  hooks/
    useBiometricAuth.ts       # React hook for biometric auth
  screens/
    BiometricLoginScreen.tsx  # Full-featured login component
```

## Quick Start

### 1. Check Biometric Availability

```typescript
import { useBiometricAuth } from '../hooks/useBiometricAuth';

const MyComponent = () => {
  const { isAvailable, getBiometryTypeName } = useBiometricAuth();
  
  return isAvailable ? (
    <Text>Login with {getBiometryTypeName()}</Text>
  ) : (
    <Text>Biometric not available</Text>
  );
};
```

### 2. Authenticate User

```typescript
const { authenticate, isLoading, error } = useBiometricAuth();

const handleLogin = async () => {
  const result = await authenticate();
  
  if (result.success) {
    // Navigate to app
  } else {
    console.error(result.error);
  }
};
```

### 3. Use Full Screen Component

```typescript
import { BiometricLoginScreen } from '../screens/BiometricLoginScreen';

<BiometricLoginScreen
  onAuthSuccess={() => navigation.navigate('Home')}
  onAuthFailure={(error) => console.error(error)}
/>
```

## Hook API

### State
- `isLoading` - Authentication in progress
- `error` - Error message if any
- `availability` - Device capabilities
- `isAvailable` - Quick check if biometric is ready

### Methods
- `checkAvailability()` - Check device capabilities
- `authenticate()` - Standard biometric auth
- `authenticateWithOptions(options)` - Custom prompt
- `clearError()` - Clear error message
- `getBiometryTypeName()` - Get "Fingerprint" or "Face ID"

## Service API

### Methods
```typescript
// Check device capabilities
const availability = await biometricAuthService.checkAvailability();

// Authenticate with default prompt
const result = await biometricAuthService.authenticate();

// Authenticate with custom options
const result = await biometricAuthService.authenticateWithOptions({
  promptMessage: 'Custom prompt text',
  fallbackLabel: 'Use PIN',
  disableDeviceFallback: false,
});

// Get biometry type name
const name = biometricAuthService.getBiometryTypeName(availability.biometryType);
```

## Authentication Flow

```
1. Check Availability
   ├─ hasHardware? 
   ├─ isEnrolled?
   └─ biometryType? (Fingerprint/Face ID)

2. Authenticate
   ├─ Show system prompt
   ├─ User scans biometric
   └─ Return success/failure

3. Handle Result
   ├─ Success: Proceed to app
   └─ Failure: Show error, allow retry/fallback
```

## Configuration

### Platform Permissions

**iOS (`app.json`)**:
```json
{
  "plugins": [
    [
      "expo-local-authentication",
      {
        "faceIDPermission": "Allow app to use Face ID"
      }
    ]
  ]
}
```

**Android (`app.json`)**:
```json
{
  "permissions": [
    "android.permission.USE_BIOMETRIC"
  ]
}
```

## Common Patterns

### Pattern 1: Simple Button
```typescript
<TouchableOpacity onPress={authenticate} disabled={!isAvailable}>
  <Text>Login with Biometric</Text>
</TouchableOpacity>
```

### Pattern 2: Auto-login on App Start
```typescript
useEffect(() => {
  if (isAvailable) {
    authenticate();
  }
}, []);
```

### Pattern 3: Sensitive Operation Verification
```typescript
const handlePayment = async () => {
  const result = await authenticateWithOptions({
    promptMessage: 'Verify payment authorization',
  });
  
  if (result.success) {
    processPayment();
  }
};
```

### Pattern 4: Attempt Limiting
```typescript
const [attempts, setAttempts] = useState(0);

const handleAuth = async () => {
  if (attempts >= 5) {
    showPasswordLogin();
    return;
  }
  
  const result = await authenticate();
  if (!result.success) {
    setAttempts(prev => prev + 1);
  }
};
```

## Error Handling

```typescript
const result = await authenticate();

if (!result.success) {
  switch (result.error) {
    case 'Biometric hardware not available':
      // Show password login
      break;
    case 'No biometric enrolled':
      // Guide to device settings
      break;
    case 'Authentication failed':
      // Allow retry
      break;
  }
}
```

## Testing Biometrics

### iOS Simulator
```bash
xcrun simctl notifypost bootkit com.apple.BiometricKit.enrollmentChanged
```

### Android Emulator
Go to: More → Fingerprints → Add fingerprint

### Web (Testing)
All methods return `{ success: false }` on web - implement password fallback

## Security Notes

✅ **DO:**
- Always check availability first
- Implement attempt limiting
- Use HTTPS for token exchange
- Force re-auth for sensitive ops
- Store auth tokens securely

❌ **DON'T:**
- Store biometric data directly
- Skip error handling
- Use for non-sensitive operations only
- Share biometric results across users

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module" | `npm install expo-local-authentication` |
| Button disabled | Check `isAvailable` is true |
| Auth always fails | Ensure biometric enrolled in settings |
| Permission denied | Check app.json permissions |
| Nothing shows on web | Add password fallback for web |

## Full Documentation

See `BIOMETRIC_AUTH_GUIDE.md` for:
- Detailed API documentation
- Installation & setup
- Implementation examples
- Best practices
- Testing strategies
- Security considerations

## Examples

See:
- `src/screens/BiometricLoginScreen.tsx` - Full-featured screen
- `src/hooks/useBiometricAuth.ts` - Hook implementation
- `src/services/biometricAuth.ts` - Service implementation
