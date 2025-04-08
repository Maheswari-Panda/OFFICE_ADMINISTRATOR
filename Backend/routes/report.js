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
    let { startDate, endDate } = req.query;
    startDate = new Date(startDate).toISOString().split('T')[0];
    endDate = new Date(endDate).toISOString().split('T')[0];
    
    console.log(startDate);
    console.log(endDate);
    const documents = await documentModel.getCompleteDocumentReport(startDate,endDate);

    if (!documents[0] || documents[0].length === 0) {
      return res.status(404).json({ error: "No documents found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Documents Report");

    worksheet.columns = [
        { header: "Srno.", key: "DocumentId", width: 10 },
        { header: "Type", key: "IsInward", width: 10 },
        { header: "DateTime", key: "DispatchedDateTime", width: 20 },
        { header: "Document Srno", key: "DocumentSerialNumber", width: 20 },
        { header: "Document Name", key: "DocumentName", width: 30 },
        { header: "Sender", key: "SenderName", width: 15 },
        { header: "Receiver", key: "ReceiverName", width: 15 },
        { header: "Status", key: "StatusName", width: 15 },
        { header: "Billing Info", key: "BillingInfo", width: 30 },
      ];
      
      // Add rows to the worksheet
      documents[0].forEach((row) => {
        worksheet.addRow({
          DocumentId: row.DocumentId,
          IsInward: row.IsInward ? "Inward" : "Outward", // Inward/Outward mapping
          DispatchedDateTime: new Date(row.DispatchedDateTime).toLocaleString(), // Date formatting
          DocumentSerialNumber: row.DocumentSerialNumber,
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
    let { startDate, endDate } = req.query;
    startDate = new Date(startDate).toISOString().split('T')[0];
    endDate = new Date(endDate).toISOString().split('T')[0];

    const documents = await documentModel.getCompleteDocumentReport(startDate, endDate);
    // console.log(documents);

    if (!documents[0] || documents[0].length === 0) {
      return res.status(404).json({ error: "No documents found" });
    }

    const filePath = path.join(__dirname, "../exports/Documents_Report.pdf");
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ➕ Define a helper function to draw border
    const drawPageBorder = () => {
      doc.rect(30, 30, 540, 780).stroke(); // Border dimensions
    };

    // 📄 Draw initial page border
    drawPageBorder();

    // Title
    doc.fontSize(20).text("Documents Report", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(15).text(`Report Generated from: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`, { align: "center" });
    doc.moveDown(1);

    // Intro paragraph
    doc.fontSize(11).text(
      "This comprehensive report provides an in-depth analysis of all documents managed and processed during the specified reporting period. It aims to provide a clear overview of the document types, their respective statuses, and key figures that reflect the current operational status. It highlights any pending actions or concerns and offers a detailed summary for review and necessary follow-up.",
      { align: 'justify' }
    );
    doc.moveDown(2);

    // Count calculations
    const circulars = documents[0].filter(doc => doc.DocumentTypeName === 'Circular' && (doc.StatusName === "Dispatched" || doc.StatusName === "Received")).length;
    const notices = documents[0].filter(doc => doc.DocumentTypeName === 'Notice' && (doc.StatusName === "Dispatched" || doc.StatusName === "Received")).length;
    const letters = documents[0].filter(doc => doc.DocumentTypeName === 'Letter' && (doc.StatusName === "Dispatched" || doc.StatusName === "Received")).length;
    const bills = documents[0].filter(doc => doc.DocumentTypeName === 'Bill' && (doc.StatusName === "Dispatched" || doc.StatusName === "Received")).length;
    const inward = documents[0].filter(doc => doc.IsInward).length;
    const outward = documents[0].filter(doc => !doc.IsInward && (doc.StatusName === "Dispatched" || doc.StatusName === "Received")).length;
    const pending = documents[0].filter(doc => doc.StatusName === 'Pending Review').length;
    const approved = documents[0].filter(doc => doc.StatusName === 'Approved').length;
    const returned = documents[0].filter(doc => doc.StatusName === 'Rejected').length;

    doc.fontSize(10);
    doc.text(`Document Counts for dispatched or received Documents:`);
    doc.text(`Total Circulars: ${circulars}`);
    doc.text(`Total Notices: ${notices}`);
    doc.text(`Total Letters: ${letters}`);
    doc.text(`Total Bills: ${bills}`);

    doc.moveDown(0.5);
    doc.text(`Document Type Counts for dispatched or received Documents:`);
    doc.text(`Total Document Count: ${documents[1][0].TotalDocuments}`);
    doc.text(`Total Inward Documents: ${inward}`);
    doc.text(`Total Outward Documents: ${outward}`);

    doc.moveDown(0.5);
    doc.text(`Document Status Counts:`);
    doc.text(`Pending Documents: ${pending}`);
    doc.text(`Approved Documents: ${approved}`);
    doc.text(`Rejected Documents: ${returned}`);
    doc.moveDown(1);

    // Table header
    doc.fontSize(12).text("Document Details", { underline: true });
    doc.moveDown(0.5);

    const headers = [
      { text: "ID", width: 10 },
      { text: "Type", width: 15 },
      { text: "Date", width: 25 },
      { text: "Document SrNo", width: 30 },
      { text: "Name", width: 45 },
      { text: "Sender", width: 53 },
      { text: "Receiver", width: 60 },
      { text: "Status", width: 64 },
    ];

    const addTableHeader = () => {
      const tableX = 40;
      const tableY = doc.y;
      headers.forEach((header, index) => {
        doc.fontSize(8).text(header.text, tableX + index * header.width + 5, tableY + 5);
      });
      doc.moveDown(0.5);
    };

    let srno = 1;
    const addTableRow = (row) => {
      const tableX = 40;
      const tableY = doc.y;
      const rowData = [
        srno++,
        row.IsInward ? "Inward" : "Outward",
        new Date(row.DispatchedDateTime).toLocaleDateString(),
        row.DocumentSerialNumber,
        (row.DocumentName || '').slice(0, 17),
        row.SenderName,
        row.ReceiverName,
        row.StatusName,
      ];

      rowData.forEach((cell, index) => {
        doc.fontSize(8).text(cell, tableX + index * headers[index].width + 5, tableY + 5);
      });

      doc.moveDown(0.5);
    };

    // Draw initial header
    addTableHeader();

    // Paginated rows
    documents[0].forEach((row) => {
      const spaceLeft = doc.page.height - doc.y - doc.page.margins.bottom;

      if (spaceLeft < 20) {
        doc.addPage();
        drawPageBorder();      // 👉 Draw border on every new page
        addTableHeader();      // Redraw header
      }

      addTableRow(row);
    });

    // Footer section
    doc.moveDown(10);
    doc.fontSize(11);
    doc.x = 40;
    doc.text("Conclusion:", { bold: true });
    doc.text("This report provides a comprehensive overview of the document management system within the organization. It analyzes document types, statuses, and key performance indicators. The data presented can be used to identify areas for improvement and enhance overall document processing efficiency.");
    doc.moveDown(2);

    doc.fontSize(10);
    doc.text("Authorized Signature: ______________________", { align: "left" });
    doc.text("Date: ______________________", { align: "left" });
    doc.moveDown(2);

    doc.end();

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
