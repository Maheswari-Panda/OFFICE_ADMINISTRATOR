const sql = require('mssql');
const db = require('../config/db'); // Make sure to import your database connection

// Model for adding a document
exports.addDocument = async (documentData) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('IsInward', sql.Bit, documentData.IsInward)
            .input('DocumentName',sql.VarChar(50),documentData.DocumentName)
            .input('DocumentTypeId', sql.Int, documentData.DocumentTypeId)
            .input('LetterSerialNumber', sql.NVarChar(255), (documentData.LetterSerialNumber===""?null:documentData.LetterSerialNumber))
            .input('InwardOutwardReferenceDocumentId', sql.Int, documentData.InwardOutwardReferenceDocumentId)
            .input('EndUserId', sql.Int, documentData.EndUserId)
            .input('DocumentDescription', sql.NVarChar(sql.MAX), documentData.DocumentDescription)
            .input('DocumentPath', sql.NVarChar(255), documentData.DocumentPath)
            .input('SenderId', sql.Int, documentData.SenderId)
            .input('ReceiverId', sql.Int, documentData.ReceiverId)
            .input('BillingInfo', sql.NVarChar(sql.MAX), documentData.BillingInfo)
            .input('OfficeId', sql.SmallInt, 1)
            .execute('AddDocument');

        return result.recordset[0].NewDocumentId;
    } catch (err) {
        console.error('Error adding document:', err);
        throw err;
    }
};

// Model for updating a document
exports.updateDocument = async (documentId,documentData) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('DocumentId', sql.Int, documentId)
            .input('IsInward', sql.Bit, documentData.IsInward)
            .input('DocumentName',sql.VarChar(50),documentData.DocumentName)
            .input('DispatchedDateTime', sql.DateTime, documentData.DispatchedDateTime)
            .input('DocumentTypeId', sql.Int, documentData.DocumentTypeId)
            .input('LetterSerialNumber', sql.NVarChar(255), documentData.LetterSerialNumber)
            .input('InwardOutwardReferenceDocumentId', sql.Int, documentData.InwardOutwardReferenceDocumentId)
            .input('EndUserId', sql.Int, documentData.EndUserId)
            .input('DocumentDescription', sql.NVarChar(sql.MAX), documentData.DocumentDescription)
            .input('DocumentPath', sql.NVarChar(255), documentData.DocumentPath)
            .input('SenderId', sql.Int, documentData.SenderId)
            .input('ReceiverId', sql.Int, documentData.ReceiverId)
            .input('BillingInfo', sql.NVarChar(sql.MAX), documentData.BillingInfo)
            .input('StatusId', sql.Int, documentData.StatusId)
            .input('OfficeId', sql.SmallInt, documentData.OfficeId)
            .execute('UpdateDocument');

        return result.recordset[0].Message;
    } catch (err) {
        console.error('Error updating document:', err);
        throw err;
    }
};

// Model for deleting a document
exports.deleteDocument = async (documentId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('DocumentId', sql.Int, documentId)
            .execute('DeleteDocument');

        return result.recordset[0].Message;
    } catch (err) {
        console.error('Error deleting document:', err);
        throw err;
    }
};

// Model for getting a document by ID
exports.getDocumentById = async (documentId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('DocumentId', sql.Int, documentId)
            .execute('GetDocumentById');

        return result.recordset[0]; // Assuming only one record is returned
    } catch (err) {
        console.error('Error fetching document by ID:', err);
        throw err;
    }
};

// Model for getting all documents
exports.getAllDocuments = async () => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .execute('GetCompleteDocumentDetails');

        return result.recordset; // Return all documents
    } catch (err) {
        console.error('Error fetching all documents:', err);
        throw err;
    }
};

// Model for getting documents by type
exports.getDocumentsByType = async (documentTypeId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('DocumentTypeId', sql.Int, documentTypeId)
            .execute('GetDocumentsByType');

        return result.recordset; // Return documents of a specific type
    } catch (err) {
        console.error('Error fetching documents by type:', err);
        throw err;
    }
};
