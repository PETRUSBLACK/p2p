import User from "../models/User.js";
import Coin from "../models/coin.js";
import Wallet from "../models/Wallet.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { generateOTP, generateSmsOTP } from "../util/generateOtp.js";
import { generateToken, verifyToken } from "../util/jwtUtils.js";
import sendEmail from "../util/emailUtil.js";
import jwt from 'jsonwebtoken'

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

  const otp = await generateOTP(email)

  const user = {
    fullname,
    email,
    phone,
    password
  }

  const generatedOTP = await OTP.create({ user, otp });

  res.status(201).json({
    status: "success",
    message: `Please check your email or sms ${user.fullname} for your otp`,
    otpIdForResendingOtp: generatedOTP._id
  });
});

export const otpVerification = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const otpData = await OTP.findOne({ otp });

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
    initializeUserWallet(user._id);

    res.status(200).json({
      status: "success",
      message: "Otp verified succesfully",
      user,
    })
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid or expired Otp, please resend"
    });
  }
})

export const resendOTP = asyncHandler(async (req, res) => {
  const { oldOtp } = req.body
  const otp = await OTP.findById(oldOtp)

  if (!otp) {
    res.status(404).json({ message: "Otp not found" })
  }

  const newOtp = await generateOTP(otp.user.email);

  // update otp field in previous otp
  otp.otp = newOtp;

  await otp.save();

  res.status(200).json({
    status: true,
    message: `${otp.user.fullname} please check your email or sms for your new otp`
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

  if (!password) {
    return res.status(400).json({ message: "Password field should not be empty" });
  }

  const userFound = await User.findOne({ $or: [{ email }, { username }, { phone }] });

  if (!userFound) {
    return res.status(404).json({ message: "Invalid email, username or phonenumber" });
  }

  if (!userFound.password) {
    throw new Error("Continue with google, your account has no password")
  }

  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: "success",
      message: "User logged in successfully",
      userFound,
      token: generateToken(userFound._id),
    });
  } else {
    throw new Error(`Invalid email, username or phonenumber and password`);
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



//FORGET PASSWORD
export const forgetPasswordCtr = asyncHandler(async(req, res) => {
    
      const {email} = req.body;
      //check if email is valid
      const user = await User.findOne({email});
      if(!user){
        throw new Error(`user with ${email} does not exist`)
      }

      //generate a reset token
      const resetToken = jwt.sign({userId: user._id}, process.env.JWT_KEY,{
        expiresIn:'1h'
      })

      //set the  reset token and its expiration on the user obj

      user.resetToken = resetToken;
      user.reseTokenExpiration = Date.now() + 3600000;
      
      user.save()
      //send password reset email
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      const html = `<h3>RESET PASSWORD</h3><br/> Below is the link to reset your password<br>This link only valid for 1 hour, please do not share with anyone<hr/><br/>click <strong><a href='${resetUrl}'>here</a></strong> to reset your password</p><p>Having any issue? kindly contact our support team</p>`
      await sendEmail(user.email,'Reset Your Password', html);

      //console.log(resetUrl);

      res.status(200).json({
        status:"success",
        message:`Password reset sent successfully to your email ${user.email}` 
      });

  })



  //RESET PASSWORD
  export const resetPasswordCtr = asyncHandler(async(req, res) => {
    
      const {resetToken,password} =req.body;
      //find the user with token
      const user = await User.findOne({
        resetToken,
        reseTokenExpiration: {$gt: Date.now()},
      })

      if(!user){
        throw new Error('Invalid or the link expired')
      }

      //hash
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password,salt);

      //Update user obj
      user.password = hashPassword;
      user.resetToken = undefined;
      user.reseTokenExpiration = undefined

      await user.save();

      res.status(200).json({
        status:"success",
        message:"Your password reset successfully"
      });

      const html = `<h3>success</h3><br/> <p>Your password changed successfully</p>`
      await sendEmail(user.email,'Password Message', html);

  })

