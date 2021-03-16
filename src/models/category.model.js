const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/postgres');

const Category = sequelize.define('category', {
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
});

module.exports = Category;
