/* eslint-disable @typescript-eslint/no-var-requires */
const { loadEnvConfig } = require('@next/env');

const dev = process.env.NODE_ENV !== 'production';
const {
  MYSQL_PORT,
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_CHARSET,
} = loadEnvConfig('./', dev).combinedEnv;

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      port: MYSQL_PORT,
      database: MYSQL_DB,
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      charset: MYSQL_CHARSET,
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: { directory: './db/seeds' },
  },
};
