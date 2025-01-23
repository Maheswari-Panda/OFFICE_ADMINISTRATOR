const express = require('express');
const router = express.Router();
const officeModel = require('../models/officeModel');  // Assuming the Office model is in the models folder

// Route to add an office by POST "/api/office/addOffice" No login required
router.post('/addOffice', async (req, res) => {
    try {
        const { officeName, officeLocation, officeContact } = req.body;
        const officeId = await officeModel.addOffice(officeName, officeLocation, officeContact);
        res.status(201).json({
            message: 'Office created successfully',
            officeId: officeId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to create office',
            error: error.message
        });
    }
});

// Route to get office by ID
router.get('/:officeId', async (req, res) => {
    try {
        const officeId = req.params.officeId;
        const office = await officeModel.getOfficeById(officeId);
        if (office) {
            res.status(200).json(office);
        } else {
            res.status(404).json({ message: 'Office not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to retrieve office',
            error: error.message
        });
    }
});

// Route to update office details
router.put('/:officeId', async (req, res) => {
    try {
        const officeId = req.params.officeId;
        const { officeName, officeLocation, officeContact } = req.body;
        await officeModel.updateOffice(officeId, officeName, officeLocation, officeContact);
        res.status(200).json({ message: 'Office details updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update office',
            error: error.message
        });
    }
});

// Route to delete office
router.delete('/:officeId', async (req, res) => {
    try {
        const officeId = req.params.officeId;
        await officeModel.deleteOffice(officeId);
        res.status(200).json({ message: 'Office deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete office',
            error: error.message
        });
    }
});

module.exports = router;