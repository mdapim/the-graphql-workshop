import Fastify from 'fastify'
import mercuriusGateway from '@mercuriusjs/gateway'

const gateway = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  }
})
gateway.register(mercuriusGateway, {
  gateway: {
    services: [
      {
        name: 'user',
        url: 'http://localhost:4001/graphql'
      },
      {
        name: 'post',
        url: 'http://localhost:4002/graphql'
      }
    ]
  },
  graphiql: true
})

gateway.listen({ port: 3000 })
