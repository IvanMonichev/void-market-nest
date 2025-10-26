import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'
import { check, sleep } from 'k6'
import http from 'k6/http'
import { config } from './config/config.js'

// nest | asp | go
const CURRENT_APPLICATION = 'go'
const PORT = config[CURRENT_APPLICATION].port

// Настройки нагрузки
export const options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
    http_reqs: ['count>1000'],
  },
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

function getRandomOrderId() {
  return Math.floor(Math.random() * (239618 - 182635 + 1)) + 182635
}

function getRandomStatus() {
  return statusValues[Math.floor(Math.random() * statusValues.length)]
}

export default function () {
  const orderId = getRandomOrderId()
  const status = getRandomStatus()

  const url = `http://localhost:${PORT}/api/payment/orders/${orderId}/status`
  const payload = JSON.stringify({ status })
  const headers = { 'Content-Type': 'application/json' }

  const res = http.post(url, payload, { headers })

  check(res, {
    'статус 201': r => r.status === 201 || r.status === 202 || r.status === 200,
  })

  sleep(1)
}

export function handleSummary(data) {
  const path = __ENV.REPORT_NAME || './summary.html'
  const number = __ENV.REPORT_NUMBER || ''

  return {
    [path]: htmlReport(data, {
      title: `${CURRENT_APPLICATION.toUpperCase()} ${number} | Update Status Order | Summary Report`,
      theme: 'default',
    }),
  }
}
