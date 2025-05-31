const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating:{
        type:Number
    },
    review:{
        type: String,
    },
    course: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Course",
        index: true,
    }
});

const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewSchema);

module.exports = RatingAndReview;