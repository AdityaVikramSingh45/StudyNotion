// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {createCourse, showAllCourses,getCourseDetails, editCourse, deleteCourse, getFullCourseDetails, }= require("../controllers/course");

// Categories Controllers Import
const {createCategory, showAllCategories, categoryPageDetails} = require("../controllers/category");

//Course Progress Controller import
const {updateCourseProgress} = require("../controllers/courseProgress");



// Sections Controllers Import
const {createSection, updatedSection, deleteSection} = require("../controllers/section");


// Sub-Sections Controllers Import

const {createSubSection, updateSubSection, deleteSubSection} = require("../controllers/subSection");


// Rating Controllers Import
const {createRatingAndReview, getAverageRating, getAllRatingAndReviews}= require("../controllers/ratingAndReview");

// Importing Middlewares

const {authenticate, isAdmin, isStudent, isInstructor} = require("../middlewares/auth");

const {getInstructorCourses} = require("../controllers/course")


// Courses can Only be Created by Instructors
router.post("/createCourse", authenticate, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", authenticate, isInstructor, createSection)
// Update a Section
router.post("/updateSection", authenticate, isInstructor, updatedSection)
// Delete a Section
router.delete("/deleteSection", authenticate, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", authenticate, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", authenticate, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", authenticate, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/showAllCourses", showAllCourses);
// Get Details for a Specific Courses
// router.get("/getCourseDetails", getCourseDetails);
// Get Details for a Specific Courses
router.get("/getCourseDetails", getCourseDetails)
//Get details of a specific course
router.post("/getFullCourseDetails", authenticate, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", authenticate, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", authenticate, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)

router.post("/updateCourseProgress", authenticate, isStudent, updateCourseProgress);


//                                      Category routes (Only by Admin)
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", authenticate, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)


//                                      Rating and Review

router.post("/createRating", authenticate, isStudent, createRatingAndReview)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingAndReviews)

module.exports = router;