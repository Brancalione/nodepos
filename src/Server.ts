import Fastify, {FastifyInstance, FastifyServerOptions } from 'fastify'

const server: FastifyInstance = Fastify ({logger: true })
server.get('/', async(request, reply) => {
    return{
        hello: "word"
    }
})

export const start = async () => {
    try {
        await server.listen({port: 3003});
        server.log.info(`Server listening at ${server.server.address()}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1)
    }
};

