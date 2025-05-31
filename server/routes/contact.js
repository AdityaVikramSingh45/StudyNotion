const express = require("express");
const router = express.Router();
const contactUs = require("../controllers/contactUs");

//Contact Us route

router.post("/contact", contactUs);

module.exports = router;