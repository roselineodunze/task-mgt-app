import db from "./db.js";

async function createSchema() {
  try {

    // Signup table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        quote VARCHAR(255) DEFAULT '"Click to edit quote. Make it personal.🙂"',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task TEXT NOT NULL,
        isCompleted BOOLEAN DEFAULT FALSE,
        userId INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Tables "users" and "tasks" are ready.');
  } catch (err) {
    console.error('❌ Error creating schema:', err);
  }
}

export default createSchema;
