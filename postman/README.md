# Shopping Project - Postman Collection

This directory contains the Postman collection and environments for testing the Shopping Project API.

## 📦 Contents

- `ShoppingProject.postman_collection.json` - Complete API collection
- `Local.postman_environment.json` - Local development environment
- `Production.postman_environment.json` - Production environment (optional)

## 🚀 Quick Start

### 1. Import Collection

1. Open Postman
2. Click **Import** button
3. Select `ShoppingProject.postman_collection.json`
4. Click **Import**

### 2. Import Environment

1. Click the **Environments** tab (left sidebar)
2. Click **Import**
3. Select `Local.postman_environment.json`
4. Click **Import**
5. Select "Local Development" from the environment dropdown (top right)

### 3. Authentication Flow

#### Login and Get Token

1. Open the **Identity** folder
2. Run the **Login** request
3. The token will be automatically saved to your environment
4. All subsequent requests will use this token

**Default Credentials:**
```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

## 📚 API Endpoints

### Identity API
- `POST /api/v1/Identity/login` - User login
- `POST /api/v1/Identity/register` - User registration
- `POST /api/v1/Identity/{userId}/assign-admin-role` - Assign admin role
- `POST /api/v1/Identity/roles/{roleName}` - Create role

### Products API
- `GET /api/v1/Products` - Get all products
- `GET /api/v1/Products/{id}` - Get product by ID
- `POST /api/v1/Products` - Create product (Auth required)
- `PUT /api/v1/Products/{id}` - Update product (Auth required)
- `DELETE /api/v1/Products/{id}` - Delete product (Auth required)
- `POST /api/v1/Products/search` - Search products with filters

### Carts API
- `GET /api/v1/Carts` - Get all carts
- `GET /api/v1/Carts/{id}` - Get cart by ID
- `POST /api/v1/Carts` - Create cart (Auth required)
- `PUT /api/v1/Carts/{id}` - Update cart (Auth required)
- `DELETE /api/v1/Carts/{id}` - Delete cart (Auth required)

## 🔐 Authorization

### Anonymous Endpoints
These endpoints don't require authentication:
- All GET requests for Products
- All GET requests for Carts
- Login and Register

### Protected Endpoints
These endpoints require a valid JWT token:

**CanManageProducts Policy:**
- Create, Update, Delete Products

**CanPurge Policy:**
- Create, Update, Delete Carts

## 🧪 Testing

Each request includes automated tests that verify:
- Response status codes
- Response data structure
- Token persistence (for login)

Tests run automatically after each request. View results in the **Test Results** tab.

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `baseUrl` | API base URL | `http://localhost:5000` |
| `apiVersion` | API version | `1.0` |
| `token` | JWT authentication token | Auto-set after login |

## 📝 Example Workflows

### Create a New Product

1. **Login** to get authentication token
2. Run **Create Product** request
3. Note the returned product ID
4. Use **Get Product by ID** to verify creation

### Search Products

1. Use **Search Products** request
2. Modify the filter criteria in the request body:
   ```json
   {
     "filter": {
       "field": "category",
       "operator": "eq",
       "value": "Electronics"
     },
     "sort": [
       {
         "field": "price",
         "dir": "asc"
       }
     ]
   }
   ```

## 🐛 Troubleshooting

### "Unauthorized" Error
- Ensure you've run the Login request
- Check that the token is saved in your environment
- Verify the token hasn't expired

### "Bad Request" Error
- Check request body format
- Ensure all required fields are provided
- Verify data types match the API expectations

### Connection Refused
- Ensure the API is running (`dotnet run`)
- Verify the `baseUrl` in your environment matches your API URL
- Check that the port number is correct

## 📖 Additional Resources

- [Full API Documentation](../docs) - Detailed API reference
- [Swagger UI](http://localhost:5000/swagger) - Interactive API explorer
- [Project README](../README.md) - Project overview

## 🤝 Contributing

When adding new endpoints:
1. Add the request to the appropriate folder
2. Include request/response examples
3. Add test scripts
4. Update this README
