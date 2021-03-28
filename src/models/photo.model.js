const { BOOLEAN, STRING, INTEGER } = require('sequelize');
const { sequelize } = require('../configs/config');

const Photo = sequelize.define('photo', {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  isMainPhoto: {
    type: BOOLEAN,
    allowNull: false,
  },
  path: {
    type: STRING,
    allowNull: false,
  },
  position: {
    type: INTEGER,
    allowNull: false,
  },
});

module.exports = Photo;
