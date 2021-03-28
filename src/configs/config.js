const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const postgresConfig = require('./postgres_config.json')[env];
const constantConfig = require('./constant_config.json')[env];
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_SCHEMA || postgresConfig.schama,
  process.env.DB_USER || postgresConfig.username,
  process.env.DB_PASSWORD || postgresConfig.password,
  {
    host: process.env.DB_HOST || postgresConfig.host,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || postgresConfig.dialect,
    ...{ logging: false && env !== 'development' && env !== 'production' },
  }
);

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
