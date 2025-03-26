const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib'); // <-- You missed this
const path = require('path');
const fs = require('fs');

router.get('/sign-pdf', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;

    const {pdfUrl,signatureImageUrl} = req.query;
    // const signatureImageUrl = 'http://localhost:3000/uploads/Documents/1742543239308.png';

    if (!pdfUrl) {
      return res.status(400).json({ error: 'Document URL is required' });
    }

    const pdfResponse = await fetch(pdfUrl);
    const pdfBytes = await pdfResponse.arrayBuffer();

    const sigResponse = await fetch(signatureImageUrl);
    const signatureBytes = await sigResponse.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const sigImage = await pdfDoc.embedPng(signatureBytes);
    const page = pdfDoc.getPages()[0];

    page.drawImage(sigImage, { x: 400, y: 100, width: 120, height: 50 });

    const signedPdfBytes = await pdfDoc.save();

    // Overwrite the existing file
    const filePath = path.join(__dirname, '../../Backend/uploads/Documents/', path.basename(pdfUrl));

    fs.writeFileSync(filePath, Buffer.from(signedPdfBytes));

    res.status(200).json({ success: true, message: 'Document signed successfully' });
  } catch (err) {
    console.error('Error signing PDF:', err);
    res.status(500).json({ error: 'Error generating signed PDF' });
  }
});

module.exports = router;
