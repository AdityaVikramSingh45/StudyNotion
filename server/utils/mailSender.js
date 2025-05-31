const nodemailer = require("nodemailer");

const mailSender = async(email, title, body)=>{
    try{
        const transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: "StudyNotion || Aditya Vikram Shubh",
            to: email,
            subject: title,
            html: body
        })
        console.log("INFO---->", info);
        return info;
    }
    catch(err){
        console.log("Error in sending mail", err);
        res.status(500).json({
            success: false,
            message: "Error in sending mail"
        })
    }
}

module.exports = mailSender;