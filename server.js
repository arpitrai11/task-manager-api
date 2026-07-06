require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.type('html').send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Task Manager API</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.6; }
          a { color: #2563eb; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1>Task Manager API</h1>
        <p>This backend uses MySQL and Sequelize with JWT-authenticated task management.</p>
      </body>
    </html>`);
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  await testConnection();
  await syncDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();