const sql = require('mssql');
const db = require('../config/db'); // Database connection

// Model for creating an office
exports.addOffice = async (officeName, officeLocation, officeContact) => {
    const pool = await db.getPool();
    const result = await pool.request()
        .input('OfficeName', sql.VarChar(50), officeName)
        .input('OfficeLocation', sql.VarChar(100), officeLocation)
        .input('OfficeContact', sql.Char(10), officeContact)
        .execute('AddOffice');  // Assuming this stored procedure exists in the DB
    return result.recordset[0].OfficeId;  // Return the new office ID
};

// Model for getting an office by ID
exports.getOfficeById = async (officeId) => {
    const pool = await db.getPool();
    const result = await pool.request()
        .input('OfficeId', sql.SmallInt, officeId)
        .execute('GetOfficeById');  // Assuming this stored procedure exists in the DB
    return result.recordset[0];  // Return the office details
};

// Model for updating an office
exports.updateOffice = async (officeId, officeName, officeLocation, officeContact) => {
    const pool = await db.getPool();
    await pool.request()
        .input('OfficeId', sql.SmallInt, officeId)
        .input('OfficeName', sql.VarChar(50), officeName)
        .input('OfficeLocation', sql.VarChar(100), officeLocation)
        .input('OfficeContact', sql.Char(10), officeContact)
        .execute('UpdateOffice');  // Assuming this stored procedure exists in the DB
};

// Model for getting all office details
exports.getAllOfficeDetails=async()=>{
    try {
        const pool = await db.getPool();  // Get the pool from the db connection
        const result = await pool.request()
          .execute('GetAllOfficeDetails');  // Execute the stored procedure to fetch all offices
    
        return result.recordset;  // Return the list of offices
      } catch (err) {
        console.error('Error getting office details:', err);
        throw err;  // Re-throw error for handling at a higher level
      }
}

// Model for deleting an office
exports.deleteOffice = async (officeId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
        .input('OfficeId', sql.SmallInt, officeId)
        .execute('DeleteOffice');  // Assuming this stored procedure exists in the DB
        return result.recordset[0];
    } catch (error) {
        console.error('Error deleting office details:', error);
        throw err; 
    }
};
