import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'defaultsecret',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
    REFRESH_TOKEN_EXPIRATION_DAYS: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS || '30', 10),
};

export default envConfig;