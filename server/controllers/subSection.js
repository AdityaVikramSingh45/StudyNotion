const SubSection = require("../models/subSection");
const Section = require("../models/section");
const { response } = require("express");
const dotenv = require("dotenv");
dotenv.config();
const uploadImageOnCloudinary = require("../utils/imageUploader");
const Course = require("../models/course");

exports.createSubSection = async(req, res)=>{
    try{
        //fetch datat
        const {title, description, sectionId, timeDuration } = req.body;
        //extract file/video

        //req.files me videoUrl se leni hai video 
        const video = req.files?.videoUrl;
        // console.log("req.file--->>>>>>",req.files)
        // console.log("Title", title);
        // console.log("description---->", description);
        // console.log("sectionId", sectionId);
        console.log("video", video);

        //validation
        if(!title || !description || !sectionId || !video){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageOnCloudinary(video, process.env.FOLDER_NAME);
        console.log("uploadDetails", uploadDetails);

        //create entry in db
        const subSection = await SubSection.create({
            title, timeDuration, description, videoUrl: uploadDetails.secure_url
        });

        //update section by adding subSectionID
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {$push: {subSection: subSection._id}}, {new: true}).populate("subSection");
        console.log("updatedSection", updatedSection);

        //return response
        res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            data: updatedSection
        })
    }
    catch(err){
        console.log("Error while creating subSection", err);
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}



exports.updateSubSection = async(req, res)=>{
    try{
        //fetch data
        const {sectionId, title, description, subSectionId} = req.body;

        console.log("Inside updateSubSection in backend")
        console.log("sectionId", sectionId)
        console.log("subsectionId", subSectionId)
        console.log("title", title)
        console.log("description", description)

        //validation
        if(!title || !description || !subSectionId || !sectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //fetch Videofile
        console.log("req.files from updateSubSection", req.files);
        const video = req.files?.videoUrl;
        if(!video){
          return res.status(400).json({
            success: false,
            message: "Video doesn't exist"
          })
        }

        //upload video to cloudinary
        const uploadDetails = await uploadImageOnCloudinary(video, process.env.FOLDER_NAME);

        //subSection details
        const subSection = await subSection.findById(subSectionId);
        if (!subSection) {
            return res.status(404).json({
              success: false,
              message: "SubSection not found",
            });
        }
    
        //updating subSections
        subSection.title = title;
        subSection.description = description;
        subSection.timeDuration = timeDuration;
        // subSection.timeDuration = `${uploadDetails.duration}`
        subSection.videoUrl = uploadDetails.secure_url;

        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate("subSection");
        if(!updatedSection){
          return res.status(400).json({
            success: false,
            message: "Section not found",
          })
        }


        //returning response
        return res.status(200).json({
            success: true,
            message: "Sub Sections are updated successfully",
            data: updatedSection,
        })

    }
    catch(err){
        console.log("Error while updating the subSection", err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body;
  
      // Validation
      if (!subSectionId || !sectionId) {
        return res.status(400).json({
          success: false,
          message: "All fields are necessary",
        });
      }
  
      // Delete the subSection
      const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
      if (!deletedSubSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        });
      }
      console.log("DELETED SUBSECTION---->", deletedSubSection);
  
      // Update the section to remove the subSection
      const updatedSection = await Section.findByIdAndUpdate(
        sectionId, { $pull: { subSection: subSectionId } }, { new: true }).populate("subSection");
      if (!updatedSection) {
        return res.status(404).json({
          success: false,
          message: "Section not found",
        });
      }
      console.log("UPDATED SECTION", updatedSection);

      // Return success response
      return res.status(200).json({
        success: true,
        message: "SubSection deleted successfully",
        data: updatedSection
      });
    } catch (err) {
      console.error("Error while deleting the subSection:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  