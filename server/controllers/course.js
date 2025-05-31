const User = require("../models/user");
const Category = require("../models/category");   
const Course = require("../models/course");
const uploadImageOnCloudinary = require("../utils/imageUploader");
const dotenv = require("dotenv");
const Section = require("../models/section");
const SubSection = require("../models/subSection")
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress = require("../models/courseProgress")


dotenv.config();

// Create Course handler function
exports.createCourse = async(req, res)=>{
    try{
        //feth data
        console.log("Creating course......");
        const {courseName, courseDescription, price, category, whatYouWillLearn, tag: _tag, instructions: _instructions, status="Draft" } = req.body;
        
        //Get Thumbnail
        const thumbnail = req.files?.thumbnail;
        let tag, instructions;
        try {
            tag = JSON.parse(_tag);
        } catch (error) {
            console.error("Error parsing tag:", error.message);
            tag = []; // Fallback or throw error
        }
        
        try {
            instructions = JSON.parse(_instructions);
        } catch (error) {
            console.error("Error parsing instructions:", error.message);
            instructions = []; // Fallback or throw error
        }
        // console.log("Parsed tag:", tag);
        // console.log("Parsed instructions:", instructions);  
        // console.log("Inside create course handler");
        // console.log("Thumbmail", thumbnail);
        // console.log("courseName", courseName);
        // console.log("courseDescription", courseDescription);
        // console.log("price", price);
        // console.log("category", category);
        // console.log("whatYouWillLearn", whatYouWillLearn);
        // console.log("tag", tag);
        // console.log("instructions", instructions);
        // // console.log("Thumbmail", thumbnail);
        // console.log("Thumbmail", thumbnail);
        
        //validation
        //(Removed validation for thumbnail and tags)
        if(!courseName || !courseDescription || !price || !category || !whatYouWillLearn || !instructions || !thumbnail || !tag){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //check for instructor to store object id of instructor in course schema
        
        let userId = req.user.id;
        console.log("USERID-------->", userId);

        const instructorDetails = await User.findById(userId);
        console.log("instructorDetails", instructorDetails);
        // console.log("INSTRUCTORID------->", instructorDetails._id);

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            })
        }
        
        
       

        const categoryDetails = await Category.findById(category);
        console.log("categoryDetails", categoryDetails);

        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: "Category not found",
            })
        }

        //Upload thumbnail to cloudinary
        console.log("Just before thumbnailImg")
        const thumbnailImage = await uploadImageOnCloudinary(thumbnail, process.env.FOLDER_NAME );

        //Create an entry for the new course
        const course = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            category:categoryDetails._id,
            price,
            whatYouWillLearn,
            instructions,
            thumbnail:thumbnailImage?.secure_url,
            tag,
            status
        });

        console.log("COURSE---->", course);

        //adding the new course to the user schema of instructor
        console.log("updatedInstructorDetails")
        const updatedInstructorDetails = await User.findByIdAndUpdate(
            instructorDetails._id,
            {
                $push: {
                    courses: course._id
                }
            },
            {new: true}
        )
        console.log("updatedInstructorDetails---->", updatedInstructorDetails);

        //adding the course to the tag schema as well
        console.log("updatedCategoryDetails");
        const updatedCategoryDetails = await Category.findByIdAndUpdate(categoryDetails._id, { $push: {course: course._id}}, {new: true});
        console.log("updatedCategoryDetails---->", updatedCategoryDetails);

        // 🔥 **POPULATE `courseContent` to get `title` (sectionName)**
        const populatedCourse = await Course.findById(course._id)
            .populate({
                path: "courseContent",
                select: "title" // Only fetch `title` field from Section model
            });

        console.log("POPULATED COURSE ---->", populatedCourse);


        //send the response

        res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: course
        })


    }
    catch(err){
        console.log("Error while creating a course", err);
        res.status(500).json({
            success: false,
            message: "Error while creating a course",
        })
    }
}


// Delete course
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }
  
  


// Edit Course Details
// exports.editCourse = async (req, res) => {
//     try {
//       const { courseId } = req.body
//       const updates = req.body
//       console.log("updated sata---->",updates);
//       const course = await Course.findById(courseId)
  
//       if (!course) {
//         return res.status(404).json({ error: "Course not found" })
//       }

//       console.log("Course in backend before updating", course)
//       console.log("Course.courseName in backend before updating", course.courseName)
//       console.log("Course.category in backend before updating", course.category)
//       console.log("Course.tag in backend before updating", course.tag)
  
//       // If Thumbnail Image is found, update it
//       if (req.files) {
//         console.log("thumbnail update")
//         const thumbnail = req.files.thumbnailImage
//         const thumbnailImage = await uploadImageOnCloudinary(
//           thumbnail,
//           process.env.FOLDER_NAME
//         )
//         course.thumbnail = thumbnailImage.secure_url
//       }

  

//       // ✅ Handle tags and instructions safely
//     // for (const key in updates) {
//     //   if (updates.hasOwnProperty(key)) {
//     //     if (key === "tag" || key === "instructions") {
//     //       try {
//     //         const value = updates[key];

//     //         // ✅ Check if it's already an array
//     //         if (Array.isArray(value)) {
//     //           course[key] = value;
//     //         } else if (typeof value === "string") {
//     //           // Parse only if it's a string
//     //           course[key] = JSON.parse(value);
//     //         } else {
//     //           course[key] = [value];  // Fallback for any unexpected format
//     //         }

//     //       } catch (error) {
//     //         console.error(`Error parsing ${key}:`, error.message);
//     //         course[key] = updates[key];  // Fallback to original value
//     //       }
//     //     } else {
//     //       course[key] = updates[key];
//     //     }
//     //   }
//     // }

//     // ✅ Properly handle tags and instructions
//     for (const key in updates) {
//       if (updates.hasOwnProperty(key)) {
//           if (key === "tag" || key === "instructions") {
//               const value = updates[key];

//               // ✅ Check if value is already an array (from frontend)
//               if (Array.isArray(value)) {
//                   course[key] = value;
//               } else if (typeof value === "string") {
//                   // ✅ Handle comma-separated strings (if necessary)
//                   course[key] = value.includes(",") 
//                       ? value.split(",").map((tag) => tag.trim())
//                       : [value];
//               } else {
//                   course[key] = [value];  // Fallback
//               }
//           } else {
//               course[key] = updates[key];
//           }
//       }
//   }

  
//       await course.save()
  
//       const updatedCourse = await Course.findOne({
//         _id: courseId,
//       })
//         .populate({
//           path: "instructor",
//           populate: {
//             path: "additionalDetails",
//           },
//         })
//         .populate("category")
//         // .populate("ratingandreviews")
//         .populate({
//           path: "courseContent",
//           populate: {
//             path: "subSection",
//           },
//         })
//         .exec()
        
//         console.log("updatedCourse in backend after updating", updatedCourse)
//         console.log("updatedCourse.courseName in backend after updating", updatedCourse.courseName)
//         console.log("updatedCourse.category in backend after updating", updatedCourse.category)
//         console.log("updatedCourse.tag in backend after updating", updatedCourse.tag)
      
//       res.json({
//         success: true,
//         message: "Course updated successfully",
//         data: updatedCourse,
//       })
//     } catch (error) {
//       console.error(error)
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: error.message,
//       })
//     }
//   }

// exports.editCourse = async (req, res) => {
//   try {
//       const { courseId } = req.body;
//       const updates = req.body;

//       console.log("Updated data --->", updates);

//       const course = await Course.findById(courseId);

//       if (!course) {
//           return res.status(404).json({ error: "Course not found" });
//       }

//       console.log("Course in backend before updating", course);

//       // ✅ Handle thumbnail update
//       if (req.files) {
//           console.log("Thumbnail update");
//           const thumbnail = req.files.thumbnailImage;
//           const thumbnailImage = await uploadImageOnCloudinary(
//               thumbnail,
//               process.env.FOLDER_NAME
//           );
//           course.thumbnail = thumbnailImage.secure_url;
//       }

//       // ✅ Handle tags and instructions properly
//       for (const key in updates) {
//           if (updates.hasOwnProperty(key)) {
//               if (key === "tag" || key === "instructions") {
//                   let values = [];

//                   try {
//                       let rawValue = updates[key];

//                       // 🛑 **Recursively parse nested JSON**
//                       while (typeof rawValue === "string" && rawValue.startsWith('["')) {
//                           rawValue = JSON.parse(rawValue);
//                       }

//                       if (Array.isArray(rawValue)) {
//                           values = rawValue.flat();
//                       } else if (typeof rawValue === "string") {
//                           values = rawValue.split(",").map(tag => tag.trim());
//                       } else {
//                           values = [rawValue];
//                       }

//                   } catch (error) {
//                       console.error(`Error parsing ${key}:`, error.message);
//                       values = [updates[key].trim()];
//                   }

//                   // 🚀 **Deduplicate and clean the tags**
//                   course[key] = [...new Set(values.map(tag => tag.trim()))];

//               } else {
//                   course[key] = updates[key];
//               }
//           }
//       }

//       await course.save();

//       // ✅ Fetch updated course with populated fields
//       const updatedCourse = await Course.findOne({ _id: courseId })
//           .populate({
//               path: "instructor",
//               populate: { path: "additionalDetails" }
//           })
//           .populate("category")
//           .populate({
//               path: "courseContent",
//               populate: { path: "subSection" }
//           })
//           .exec();

//       console.log("Updated course in backend after updating", updatedCourse);

//       res.json({
//           success: true,
//           message: "Course updated successfully",
//           data: updatedCourse,
//       });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({
//           success: false,
//           message: "Internal server error",
//           error: error.message,
//       });
//   }
// };

exports.editCourse = async (req, res) => {
  try {
      const { courseId } = req.body;
      const updates = req.body;

      console.log("Updated data --->", updates);

      const course = await Course.findById(courseId);
      if (!course) {
          return res.status(404).json({ error: "Course not found" });
      }

      console.log("Course before updating:", course);

      // ✅ Handle thumbnail update
      if (req.files?.thumbnailImage) {
          console.log("Thumbnail update");
          const thumbnail = req.files.thumbnailImage;
          const thumbnailImage = await uploadImageOnCloudinary(thumbnail, process.env.FOLDER_NAME);
          course.thumbnail = thumbnailImage.secure_url;
      }

      // ✅ Standardize tags and instructions as arrays
      if (updates.tag) {
          try {
              course.tag = Array.isArray(updates.tag)
                  ? updates.tag
                  : JSON.parse(updates.tag);
          } catch (error) {
              course.tag = updates.tag.split(",").map((item) => item.trim());
          }
      }

      if (updates.instructions) {
        try {
            const newInstructions = Array.isArray(updates.instructions)
                ? updates.instructions
                : JSON.parse(updates.instructions);

            // **Normalize and merge instructions**
            const normalizedNew = newInstructions.map((item) => item.trim().toLowerCase());
            const normalizedExisting = (course.instructions || []).map((item) => item.trim().toLowerCase());

            // **Remove duplicates**
            const mergedInstructions = [...new Set([...normalizedExisting, ...normalizedNew])]
                .filter((item) => item !== "");  // Remove empty strings

            course.instructions = mergedInstructions;

        } catch (error) {
            console.error("Instruction error:", error);
            course.instructions.push(updates.instructions.trim().toLowerCase());
        }
    }

  
    
      // ✅ Update other fields dynamically
      Object.keys(updates).forEach((key) => {
          if (!["tag", "instructions"].includes(key)) {
              course[key] = updates[key];
          }
      });

      await course.save();

      // ✅ Fetch the updated course with populated fields
      const updatedCourse = await Course.findById(courseId)
          .populate({ path: "instructor", populate: { path: "additionalDetails" } })
          .populate("category")
          .populate({ path: "courseContent", populate: { path: "subSection" } })
          .exec();

      console.log("Updated course:", updatedCourse);

      res.json({
          success: true,
          message: "Course updated successfully",
          data: updatedCourse,
      });

  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
      });
  }
};





//get all courses handler function
exports.showAllCourses = async(req, res)=>{
    try{
        const allCourse = await Course.find({}).populate("instructor");

        return res.status(200).json({
            success:true, 
            message: "All course fetched successfully",
            data: allCourse
        })

    }
    catch(err){
        console.log("Error while getting all courses", err);
        res.status(500).json({
            success: false,
            message: "Error while getting all courses",
        })
    }
}

//get course details handler function
exports.getCourseDetails = async(req, res)=>{
    try{
        //fetch courseId from Query
        // console.log("getting course details");
        // console.log("req.body", req.body);
        // console.log("req.user", req.user);

        // console.log("req.query", req.query);
        const { courseId } = req.query;  // Changed to req.params
        // const userId = req.user.id;
        // console.log("userId", req.body);

        // console.log("courseId", courseId);

        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "CourseID not found"
            })
        }

        // Fetching course details
        console.log("fetching course.....")
        let courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails"
                },
            })
            .populate("category")
            .populate("ratingAndReviews")  // Fix: should match the property name `ratingAndReviews`
            .populate("courseContent")
            // .populate({
            //     path: "courseContent",
            //     populate: {
            //         path: "subSection",  // Ensure subSection exists in Section schema
            //     },
            // })
            .exec();

            console.log("CourseDetails in backend", courseDetails);
            console.log("CourseDetails.courseContent in backend", courseDetails.courseContent);
            // console.log("CourseDetails.courseContent.subSECTION in backend", courseDetails.courseContent.subSection);

            // let courseProgress = await courseProgress.findOne({
            //   courseId: courseId,
            //   userId: userId,
            // })

            // Error pata nhi kyunn
            let totalDurationInSeconds = 0
            courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
               })
            })

            const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        // course validation
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `No course found with the courseId ${courseId}`
            })
        }  

        // Returning the response
        console.log("Returning the response");
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data:{
              courseDetails,
              totalDuration
            }
        })
    }
    catch(err){
        console.log("Error occurred while fetching course Details", err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      // User.populate("courseContent")
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

//Get a list of courses for a specific instructor

exports.getInstructorCourses = async(req, res)=>{
    try{
        //Get the instructor Id from the autenticated user or req.body
        // console.log("Inside getInstructor courses in backend")
        // console.log("req.user.id", req.user.id)
        const instructorID = req.user.id

        //Find all the courses belonging to that instructor
        const courses = await Course.find({instructor: instructorID}).sort({created: -1})
        // console.log("Courses---->",courses)

        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: courses
        })
    }
    catch(err){
        console.log("Error occurred while fetching instructor courses", err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}