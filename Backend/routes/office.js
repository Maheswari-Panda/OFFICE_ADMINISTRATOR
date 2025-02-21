const express = require('express');
const router = express.Router();
const officeModel = require('../models/officeModel');  // Assuming the Office model is in the models folder

// Route to add an office by POST "/api/office/addOffice" No login required
router.post('/add', async (req, res) => {
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
router.get('/get/:officeId', async (req, res) => {
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
router.put('/update/:officeId', async (req, res) => {
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

// Get all Office Details
router.get('/getall', async (req, res) => {
    try {
        const allOffice = await officeModel.getAllOfficeDetails();
        res.status(200).json(allOffice);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to get all office',
            error: error.message
        });
    }
});

// Route to delete office
router.delete('/delete/:officeId', async (req, res) => {
    try {
        const officeId = req.params.officeId;
        const result = await officeModel.deleteOffice(officeId);
        console.log(result);
        if(result.Status==1){
            console.log("inside the result",result);
            res.status(200).json({message:result.Message });
        }
        else{
            res.status(404).json({message: result});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete office',
            error: error.message
        });
    }
});

module.exports = router;