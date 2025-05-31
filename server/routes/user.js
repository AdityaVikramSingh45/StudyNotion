const express = require("express");
const router = express.Router();

const {sendOtp, login, signUp, changepassword, changePasswordForMyProfile} = require("../controllers/auth");

const {resetPassword, resetPasswordToken} = require("../controllers/resetPassword");




const {authenticate} = require("../middlewares/auth");


// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)

// Route for sending OTP to the user's email
router.post("/sendotp", sendOtp)

// Route for Changing the password
router.post("/changepassword", authenticate, changepassword)


// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

//Route for changing password for my profile
router.post("/changepasswordformyprofile", authenticate, changePasswordForMyProfile)


// Export the router for use in the main application
module.exports = router