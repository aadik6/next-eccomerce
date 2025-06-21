const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: '15m' }
  );
}
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (error) {
    return null;
  }

}
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};