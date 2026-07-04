const allowedStatuses = ["pending", "in-progress", "completed"];

function createTaskPayload({ userId, title, description = "", status = "pending" }) {
  return {
    user_id: userId,
    title,
    description,
    status
  };
}

function formatTaskRow(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    description: row.description,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

module.exports = {
  allowedStatuses,
  createTaskPayload,
  formatTaskRow
};
