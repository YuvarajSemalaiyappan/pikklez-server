import express from "express";
import asyncHandler from "express-async-handler";
import { protect, admin } from "../Middleware/AuthMiddleware.js";
import generateToken from "../utils/generateToken.js";
import User from "./../Models/UserModel.js";
import * as UserService from "../Services/UserService.js";


const userRouter = express.Router();

// LOGIN WITH EMAIL OTP
userRouter.post(
  "/send-otp",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    let responseObj = await UserService.verifyUserAndSendMail(email);
    res.status(responseObj.status).json(responseObj.data);
  })
);

// REGISTER USER AND SEND OTP

userRouter.post(
  "/register",
  asyncHandler(async (req, res)=> {
    const { email , mobile, name } = req.body;

    let responseObj = await UserService.registerUserAndSendOTP(email, mobile, name);
    res.status(responseObj.status).json(responseObj.data);
  })
);


// VERIFY OTP AND LOGIN
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    let responseObj = await UserService.verifyOTPForUser(email, otp);
    res.status(responseObj.status).json(responseObj.data);
  })
);


// LOGIN
// userRouter.post(
//   "/login",
//   asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         isAdmin: user.isAdmin,
//         token: generateToken(user._id),
//         createdAt: user.createdAt,
//       });
//     } else {
//       res.status(401);
//       throw new Error("Invalid Email or Password");
//     }
//   })
// );

// REGISTER
userRouter.post(
  "/register-with-otp",
  asyncHandler(async (req, res) => {
    const { name, email,mobile, otp } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      mobile,
      otp,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  })
);

// PROFILE
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// UPDATE PROFILE
userRouter.put(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;

      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// GET ALL USER ADMIN
userRouter.get(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  })
);

export default userRouter;
