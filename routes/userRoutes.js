import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import isAdmin from "../middleware/isAdmin.js";
import { 
    otpVerification, 
    registerUserLevel1, 
    registerUserLevel3, 
    loginUserContrl, 
    userProfile } from "../controllers/userController.js"


const userRoutes = express.Router();

/**
 * @swagger
 * /api/v1/users/register/l1/:
 *   post:
 *     summary: Register user
 *     description: This is the endpoint to register a user
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
 *         description: User created successfully
 *       '400':
 *         description: Invalid input
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 */

userRoutes.post("/register/l1", registerUserLevel1);

/**
 * @swagger
 * /api/v1/users/register/l2/:
 *   post:
 *     summary: Send OTP to email
 *     description: Endpoint to send OTP to the provided email address.
 *     tags: [OTP]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request, email is missing
 */

userRoutes.post("/register/l2", otpVerification);

/**
 * @swagger
 * /api/v1/users/register/l3:
 *   post:
 *     summary: Register a new user with token
 *     description: Endpoint to register a new user with a token, username, password, and confirm password.
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - token
 *               - username
 *               - password
 *               - confirmPassword
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request, missing fields or passwords don't match
 */

userRoutes.post("/register/l3", registerUserLevel3);


/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Log in a user
 *     description: Endpoint to log in a user with username or email or phone and password.
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usernameOrEmailOrPhone:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - usernameOrEmailOrPhone
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request, missing fields or invalid credentials
 */

userRoutes.post("/login", loginUserContrl);

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get User Profile
 *     description: Retrieve the user's profile information.
 *     tags:
 *       - users
 *     security:
 *       - bearerAuth: []  # Assumes Bearer token authentication
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               userId: 123
 *               fullName: John Doe
 *               email: john.doe@example.com
 *       '401':
 *         description: Unauthorized - Bearer token is missing or invalid
 *       '403':
 *         description: Forbidden - User does not have access
 *       '404':
 *         description: User not found
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


userRoutes.get("/profile", isLoggedIn, userProfile);

export default userRoutes;
