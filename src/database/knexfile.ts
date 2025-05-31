import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: 'admin',
      database: 'meu_banco',
    },
    searchPath: ['public'], // <-- MOVIDO PARA CÁ
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: '/seeds',
    },
  },
};

module.exports = config;
