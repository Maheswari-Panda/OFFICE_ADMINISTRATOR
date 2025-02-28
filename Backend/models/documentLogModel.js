const sql = require('mssql');
const db = require('../config/db');

// Function to add a document log
exports.addDocumentLog = async (userId, documentId, action) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .input('DocumentId', sql.Int, documentId)
            .input('ActionPerformed', sql.NVarChar, action)
            .execute('AddDocumentLog');

        return result.recordset[0]; // Returns { DocumentLogId, StatusMessage }
    } catch (err) {
        console.error('Error adding document log:', err);
        return { DocumentLogId: null, StatusMessage: 'Failed to add document log' };
    }
};

// Function to get document logs by DocumentId
exports.getDocumentLogByDocumentId = async (documentId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('DocumentId', sql.Int, documentId)
            .execute('GetDocumentLogByDocumentId');

        return result.recordset; // Returns an array of logs
    } catch (err) {
        console.error('Error fetching document logs by DocumentId:', err);
        throw new Error('Failed to fetch document logs');
    }
};

// Function to get document logs by UserId
exports.getDocumentLogByUserId = async (userId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .execute('GetDocumentLogByUserId');

        return result.recordset; // Returns an array of logs
    } catch (err) {
        console.error('Error fetching document logs by UserId:', err);
        throw new Error('Failed to fetch document logs');
    }
};

// Function to get all document logs
exports.getAllDocumentLogs = async () => {
    try {
        const pool = await db.getPool();
        const result = await pool.request().execute('GetAllDocumentLogs');

        return result.recordset; // Returns an array of logs
    } catch (err) {
        console.error('Error fetching all document logs:', err);
        throw new Error('Failed to fetch all document logs');
    }
};

exports.getDocumentLogsByOfficeId = async (officeId)=>{
    try {
        const pool = await db.getPool();
        const result = await pool.request().input('OfficeId', sql.SmallInt, officeId).execute('GetDocumentLogsByOfficeId');

        return result.recordset; // Returns an array of logs
    } catch (err) {
        console.error('Error fetching all document logs of this office:', err);
        throw new Error('Failed to fetch all document logs of this office');
    }
}
