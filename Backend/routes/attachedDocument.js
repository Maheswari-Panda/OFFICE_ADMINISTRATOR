const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const attachedDocumentModel = require('../models/attachedDocumentModel'); // Import the document model

const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: './uploads/AttachedDocuments', // Folder to store uploaded files
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    },
});
  
const upload = multer({ storage });


// Route to handle attached document upload
router.post('/upload', upload.single('AttachedDocumentPath'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ AttachedDocumentPath: `/uploads/AttachedDocuments/${req.file.filename}` }); // Send image URL back
  });

// Route to add an attached document
router.post('/add', async (req, res) => {
    try {
        const { DocumentId, AttachedDocumentPath } = req.body;
        const result = await attachedDocumentModel.addAttachedDocument(DocumentId, AttachedDocumentPath);
        if(result==1){
            res.status(200).json({ success: true, message: 'Attached document added successfully', data: result });
        }
        else{
            res.status(500).json({ success: false, message: 'Error adding attached in database document', error: err.message });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error adding attached document', error: err.message });
    }
});

// Route to get attached documents by DocumentId
router.get('/get/:documentId', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const result = await attachedDocumentModel.getAttachedDocumentsByDocumentId(documentId);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching attached documents', error: err.message });
    }
});

// Route to update an attached document
router.put('/update/:documentId', async (req, res) => {
    try {
        const { attachedDocumentPath } = req.body;
        const documentId = req.params.documentId;
        const result = await attachedDocumentModel.updateAttachedDocument(documentId,attachedDocumentPath);
        res.status(200).json({ success: true, message: 'Attached document updated successfully', data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating attached document', error: err.message });
    }
});

// Route to delete an attached document
router.delete('/delete/:attachedDocumentId', async (req, res) => {
    try {
        const attachedDocumentId = req.params.attachedDocumentId;
        const result = await attachedDocumentModel.deleteAttachedDocument(attachedDocumentId);
        res.status(200).json({ success: true, message: 'Attached document deleted successfully', data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting attached document', error: err.message });
    }
});

module.exports = router;
