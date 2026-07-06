const fs = require('fs/promises');
const path = require('path');

// File where all task data is persisted as JSON.
const DATA_FILE_PATH = path.join(__dirname, '..', 'data', 'tasks.json');

// Ensure the data file exists before reading or writing to it.
const ensureDataFile = async () => {
  try {
    await fs.access(DATA_FILE_PATH);
  } catch (error) {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, '[]', 'utf8');
  }
};

const readTasks = async () => {
  await ensureDataFile();
  const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf8');
  return JSON.parse(fileContent);
};

const writeTasks = async (tasks) => {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(tasks, null, 2), 'utf8');
};

module.exports = {
  readTasks,
  writeTasks
};
