const User = require("../models/user");
const Otp = require("../models/otp");
const otpGenerator = require("otp-generator");
const Profile = require("../models/profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mailSender = require("../utils/mailSender");

dotenv.config();

//signup
exports.signUp = async(req, res)=>{
    try{
        //data fetch from request ki body
        const {firstName, lastName, email, password, confirmPassword, contactNumber, accountType, otp} = req.body;
        // console.log("all firstName...",firstName);
        // console.log("all lastName...",lastName);
        // console.log("all email...",email);
        // console.log("all password...",password);
        // console.log("all confirmPassword...",confirmPassword);
        // console.log("all contactNumber...",contactNumber);
        // console.log("all accountType...",accountType);
        // console.log("all otp...",otp);
        
        //validate
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //2 password match karo
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and confirm password does not match",
            })
        }

        //Check if user already exist
        const isUserExist = await User.findOne({email});
        if(isUserExist){
            return res.status(400).json({
                success: false,
                message: "User already exist",
            })
        }
        //find most recent otp
        const recentOtp = await Otp.findOne({email}).sort({createdAt: -1});
        console.log("RECENT OTP------>", recentOtp);

        //validate otp
        if(!recentOtp){
            return res.status(400).json({
                success:false,
                message: "OTP not found",
            })
        }

        if(recentOtp.otp != otp){
            return res.status(400).json({
                success: false,
                message: "OTP does not match",
            })
        }

        //IF not then hashed the password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
            console.log("Hashed Password------>", hashedPassword);
        }
        catch(err){
            console.log("Error while hashing password", err);
            return res.status(500).json({
                success: false,
                message: "Error while hashing password",
            })
        }

        //Save the user
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNumber,
        })

        const newUser = await User.create({firstName, lastName, email, password: hashedPassword, accountType, contactNumber, additionalDetails: profileDetails._id,
            image: `http://api.dicebear.com/9.x/initials/svg?seed=${firstName}${lastName}`
        })

        console.log("NEW USER------>", newUser);

        //send the response
        res.status(200).json({
            success: true,
            message: "User registered successfully",
            newUser
        })
    }
    catch(err){
        console.log("Error while signing up", err);
        return res.status(500).json({
            success: false,
            message: "Error while signing up",
        })
    }
}


//send otp --> it's generate otp and save it to db with a corresponding email

exports.sendOtp = async (req, res)=>{
    try{
        //get email from user
        const {email} = req.body;
        console.log("email", email);


        if (!email) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //check whether user already exist
        const isUserExist = await User.findOne({email});

        //if user already exist
        if(isUserExist){
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }

        //If not then generate otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        console.log("OTP------>", otp);

        //check for unique otp
        let isOtpExist = await Otp.findOne({otp});

        while(isOtpExist){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            isOtpExist = await Otp.findOne({otp});
        }

        // Save OTP to database
        const otpData = new Otp({email, otp});
        const savedOtp = await otpData.save();
        console.log("OTP DATA------>", savedOtp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        })
    }
    catch(err){
        console.log("Error while sending otp", err);
        res.status(500).json({
            success: false,
            message: "Error while sending otp",
        })
    }
}



//login

exports.login = async(req, res)=>{
    try{

        //fetch the data fro request
        const {email, password, accountType} = req.body;

        //validate
        if(!email  || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //check if user exist
        const registeredUser = await User.findOne({email}).populate("additionalDetails");
        if (!registeredUser) {
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            });
        }        

        //check the password and generate token
        if(await bcrypt.compare(password, registeredUser.password)){
            const payload = {
                email: registeredUser.email,
                id: registeredUser._id,
                accountType: registeredUser.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "2h"});

            registeredUser.token = token;
            registeredUser.password = undefined;

            //create cookie and send the response

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User logged in successfully",
                registeredUser,
                token
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Password does not match",
            })
        }
        
    }
    catch(err){
        console.log("Error while logging in", err);
        res.status(500).json({
            success: false,
            message: "Error while logging in",
        })
    }
}


//change password

exports.changepassword = async(req, res)=>{
    try{
        //fetch data from req body
        const {email, oldPassword, newPassword, confirmPassword} = req.body;

        //validation
        if(!email || !oldPassword || !newPassword || !confirmPassword){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //check if user exist or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            })
        }

        //check if old password is correct

        let isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if(!isOldPasswordCorrect){
            return res.status(400).json({
                success: false,
                message: "Old password does not match",
            })
        }

        if(newPassword != confirmPassword){
            return res.status(400).json({
                success:false,
                message: "New password and confirm password does not match",
            })
        }

        //checking if new password and old password are same
        if(await bcrypt.compare(newPassword, user.password)){
            return res.status(400).json({
                success: false,
                message: "New password and old password cannot be same",
            })
        }
        
        //update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        let updatedUser = await user.save();
        console.log("UPDATED USER------>", updatedUser);


        //send mail - password updated succesfully
        const mailResponse = await mailSender(email, "Password updated Successfully", "YOur password has been updated successfully");
        //send the response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        })
    }

    catch(err){
        console.log("Error while changing password", err);
        res.status(500).json({
            success: false,
            message: "Error while changing password",
        })
    }
}


// Controller for Changing Password
exports.changePasswordForMyProfile = async (req, res) => {
  try {
    // Get user data from req.user
    console.log("Inside changePasswordForMyProfile ")
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body
    // console.log("oldPassword", oldPassword)
    // console.log("newPassword", newPassword)

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    // try {
    //   const emailResponse = await mailSender(
    //     // updatedUserDetails.email,
    //     "Password for your account has been updated",
    //     passwordUpdated(
    //       updatedUserDetails.email,
    //       `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
    //     )
    //   )
    //   console.log("Email sent successfully:", emailResponse.response)
    // } 
    // catch (error) {
    //   // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
    //   console.error("Error occurred while sending email:", error)
    //   return res.status(500).json({
    //     success: false,
    //     message: "Error occurred while sending email",
    //     error: error.message,
    //   })
    // }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } 
  catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}




// //SINGUP METHOD 2
// const sendOtp = require('./path-to-sendOtp'); // Import the sendOtp function

// const signUp = async (req, res) => {
//     try {
//         const { firstName, lastName, email, password, confirmPassword, contactNumber, accountType, otp } = req.body;

//         // Validate required fields
//         if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }

//         // Check if passwords match
//         if (password !== confirmPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Password and confirm password do not match",
//             });
//         }

//         // Check if user already exists
//         const isUserExist = await User.findOne({ email });
//         if (isUserExist) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists",
//             });
//         }

//         // Call sendOtp function to generate and save OTP
//         await sendOtp(req, res);  // This will generate and save OTP, and send email due to the pre-save hook

//         // Now validate the OTP (assuming OTP was sent and saved correctly)
//         const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

//         if (!recentOtp) {
//             return res.status(400).json({
//                 success: false,
//                 message: "OTP not found",
//             });
//         }

//         if (recentOtp.otp !== otp) {
//             return res.status(400).json({
//                 success: false,
//                 message: "OTP does not match",
//             });
//         }

//         // Hash password and save user
//         let hashedPassword;
//         try {
//             hashedPassword = await bcrypt.hash(password, 10);
//         } catch (err) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Error while hashing password",
//             });
//         }

//         // Create user profile and user
//         const profileDetails = await Profile.create({
//             gender: null,
//             dateOfBirth: null,
//             about: null,
//             contactNumber,
//         });

//         const newUser = await User.create({
//             firstName,
//             lastName,
//             email,
//             password: hashedPassword,
//             accountType,
//             contactNumber,
//             additionalDetails: profileDetails,
//             image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
//         });

//         res.status(200).json({
//             success: true,
//             message: "User registered successfully",
//         });
//     } catch (err) {
//         console.log("Error during signup", err);
//         return res.status(500).json({
//             success: false,
//             message: "Error during signup",
//         });
//     }
// };
