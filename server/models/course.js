const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },
    courseDescription:{
        type:String,
        required:true
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Section",
    }],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview"
        }
    ],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    tag: {
		type: [String],
		required: true,
	},
    studentsEnrolled:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    instructions: {
		type: [String],
	},
    createdAt: {
		type:Date,
		default:Date.now()
	}

});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;