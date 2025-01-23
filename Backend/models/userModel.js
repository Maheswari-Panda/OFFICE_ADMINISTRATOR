const sql = require('mssql');
const db = require('../config/db'); // Database connection module

exports.isUserEmailExists = async (userEmail) => {
    const pool = await db.getPool();
    const result = await pool.request()
        .input('Email', sql.NVarChar(100), userEmail)
        .execute('IsUserEmailExists'); // Assuming stored procedure name for checking email exists

    return result.recordset[0].EmailExists === 1;
}

// Function to add a new user
exports.createUser = async (userEmail, userPassword, userERN,userFirstName, userMiddleName, userLastName, userRole,officeId) => {
    const pool = await db.getPool();
    try {
        const result = await pool.request()
            .input('Email', sql.NVarChar(100), userEmail)
            .input('Password', sql.NVarChar(255), userPassword)
            .input('FirstName', sql.NVarChar(20), userFirstName)
            .input('MiddleName', sql.NVarChar(20), userMiddleName)
            .input('LastName', sql.NVarChar(20), userLastName)
            .input('Role',  sql.NVarChar(20), userRole)
            .input('ERN', sql.Char(10), userERN)
            .input('OfficeId', sql.Int(10), officeId)
            .execute('CreateUser'); // Assuming stored procedure is named CreateUser

        // Return the UserId that was created
        return result.recordset[0].UserId;
    } catch (err) {
        console.error('Error in createUser:', err);
        throw new Error('Failed to create user');
    }
};

// Function to get user details by UserId
exports.getUserById = async (userId) => {
    const pool = await db.getPool();

    try {
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .execute('GetUserById'); // Assuming the stored procedure is named GetUserById

        return result.recordset[0]; // Return the user details
    } catch (err) {
        console.error('Error in getUserById:', err);
        throw new Error('Failed to fetch user');
    }
};

// Function to get user details by UserEmail
exports.getUserByEmail = async (userEmail) => {
    const pool = await db.getPool();

    try {
        const result = await pool.request()
            .input('Email', sql.NVarChar(100), userEmail)
            .execute('GetUserByEmail'); // Assuming the stored procedure is named GetUserByEmail

        return result.recordset[0]; // Return the user details
    } catch (err) {
        console.error('Error in getUserByEmail:', err);
        throw new Error('Failed to fetch user');
    }
};

// Function to update user details by UserId
exports.updateUser = async (userId, userEmail,userPassword, userERN, userFirstName, userMiddleName, userLastName, userRole,officeId) => {
    const pool = await db.getPool();

    try {
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .input('Email', sql.NVarChar(100), userEmail)
            .input('Password', sql.NVarChar(255), userPassword)
            .input('FirstName', sql.NVarChar(20), userFirstName)
            .input('MiddleName', sql.NVarChar(20), userMiddleName)
            .input('LastName', sql.NVarChar(20), userLastName)
            .input('Role',  sql.NVarChar(20), userRole)
            .input('ERN', sql.Char(10), userERN)
            .input('OfficeId', sql.Int(10), officeId)
            .execute('UpdateUser'); // Assuming the stored procedure is named UpdateUser

        // Return the status for further use
        return result.recordset[0]?.UPDATE_STATUS;
    } catch (err) {
        console.error('Error executing UpdateUser:', err);
        throw err;
    }
};

// Function to delete a user by UserId
exports.deleteUser = async (userId) => {
    const pool = await db.getPool();

    try {
        await pool.request()
            .input('UserId', sql.Int, userId)
            .execute('DeleteUser'); // Assuming the stored procedure is named DeleteUser

        return 'User deleted successfully';
    } catch (err) {
        console.error('Error in deleteUser:', err);
        throw new Error('Failed to delete user');
    }
};
