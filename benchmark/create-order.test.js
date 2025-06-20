import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 50,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
  }
}

const BASE_URL = 'http://localhost:4000/api/orders'

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const OrderStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  DELIVERY: 'delivery',
  CANCELLED: 'cancelled',
}

// Все возможные значения
const statusValues = Object.values(OrderStatus)


function generateOrderPayload() {
  const userId = '685502b32b4da12d1ce42cb1'
  const status = statusValues[getRandomInt(0, statusValues.length - 1)]

  const items = Array.from({ length: getRandomInt(1, 3) }).map((_, i) => ({
    name: `Product ${i + 1}`,
    quantity: getRandomInt(1, 5),
    unitPrice: parseFloat((Math.random() * 100 + 10).toFixed(2))
  }))

  return JSON.stringify({ userId, status, items })
}

export default function () {
  const headers = {
    'Content-Type': 'application/json'
  }

  const payload = generateOrderPayload()

  const res = http.post(BASE_URL, payload, { headers })

  check(res, {
    '📦 статус 201': (r) => r.status === 201,
    '🧾 тело содержит статус': (r) => r.body.includes('"status"'),
  })

  sleep(1)
}
