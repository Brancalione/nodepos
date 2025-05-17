import { FastifyInstance } from "fastify";
import * as productController from "../Controller/productController";

export default async function productRoutes(fastify: FastifyInstance) {
    fastify.get('/', {
        handler:productController.listProducts
    })

}