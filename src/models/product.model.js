const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../configs/config');

const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  rating: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  isOnSale: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  salePercentage: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isNewArrival: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

module.exports = Product;
