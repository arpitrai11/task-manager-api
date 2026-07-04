const db = require("../config/db");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const allowedStatuses = ["pending", "in-progress", "completed"];
    const taskStatus = status || "pending";

    if (!allowedStatuses.includes(taskStatus)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: pending, in-progress, completed"
      });
    }

    await db.query(
      "INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)",
      [req.user.id, title, description || "", taskStatus]
    );

    return res.status(201).json({
      message: "Task created successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const { status } = req.query;

    const allowedStatuses = ["pending", "in-progress", "completed"];

    let sql = "SELECT * FROM tasks WHERE user_id = ?";
    let countSql = "SELECT COUNT(*) AS total FROM tasks WHERE user_id = ?";
    const params = [req.user.id];
    const countParams = [req.user.id];

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Allowed values: pending, in-progress, completed"
        });
      }

      sql += " AND status = ?";
      countSql += " AND status = ?";
      params.push(status);
      countParams.push(status);
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [tasks] = await db.query(sql, params);
    const [countResult] = await db.query(countSql, countParams);

    return res.status(200).json({
      page,
      limit,
      total: countResult[0].total,
      tasks
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
      return res.status(400).json({
        message: "Title, description and status are required"
      });
    }

    const allowedStatuses = ["pending", "in-progress", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: pending, in-progress, completed"
      });
    }

    const [result] = await db.query(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?",
      [title, description, status, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    return res.status(200).json({
      message: "Task updated successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};