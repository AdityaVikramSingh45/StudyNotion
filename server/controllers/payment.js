const instance = require("../config/razorPay");
const User = require("../models/user");
const Course = require("../models/course");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mailTemplates/courseEnrollmentEmail")
const mongoose = require("mongoose");
const { paymentSuccessEmail } = require("../mailTemplates/paymentSuccessEmail");
const crypto = require("crypto");
const dotenv = require("dotenv");
const CourseProgress = require("../models/courseProgress");
dotenv.config();



//initiate the razorpay order(Mutliple courses)
exports.capturePayment = async(req, res)=>{


    const {courses} = req.body;  //Fetching all the ids of the courses in the wishlist(Kinda)
    const userId = req.user.id;

    if(courses.length === 0){
        return res.status(400).json({message: "Please provide courseId"});
    }

    // Force courses to be an array (even if it comes as a string)
    const courseArray = Array.isArray(courses) ? courses : [courses];

    // console.log("courses", courses)

    let totalAmount = 0;    //Of the all the courses in the wishlist(kinda);

    for(const course_id of courseArray){
        // console.log("course_id----->>>", course_id);
        // console.log("courses----->>>", courses);
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course) return res.status(400).json({ success: false ,message:"Could not find the course"});
            
            //Checking whether the user alredy enrolled or not and hence converting the courseId to objectId in order to match
            const uid = new mongoose.Types.ObjectId(userId);

            if(course.studentsEnrolled.includes(uid)){
                return res.status(400).json({ success: false , message:"You have already enrolled in"});
            }

            totalAmount += course.price;

        }
        catch(error){
            console.log(error);
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    const options = {
        "amount": totalAmount * 100,
        "currency": "INR",
        "receipt": Math.random(Date.now()).toString()
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success: true,
            message: paymentResponse
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Could not initiate Order"
        })
    }
}


//Verify the payment
exports.verifyPayment = async(req, res)=>{

    //These are mandatory steps for verification(As successful payment returns these fields to checkout form)
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(400).json({
            success: false,
            message: "Payment Failed"
        })
    }

    //Some predefined steps by razorpay to construct Hmac(Hash-Based Message Authentication Code) hex digest
    // console.log("process.env.RAZORPAY_SECRET", process.env.RAZORPAY_SECRET)
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
                                    .createHmac("sha256", process.env.RAZORPAY_SECRET)
                                    .update(body.toString())
                                    .digest("hex");
    
    if(expectedSignature === razorpay_signature){
        //enroll karwao student ko

        await enrolledStudents(courses, userId, res);

        //return res
        return res.status(200).json({
            success: true,
            message: "Payment Successful"
        })
    }
    return res.status(500).json({
        success: false,
        message: "Payment Failded"
    })
}

// sendPaymentSuccessEmail
exports.sendPaymentSuccessEmail = async(req, res)=>{
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;
    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    try{
        //studemt ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(enrolledStudent.email, 
                         `Payment recieved`,
                         paymentSuccessEmail(enrolledStudent.firstName, amount/100, orderId, paymentId)
                        )
        
    }
    catch(error){
        console.log("Error in sending email", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//enrollStudents
const enrolledStudents = async(courses, userId, res)=>{
    try{
        if(!courses || !userId){
            return res.status(400).json({
                success: false,
                message: "Please provide data for courses or userId"
            })
        }

        console.log("courses", courses);

         // Force courses to be an array (even if it comes as a string)
        const courseArray = Array.isArray(courses) ? courses : [courses];
    
        for(const courseId of courseArray){
            //find the courses and enroll the student
            const enrolledCourse = await Course.findByIdAndUpdate({_id: courseId}, {$push: {studentsEnrolled: userId}}, {new: true});
    
            if(!enrolledCourse){
                return res.status(400).json({
                    success: false,
                    message: "Course not found"
                })
            }

            const courseProgress = await CourseProgress.create({
                userId: userId,
                courseId: courseId,
                completedVideos: []
            })
    
            //find the student and add the course to their list o enrolled course
            const enrolledStudent = await User.findByIdAndUpdate({_id: userId}, {$push: {courses: courseId, courseProgress: courseProgress._id}}, {new: true});
    
            //mail send kardo
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            )
    
    
            // console.log("Email send successfully", emailResponse.response);
    
        }
    }
    catch(error){
        console.log("Error while enrolling student", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



//---------------------this is for single course-------------------------------------
// //capture the payment(CREATING THE ORDER) and initiate the Razorpay

// const capturePayment = async(req, res)=>{
//     try{
//     //get courseId and userId
//     let {courseId} = req.body;
//     let userId = req.user.id;

//     //validation


//     //valid courseID
//     if(!courseId){
//         return res.status(400).json({
//             success: false,
//             messaege: "Please provide valid courseId"
//         })
//     }

//     //valid courseDetails
//     let course
//         course = await Course.findById(courseId);
//         if(!course){
//             return res.status(400).json({
//                 success: false,
//                 messaege: "Could not find the course"
//             })
//     }

//     //user already pay for the same course(String userid converted into objectId)
//     let uid = new mongoose.Types.ObjectId(userId);

//     if(course.studentsEnrolled.includes(uid)){
//         return res.status(400).json({
//             success: false,
//             messgae: "Student is already enrolled",
//         })
//     }

//     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount*100,  //inorder to make Rs100 as Rs 100.00
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes: {
//             courseId,
//             userId,
//         } 
//     }

//     //initiate payment using Razorpay
//     const paymentResponse = await instance.orders.create(options);
//     if(!paymentResponse){
//         return res.status(400).json({
//             success: false,
//             message: "Error occured while payment response"
//         })
//     }
//     console.log("PAYMENT RESPONSE----->", paymentResponse);


//     //return res
//     res.status(200).json({
//         success: true,
//         courseName: course.courseName,
//         courseDescription: course.courseDescription,
//         thumbail: course.thumbnail,
//         orderId: paymentResponse.id,
//         currency: paymentResponse.currency,
//         amount: paymentResponse.amount,
//         message: "Successfully captured the payment"
//     })


//     }
//     catch(err){
//         console.log("Error while capturing payment");
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }

// module.exports = capturePayment;

// //verify signature

// const verifySignature = async(req, res)=>{
//     const webHookSecret = "12345";

//     const signature = req.headers["x-razorpay-signature"];

//     //Converting the webHookSecret into encrypted format using HMAC inorder to verify it with the secret key coming from RazorPay in encrypted format
//     //It is a 3 Step Algo
//     //Shasum = Secure Hash Algorithm Sum
//     const Shasum = crypto.createHmac("sha256", webHookSecret);
//     Shasum.update(JSON.stringify(req.body));
//     const digest = Shasum.digest("hex");

//     if(signature === digest){
//         console.log("Payment is authorized");

//         const {userId, courseId} = req.body.payload.payment.entity.notes;

//         try{
//             //fulfill the actions
//             //find the course and enroll the student

//             const enrolledcourse = await Course.findByIdAndUpdate({_id: courseId}, {$push: {studentsEnrolled: userId}}, { new:true });
//             if(!enrolledcourse){
//                 return res.status(400).json({
//                     success: false,
//                     message: "Course not found"
//                 })
//             }
//             console.log("Enrolled course--->", enrolledcourse);

//             //find the student and and add the course to courses
//             const enrolledStudent = await User.findByIdAndUpdate({_id: userId}, {$pull: {courses: courseId}}, {new:true});
//             if(!enrolledStudent){
//                 return res.status(400).json({
//                     success: false,
//                     message: "Student not found"
//                 })
//             }
//             console.log("Enrolled student----->", enrolledStudent);

//             //mail send kardo confirmation wala

//             const mailResponse = await mailSender(enrolledStudent.email, "Congratulations from codehelp", "Congratulations, you are on board into new codehelp course");

//             console.log(mailResponse);
//             return res.status(200).json({
//                 success: true,
//                 message: "Signature verified and Course added",
//             })
//         }
//         catch(err){
//             console.log("Error occured while verifying signature and adding course");
//             return res.status(500).json({
//                 success: false,
//                 message: err.message,
//             })
//         }
//     }
//     else{
//         return res.status(400).json({
//             success: false,
//             message: "INVALID SIGNATURE",
//         })
//     }

// }

// module.exports = verifySignature