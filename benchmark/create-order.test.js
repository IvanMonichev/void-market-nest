import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'
import { check, sleep } from 'k6'
import http from 'k6/http'
import { config } from './config/config.js'

// nest | asp | go
const CURRENT_APPLICATION = 'nest'
const PORT = config[CURRENT_APPLICATION].port

export const options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
  },
}

const BASE_URL = `http://localhost:${PORT}/api/orders`

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
  const userId = '68fa56c5e6b27d44e7fa4b93'
  const status = statusValues[getRandomInt(0, statusValues.length - 1)]

  const items = Array.from({ length: getRandomInt(1, 3) }).map((_, i) => ({
    name: `Product ${i + 1}`,
    quantity: getRandomInt(1, 5),
    unitPrice: parseFloat((Math.random() * 100 + 10).toFixed(2)),
  }))

  return JSON.stringify({ userId, status, items })
}

export default function () {
  const headers = {
    'Content-Type': 'application/json',
  }

  const payload = generateOrderPayload()

  const res = http.post(BASE_URL, payload, { headers })

  check(res, {
    '📦 статус 201': r => r.status === 201,
  })

  sleep(1)
}

export function handleSummary(data) {
  const path = __ENV.REPORT_NAME || './summary.html'

  return {
    [path]: htmlReport(data, {
      title: `${CURRENT_APPLICATION.toUpperCase()} | Create Order | Summary Report`,
      theme: 'default',
    }),
  }
}
