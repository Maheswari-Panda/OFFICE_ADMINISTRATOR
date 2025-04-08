const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require('../models/userModel'); // Import the user model
const bcrypt = require('bcryptjs');
var fetchUser = require('../middleware/fetchUser'); // Middleware for fetching logged-in user
const authorizeRole = require('../middleware/roleMiddleware');
require('dotenv').config({ path: '../Backend/.env.local' });
var jwt = require('jsonwebtoken');

const multer = require('multer');
const path = require('path');

const {sendEmail,sendEmailForForgetPassword} = require('../models/sendEmail'); 
const {addUserLog} = require('../models/userLogModel');
const { hostname } = require('os');

const storage = multer.diskStorage({
    destination: './uploads/UserProfiles', // Folder to store uploaded files
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    },
});
  
  
const upload = multer({ storage });

const storageForSignature = multer.diskStorage({
    destination: './uploads/Signatures', // Folder to store uploaded files
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    },
});

  
const uploadSign = multer({ storage : storageForSignature });

// Route 1 : to create a new user : POST "/api/user/create" .No login required
router.post('/create', [
    body("firstName").isLength({ min: 3 }),
    body("middleName").isLength({ min: 3 }).optional(),
    body("lastName").isLength({ min: 3 }),
    body("role").isLength({ min: 3 }),
    body("ERN").isLength({ min: 10,max:10}),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("officeId").isLength({min:1,max:9})
], async (req, res) => {
    try {
        // If there are any errors return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // If user with the same email already exists, return bad request
        let user = await userModel.isUserEmailExists(req.body.email);
        if (user) {
            return res.status(400).json({ error: "Sorry, a user with this email already exists" });
        }

        // Destructure the user details from the request body
        const { email, password,ERN, firstName, middleName, lastName, role,officeId,profileImgUrl } = req.body;
        
        // Make password secure with salt & pepper
        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(password, salt);

        // Call the createUser function from the model
        let userId = await userModel.createUser(email, securedPassword,ERN, firstName, middleName, lastName, role,officeId,profileImgUrl);

            const data = {
                user: {
                    userId: userId,
                    userEmail:email,
                    role:role,
                }
            };
            const accessToken = await userModel.generateAccessToken(data);
    
            // work on it it doesn't working for create user
            const result = await addUserLog(userId,'User Created');

        // it's working whenever an user being created the mail will be sent to the user
        
        const username = email; // Using email as username
        const userPassword = password; // Default password
        const loginLink = "http://localhost:5173"; // Adjust based on your frontend

        // Send email after user is created
        await sendEmail(email, username, userPassword, loginLink);

        console.log('User created successfully, email sent!');
            
            res.status(201).json({ accessToken});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create user' });
    }
});

// ROUTE 2 : User login : POST "/api/user/login" . Login required
router.post('/login', [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
], async (req, res) => {
    try {
        // If there are any errors return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructure the user details from the request body
        const { email, password } = req.body;

        // If user with the email does not exist, return bad request
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        // Compare entered password with hashed stored password in the database
        const passwordCompare = await bcrypt.compare(password, user.Password);
        if (!passwordCompare) {
            const result = await addUserLog(user.UserId,'Login Failed');
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        
        const data = {
            user: {
                userId: user.UserId,
                userEmail:user.Email,
                role:user.Role,
            }
        };
        
        const accessToken = await userModel.generateAccessToken(data);
        if(accessToken){
            const result = await addUserLog(user.UserId,'Logged In');
            // console.log("User Log table details added ",result);
        }
        res.status(201).json({ accessToken});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route 3 : to get logged-in user details by : POST "/api/user/getuser" Login required
router.post('/getuser', fetchUser,authorizeRole("Admin","User","user","admin","SuperAdmin"), async (req, res) => {
    try {
        // Get the logged-in user id from the token
        const userId = req.user.userId;
        const user = await userModel.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user details
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
});

// Route 4: to update user details by : PUT '/api/user/update/:userId' . Login required
router.put('/update/:userId', [
    body("firstName").isLength({ min: 3 }),
    body("middleName").isLength({ min: 3 }).optional(),
    body("lastName").isLength({ min: 3 }),
    body("role").isLength({ min: 3 }),
    body("ERN").isLength({ min: 10,max:10}),
    body("email").isEmail(),
    body("officeId").isLength({min:1,max:9})
], fetchUser,authorizeRole("User","Admin","user","admin","SuperAdmin"), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    let givenUserId = userId;
    if(req.params.userId!==userId){
        givenUserId = req.params.userId;
    }
    const { email, ERN,firstName, middleName, lastName, role,officeId,profileImgUrl } = req.body;

    try {

        // Call the updateUser function from the model
        const message = await userModel.updateUser(givenUserId, email, ERN,firstName, middleName, lastName, role,officeId,profileImgUrl);

        const data = {
            user: {
                userId: userId,
                userEmail: email,
                role:role,
            }
        };
        if(message===1){
            // set new access token 
            const accessToken = await userModel.generateAccessToken(data);
            
            const result = await addUserLog(givenUserId,'Profile Updated');
            // Return success response
            res.status(200).json({ accessToken });

        }
        else{
            res.status(400).json({message:'failed to update user database procedure error!'})
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update user' });
    }
});


// Route 4: to Delete user details by : PUT '/api/user/delete/:userId' . Login required
router.delete('/delete/:userId',fetchUser,authorizeRole("Admin","admin","SuperAdmin"), async (req, res) => {
    try {
            // Get the logged-in user id from the token
            const userId = req.params.userId;
            const loggedInUserId = req.user.userId;
            const response = await userModel.deleteUser(userId);
            console.log(response);
            if(response==1){
                
                const result = await addUserLog(loggedInUserId,'Deleted User');
                console.log("inside the response",response);
                res.status(200).json({message:response });
            }
            else{
                res.status(404).json({message: "Error deleting the user with respons_status :"+response});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Failed to delete User',
                error: error.message
            });
        }
});


// Route 6 : to get any user details by user id : POST "/api/user/getuser/:id" Login required
router.post('/getall',fetchUser,authorizeRole("Admin","User","admin","user","SuperAdmin"), async (req, res) => {
    try {
        const user = await userModel.getAllUsers();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user details
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
});

// Route 7 : to get username by user id : POST "/api/user/getusername/:id" Login required
router.post('/get/:id', fetchUser,authorizeRole("Admin","User","user","admin","SuperAdmin"), async (req, res) => {
    try {
        // authetication
        // Get the logged-in user id from the token
        // const userId = req.user.userId;
        
        const requestedUserId=req.params.id;
        const user = await userModel.getUserById(requestedUserId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return the user details
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
});

// Route to handle profile image upload
router.post('/upload', upload.single('profileImg'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ imageUrl: `/uploads/UserProfiles/${req.file.filename}` }); // Send image URL back
  });

// API to Upload Signature Image
router.post("/upload-signature",fetchUser, uploadSign.single("signature"), async (req, res) => {
    try {
      const userId = req.user.userId; // Get the user ID from fetchuser
  
      if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
      }
  
      // Store file path in database
      const imageUrl = `http://localhost:3000/uploads/Signatures/${req.file.filename}`;
  
      const response = await userModel.updateAdminSignature(userId,imageUrl);
      console.log(response);
      if(response){
        return res.status(200).json({ message: "Signature uploaded successfully", imageUrl });
      }
      else {
        return res.status(500).json({ message: "Failed to update signature in database" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error uploading signature" });
    }
  });

router.post('/forgetpassword',[body("email").isEmail()],async (req, res) => {
    try {
        // If there are any errors return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // If user with the same email already exists, return bad request
        let user = await userModel.isUserEmailExists(req.body.email);
        if (!user) {
            return res.status(400).json({ error: "Sorry, a user with this email does not exists" });
        }
        // Destructure the user details from the request body
        const { email } = req.body;

        const userDetails = await userModel.getUserByEmail(email);
        // it's working whenever an user being created the mail will be sent to the user
        
        const username = email; // Using email as username
        const data={
            userId:userDetails.UserId,
            email:email
        }
        const token = await userModel.generateResetPasswordLink(data);
        const resetPasswordLink = `http://localhost:5173/resetpassword/${encodeURIComponent(token)}`;

        // Send email after user is created
        await sendEmailForForgetPassword(email, username, resetPasswordLink);

        console.log('User reset password link sent successfully, email sent!');
        res.status(201).json({ message:'User reset password link sent successfully, email sent!'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send email to user for reset password' });
    }
})

router.put('/updatepassword', async (req, res) => {
    try {
        const { userId,email, newPassword } = req.body;

        // Check if user exists
        const user = await userModel.isUserEmailExists(email);
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(newPassword, salt);

        // Update password in database
        const response = await userModel.updateUserPassword(userId,email,securedPassword);
        
        if(response){
            const result = await addUserLog(userId,'Password Updated');
            res.status(200).json({ message: "Password updated successfully" });
        }
        else{
            res.status(500).json({ message: "Error in response updatePassword" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.post('/verify-reset-link', async (req, res) => {
    const { token } = req.query;

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_PASSWORD_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: "The reset link has expired or is invalid." });
        }

        // Token is valid, proceed with password reset
        const { email, userId } = decoded;
        
        // Check if the user exists in the database
        const user = await userModel.isUserEmailExists(email);
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // If everything is valid, allow password reset
        res.status(200).json({ message: "Token is valid. You can reset your password now.", email, userId });
    });
});


router.post('/getall/:officeId',fetchUser,authorizeRole("Admin","admin","SuperAdmin"), async (req, res) => {
    try {
        const user = await userModel.getUsersByOfficeId(req.params.officeId);

        if (!user) {
            return res.status(404).json({ message: 'User of this office not found' });
        }

        // Return the user details
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user of this office' });
    }
});

module.exports = router; // Export the router
