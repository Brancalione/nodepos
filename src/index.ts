const fs = require('fs/promises');
const path = require('path');
import { CategoryAllowed } from './Services/categoryService';
import { Produto, ProdutoPermitido } from './Interface/types';
// import Fastify, {FastifyInstance, FastifyServerOptions } from 'fastify'
import { start } from './Server'
import knex, { Knex } from 'knex';
const config = require ('./database/knexfile')
 
async function validarCategoriasProds() {
    const produtosCaminho = path.join(__dirname, '../products.json');
    const produtosData = await fs.readFile(produtosCaminho, 'utf-8');
    const produtos: Produto[] = JSON.parse(produtosData);

    const listaPermitida: ProdutoPermitido[] = [];

    await Promise.all(produtos.map(async (produto) => {
        const permitido = await CategoryAllowed(produto.category);
        if (permitido) {
            listaPermitida.push({
                id: produto.id,
                name: produto.name,
                pictureUrl: produto.pictureUrl
            });
        }
    }));

    // Define o caminho até a raiz do projeto
    const caminhoArquivo = path.resolve(__dirname, '..', 'processed.json');

    // Converte a lista para uma string JSON
    const jsonString = JSON.stringify(listaPermitida, null, 2); // o `2` deixa o arquivo formatadinho

    // Escreve o arquivo
    fs.writeFile(caminhoArquivo, jsonString, 'utf-8');
}

async function testaDB(){
    const db = knex(config.development)

    try {
        const produtos = await db('produtos').select('*');
        console.log('Entrei')
        await db.destroy()
        return produtos;
    } catch (error) {
        console.log(error)
        await db.destroy()
        return;
    }
}

validarCategoriasProds();
testaDB()

start();