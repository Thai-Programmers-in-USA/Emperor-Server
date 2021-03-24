const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];

console.log(config);

console.log(process.env);

const sequelize = new Sequelize(
  process.env.DB_SCHEMA || config.schama,
  process.env.DB_USER || config.username,
  process.env.DB_PASSWORD || config.password,
  {
    host: process.env.DB_HOST || config.host,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || config.dialect,
    config
  }
);

module.exports = sequelize;
