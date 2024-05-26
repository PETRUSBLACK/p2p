import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import isAdmin from "../middleware/isAdmin.js";
import { otpVerification, 
    loginUserContrl, 
    userProfile, 
    registerUser, 
    updatePassword, 
    resendOTP, 
    forgetPasswordCtr, 
    resetPasswordCtr, 
    updateUserProfile, 
    profilePhotoUploadCtrl, 
    adminUpdateUserProfile} from "../controllers/userController.js"
import multer from "multer";
import storage from "../config/profilePhotoUpload.js";


const upload = multer({storage})


const userRoutes = express.Router();

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Create otp for user registration
 *     description: This is the endpoint to create an otp for a user which the user will verify and be registered succesfully
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: Please check your email and sms for your otp's
 *       '400':
 *         description: Bad request. Invalid email format.
 *       '409':
 *         description: Conflict. User with provided email already exists.
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         fullname:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 */

userRoutes.post("/register", registerUser);

/**
 * @swagger
 * /api/v1/users/verifyotp:
 *   post:
 *     summary: Verify OTP for user registration
 *     description: Verify OTP sent during user registration process.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOTP:
 *                 type: string
 *               smsOTP:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Otp verified succesfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid OTP provided
 *       '500':
 *         description: Internal server error
 */

userRoutes.post("/verifyotp", otpVerification);

/**
 * @swagger
 * /api/v1/users/resendOtp:
 *   put:
 *     summary: Resend OTP
 *     description: Resend OTP for user registration process.
 *     tags:
 *       - users
 *     parameters:
 *       - name: oldOtp
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: 6082347c71d89200154eaad4
 *       - name: resendEmailOTP
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
 *       - name: resendSmsOTP
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *           example: false
 *     responses:
 *       '200':
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: John Doe please check your email for your new otp
 *       '404':
 *         description: Otp not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Otp not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

userRoutes.put('/resendOtp', resendOTP)
userRoutes.put("/update-password", isLoggedIn, updatePassword);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate and log in a user.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginPayload'
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *               user:
 *                 userId: 123
 *                 fullName: John Doe
 *                 email: john.doe@example.com
 *       '400':
 *         description: Invalid input or credentials
 *       '401':
 *         description: Unauthorized - Invalid credentials
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     LoginPayload:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         username:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *           format: password
 *       required:
 *         - email || username || phone
 *         - password
 */

userRoutes.post("/login", loginUserContrl);


// /**
//  * @swagger
//  * /api/v1/users/profile:
//  *   get:
//  *     summary: Retrieve user profile
//  *     security:
//  *       - ApiKeyAuth: []
//  *       - bearerAuth: []
//  *       - customHeaderAuth: []
//  *     responses:
//  *       200:
//  *         description: A user profile
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: string
//  *                   description: The user ID
//  *                 name:
//  *                   type: string
//  *                   description: The user's name
//  *                 email:
//  *                   type: string
//  *                   description: The user's email
//  *       401:
//  *         description: Unauthorized
//  */

userRoutes.get("/profile", isLoggedIn, userProfile);



/**
 * @swagger
 * /api/v1/users/forget-password:
 *   post:
 *     summary: Create new password if user forget their password
 *     description: This endpoint enable user create new password which an email will be send to the user to click an reset password.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset sent successfully to your email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Password reset sent successfully to your email
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid or the link expired
 *       '500':
 *         description: Internal server error
 */

//forget password
userRoutes.post("/forget-password", forgetPasswordCtr)



/**
 * @swagger
 * /api/v1/users/reset-password:
 *   post:
 *     summary: Confirm the link send to your email
 *     description: Click the link send to your email to complete password reset process.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: password updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid or the link expired
 *       '500':
 *         description: Internal server error
 */

//reset password
userRoutes.post("/reset-password", resetPasswordCtr)



/**
 * @swagger
 * /api/v1/users/update-profile/{id}:
 *   post:
 *     summary: Upload profile photo
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile_img:
 *                 type: string
 *                 format: binary
 *                 id:
 *                   type: string
 *                   description: The user ID
 *     responses:
 *       200:
 *         description: Profile photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 filePath:
 *                   type: string
 *                   description: Path of the uploaded file
 *                 id:
 *                   type: string
 *                   description: ID of the logged-in user
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

//upload profile photo
userRoutes.post("/profile-image/", isLoggedIn, upload.single("profile"), profilePhotoUploadCtrl)





//update userProfile
userRoutes.put("/update-profile/:id", isLoggedIn, updateUserProfile)


//admin update user
userRoutes.put("/admin-update-user/:id", isLoggedIn, isAdmin, adminUpdateUserProfile)

export default userRoutes;
