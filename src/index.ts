const fs = require('fs/promises');
const path = require('path');
import { CategoryAllowed } from './Services/categoryService';
import { Produto, ProdutoPermitido } from './Interface/types';
// import Fastify, {FastifyInstance, FastifyServerOptions } from 'fastify'
import { start } from './Server'
import * as databaseService from './database/databaseService'
 
async function validarCategoriasProds() {
    //const produtosCaminho = path.join(__dirname, '../products.json');
    //const produtosData = await fs.readFile(produtosCaminho, 'utf-8');
    //const produtos: Produto[] = JSON.parse(produtosData);
    const produtos = await databaseService.retornaProdutos()
    const listaPermitida: ProdutoPermitido[] = [];

    console.log('Cheguei')

    await Promise.all((produtos as Produto[]).map(async (produto) => {
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
    await fs.writeFile(caminhoArquivo, jsonString, 'utf-8');

    // Escrever lista no banco
    await databaseService.atualizaProcessed(listaPermitida)

    const teste = await databaseService.retornaProcessed()
    console.log(teste)
}

//main()
validarCategoriasProds();
start();