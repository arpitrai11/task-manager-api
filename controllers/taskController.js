const db = require('../config/db');
const { validationResult } = require('express-validator');

// POST /api/tasks
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [userId, title, description || '', 'pending']
    );

    res.status(201).json({
      message: 'Task created successfully',
      task: { id: result.insertId, title, description, status: 'pending' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/tasks
const getTasks = async (req, res) => {
  const userId = req.user.id;

  // Bonus: pagination + filter
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status;

  try {
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    let params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [tasks] = await db.query(query, params);

    // Get total count for pagination info
    let countQuery = 'SELECT COUNT(*) as total FROM tasks WHERE user_id = ?';
    let countParams = [userId];
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    const [[{ total }]] = await db.query(countQuery, countParams);

    res.status(200).json({
      tasks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, status } = req.body;

  try {
    // Check task exists and belongs to user
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await db.query(
      'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
      [
        title || tasks[0].title,
        description || tasks[0].description,
        status || tasks[0].status,
        id,
        userId
      ]
    );

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };