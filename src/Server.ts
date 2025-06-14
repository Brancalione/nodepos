import Fastify, { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify'
import productRoutes from './Routes/products'
import fastifyMultipart from '@fastify/multipart'
import fastifyJwt from 'fastify-jwt';
import dotenv from 'dotenv';

dotenv.config(); 

const server: FastifyInstance = Fastify({ logger: true })
server.get('/', async (request, reply) => {
    return {
        hello: "word"
    }
})


server.register(fastifyMultipart)

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
  sign: {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  }
});

// Middleware global de autenticação — pode ser usado nas rotas como `preHandler: [server.authenticate]`
server.decorate("authenticate", async (request:FastifyRequest, reply:FastifyReply) => {
  try {
    await request.jwtVerify(); // Valida e preenche `request.user`
  } catch (err) {
    reply.code(401).send({ message: 'Token inválido ou ausente' });
  }
  
});


server.register(productRoutes)

export const start = async () => {
    try {
        await server.listen({ port: 3003 });
        server.log.info(`Server listening at ${server.server.address()}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1)
    }
};

