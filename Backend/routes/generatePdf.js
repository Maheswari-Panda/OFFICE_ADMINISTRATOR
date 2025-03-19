const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

// Route to handle PDF generation
router.post('/html2pdf', async (req, res) => {
    const { htmlContent } = req.body;

    if (!htmlContent) {
        return res.status(400).json({ message: 'Missing HTML content' });
    }

    try {
        const joditStyles = `
    <style>
        /* Import Jodit default styles (adjust if you use custom) */
        @import url('https://cdn.jsdelivr.net/npm/jodit/build/jodit.min.css');

        /* Optional custom fonts (Google Fonts example) */
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
    </style>
`;

const fullHtml = `
    <html>
    <head>
        <meta charset="utf-8">
        <title>Generated PDF</title>
        ${joditStyles}
    </head>
    <body>
        ${htmlContent} <!-- This is your Jodit Editor content -->
    </body>
    </html>
`;

        // const fullHtml = `
        // <!DOCTYPE html>
        // <html>
        //   <head>
        //     <meta charset="utf-8">
        //     <title>Generated PDF</title>
        //     <style>
        //       body { font-family: Arial, sans-serif;}
        //     </style>
        //   </head>
        //   <body>
        //     ${htmlContent}
        //   </body>
        // </html>`;
        
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Adjust as per your system
            headless: true,
        });
        const page = await browser.newPage();

        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await browser.close();

        // Make sure you don't stringify or corrupt the buffer here:
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=document.pdf',
            'Content-Length': pdfBuffer.length,
        });
        res.end(pdfBuffer);

    } catch (error) {
        console.error('PDF generation failed:', error);
        return res.status(500).json({ message: 'PDF generation failed' });
    }
});

module.exports = router;
