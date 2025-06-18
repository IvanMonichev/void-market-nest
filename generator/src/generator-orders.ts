import { faker } from '@faker-js/faker'
import axios from 'axios'

enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERY = 'delivery',
  CANCELLED = 'cancelled'
}

type CreateOrderItemDto = {
  name: string
  quantity: number
  unitPrice: number
}

type CreateOrderDto = {
  userId: string
  status: OrderStatus
  items: CreateOrderItemDto[]
}

const getRandomStatus = (): OrderStatus => {
  const statuses: OrderStatus[] = Object.values(OrderStatus)
  return faker.helpers.arrayElement(statuses)
}

const generateOrderItems = (): CreateOrderItemDto[] => {
  const count = faker.number.int({ min: 2, max: 5 })
  return Array.from({ length: count }, () => ({
    name: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    unitPrice: parseFloat(faker.commerce.price({ min: 5, max: 100 }))
  }))
}

export const createOrdersForUser = async (api: string, userId: string, countOrders: number): Promise<void> => {
  const orders = Array.from({ length: countOrders }, () => {
    const order: CreateOrderDto = {
      userId,
      status: getRandomStatus(),
      items: generateOrderItems()
    }
    return axios.post(api, order).catch((err) => {
      console.error('Ошибка при создании заказа:', err.response?.data || err.message)
    })
  })

  await Promise.all(orders)
}
