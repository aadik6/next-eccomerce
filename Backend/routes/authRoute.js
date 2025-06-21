const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  refreshToken,
  googleLogin,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refreshToken", refreshToken);
router.post("/googleLogin",googleLogin);
module.exports = router;
