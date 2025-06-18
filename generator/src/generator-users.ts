import axios from 'axios'
import { faker } from '@faker-js/faker'


type CreateUserDto = {
  name: string
  email: string
  password: string
}

export const generateUser = (): CreateUserDto => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 })
  }
}

export const createUser = async (api: string): Promise<string | null>  => {
  const user = generateUser()

  try {
    const response = await axios.post(api, user)
    const userId = response.data?.id || response.data?._id
    if (!userId) {
      console.warn('⛔ Не удалось получить userId:', response.data)
      return null
    }
    return userId
  } catch (err: any) {
    console.error('Ошибка создания пользователя:', err.response?.data || err.message)
    return null
  }
}


