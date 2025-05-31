const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.URL)
        .then(()=>{
        console.log("Database connected successfully");
       })
    }
    catch(error){
        console.log("Database connection failed");
        console.error(error);
        process.exit(1);
    }
    
}

module.exports= dbConnect;