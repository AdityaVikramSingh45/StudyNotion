const cloudinary = require('cloudinary').v2

const uploadImageOnCloudinary = async(file, folder, height, quality)=>{
    try{
        const options = {folder};
        if(height){
            options.height = height;
        }
        if(quality){
            options.quality = quality;
        }
        options.resource_type = "auto";
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        return result;
    }
    catch(err){
        console.log("Error while uploading imageFile on cloudinary", err);
        res.status(500).json({
            success: false,
            message: "Error while uploading imageFile on cloudinary",
        })
    }
}

module.exports = uploadImageOnCloudinary;