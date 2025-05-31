const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

//auth
//authentication is to check if the user is logged in or not, by checking the token
exports.authenticate = async(req, res, next)=>{
    try{
        //extract token
        const token = req.body.token || req?.cookies.token || req.header("Authorization") && req.header("Authorization").replace("Bearer ","");

        //if token doesn't exist
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }
        //verifyng the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("DECODE------>", decode);
            req.user = decode;
        }
        catch(err){
            console.log("Error while verifying token", err);
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            })
        }
        next();
    }
    catch(err){
        console.log("Error while authenticating user", err);
        return res.status(500).json({
            success: false,
            message: "Error while authenticating user",
        })
    }
}




//isStudent

exports.isStudent = async(req, res, next)=>{
    try{
        if(req.user.accountType.toLowerCase()!=="student"){
            return res.status(401).json({
                success: false,
                message: "User is not a student",
            })
        }
        next();
    }
    catch(err){
        console.log("Error while checking if user is student", err);
        return res.status(500).json({
            success: false,
            message: "Error while checking if user is student",
        })
    }
}



//isInstructor

exports.isInstructor = async (req, res, next)=>{
    try{
        if(req.user.accountType.toLowerCase()!="instructor"){
            return res.status(401).json({
                success: false,
                message: "User is not an instructor",
            })
        }
        next();
    }
    catch(err){
        console.log("Error while checking if user is instructor", err);
        return res.status(500).json({
            success: false,
            message: "Error while checking if user is instructor",
        })
    }
}


//isAdmin

exports.isAdmin = async (req, res, next)=>{
    try{
        if(req.user.accountType.toLowerCase()!="admin"){
            return res.status(401).json({
                success: false,
                message: "User is not an admin",
            })
        }
        next();
    }
    catch(err){
        console.log("Error while checking if user is admin", err);
        return res.status(500).json({
            success: false,
            message: "Error while checking if user is admin",
        })
    }
}
