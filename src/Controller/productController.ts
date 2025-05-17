const path = require('path');
const fs = require('fs/promises');
import { pipeline } from "stream";
import { promisify } from "util";
const pump = promisify(pipeline);

import { FastifyRequest, FastifyReply } from 'fastify';
import { ProdutoPermitido } from '../Interface/types';

export const getAllProduts = async () => {
    return readProducts();
}

export const getProductById = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const produtos = await readProducts();
    const produtoEncontrado = produtos.find(p => p.id === params.id);

    // Verificar se o produto existe
    if (!produtoEncontrado) {
        reply.code(404).send({ error: "Item não encontrado" })
        return;
    }

    return produtoEncontrado;
}

export const postNewProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    const newProduct: ProdutoPermitido =  request.body as ProdutoPermitido 

    if (!newProduct.name || !newProduct.pictureUrl) {
        reply.code(400).send({ error: "Body inválido" })
        return 
    }

    const produtos = await readProducts() 
    var newId: number = 1

    while (produtos.find(p => p.id == newId.toString())) {
        newId++
    }

    const novoProduto: ProdutoPermitido = {
        id: newId.toString(),
        name: newProduct.name,
        pictureUrl: newProduct.pictureUrl
    }

    produtos.push(novoProduto)
    await writeProducts(produtos)

    return reply.status(201).send(novoProduto);
}

export const updateProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    var produtos = await readProducts();
    const produtoEncontrado = produtos.findIndex(p => p.id === params.id);

    // Verificar se o produto existe
    if (produtoEncontrado === -1) {
        reply.code(404).send({ error: "Item não encontrado" })
        return;
    }

    const newProduct: ProdutoPermitido =  request.body as ProdutoPermitido 

    const updateProduct: ProdutoPermitido = {
        id: params.id,
        name: newProduct.name,
        pictureUrl: newProduct.pictureUrl
    }

    produtos[produtoEncontrado] = updateProduct 

    await writeProducts(produtos)
    return reply.code(204).send("Update product")


}

export const updateImageProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    var produtos = await readProducts();
    const produtoEncontrado = produtos.findIndex(p => p.id === params.id);

    // Verificar se o produto existe
    if (produtoEncontrado === -1) {
        reply.code(404).send({ error: "Item não encontrado" })
        return;
    }

    const date: any = await request.file();
    
    const produtosCaminho = path.join(__dirname, 'Img' , date.filename);

    try {
        await new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(produtosCaminho);
            date.file.pipe(writeStream);
            date.file.on('end', resolve);
            date.file.on('error', reject);
        });

        return reply.code(204).send("Update product");
    } catch (err) {
        console.error("Erro ao salvar a imagem:", err);
        return reply.code(500).send({ error: "Erro ao salvar a imagem" });
    }
}

 
export const deleteProductById = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    var produtos = await readProducts();
    const produtoEncontrado = produtos.findIndex(p => p.id === params.id);

    // Verificar se o produto existe
    if (produtoEncontrado === -1) {
        reply.code(404).send({ error: "Item não encontrado" })
        return;
    }

    produtos.splice(produtoEncontrado, 1);
    await writeProducts(produtos)
    return reply.code(204).send();
}

//Funções Auxiliares
const readProducts = async () => {
    const produtosCaminho = path.join(__dirname, '../processed.json');
    const produtosData = await fs.readFile(produtosCaminho, 'utf-8');
    const produtos: ProdutoPermitido[] = JSON.parse(produtosData);

    return produtos
}

const writeProducts = async (produtos: ProdutoPermitido[]) => {
    const produtosCaminho = path.join(__dirname, '../processed.json');
    const jsonString = JSON.stringify(produtos, null, 2); // o `2` deixa o arquivo formatadinho

    fs.writeFile(produtosCaminho, jsonString, 'utf-8');;
}