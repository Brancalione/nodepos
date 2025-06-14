import { FastifyInstance } from "fastify";
import * as productController from "../Controller/productController";
import { ProdutoPermitido } from "../Interface/types";
 

export default async function productRoutes(server: FastifyInstance) {
    server.get('/products', productController.getAllProduts)
    server.get('/products/:id', productController.getProductById)
    server.post <{ Body: ProdutoPermitido }>  ('/products', { preHandler: [server.authenticate] } ,productController.postNewProduct)
    server.put <{ Body: ProdutoPermitido }> ('/products/:id',{ preHandler: [server.authenticate] } ,productController.updateProduct)
    server.put('/products/:id/image',{ preHandler: [server.authenticate] } ,productController.updateImageProduct)
    server.delete('/products/:id', { preHandler: [server.authenticate] } , productController.deleteProductById)
    server.get('/login',  productController.getNewTokenJWT)
} 