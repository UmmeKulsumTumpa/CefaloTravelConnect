import knex from 'knex';
import config from './knexfile.js';
import envConfig from './app/config/env.config.js';
const environment = envConfig.NODE_ENV;
const knexConfig = config[environment];
const db = knex(knexConfig);
export default db;
//# sourceMappingURL=db.js.map