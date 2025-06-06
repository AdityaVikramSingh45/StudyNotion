const Razorpay = require('razorpay');
const dotenv = require("dotenv");
dotenv.config();


const instance =new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

module.exports = instance;