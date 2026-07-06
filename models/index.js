const { sequelize } = require('../config/database');
const User = require('./User');
const Task = require('./Task');

User.hasMany(Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database sync failed:', error.message);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Task
};
