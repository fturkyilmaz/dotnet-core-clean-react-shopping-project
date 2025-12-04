# Health API

Manage user shopping carts.

## Endpoints

### Get Health
`GET /health`

#### Example Response
```json
{
  "status": "Unhealthy",
  "totalDuration": "00:00:00.0035083",
  "entries": {
    "masstransit-bus": {
      "data": {
        "Endpoints": {
          "rabbitmq://localhost/product-added-event-queue": {
            "status": "Healthy",
            "description": "ready"
          },
          "rabbitmq://localhost/cart-created-event-queue": {
            "status": "Healthy",
            "description": "ready"
          },
          "rabbitmq://localhost/192_ShoppingProjectWebApi_bus_he1yyyg4gctp463nbdxdgebidm?temporary=true": {
            "status": "Healthy",
            "description": "ready (not started)"
          }
        }
      },
      "description": "Ready",
      "duration": "00:00:00.0000259",
      "status": "Healthy",
      "tags": [
        "ready",
        "masstransit"
      ]
    },
    "npgsql": {
      "data": {},
      "duration": "00:00:00.0005224",
      "status": "Healthy",
      "tags": []
    },
    "redis": {
      "data": {},
      "duration": "00:00:00.0008087",
      "status": "Healthy",
      "tags": []
    },
    "rabbitmq": {
      "data": {},
      "duration": "00:00:00.0016444",
      "status": "Healthy",
      "tags": [
        "ready"
      ]
    },
    "elasticsearch": {
      "data": {},
      "description": "Connection refused (localhost:9200)",
      "duration": "00:00:00.0020739",
      "exception": "Connection refused (localhost:9200)",
      "status": "Unhealthy",
      "tags": [
        "elasticsearch"
      ]
    }
  }
}
