const path = require('path');
const fs = require('fs/promises');

import { FastifyRequest, FastifyReply } from 'fastify';
import { ProdutoPermitido } from '../Interface/types';

export const getAllProduts = async (request: FastifyRequest, reply: FastifyReply) => {
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
    const { name, pictureUrl } = request.body as Omit<ProdutoPermitido, 'id'>;

    if (!name || pictureUrl) {
        reply.code(400).send({ error: "Body inválido" })
    }

    const produtos = await readProducts() as ProdutoPermitido[]
    var newId: number = 1

    while (produtos.find(p => p.id == newId.toString())) {
        newId++
    }

    const novoProduto: ProdutoPermitido = {
        id: newId.toString(),
        name: name,
        pictureUrl: pictureUrl
    }

    produtos.push(novoProduto)
    await writeProducts(produtos)

    return reply.status(201).send(novoProduto);
}

export const updateProduct = async (request: FastifyRequest, reply: FastifyReply) => {

}

export const deleteProductById = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    var produtos = await readProducts();
    const produtoEncontrado = produtos.findIndex(p => p.id === params.id);

    // Verificar se o produto existe
    if (produtoEncontrado < 0) {
        reply.code(404).send({ error: "Item não encontrado" })
        return;
    }

    produtos = produtos.splice(produtoEncontrado, 1);
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