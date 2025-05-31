const express = require("express");
const router = express.Router();

const {authenticate, isStudent} = require("../middlewares/auth");

const {capturePayment, verifyPayment, sendPaymentSuccessEmail} = require("../controllers/payment")
// const sendPaymentSuccessEmail = require("../controllers/payment/");

router.post("/capturePayment", authenticate, isStudent, capturePayment);
router.post("/verifyPayment", authenticate, isStudent,verifyPayment);
router.post("/sendPaymentSuccessEmail", authenticate, isStudent, sendPaymentSuccessEmail);

module.exports = router;