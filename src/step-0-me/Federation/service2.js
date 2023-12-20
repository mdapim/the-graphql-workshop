import Fastify from 'fastify'
import { mercuriusFederationPlugin } from '@mercuriusjs/federation'
import { posts } from '../graphql/data.js'

const service = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  }
})
const schema = `
  extend type Query {
    topPosts(count: Int): [Post]
  }

  type Post @key(fields: "id") {
    id: ID!
    title: String
    content: String
    authorId: User 
  }
  
  extend type User @key(fields: "id") {
    id: ID @external
    name: String! @external
    posts: [Post]
  }

`

const resolvers = {
  Query: {
    topPosts: (root, { count = 2 }) => Object.values(posts).slice(0, count)
  },
  Post: {
    __resolveReference: post => {
      return posts[post.id]
    },
    authorId: post => {
      return {
        __typename: 'User',
        id: post.authorId
      }
    }
  },
  User: {
    posts: user => {
      return Object.values(posts).filter(p => p.authorId === user.id)
    }
  }
}

service.register(mercuriusFederationPlugin, {
  schema,
  resolvers
})

service.listen({ port: 4002 })
