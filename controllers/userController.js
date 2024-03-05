import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../util/generateToken.js";
import verifyToken from "../util/verifyToken.js";
import nodemailer from 'nodemailer'
import OTP from "../models/OTP.js";

let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const registerUserLevel1 = asyncHandler(async (req, res) => {
  const { fullname, email, phone } = req.body;

  if (!emailRegex.test(email)) {
    return res.status(403).json({ "error": "Email is Invalid" })
  }

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const user = await User.create({
    fullname,
    email,
    phone,
  });

  const token = generateToken(user._id)
  const generatedOTP = Math.floor(100000 + Math.random() * 900000);

  const otp = await OTP.create({
    email,
    otp: generatedOTP.toString()
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP for Login',
    text: `Your OTP for login is: ${generatedOTP}`,
  });

  res.status(201).json({
    status: "success",
    message: "Move to the next registeration process",
    data: { user, token, otp },
  });
});

export const otpVerification = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const otpData = await OTP.findOne({ otp }).exec();

  if (otpData) {
    await OTP.deleteOne({ otp });

    res.status(200).send('OTP verified successfully');
  } else {
    res.status(400).send('Invalid OTP');
  }
})

export const registerUserLevel3 = asyncHandler(async (req, res) => {
  const { token, username, password, confirmPassword } = req.body;

  if (!passwordRegex.test(password)) {
    return res.status(403).json({ "error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  const decoded = verifyToken(token)

  const user = await User.findByIdAndUpdate(decoded.id, { username, password }, { new: true })

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ message: 'Step 2 completed successfully', user });
})

export const loginUserContrl = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const userFound = await User.findOne({
    $or: [
      { email: identifier },
      { username: identifier },
      { phoneNumber: identifier }
    ]
  });

  if (userFound && (await bcrypt.compare(password, userFound.password))) {
    res.json({
      status: "success",
      message: "User logged in successfully",
      userFound,
      token: generateToken(userFound._id),
    });
  } else {
    throw new Error("Invalid email or password");
  }

});

export const userProfile = asyncHandler(async (req, res) => {
  const userFound = await User.findById(req.userAuth);

  res.json({
    status: "success",
    message: "User profile fetched successfully",
    userFound
  });
});
