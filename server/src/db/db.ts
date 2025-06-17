// Centralized Knex instance for runtime usage
import knex, { Knex } from 'knex';
import config from './knexfile.cjs';
import envConfig from '../app/config/env.config.js';

const environment = envConfig.NODE_ENV;
const typedConfig: Record<string, Knex.Config> = config as Record<string, Knex.Config>;
const knexConfig = typedConfig[environment];
const db: Knex = knex(knexConfig);

export default db;
