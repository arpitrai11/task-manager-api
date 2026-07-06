const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'task_manager',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true,
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
};

module.exports = { sequelize, testConnection };
