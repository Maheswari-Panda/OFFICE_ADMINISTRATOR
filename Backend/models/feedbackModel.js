const sql = require('mssql');
const db = require('../config/db'); // Make sure to import your database connection

exports.addFeedback = async (documentId, feedbackDescription, senderId, receiverId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('DocumentId', sql.Int, documentId)
            .input('FeedbackDescription', sql.Text, feedbackDescription)
            .input('SenderId', sql.Int, senderId)
            .input('ReceiverId', sql.Int, receiverId)
            .execute('AddFeedback'); // Make sure you have a stored procedure named 'AddFeedback'

        return result.recordset[0]; // Returns feedback details
    } catch (err) {
        console.error('Error adding feedback:', err);
        throw new Error('Failed to add feedback');
    }
};

exports.updateFeedback = async (feedbackId, feedbackDescription) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('FeedbackId', sql.Int, feedbackId)
            .input('FeedbackDescription', sql.Text, feedbackDescription)
            .execute('UpdateFeedback'); // Ensure you have a stored procedure named 'UpdateFeedback'

        return result.recordset[0]; // Returns updated feedback details
    } catch (err) {
        console.error('Error updating feedback:', err);
        throw new Error('Failed to update feedback');
    }
};

exports.deleteFeedback = async (feedbackId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('FeedbackId', sql.Int, feedbackId)
            .execute('DeleteFeedback'); // Ensure you have a stored procedure named 'DeleteFeedback'

        return { message: 'Feedback deleted successfully' };
    } catch (err) {
        console.error('Error deleting feedback:', err);
        throw new Error('Failed to delete feedback');
    }
};

exports.getFeedbackByDocumentId = async (documentId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('DocumentId', sql.Int, documentId)
            .execute('GetFeedbackByDocumentId'); // Ensure you have a stored procedure named 'GetFeedbackByDocumentId'

        return result.recordset; // Returns an array of feedback
    } catch (err) {
        console.error('Error fetching feedback by DocumentId:', err);
        throw new Error('Failed to fetch feedback');
    }
};

exports.getFeedbackBySenderId = async (senderId) => {
    try {
        const pool = await db.getPool();
        const result = await pool.request()
            .input('SenderId', sql.Int, senderId)
            .execute('GetFeedbackBySenderId'); // Ensure you have a stored procedure named 'GetFeedbackBySenderId'

        return result.recordset; // Returns an array of feedback
    } catch (err) {
        console.error('Error fetching feedback by SenderId:', err);
        throw new Error('Failed to fetch feedback');
    }
};

exports.getAllFeedback = async () => {
    try {
        const pool = await db.getPool();
        const result = await pool.request().execute('GetAllFeedback'); // Ensure you have a stored procedure named 'GetAllFeedback'

        return result.recordset; // Returns an array of feedback
    } catch (err) {
        console.error('Error fetching all feedback:', err);
        throw new Error('Failed to fetch all feedback');
    }
};
