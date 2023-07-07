import User from "../models/user";
import { signinSchema, signupSchema } from "../schemas/auth";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const { JWT_KEY, JWT_TOKEN_TIME } = process.env;
export const signup = async (req, res) => {
  try {
    const { error } = await signupSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        error: error.details.map((err) => err.message),
      });
    }
    const userExist = await User.findOne({
      email: req.body.email,
    });
    if (userExist) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashPassword;
    const user = await User.create(req.body);
    user.password = undefined;
    return res.status(200).json({
      message: "Create account success",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
export const signin = async (req, res) => {
  try {
    const { error } = await signinSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        error: error.details.map((err) => err.message),
      });
    }
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu không chính xác",
      });
    }
    user.password = undefined;
    const token = await Jwt.sign({ id: user.id }, JWT_KEY, {
      expiresIn: JWT_TOKEN_TIME,
    });
    return res.status(200).json({
      message: "Signed successfully",
      accessToken: token,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
export const verifyToken = async (req, res) => {
  try {
    const token = req.params.id;
    const isMatch = await Jwt.verify(token, JWT_KEY);
    const user = await User.findById(isMatch.id);
    // console.log(user);
    if (!user) {
      return res.status(403).json({
        message: "Token undefined",
      });
    }
    if (user.role == "member") {
      return res.status(200).json({
        message: "Role member",
        user,
      });
    }
    if (user.role == "admin") {
      return res.status(200).json({
        message: "Role admin",
        user,
      });
    }
    return res.status(403).json({
      message: "Token error",
      token: req.params.id,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
