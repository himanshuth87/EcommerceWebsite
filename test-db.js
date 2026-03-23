require('dotenv').config();
const { Pool } = require('pg');

async function testConnection(url, name) {
  try {
    const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
    await pool.query('SELECT 1');
    console.log('✅ SUCCESS: ' + name);
    await pool.end();
  } catch (err) {
    console.log('❌ FAILED: ' + name + ' | ' + err.message);
  }
}

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
  }
  console.log("Testing .env connection...");
  await testConnection(url, 'Current .env configuration');
}
run();
