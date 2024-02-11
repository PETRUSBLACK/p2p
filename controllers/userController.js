import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../util/generateToken.js";
import obtainTokenFromHeaders from "../util/obtainTokenFromHeader.js";
import verifyToken from "../util/verifyToken.js";

export const registerUserContrl = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  //check if user already exists

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    //handling error

    return res.status(409).json({ message: "Email already in use" });
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: user,
  });
});

//login

export const loginUserContrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: "success",
      message: "User logged in successfully",
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error("invalid login details");
  }
  //   res.json({
  //       status:"fail",
  //       message:"Invalid login details "
  //   })
});

export const userProfile = asyncHandler(async (req, res) => {
  const userFound = await User.findById(req.userAuth);
  // console.log(req.auth);
  

  res.json({
    status: "success",
    message: "User profile fetched successfully",
    userFound
    
  });
});
