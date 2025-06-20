import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 100,             // количество виртуальных пользователей
  duration: '1m',       // продолжительность теста
  thresholds: {
    http_req_failed: ['rate<0.01'],       // <1% ошибок
    http_req_duration: ['p(95)<300'],     // 95% ответов быстрее 300мс
    http_reqs: ['count>1000']             // минимум 1000 запросов
  }
}

function getRandomUrl() {
  const page = Math.floor(Math.random() * 1000)
  const offset = page * 10
  return `http://localhost:8000/api/orders/all?offset=${offset}&limit=10`
}

export default function () {
  const url = getRandomUrl()
  const res = http.get(url)

  check(res, {
    'статус 200': (r) => r.status === 200,
    'ответ не пустой': (r) => r.body && r.body.length > 2,
  })

  sleep(1)
}
