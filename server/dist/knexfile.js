import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Always load .env from the project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const config = {
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
            directory: 'migrations',
            tableName: 'migrations_history',
        },
        seeds: {
            extension: 'ts',
            directory: 'seeds',
        },
    },
};
export default config;
//# sourceMappingURL=knexfile.js.map