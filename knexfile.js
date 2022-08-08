// inclus toutes les configurations pour se connecter à la base de données selon l'environnement
require('dotenv').config()
const path = require('path')

const { CLIENT, DATABASE, PG_USER, PASSWORD, PG_PORT } = process.env

module.exports = {
  development: {
    client: CLIENT,
    connection: {
      database: DATABASE,
      user: PG_USER,
      password: PASSWORD,
      port: PG_PORT
    },
    migrations: {
      directory: path.join(`${__dirname}/db/migrations`),
    },
    seeds: {
      directory: path.join(`${__dirname}/db/seeds`),
    }
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
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

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
