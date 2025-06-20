import { createOrdersForUser } from "./generator-orders"
import { createUser } from "./generator-users"

const USER_COUNT = 1000
const ORDERS_PER_USER = 10

const API = {
  createUser: 'http://localhost:8000/api/users',
  createOrder: 'http://localhost:8000/api/orders'
}

async function main() {
  console.log(`🚀 Генерация ${USER_COUNT} пользователей и ${USER_COUNT * ORDERS_PER_USER} заказов...`)
  for (let i = 0; i < USER_COUNT; i++) {
    const userId = await createUser(API.createUser)
    if (userId) {
      await createOrdersForUser(API.createOrder, userId, ORDERS_PER_USER)
      if ((i + 1) % 100 === 0) console.log(`🔄 Создано ${i + 1} пользователей`)
    }
  }
  console.log('✅ Генерация завершена.')
}

main().catch(console.error)
