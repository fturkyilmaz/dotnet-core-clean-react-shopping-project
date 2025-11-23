---
sidebar_position: 3
---

# Authentication

The API supports two main authentication mechanisms:

## 1. JWT Authentication (User)

Used for user-centric operations (e.g., managing carts, placing orders).

- **Login**: `POST /api/v1/identity/login`
- **Register**: `POST /api/v1/identity/register`
- **Refresh Token**: `POST /api/v1/identity/refresh-token`

## 2. API Key Authentication (System/Client)

Used for machine-to-machine communication or specific secured endpoints.

- Header: `X-Api-Key`
- Value: Configured in `appsettings.json`
