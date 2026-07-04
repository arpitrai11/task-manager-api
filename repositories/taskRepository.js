const db = require("../config/db");

async function createTask(task) {
  return db.query(
    "INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)",
    [task.user_id, task.title, task.description, task.status]
  );
}

async function getTasks({ userId, status, limit, offset }) {
  let sql = "SELECT * FROM tasks WHERE user_id = ?";
  const params = [userId];

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  return db.query(sql, params);
}

async function countTasks({ userId, status }) {
  let sql = "SELECT COUNT(*) AS total FROM tasks WHERE user_id = ?";
  const params = [userId];

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  return db.query(sql, params);
}

async function updateTask({ id, userId, title, description, status }) {
  return db.query(
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?",
    [title, description, status, id, userId]
  );
}

async function deleteTask({ id, userId }) {
  return db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [id, userId]
  );
}

module.exports = {
  createTask,
  getTasks,
  countTasks,
  updateTask,
  deleteTask
};
