import Fastify from 'fastify'
import mercurius from 'mercurius'
import { schema, loaders, context } from './graphql/graphql.js'

// const schema = `
// type Query{
//     add(x: Int, y: Int): Int
// }`

// const resolvers = {
//   Query: {
//     add: async (_, { x, y }) => x + y
//   }
// }

function buildServer() {
  const fastify = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty'
      }
    }
  })

  fastify.log.info('Fastify is starting up!')

  fastify.register(import('@fastify/postgres'), {
    connectionString: 'postgres://postgres:postgres@0.0.0.0:5433/postgres'
  })
  fastify.register(mercurius, { schema, loaders, context, graphiql: true })
  return fastify
}

export default buildServer
