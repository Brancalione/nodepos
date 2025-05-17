const fs = require('fs/promises');
const path = require('path');
import { CategoryAllowed } from './Services/categoryService';
import { Produto, ProdutoPermitido } from './Interface/types';
import Fastify, {FastifyInstance, FastifyServerOptions } from 'fastify'

async function validarCategoriasProds() {
    const produtosCaminho = path.join(__dirname, '../produtcts.json');
    const produtosData = await fs.readFile(produtosCaminho, 'utf-8');
    const produtos: Produto[] = JSON.parse(produtosData);

    const listaPermitida: ProdutoPermitido[] = [];

    await Promise.all(produtos.map(async (produto) => {
        const permitido = await CategoryAllowed(produto.category);
        if (permitido) {
            listaPermitida.push({
                id: produto.id,
                name: produto.name
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

validarCategoriasProds();

const server: FastifyInstance = Fastify ({logger: true })
server.get('/', async(request, reply) => {
    return{
        hello: "word"
    }
})

const start = async () => {
    try {
        await server.listen({port: 3003});
        server.log.info(`Server listening at ${server.server.address()}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1)
    }
};

start();