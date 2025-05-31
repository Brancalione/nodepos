import { Knex } from 'knex'
import { Produto } from '../src/Interface/types';
const path = require('path');
const fs = require('fs/promises');

export async function seed(knex:Knex): Promise<void> {
    await knex('produtos').del();

    const produtosCaminho = path.join(__dirname, '../products.json');
    const produtosData = await fs.readFile(produtosCaminho, 'utf-8');
    const produtos: Produto[] = JSON.parse(produtosData);

    await knex('produtos').insert(
        produtos
    )
    
}