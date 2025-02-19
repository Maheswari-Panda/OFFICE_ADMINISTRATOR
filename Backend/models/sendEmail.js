const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, username, password, link) => {
  try {
    let transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject:
        "Welcome to Office Administrator Portal - Your Account Has Been Created ",
      text: `Dear User,

We are pleased to inform you that your account has been successfully created on the Office Administrator Portal. You can now log in and access the platform using the credentials provided during registration.  

Login Details:
- Login here: ${link}
- Username: ${username}
- Password: ${password}

For security reasons, we recommend updating your password after your first login. If you encounter any issues or require assistance, please do not hesitate to contact our support team at ${from}.  

Welcome! We look forward to serving you.  

Best regards,  
Office Administrator
msu.officeadministrator.ac.in
`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendEmailForForgetPassword = async (to, username, link) => {
  try {
    let transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Office Administrator - Password Reset Link",
      text: `Dear User,

Click the below link to crete your new password within 5 minutes.

Username: ${username}

Reset Password: ${link}

Please change your password to proceed.

For security reasons, we recommend updating your password after your first login. If you encounter any issues or require assistance, please do not hesitate to contact our support team at ${from}.  

Welcome! We look forward to serving you.  

Best regards,  
Office Administrator
msu.officeadministrator.ac.in`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail, sendEmailForForgetPassword };
