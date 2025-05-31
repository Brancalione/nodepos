import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('produtos', (table) => {
      table.increments('id').primary();    // campo id auto-incremental (chave primária)
      table.string('category').notNullable();
      table.string('description').notNullable();
      table.string('name').notNullable();
      table.string('picturyUrl').notNullable();
      table.decimal('price', 10, 2).notNullable();
    });
  };
  
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('produtos');
}
   
