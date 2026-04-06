const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper for generic queries - converts MySQL ? placeholders to PostgreSQL $1, $2...
const query = async (sql, params = []) => {
    try {
        // Convert MySQL-style ? placeholders to PostgreSQL $1, $2, etc.
        let pgSql = sql;
        let i = 1;
        pgSql = pgSql.replace(/\?/g, () => `$${i++}`);

        const result = await pool.query(pgSql, params);
        return result.rows;
    } catch (error) {
        console.error('Database Query Error:', error.message);
        throw error;
    }
};

module.exports = { pool, query };
