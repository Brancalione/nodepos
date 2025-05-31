import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('processed', (table) => {
      table.integer('id').primary();
      table.string('name').notNullable();
      table.string('pictureUrl').notNullable();
    });
  };
  
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('processed');
}