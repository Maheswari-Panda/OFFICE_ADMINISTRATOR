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
exports.updateDocument = async (documentId,IsInward,
    DocumentName,
    DocumentTypeId,
    LetterSerialNumber,
    InwardOutwardReferenceDocumentId,
    EndUserId,
    DocumentDescription,
    DocumentPath,
    SenderId,
    ReceiverId,
    BillingInfo,
    OfficeId
    ) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('DocumentId', sql.Int, documentId)
            .input('IsInward', sql.Bit, IsInward)
            .input('DocumentName',sql.VarChar(50),DocumentName)
            .input('DocumentTypeId', sql.Int, DocumentTypeId)
            .input('LetterSerialNumber', sql.NVarChar(255), LetterSerialNumber)
            .input('InwardOutwardReferenceDocumentId', sql.Int, InwardOutwardReferenceDocumentId)
            .input('EndUserId', sql.Int, EndUserId)
            .input('DocumentDescription', sql.NVarChar(sql.MAX), DocumentDescription)
            .input('DocumentPath', sql.NVarChar(255), DocumentPath)
            .input('SenderId', sql.Int, SenderId)
            .input('ReceiverId', sql.Int, ReceiverId)
            .input('BillingInfo', sql.NVarChar(sql.MAX), BillingInfo)
            .input('OfficeId', sql.SmallInt,OfficeId)
            .execute('UpdateDocument');
        console.log(result);
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

exports.approveDocument = async(userId,documentId,action) =>{
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .input('DocumentId', sql.Int, documentId)
            .input('ActionPerformed', sql.NVarChar(sql.MAX), action)
            .execute('ApproveDocument');

        return result.recordset; // Return documents of a specific type
    } catch (err) {
        console.error('Error Approving documents by document id:', err);
        throw err;
    }
}

exports.returnDocument = async(userId,documentId,action) =>{
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .input('DocumentId', sql.Int, documentId)
            .input('ActionPerformed', sql.NVarChar(sql.MAX), action)
            .execute('ReturnDocument');

        return result.recordset; // Return documents of a specific type
    } catch (err) {
        console.error('Error Returning documents by document id:', err);
        throw err;
    }
}


exports.dispatchDocument = async(userId,documentId,action) =>{
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .input('DocumentId', sql.Int, documentId)
            .input('ActionPerformed', sql.NVarChar(sql.MAX), action)
            .execute('DispatchDocument');

        return result.recordset; // Return documents of a specific type
    } catch (err) {
        console.error('Error Dispatching documents by document id:', err);
        throw err;
    }
}


exports.getAllDocumentsReceivedOrDispatched = async ()=>{
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .execute('GetAllDocumentsReceivedOrDispatched');

        return result.recordset; // Return all documents
    } catch (err) {
        console.error('Error fetching all documents recived or returned :', err);
        throw err;
    }
}

exports.getAllDocumentsReceivedOrDispatchedByOfficeId = async (officeId)=>{
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('OfficeId', sql.SmallInt, officeId)
            .execute('GetAllDocumentsReceivedOrDispatchedByOfficeId');

        return result.recordset; // Return all documents
    } catch (err) {
        console.error('Error fetching all documents recived or returned by office id :', err);
        throw err;
    }
}

exports.getPendingDocumentsForUserByUserId = async (userId)=>{
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .execute('GetPendingDocumentsForUserByUserId');

        return result.recordset; // Return all documents
    } catch (err) {
        console.error('Error fetching all pending documents for logged in user :', err);
        throw err;
    }
}

exports.getApprovedDocumentsForUserByUserId = async (userId)=>{
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .execute('GetApprovedDocumentsForUserByUserId');

        return result.recordset; // Return all documents
    } catch (err) {
        console.error('Error fetching all approved documents for logged in user :', err);
        throw err;
    }
}

exports.getReturnedDocumentsForUserByUserId = async (userId)=>{
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .execute('GetReturnedDocumentsForUserByUserId');

        return result.recordset; // Return all documents
    } catch (err) {
        console.error('Error fetching all returned documents for logged in user :', err);
        throw err;
    }
}

exports.getDocumentsByStatusName = async (officeId,StatusName)=>{
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('OfficeId', sql.SmallInt, officeId)
            .input('StatusName', sql.NVarChar(255), StatusName)
            .execute('GetDocumentsByStatusName');

        return result.recordset; // Return all documents
    } catch (err) {
        console.error('Error fetching all documents for given officeid and status name :', err);
        throw err;
    }
}

// Model for getting all documents
exports.getCompleteDocumentReport = async (startDate,endDate) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('StartDate',sql.Date,startDate)
            .input('EndDate',sql.Date,endDate)
            .execute('GetCompleteDocumentReport');

        return result.recordset; // Return all documents
    } catch (err) {
        console.error('Error fetching all documents:', err);
        throw err;
    }
};