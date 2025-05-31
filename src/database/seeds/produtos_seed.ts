import { Knex } from "knex";

const path = require('path');
const fs = require('fs/promises');

import { Produto } from '../../Interface/types';

const readProducts = async () => {
    const produtosCaminho = path.join(__dirname, '../../../products.json');
    const produtosData = await fs.readFile(produtosCaminho, 'utf-8');
    const produtos: Produto[] = JSON.parse(produtosData);

    return produtos
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("produtos").del();

    const produtos = await readProducts()

    // Inserts seed entries
    await knex("produtos").insert(produtos);
};
