const express = require("express");
const passport = require("../config/passport");
const {
  register,
  login,
  getProfile,
  googleAuthSuccess,
  googleAuthFailure,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const {
  registerValidation,
  loginValidation,
  handleValidationErrors,
} = require("../middleware/validation");

const router = express.Router();

router.post("/register", registerValidation, handleValidationErrors, register);

router.post("/login", loginValidation, handleValidationErrors, login);

router.get("/profile", authenticateToken, getProfile);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  googleAuthSuccess
);

router.get("/google/failure", googleAuthFailure);

module.exports = router;
