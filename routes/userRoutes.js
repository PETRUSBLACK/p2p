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
userRoutes.get("/profile", isLoggedIn, userProfile);

//forget password
userRoutes.post("/forget-password", forgetPasswordCtr)
//reset password
userRoutes.post("/reset-password", resetPasswordCtr)
//upload profile photo
userRoutes.post("/profile-image", isLoggedIn, upload.single("profile"), profilePhotoUploadCtrl)
//update userProfile
userRoutes.put("/update-profile/:id", isLoggedIn, updateUserProfile)
//admin update user
userRoutes.put("/admin-update-user/:id", isLoggedIn, isAdmin, adminUpdateUserProfile)

export default userRoutes;
