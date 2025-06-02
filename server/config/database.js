const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = async()=>{
    const MONGOURL = process.env.MONGO_URL;
    const url = process.env.URL;
    
    try{
        await mongoose.connect(MONGOURL)
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