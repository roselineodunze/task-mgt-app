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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS todolist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task TEXT NOT NULL,
        isCompleted BOOLEAN DEFAULT FALSE
      );
    `);

    console.log('✅ Tables "users" and "todolist" are ready.');
  } catch (err) {
    console.error('❌ Error creating schema:', err);
  }
}

export default createSchema;
