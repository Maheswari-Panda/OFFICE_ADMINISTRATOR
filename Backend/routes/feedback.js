const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const feedbackModel = require('../models/feedbackModel'); // Import the document model
const fetchUser = require('../middleware/fetchUser');

// Add Feedback
router.post('/add', fetchUser, [
    body('documentId').isInt().withMessage('Document ID must be an integer'),
    body('feedbackDescription').notEmpty().withMessage('Feedback description is required'),
    body('receiverId').isInt().withMessage('Receiver ID must be an integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { documentId, feedbackDescription, receiverId } = req.body;
    const senderId = req.user.userId;

    try {
        const feedback = await feedbackModel.addFeedback(documentId, feedbackDescription, senderId, receiverId);
        res.status(201).json({ message: 'Feedback added successfully', feedback });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while adding feedback', details: err.message });
    }
});

// Update Feedback
router.put('/update/:feedbackId', fetchUser, [
    body('feedbackDescription').notEmpty().withMessage('Feedback description is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { feedbackDescription } = req.body;
    const { feedbackId } = req.params;

    try {
        const updatedFeedback = await feedbackModel.updateFeedback(feedbackId, feedbackDescription);
        res.status(200).json({ message: 'Feedback updated successfully', updatedFeedback });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating feedback', details: err.message });
    }
});

// Delete Feedback
router.delete('/delete/:feedbackId', fetchUser, async (req, res) => {
    const { feedbackId } = req.params;

    try {
        await feedbackModel.deleteFeedback(feedbackId);
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting feedback', details: err.message });
    }
});

// Get Feedback by DocumentId
router.get('/document/:documentId', async (req, res) => {
    const { documentId } = req.params;

    try {
        const feedback = await feedbackModel.getFeedbackByDocumentId(documentId);
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching feedback', details: err.message });
    }
});

// Get Feedback by SenderId
router.get('/sender/:senderId', fetchUser, async (req, res) => {
    const { senderId } = req.params;

    try {
        const feedback = await feedbackModel.getFeedbackBySenderId(senderId);
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching feedback', details: err.message });
    }
});

// Get All Feedback
router.get('/all', fetchUser, async (req, res) => {
    try {
        const feedback = await feedbackModel.getAllFeedback();
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching all feedback', details: err.message });
    }
});

module.exports = router;
