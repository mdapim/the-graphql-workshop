import buildServer from './index.js'

export const fastify = buildServer()

const start = async function () {
  await fastify.ready()

  // fastify.graphql.addHook(
  //   'preExecution',
  //   async function logGraphQLDetails(schema, document, context, variables) {
  //     console.log('preExecution', context.locale)
  //     context.locale = 'ru'
  //     const errors = new Error('fooooo')
  //     return {
  //       schema,
  //       document,
  //       variables,
  //       errors
  //     }
  //   }
  // )

  // fastify.graphql.addHook('preParsing', async (schema, source, context) => {
  //   console.log('preparsing is occuring')
  // })

  // fastify.graphql.addHook(
  //   'preValidation',
  //   async (schema, document, context) => {
  //     console.log('prevalidation')
  //   }
  // )

  // fastify.graphql.addHook('onResolution', async (execution, context) => {
  //   console.log('Onresolution this is context', context.locale)
  // })

  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
