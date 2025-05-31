const Section = require("../models/section");
const Course = require("../models/course");
const SubSection = require("../models/subSection");
exports.createSection = async(req, res)=>{
    try{
        //fectch data
        const {sectionName, courseId} = req.body;
        console.log("frontend se aya ya nhi...", sectionName);

        //validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message: "All fields are required"
            })
        }

        //create section
        const section = await Section.create({sectionName});
        console.log("Section created Successfully", section);

        //add sectionId to course
        const sectionId = section._id;
        console.log("sectionId", sectionId);

        const updatedCourse = await Course.findByIdAndUpdate(courseId, {$push: {courseContent: sectionId}}, {new: true}).populate("courseContent");
        console.log("updatedCourse", updatedCourse);

        //return response
        res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails: updatedCourse
        })
    }
    catch(err){
        console.log("Error while creating a section", err);
        res.status(500).json({
            success:false,
            message: "Error while creating a section",
        })
    }
}

exports.updatedSection = async(req, res)=>{
    try{
        //fetch data
        console.log("Updating sections")
        const {sectionName, sectionId, courseId} = req.body;
        console.log("sectionId", sectionId);
        console.log("sectionName", sectionName);
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message: "All fields are required"
            })
        }
        //update section
        console.log("updatedSectionDetails------>")
        const updatedSectionDetails = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        console.log("updatedSectionDetails", updatedSectionDetails);

        const course = await Course.findById(courseId)
        .populate({
          path: "courseContent",
          populate:{
            path: "subSection"
          }
        }).exec()



        //send response
        console.log("Sending response")
        res.status(200).json({
            success:true,
            message: "Section updated successfully",
            data: course
        })
    }
    catch(err){
        console.log("Error while updating a section", err);
        res.status(500).json({
            success:false,
            message: "Error while updating a section",
        })
    }
}

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    // Validation
    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section ID and Course ID are required",
      });
    }

    // Check if section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Remove section reference from Course
    await Course.findByIdAndUpdate(courseId, { $pull: { courseContent: sectionId } });

    // Delete all subsections associated with this section
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    // Delete the section itself
    await Section.findByIdAndDelete(sectionId);

    // Fetch the updated course with populated sections and subsections
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: updatedCourse,
    });

  } catch (err) {
    console.error("Error while deleting a section:", err);
    res.status(500).json({
      success: false,
      message: "Error while deleting a section",
      error: err.message,
    });
  }
};
