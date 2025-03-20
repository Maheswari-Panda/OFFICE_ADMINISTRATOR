const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');

router.get('/sign-pdf', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;

    const pdfUrl = 'http://localhost:3000/uploads/Documents/1742383501770.pdf';
    const signatureImageUrl = 'https://upload.wikimedia.org/wikipedia/en/b/bf/Msu_baroda_logo.png';


    const pdfResponse = await fetch(pdfUrl);
    const pdfBytes = await pdfResponse.arrayBuffer();

    const sigResponse = await fetch(signatureImageUrl);
    const signatureBytes = await sigResponse.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const sigImage = await pdfDoc.embedPng(signatureBytes);
    const page = pdfDoc.getPages()[0];

    page.drawImage(sigImage, { x: 400, y: 100, width: 120, height: 50 });

    const signedPdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="signed-document.pdf"');
    res.send(Buffer.from(signedPdfBytes));
  } catch (err) {
    console.error('Error signing PDF:', err);
    res.status(500).send('Error generating signed PDF');
  }
});

module.exports = router;
