# Void Market Nest

## Contracts

### Create Order
`POST /api/orders/`

Example request body:
```json
{
  "userId": "user-uuid-123",
  "status": "pending",
  "items": [
    {
      "name": "Product A",
      "quantity": 2,
      "unitPrice": 199.99
    },
    {
      "name": "Product B",
      "quantity": 1,
      "unitPrice": 49.5
    }
  ]
}

  ```
Possible field values `status`:

- `pending` – The order is created, expects payment
- `paid` – The order was paid
- `shipped` – The order was sent
- `delivery` – Ordering in the delivery process
- `cancelled` – The order is canceled

### Get Order
`GET /api/orders/:id`
 
Will return single order.
 
Example response:
```json
{
  "id": 1001,
  "userId": "user-uuid-123",
  "status": "paid",
  "total": 449.48,
  "items": [
    {
      "id": 1,
      "name": "Product A",
      "quantity": 2,
      "unitPrice": 199.99
    },
    {
      "id": 2,
      "name": "Product B",
      "quantity": 1,
      "unitPrice": 49.5
    }
  ],
  "user": {
    "id": "user-uuid-123",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2025-07-15T10:00:00.000Z",
    "updatedAt": "2025-07-15T13:00:00.000Z"
  },
  "createdAt": "2025-07-15T12:00:00.000Z",
  "updatedAt": "2025-07-15T13:00:00.000Z"
} 
 ```

### Get Orders
`GET /api/orders/all?offset=1&limit=10`

Can also take limit and offset query parameters like List Orders.

Example response:
```json
{
  "orders": [
    {
      "id": 1001,
      "userId": "user-uuid-123",
      "status": "paid",
      "total": 449.48,
      "items": [
        {
          "id": 1,
          "name": "Product A",
          "quantity": 2,
          "unitPrice": 199.99
        },
        {
          "id": 2,
          "name": "Product B",
          "quantity": 1,
          "unitPrice": 49.5
        }
      ],
      "user": {
        "id": "user-uuid-123",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "createdAt": "2025-07-15T10:00:00.000Z",
        "updatedAt": "2025-07-15T13:00:00.000Z"
      },
      "createdAt": "2025-07-15T12:00:00.000Z",
      "updatedAt": "2025-07-15T13:00:00.000Z"
    }
  ],
  "total": 1
}
```

### Update Order Status
`POST /orders/:id/status`

Example request body:
```json
{
  "status": "paid",
}
```
Possible field values `status`:

- `pending` – The order is created, expects payment
- `paid` – The order was paid
- `shipped` – The order was sent
- `delivery` – Ordering in the delivery process
- `cancelled` – The order is canceled