import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../util/generateToken.js";
import verifyToken from "../util/verifyToken.js";
import OTP from "../models/OTP.js";
import { generateEmailOTP, generateSmsOTP } from "../util/generateOtp.js";

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

  const generatedOTP = Math.floor(100000 + Math.random() * 900000);

  const emailOTP = await generateEmailOTP(email)
  const smsOTP = await generateSmsOTP(phone)

  const otp = await OTP.create({
    email,
    phone,
    otp: {
      emailOTP: emailOTP,
      smsOTP: smsOTP
    }
  });

  const user = await User.create({
    fullname,
    email,
    phone,
  });

  res.status(201).json({
    status: "success",
    message: "Move to the next registeration process",
    data: { user, token: generateToken(user._id), otp },
  });
});

export const otpVerification = asyncHandler(async (req, res) => {
  const { emailOTP, smsOTP } = req.body;

  const otpData = await OTP.findOne({ 'otp.emailOTP': emailOTP, 'otp.smsOTP': smsOTP }).exec();

  if (otpData) {
    await OTP.deleteOne(otpData);

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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.findByIdAndUpdate(decoded.id, { username, password: hashedPassword }, { new: true })

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ message: 'Step 2 completed successfully', user });
})

export const loginUserContrl = asyncHandler(async (req, res) => {
  const { email, username, phone, password } = req.body;

  const userFound = await User.findOne({ $or: [{ email }, { username }, { phone }] });
  console.log(userFound)

  if(!userFound.password){
    throw new Error("Complete your registration process, your account has no password")
  }

  if (userFound && bcrypt.compare(password, userFound.password)) {
    res.json({
      status: "success",
      message: "User logged in successfully",
      userFound,
      token: generateToken(userFound._id),
    });
  } else {
    throw new Error(`Invalid email or password`);
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
