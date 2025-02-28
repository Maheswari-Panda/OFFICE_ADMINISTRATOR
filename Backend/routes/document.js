const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const documentModel = require('../models/documentModel'); // Import the document model
const documentLogModel = require('../models/documentLogModel'); // Import the document model
var fetchUser = require('../middleware/fetchUser');

const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: './uploads/Documents', // Folder to store uploaded files
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    },
});
  
const upload = multer({ storage });
  
// Add a new document
router.post('/add',fetchUser, async (req, res) => {
  const userId = req.user.userId;
  const documentData = req.body; // Expecting full document data in the request body
  console.log(req.body);
  try {
    const message = await documentModel.addDocument(documentData); // Call the addDocument model function
   if(message){
     const result = await documentLogModel.addDocumentLog(userId,message,'Document Added');
   }
    res.status(200).json({ message }); // Return success message
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while adding the document', details: err.message });
  }
});

// Update a document by ID
router.put('/update/:id', async (req, res) => {
  const documentId = req.params.id; // Get the DocumentId from the URL parameter
  const documentData = req.body; // Expecting updated document data in the request body

  try {
    const message = await documentModel.updateDocument(documentId, documentData); // Call the updateDocument model function
    res.status(200).json({ message }); // Return success message
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while updating the document', details: err.message });
  }
});

// Get a document by ID
router.get('/get/:id', async (req, res) => {
  const documentId = req.params.id; // Get the DocumentId from the URL parameter

  try {
    const document = await documentModel.getDocumentById(documentId); // Call the getDocumentById model function
    res.status(200).json(document); // Return the document details
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching the document', details: err.message });
  }
});
  

// Get all documents
router.get('/getall', async (req, res) => {
  try {
    const documents = await documentModel.getAllDocuments(); // Call the getAllDocuments model function
    res.status(200).json(documents); // Return the list of documents
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching documents', details: err.message });
  }
});

// Delete a document by ID
router.delete('/delete/:id', async (req, res) => {
  const documentId = req.params.id; // Get the DocumentId from the URL parameter

  try {
    const message = await documentModel.deleteDocument(documentId); // Call the deleteDocument model function
    res.status(200).json({ message }); // Return success message
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while deleting the document', details: err.message });
  }
});

// Get documents by document type ID
router.get('/getbytype/:typeId', async (req, res) => {
  const documentTypeId = req.params.typeId; // Get the DocumentTypeId from the URL parameter

  try {
    const documents = await documentModel.getDocumentsByType(documentTypeId); // Call the getDocumentsByType model function
    res.status(200).json(documents); // Return the list of documents
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching documents by type', details: err.message });
  }
});

// Route to handle document upload
router.post('/upload', upload.single('DocumentPath'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ DocumentPath: `/uploads/Documents/${req.file.filename}` }); // Send image URL back
});

// approve document
router.post('/approve/:documentId',fetchUser, async (req, res) => {
  const documentId = req.params.documentId;
  const userId = req.user.userId;
  const action = req.body.action;
  try {
    const response = await documentModel.approveDocument(userId,documentId,action);
    res.status(200).json(response); 
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while approving documents by documentId', details: err.message });
  }
});

// approve document
router.post('/return/:documentId',fetchUser, async (req, res) => {
  const documentId = req.params.documentId;
  const userId = req.user.userId;
  const action = req.body.action;
  try {
    const response = await documentModel.returnDocument(userId,documentId,action);
    res.status(200).json(response); 
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while returned document by documentId', details: err.message });
  }
});
module.exports = router;
