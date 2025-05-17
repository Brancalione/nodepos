import { FastifyInstance } from "fastify";
import * as productController from "../Controller/productController";

export default async function productRoutes(server: FastifyInstance) {
    server.get('/products', productController.getAllProduts)
    server.get('/products/:id', productController.getProductById)
    //server.post('/products/', productController.getAllProduts)
    //server.put('/products/:id', productController.getAllProduts)
    //server.put('/products/:id', productController.getAllProduts)
    //server.delete('/products/:id', productController.getAllProduts)
}