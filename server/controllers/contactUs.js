const mailSender = require("../utils/mailSender");
const {contactFormRes} = require("../mailTemplates/contactFormRes");

const contactUs = async(req, res)=>{
    try{
        const {firstName, lastName, email, phoneNo, message, countrycode} = req.body;

        if(!firstName || !email || !phoneNo || !message || !countrycode){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        const mailResponse = await mailSender(email, "Your Data send successfully", contactUsEmail(email, firstName, lastName, message, phoneNo, countrycode));
        console.log("Mail response", mailResponse);

        return res.status(200).json({
            success: true,
            message: "Email Sent successfully",
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = contactUs;