const express = require("express")
const router = express.Router()
const {isInstructor} = require("../middlewares/auth");
const {authenticate, isStudent} = require("../middlewares/auth");


const {updateProfile, deleteProfile,  getAllUserDetails, updateDisplayPicture, getUserDetails, getEnrolledCourses, instructorDashboard}=  require("../controllers/profile");
//                                      Profile routes


router.get("/getUserDetails", authenticate, getUserDetails);
router.put("/updateProfile", authenticate, updateProfile)
router.delete("/deleteProfile", authenticate, deleteProfile)
router.get("/getUserDetails", authenticate, getAllUserDetails)
router.put("/updateDisplayPicture", authenticate, updateDisplayPicture)


// Get Enrolled Courses
router.get("/getEnrolledCourses", authenticate, getEnrolledCourses)
// router.put("/updateDisplayPicture", authenticate, updateDisplayPicture)
router.get("/instructorDashboard", authenticate, isInstructor, instructorDashboard)

module.exports = router