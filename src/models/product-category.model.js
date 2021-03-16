const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/postgres');

const ProductCategory = sequelize.define('productCategory', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = ProductCategory;
