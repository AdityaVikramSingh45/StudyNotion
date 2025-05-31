const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswordtoken
exports.resetPasswordToken = async(req, res)=>{
    try{
        //extract email from body
        console.log("reseting password token.....")
        const {email} = req.body;

        //check if user exist
        if(!email){
            return res.status(400).json({
                success: false,
                message: "Email is required",
            })
        }

        //email is valid
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            })
        }

        //generate token
        
        const token = crypto.randomUUID();
        console.log("Token: ", token);

        //update user by adding token and expiration time
        const updatedDetails= await User.findOneAndUpdate({email}, {token: token, resetPasswordExpires: Date.now() + 10*60*1000}, {new: true});
        console.log("Updated Details: ", updatedDetails);

        //create url

        const url = `http://localhost:3000/update-password/${token}`;

        //send mail containing url

        const emailResponse = await mailSender(email, "Password Reset", `Password Reset Link ${url}`);
        console.log("Email Response: ", emailResponse);

        //return response

        return res.status(200).json({
            success: true,
            message: "Email sent successfully, please check your email and change your password"
        })
    }
    catch(err){
        console.log("Error while generating reset password token", err);
        return res.status(500).json({
            success: false,
            message: "Error while generating reset password token",
        })
    }
}

//resetPassword
exports.resetPassword = async(req, res)=>{
    try{
        //data fetch
        const {password, confirmPassword, token} = req.body;

        // console.log("password", password )
        // console.log("confirmPassword", confirmPassword )
        // console.log("token", token )

        //validation
        if(!password || !confirmPassword || !token){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //check if new password and confirm new password are same
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "New password and confirm new password do not match",
            })
        }

        //extract userDetails from db using token

        const user = await User.findOne({token});

        //if no entry - invalid token

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Token is invalid",
            })
        }

        //token time check

        if(Date.now() > user.resetPasswordExpires){
            return res.status(400).json({
                success: false,
                message: "Token is expired, please request for a new password reset link",
            })
        }

        //hash password

        const hashedPassword = await bcrypt.hash(password, 10);

        //update password
        const updatedUser = await User.findOneAndUpdate({email: user.email}, {password: hashedPassword}, {new: true});
        console.log("Updated User: ", updatedUser);

        //send response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        })
    }
    catch(err){
        console.log("Error while resetting password", err);
        return res.status(500).json({
            success: false,
            message: "Error while resetting password",
        })
    }
}