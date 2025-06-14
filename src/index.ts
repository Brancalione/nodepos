import { writeFile } from 'fs/promises';
import path from 'path';
import { CategoryAllowed } from './Services/categoryService';
import { Produto, ProdutoPermitido } from './Interface/types';
import { start } from './Server';
import * as databaseService from './database/databaseService';
import 'dotenv/config';

async function validarCategoriasProds() {
  // Busca produtos do banco
  const produtos = await databaseService.retornaProdutos();
  const listaPermitida: ProdutoPermitido[] = [];

  if (!produtos) {
    console.error('❌ Nenhum produto retornado do banco.');
    return;
  }

  // Valida categorias e monta lista
  await Promise.all(
    (produtos as Produto[]).map(async (produto) => {
      const permitido = await CategoryAllowed(produto.category);
      if (permitido) {
        listaPermitida.push({
          id: produto.id,
          name: produto.name,
          pictureUrl: produto.pictureUrl,
        });
      }
    })
  );

  // Atualiza tabela "processed" no banco
  await databaseService.atualizaProcessed(listaPermitida);

//   // Escreve arquivo local opcionalmente
//   const caminhoArquivo = path.resolve(__dirname, '..', 'processed.json');
//   const jsonString = JSON.stringify(listaPermitida, null, 2);
//   await writeFile(caminhoArquivo, jsonString, 'utf-8');

  // Confirma dados inseridos
  const processed = await databaseService.retornaProcessed();
  console.log('✅ Produtos processados:', processed);
}

async function main() {
  await validarCategoriasProds();
  start(); // Inicia o servidor Fastify
}

main();
