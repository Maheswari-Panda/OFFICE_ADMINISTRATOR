const nodemailer = require("nodemailer");
require("dotenv").config();

// Setup transporter once
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Account Creation Email
const sendEmail = async (to, username, password, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Welcome to Office Administrator Portal - Your Account Has Been Created",
    text: `Dear User,

We are pleased to inform you that your account has been successfully created on the Office Administrator Portal. You can now log in and access the platform using the credentials provided during registration.

Login Details:
- Login here: ${link}
- Username: ${username}
- Password: ${password}

For security reasons, we recommend updating your password after your first login. If you encounter any issues or require assistance, please do not hesitate to contact our support team at ${process.env.EMAIL_USER}.

Welcome! We look forward to serving you.

Best regards,  
Office Administrator  
msu.officeadministrator.ac.in`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Account creation email sent to ${to}`);
};

// 2. Forgot Password Email
const sendEmailForForgetPassword = async (to, username, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Office Administrator - Password Reset Link",
    text: `Dear User,

Click the below link to create your new password within 5 minutes.

Username: ${username}

Reset Password: ${link}

For security reasons, we recommend updating your password after your first login. If you encounter any issues or require assistance, please do not hesitate to contact our support team at ${process.env.EMAIL_USER}.

Best regards,  
Office Administrator  
msu.officeadministrator.ac.in`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Forgot password email sent to ${to}`);
};

// 3. Document Received Email
const sendDocumentReceivedEmail = async (to, documentName, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to:'maheswaripanda3@gmail.com', // just remove to: '', -> only to, and it will work for given email input for now its  sending the email to mentioned email
    subject: "Document Received - Office Administrator Portal",
    text: `Dear User,

We have successfully received your document titled "${documentName}". Our team will review the submission shortly.

Track status here: ${link}

Thank you,  
Office Administrator  
msu.officeadministrator.ac.in`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Document received email sent to ${to}`);
};

// 4. Document Rejected Email
const sendDocumentRejectedEmail = async (to, documentName, link, reason) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to:'maheswaripanda3@gmail.com',
    subject: "Document Rejected - Office Administrator Portal",
    text: `Dear User,

Your document titled "${documentName}" has been rejected.

Reason: ${reason}

Please review and resubmit it here: ${link}

Best regards,  
Office Administrator  
msu.officeadministrator.ac.in`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Document rejected email sent to ${to}`);
};

// 5. Document Approved Email
const sendDocumentApprovedEmail = async (to, documentName, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to:'maheswaripanda3@gmail.com',
    subject: "Document Approved - Office Administrator Portal",
    text: `Dear User,

We are pleased to inform you that your document titled "${documentName}" has been approved.

View or download it here: ${link}

Thank you,  
Office Administrator  
msu.officeadministrator.ac.in`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Document approved email sent to ${to}`);
};

// 6. Document Dispatched Email
const sendDocumentDispatchedEmail = async (to, documentName, link, dispatchDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to:'maheswaripanda3@gmail.com',
    subject: "Document Dispatched - Office Administrator Portal",
    text: `Dear User,

Your document titled "${documentName}" has been dispatched.

Dispatch Details: ${dispatchDetails}

Track it here: ${link}

Regards,  
Office Administrator  
msu.officeadministrator.ac.in`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Document dispatched email sent to ${to}`);
};

// 7. Updated Document Resent for Approval Email
const sendUpdatedDocumentResentEmail = async (to, documentName, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to:'maheswaripanda3@gmail.com',
    subject: "Document Resubmitted for Approval - Office Administrator Portal",
    text: `Dear User,

Your updated document titled "${documentName}" has been successfully re-sent for approval.

Track status here: ${link}

Regards,  
Office Administrator  
msu.officeadministrator.ac.in`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Updated document re-sent email sent to ${to}`);
};

// 8. Pending Document Email
const sendPendingDocumentEmail = async (to, documentName, link, pendingReason) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to:'maheswaripanda3@gmail.com',
    subject: "Document Status - Pending Review",
    text: `Dear User,

Your document titled "${documentName}" is currently marked as pending.

Reason: ${pendingReason}

You can view and track the document here: ${link}

If further action is needed, kindly address it promptly.

Best regards,  
Office Administrator  
msu.officeadministrator.ac.in`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Pending document email sent to ${to}`);
};

// 9. Request for Approval Email
const sendRequestForApprovalEmail = async (to, approverName, documentName, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to:'maheswaripanda3@gmail.com',
    subject: "Approval Required - Document Submission",
    text: `Dear ${approverName},

A document titled "${documentName}" is awaiting your approval.

Please review and take necessary action here: ${link}

Your prompt attention is appreciated.

Best regards,  
Office Administrator  
msu.officeadministrator.ac.in`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Request for approval email sent to ${to}`);
};

// 3. Document Received Email
const sendDocumentReceivedEmailToOfficeAdmin = async (to, documentName, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to:'maheswaripanda3@gmail.com',
    subject: "Document Received - Office Administrator Portal",
    text: `Dear Admin,

We have successfully received the document titled "${documentName}". Please take a look and instruct for next steps.

Login here to view document: ${link}

Thank you,  
Office Administrator  
msu.officeadministrator.ac.in`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Document received email sent to admin email : ${to}`);
};


module.exports = {
  sendEmail,
  sendEmailForForgetPassword,
  sendDocumentReceivedEmail,
  sendDocumentRejectedEmail,
  sendDocumentApprovedEmail,
  sendDocumentDispatchedEmail,
  sendUpdatedDocumentResentEmail,
  sendPendingDocumentEmail,
  sendRequestForApprovalEmail,
  sendDocumentReceivedEmailToOfficeAdmin
};
