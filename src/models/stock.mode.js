const { STRING, INTEGER } = require('sequelize');
const sequelize = require('../configs/postgres');

const Stock = sequelize.define('stock', {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  value: {
    type: STRING,
    allowNull: false,
  },
  quantity: {
    type: INTEGER,
    allowNull: false,
  },
  photo: {
    type: STRING,
    allowNull: true,
  },
});

module.exports = Stock;
