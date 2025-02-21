const express = require('express');
const router = express.Router();
const documentModel = require('../models/documentModel');

const ExcelJS = require("exceljs");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

// 📌 API to Generate Excel Report
router.get("/excel", async (req, res) => {
  try {
    const documents = await documentModel.getAllDocuments();

    if (!documents || documents.length === 0) {
      return res.status(404).json({ error: "No documents found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Documents Report");

    worksheet.columns = [
        { header: "Srno.", key: "DocumentId", width: 10 },
        { header: "Type", key: "IsInward", width: 10 },
        { header: "DateTime", key: "DispatchedDateTime", width: 20 },
        { header: "Letter Serial", key: "LetterSerialNumber", width: 20 },
        { header: "Document Name", key: "DocumentName", width: 30 },
        { header: "Sender", key: "SenderName", width: 15 },
        { header: "Receiver", key: "ReceiverName", width: 15 },
        { header: "Status", key: "StatusName", width: 15 },
        { header: "Billing Info", key: "BillingInfo", width: 30 },
      ];
      
      // Add rows to the worksheet
      documents.forEach((row) => {
        worksheet.addRow({
          DocumentId: row.DocumentId,
          IsInward: row.IsInward ? "Inward" : "Outward", // Inward/Outward mapping
          DispatchedDateTime: new Date(row.DispatchedDateTime).toLocaleString(), // Date formatting
          LetterSerialNumber: row.LetterSerialNumber,
          DocumentName: row.DocumentName,
          SenderName: row.SenderName,
          ReceiverName: row.ReceiverName,
          StatusName: row.StatusName,
          BillingInfo: row.BillingInfo,
        });
      });
    const filePath = path.join(__dirname, "../exports/Documents_Report.xlsx");

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, "Documents_Report.xlsx", (err) => {
      if (err && !res.headersSent) {
        console.error("❌ Error downloading the file:", err);
        res.status(500).json({ error: "Failed to download the Excel file" });
      }
    });
  } catch (err) {
    console.error("❌ Error generating report:", err);
    res.status(500).json({ error: "An error occurred while generating the report", details: err.message });
  }
});

router.get("/pdf", async (req, res) => {
    try {
      const documents = await documentModel.getAllDocuments();
  
      if (!documents || documents.length === 0) {
        return res.status(404).json({ error: "No documents found" });
      }
  
      // Define the file path for the PDF report
      const filePath = path.join(__dirname, "../exports/Documents_Report.pdf");
  
      // Ensure the directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
  
      // Create a new PDF document
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
  
      // Add a border around the entire page
      doc.rect(30, 30, 540, 780).stroke(); // Left, top, width, height
  
      // Add title
      doc.fontSize(20).text("Documents Report", { align: "center" });
      doc.moveDown(1);
  
      // Add introductory paragraph with a professional tone
      doc.fontSize(11).text(
        "This comprehensive report provides an in-depth analysis of all documents managed and processed during the specified reporting period. It aims to provide a clear overview of the document types, their respective statuses, and key figures that reflect the current operational status. It highlights any pending actions or concerns and offers a detailed summary for review and necessary follow-up.",
        { align: 'justify' }
      );
      doc.moveDown(2);
  
      // Add paragraph with counts of different document types
      const circulars = documents.filter(doc => doc.DocumentTypeName === 'Circular').length;
      const notices = documents.filter(doc => doc.DocumentTypeName === 'Notice').length;
      const latters = documents.filter(doc => doc.DocumentTypeName === 'Latter').length;
      const bills = documents.filter(doc => doc.DocumentTypeName === 'Bill').length;
      const inward = documents.filter(doc => doc.IsInward).length;
      const outward = documents.filter(doc => !doc.IsInward).length;
      const pending = documents.filter(doc => doc.StatusName === 'Pending').length;
  
      doc.fontSize(10);
      doc.text(`Total Circulars: ${circulars}`);
      doc.text(`Total Notices: ${notices}`);
      doc.text(`Total Latters: ${latters}`);
      doc.text(`Total Bills: ${bills}`);
      doc.text(`Total Inward Documents: ${inward}`);
      doc.text(`Total Outward Documents: ${outward}`);
      doc.text(`Pending Documents: ${pending}`);
      doc.moveDown(1);
  
      // Add document details in a table format
      doc.fontSize(12).text("Document Details", { underline: true });
      doc.moveDown(0.5);
  
      // Table headers and setup
      const headers = [
        { text: "ID", width: 10 },
        { text: "Type", width: 15 },
        { text: "Date", width: 25 },
        { text: "LA/Serial", width: 30 },
        { text: "Name", width: 35 },
        { text: "Sender", width: 46 },
        { text: "Receiver", width: 53 },
        { text: "Status", width: 56 },
        { text: "Billing Info", width: 60 },
      ];
  
      // Function to add table header and row data
      const addTableHeader = () => {
        const tableX = 40;
        const tableY = doc.y;
  
        headers.forEach((header, index) => {
          doc.fontSize(8).text(header.text, tableX + index * header.width + 5, tableY + 5);
        });
  
        doc.moveDown(0.5); // Move to the next row after the headers
      };
  
      const addTableRow = (row) => {
        const tableX = 40;
        const tableY = doc.y;
        const rowData = [
          row.DocumentId,
          row.IsInward ? "Inward" : "Outward",
          new Date(row.DispatchedDateTime).toLocaleDateString(),
          row.LetterSerialNumber,
          row.DocumentName,
          row.SenderName,
          row.ReceiverName,
          row.StatusName,
          row.BillingInfo
        ];
  
        rowData.forEach((cell, index) => {
          doc.fontSize(8).text(cell, tableX + index * headers[index].width + 5, tableY + 5);
        });
  
        doc.moveDown(0.5); // Add space after the row
      };
  
      // Draw table header
      addTableHeader();
  
      // Add rows for each document, handling pagination
      documents.forEach((row) => {
        const spaceLeft = doc.page.height - doc.y - doc.page.margins.bottom;
  
        // If the content reaches near the bottom of the page, add a new page
        if (spaceLeft < 20) { // If remaining space is less than 20, start a new page
          doc.addPage();
          addTableHeader(); // Redraw the header on the new page
        }
  
        addTableRow(row);
      });
  
      // Add a conclusion and signature section at the end
      doc.moveDown(10);
      doc.fontSize(11);
      doc.x=40;
      doc.text("Conclusion:", { bold: true });
      doc.text("This report provides a comprehensive overview of the document management system within the organization. It analyzes document types, statuses, and key performance indicators. The data presented can be used to identify areas for improvement and enhance overall document processing efficiency.");
      doc.moveDown(2);
  
      // Signature Section
      doc.fontSize(10)
      doc.text("Authorized Signature: ______________________", { align: "left" });
      doc.text("Date: ______________________", { align: "left" });
      doc.moveDown(2);
  
      // Finalize the PDF document
      doc.end();
  
      // Wait for the file to be written before sending response
      stream.on("finish", () => {
        res.download(filePath, "Documents_Report.pdf", (err) => {
          if (err) {
            console.error("❌ Error downloading the file:", err);
            res.status(500).json({ error: "Failed to download the PDF file" });
          }
        });
      });
  
    } catch (err) {
      console.error("❌ Error generating report:", err);
      res.status(500).json({ error: "An error occurred while generating the report", details: err.message });
    }
  });
  module.exports = router;