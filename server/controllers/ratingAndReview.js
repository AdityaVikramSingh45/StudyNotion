const RatingAndReview = require("../models/ratingAndReview");
const Course = require("../models/course");
const mongoose = require("mongoose")

//create rating and Review

exports.createRatingAndReview = async (req, res) => {
    try {
        // Get userId
        const userId = req.user.id;

        // Fetch data from req body
        const { rating, review, courseId } = req.body;

        // Validations
        if (!rating || !review || !userId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if user is enrolled or not
        const courseDetail = await Course.findById(courseId);
        const uid = new mongoose.Types.ObjectId(userId);
        if (!courseDetail.studentsEnrolled.some(id => id.equals(uid))) {
            return res.status(400).json({
                success: false,
                message: "Student not enrolled",
            });
        }

        // Check if user has already reviewed the course
        if (courseDetail.ratingAndReviews.some(id => id.equals(uid))) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed the course...",
            });
        }

        // Create rating and review
        const ratingAndReview = await RatingAndReview.create({ user: userId, course: courseId ,rating, review});
        console.log("Rating and review", ratingAndReview);

        // Add ratingAndReview to course
        courseDetail.ratingAndReviews.push(ratingAndReview._id);
        const updatedCourseDetail = await courseDetail.save();
        console.log("UpdatedCourse", updatedCourseDetail);

        // Return response
        return res.status(200).json({
            success: true,
            message: "Rating and review created successfully",
        });
    } 
    catch (err) {
        console.log("Error occurred while creating ratingAndReview", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


//getAverage rating

exports.getAverageRating = async(req, res)=>{
    try{
        //courseId
        const {courseId} = req.body;

        //calculate average rating
        const result = await RatingAndReview.aggregate([
            { $match: { course: mongoose.Types.ObjectId(courseId) } },
            { $group: { _id: null, averageRating: { $avg: "$rating"} }}
        ]);

        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        //if no rating/review exist
        return res.status(200).json({
            success: true,
            message: "Average rating is 0, no rating given till now ",
            averageRating: 0,
        })

        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}



//getAllRatingAndReview

exports.getAllRatingAndReviews = async(req, res)=>{
    try{
        const allReviews = await RatingAndReview.find()
                                                .sort({rating: "desc"})
                                                .populate({
                                                    path: "user",
                                                    select: "firstName lastName email, image"
                                                })
                                                .populate({
                                                    path: "course",
                                                    select: "courseName"
                                                })
                                                .exec();

        return res.status(200).json({ success: true, message: "All reviews fetched successfully", data: allReviews})
        
    }
    
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}