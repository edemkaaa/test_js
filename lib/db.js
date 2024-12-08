import { Pool } from 'pg';

const pool = new Pool({
  user: 'edem',
  host: 'localhost',
  database: 'my_events_db',
  password: 'edem',
  port: 5432,
});

export async function initializeDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      date_periods TEXT,
      venue JSON,
      thumbnail VARCHAR(255),
      status VARCHAR(50)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS venues (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES events(id),
      name VARCHAR(255) NOT NULL,
      country VARCHAR(100),
      state VARCHAR(100),
      city VARCHAR(100),
      timezone VARCHAR(100),
      zip_code VARCHAR(20),
      address TEXT
    )
  `);
}

export default pool;