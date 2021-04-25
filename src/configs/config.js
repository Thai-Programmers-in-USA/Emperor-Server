const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV || 'development';
const Sequelize = require('sequelize');
const config = require('../configs/postgres_config.json')[env];
const constantConfig = require('./constant_config.json')[env];

let sequelize;

if (config.production) {
  sequelize = new Sequelize(
    process.env[config.database],
    process.env[config.username],
    process.env[config.password],
    {
      host: process.env[config.host],
      dialect: process.env[config.dialect],
      dialectOptions: {
        useUTC: false,
      },
      ...(config.testproduction && { logging: false }),
      pool: { maxConnections: 5, maxIdleTime: 30 },
      language: 'en',
      maxConcurrentQueries: 100,
      timezone: '-5:00',
    }
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const {
  AWS_REGION,
  S3_BUCKET_NAME,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
} = process.env;

const S3_CONFIG = {
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
};

const { SECRET_TOKEN, TOKEN_ACTIVE_DURATION } = constantConfig;

module.exports = {
  sequelize,
  SECRET_TOKEN,
  TOKEN_ACTIVE_DURATION,
  S3_CONFIG,
  AWS_REGION,
  S3_BUCKET_NAME,
};
