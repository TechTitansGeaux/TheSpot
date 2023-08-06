const { Sequelize, DataTypes } = require('sequelize');
// import { Table, Column, Model, HasMany } from 'sequelize-typescript';

// Create sequelize connection to mysql database
const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'mysql',
  username: 'root',
  password: '',
  database: 'theSpot'
});

const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  displayName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  geolocation: {
    type: DataTypes.STRING(100)
  },
  mapIcon: DataTypes.STRING(100),
  birthday: DataTypes.DATE,
  privacy: DataTypes.STRING(100),
  accessibility: DataTypes.STRING(100)
})

module.exports = {
  db: sequelize,
  Users,
};