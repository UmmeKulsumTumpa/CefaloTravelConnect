import { Knex, knex } from 'knex';
import config from './knexfile.js'; 

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];
const db: Knex = knex(knexConfig);

export default db;
