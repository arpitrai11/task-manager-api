const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;

module.exports = router;