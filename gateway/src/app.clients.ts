export const Client = {
  UserService: 'http://host.docker.internal:8010/users',
  OrderService: 'http://host.docker.internal:8020/orders',
  PaymentService: 'http://host.docker.internal:8030/payment',
} as const;
