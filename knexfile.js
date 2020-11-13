module.exports = {
    development: {
        client: 'mysql',
        connection: {
            database: 'people',
            user: 'root',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
};
