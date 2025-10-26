import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'
import { check, sleep } from 'k6'
import http from 'k6/http'
import { config } from './config/config.js'

// nest | asp | go
const CURRENT_APPLICATION = 'go'
const PORT = config[CURRENT_APPLICATION].port

export const options = {
  vus: 100, // количество виртуальных пользователей
  duration: '1m', // продолжительность теста
  thresholds: {
    http_req_failed: ['rate<0.01'], // <1% ошибок
    http_req_duration: ['p(95)<300'], // 95% ответов быстрее 300мс
    http_reqs: ['count>1000'], // минимум 1000 запросов
  },
}

// Генерация случайного ID заказа (например, от 1 до 10000)
function getRandomOrderId() {
  return Math.floor(Math.random() * 10000) + 1
}

export default function () {
  const orderId = getRandomOrderId()
  const url = `http://localhost:${PORT}/api/orders/${orderId}`

  const res = http.get(url)

  check(res, {
    'статус 200': r => r.status === 200,
    'ответ содержит orderId': r =>
      r.body.includes(`"id":${orderId}`) || r.body.length > 2,
  })

  sleep(1)
}

export function handleSummary(data) {
  const path = __ENV.REPORT_NAME || './summary.html'
  const number = __ENV.REPORT_NUMBER ?? ''

  return {
    [path]: htmlReport(data, {
      title: `${CURRENT_APPLICATION.toUpperCase()} ${number} | Get Order | Summary Report`,
      theme: 'default',
    }),
  }
}
