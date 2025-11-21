---
sidebar_position: 1
---

# Using Postman Collection

Learn how to use the Shopping Project Postman Collection for API testing.

## Import Collection

1. Open **Postman**
2. Click **Import** button
3. Navigate to `postman/ShoppingProject.postman_collection.json`
4. Click **Import**

## Import Environment

1. Click **Environments** tab
2. Click **Import**
3. Select `postman/Local.postman_environment.json`
4. Select **Local Development** from environment dropdown

## Authentication Workflow

### 1. Login

1. Open **Identity** → **Login** request
2. Update credentials in request body if needed:
   ```json
   {
     "email": "admin@example.com",
     "password": "Admin123!"
   }
   ```
3. Click **Send**
4. Token is automatically saved to environment

### 2. Use Protected Endpoints

All subsequent requests will automatically use the saved token.

## Testing Scenarios

### Create a Product

1. **Login** first to get authentication token
2. Open **Products** → **Create Product**
3. Modify request body:
   ```json
   {
     "title": "Test Product",
     "price": 49.99,
     "description": "Test description",
     "category": "Electronics",
     "image": "https://example.com/test.jpg"
   }
   ```
4. Click **Send**
5. Note the returned product ID

### Search Products

1. Open **Products** → **Search Products**
2. Customize filter and sort:
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
3. Click **Send**

### Test Rate Limiting

1. Open **Identity** → **Login**
2. Click **Send** multiple times rapidly
3. After 5 requests in 1 minute, you'll receive:
   ```json
   {
     "statusCode": 429,
     "message": "API calls quota exceeded!"
   }
   ```

## Environment Variables

| Variable | Description | Auto-set |
|----------|-------------|----------|
| `baseUrl` | API base URL | No |
| `apiVersion` | API version | No |
| `token` | JWT token | Yes (after login) |
| `lastProductId` | Last created product ID | Yes (after create) |

## Test Scripts

The collection includes automated tests:

### Login Tests
- Validates status code is 200
- Checks response has token
- Saves token to environment

### Create Product Tests
- Validates status code is 201
- Checks product ID is returned
- Saves product ID to environment

## Tips

1. **Use Variables**: Reference variables with `{{variableName}}`
2. **Pre-request Scripts**: Automatically set headers
3. **Test Scripts**: Validate responses automatically
4. **Collections Runner**: Run entire collection
5. **Export Results**: Share test results with team

## Troubleshooting

### Token Not Saving

- Check **Tests** tab in Login request
- Verify environment is selected
- Check console for errors

### 401 Unauthorized

- Run Login request first
- Check token in environment
- Verify token hasn't expired (60 min)

### 429 Rate Limit

- Wait 1 minute before retrying
- Check rate limit configuration
- Use different IP if testing
