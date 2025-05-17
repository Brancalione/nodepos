const path = require('path');
const fs = require('fs/promises');

import { FastifyRequest, FastifyReply } from 'fastify';
import { ProdutoPermitido } from '../Interface/types';
import { NOTFOUND } from 'dns';

export const getAllProduts = async (request: FastifyRequest, reply: FastifyReply) => {
    return readProducts();
}

export const getProductsById = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const produtoEncontrado = readProducts(params.id);

    // Verificar se o id existe
    if (!produtoEncontrado) {
        reply.code(404).send({ error: "Item não encontrado" })
        return;
    }

    return produtoEncontrado;
}

const readProducts = async (id?: string) => {
    const produtosCaminho = path.join(__dirname, '../processed.json');
    const produtosData = await fs.readFile(produtosCaminho, 'utf-8');
    const produtos: ProdutoPermitido[] = JSON.parse(produtosData);

    if (!id) {
        return produtos;
    }

    var produtoEncontrado: ProdutoPermitido = produtos.filter(p => p.id === id)[0];
    return produtoEncontrado;
}