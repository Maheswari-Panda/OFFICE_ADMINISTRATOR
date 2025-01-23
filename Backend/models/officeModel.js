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

// Model for deleting an office
exports.deleteOffice = async (officeId) => {
    const pool = await db.getPool();
    await pool.request()
        .input('OfficeId', sql.Int, officeId)
        .execute('DeleteOffice');  // Assuming this stored procedure exists in the DB
};
