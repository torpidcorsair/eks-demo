const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MySQL credentials
const dbConfig = {
  host: 'mysql.mysql.svc.cluster.local',
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE, // Read database name from environment variable
  table: process.env.MYSQL_TABLE // Read table name from environment variable
};

let pool; // Declare pool variable outside connect function

// Create MySQL connection
async function connectToMySQL() {
  try {
    // Check if environment variables are correctly set
    if (!dbConfig.user || !dbConfig.password || !dbConfig.database || !dbConfig.table) {
      throw new Error('One or more required environment variables are missing.');
    }

    // Create a connection pool
    pool = await mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('Connected to MySQL database');

    // Ensure the database and table exist
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await pool.query(`USE \`${dbConfig.database}\`;`);
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS \`${dbConfig.table}\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255)
      );
    `);
    console.log(`Table ${dbConfig.table} created or already exists`);
  } catch (err) {
    console.error('Error connecting to MySQL:', err.code, err.message);
    process.exit(1); // Exit the process if there's an error connecting to the database
  }
}

connectToMySQL();

// API endpoint to handle form submission
app.post('/submit', async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    // Use pool.execute for the insert
    await pool.execute(`
      INSERT INTO \`${dbConfig.table}\` (first_name, last_name) VALUES (?, ?)
    `, [firstName, lastName]);

    res.json({ message: 'Data saved to database successfully' });
  } catch (err) {
    console.error('Error inserting data into MySQL:', err.code, err.message);
    res.status(500).json({ message: 'Error saving data to database', details: err.message }); 
  }
});

// API endpoint to get the last 10 entries
app.get('/entries', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM \`${dbConfig.table}\` ORDER BY id DESC LIMIT 10;`);
    res.json(rows); // Send the last 10 entries as a response
  } catch (err) {
    console.error('Error fetching entries from MySQL:', err.code, err.message);
    res.status(500).json({ message: 'Error fetching entries from database', details: err.message }); 
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Backend service is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
