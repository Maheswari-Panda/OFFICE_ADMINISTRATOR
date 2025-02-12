const express = require('express');
const router = express.Router();
const statusModel = require('../models/statusModel');

// Add a new status
router.post('/add', async (req, res) => {
    try {
        const { statusName } = req.body;
        if (!statusName) {
            return res.status(400).json({ error: 'Status name is required' });
        }
        const result = await statusModel.addStatus(statusName);
        res.status(201).json({ message: 'Status added successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: 'Error adding status' });
    }
});

// Update an existing status
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { statusName } = req.body;
        if (!statusName) {
            return res.status(400).json({ error: 'Status name is required' });
        }
        const result = await statusModel.updateStatus(id, statusName);
        res.status(200).json({ message: 'Status updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: 'Error updating status' });
    }
});

// Get status by ID
router.get('/get/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await statusModel.getStatusById(id);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Status not found' });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching status' });
    }
});

// Delete a status by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await statusModel.deleteStatus(id);
        console.log(result);
        if (result >0) {
            res.status(200).json({ message: 'Status deleted successfully' });
        } else {
            res.status(404).json({ error: 'Status not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting status' });
    }
});

// Get all statuses
router.get('/getAll', async (req, res) => {
    try {
        const result = await statusModel.getAllStatuses();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching statuses' });
    }
});

module.exports = router;
