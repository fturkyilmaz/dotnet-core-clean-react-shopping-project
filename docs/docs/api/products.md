---
sidebar_position: 4
---

# Products API

Manage products in the shopping catalog.

## Endpoints

### Get All Products

Retrieve all products from the catalog.

**Endpoint**: `GET /api/v1/Products`

**Authentication**: Not required

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop",
    "category": "Electronics",
    "image": "https://example.com/laptop.jpg",
    "rating": {
      "rate": 4.5,
      "count": 120
    }
  }
]
```

---

### Get Product by ID

Retrieve a specific product by its ID.

**Endpoint**: `GET /api/v1/Products/{id}`

**Authentication**: Not required

**Parameters**:
- `id` (path, required): Product ID

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop",
  "category": "Electronics",
  "image": "https://example.com/laptop.jpg",
  "rating": {
    "rate": 4.5,
    "count": 120
  }
}
```

**Response** (404 Not Found):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404
}
```

---

### Create Product

Create a new product in the catalog.

**Endpoint**: `POST /api/v1/Products`

**Authentication**: Required (Bearer Token)

**Authorization**: `CanManageProducts` policy

**Request Body**:
```json
{
  "title": "New Laptop",
  "price": 1299.99,
  "description": "Latest model laptop",
  "category": "Electronics",
  "image": "https://example.com/new-laptop.jpg"
}
```

**Response** (201 Created):
```json
5
```

**Response** (401 Unauthorized):
```json
{
  "type": "https://tools.ietf.org/html/rfc7235#section-3.1",
  "title": "Unauthorized",
  "status": 401
}
```

---

### Update Product

Update an existing product.

**Endpoint**: `PUT /api/v1/Products/{id}`

**Authentication**: Required (Bearer Token)

**Authorization**: `CanManageProducts` policy

**Parameters**:
- `id` (path, required): Product ID

**Request Body**:
```json
{
  "id": 1,
  "title": "Updated Laptop",
  "price": 1099.99,
  "description": "Updated description",
  "category": "Electronics",
  "image": "https://example.com/updated-laptop.jpg"
}
```

**Response** (204 No Content)

**Response** (404 Not Found)

---

### Delete Product

Delete a product from the catalog.

**Endpoint**: `DELETE /api/v1/Products/{id}`

**Authentication**: Required (Bearer Token)

**Authorization**: `CanManageProducts` policy

**Parameters**:
- `id` (path, required): Product ID

**Response** (204 No Content)

**Response** (404 Not Found)

---

### Search Products

Search products with dynamic filtering and sorting.

**Endpoint**: `POST /api/v1/Products/search`

**Authentication**: Not required

**Query Parameters**:
- `index` (query, optional): Page index (default: 0)
- `size` (query, optional): Page size (default: 10)

**Request Body**:
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

**Filter Operators**:
- `eq`: Equals
- `neq`: Not equals
- `lt`: Less than
- `lte`: Less than or equal
- `gt`: Greater than
- `gte`: Greater than or equal
- `contains`: Contains (string)
- `startswith`: Starts with (string)
- `endswith`: Ends with (string)

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop",
    "category": "Electronics",
    "image": "https://example.com/laptop.jpg",
    "rating": {
      "rate": 4.5,
      "count": 120
    }
  }
]
```

## Examples

### cURL Examples

```bash
# Get all products
curl http://localhost:5000/api/v1/Products

# Get product by ID
curl http://localhost:5000/api/v1/Products/1

# Create product (requires authentication)
curl -X POST http://localhost:5000/api/v1/Products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Product",
    "price": 29.99,
    "description": "Product description",
    "category": "Electronics",
    "image": "https://example.com/image.jpg"
  }'

# Search products
curl -X POST http://localhost:5000/api/v1/Products/search?index=0&size=10 \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "field": "price",
      "operator": "lt",
      "value": "1000"
    },
    "sort": [
      {
        "field": "price",
        "dir": "desc"
      }
    ]
  }'
```

### JavaScript Examples

```javascript
// Get all products
const products = await fetch('http://localhost:5000/api/v1/Products')
  .then(res => res.json());

// Create product
const newProduct = await fetch('http://localhost:5000/api/v1/Products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Product',
    price: 29.99,
    description: 'Product description',
    category: 'Electronics',
    image: 'https://example.com/image.jpg'
  })
}).then(res => res.json());

// Search products
const searchResults = await fetch('http://localhost:5000/api/v1/Products/search?index=0&size=10', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    filter: {
      field: 'category',
      operator: 'eq',
      value: 'Electronics'
    },
    sort: [
      {
        field: 'price',
        dir: 'asc'
      }
    ]
  })
}).then(res => res.json());
```

## Rate Limiting

Products endpoints have the following rate limits:

- **General**: 100 requests per minute per IP
- **Create/Update/Delete**: Subject to authentication rate limits

## Caching

Product list and detail endpoints support caching:

- **Cache-Control**: `public, max-age=60`
- **ETag**: Supported for conditional requests
- **Output Caching**: Enabled for GET requests

Use `If-None-Match` header with ETag for efficient caching.
