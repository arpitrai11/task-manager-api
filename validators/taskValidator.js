const { allowedStatuses } = require("../models/taskModel");

function validateTaskInput({ title, description, status }, requireAll = false) {
  if (requireAll) {
    if (!title || !description || !status) {
      return {
        valid: false,
        message: "Title, description and status are required"
      };
    }
  }

  if (title !== undefined && typeof title !== "string") {
    return {
      valid: false,
      message: "Title must be a string"
    };
  }

  if (description !== undefined && typeof description !== "string") {
    return {
      valid: false,
      message: "Description must be a string"
    };
  }

  if (status !== undefined && !allowedStatuses.includes(status)) {
    return {
      valid: false,
      message: "Invalid status. Allowed values: pending, in-progress, completed"
    };
  }

  return { valid: true };
}

function validatePagination({ page, limit }) {
  const pageInt = parseInt(page, 10) || 1;
  const limitInt = parseInt(limit, 10) || 5;

  return {
    page: pageInt,
    limit: limitInt,
    offset: (pageInt - 1) * limitInt
  };
}

module.exports = {
  validateTaskInput,
  validatePagination
};
