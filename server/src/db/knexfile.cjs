const path = require('path');
const dotenv = require('dotenv');
const { fileURLToPath } = require('url');

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      insecureAuth: true,
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      extension: 'ts',
      directory: path.resolve(__dirname, 'migrations'),
      tableName: 'migrations_history',
    },
    seeds: {
      extension: 'ts',
      directory: path.resolve(__dirname, 'seeds'),
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      extension: 'ts',
      directory: path.resolve(__dirname, 'migrations'),
      tableName: 'migrations_history',
    },
    seeds: {
      extension: 'ts',
      directory: path.resolve(__dirname, 'seeds'),
    },
  },
};
