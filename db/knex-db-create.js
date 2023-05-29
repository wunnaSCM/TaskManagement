/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const { loadEnvConfig } = require('@next/env');
const { exit } = require('process');

const dev = process.env.NODE_ENV !== 'production';
const { MYSQL_DB, MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_CHARSET } =
  loadEnvConfig('./', dev).combinedEnv;

const conn = {
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  charset: MYSQL_CHARSET,
};

const checkExist = async () => {
  try {
    const knex = require('knex')({ client: 'mysql', connection: conn });
    await knex.raw('CREATE DATABASE ' + MYSQL_DB);
    console.info('Database is successfully created');
    exit();
  } catch (error) {
    console.info('Database is already exist');
    exit();
  }
};

checkExist();
