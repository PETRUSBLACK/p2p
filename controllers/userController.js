import User from "../models/User.js";
import Coin from "../models/coin.js";
import Wallet from "../models/Wallet.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { generateEmailOTP, generateSmsOTP } from "../util/generateOtp.js";
import { generateToken, verifyToken } from "../util/jwtUtils.js";

let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, phone, password } = req.body;

  if (!(fullname && email && phone && password)) {
    return res.status(400).json({ "error": "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ "error": "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ "error": "Invalid password format" });
  }

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const emailOTP = await generateEmailOTP(email)

  const user = {
    fullname,
    email,
    phone,
    password
  }

  const otp = await OTP.create({
    user,
    otp: {
      emailOTP: emailOTP,
      smsOTP: emailOTP
    }
  });

  res.status(201).json({
    status: "success",
    message: `Please check your email and sms ${user.fullname} for your otp's`,
    otpIdForResendingOtp: otp._id
  });
});

export const otpVerification = asyncHandler(async (req, res) => {
  const { emailOTP, smsOTP } = req.body;

  const otpData = await OTP.findOne({ 'otp.emailOTP': emailOTP, 'otp.smsOTP': smsOTP }).exec();

  if (otpData) {
    const userData = otpData.user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = await User.create({
      fullname: userData.fullname,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone
    })

    await OTP.findByIdAndDelete(otpData._id);
    initializeUserWallet(user._id)

    res.status(200).json({
      status: "success",
      message: "Otp verified succesfully",
      user,
    })
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid Otp"
    });
  }
})

export const resendOTP = asyncHandler(async (req, res) => {
  const { oldOtp, resendEmailOTP, resendSmsOTP } = req.body
  
  const otp = await OTP.findById(oldOtp)

  if(!otp){
    res.status(404).json({ message: "Otp not found"})
  }

  const emailOtp = await generateEmailOTP(otp.user.email);

  if(resendEmailOTP){
    otp.otp.emailOTP = emailOtp
  }

  if(resendSmsOTP){
    otp.otp.smsOTP = emailOtp
  }

  await otp.save();

  res.status(200).json({
    status: true,
    message: resendEmailOTP ? `${otp.user.fullname} please check your email for your new otp` : `${otp.user.fullname} please check your sms for your new otp`
  })
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!passwordRegex.test(newPassword) || newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "New password is invalid or does not match the confirmation" });
  }

  try {
    const user = await User.findById(req.userAuth);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    const updatedUser = await user.save();

    res.status(201).json({ message: "Password updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating Password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

export const loginUserContrl = asyncHandler(async (req, res) => {
  const { email, username, phone, password } = req.body;

  const userFound = await User.findOne({ $or: [{ email }, { username }, { phone }] });

  if (!userFound.password) {
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


async function initializeUserWallet(userId) {
  try {
    const allCoins = await Coin.find();

    const walletCoins = allCoins.map(coin => ({
      coin: coin._id,
      quantity: 0,
      totalCoinValue: 0
    }));

    const wallet = await Wallet.create({
      userId: userId,
      coins: walletCoins
    })

    if (!wallet) {
      return res.status(500).json({ "error": "Failed to create user wallet" })
    }
  } catch (error) {
    console.error('Error initializing user wallet:', error.message);
    throw error;
  }
}
