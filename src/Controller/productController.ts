const path = require('path');
const fs = require('fs/promises');

import { FastifyRequest, FastifyReply } from 'fastify';
import { ProdutoPermitido } from '../Interface/types';

export const getAllProduts = async (request: FastifyRequest, reply: FastifyReply) => {
    readProducts();
}

export const getProductsById = async (request: FastifyRequest, reply: FastifyReply) => {
    request.params as { id: string };
    readProducts();
}

const readProducts = async (id?: string) => {
    const produtosCaminho = path.join(__dirname, '../processed.json');
    const produtosData = await fs.readFile(produtosCaminho, 'utf-8');
    const produtos: ProdutoPermitido[] = JSON.parse(produtosData);

    if (!id) {
        return produtos;
    }

    // Verificar se o id existe
    var produtoEncontrado: ProdutoPermitido = produtos.filter(p => p.id === id)[0];
    console.log(produtoEncontrado);
}