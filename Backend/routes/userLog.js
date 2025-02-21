const express = require('express');
const router = express.Router();
const userLogModel = require('../models/userLogModel');

router.get('/get/:userId', async (req, res) => {
    try {
        // Get the logged-in user id from the token
        const userId = req.params.userId;
        const userLog = await userLogModel.getUserLogById(userId);

        if (!userLog) {
            return res.status(404).json({ message: 'User log not found' });
        }

        // Return the user details
        res.status(200).json(userLog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user logs' });
    }
});


router.get('/getall', async (req, res) => {
    try {
        const userLogs = await userLogModel.getAllUserLogs();

        if (!userLogs) {
            return res.status(404).json({ message: 'User logs not found' });
        }

        // Return the user details
        res.status(200).json(userLogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user logs' });
    }
});

router.post('/add', async (req, res) => {
    const {userId,action}=req.body;
    try {
        const userLogs = await userLogModel.addUserLog(userId,action);

        if (!userLogs) {
            return res.status(404).json({ message: 'User logs not added' });
        }

        // Return the user details
        res.status(200).json(userLogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add user log' });
    }
});

module.exports = router;