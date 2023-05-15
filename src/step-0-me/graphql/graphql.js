import { fastify } from '../server.js'
import SQL from '@nearform/sql'
import { makeExecutableSchema } from '@graphql-tools/schema'

const schema2 = `
type Query{
    add(x: Int, y: Int): Int
    pets: [Pet]
}

type Pet {
  name: String!
  owner: Person
}

type Person {
  name: String!
}
`

const typeDefs = [
  `
type Query{
    add(x: Int, y: Int): Int
}`,
  /* Type Defs for Pets */
  `
extend type Query {
    owners: [Person]
    pets: [Pet]
}
type Pet {
  name: String!
  owner: Person
}

type Person {
  name: String!
}
`
]

const addResolver = {
  Query: {
    add: async (_, { x, y }) => {
      return x + y
    }
  }
}

const petsResolver = {
  Query: {
    pets: async () => {
      const { rows } = await fastify.pg.query(SQL`SELECT * from pets`)
      return rows
    },
    owners: async () => {
      const { rows } = await fastify.pg.query(SQL`SELECT * from pets`)
      return rows
    }
  }
}
const loaders = {
  Pet: {
    async owner(queries) {
      const { rows } = await fastify.pg.query(SQL`SELECT * from owners`)
      return queries.map(({ obj: pet }) => {
        return rows.find(item => item.id === pet.owner)
      })
    }
  }
}
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: [petsResolver, addResolver]
})
export { loaders }
