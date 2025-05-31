const CourseProgress = require("../models/courseProgress");
const SubSection = require("../models/subSection");


exports.updateCourseProgress = async(req, res)=>{
    const {courseId, subSectionId} = req.body;
    const userId = req.user.id;
    console.log("req.user", req.user);
    console.log("userId", userId);
    console.log("subSectionId", subSectionId);
    console.log("courseId", courseId);
    if(!courseId || !subSectionId || !userId){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }
    try{
        const subSection = await SubSection.findById(subSectionId);
        if(!subSection){
            return res.status(404).json({
                success: false,
                error: "Invalid Sub-Section"
            })
        }

        
        //check for old entry
        //payment ke time courseProgress ko set karna paega to 0
        
        const courseProgress = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId
        })
        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "Course Progress doesn't exist"
            })
        }
        else{
            //check for re-completing video/subSection
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    error: "SubSection already completed"
                })
            }

            //push included completed videos
            courseProgress.completedVideos.push(subSectionId);
        }
        const updatedCourseProgress = await courseProgress.save();
        console.log("updatedCourseProgress--->>>>", updatedCourseProgress);

        return res.status(200).json({
            success: true,
            message: "Course Progress successfully",
            data: updatedCourseProgress
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}