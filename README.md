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
Возможные значения поля `status`:

- `pending` – заказ создан, ожидает оплаты
- `paid` – заказ оплачен
- `shipped` – заказ отправлен
- `delivery` – заказ в процессе доставки
- `cancelled` – заказ отменён

### Get Order
`GET /api/orders/:id`
 
Will return single order
 
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
Can also take limit and offset query parameters like List Orders
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
Возможные значения поля `status`:

- `pending` – заказ создан, ожидает оплаты
- `paid` – заказ оплачен
- `shipped` – заказ отправлен
- `delivery` – заказ в процессе доставки
- `cancelled` – заказ отменён