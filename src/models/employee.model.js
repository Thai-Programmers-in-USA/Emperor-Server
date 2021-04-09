const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../configs/config');

const Employee = sequelize.define('employee', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  fName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  authenticationLevel: {
    type: DataTypes.ENUM({ values: ['admin', 'editor', 'user'] }),
    allowNull: false,
  },
});

module.exports = Employee;
