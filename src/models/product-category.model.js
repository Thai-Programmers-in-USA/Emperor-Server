const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../configs/config');

const ProductCategory = sequelize.define('productCategory', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = ProductCategory;
