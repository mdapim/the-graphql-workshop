import Fastify from 'fastify'
import mercurius from 'mercurius'

const app = Fastify()

app.register(mercurius, {
  schema,
  resolvers,
  loaders,
  graphiql: true
})

app.listen(3000)
