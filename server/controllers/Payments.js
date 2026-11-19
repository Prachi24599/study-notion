import instance from "../config/razorpay.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import courseEnrollmentEmail from "../mail/templates/courseEnrollmentEmail.js";

//Capture a Payment and Initiate the Razorpay order
const capturePayment = async (req, res) => {
    try{
        //get courseId and userId
        const {course_id} = req.body;
        const userId = req.user.id;
        //Validation
        //Valid courseId
        if(!course_id){
            return res.status(500).json({
                success : false,
                message : "Please provide a valid course Id"
            })
        }
        //Valid courseDetail
        let course;
        try{
            course = await Course.findById(course_id);
            //If the course is not present
            if(!course){
                return res.status(500).json({
                    success : false,
                    message : "Could not find a course"
                })
            }
            //Check if User has already paid for the same course
            //Course schema contains the objectId of studentsEnrolled
            //We can check If the current user id is present there or not
            //Current user id is in string form and the Stored user id is objectId form
            //So, We'll first convert the string Id to ObjectId
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                 return res.status(200).json({
                    success : false,
                    message : "Student is already enrolled in the course"
                })
            }

        }catch(error){
            console.error(error);
            res.status(500).json({
                success : false,
                message : error.message
            })
        }
        //Order create
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount : amount * 100,
            currency,
            receipt : Date.now() * Math.random(),
            notes : {
                courseId : course_id,
                userId
            }
        }

        try{
            //Initiate the payment using Razorpay
            const paymentResponse = instance.orders.create(options);
            console.log("paymentResponse", paymentResponse);

            //Return response
            res.status(200).json({
                success : true,
                courseName : course.courseName,
                courseDescription : course.courseDescription,
                thumbnail : course.thumbnail,
                orderId : paymentResponse.id,
                currency : paymentResponse.currency,
                amount : paymentResponse.amount 
            })

        }catch(err){
            console.log(err);
            res.status(500).json({
                success : false,
                message : "Could not initiate order"
            })
        }
    }catch(err) {
         console.log("Error occoured while payment", err);
            res.status(500).json({
                success : false,
                message : err.message
            })
    }
}