const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host:'127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'admin',
        database: 'meu_banco',
        searchPath: ['public']
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        directory: '/migrations'
    },
    seeds: {
        directory: './seeds'
    }
});