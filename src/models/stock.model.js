const { STRING, INTEGER, DOUBLE } = require('sequelize');
const { sequelize } = require('../configs/config');

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
  price: {
    type: DOUBLE,
    allowNull: false,
  },
  quantity: {
    type: INTEGER,
    allowNull: false,
  },
  photo: {
    type: STRING,
    allowNull: false,
  },
});

module.exports = Stock;
