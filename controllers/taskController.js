const taskRepository = require('../repositories/taskRepository');

const createTask = async (req, res, next) => {
  try {
    const { title, description, completed = false } = req.body;

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await taskRepository.createTask({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: Boolean(completed),
      userId: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskRepository.getTasksByUser(req.user.id);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updates = {};
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ message: 'Task title cannot be empty' });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) updates.description = description.trim();
    if (completed !== undefined) updates.completed = Boolean(completed);

    const task = await taskRepository.updateTask(Number(id), req.user.id, updates);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await taskRepository.deleteTask(Number(id), req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };