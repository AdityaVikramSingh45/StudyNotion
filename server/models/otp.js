const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mailTemplates/emailVerificationTemplates");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        expires: 5*60
    },
    otp:{
        type: String,
        required: true
    }
});

// a function to send mail

async function sendVerificationEmail(email, otp){
    try{
        const mailResposne = await mailSender(email, "Verification Email from studynotion", otpTemplate(otp));
        console.log("Mail send successfully", mailResposne);

    }
    catch(err){
        console.log("Error while sending the mail", err);
        res.status(500).json({
            success: false,
            message: "Error while sending the mail"
        })
    }
}

otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})


const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;