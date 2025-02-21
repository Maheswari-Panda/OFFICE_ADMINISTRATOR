const express = require('express');
const router = express.Router();
const documentLogModel = require('../models/documentLogModel');

// Route to add a document log
router.post('/add', async (req, res) => {
    const { userId, documentId, action } = req.body;
    
    if (!userId || !documentId || !action) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const documentLog = await documentLogModel.addDocumentLog(userId, documentId, action);

        if (!documentLog) {
            return res.status(500).json({ message: 'Document log not added' });
        }

        res.status(201).json(documentLog);
    } catch (err) {
        console.error('Error adding document log:', err);
        res.status(500).json({ message: 'Failed to add document log' });
    }
});

// Route to get document logs by DocumentId
router.get('/get_by_document/:documentId', async (req, res) => {
    const { documentId } = req.params;

    try {
        const documentLogs = await documentLogModel.getDocumentLogByDocumentId(documentId);

        if (!documentLogs.length) {
            return res.status(404).json({ message: 'No logs found for this document' });
        }

        res.status(200).json(documentLogs);
    } catch (err) {
        console.error('Error fetching document logs:', err);
        res.status(500).json({ message: 'Failed to fetch document logs' });
    }
});

// Route to get document logs by UserId
router.get('/get_by_user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const documentLogs = await documentLogModel.getDocumentLogByUserId(userId);

        if (!documentLogs.length) {
            return res.status(404).json({ message: 'No logs found for this user' });
        }

        res.status(200).json(documentLogs);
    } catch (err) {
        console.error('Error fetching document logs:', err);
        res.status(500).json({ message: 'Failed to fetch document logs' });
    }
});

// Route to get all document logs
router.get('/getall', async (req, res) => {
    try {
        const documentLogs = await documentLogModel.getAllDocumentLogs();

        if (!documentLogs.length) {
            return res.status(404).json({ message: 'No document logs found' });
        }

        res.status(200).json(documentLogs);
    } catch (err) {
        console.error('Error fetching all document logs:', err);
        res.status(500).json({ message: 'Failed to fetch document logs' });
    }
});

module.exports = router;
