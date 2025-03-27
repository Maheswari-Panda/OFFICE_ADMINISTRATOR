const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const documentModel = require("../models/documentModel"); // Import the document model
const documentLogModel = require("../models/documentLogModel"); // Import the document model
var fetchUser = require("../middleware/fetchUser");
const userModel = require("../models/userModel"); // Import the user model

const {
  sendEmail,
  sendEmailForForgetPassword,
  sendDocumentReceivedEmail,
  sendDocumentRejectedEmail,
  sendDocumentApprovedEmail,
  sendDocumentDispatchedEmail,
  sendUpdatedDocumentResentEmail,
  sendPendingDocumentEmail,
  sendRequestForApprovalEmail,
  sendDocumentReceivedEmailToOfficeAdmin,
} = require("../models/sendEmail");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/Documents", // Folder to store uploaded files
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file
  },
});

const upload = multer({ storage });

const link = `http://localhost:5173/`;

// Add a new document
router.post("/add", fetchUser, async (req, res) => {
  const userId = req.user.userId;
  const documentData = req.body; // Expecting full document data in the request body
  const sender = await userModel.getUserById(documentData.SenderId);
  const endReceiver = await userModel.getUserById(documentData.EndUserId);
  const documentAddedByuser = await userModel.getUserById(userId);
  console.log(req.body);
  try {
    const message = await documentModel.addDocument(documentData); // Call the addDocument model function
    console.log(message);
    if (message) {
      const result = await documentLogModel.addDocumentLog(
        userId,
        message,
        "Document Added"
      );
      if (documentData.IsInward === 0) {
        await sendDocumentReceivedEmail(
          sender.Email,
          documentData.DocumentName,
          link
        ); //email sent to the office from which the document has been sent
        await sendDocumentReceivedEmailToOfficeAdmin(
          endReceiver.Email,
          documentData.DocumentName,
          link
        ); //send email to end reciver which will suppose to view the document
      } else {
        await sendPendingDocumentEmail(
          documentAddedByuser.Email,
          documentData.DocumentName,
          link,
          "Just added document for outward"
        ); // email sent to user who added the document to tell that his/her added document is currently pending
        await sendRequestForApprovalEmail(
          sender.Email,
          sender.FirstName + " " + sender.LastName,
          documentData.DocumentName,
          link
        ); //email sent to the admin for approval of pending document
      }
    }
    res.status(200).json({ message }); // Return success message
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while adding the document",
        details: err.message,
      });
  }
});

// Update a document by ID
router.put("/update/:id", async (req, res) => {
  const documentId = req.params.id; // Get the DocumentId from the URL parameter
  const {
    IsInward,
    DocumentName,
    DocumentTypeId,
    LetterSerialNumber,
    InwardOutwardReferenceDocumentId,
    EndUserId,
    DocumentDescription,
    DocumentPath,
    SenderId,
    ReceiverId,
    BillingInfo,
    OfficeId,
  } = req.body; // Expecting updated document data in the request body
  try {
    const message = await documentModel.updateDocument(
      documentId,
      IsInward,
      DocumentName,
      DocumentTypeId,
      LetterSerialNumber,
      InwardOutwardReferenceDocumentId,
      EndUserId,
      DocumentDescription,
      DocumentPath,
      SenderId,
      ReceiverId,
      BillingInfo,
      OfficeId
    ); // Call the updateDocument model function
    console.log(message);
    res.status(200).json({ message }); // Return success message
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while updating the document",
        details: err.message,
      });
  }
});

// Get a document by ID
router.get("/get/:id", async (req, res) => {
  const documentId = req.params.id; // Get the DocumentId from the URL parameter

  try {
    const document = await documentModel.getDocumentById(documentId); // Call the getDocumentById model function
    res.status(200).json(document); // Return the document details
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while fetching the document",
        details: err.message,
      });
  }
});

// Get all documents
router.get("/getall", async (req, res) => {
  try {
    const documents = await documentModel.getAllDocuments(); // Call the getAllDocuments model function
    res.status(200).json(documents); // Return the list of documents
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while fetching documents",
        details: err.message,
      });
  }
});

// Delete a document by ID
router.delete("/delete/:id", async (req, res) => {
  const documentId = req.params.id; // Get the DocumentId from the URL parameter

  try {
    const message = await documentModel.deleteDocument(documentId); // Call the deleteDocument model function
    res.status(200).json({ message }); // Return success message
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while deleting the document",
        details: err.message,
      });
  }
});

// Get documents by document type ID
router.get("/getbytype/:typeId", async (req, res) => {
  const documentTypeId = req.params.typeId; // Get the DocumentTypeId from the URL parameter

  try {
    const documents = await documentModel.getDocumentsByType(documentTypeId); // Call the getDocumentsByType model function
    res.status(200).json(documents); // Return the list of documents
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while fetching documents by type",
        details: err.message,
      });
  }
});

// Route to handle document upload
router.post("/upload", upload.single("DocumentPath"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ DocumentPath: `/uploads/Documents/${req.file.filename}` }); // Send image URL back
});

// approve document
router.post("/approve/:documentId", fetchUser, async (req, res) => {
  const documentId = req.params.documentId;
  const userId = req.user.userId;
  const action = req.body.action;
  const document = await documentModel.getDocumentById(documentId);
  try {
    const response = await documentModel.approveDocument(
      userId,
      documentId,
      action
    );
    if(response){
      await sendDocumentApprovedEmail(document.DocumentCreatedByEmail,document.DocumentName,link);
    }
    res.status(200).json(response);
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while approving documents by documentId",
        details: err.message,
      });
  }
});

// resend document
router.post("/resend_for_approval/:documentId", fetchUser, async (req, res) => {
  const documentId = req.params.documentId;
  const userId = req.user.userId;
  const action = req.body.action;
  const document = await documentModel.getDocumentById(documentId);
  try {
    const response = await documentModel.resendDocumentForApproval(
      userId,
      documentId,
      action
    );
    if(response){
      await sendUpdatedDocumentResentEmail(document.SenderEmail,document.DocumentName,link);
    }
    res.status(200).json(response);
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while resending document for approval",
        details: err.message,
      });
  }
});

// return document
router.post("/return/:documentId", fetchUser, async (req, res) => {
  const documentId = req.params.documentId;
  const userId = req.user.userId;
  const action = req.body.action;
  
  const document = await documentModel.getDocumentById(documentId);
  try {
    const response = await documentModel.returnDocument(
      userId,
      documentId,
      action
    );
    if(response){
      await sendDocumentRejectedEmail(document.DocumentCreatedByEmail,document.DocumentName,link,'Just Rejected');
    }
    res.status(200).json(response);
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while returned document by documentId",
        details: err.message,
      });
  }
});

// Get all documents
router.post("/getall_receieved_dispatched", async (req, res) => {
  try {
    const documents = await documentModel.getAllDocumentsReceivedOrDispatched(); // Call the getAllDocuments model function
    res.status(200).json(documents); // Return the list of documents
  } catch (err) {
    res
      .status(500)
      .json({
        error:
          "An error occurred while fetching documents recived or dispatched",
        details: err.message,
      });
  }
});

// Get all documents
router.post("/getall_receieved_dispatched/:officeId", async (req, res) => {
  try {
    const offieId = req.params.officeId;
    const documents =
      await documentModel.getAllDocumentsReceivedOrDispatchedByOfficeId(
        offieId
      ); // Call the getAllDocuments model function
    res.status(200).json(documents); // Return the list of documents
  } catch (err) {
    res
      .status(500)
      .json({
        error:
          "An error occurred while fetching documents recived or dispatched by office Id",
        details: err.message,
      });
  }
});

router.post("/getpending_foruser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const documents = await documentModel.getPendingDocumentsForUserByUserId(
      userId
    ); // Call the getAllDocuments model function
    res.status(200).json(documents); // Return the list of documents
  } catch (err) {
    res
      .status(500)
      .json({
        error:
          "An error occurred while fetching pending documents for logged in user",
        details: err.message,
      });
  }
});

router.post("/getapproved_foruser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const documents = await documentModel.getApprovedDocumentsForUserByUserId(
      userId
    ); // Call the getAllDocuments model function
    res.status(200).json(documents); // Return the list of documents
  } catch (err) {
    res
      .status(500)
      .json({
        error:
          "An error occurred while fetching approved documents for logged in user",
        details: err.message,
      });
  }
});

router.post("/getreturned_foruser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const documents = await documentModel.getReturnedDocumentsForUserByUserId(
      userId
    ); // Call the getAllDocuments model function
    res.status(200).json(documents); // Return the list of documents
  } catch (err) {
    res
      .status(500)
      .json({
        error:
          "An error occurred while fetching returned documents for logged in user",
        details: err.message,
      });
  }
});

router.post("/get_by_status/:officeId", async (req, res) => {
  try {
    const officeId = req.params.officeId;
    const statusName = req.body.statusName;
    const documents = await documentModel.getDocumentsByStatusName(
      officeId,
      statusName
    );
    res.status(200).json(documents); // Return the list of documents
  } catch (err) {
    res
      .status(500)
      .json({
        error:
          "An error occurred while fetching documents by status name and office id",
        details: err.message,
      });
  }
});

// approve document
router.post("/dispatch/:documentId", fetchUser, async (req, res) => {
  const documentId = req.params.documentId;
  const userId = req.user.userId;
  const action = req.body.action;
  
  const document = documentModel.getDocumentById(documentId);
  try {
    const response = await documentModel.dispatchDocument(
      userId,
      documentId,
      action
    );
    if(response){
      await sendDocumentDispatchedEmail(document.SenderEmail,document.DocumentName,link,'right now');
    }
    res.status(200).json(response);
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while dispatching documents by documentId",
        details: err.message,
      });
  }
});

// Get all documents
router.post("/get_next_outward_document_serial_number/:officeId", async (req, res) => {
  try {
    const offieId = req.params.officeId;
    const response =
      await documentModel.getNextUpcomingOutwardDocumentSerialNumber(
        offieId
      ); // Call the getAllDocuments model function
    res.status(200).json(response); // Return the list of documents
  } catch (err) {
    res
      .status(500)
      .json({
        error:
          "An error occurred while fetching next upcoming outward document serial number for given office Id",
        details: err.message,
      });
  }
});

router.post("/get_document_counts/:officeId", async (req, res) => {
  try {
    const offieId = req.params.officeId;
    const response =
      await documentModel.getDocumentCounts(
        offieId
      ); // Call the getAllDocuments model function
      // console.log(response);
    res.status(200).json(response); // Return the list of documents
  } catch (err) {
    res
      .status(500)
      .json({
        error:
          "An error occurred while fetching the document counts for given office Id",
        details: err.message,
      });
  }
});

router.post("/get_documentlog_counts/:officeId", async (req, res) => {
  try {
    const offieId = req.params.officeId;
    const response =
      await documentModel.getMonthlyDocumentLogCounts(
        offieId
      ); // Call the getAllDocuments model function
      // console.log(response);
    res.status(200).json(response); // Return the list of documents
  } catch (err) {
    res
      .status(500)
      .json({
        error:
          "An error occurred while fetching the monthly document log counts for given office Id",
        details: err.message,
      });
  }
});

module.exports = router;
