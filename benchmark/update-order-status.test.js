import http from 'k6/http'
import { check, sleep } from 'k6'

// Настройки нагрузки
export const options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
    http_reqs: ['count>1000'],
  }
}

// Список тестовых ID заказов
const orderIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// OrderStatus enum (как в TS, но вручную в JS)
const OrderStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  DELIVERY: 'delivery',
  CANCELLED: 'cancelled',
}

// Все возможные значения
const statusValues = Object.values(OrderStatus)

// Функции генерации данных
function getRandomOrderId() {
  return orderIds[Math.floor(Math.random() * orderIds.length)]
}

function getRandomStatus() {
  return statusValues[Math.floor(Math.random() * statusValues.length)]
}

// Тестовая функция
export default function () {
  const orderId = getRandomOrderId()
  const status = getRandomStatus()

  const url = `http://localhost:4000/api/payment/orders/${orderId}/status`
  const payload = JSON.stringify({ status })
  const headers = { 'Content-Type': 'application/json' }

  const res = http.post(url, payload, { headers })

  check(res, {
    'статус 201': (r) => r.status === 201 || r.status === 202,
  })

  sleep(1)
}
