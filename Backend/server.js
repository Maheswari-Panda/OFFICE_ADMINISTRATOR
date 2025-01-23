const express = require('express');
const cors = require('cors');
const config = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user',require('./routes/user'))
app.use('/api/office',require('./routes/office'))

app.get('/',(req,res)=>{
    return res.json("Hi i am backend");
})

app.listen(3000,()=>{
    console.log("The server has started");
})