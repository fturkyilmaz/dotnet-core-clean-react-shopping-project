---
sidebar_position: 3
---

# Authentication

The Shopping Project API uses **JWT (JSON Web Token)** authentication for securing endpoints.

## Overview

- **Authentication Method**: JWT Bearer Token
- **Token Expiry**: 60 minutes (configurable)
- **Authorization**: Role-based and Policy-based

## Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Database
    
    Client->>API: POST /api/v1/Identity/login
    API->>Database: Verify credentials
    Database-->>API: User validated
    API-->>Client: JWT Token
    Client->>API: Request with Bearer Token
    API->>API: Validate Token
    API-->>Client: Protected Resource
```

## Endpoints

### Login

Authenticate a user and receive a JWT token.

**Endpoint**: `POST /api/v1/Identity/login`

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Response** (200 OK):
```json
{
  "succeeded": true,
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": null,
  "errors": null
}
```

**Response** (400 Bad Request):
```json
{
  "succeeded": false,
  "data": null,
  "message": null,
  "errors": "Invalid email or password"
}
```

### Register

Create a new user account.

**Endpoint**: `POST /api/v1/Identity/register`

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "User123!"
}
```

**Response** (200 OK):
```json
{
  "succeeded": true,
  "data": "User registered successfully",
  "message": null,
  "errors": null
}
```

## Using the Token

Include the JWT token in the `Authorization` header for protected endpoints:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example with cURL

```bash
# Login and get token
TOKEN=$(curl -X POST http://localhost:5000/api/v1/Identity/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}' \
  | jq -r '.data')

# Use token to create a product
curl -X POST http://localhost:5000/api/v1/Products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Product",
    "price": 29.99,
    "description": "Product description",
    "category": "Electronics",
    "image": "https://example.com/image.jpg"
  }'
```

### Example with JavaScript

```javascript
// Login
const loginResponse = await fetch('http://localhost:5000/api/v1/Identity/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'Admin123!'
  })
});

const { data: token } = await loginResponse.json();

// Use token
const productsResponse = await fetch('http://localhost:5000/api/v1/Products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const products = await productsResponse.json();
```

## Authorization

### Roles

The API supports the following roles:

- **Administrator**: Full access to all resources
- **User**: Limited access to resources

### Policies

Authorization policies provide fine-grained access control:

| Policy | Description | Required Role |
|--------|-------------|---------------|
| `CanManageProducts` | Create, update, delete products | Administrator |
| `CanPurge` | Manage carts and perform purge operations | Administrator |

### Protected Endpoints

| Endpoint | Method | Policy Required |
|----------|--------|-----------------|
| `POST /api/v1/Products` | POST | CanManageProducts |
| `PUT /api/v1/Products/{id}` | PUT | CanManageProducts |
| `DELETE /api/v1/Products/{id}` | DELETE | CanManageProducts |
| `POST /api/v1/Carts` | POST | CanPurge |
| `PUT /api/v1/Carts/{id}` | PUT | CanPurge |
| `DELETE /api/v1/Carts/{id}` | DELETE | CanPurge |

## Token Structure

The JWT token contains the following claims:

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": ["Administrator"],
  "nameid": "user-id",
  "exp": 1234567890,
  "iss": "ShoppingProject",
  "aud": "ShoppingProject"
}
```

## Security Best Practices

1. **Store tokens securely**: Use `httpOnly` cookies or secure storage
2. **Never expose tokens**: Don't log or display tokens in the UI
3. **Implement token refresh**: Request new tokens before expiry
4. **Use HTTPS**: Always use HTTPS in production
5. **Validate on every request**: The API validates tokens on each request

## Rate Limiting

Authentication endpoints have strict rate limits:

- **Login**: 5 requests per minute per IP
- **Register**: 10 requests per hour per IP

Exceeding these limits will result in a `429 Too Many Requests` response.

## Troubleshooting

### "Unauthorized" Error

- Ensure the token is included in the `Authorization` header
- Check that the token hasn't expired
- Verify the token format: `Bearer <token>`

### "Forbidden" Error

- The user doesn't have the required role or policy
- Check user roles in the database
- Verify the endpoint's authorization requirements

### Token Expiry

Tokens expire after 60 minutes. Implement token refresh logic in your client application.
