const { OAuth2Client } = require("google-auth-library");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/tokens");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.find({ email });
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      picture: "https://www.gravatar.com/avatar/default?s=200",
    });
    const savedUser = await newUser.save();
    const accessToken = generateAccessToken(savedUser);
    const refreshToken = generateRefreshToken(savedUser);
    savedUser.refreshToken = refreshToken;
    await savedUser.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture || "https://www.gravatar.com/avatar/default?s=200",
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const logout = async (req, res) => {
  const  refreshToken = req.cookies.refreshToken  ;
  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token provided" });
  }

  try {
    const user = await userModel.findOne({ refreshToken });
    if (!user) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }
    user.refreshToken = null;
    await user.save();
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const user = await userModel.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const verifiedToken = verifyToken(refreshToken);
    if (!verifiedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    if (user._id.toString() !== verifiedToken.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const newAccessToken = generateAccessToken(user);
    // Generate a new refresh token
    const newRefreshToken = generateRefreshToken(user);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    user.refreshToken = newRefreshToken; // Ensure the refresh token is still valid
    await user.save();
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


const googleLogin = async (req, res) => {
  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ message: "No token provided" });

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    // Find or create user
    let user = await userModel.findOne({ email });
    if (!user) {
      user = new userModel({
        name,
        email,
        password: "google_oauth",
        picture: picture || "https://www.gravatar.com/avatar/default?s=200",
      });
      await user.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture || "https://www.gravatar.com/avatar/default?s=200",
      },
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid Google token" });
  }
};
module.exports = {
  signup,
  login,
  logout,
  refreshToken,
  googleLogin
};
