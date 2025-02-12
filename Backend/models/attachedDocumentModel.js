const sql = require('mssql');
const db = require('../config/db'); // Import database connection

// Function to add an attached document
exports.addAttachedDocument = async (documentId, attachedDocumentPath) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('DocumentId', sql.Int, documentId)
            .input('AttachedDocumentPath', sql.NVarChar(sql.MAX), attachedDocumentPath)
            .execute('AddAttachedDocument');

        return result.recordset[0].Status;
    } catch (err) {
        console.error('Error adding attached document in database:', err);
        throw err;
    }
};

// Function to get all attached documents for a specific document
exports.getAttachedDocumentsByDocumentId = async (documentId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('DocumentId', sql.Int, documentId)
            .execute('GetAttachedDocumentById');

        return result.recordset;
    } catch (err) {
        console.error('Error fetching attached documents:', err);
        throw err;
    }
};

// Function to delete an attached document
exports.updateAttachedDocument = async (documentId,attachedDocumentPath) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request() 
            .input('DocumentId', sql.Int, documentId)   
            .input('AttachedDocumentPath', sql.NVarChar(sql.MAX), attachedDocumentPath)
            .execute('UpdateAttachedDocument');

        return result.recordset[0];
    } catch (err) {
        console.error('Error deleting attached document:', err);
        throw err;
    }
};

// Function to delete an attached document
exports.deleteAttachedDocument = async (attachedDocumentId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('AttachedDocumentId', sql.Int, attachedDocumentId)
            .execute('DeleteAttachedDocument');

        return result.recordset[0];
    } catch (err) {
        console.error('Error deleting attached document:', err);
        throw err;
    }
};