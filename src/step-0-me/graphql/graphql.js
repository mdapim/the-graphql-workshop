import { fastify } from '../server.js'
import SQL from '@nearform/sql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import mercurius from 'mercurius'
import { Users, FragUsers } from './data.js'

const typeDefs = [
  `
type Query{
    add(x: Int!, y: Int!): Int
}`,
  /* Type Defs for Pets */
  `
extend type Query {
    owners: [Person]!
    pets: [Pet]!
}
type Pet {
  name: String!
  owner: Person!
}

type Person {
  name: String!
}
`,
  /* Type Def for user */
  `
  extend type Query{
    getUserByLocale: UserL!
  }

  type UserL {
    name: String!
    locale: String!
}`,

  /* Type Defs for find user */
  `
extend type Query {
    findUser(id: Int!): User!
}

type User {
    name: String!
    id: Int!
}
`,
  /* Type Fragments for users by level */
  `
extend type Query {
  getNoviceUsers: [UserF]!
  getAdvancedUsers: [UserF]!
}


type UserF {
  id: Int!
  name: String!
  age: Int!
  level: String!
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
      console.log('found')
      const { rows } = await fastify.pg.query(SQL`SELECT * from pets`)
      return rows
    }
    // owners: async () => {
    //   const { rows } = await fastify.pg.query(SQL`SELECT * from pets`)
    //   return rows
    // }
  }
}

const getUserLocaleResolver = {
  Query: {
    getUserByLocale: (parent, args, context) => {
      const user = Users.find(user => user.locale === context.locale)
      return user
    }
  }
}

const findUserResolver = {
  Query: {
    findUser: async (_, { id }) => {
      const foundUser = Users.find(user => user.id === id)
      if (foundUser) return foundUser

      throw new mercurius.ErrorWithProps('Invalid User ID', {
        code: 'USER_ID_INVALID',
        id
      })
    }
  }
}

const getUsersByLevelResolver = {
  Query: {
    getNoviceUsers: () => {
      const users = FragUsers.filter(user => user.level === 'novice')
      console.log(users)
      return users
    },

    getAdvancedUsers: () => {
      const users = FragUsers.filter(user => user.level === 'advanced')
      return users
    }
  }
}

const loaders = {
  Pet: {
    async owner(queries) {
      console.log(queries)
      const { rows } = await fastify.pg.query(SQL`SELECT * from owners`)
      return queries.map(({ obj: pet }) => {
        return rows.find(item => item.id === pet.owner)
      })
    }
  }
}

const context = () => {
  return {
    locale: 'en'
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: [
    petsResolver,
    addResolver,
    getUserLocaleResolver,
    findUserResolver,
    getUsersByLevelResolver
  ]
})
export { loaders, context }
