# API Documentation

## Overview
The Shopping Project API is a RESTful service built with ASP.NET Core 8. It follows Clean Architecture principles and uses CQRS for separation of concerns.

## Authentication
The API uses **JWT (JSON Web Token)** for authentication.
- **Header**: `Authorization: Bearer <token>`
- **Token Lifespan**: Short-lived access tokens (configurable, default 15 mins).
- **Refresh Token**: Long-lived refresh tokens for obtaining new access tokens.

### Authentication Flow
1.  **Register**: Create a new user account.
2.  **Login**: Exchange credentials (email/password) for an Access Token and Refresh Token.
3.  **Access Resources**: Use the Access Token in the `Authorization` header to access protected endpoints.
4.  **Refresh**: When the Access Token expires, use the Refresh Token to get a new pair.

## Error Handling
The API uses the **RFC 7807 Problem Details** standard for error responses.

**Example Error Response:**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "traceId": "00-d4c3b...-00",
  "errors": {
    "Email": [
      "The Email field is not a valid e-mail address."
    ]
  }
}
```

## Endpoints

### Identity
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/identity/register` | Register a new user | No |
| `POST` | `/api/v1/identity/login` | Login and get tokens | No |
| `POST` | `/api/v1/identity/refresh-token` | Refresh access token | No |
| `GET` | `/api/v1/identity/me` | Get current user info | Yes |
| `PUT` | `/api/v1/identity/me` | Update current user info | Yes |

#### Request Examples
**Login:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Register:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "Furkan",
  "lastName": "Türkyılmaz"
}
```

### Products
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/products` | Get all products (Cached) | No |
| `GET` | `/api/v1/products/{id}` | Get product by ID (Cached) | No |
| `POST` | `/api/v1/products/search` | Search products with pagination | No |
| `POST` | `/api/v1/products` | Create a product | Yes (Admin) |
| `PUT` | `/api/v1/products/{id}` | Update a product | Yes (Admin) |
| `DELETE` | `/api/v1/products/{id}` | Delete a product | Yes (Admin) |

#### Request Examples
**Create Product:**
```json
{
  "name": "Smartphone",
  "description": "Latest model",
  "price": 999.99,
  "categoryId": 1,
  "imageUrl": "http://example.com/image.jpg"
}
```

**Search Products:**
```json
{
  "filter": "price > 100",
  "sort": "price desc"
}
```

### Carts
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/carts` | Get all carts for user | Yes |
| `GET` | `/api/v1/carts/{id}` | Get cart by ID | Yes |
| `POST` | `/api/v1/carts` | Create a new cart | Yes |
| `PUT` | `/api/v1/carts/{id}` | Update a cart | Yes |
| `DELETE` | `/api/v1/carts/{id}` | Delete a cart | Yes |

#### Request Examples
**Create/Update Cart:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

## OpenAPI / Swagger
The full OpenAPI specification is available at `/swagger/v1/swagger.json` when running the application locally.
The Swagger UI is accessible at `/swagger`.

## Real-Time Communication (SignalR)
The application uses SignalR for real-time updates.
-   **Notification Hub**: `/hubs/notifications` - For system-wide or user-specific notifications.
-   **Cart Hub**: `/hubs/cart` - For real-time cart updates.
-   **Order Hub**: `/hubs/orders` - For order status updates.

## Operational Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | JSON Health Check (Database, Redis, RabbitMQ status) |
| `GET` | `/health-ui` | Graphical Health Check UI |
| `GET` | `/hangfire` | Background Job Dashboard (Dev only) |

## Security & Infrastructure
### Security Headers
The following security headers are enforced on all responses:
-   `Strict-Transport-Security` (HSTS)
-   `X-Content-Type-Options: nosniff`
-   `X-Frame-Options: DENY`
-   `X-XSS-Protection: 1; mode=block`
-   `Content-Security-Policy` (CSP)

### Rate Limiting
-   **Strategy**: IP-based rate limiting.
-   **Storage**: In-memory (distributed cache ready).
-   **Configuration**: Limits are defined in `appsettings.json`.

### Observability
-   **Logging**: Structured logging via **Serilog** (Console + File/Elasticsearch).
-   **Metrics**: Prometheus metrics exposed at `/metrics` (via OpenTelemetry).
-   **Tracing**: OpenTelemetry tracing enabled for HTTP requests and dependencies.
