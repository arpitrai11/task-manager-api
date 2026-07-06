const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'tasks',
    timestamps: true,
    underscored: true
  }
);

module.exports = Task;
