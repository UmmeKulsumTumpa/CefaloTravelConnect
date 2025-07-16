import 'dotenv/config';

const appConfig = {
    port: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV as string,

    // jwt configs
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
    REFRESH_TOKEN_EXPIRATION_DAYS: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS || '30', 10),

};

export default appConfig;