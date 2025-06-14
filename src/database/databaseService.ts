import knex, { Knex } from 'knex';
const config = require ('./knexfile')
import { ProdutoPermitido } from '.././Interface/types';

// Instância única de conexão
const db = knex(config.development);

export async function atualizaProcessed(listaPermitida: ProdutoPermitido[]) {
  try {
    await db('processed').del();
    await db('processed').insert(listaPermitida);
  } catch (error) {
    console.error('Erro ao atualizar processed:', error);
  }
}

export async function retornaProcessed() {
  try {
    return await db('processed').select('*');
  } catch (error) {
    console.error('Erro ao buscar processed:', error);
    return [];
  }
}

export async function retornaProdutos() {
  try {
    return await db('produtos').select('*');
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

export async function insereProduto(produto: ProdutoPermitido) {
    const db = knex(config.development);
    await db('processed').insert(produto);
    await db.destroy();
  }
  
export async function buscaProdutoPorId(id: string) {
    const db = knex(config.development);
    const produto = await db('processed').where({ id }).first();
    await db.destroy();
    return produto;
}

export async function atualizaProduto(produto: ProdutoPermitido) {
    const db = knex(config.development);
    await db('processed').where({ id: produto.id }).update({
        name: produto.name,
        pictureUrl: produto.pictureUrl,
    });
    await db.destroy();
}

export async function removeProdutoPorId(id: string) {
    const db = knex(config.development);
    await db('processed').where({ id }).del();
    await db.destroy();
}

// Encerramento opcional para scripts isolados ou testes
export async function closeDB() {
  await db.destroy();
}
