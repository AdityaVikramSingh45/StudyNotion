const { get } = require("mongoose");
const Profile = require("../models/profile");
const User = require("../models/user");
const uploadImageOnCloudinary = require("../utils/imageUploader")
const {convertSecondsToDuration} = require("../utils/secToDuration")
const CourseProgress = require("../models/courseProgress")
const Course = require("../models/course")


// The issue is with how the functions are being exported. 
// Instead of using module.exports for each function separately,
// we should export all functions as properties of a single exports object

exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "user id not found"
            });
        }
        const userDeatils = await User.findById(userId).populate("additionalDetails");
        if (!userDeatils) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("UserDetails--->", userDeatils);
        return res.status(200).json({
            success: true,
            message: "Successfully fetched all user details",
            userDeatils
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
};

exports.updateProfile=async(req,res)=>{
    try {
        //get data as well as userid
        const{
            firstName,
            lastName,
            dateOfBirth,
            about,
            contactNumber,
            gender
        }=req.body;

        console.log("gender", gender);
        console.log("dateOfBirth", dateOfBirth);
        console.log("about", about);
        console.log("contactNumber", contactNumber);
        console.log("firstName", firstName);
        console.log("lastName", lastName);

        const userId=req.user.id;
        //find profile and update
        const userdetails=await User.findById(userId)
        const profileid=userdetails.additionalDetails;
        const profiledetails=await Profile.findById(profileid);
        const user = await User.findByIdAndUpdate(userId, {
            firstName:firstName,
            lastName:lastName,
          })
          await user.save()

        //update profile
        profiledetails.gender=gender;
        profiledetails.dateOfBirth=dateOfBirth;
        profiledetails.about=about;
        profiledetails.contactNumber=contactNumber;
        await profiledetails.save();

        const updatedUserDetails = await User.findById(userId)
        .populate("additionalDetails")
        .exec()
        //return res
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            updatedUserDetails,
        })
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while updating profile",
            error:error.message,
        })
    }
}


// exports.updateProfile = async (req, res) => {
//     try {
//         // Extract data from request body
//         console.log("updating profile.......")
//         const { gender, dateOfBirth = "", about = "", contactNumber, firstName, lastName } = req.body;
//         console.log("gender", gender);
//         console.log("dateOfBirth", dateOfBirth);
//         console.log("about", about);
//         console.log("contactNumber", contactNumber);
//         console.log("firstName", firstName);
//         console.log("lastName", lastName);

//         // Get userId from authenticated user
//         const userId = req.user.id;

//         // Validation
//         if (!gender || !contactNumber || !userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required",
//             });
//         }

//         // Find user profile
//         const user = await User.findById(userId);
//         const updatedUser = await User.findByIdAndUpdate(userId, {
//             firstName,
//             lastName,
//           })
//         await updatedUser.save()

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }


//         const profileDetails = await Profile.findById(user.additionalDetails);
//         if (!profileDetails) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Profile details not found",
//             });
//         }

//         // Update profile details
//         profileDetails.dateOfBirth = dateOfBirth;
//         profileDetails.gender = gender;
//         profileDetails.about = about;
//         profileDetails.contactNumber = contactNumber;


//         const updatedProfile = await profileDetails.save();
//         console.log("Updated Profile", updatedProfile)

//         // Find the updated user details
//        const updatedUserDetails = await User.findById(userId)
//        .populate("additionalDetails")
//        .exec()

//         // Respond with updated profile
//         return res.status(200).json({
//             success: true,
//             message: "Profile updated successfully",
//             updatedUserDetails: updatedUserDetails,
//         });
//     } catch (err) {
//         console.error("Error while updating profile:", err);
//         res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// };

//Delete profile
//EXPLORE --> HOW CAN we scheduled this deletion

exports.deleteProfile = async(req, res)=>{
    try{
        //getId
        const userId = req.user.id;

        //validation
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "All field are required",
            })
        }

        //Find profile
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found",
            })
        }
        const profileId = user.additionalDetails;

        //delete profile 
        await Profile.findByIdAndDelete(profileId);

        //delete user
        await User.findByIdAndDelete(userId);

        //TODO: unenroll user from all enrolled course


        //return res
        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully"
        })
    }
    catch(err){
        console.log("Error while deleting profile", err);
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.getAllUserDetails = async(req, res)=>{
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User not found",
            })
        }

        const user = await User.findById(userId).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "Successfully fetched all user details"
        })


    }
    catch(err){
        console.log("Error while Getting all users", err);
        res.status(500).json({
            success: false,
            message: err.message
        }) 
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageOnCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }


// exports.updateDisplayPicture = async (req, res) => {
//     try {
//         const  userId = req.user.id;

//         // Validate userId
//         if (!userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "userId is missing"
//             });
//         }
//         console.log("userId", userId);

//         // Check if user exists
//         const userDetail = await User.findById(userId);
//         if (!userDetail) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No user exists with this userId"
//             });
//         }
//         console.log("userDetail", userDetail);
//         console.log("req.files", req.files)
//         console.log("req.files.file", req.files.file)
//         // Validate uploaded file
//         if (!req.files || !req.files.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No file uploaded"
//             });
//         }

//         const profilePicture = req.files.file;

//         // Upload file to Cloudinary
//         let updatedProfilePicture;
//         try {
//             updatedProfilePicture = await uploadImageOnCloudinary(profilePicture, process.env.FOLDER_NAME);
//         } catch (uploadError) {
//             console.error("Error uploading image:", uploadError);
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to upload image to Cloudinary"
//             });
//         }

//         // Update user profile picture URL
//         userDetail.image = updatedProfilePicture.secure_url;
//         await userDetail.save();
//         console.log("userDetail--->", userDetail)

//         return res.status(200).json({
//             success: true,
//             message: "Profile picture updated successfully",
//             userDetail
//         });
//     } catch (err) {
//         console.error("Error in updateDisplayPicture:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong",
//             error: err.message
//         });
//     }
// };

exports.getEnrolledCourses = async(req, res)=>{
    try{
        const userId = req.user.id;
        let userDetails = await User.findById(userId)
            // .populate("courses")
            .populate({
                path: "courses",
                populate: {
                  path: "courseContent",
                  populate: {
                    path: "subSection",
                  },
                },
              })
            
            .exec();
            
            userDetails = userDetails.toObject()
            var SubsectionLength = 0
            for (var i = 0; i < userDetails.courses.length; i++) {
              let totalDurationInSeconds = 0
              SubsectionLength = 0
              for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[
                  j
                ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                  totalDurationInSeconds
                )
                SubsectionLength +=
                  userDetails.courses[i].courseContent[j].subSection.length
              }
              let courseProgressCount = await CourseProgress.findOne({
                courseId: userDetails.courses[i]._id,
                userId: userId,
              })
              courseProgressCount = courseProgressCount?.completedVideos.length
              if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
              } else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                  Math.round(
                    (courseProgressCount / SubsectionLength) * 100 * multiplier
                  ) / multiplier
              }
            }
        
        if(!userDetails){
            return res.status(404).json({
                success: false,
            message: `Could not find User details with id: ${userId}`
            })
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses
        })

    }
    catch(err){
        console.error("Error in getEnrolledCourses:", err);
        return res.status(500).json({
            message: err.message,
            success: false
        })
    }
}

exports.instructorDashboard = async(req, res)=>{
    try{
        const courseDetails = await Course.find({instructor: req.user.id});
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "CourseDetails not found"
            })
        }

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;

            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            //create a new object with additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled, 
                totalAmountGenerated
            }
            return courseDataWithStats
        })
        res.status(200).json({
            success: true,
            courses: courseData
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Intenal Server Error"
        })
    }
}