const sql = require('mssql');
const db = require('../config/db');  // Make sure to import your database connection

// Model for adding a document type
exports.addDocumentType = async (documentTypeName) => {
  try {
    const pool = await db.getPool();  // Get the pool from the db connection
    const result = await pool.request()
      .input('DocumentTypeName', sql.VarChar(50), documentTypeName)  // Pass the document type name as input parameter
      .execute('AddDocumentType');  // Execute the AddDocumentType stored procedure

    // Return the result message from the stored procedure
    return result.recordset[0].Message;
  } catch (err) {
    console.error('Error adding document type:', err);
    throw err;  // Re-throw error for handling at a higher level
  }
};

// Model for updating a document type
exports.updateDocumentType = async (documentTypeId, documentTypeName) => {
    try {
      const pool = await db.getPool();  // Get the pool from the db connection
      const result = await pool.request()
        .input('DocumentTypeId', sql.Int, documentTypeId)  // Pass the document type ID as input parameter
        .input('DocumentTypeName', sql.VarChar(50), documentTypeName)  // Pass the document type name as input parameter
        .execute('UpdateDocumentType');  // Execute the UpdateDocumentType stored procedure
  
      // Return the result message from the stored procedure
      return result.recordset[0].Message;
    } catch (err) {
      console.error('Error updating document type:', err);
      throw err;  // Re-throw error for handling at a higher level
    }
  };

  // Model for deleting a document type
exports.deleteDocumentType = async (documentTypeId) => {
    try {
      const pool = await db.getPool();  // Get the pool from the db connection
      const result = await pool.request()
        .input('DocumentTypeId', sql.Int, documentTypeId)  // Pass the document type ID as input parameter
        .execute('DeleteDocumentType');  // Execute the DeleteDocumentType stored procedure
  
      // Return the result message from the stored procedure
      return result.recordset[0].Message;
    } catch (err) {
      console.error('Error deleting document type:', err);
      throw err;  // Re-throw error for handling at a higher level
    }
  };
  
  // Model for getting all document types
exports.getAllDocumentTypes = async () => {
    try {
      const pool = await db.getPool();  // Get the pool from the db connection
      const result = await pool.request()
        .execute('GetAllDocumentTypes');  // Execute the GetAllDocumentTypes stored procedure
  
      // Return the list of document types
      return result.recordset;
    } catch (err) {
      console.error('Error fetching document types:', err);
      throw err;  // Re-throw error for handling at a higher level
    }
  };

  // Model for getting document type by ID
exports.getDocumentTypeById = async (documentTypeId) => {
    try {
      const pool = await db.getPool();  // Get the pool from the db connection
      const result = await pool.request()
        .input('DocumentTypeId', sql.Int, documentTypeId)  // Pass the document type ID as input parameter
        .execute('GetDocumentTypeById');  // Execute the GetDocumentTypeById stored procedure
  
      // Return the document type details
      return result.recordset[0];  // Assuming there is only one record for the given ID
    } catch (err) {
      console.error('Error fetching document type by ID:', err);
      throw err;  // Re-throw error for handling at a higher level
    }
  };
  
  