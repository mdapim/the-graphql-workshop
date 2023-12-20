import Fastify from 'fastify'
import { mercuriusFederationPlugin } from '@mercuriusjs/federation'
import { users } from '../graphql/data.js'

const service = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  }
})
const schema = `
  extend type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String!
    username: String!
  }
`

const resolvers = {
  Query: {
    me: () => {
      console.log(users[1])
      return users[1]
    }
  },
  User: {
    __resolveReference: source => {
      console.log(users[source.id])
      return users[source.id]
    }
  }
}

service.register(mercuriusFederationPlugin, {
  schema,
  resolvers,
  graphiql: true
})

service.listen({ port: 4001 })
