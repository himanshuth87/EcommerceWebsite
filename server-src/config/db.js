const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Converts MySQL ? placeholders to PostgreSQL $1, $2...
async function query(sql, params = []) {
    let pgSql = sql;
    let i = 1;
    pgSql = pgSql.replace(/\?/g, () => `$${i++}`);
    const result = await pool.query(pgSql, params);
    return result.rows;
}

module.exports = { query, pool };
