const sql = require('mssql');
const db = require('../config/db'); // Import database connection

// Function to add a new status
const addStatus = async (statusName) => {
    try {
        let pool = await db.getPool();
        let result = await pool.request()
            .input('StatusName', sql.VarChar(50), statusName)
            .execute('AddStatus'); // Call stored procedure
        return result.recordset.Status;
    } catch (error) {
        console.error('Error in addStatus:', error);
        throw error;
    }
};

// Function to update an existing status
const updateStatus = async (statusId, statusName) => {
    try {
        let pool = await db.getPool();
        let result = await pool.request()
            .input('StatusId', sql.Int, statusId)
            .input('StatusName', sql.NVarChar, statusName)
            .execute('UpdateStatus'); // Call stored procedure
        return result.recordset;
    } catch (error) {
        console.error('Error in updateStatus:', error);
        throw error;
    }
};

// Function to get status by ID
const getStatusById = async (statusId) => {
    try {
        let pool = await db.getPool();
        let result = await pool.request()
            .input('StatusId', sql.Int, statusId)
            .execute('GetStatusById'); // Call stored procedure
        return result.recordset;
    } catch (error) {
        console.error('Error in getStatusById:', error);
        throw error;
    }
};

// Function to delete a status by ID
const deleteStatus = async (statusId) => {
    try {
        let pool = await db.getPool();
        let result = await pool.request()
            .input('StatusId', sql.Int, statusId)
            .execute('DeleteStatus'); // Call stored procedure
        return result.rowsAffected[0]; // Returns the number of rows affected
    } catch (error) {
        console.error('Error in deleteStatus:', error);
        throw error;
    }
};

// Function to get all statuses
const getAllStatuses = async () => {
    try {
        let pool = await db.getPool();
        let result = await pool.request()
            .execute('GetAllStatuses'); // Call stored procedure
        return result.recordset;
    } catch (error) {
        console.error('Error in getAllStatuses:', error);
        throw error;
    }
};

// Export functions
module.exports = {
    addStatus,
    updateStatus,
    getStatusById,
    deleteStatus,
    getAllStatuses
};