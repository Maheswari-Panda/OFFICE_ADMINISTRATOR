const sql = require('mssql');

const config = {
    user:"aop",
    password:"@Aop#2025",
    server:`LAPTOP-TCJM5V77`,
    database:"OfficeAdministrator",
    options:{
        trustServerCertificate: true,
        trustedConnection:false,
        enableArithAbort:true,
        instancename:"SQLEXPRESS",
    },
    port:1433
}

// Function to create a pool of connections
async function getPool() {
    try {
      const pool = await sql.connect(config);
      return pool;
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }
  }
  
  module.exports = {
    getPool,config
  };