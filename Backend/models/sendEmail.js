const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, username, password, link) => {
    try {
        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Your Account Has Been Created',
            text: `Hello,

Your account has been successfully created.

Username: ${username}
Password: ${password}

Login here: ${link}

Please change your password after logging in.

Best Regards,
Admin`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendEmailForForgetPassword = async (to, username, link) => {
    try {
        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Office Administrator Password Reset Link',
            text: `Hello,

Click the below link to crete your new password.

Username: ${username}

Reset Password: ${link}

Please change your password to proceed.

Best Regards,
Admin`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = {sendEmail,sendEmailForForgetPassword};
