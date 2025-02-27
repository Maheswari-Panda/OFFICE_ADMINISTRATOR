const express = require('express');
const cors = require('cors');
const config = require('./config/db');
require('dotenv').config({ path: '../Backend/.env.local' });
const app = express();
app.use(cors(
    {
        origin: "http://localhost:5173", // Change to your frontend URL
        methods: "GET,POST,PUT,DELETE",
    }
));
app.use(express.json());
const path = require('path');

app.use('/api/user',require('./routes/user'))
app.use('/api/office',require('./routes/office'))
app.use('/api/documentType',require('./routes/documentType'))
app.use('/api/document',require('./routes/document'))
app.use('/api/attachedDocument',require('./routes/attachedDocument'))
app.use('/api/status',require('./routes/status'))
app.use('/api/userLog',require('./routes/userLog'))
app.use('/api/report',require('./routes/report'))
app.use('/api/documentLog',require('./routes/documentLog'))
app.use('/api/feedback',require('./routes/feedback'))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/',(req,res)=>{
    return res.json("Hi i am backend");
})

app.listen(3000,()=>{
    console.log("The server has started");
})

// GENERATE SECRETE KEY
// const crypto = require('crypto');

// function generateSecretKey() {
//   return crypto.randomBytes(32).toString('hex'); 
// }

// const secretKey = generateSecretKey(); 
// console.log('Generated Secret Key:', secretKey); 