# Task Manager API

REST API for user and task management with JWT authentication.

## Tech Stack
- Node.js + Express.js
- MySQL with raw SQL queries (mysql2)
- JWT Authentication (jsonwebtoken + bcryptjs)
- Google Sign-In

## Setup & Installation

### 1. Clone the repository
git clone <your-repo-url>
cd task-manager-api

### 2. Install dependencies
npm install

### 3. Configure environment variables
cp .env.example .env
# Open .env and fill in your MySQL credentials and a JWT secret

### 4. Create the database
Option 1: Use the helper script (PowerShell)
```powershell
cd .\scripts
.\setup-db.ps1 -DbHost localhost -DbUser root -DbPassword "yourPassword"
```

Option 2: Run SQL directly in MySQL:

CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

### 5. Start the server
npm run dev

## Environment Variables
| Variable     | Description                |
|--------------|----------------------------|
| PORT         | Server port (default 5000) |
| DB_HOST      | MySQL host                 |
| DB_USER      | MySQL username             |
| DB_PASSWORD  | MySQL password             |
| DB_NAME      | Database name              |
| JWT_SECRET   | Secret key for JWT signing |
| GOOGLE_CLIENT_ID | Google OAuth client ID for social login |

## API Endpoints

### Auth (Public)
POST /api/auth/register   — Register new user
POST /api/auth/login      — Login, returns JWT token

### Tasks (JWT Protected — send token in Authorization header)
POST   /api/tasks         — Create task
GET    /api/tasks         — Get all tasks (?page=1&limit=5&status=pending)
PUT    /api/tasks/:id     — Update task
DELETE /api/tasks/:id     — Delete task