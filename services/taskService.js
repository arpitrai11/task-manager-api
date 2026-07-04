const taskRepository = require("../repositories/taskRepository");
const { validateTaskInput, validatePagination } = require("../validators/taskValidator");

async function createTask({ userId, title, description, status }) {
  const validation = validateTaskInput({ title, description, status });
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  return taskRepository.createTask({
    userId,
    title,
    description: description || "",
    status: status || "pending"
  });
}

async function getTasks({ userId, page, limit, status }) {
  const pagination = validatePagination({ page, limit });
  const [rows] = await taskRepository.getTasks({
    userId,
    status,
    limit: pagination.limit,
    offset: pagination.offset
  });
  const [countRows] = await taskRepository.countTasks({ userId, status });

  return {
    page: pagination.page,
    limit: pagination.limit,
    total: countRows[0].total,
    tasks: rows
  };
}

async function updateTask({ id, userId, title, description, status }) {
  const validation = validateTaskInput({ title, description, status }, true);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  return taskRepository.updateTask({ id, userId, title, description, status });
}

async function deleteTask({ id, userId }) {
  return taskRepository.deleteTask({ id, userId });
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
