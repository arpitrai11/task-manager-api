const { Task } = require('../models');

const createTask = async ({ title, description, completed, userId }) =>
  Task.create({ title, description, completed, userId });

const getTasksByUser = async (userId) =>
  Task.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });

const updateTask = async (id, userId, updates) => {
  const task = await Task.findOne({ where: { id, userId } });
  if (!task) return null;
  return task.update(updates);
};

const deleteTask = async (id, userId) => {
  const task = await Task.findOne({ where: { id, userId } });
  if (!task) return null;
  await task.destroy();
  return true;
};

module.exports = {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask
};
