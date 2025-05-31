import knex, { Knex } from 'knex';
const config = require ('./knexfile')
import { ProdutoPermitido } from '.././Interface/types';

export async function atualizaProcessed(listaPermitida: ProdutoPermitido[]){
    const db = await knex(config.development)

    //Adiciona tabela
    await db("processed").del();
    await db('processed').insert(listaPermitida)
    await db.destroy()
}

export async function retornaProcessed() {
    const db = await knex(config.development)

    try {
        const produtos = await db('processed').select('*');
        await db.destroy()
        return produtos;
    } catch (error) {
        console.log(error)
        await db.destroy()
        return;
    }
}

export async function retornaProdutos() {
    const db = await knex(config.development)

    try {
        const produtos = await db('produtos').select('*');
        await db.destroy()
        return produtos;
    } catch (error) {
        console.log(error)
        await db.destroy()
        return;
    }
}