// db.js
import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Roseline@04',
  database: 'vanilla_todolist', 
});

const db = pool.promise();

export default db;
