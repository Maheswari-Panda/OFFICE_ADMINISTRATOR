const sql = require('mssql');
const db = require('../config/db'); // Database connection module
require('dotenv').config({ path: '../Backend/.env.local' });
var jwt = require('jsonwebtoken');

const JWT_ACCESS_SECRET_KEY=process.env.JWT_ACCESS_SECRET_KEY;
const JWT_ACCESS_TOKEN_EXPIRE_TIME=process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME;

exports.isUserEmailExists = async (userEmail) => {
    const pool = await db.getPool();
    const result = await pool.request()
        .input('Email', sql.NVarChar(100), userEmail)
        .execute('IsUserEmailExists'); // Assuming stored procedure name for checking email exists

    return result.recordset[0].EmailExists === 1;
}

// Function to add a new user
exports.createUser = async (userEmail, userPassword, userERN,userFirstName, userMiddleName, userLastName, userRole,officeId,profileImgUrl) => {
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
            .input('ProfileImageUrl',sql.NVarChar(255),profileImgUrl)
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

// Function to get all user details without password admin login required
exports.getAllUsers = async()=>{
    try {
        const pool = await db.getPool();
        const result = await pool.request().execute('GetAllUsersWithoutPassword');
        return result.recordsets[0];
    } catch (error) {
        console.error('Error in getting Users:', error);
        throw new Error('Failed to fetch all users');
    }
}

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
exports.updateUser = async (userId, userEmail,userPassword, userERN, userFirstName, userMiddleName, userLastName, userRole,officeId,profileImgUrl) => {
    const pool = await db.getPool();
console.log(profileImgUrl);
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
            .input('ProfileImageUrl',sql.NVarChar(255),profileImgUrl)
            .execute('UpdateUser'); // Assuming the stored procedure is named UpdateUser

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

exports.generateAccessToken= (data)=>{
    const accessToken= jwt.sign(data, JWT_ACCESS_SECRET_KEY,{expiresIn: JWT_ACCESS_TOKEN_EXPIRE_TIME});
    return accessToken;
}
