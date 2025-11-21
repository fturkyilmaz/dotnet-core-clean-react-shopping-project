# JWT Refresh Token Implementation

## ✅ Implemented Features

### 1. Axios Interceptor with Token Refresh
**File:** `src/api/axios.ts`

**Key Features:**
- **Automatic Token Injection**: JWT token automatically added to all requests
- **Token Refresh on 401**: Automatically refreshes expired tokens
- **Request Queue**: Queues failed requests during token refresh
- **Retry Logic**: Retries failed requests with new token
- **Graceful Logout**: Redirects to login if refresh fails

### 2. How It Works

```typescript
// 1. Request Interceptor
// Adds JWT token to every request
config.headers.Authorization = `Bearer ${token}`;

// 2. Response Interceptor
// Detects 401 errors and attempts token refresh
if (error.response?.status === 401) {
  // Refresh token
  const newToken = await refreshTokenAPI();
  // Retry original request
  return apiClient(originalRequest);
}
```

### 3. Token Refresh Flow

```
User Request → 401 Error → Refresh Token → New Token → Retry Request
     ↓                                                        ↓
  Success                                                  Success
```

### 4. Request Queuing

When multiple requests fail simultaneously:
1. First request triggers refresh
2. Other requests are queued
3. After refresh, all queued requests retry with new token

### 5. Helper Functions

```typescript
setAuthToken(token)       // Store JWT token
setRefreshToken(token)    // Store refresh token
clearTokens()             // Clear all tokens
```

## 🔧 Backend Requirements

Your backend needs to implement:

```csharp
[HttpPost("refresh")]
public async Task<ActionResult<AuthResponse>> RefreshToken(RefreshTokenRequest request)
{
    // Validate refresh token
    // Generate new JWT token
    // Generate new refresh token
    // Return both tokens
}
```

## 📝 Usage Example

```typescript
// Login stores both tokens
const { token, refreshToken } = await authApi.login(credentials);
localStorage.setItem('token', token);
localStorage.setItem('refreshToken', refreshToken);

// All subsequent requests automatically use token
const products = await productsApi.getAll();

// If token expires (401), automatically refreshes and retries
```

## 🔒 Security Features

- ✅ Tokens stored in localStorage
- ✅ Automatic token refresh
- ✅ Graceful logout on refresh failure
- ✅ Request queuing prevents duplicate refresh calls
- ✅ Retry logic for failed requests

## 🚀 Benefits

1. **Seamless UX**: Users never see token expiration errors
2. **Automatic**: No manual token management needed
3. **Efficient**: Queues requests during refresh
4. **Secure**: Clears tokens on failure
5. **Production-Ready**: Handles edge cases

## 📊 Flow Diagram

```
┌─────────────┐
│ User Action │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Request │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ Add JWT Token    │ ◄── Request Interceptor
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Send to Backend  │
└──────┬───────────┘
       │
       ├─────► Success ──────┐
       │                     │
       └─────► 401 Error     │
                  │          │
                  ▼          │
       ┌──────────────────┐  │
       │ Refresh Token?   │  │
       └──────┬───────────┘  │
              │              │
       ┌──────┴──────┐       │
       │             │       │
       ▼             ▼       │
   Success       Failure     │
       │             │       │
       │             ▼       │
       │      ┌──────────┐   │
       │      │  Logout  │   │
       │      └──────────┘   │
       │                     │
       ▼                     │
┌──────────────────┐         │
│ Retry Request    │         │
└──────┬───────────┘         │
       │                     │
       └─────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ Return Data    │
         └────────────────┘
```

## 💡 Next Steps

To fully implement this, your backend needs:

1. **Refresh Token Endpoint**
   ```csharp
   POST /api/v1/Identity/refresh
   Body: { token, refreshToken }
   Response: { token, refreshToken }
   ```

2. **Refresh Token Storage** (Database)
   - Store refresh tokens with expiration
   - Validate on refresh requests
   - Rotate refresh tokens

3. **Token Configuration**
   - JWT expiration: 15-30 minutes
   - Refresh token expiration: 7-30 days
