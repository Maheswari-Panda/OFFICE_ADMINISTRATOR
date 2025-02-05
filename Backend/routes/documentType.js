const express = require('express');
const router = express.Router();
const documentTypeModel = require('../models/documentTypeModel');

// Example route to add a document type
router.post('/add', async (req, res) => {
  const { documentTypeName } = req.body;  // Get the document type name from the request body

  try {
    const message = await documentTypeModel.addDocumentType(documentTypeName);  // Call the addDocumentType model function
    res.status(200).json({ message });  // Return success message
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while adding the document type' });
  }
});

// Update document Type name
router.put('/update/:id', async (req, res) => {
    const documentTypeId = req.params.id;  // Get the DocumentTypeId from the URL parameter
    const { documentTypeName } = req.body;  // Get the document type name from the request body
  
    try {
      const message = await documentTypeModel.updateDocumentType(documentTypeId, documentTypeName);  // Call the updateDocumentType model function
      res.status(200).json({ message });  // Return success message
    } catch (err) {
      res.status(500).json({ error: 'An error occurred while updating the document type'+err });
    }
});


// Example route to get a document type by ID
router.get('/get/:id', async (req, res) => {
  const documentTypeId = req.params.id;  // Get the DocumentTypeId from the URL parameter

  try {
    const documentType = await documentTypeModel.getDocumentTypeById(documentTypeId);  // Call the getDocumentTypeById model function
    res.status(200).json(documentType);  // Return the document type details
  } catch (err) {
    res.status
  }
});

// Example route to get all document types
router.get('/getall', async (req, res) => {
    try {
      const documentTypes = await documentTypeModel.getAllDocumentTypes();  // Call the getAllDocumentTypes model function
      res.status(200).json(documentTypes);  // Return the list of document types
    } catch (err) {
      res.status(500).json({ error: 'An error occurred while fetching document types' });
    }
  });

  // Example route to delete a document type
router.delete('/delete/:id', async (req, res) => {
    const documentTypeId = req.params.id;  // Get the DocumentTypeId from the URL parameter
  
    try {
      const message = await documentTypeModel.deleteDocumentType(documentTypeId);  // Call the deleteDocumentType model function
      res.status(200).json({ message });  // Return success message
    } catch (err) {
      res.status(500).json({ error: 'An error occurred while deleting the document type' });
    }
  });

module.exports = router;