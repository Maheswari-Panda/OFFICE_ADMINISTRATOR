const sql = require('mssql');
const db = require('../config/db');

// Function to get user details by UserId
exports.getUserLogById = async (userId) => {
    const pool = await db.getPool();

    try {
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .execute('GetUserLogById'); // Assuming the stored procedure is named GetUserById
        return result.recordset; // Return the user details
    } catch (err) {
        console.error('Error in GetUserLogById:', err);
        throw new Error('Failed to fetch user logs');
    }
};

// Function to get user details by UserId
exports.getAllUserLogs = async () => {
    const pool = await db.getPool();

    try {
        const result = await pool.request().execute('GetAllUserLogs'); // Assuming the stored procedure is named GetUserById
        return result.recordset; // Return the user details
    } catch (err) {
        console.error('Error in GetAllUserLogs:', err);
        throw new Error('Failed to fetch all user logs');
    }
};