const assert = require("assert");
const taskService = require("../services/taskService");

function runSimpleSuite() {
  console.log("Running Task Service scaffold tests...");

  assert.strictEqual(typeof taskService.createTask, "function", "createTask should be a function");
  assert.strictEqual(typeof taskService.getTasks, "function", "getTasks should be a function");
  assert.strictEqual(typeof taskService.updateTask, "function", "updateTask should be a function");
  assert.strictEqual(typeof taskService.deleteTask, "function", "deleteTask should be a function");

  console.log("✔ Task Service exported functions are present");
  console.log("Note: Add integration tests after wiring the service to the controller and database.");
}

runSimpleSuite();
