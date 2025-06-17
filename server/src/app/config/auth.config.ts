import envConfig from './env.config.js';

const authConfig = {
  JWT_SECRET: envConfig.JWT_SECRET,
  JWT_EXPIRATION: envConfig.JWT_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION_DAYS: envConfig.REFRESH_TOKEN_EXPIRATION_DAYS,
};

export default authConfig;