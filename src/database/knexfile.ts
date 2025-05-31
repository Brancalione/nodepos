const knex = require('kenx');

const db = knex({
    client: 'pg',
    connection: {
        host:'127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'admin',
        database: 'meu_banco',
        serchPath: ['public'],
        ssl: process.env.DB_SSL ? { rejectUnathorized: false } : false
    },
    pool: {
        min: 2,
        mas: 10
    }
});

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: '127.0.0.1',
            user: 'postgres',
            password: 'admin',
            database: 'meu_banco',
        },
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    }
}