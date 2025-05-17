import { FastifyInstance } from "fastify";
import * as productController from "../Controller/productController";
import { ProdutoPermitido } from "../Interface/types";

export default async function productRoutes(server: FastifyInstance) {
    server.get('/products', productController.getAllProduts)
    server.get('/products/:id', productController.getProductById)
    server.post <{ Body: ProdutoPermitido }>  ('/products', productController.postNewProduct)
    server.put <{ Body: ProdutoPermitido }> ('/products/:id', productController.updateProduct)
    server.put('/products/:id/image', productController.updateImageProduct)
    server.delete('/products/:id', productController.deleteProductById)
} 